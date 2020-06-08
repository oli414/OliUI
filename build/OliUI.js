/**
 * The element class is the base class for all UI elements.
 */
class Element {
    constructor() {
        this._parent = null;

        this._marginTop = 0;
        this._marginBottom = 2;
        this._marginLeft = 0;
        this._marginRight = 0;

        this._x = 0;
        this._y = 0;

        this._width = 100;
        this._height = 0;
        this._hasRelativeWidth = true;
        this._hasRelativeHeight = false;
        this._isRemainingFiller = false;

        this._requireSync = false;
    }

    /**
     * Get the width of this element in pixels. For elements with a relative width the calculated width based on the element's parent is used.
     * @returns {number} The calculated width in pixels.
     */
    getPixelWidth() {
        if (this._parent == null) {
            return this._width;
        }
        else if (this._isRemainingFiller && this._parent._isHorizontal) {
            return this._parent.getRemainingWidth();
        }
        else if (this._hasRelativeWidth) {
            if (!this._parent._isHorizontal) {
                return this._parent.getContentWidth() / 100 * this._width;
            }
            else {
                return (this._parent.getContentWidth() - this._parent.getTotalChildMarginWidths()) / 100 * this._width;
            }
        }
        else {
            return this._width;
        }
    }

    /**
     * Set the element's width in pixels.
     * @param {number} width The new width in pixels. 
     */
    setWidth(width) {
        this._width = width;
        this._hasRelativeWidth = false;
        this.onDimensionsChanged();
    }

    /**
     * Get the height of this element in pixels. For elements with a relative height the calculated height based on the element's parent is used.
     * @returns {number} The calculated height in pixels.
     */
    getPixelHeight() {
        if (this._parent == null) {
            return this._height;
        }
        else if (this._isRemainingFiller && !this._parent._isHorizontal) {
            return this._parent.getRemainingHeight();
        }
        else if (this._hasRelativeHeight) {
            if (!this._parent._isHorizontal) {
                return (this._parent.getContentHeight() - this._parent.getTotalChildMarginHeights()) / 100 * this._height;
            }
            else {
                return this._parent.getContentHeight() / 100 * this._height;
            }
        }
        else {
            return this._height;
        }
    }

    /**
     * Set the element's height in pixels.
     * @param {number} height The new height in pixels. 
     */
    setHeight(height) {
        this._height = height;
        this._hasRelativeHeight = false;
        this.onDimensionsChanged();
    }

    /**
     * Get the relative width as a percentage. 
     * If the element does not have a relative width the relative width is calculated using the real width of the parent.
     * @returns The width as a percentage relative to the parent.
     */
    getRelativeWidth() {
        if (this._hasRelativeWidth) {
            return this._width;
        }
        else {
            if (this._parent != null) {
                return this._width / this._parent.getContentWidth() * 100;
            }
            throw new Error("The relative width could not be calculated since this element does not have a parent");
        }
    }

    /**
     * Set the relative width as a percentage.
     * @param {number} percentage The width as a percentage.
     */
    setRelativeWidth(percentage) {
        this._width = percentage;
        this._hasRelativeWidth = true;
        this.onDimensionsChanged();
    }


    /**
     * Get the relative height as a percentage. 
     * If the element does not have a relative height the relative height is calculated using the real height of the parent.
     * @returns The height as a percentage relative to the parent.
     */
    getRelativeHeight() {
        if (this._hasRelativeHeight) {
            return this._height;
        }
        else {
            if (this._parent != null) {
                return this._height / this._parent.getContentHeight() * 100;
            }
            throw new Error("The relative height could not be calculated since this element does not have a parent");
        }
    }

    /**
     * Set the relative height as a percentage.
     * @param {number} percentage The height as a percentage.
     */
    setRelativeHeight(percentage) {
        this._height = percentage;
        this._hasRelativeHeight = true;
        this.onDimensionsChanged();
    }

    /**
     * @typedef {Object} Margins The spacing outside of the element.
     * @property {number} top       - The margin at the top of the element.
     * @property {number} bottom    - The margin at the bottom of the element.
     * @property {number} left      - The left side margin of the element.
     * @property {number} right     - The right side margin of the element.
     */

