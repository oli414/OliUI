import Button from "./Button";

/**
 * A button input that can be clicked that has a text label.
 */
class TextButton extends Button {
    /**
     * @param {string} [text] The button text.
     * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
     */
    constructor(text = "", onClick = null) {
        super(onClick);
        this._text = text;
    }

    /**
     * Get the button text.
     */
    getText() {
        return this._text;
    }

    /**
     * Set the button text.
     * @param {string} text 
     */
    setText(text) {
        this._text = text;
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.text = this._text;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

export default TextButton;