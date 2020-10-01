import Widget from "./Widget";

/**
 * A text label.
 */
class Label extends Widget {
    /**
     * @param {string} text The label text.
     */
    constructor(text = "") {
        super();

        this._type = "label";
        this._text = text;
        this._name = this._type + "-" + this._name;
        this._height = 12;
    }

    /**
     * Get the label text.
     */
    getText() {
        return this._text;
    }

    /**
     * Set the label text.
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

export default Label;