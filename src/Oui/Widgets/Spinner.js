import Widget from "./Widget";

/**
 * A number input with an increase and decrease button.
 */
class Spinner extends Widget {
    /**
     * Construct a spinner widget. The number of decimal places is set to the number of decimals of either the default value, or the step size whichever has more decimal places.
     * @param {number} [value] The default value of the spinner. 
     * @param {number} [step] The step size with which the spinner increases and decreases the value.
     * @param {import("./Widget").onChangeCallback} [onChange] Callback for when the spinner value changes. The callback's parameter is the new spinner value as a number.
     */
    constructor(value = 0, step = 1, onChange = null) {
        super();

        this._type = "spinner";
        this._value = Number(value);
        this._step = Number(step);
        this._decimals = Math.max(this.countDecimals(this._step), this.countDecimals(this._value));
        this._name = this._type + "-" + this._name;
        this._height = 13;
        this._onChange = onChange;
    }

    /**
     * Set the on change callback.
     * @param {import("./Widget").onChangeCallback} onChange 
     */
    setOnChange(onChange) {
        this._onChange = onChange;
    }

    /**
     * Get the number of decimal places that the spinner displays.
     * @return {number}
     */
    getDecimalPlaces() {
        return this._decimals;
    }

    /**
     * Set the number of decimal places that the spinner displays.
     * @param {*} decimals 
     */
    setDecimalPlaces(decimals) {
        this._decimals = decimals;
        this.requestSync();
    }

    /**
     * Get the spinner value
     * @returns {number}
     */
    getValue() {
        return this._value;
    }

    /**
     * Set the spinner value.
     * @param {number} value 
     */
    setValue(value) {
        this._value = value;
        this.requestSync();
    }

    /**
     * Get the step size that the spinner value increases and decreases by.
     * @return {number}
     */
    getStep() {
        return this._step;
    }

    /**
     * Set the step size that the spinner value increases and decreases by.
     * @param {number} step 
     */
    setStep(step) {
        this._step = step;
        this.requestSync();
    }

    /**
     * Get the amount of decimal places of a value.
     * @param {number} val 
     */
    countDecimals(val) {
        if ((val % 1) != 0)
            return val.toString().split(".")[1].length;
        return 0;
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.text = this._value.toFixed(this._decimals);
        desc.onIncrement = () => {
            this._value += this._step;
            this._value = Number(this._value.toFixed(this._decimals));
            if (this._onChange)
                this._onChange.call(this, this._value);
            this.requestSync();
        };
        desc.onDecrement = () => {
            this._value -= this._step;
            this._value = Number(this._value.toFixed(this._decimals));
            if (this._onChange)
                this._onChange.call(this, this._value);
            this.requestSync();
        };
        desc.isChecked = this._isChecked;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

export default Spinner;