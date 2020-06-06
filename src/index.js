// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="../../../bin/openrct2.d.ts" />

// Import a module from another file.
import Message from "./module";
import Oui from "./Oui/index";



function main() {
    ui.registerMenuItem("WindowAPI Demo", function () {

        let myWindow = new Oui.Window("My Window");
        myWindow.setAbsoluteWidth(300);

        {
            let groupBox = new Oui.GroupBox("Label");
            myWindow.addChild(groupBox);

            {
                let label = new Oui.Widgets.Label("Label");
                groupBox.addChild(label);
            }


            {
                let button = new Oui.Widgets.Button("Label", () => { console.log("On click") });
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
        }

        myWindow.open();
    });
}

registerPlugin({
    name: 'WindowAPIDemo',
    version: '1.0',
    authors: ['Oli414'],
    type: 'local',
    main: main
});