import Box from "./Box";

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
            if (child._updateChildDimensions) {
                child._updateChildDimensions();
            }

            child._x = this._paddingLeft + child._marginLeft;
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

export default VerticalBox;
