

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
        let window = this.getWindow()
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

export default Element;