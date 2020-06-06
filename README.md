# openrct2-oli-ui
OliUI is an OpenRCT2 plugin module to easily construct and control UI windows.

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
