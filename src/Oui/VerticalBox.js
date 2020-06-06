import Box from "./Box";

class VerticalBox extends Box {
    constructor() {
        super();

        this._remainingHeightFiller = null;
    }

    addChild(child) {
        super.addChild(child);
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

            if (i < this._children.length - 1) {
                yPos += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
            }
        }

        if (!this._hasRelativeHeight && yPos + this._paddingBottom > this._height) {
            this.setAbsoluteHeight(yPos + this._paddingBottom);
        }
    }

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

    setRemainingHeightFiller(child) {
        if (this._children.indexOf(child) < 0) {
            throw new Error("The remaining height filler has to be a child of this element.");
        }
        if (this._remainingHeightFiller != null) {
            this._remainingHeightFiller._isRemainingFiller = false;
        }
        this._remainingHeightFiller = child;
        child._isRemainingFiller = true;
        this.updateChildDimensions();
        child.onDimensionsChanged();
    }
}

export default VerticalBox;