    /**
     * Get the margins (spacing outside of the element) on this element.
     * @returns {Margins} The margins for each side of the element.
     */
    getMargins() {
        return {
            top: this._marginTop,
            bottom: this._marginBottom,
            left: this._marginLeft,
            right: this._marginRight
        }
    }

    /**
     * Set the margins (spacing outside of the element).
     * @param {*} top The margin at the top of the element.
     * @param {*} bottom The margin at the bottom of the element.
     * @param {*} left The left side margin of the element.
     * @param {*} right The right side margin of the element.
     */
    setMargins(top, bottom, left, right) {
        this._marginTop = top;
        this._marginBottom = bottom;
        this._marginLeft = left;
        this._marginRight = right;
    }

    /**
     * Get the reference to the window at the root of the window tree.
     * @returns {Window|null} Reference to the window. Can be null if the element or its parents aren't part of a window.
     */
    getWindow() {
        if (this._parent == null)
            return null;
        return this._parent.getWindow();
    }

    /**
     * Request a synchronization with the real widgets. 
     * Values on this element and its children will be applied to the OpenRCT2 Plugin API UI widgets. 
     * The synchronization is performed at the next window update.
     */
    requestSync() {
        let window = this.getWindow();
        if (window != null && window.isOpen()) {
            this._requireSync = true;
        }
    }

    /**
     * Check if this element, or one of its parents has requested a synchronization update.
     * @returns {boolean} True if this element, or one of its parents has requested a synchronization update.
     */
    requiresSync() {
        if (this._parent != null) {
            return this._requireSync || this._parent.requiresSync();
        }
        return this._requireSync;
    }

    /**
     * Update the dimensions of this element recursively and request for the OpenRCT2 Plugin API UI widgets to be updated.
     */
    onDimensionsChanged() {
        if (this._parent != null) {
            this._parent._updateChildDimensions();
        }
        this.requestSync();
    }

    _getDescription() {
        return null;
    }

    _update() {
        this._requireSync = false;
    }

    _getWindowPixelPosition() {
        if (this._parent) {
            let pos = this._parent._getWindowPixelPosition();
            pos.x += this._x;
            pos.y += this._y;
            return pos;
        }
        else {
            return { x: this._x, y: this._y };
        }
    }
}

/**
 * The box class is the base class for UI elements that is able to hold children.
 * @extends Element
 */
class Box extends Element {
    constructor() {
        super();

        this._width = 100;

        this.setPadding(3, 3, 4, 4);

        this._isHorizontal = false;

        this._children = [];
    }

    /**
     * Add a child to this box.
     * @param {Element} child The element to add as a child.
     */
    addChild(child) {
        this._children.push(child);
        child._parent = this;

        this._updateChildDimensions();
    }

    /**
     * Get the inner width of this box in pixels. The inner width is calculated by taking the width in pixels minus the paddings.
     * @returns {number} The inner width in pixels.
     */
    getContentWidth() {
        return this.getPixelWidth() - this._paddingLeft - this._paddingRight;
    }

    /**
     * Get the inner height of this box in pixels. The inner height is calculated by taking the height in pixels minus the paddings.
     * @returns {number} The inner width in pixels.
     */
    getContentHeight() {
        return this.getPixelHeight() - this._paddingTop - this._paddingBottom;
    }


    /**
     * @typedef {Object} Padding The spacing inside of the element.
     * @property {number} top       - The padding at the top of the element.
     * @property {number} bottom    - The padding at the bottom of the element.
     * @property {number} left      - The left side padding of the element.
     * @property {number} right     - The right side padding of the element.
     */

    /**
     * Get the padding (spacing inside of the element) on this element.
     * @returns { Padding } The padding for each side of the element.
     */
    getPadding() {
        return {
            top: this._paddingTop,
            bottom: this._paddingBottom,
            left: this._paddingLeft,
            right: this._paddingRight
        }
    }

