import Element from "./Element";

class Box extends Element {
    constructor() {
        super();

        this._width = 100;

        this.setPadding(3, 3, 4, 4);

        this._children = [];
        this._remainingHeightFiller = null;
    }

    addChild(child) {
        this._children.push(child);
        child._parent = this;

        this.updateChildDimensions();
        if (child._hasRelativeHeight) {
            child.onDimensionsChanged();
        }
    }

    updateChildDimensions() {
        let yPos = this._paddingTop;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            child._x = this._paddingLeft;
            child._y = yPos;
            yPos += child.getPixelHeight();

            // Update the widget if already running

            if (i < this._children.length - 1) {
                yPos += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
            }
        }

        if (!this._hasRelativeHeight && yPos + this._paddingBottom > this._height) {
            this.setAbsoluteHeight(yPos + this._paddingBottom);
        }
    }

    onDimensionsChanged() {
        this.updateChildDimensions();
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (child._hasRelativeWidth || child._hasRelativeHeight) {
                child.onDimensionsChanged();
            }
        }
        super.onDimensionsChanged();
    }

    getContentWidth() {
        return this.getPixelWidth() - this._paddingLeft - this._paddingRight;
    }

    getContentHeight() {
        return this.getPixelHeight() - this._paddingTop - this._paddingBottom;
    }

    getRemainingHeight() {
        let height = 0;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (!child._isRemainingHeightFiller)
                height += child.getPixelHeight();

            if (i < this._children.length - 1) {
                height += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
            }
        }
        return this.getContentHeight() - height;
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

    setRemainingHeightFiller(child) {
        if (this._children.indexOf(child) < 0) {
            throw new Error("The remaining height filler has to be a child of this element.");
        }
        if (this._remainingHeightFiller != null) {
            this._remainingHeightFiller._isRemainingHeightFiller = false;
        }
        child._isRemainingHeightFiller = true;
        this.updateChildDimensions();
        child.onDimensionsChanged();
    }

    setPadding(top, bottom, left, right) {
        this._paddingTop = top;
        this._paddingBottom = bottom;
        this._paddingLeft = left;
        this._paddingRight = right;
    }

    getDescription() {
        let fullDesc = [];
        for (let i = 0; i < this._children.length; i++) {
            let rDesc = this._children[i].getDescription();
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

    update() {
        for (let i = 0; i < this._children.length; i++) {
            this._children[i].update();
        }
        this._requireSync = false;
    }
}

export default Box;
