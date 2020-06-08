import Window from "./Window";
import Label from "./Widgets/Label";
import Button from "./Widgets/Button";
import Checkbox from "./Widgets/Checkbox";
import VerticalBox from "./VerticalBox";
import HorizontalBox from "./HorizontalBox";
import Dropdown from "./Widgets/Dropdown";
import GroupBox from "./GroupBox";
import Spinner from "./Widgets/Spinner";
import TextButton from "./Widgets/TextButton";
import ImageButton from "./Widgets/ImageButton";
import Element from "./Element";
import Box from "./Box";
import Widget from "./Widgets/Widget";

/**
 * The namespace for OliUI.
 * @namespace
 */
const Oui = {
    Window: Window,
    VerticalBox: VerticalBox,
    HorizontalBox: HorizontalBox,
    GroupBox: GroupBox,
    Widgets: {
        Label: Label,
        /**
         * Alias for TextButton. See Oui.BaseClasses.Button for the button base class.
         */
        Button: TextButton,
        TextButton: TextButton,
        ImageButton: ImageButton,
        Checkbox: Checkbox,
        Dropdown: Dropdown,
        Spinner: Spinner
    },
    BaseClasses: {
        Element: Element,
        Box: Box,
        Widget: Widget,
        Button: Button
    }
};

export default Oui;