    /**
     * Set the padding (spacing inside of the element).
     * @param {*} top The margin at the top of the element.
     * @param {*} bottom The margin at the bottom of the element.
     * @param {*} left The left side margin of the element.
     * @param {*} right The right side margin of the element.
     */
    setPadding(top, bottom, left, right) {
        this._paddingTop = top;
        this._paddingBottom = bottom;
        this._paddingLeft = left;
        this._paddingRight = right;
    }

    onDimensionsChanged() {
        this._updateChildDimensions();
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (child._hasRelativeWidth || child._hasRelativeHeight) {
                child.onDimensionsChanged();
            }
        }
        super.onDimensionsChanged();
    }

    /**
     * Calculate the total width of all the margins of the children that are used between the child elements.
     */
    getTotalChildMarginWidths() {
        let width = 0;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (i < this._children.length - 1) {
                width += Math.max(child._marginRight, this._children[i + 1]._marginLeft);
            }
        }
        return width;
    }

    /**
     * Calculate the total height of all the margins of the children that are used between the child elements.
     */
    getTotalChildMarginHeights() {
        let height = 0;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (i < this._children.length - 1) {
                height += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
            }
        }
        return height;
    }

    _updateChildDimensions() {

    }

    _getDescription() {
        let fullDesc = [];
        for (let i = 0; i < this._children.length; i++) {
            let rDesc = this._children[i]._getDescription();
            if (rDesc != null) {
                if (Array.isArray(rDesc)) {
                    fullDesc = fullDesc.concat(rDesc);
                }
                else {
                    fullDesc.push(rDesc);
                }
            }
        }
        return fullDesc;
    }

    _update() {
        for (let i = 0; i < this._children.length; i++) {
            this._children[i]._update();
        }
        this._requireSync = false;
    }
}

/**
 * The vertical box is an element that holds children and positions them vertically in a top to bottom fasion.
 */
class VerticalBox extends Box {
    constructor() {
        super();

        this._remainingHeightFiller = null;
    }

    addChild(child) {
        super.addChild(child);
        if (child._hasRelativeHeight) {
            child.onDimensionsChanged();
        }
    }

    /**
     * Calculate the left over vertical space.
     * @returns {number} The remaining vertical space in pixels.
     */
    getRemainingHeight() {
        let height = 0;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (!child._isRemainingFiller)
                height += child.getPixelHeight();

            if (i < this._children.length - 1) {
                height += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
            }
        }
        return this.getContentHeight() - height;
    }

    /**
     * Set a child element to take up the remaining vertical space.
     * @param {Element} child Reference to an element to fill the remaining vertical space. This element has to be a child of the box. 
     */
    setRemainingHeightFiller(child) {
        if (this._children.indexOf(child) < 0) {
            throw new Error("The remaining height filler has to be a child of this element.");
        }
        if (this._remainingHeightFiller != null) {
            this._remainingHeightFiller._isRemainingFiller = false;
        }
        this._remainingHeightFiller = child;
        child._isRemainingFiller = true;
        this._updateChildDimensions();
        child.onDimensionsChanged();
    }

    _updateChildDimensions() {
        let yPos = this._paddingTop;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            child._x = this._paddingLeft;
            child._y = yPos;
            yPos += child.getPixelHeight();

            if (i < this._children.length - 1) {
                yPos += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
            }
        }

        if (!this._hasRelativeHeight && yPos + this._paddingBottom > this._height) {
            this.setHeight(yPos + this._paddingBottom);
        }
    }
}

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

    getWindow() {
        return this;
    }

    _getDescription() {
        let widgets = super._getDescription();

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
                this._update();
            }
        }
    }

    _update() {
        if (this._handle.width != this._width || this._handle.height != this._height) {
            this.setWidth(this._handle.width);
            this.setHeight(this._handle.height);
        }
        super._update();
        this._requireSync = false;
    }
}

/**
 * The horizontal box is an element that holds children and positions them horizontally in a left to right fasion.
 */
class HorizontalBox extends Box {
    constructor() {
        super();

        this._remainingWidthFiller = null;
        this._isHorizontal = true;
    }

    addChild(child) {
        super.addChild(child);
        if (child._hasRelativeWidth) {
            child.onDimensionsChanged();
        }
    }

