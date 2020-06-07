import Widget from "./Widget";

class Spinner extends Widget {
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

    getDecimalPlaces() {
        return this._decimals;
    }

    setDecimalPlaces(decimals) {
        this._decimals = decimals;
        this.requestSync();
    }

    getValue() {
        return this._value;
    }

    setValue(value) {
        this._value = value;
        this.requestSync();
    }

    getStep() {
        return this._step;
    }

    setStep(step) {
        this._step = step;
        this.requestSync();
    }

    countDecimals(val) {
        if ((val % 1) != 0)
            return val.toString().split(".")[1].length;
        return 0;
    }

    getDescription() {
        let desc = super.getDescription();
        desc.text = this._value.toFixed(this._decimals);
        desc.onIncrement = () => {
            this._value += this._step;
            if (this._onChange) this._onChange(this._value);
            this.requestSync();
        };
        desc.onDecrement = () => {
            this._value -= this._step;
            if (this._onChange) this._onChange(this._value);
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