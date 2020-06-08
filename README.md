# OliUI
OliUI is an OpenRCT2 plugin module to easily construct and control UI windows of any complexity.

*This is not an plugin but rather a tool (library/module) for plugin creators to use*

Creating UI windows with the OpenRCT2 plugin API can be very time consuming when widgets need to be positioned manually. OliUI takes away the need to manually position each and every widget and instead allows you to easily create responsive UI windows. 

```javascript
import Oui from "OliUI.js"

function CreateWindow() 
{
    const window = new Oui.Window("My Window");
    window.setWidth(300); 
    // The height is automatically updated as we add more elements to the window.
    
    const label = new Oui.Widgets.Label("Hello World!");
    window.addChild(label);
    
    const groupbox = new Oui.GroupBox("Input Widgets");
    window.addChild(groupbox);
    
    const spinner = new Oui.Widgets.Spinner(5, 1);
    groupbox.addChild(spinner);
    
    const button = new Oui.Widgets.Button("Click Me!", () => {
        // Implementing callbacks is a breeze. 
        this.setText("I was clicked!");
    });
    groupbox.addChild(button);
    
    // And then all that's left is the grand opening.
    window.open();
}
```
![](https://i.imgur.com/woYhJUV.png)

The layouting of OliUI is reminiscent of HTML and CSS layouts where elements are created in a tree structure and are automatically positioned. With the padding and margin settings you can keep the right balance between UI readability and UX. Percentage element widths make it possible to create dynamic layouts with ease.

Changes to the window are updated in real time whenever possible. But best of all, if you just need to create a GUI for your OpenRCT2 plugin then all you have to worry about is which elements you want in your GUI.

## Installation
This project has two different build files. A demo that can be run as an OpenRCT2 plugin at `demobuild/OliUIDemo.js`. And an ES6 module that can be imported into your own project to use OliUI at `build/OliUI.js`.

The demo can be ran by placing the `OliUIDemo.js` file in `OpenRCT2/plugin/`.

To use the module simply copy the `OliUI.js` file inside of your project's source directory. Keep in mind that it is an ES6 module and thus you will need a transpiler and module bundler to turn your project into a single ES5 file. You can use the [ES6 boilerplate](https://github.com/oli414/openrct2-plugin-boilerplate). Typescript projects can also import the module.

## Layout
The main box element for creating layouts is the VerticalBox. The Window itself derives from the VerticalBox and makes sure that all the children are spaced out vertically. 
The padding on a box leaves some space on the inside between the box and the elements inside of a box.
Between each element within a box there's a margin which is used to space out the elements inside of a box from each other. The largest margin between each 2 elements is used.
```javascript
const verticalBox = new Oui.VerticalBox();
verticalBox.setPadding(8, 8, 8, 8) 
// The children will leave an 8 pixel large padding between them and the verticalBox

const firstElement = new Oui.Widgets.Button("Top Button");
firstElement.setMargins(0, 8, 0, 0);
verticalBox.addChild(firstElement);

// The margin between firstElement and secondElement will be 8 pixels since 
// firstElement's bottom margin is larger then secondElement's bottom margin

const secondElement = new Oui.Widgets.Button("Middle Button");
secondElement.setMargins(2, 2, 0, 0);
verticalBox.addChild(secondElement);

// The margin between secondElement and lastElement will be 6 pixels since 
// lastElement's top margin is larger then secondElement's bottom margin

const lastElement = new Oui.Widgets.Button("Bottom Button");
lastElement.setMargins(6, 0, 0, 0);
verticalBox.addChild(lastElement);

window.addChild(verticalBox);
```
![](https://i.imgur.com/FjKTQy0.png)

### Absolute and Relative Sizes

On each element the size can be set either absolute or relative. An absolute size specifies the size in pixels while a relative size specifies the size in the percentage. A relative size scales relative to the parent element.
All elements have a relative width of 100% by default.
```javascript
const verticalBox = new Oui.VerticalBox();
verticalBox.setHeight(400);

const firstElement = new Oui.Widgets.Button("Top Button");
firstElement.setRelativeHeight(50);
verticalBox.addChild(firstElement);

const secondElement = new Oui.Widgets.Button("Bottom Button");
secondElement.setRelativeHeight(50);
verticalBox.addChild(secondElement);

window.addChild(verticalBox);
```
![](https://i.imgur.com/UzF2qNj.png)

### Horizontal Layouts

The HorizontalBox can be used when the child elements should be spaced out next to each other in a horizontal fashion.
```javascript
const horizontalBox = new Oui.HorizontalBox();

const firstElement = new Oui.Widgets.Button("Left Button");
firstElement.setRelativeWidth(50);
horizontalBox.addChild(firstElement);

const secondElement = new Oui.Widgets.Button("Right Button");
secondElement.setRelativeWidth(50);
horizontalBox.addChild(secondElement);

window.addChild(horizontalBox);
```
![](https://i.imgur.com/y46n3EQ.png)

### Left Over Space

Both the VerticalBox and HorizontalBox allow you to set a single child element to fill the remaining space. For the VerticalBox this is the remaining vertical space and for the HorizontalBox this is the remaining horizontal space.
```javascript
const verticalBox = new Oui.VerticalBox();
verticalBox.setHeight(50);

const firstElement = new Oui.Widgets.Button("Top Button");
firstElement.setHeight(15);
verticalBox.addChild(firstElement);

const secondElement = new Oui.Widgets.Button("Bottom Button");
verticalBox.addChild(secondElement);

verticalBox.setRemainingHeightFiller(secondElement);
// secondElement will fill the remaining height.

window.addChild(verticalBox);
```
![](https://i.imgur.com/NstleLH.png)

### Nesting

With these layout building blocks you can build any GUI that you can dream of. Remember that you can always nest boxes to get the perfect layout.

## Documentation
The entire module is documented using JSDoc comments.

## Known Issues
- The viewport widget implementation is very limited.
- Setting the selected cell manually on a listview widget does not function.

## Future Plans
- Window tabs support.
- Remove ~~and add elements~~ after a window has been opened.
- Option to align a Box's child elements in the center, right, top or bottom.
- Special type of Box in which the child elements can be positioned manually.

![](https://i.imgur.com/DJxWc2r.png)