    /**
     * Calculate the left over horizontal space.
     * @returns {number} The remaining horizontal space in pixels.
     */
    getRemainingWidth() {
        let width = 0;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (!child._isRemainingFiller)
                width += child.getPixelWidth();

            if (i < this._children.length - 1) {
                width += Math.max(child._marginRight, this._children[i + 1]._marginLeft);
            }
        }
        return this.getContentWidth() - width;
    }

    /**
     * Set a child element to take up the remaining horizontal space.
     * @param {Element} child Reference to an element to fill the remaining horizontal space. This element has to be a child of the box. 
     */
    setRemainingWidthFiller(child) {
        if (this._children.indexOf(child) < 0) {
            throw new Error("The remaining width filler has to be a child of this element.");
        }
        if (this._remainingWidthFiller != null) {
            this._remainingWidthFiller._isRemainingFiller = false;
        }
        this._remainingWidthFiller = child;
        child._isRemainingFiller = true;
        this._updateChildDimensions();
        child.onDimensionsChanged();
    }

    _updateChildDimensions() {
        let xPos = this._paddingLeft;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            child._x = xPos;
            child._y = this._paddingTop;
            xPos += child.getPixelWidth();

            if (i < this._children.length - 1) {
                xPos += Math.max(child._marginRight, this._children[i + 1]._marginLeft);
            }
        }

        if (!this._hasRelativeWidth && xPos + this._paddingRight > this._width) {
            this.setWidth(xPos + this._paddingRight);
        }
    }
}

let numberCount = 0;
function NumberGen() {
    numberCount++;
    return numberCount - 1;
}

/**
 * This callback is called when a widget is click.
 * @callback onClickCallback
 */

/**
 * This callback is called when the value on an input widget has changed.
 * @callback onChangeCallback
 * @param {*} value The new value of the input widget.
 */

/**
 * The widget base class that wraps around the OpenRCT2 Plugin API UI widgets, and is mostly used for input widgets and labels.
 * @extends Element
 */
class Widget extends Element {
    constructor() {
        super();

        this.setMargins(2, 4, 2, 2);
        this._type = "none";
        this._name = NumberGen();
    }

    /**
     * Get the reference to the OpenRCT2 Plugin API UI widget.
     * @returns {Widget} Reference to an OpenRCT2 Plugin API UI widget.
     */
    getHandle() {
        let window = this.getWindow();
        if (window != null) {
            return window._handle.findWidget(this._name);
        }
        return null;
    }

    _getDescription() {
        let calcPos = this._getWindowPixelPosition();
        return {
            type: this._type,
            name: this._name,
            x: calcPos.x,
            y: calcPos.y,
            width: this.getPixelWidth(),
            height: this.getPixelHeight()
        }
    }

    _update() {
        if (this.requiresSync()) {
            let handle = this.getHandle();
            let desc = this._getDescription();
            this._applyDescription(handle, desc);
        }
        this._requireSync = false;
    }

    _applyDescription(handle, desc) {
        handle.x = desc.x;
        handle.y = desc.y;
        handle.width = desc.width;
        handle.height = desc.height;
    }
}

Widget.NumberGen = NumberGen;

/**
 * The group box is a vertical box that a border and an optional label.
 */
class GroupBox extends VerticalBox {
    constructor(text = "") {
        super();

        this._text = text;
        this._name = "groupbox-" + Widget.NumberGen();
        if (this._text != "")
            this._paddingTop = 13;
        else
            this._paddingTop = 8;
        this._paddingBottom = 5;
    }

    /**
     * Get the label text of this groupbox.
     * @returns {string}
     */
    getText() {
        return this._text;
    }

    /**
     * Set the groupbox label text. Set to an empty string to remove the label text.
     * @param {string} text
     */
    setText(text) {
        if (Boolean(this._text.length) != Boolean(text.length)) {
            if (text.length == 0) {
                this._paddingTop -= 5;
            }
            else {
                this._paddingTop += 5;
            }
            this.onDimensionsChanged();
        }
        this._text = text;
        this.requestSync();
    }

