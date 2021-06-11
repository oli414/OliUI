import Box from "./Box";

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
        let highestChild = 0;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (child._updateChildDimensions) {
                child._updateChildDimensions();
            }

            child._x = xPos;
            child._y = this._paddingTop + child._marginTop;
            xPos += child.getPixelWidth();

            if (i < this._children.length - 1) {
                xPos += Math.max(child._marginRight, this._children[i + 1]._marginLeft);
            }

            if (!child._hasRelativeHeight && child.getPixelHeight() > highestChild) {
                highestChild = child.getPixelHeight();
            }
        }

        if (!this._hasRelativeWidth && xPos + this._paddingRight > this._width) {
            this.setWidth(xPos + this._paddingRight);
        }

        if (!this._hasRelativeHeight && highestChild > this._height) {
            this.setHeight(highestChild + this._paddingTop + this._paddingBottom);
        }
    }
}

export default HorizontalBox;
