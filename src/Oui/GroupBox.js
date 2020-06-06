import VerticalBox from "./VerticalBox";
import Widget from "./Widgets/Widget";

class GroupBox extends VerticalBox {
    constructor() {
        super();

        this._name = "groupbox-" + Widget.NumberGen();
        this._paddingTop = 13;
    }

    getDescription() {
        let fullDesc = super.getDescription();

        let calcPos = this._getWindowPixelPosition();
        fullDesc.unshift({
            type: "groupbox",
            name: this._name,
            text: "GroupBox",
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
            this._applyDescription(handle, desc);
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