    /**
     * Get the reference to the OpenRCT2 Plugin API UI widget.
     * @returns {Widget} Reference to an OpenRCT2 Plugin API UI widget.
     */
    getHandle() {
        let window = this.getWindow();
        if (window != null) {
            return window._handle.findWidget(this._name);
        }
        return null;
    }

    _getDescription() {
        let fullDesc = super._getDescription();

        let calcPos = this._getWindowPixelPosition();
        fullDesc.unshift({
            type: "groupbox",
            name: this._name,
            text: this._text,
            x: calcPos.x,
            y: calcPos.y,
            width: this.getPixelWidth(),
            height: this.getPixelHeight()
        });
        return fullDesc;
    }

    _update() {
        if (this.requiresSync()) {
            let handle = this.getHandle();
            let desc = this._getDescription();
            this._applyDescription(handle, desc[0]);
        }
        super._update();
    }

    _applyDescription(handle, desc) {
        handle.x = desc.x;
        handle.y = desc.y;
        handle.width = desc.width;
        handle.height = desc.height;
        handle.text = desc.text;
    }
}

/**
 * A button input that can be clicked.
 */
class Button extends Widget {
    /**
     * @param {string} [text] The button text.
     * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
     */
    constructor(onClick = null) {
        super();

        this._type = "button";
        this._name = this._type + "-" + this._name;
        this._height = 13;
        this._onClick = onClick;
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.onClick = () => { if (this._onClick) this._onClick(); };
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
    }
}

var BaseClasses = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Element: Element,
    Box: Box,
    Widget: Widget,
    Button: Button
});

/**
 * A text label.
 */
class Label extends Widget {
    /**
     * @param {string} text The label text.
     */
    constructor(text = "") {
        super();

        this._type = "label";
        this._text = text;
        this._name = this._type + "-" + this._name;
        this._height = 10;
    }

    /**
     * Get the label text.
     */
    getText() {
        return this._text;
    }

