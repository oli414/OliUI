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
            let label = new Oui.Widgets.Label("Hello World");
            myWindow.addChild(label);
        }

        {
            let label = new Oui.Widgets.Label("Hello World 2");
            myWindow.addChild(label);
        }

        {
            let box = new Oui.Box();

            {
                let button = new Oui.Widgets.Button("Button A");
                button.setRelativeHeight(50);
                box.addChild(button);
            }

            {
                let button = new Oui.Widgets.Button("Grow", () => {
                    myWindow.setAbsoluteWidth(myWindow.getPixelWidth() + 20);
                });
                button.setRelativeHeight(50);
                box.addChild(button);
            }

            myWindow.addChild(box);
            myWindow.setRemainingHeightFiller(box);
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