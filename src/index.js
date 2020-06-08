// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="../../../bin/openrct2.d.ts" />

// Import the OliUI library.
import Oui from "./Oui/index";

function main() {
    ui.registerMenuItem("OliUI Demo", function () {

        let myWindow = new Oui.Window("My Window");
        myWindow.setWidth(300);
        {
            let groupBox = new Oui.GroupBox("Group Box");
            myWindow.addChild(groupBox);

            {
                let label = new Oui.Widgets.Label("Label");
                groupBox.addChild(label);
            }


            {
                let button = new Oui.Widgets.Button("Click Me", () => {
                    if (groupBox.getText() == "")
                        groupBox.setText("Group Box");
                    else
                        groupBox.setText("");
                });
                groupBox.addChild(button);
            }

            {
                let checkBox = new Oui.Widgets.Checkbox("Checkbox", () => { console.log("On change") });
                groupBox.addChild(checkBox);
            }

            {
                let dropdown = new Oui.Widgets.Dropdown(["Option A", "Option B", "Option C"], (i) => { console.log("On change " + i) });
                groupBox.addChild(dropdown);
            }

            {
                let spinner = new Oui.Widgets.Spinner(0, 0.1, (val) => { console.log("On change " + val) });
                groupBox.addChild(spinner);
            }
        }

        myWindow.open();
    });
}

registerPlugin({
    name: 'OliUIDemo',
    version: '1.0',
    authors: ['Oli414'],
    type: 'local',
    main: main
});