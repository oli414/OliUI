import Widget from "./Widget";

/**
 * A button input that can be clicked.
 */
class Button extends Widget {
    /**
     * @param {string} [text] The button text.
     * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
     */
    constructor(onClick = null) {
        super();

        this._type = "button";
        this._name = this._type + "-" + this._name;
        this._height = 13;
        this._onClick = onClick;
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.onClick = () => { if (this._onClick) this._onClick(); };
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
    }
}

export default Button;