import Widget from "./Widget";

/**
 * A button input that can be clicked.
 */
class Button extends Widget {
    /**
     * @param {string} [text] The button text.
     * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
     */
    constructor(text = "", onClick = null) {
        super();

        this._type = "button";
        this._text = text;
        this._name = this._type + "-" + this._name;
        this._height = 13;
        this._onClick = onClick;
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
        desc.onClick = () => { if (this._onClick) this._onClick(); };
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

export default Button;