// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="../../../bin/openrct2.d.ts" />

// Import a module from another file.
import Message from "./module";
import Oui from "./Oui/index";



function main() {
    ui.registerMenuItem("WindowAPI Demo", function () {

        let myWindow = new Oui.Window("My Window");
        myWindow.setAbsoluteWidth(300);
        myWindow.setHorizontalResize(true, 100, 600);
        myWindow.setVerticalResize(true, 100, 400);


        {
            let boxH = new Oui.HorizontalBox();
            boxH.setRelativeHeight(100);

            {
                let button = new Oui.Widgets.Button("Button A");
                button.setAbsoluteWidth(100);
                button.setRelativeHeight(100);
                boxH.addChild(button);
            }

            {
                let boxV = new Oui.VerticalBox();
                boxV.setRelativeHeight(100);
                boxH.addChild(boxV);
                boxH.setRemainingWidthFiller(boxV);

                boxV.setPadding(0, 0, 0, 0);

                {
                    let button = new Oui.Widgets.Button("Button B");
                    button.setRelativeHeight(50);
                    boxV.addChild(button);
                }

                {
                    let button = new Oui.Widgets.Button("Button C");
                    button.setRelativeHeight(50);
                    boxV.addChild(button);
                }
            }
            myWindow.addChild(boxH);
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