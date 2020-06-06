import Widget from "./Widget";

class Checkbox extends Widget {
    constructor(text = "", onChange = null) {
        super();

        this._type = "checkbox";
        this._text = text;
        this._name = this._type + "-" + this._name;
        this._height = 10;
        this._onChange = onChange;
        this._isChecked;
    }

    setIsChecked(checked) {
        this._isChecked = checked;
        this.requestSync();
    }

    getDescription() {
        let desc = super.getDescription();
        desc.text = this._text;
        desc.onChange = (checked) => {
            this._isChecked = checked;
            if (this._onChange) this._onChange(checked);
        };
        desc.isChecked = this._isChecked;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.onChange = desc.onChange;
        handle.text = desc.text;
    }
}

export default Checkbox;