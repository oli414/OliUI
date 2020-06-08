import Element from "./Element";

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

export default Box;
