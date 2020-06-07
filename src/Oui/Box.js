import Element from "./Element";

class Box extends Element {
    constructor() {
        super();

        this._width = 100;

        this.setPadding(3, 3, 4, 4);

        this._isHorizontal = false;

        this._children = [];
    }

    addChild(child) {
        this._children.push(child);
        child._parent = this;

        this._updateChildDimensions();
    }

    getContentWidth() {
        return this.getPixelWidth() - this._paddingLeft - this._paddingRight;
    }

    getContentHeight() {
        return this.getPixelHeight() - this._paddingTop - this._paddingBottom;
    }

    getMargins() {
        return {
            top: this._paddingTop,
            bottom: this._paddingBottom,
            left: this._paddingLeft,
            right: this._paddingRight
        }
    }

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

export default Box;