    /**
     * Set the label text.
     * @param {string} text 
     */
    setText(text) {
        this._text = text;
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.text = this._text;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

/**
 * A button input that can be clicked that has a text label.
 */
class TextButton extends Button {
    /**
     * @param {string} [text] The button text.
     * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
     */
    constructor(text = "", onClick = null) {
        super(onClick);
        this._text = text;
    }

    /**
     * Get the button text.
     */
    getText() {
        return this._text;
    }

    /**
     * Set the button text.
     * @param {string} text 
     */
    setText(text) {
        this._text = text;
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.text = this._text;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

/**
 * An image button input that can be clicked.
 */
class ImageButton extends Button {
    /**
     * @param {number} [image] The image index to display.
     * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
     */
    constructor(image = 0, onClick = null) {
        super(onClick);
        this._image = image;
    }

    /**
     * Get the button image index.
     */
    getImage() {
        return this._image;
    }

    /**
     * Set the button image index.
     * @param {number} image The image index to display. 
     */
    setImage(image) {
        this._image = image;
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.image = this.image;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.image = desc.image;
    }
}

/**
 * A checkbox with text behind it.
 */
class Checkbox extends Widget {
    /**
     * @param {*} [text] The text displayed behind the checkbox.
     * @param {import("./Widget").onChangeCallback} [onChange] Callback for when the checkbox is ticked or unticked. The callback's parameter is boolean which is true if the checkbox is checked.
     */
    constructor(text = "", onChange = null) {
        super();

        this._type = "checkbox";
        this._text = text;
        this._name = this._type + "-" + this._name;
        this._height = 10;
        this._onChange = onChange;
        this._isChecked;
    }

    /**
     * Check  if the checkbox is checked.
     * @returns {boolean} True if the checkbox is checked.
     */
    isChecked() {
        return this._isChecked;
    }

    /**
     * Set the state of the checkbox to check or unchecked.
     * @param {boolean} checked True if the checkbox should be checked.
     */
    setChecked(checked) {
        this._isChecked = checked;
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.text = this._text;
        desc.onChange = (checked) => {
            this._isChecked = checked;
            if (this._onChange) this._onChange(checked);
        };
        desc.isChecked = this._isChecked;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

/**
 * A dropdown input field with a set number of items that the user can choose from.
 */
class Dropdown extends Widget {
    /**
     * @param {string[]} [items] String list with all the items to display in the dropdown.
     * @param {import("./Widget").onChangeCallback} [onChange] Callback for when a dropdown item is selected. The callback's parameter is the index to the item that was selected.
     */
    constructor(items = [], onChange = null) {
        super();

        this._type = "dropdown";
        this._name = this._type + "-" + this._name;
        this._height = 13;
        this._onChange = onChange;
        this._items = items.slice(0);
        this._selectedIndex = 0;
    }

    /**
     * Get a copy of the dropdown items list.
     */
    getItems() {
        return this._items.slice(0);
    }

    /**
     * Set the list of dropdown items.
     * @param {string[]} items List of all the items to display.
     */
    setItems(items) {
        this._items = items.slice(0);
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.items = this._items;
        desc.onChange = (i) => {
            this._selectedIndex = i;
            if (this._onChange) this._onChange(i);
        };
        desc.selectedIndex = this._selectedIndex;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.items = desc.items;
        desc.selectedIndex = desc.selectedIndex;
    }
}

/**
 * A number input with an increase and decrease button.
 */
class Spinner extends Widget {
    /**
     * Construct a spinner widget. The number of decimal places is set to the number of decimals of either the default value, or the step size whichever has more decimal places.
     * @param {number} [value] The default value of the spinner. 
     * @param {number} [step] The step size with which the spinner increases and decreases the value.
     * @param {import("./Widget").onChangeCallback} [onChange] Callback for when the spinner value changes. The callback's parameter is the new spinner value as a number.
     */
    constructor(value = 0, step = 1, onChange = null) {
        super();

        this._type = "spinner";
        this._value = Number(value);
        this._step = Number(step);
        this._decimals = Math.max(this.countDecimals(this._step), this.countDecimals(this._value));
        this._name = this._type + "-" + this._name;
        this._height = 13;
        this._onChange = onChange;
    }

    /**
     * Get the number of decimal places that the spinner displays.
     * @return {number}
     */
    getDecimalPlaces() {
        return this._decimals;
    }

    /**
     * Set the number of decimal places that the spinner displays.
     * @param {*} decimals 
     */
    setDecimalPlaces(decimals) {
        this._decimals = decimals;
        this.requestSync();
    }

    /**
     * Get the spinner value
     * @returns {number}
     */
    getValue() {
        return this._value;
    }

    /**
     * Set the spinner value.
     * @param {number} value 
     */
    setValue(value) {
        this._value = value;
        this.requestSync();
    }

    /**
     * Get the step size that the spinner value increases and decreases by.
     * @return {number}
     */
    getStep() {
        return this._step;
    }

    /**
     * Set the step size that the spinner value increases and decreases by.
     * @param {number} step 
     */
    setStep(step) {
        this._step = step;
        this.requestSync();
    }

    /**
     * Get the amount of decimal places of a value.
     * @param {number} val 
     */
    countDecimals(val) {
        if ((val % 1) != 0)
            return val.toString().split(".")[1].length;
        return 0;
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.text = this._value.toFixed(this._decimals);
        desc.onIncrement = () => {
            this._value += this._step;
            this._value = Number(this._value.toFixed(this._decimals));
            if (this._onChange) this._onChange(this._value);
            this.requestSync();
        };
        desc.onDecrement = () => {
            this._value -= this._step;
            this._value = Number(this._value.toFixed(this._decimals));
            if (this._onChange) this._onChange(this._value);
            this.requestSync();
        };
        desc.isChecked = this._isChecked;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Label: Label,
    TextButton: TextButton,
    ImageButton: ImageButton,
    Checkbox: Checkbox,
    Dropdown: Dropdown,
    Spinner: Spinner,
    Button: Button
});

var Oui = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BaseClasses: BaseClasses,
    Widgets: index,
    Window: Window,
    VerticalBox: VerticalBox,
    HorizontalBox: HorizontalBox,
    GroupBox: GroupBox
});

export default Oui;
