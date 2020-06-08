import VerticalBox from "./VerticalBox";
import Widget from "./Widgets/Widget";

/**
 * The group box is a vertical box that a border and an optional label.
 */
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

    /**
     * Get the label text of this groupbox.
     * @returns {string}
     */
    getText() {
        return this._text;
    }

    /**
     * Set the groupbox label text. Set to an empty string to remove the label text.
     * @param {string} text
     */
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

    /**
     * Get the reference to the OpenRCT2 Plugin API UI widget.
     * @returns {Widget} Reference to an OpenRCT2 Plugin API UI widget.
     */
    getHandle() {
        let window = this.getWindow();
        if (window != null) {
            return window._handle.findWidget(this._name);
        }
        return null;
    }

    _getDescription() {
        let fullDesc = super._getDescription();

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

    _update() {
        if (this.requiresSync()) {
            let handle = this.getHandle();
            let desc = this._getDescription();
            this._applyDescription(handle, desc[0]);
        }
        super._update();
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
