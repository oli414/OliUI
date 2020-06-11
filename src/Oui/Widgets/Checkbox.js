import Widget from "./Widget";

/**
 * A checkbox with text behind it.
 */
class Checkbox extends Widget {
    /**
     * @param {*} [text] The text displayed behind the checkbox.
     * @param {import("./Widget").onChangeCallback} [onChange] Callback for when the checkbox is ticked or unticked. The callback's parameter is boolean which is true if the checkbox is checked.
     */
    constructor(text = "", onChange = null) {
        super();

        this._type = "checkbox";
        this._text = text;
        this._name = this._type + "-" + this._name;
        this._height = 10;
        this._onChange = onChange;
        this._isChecked = false;
    }

    /**
     * Set the on change callback.
     * @param {import("./Widget").onChangeCallback} onChange 
     */
    setOnChange(onChange) {
        this._onChange = onChange;
    }

    /**
     * Check  if the checkbox is checked.
     * @returns {boolean} True if the checkbox is checked.
     */
    isChecked() {
        return this._isChecked;
    }

    /**
     * Set the state of the checkbox to check or unchecked.
     * @param {boolean} checked True if the checkbox should be checked.
     */
    setChecked(checked) {
        this._isChecked = checked;
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.text = this._text;

        desc.onChange = (checked) => {
            this._isChecked = checked;
            if (this._onChange)
                this._onChange.call(this, checked);
        };
        desc.isChecked = this._isChecked;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

export default Checkbox;