import Element from "../Element";

let numberCount = 0;
function NumberGen() {
    numberCount++;
    return numberCount - 1;
}

class Widget extends Element {
    constructor() {
        super();

        this.setMargins(2, 4, 2, 2);
        this._type = "none";
        this._name = NumberGen();
    }

    _getDescription() {
        let calcPos = this._getWindowPixelPosition();
        return {
            type: this._type,
            name: this._name,
            x: calcPos.x,
            y: calcPos.y,
            width: this.getPixelWidth(),
            height: this.getPixelHeight()
        }
    }

    _update() {
        if (this.requiresSync()) {
            let handle = this.getHandle();
            let desc = this._getDescription();
            this._applyDescription(handle, desc);
        }
        this._requireSync = false;
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
    }
}

Widget.NumberGen = NumberGen;

export default Widget;
