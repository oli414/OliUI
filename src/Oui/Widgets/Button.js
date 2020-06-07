import Widget from "./Widget";

class Button extends Widget {
    constructor(text = "", onClick = null) {
        super();

        this._type = "button";
        this._text = text;
        this._name = this._type + "-" + this._name;
        this._height = 13;
        this._onClick = onClick;
    }

    getText() {
        return this._text;
    }

    setText(text) {
        this._text = text;
        this.requestSync();
    }

    getDescription() {
        let desc = super.getDescription();
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