// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="../../../bin/openrct2.d.ts" />

// Import the OliUI library.
import Oui from "./Oui/index";

function main() {
    let myWindow = new Oui.Window("My Window");
    myWindow.setWidth(300);
    myWindow.setHorizontalResize(true, 200, 600);
    myWindow.setVerticalResize(true, 200, 600);

    let groupBox = new Oui.GroupBox("Group Box");

    {
        let checkBox = new Oui.Widgets.Checkbox("Disable group box", (value) => {
            groupBox.setIsDisabled(value);
        });
        myWindow.addChild(checkBox);
    }

    {
        myWindow.addChild(groupBox);

        {
            let label = new Oui.Widgets.Label("Label");
            groupBox.addChild(label);
        }

        {
            let button = new Oui.Widgets.Button("Click Me", () => {
                myWindow._title = myWindow._title + "+";
                myWindow.setColors(Math.floor(Math.random() * 31));
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

    let listView = new Oui.Widgets.ListView();

    let columns = [
        new Oui.Widgets.ListView.ListViewColumn("Name"),
        new Oui.Widgets.ListView.ListViewColumn("Age"),
        new Oui.Widgets.ListView.ListViewColumn("Money")
    ]

    columns[0].setMaxWidth(100);
    columns[0].setCanSort(true, "descending");

    listView.setColumns(columns);
    listView.addItem([
        "Henk",
        "0",
        "0.1"
    ]);
    listView.addItem([
        "Xavier",
        "10",
        "10"
    ]);
    listView.addItem([
        "Bas",
        "30",
        "100"
    ]);
    listView.setIsStriped(true);
    listView.setCanSelect(true);
    listView.setSelectedCell(1, 1);
    myWindow.addChild(listView);


    {
        let button = new Oui.Widgets.Button("Add Item", () => {
            listView.addItem([
                "Kees",
                "33",
                "800"
            ]);
        });
        myWindow.addChild(button);
    }
    /*
    let viewportWidget = new Oui.Widgets.ViewportWidget(1000, 1000);
    myWindow.addChild(viewportWidget);
    myWindow.setRemainingHeightFiller(viewportWidget);

    viewportWidget.setView(1000, 1000);
    //viewportWidget.setRotation(1);
    */

    ui.registerMenuItem("OliUI Demo", function () {

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