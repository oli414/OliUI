import VerticalBox from "./VerticalBox";

/**
 * A window that can hold elements.
 */
class Window extends VerticalBox {
    /**
     * @param {string} classification A custom unique "type" identifier to identify the window's classification by. This is used to manage multiple instances of the same kind of windows.
     * @param {string} [title] The window title that is displayed in the window's top bar.
     */
    constructor(classification, title = "") {
        super();
        this._hasRelativeWidth = false;
        this._width = 100;

        this._height = this._paddingTop + this._paddingBottom;

        this._handle = null;

        this._title = title;
        this._classification = classification;

        this._canResizeHorizontally = false;
        this._minWidth = 100;
        this._maxWidth = 100;
        this._canResizeVertically = false;
        this._minHeight = 100;
        this._maxHeight = 100;

        this._titleBarColor = 1;
        this._mainColor = 1;

        this._requestedRefresh = false;
        this._openAtPosition = false;

        this._onUpdate = null;
        this._onClose = null;
    }

    /**
     * Set the window title.
     * @param {string} title 
     */
    setTitle(title) {
        this._title = title;
        this.requestRefresh();
    }

    /**
     * Get the window title.
     * @returns {string}
     */
    getTitle() {
        return this._title;
    }

    /**
     * Get the main window color.
     * @returns {number}
     */
    getMainColor() {
        return this._mainColor;
    }

    /**
     * Get the title bar color.
     * @returns {number}
     */
    getTitleBarColor() {
        return this._titleBarColor;
    }

    /**
     * Set the window colors. The title bar color is usually the same as the main color unless it is a window with tabs.
     * @param {number} mainColor 
     * @param {number} [titleBarColor] Optional, the main color will be used for the title bar if not present.
     */
    setColors(mainColor, titleBarColor = -1) {
        this._mainColor = mainColor;
        if (titleBarColor < 0) {
            this._titleBarColor = mainColor;
        }
        else {
            this._titleBarColor = titleBarColor;
        }
        this.requestRefresh();
    }

    /**
     * Set the on update callback.
     */
    setOnUpdate(onUpdate) {
        this._onUpdate = onUpdate;
    }

    /**
     * Set the on update callback.
     */
    setOnClose(onClose) {
        this._onClose = onClose;
    }

    /**
     * Open the window.
     */
    open() {
        let desc = this._getDescription();
        this._handle = ui.openWindow(desc);
    }

    /**
     * Check if the window is open.
     * @returns {boolean} True if the window is open.
     */
    isOpen() {
        return this._handle != null;
    }

    requestRefresh() {
        // Refreshes are only needed when the window is open.
        if (this.isOpen()) {
            this._requestedRefresh = true;
        }
    }

    /**
     * Enable or disable the window's horizontal resizeability.
     * @param {boolean} canResizeHorizontally Wether or not the window should be set to be resizeable.
     * @param {number} [minWidth] The minimum width that the window can resize to. Should be lower or equal to the width of the window.
     * @param {number} [maxWidth] The maximum width that the window can resize to. Should be higher or equal to the width of the window.
     */
    setHorizontalResize(canResizeHorizontally, minWidth = 0, maxWidth = 0) {
        this._canResizeHorizontally = canResizeHorizontally;
        if (canResizeHorizontally) {
            this._minWidth = minWidth;
            this._maxWidth = maxWidth;
            if (minWidth == 0) {
                this._minWidth = this._width;
            }
            if (maxWidth == 0) {
                this._minWidth = this._width;
            }
        }
        else {
            this._minWidth = this._width;
            this._maxWidth = this._width;
        }
        this.requestSync();
    }

    /**
     * Enable or disable the window's vertical resizeability.
     * @param {boolean} canResizeHorizontally Wether or not the window should be set to be resizeable.
     * @param {number} [minHeight] The minimum height that the window can resize to. Should be lower or equal to the height of the window.
     * @param {number} [maxHeight] The maximum height that the window can resize to. Should be higher or equal to the height of the window.
     */
    setVerticalResize(canResizeVertically, minHeight = 0, maxHeight = 0) {
        this._canResizeVertically = canResizeVertically;
        if (canResizeVertically) {
            this._minHeight = minHeight;
            this._maxHeight = maxHeight;
            if (minHeight == 0) {
                this._minHeight = this._height;
            }
            if (maxHeight == 0) {
                this._maxHeight = this._height;
            }
        }
        else {
            this._minHeight = this._height;
            this._maxHeight = this._height;
        }
        this.requestSync();
    }

    setWidth(pixels) {
        if (this.isOpen()) {
            this._handle.width = pixels;
        }
        super.setWidth(pixels);
        if (!this._canResizeHorizontally) {
            this._minWidth = this._width;
            this._maxWidth = this._width;
        }
        this.requestRefresh();
    }

    setHeight(pixels) {
        if (pixels < 16)
            pixels = 16;
        if (this.isOpen()) {
            this._handle.height = pixels;
        }
        super.setHeight(pixels);
        if (!this._canResizeVertically) {
            this._minHeight = this._height;
            this._maxHeight = this._height;
        }
        this.requestRefresh();
    }

    getPixelWidth() {
        return this._width;
    }

    getPixelHeight() {
        return this._height;
    }

    setPadding(top, bottom, left, right) {
        this._paddingTop = top + 15;
        this._paddingBottom = bottom + 1;
        this._paddingLeft = left;
        this._paddingRight = right;
        this.requestSync();
    }

    getWindow() {
        return this;
    }

    _getDescription() {
        let widgets = super._getDescription();

        let desc = {
            classification: this._classification,
            width: this._width,
            height: this._height,
            minWidth: this._minWidth,
            maxWidth: this._maxWidth,
            minHeight: this._minHeight,
            maxHeight: this._maxHeight,
            title: this._title,
            colours: [
                this._titleBarColor, this._mainColor
            ],
            widgets: widgets,
            onUpdate: () => {
                this._update();
                if (this._onUpdate != null)
                    this._onUpdate.call(this);
            },
            onClose: () => {
                this._handle = null;
                if (this._onClose != null)
                    this._onClose.call(this);
            }
        };
        if (this._openAtPosition) {
            desc.x = this._x;
            desc.y = this._y;
        }

        return desc;
    }

    _applyDescription(handle, desc) {
        handle.width = desc.width;
        handle.height = desc.height;
        handle.minWidth = desc.minWidth;
        handle.maxWidth = desc.maxWidth;
        handle.minHeight = desc.minHeight;
        handle.maxHeight = desc.maxHeight;
        handle.title = desc.title;
        handle.colours[0] = this._titleBarColor;
        handle.colours[1] = this._mainColor;
    }

    _update() {
        if (this._handle.width != this._width || this._handle.height != this._height) {
            this.setWidth(this._handle.width);
            this.setHeight(this._handle.height);
        }
        super._update();

        if (this._requestedRefresh || this._requireSync) {
            let desc = this._getDescription();
            this._applyDescription(this._handle, desc);
            this._requireSync = false;
        }

        if (this._requestedRefresh) {
            this._refresh();
            this._requestedRefresh = false;
        }
    }

    _getWindowPixelPosition() {
        return { x: 0, y: 0 };
    }

    _refresh() {
        this._x = this._handle.x;
        this._y = this._handle.y;

        this._handle.close();
        this._openAtPosition = true;
        this.open();
        this._openAtPosition = false;

        this._requestedRefresh = false;
    }
}

export default Window;