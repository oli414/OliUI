import VerticalBox from "./VerticalBox";

class Window extends VerticalBox {
    constructor(title = "") {
        super();
        this._hasRelativeWidth = false;
        this._width = 100;

        this._height = this._paddingTop + this._paddingBottom;

        this._handle = null;

        this._title = title;
        this._classification = "park";

        this._canResizeHorizontally = false;
        this._minWidth = 100;
        this._maxWidth = 100;
        this._canResizeVertically = false;
        this._minHeight = 100;
        this._maxHeight = 100;
    }

    open() {
        this._handle = ui.openWindow(this.getDescription());
    }

    isOpen() {
        return this._handle != null;
    }

    getDescription() {
        let widgets = super.getDescription();

        return {
            classification: this._classification,
            width: this._width,
            height: this._height,
            minWidth: this._minWidth,
            maxWidth: this._maxWidth,
            minHeight: this._minHeight,
            maxHeight: this._maxHeight,
            title: this._title,
            widgets: widgets,
            onUpdate: () => {
                this.update();
            }
        }
    }

    getWindow() {
        return this;
    }

    setHorizontalResize(canResizeHorizontally, minWidth, maxWidth) {
        this._canResizeHorizontally = canResizeHorizontally;
        if (canResizeHorizontally) {
            this._minWidth = minWidth;
            this._maxWidth = maxWidth;
        }
        else {
            this._minWidth = this._width;
            this._maxWidth = this._width;
        }
    }

    setVerticalResize(canResizeVertically, minHeight, maxHeight) {
        this._canResizeVertically = canResizeVertically;
        if (canResizeVertically) {
            this._minHeight = minHeight;
            this._maxHeight = maxHeight;
        }
        else {
            this._minHeight = this._height;
            this._maxHeight = this._height;
        }
    }

    setAbsoluteWidth(pixels) {
        if (this.isOpen()) {
            this._handle.width = pixels;
        }
        super.setAbsoluteWidth(pixels);
        if (!this._canResizeHorizontally) {
            this._minWidth = this._width;
            this._maxWidth = this._width;
        }
    }

    setAbsoluteHeight(pixels) {
        if (pixels < 16)
            pixels = 16;
        if (this.isOpen()) {
            this._handle.height = pixels;
        }
        super.setAbsoluteHeight(pixels);
        if (!this._canResizeVertically) {
            this._minHeight = this._height;
            this._maxHeight = this._height;
        }
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
    }

    update() {
        if (this._handle.width != this._width || this._handle.height != this._height) {
            this.setAbsoluteWidth(this._handle.width);
            this.setAbsoluteHeight(this._handle.height);
        }
        super.update();
        this._requireSync = false;
    }
}

export default Window;