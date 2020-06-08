import Widget from "./Widget";

/**
 * A button input that can be clicked.
 */
class Button extends Widget {
    /**
     * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
     */
    constructor(onClick = null) {
        super();

        this._type = "button";
        this._name = this._type + "-" + this._name;
        this._height = 13;
        this._onClick = onClick;
        this._hasBorder = true;
        this._isPressed = false;
    }

    /**
     * Set the on click callback.
     * @param {import("./Widget").onClickCallback} onClick 
     */
    setOnClick(onClick) {
        this._onClick = onClick;
    }

    /**
     * wether or not the button is stuck in a pressed down position (for toggleable buttons).
     * @returns {boolean}
     */
    isPressed() {
        return this._isPressed;
    }

    /**
     * Set wether or not the button is stuck in a pressed down position (for toggleable buttons).
     * @param {boolean} isPressed 
     */
    setIsPressed(isPressed) {
        this._isPressed = isPressed;
        this.requestSync();
    }

    /**
     * Get wether or not the button has a visible border.
     * @returns {boolean}
     */
    hasBorder() {
        return this._hasBorder;
    }

    /**
     * Set wether or not the button has a visible border.
     * @param {boolean} hasBorder 
     */
    setBorder(hasBorder) {
        this._hasBorder = hasBorder;
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.onClick = () => { if (this._onClick) this._onClick(); };
        desc.border = this._hasBorder;
        desc.isPressed = this._isPressed;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.border = desc.border;
        handle.isPressed = this._isPressed;
    }
}

export default Button;