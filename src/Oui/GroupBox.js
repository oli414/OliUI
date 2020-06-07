import VerticalBox from "./VerticalBox";
import Widget from "./Widgets/Widget";

class GroupBox extends VerticalBox {
    constructor(text = "") {
        super();

        this._text = text;
        this._name = "groupbox-" + Widget.NumberGen();
        if (this._text != "")
            this._paddingTop = 13;
        else
            this._paddingTop = 8;
        this._paddingBottom = 5;
    }

    getText() {
        return this._text;
    }

    setText(text) {
        if (Boolean(this._text.length) != Boolean(text.length)) {
            if (text.length == 0) {
                this._paddingTop -= 5;
            }
            else {
                this._paddingTop += 5;
            }
            this.onDimensionsChanged();
        }
        this._text = text;
        this.requestSync();
    }

    getDescription() {
        let fullDesc = super.getDescription();

        let calcPos = this._getWindowPixelPosition();
        fullDesc.unshift({
            type: "groupbox",
            name: this._name,
            text: this._text,
            x: calcPos.x,
            y: calcPos.y,
            width: this.getPixelWidth(),
            height: this.getPixelHeight()
        });
        return fullDesc;
    }

    update() {
        if (this.requiresSync()) {
            let handle = this.getHandle();
            let desc = this.getDescription();
            this._applyDescription(handle, desc[0]);
        }
        super.update();
    }

    getHandle() {
        let window = this.getWindow();
        if (window != null) {
            return window._handle.findWidget(this._name);
        }
        return null;
    }

    _applyDescription(handle, desc) {
        handle.x = desc.x;
        handle.y = desc.y;
        handle.width = desc.width;
        handle.height = desc.height;
        handle.text = desc.text;
    }
}

export default GroupBox;
