import Button from "./Button";

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
        this._hasBorder = false;
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
        desc.image = this._image;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.image = desc.image;
    }
}

export default ImageButton;