import Window from "./Window";
import Label from "./Widgets/Label";
import Button from "./Widgets/Button";
import VerticalBox from "./VerticalBox";
import HorizontalBox from "./HorizontalBox";

const Oui = {
    Window: Window,
    VerticalBox: VerticalBox,
    HorizontalBox: HorizontalBox,
    Widgets: {
        Label: Label,
        Button: Button
    }
};

export default Oui;
