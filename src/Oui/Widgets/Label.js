import Widget from "./Widget";

class Label extends Widget {
    constructor(text = "") {
        super();

        this._type = "label";
        this._text = text;
        this._name = this._type + "-" + this._name;
        this._height = 10;
    }

    getDescription() {
        let desc = super.getDescription();
        desc.text = this._text;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

export default Label;