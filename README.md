# OliUI
OliUI is still under construction. Only use for testing.

OliUI is an OpenRCT2 plugin module to easily construct and control UI windows.

## Installation
This project has two different build files. A demo that can be run as an OpenRCT2 plugin at `demobuild/OliUIDemo.js`. And an ES6 module that can be imported into your own project to use OliUI at `build/OliUI.js`.

The demo can be ran by placing the `OliUIDemo.js` file in `OpenRCT2/plugin/`.

To use the module simply copy the `OliUI.js` file inside of your project's source directory. Keep in mind that it is an ES6 module and thus you will need a transpiler and module bundler to turn your project into a single ES5 file. You can use the [ES6 boilerplate](https://github.com/oli414/openrct2-plugin-boilerplate). Typescript projects can also import the module.

Here's an example on what basic usage of the module would look like:
```
import Oui from "OliUI.js"

function CreateWindow() 
{
    const window = new Oui.Window("My Window");
    window.setWidth(300);
    
    const label = new Oui.Widget.Label("Hello World!");
    window.addChild(label);
    
    const groupbox = new Oui.GroupBox("Input Widgets");
    window.addChild(groupbox);
    
    const spinner = new Oui.Widget.Spinner(5, 1);
    groupbox.addChild(spinner);
    
    const button = new Oui.Widget.Button("Click Me!", () => {
        button.setText("I was clicked!");
    });
    groupbox.addChild(groupBox);
    
    window.open();
}
```

## Layout
The main box element for creating layouts is the VerticalBox. The Window itself derives from the VerticalBox and makes sure that all the children are spaced out vertically. 
The padding on a box leaves some space on the inside between the box and the elements inside of a box.
Between each element within a box there's a margin which is used to space out the elements inside of a box from each other. The largest margin between each 2 elements is used.

On each element the size can be set either absolute or relative. An absolute size specifies the size in pixels while a relative size specifies the size in the percentage. A relative size scales relative to the parent element.
All elements have a relative width of 100% by default.

The HorizontalBox can be used when the child elements should be spaced out next to each other in a horizontal fashion.

Both the VerticalBox and HorizontalBox allow you to set a single child element to fill the remaining space. For the VerticalBox this is the remaining vertical space and for the HorizontalBox this is the remaining horizontal space.

## Future Plans
- Remove and add elements after a window has been opened.
- Option to align a Box's child elements in the center, right, top or bottom.
- Special type of Box in which the child elements can be positioned manually.
- ListView and ViewPort widgets.
