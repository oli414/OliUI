import Widget from "./Widget";

class Button extends Widget {
    constructor(text = "", onClick) {
        super();

        this._type = "button";
        this._text = text;
        this._name = this._type + "-" + this._name;
        this._height = 10;
        this._onClick = onClick;
    }

    getDescription() {
        let desc = super.getDescription();
        desc.text = this._text;
        desc.onClick = () => { this._onClick(); };
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
        handle.onClick = desc.onClick;
    }
}

export default Button;