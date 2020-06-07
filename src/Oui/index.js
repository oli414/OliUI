import Window from "./Window";
import Label from "./Widgets/Label";
import Button from "./Widgets/Button";
import Checkbox from "./Widgets/Checkbox";
import VerticalBox from "./VerticalBox";
import HorizontalBox from "./HorizontalBox";
import Dropdown from "./Widgets/Dropdown";
import GroupBox from "./GroupBox";
import Spinner from "./Widgets/Spinner";

const Oui = {
    Window: Window,
    VerticalBox: VerticalBox,
    HorizontalBox: HorizontalBox,
    GroupBox: GroupBox,
    Widgets: {
        Label: Label,
        Button: Button,
        Checkbox: Checkbox,
        Dropdown: Dropdown,
        Spinner: Spinner
    }
};

export default Oui;
