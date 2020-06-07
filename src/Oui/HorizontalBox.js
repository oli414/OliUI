import Box from "./Box";

class HorizontalBox extends Box {
    constructor() {
        super();

        this._remainingWidthFiller = null;
        this._isHorizontal = true;
    }

    addChild(child) {
        super.addChild(child);
        this.updateChildDimensions();
        if (child._hasRelativeWidth) {
            child.onDimensionsChanged();
        }
    }

    updateChildDimensions() {
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

    setRemainingWidthFiller(child) {
        if (this._children.indexOf(child) < 0) {
            throw new Error("The remaining width filler has to be a child of this element.");
        }
        if (this._remainingWidthFiller != null) {
            this._remainingWidthFiller._isRemainingFiller = false;
        }
        this._remainingWidthFiller = child;
        child._isRemainingFiller = true;
        this.updateChildDimensions();
        child.onDimensionsChanged();
    }
}

export default HorizontalBox;
