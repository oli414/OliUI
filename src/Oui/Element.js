

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

    setWidth(pixels) {
        this._width = pixels;
        this._hasRelativeWidth = false;
        this.onDimensionsChanged();
    }

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

    setHeight(pixels) {
        this._height = pixels;
        this._hasRelativeHeight = false;
        this.onDimensionsChanged();
    }

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

    setRelativeWidth(percentage) {
        this._width = percentage;
        this._hasRelativeWidth = true;
        this.onDimensionsChanged();
    }

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

    setRelativeHeight(percentage) {
        this._height = percentage;
        this._hasRelativeHeight = true;
        this.onDimensionsChanged();
    }

    getMargins() {
        return {
            top: this._marginTop,
            bottom: this._marginBottom,
            left: this._marginLeft,
            right: this._marginRight
        }
    }

    setMargins(top, bottom, left, right) {
        this._marginTop = top;
        this._marginBottom = bottom;
        this._marginLeft = left;
        this._marginRight = right;
    }

    getWindow() {
        if (this._parent == null)
            return null;
        return this._parent.getWindow();
    }

    requestSync() {
        let window = this.getWindow()
        if (window != null && window.isOpen()) {
            this._requireSync = true;
        }
    }

    requiresSync() {
        if (this._parent != null) {
            return this._requireSync || this._parent.requiresSync();
        }
        return this._requireSync;
    }

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