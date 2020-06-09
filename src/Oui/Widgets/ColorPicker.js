import Dropdown from "./Dropdown";

/**
 * Dropdown implementation for a color picker as a temporary solution until a real color picker widget is added to the OpenRCT2 plugin API.
 */
class ColorPicker extends Dropdown {
    /**
     * 
     * @param {import("./Widget").onChangeCallback} [onChange] Callback for when a color is selected. The callback's parameter is the color palette index.
     */
    constructor(onChange = null) {
        super([
            "Black",
            "Grey",
            "White",
            "Dark Purple",
            "Light Purple",
            "Bright Purple",
            "Dark Blue",
            "Light Blue",
            "Icy Blue",
            "Teal",
            "Aquamarine",
            "Saturated Green",
            "Dark Green",
            "Moss Green",
            "Bright Green",
            "Olive Green",
            "Dark Olive Green",
            "Bright Yellow",
            "Yellow",
            "Dark Yellow",
            "Light Orange",
            "Dark Orange",
            "Light Brown",
            "Saturated Brown",
            "Dark Brown",
            "Salmon Pink",
            "Bordeaux Red",
            "Saturated Red",
            "Bright Red",
            "Dark Pink",
            "Bright Pink",
            "Light Pink",
        ], onChange);

        this._height = 12;
    }
}

export default ColorPicker;