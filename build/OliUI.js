class Element {
    constructor() {
        this._parent = null;

        this._marginTop = 0;
        this._marginBottom = 2;
        this._marginLeft = 0;
        this._marginRight = 0;

        this._x = 0;
        this._y = 0;

        this._width = 100;
        this._height = 0;
        this._hasRelativeWidth = true;
        this._hasRelativeHeight = false;
        this._isRemainingFiller = false;

        this._requireSync = false;
    }

    getPixelWidth() {
        if (this._parent == null) {
            return this._width;
        }
        else if (this._isRemainingFiller && this._parent._isHorizontal) {
            return this._parent.getRemainingWidth();
        }
        else if (this._hasRelativeWidth) {
            if (!this._parent._isHorizontal) {
                return this._parent.getContentWidth() / 100 * this._width;
            }
            else {
                return (this._parent.getContentWidth() - this._parent.getTotalChildMarginWidths()) / 100 * this._width;
            }
        }
        else {
            return this._width;
        }
    }

    setWidth(pixels) {
        this._width = pixels;
        this._hasRelativeWidth = false;
        this.onDimensionsChanged();
    }

    getPixelHeight() {
        if (this._parent == null) {
            return this._height;
        }
        else if (this._isRemainingFiller && !this._parent._isHorizontal) {
            return this._parent.getRemainingHeight();
        }
        else if (this._hasRelativeHeight) {
            if (!this._parent._isHorizontal) {
                return (this._parent.getContentHeight() - this._parent.getTotalChildMarginHeights()) / 100 * this._height;
            }
            else {
                return this._parent.getContentHeight() / 100 * this._height;
            }
        }
        else {
            return this._height;
        }
    }

    setHeight(pixels) {
        this._height = pixels;
        this._hasRelativeHeight = false;
        this.onDimensionsChanged();
    }

    getRelativeWidth() {
        if (this._hasRelativeWidth) {
            return this._width;
        }
        else {
            if (this._parent != null) {
                return this._width / this._parent.getContentWidth() * 100;
            }
            throw new Error("The relative width could not be calculated since this element does not have a parent");
        }
    }

    setRelativeWidth(percentage) {
        this._width = percentage;
        this._hasRelativeWidth = true;
        this.onDimensionsChanged();
    }

    getRelativeHeight() {
        if (this._hasRelativeHeight) {
            return this._height;
        }
        else {
            if (this._parent != null) {
                return this._height / this._parent.getContentHeight() * 100;
            }
            throw new Error("The relative height could not be calculated since this element does not have a parent");
        }
    }

    setRelativeHeight(percentage) {
        this._height = percentage;
        this._hasRelativeHeight = true;
        this.onDimensionsChanged();
    }

    getMargins() {
        return {
            top: this._marginTop,
            bottom: this._marginBottom,
            left: this._marginLeft,
            right: this._marginRight
        }
    }

    setMargins(top, bottom, left, right) {
        this._marginTop = top;
        this._marginBottom = bottom;
        this._marginLeft = left;
        this._marginRight = right;
    }

    getWindow() {
        if (this._parent == null)
            return null;
        return this._parent.getWindow();
    }

    requestSync() {
        let window = this.getWindow();
        if (window != null && window.isOpen()) {
            this._requireSync = true;
        }
    }

    requiresSync() {
        if (this._parent != null) {
            return this._requireSync || this._parent.requiresSync();
        }
        return this._requireSync;
    }

    onDimensionsChanged() {
        if (this._parent != null) {
            this._parent._updateChildDimensions();
        }
        this.requestSync();
    }

    _getDescription() {
        return null;
    }

    _update() {
        this._requireSync = false;
    }

    _getWindowPixelPosition() {
        if (this._parent) {
            let pos = this._parent._getWindowPixelPosition();
            pos.x += this._x;
            pos.y += this._y;
            return pos;
        }
        else {
            return { x: this._x, y: this._y };
        }
    }
}

class Box extends Element {
    constructor() {
        super();

        this._width = 100;

        this.setPadding(3, 3, 4, 4);

        this._isHorizontal = false;

        this._children = [];
    }

    addChild(child) {
        this._children.push(child);
        child._parent = this;

        this._updateChildDimensions();
    }

    getContentWidth() {
        return this.getPixelWidth() - this._paddingLeft - this._paddingRight;
    }

    getContentHeight() {
        return this.getPixelHeight() - this._paddingTop - this._paddingBottom;
    }

    getMargins() {
        return {
            top: this._paddingTop,
            bottom: this._paddingBottom,
            left: this._paddingLeft,
            right: this._paddingRight
        }
    }

    setPadding(top, bottom, left, right) {
        this._paddingTop = top;
        this._paddingBottom = bottom;
        this._paddingLeft = left;
        this._paddingRight = right;
    }

    onDimensionsChanged() {
        this._updateChildDimensions();
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (child._hasRelativeWidth || child._hasRelativeHeight) {
                child.onDimensionsChanged();
            }
        }
        super.onDimensionsChanged();
    }

    getTotalChildMarginWidths() {
        let width = 0;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (i < this._children.length - 1) {
                width += Math.max(child._marginRight, this._children[i + 1]._marginLeft);
            }
        }
        return width;
    }

    getTotalChildMarginHeights() {
        let height = 0;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (i < this._children.length - 1) {
                height += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
            }
        }
        return height;
    }

    _updateChildDimensions() {

    }

    _getDescription() {
        let fullDesc = [];
        for (let i = 0; i < this._children.length; i++) {
            let rDesc = this._children[i]._getDescription();
            if (rDesc != null) {
                if (Array.isArray(rDesc)) {
                    fullDesc = fullDesc.concat(rDesc);
                }
                else {
                    fullDesc.push(rDesc);
                }
            }
        }
        return fullDesc;
    }

    _update() {
        for (let i = 0; i < this._children.length; i++) {
            this._children[i]._update();
        }
        this._requireSync = false;
    }
}

class VerticalBox extends Box {
    constructor() {
        super();

        this._remainingHeightFiller = null;
    }

    addChild(child) {
        super.addChild(child);
        if (child._hasRelativeHeight) {
            child.onDimensionsChanged();
        }
    }

    _updateChildDimensions() {
        let yPos = this._paddingTop;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            child._x = this._paddingLeft;
            child._y = yPos;
            yPos += child.getPixelHeight();

            if (i < this._children.length - 1) {
                yPos += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
            }
        }

        if (!this._hasRelativeHeight && yPos + this._paddingBottom > this._height) {
            this.setHeight(yPos + this._paddingBottom);
        }
    }

    getRemainingHeight() {
        let height = 0;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (!child._isRemainingFiller)
                height += child.getPixelHeight();

            if (i < this._children.length - 1) {
                height += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
            }
        }
        return this.getContentHeight() - height;
    }

    setRemainingHeightFiller(child) {
        if (this._children.indexOf(child) < 0) {
            throw new Error("The remaining height filler has to be a child of this element.");
        }
        if (this._remainingHeightFiller != null) {
            this._remainingHeightFiller._isRemainingFiller = false;
        }
        this._remainingHeightFiller = child;
        child._isRemainingFiller = true;
        this._updateChildDimensions();
        child.onDimensionsChanged();
    }
}

class Window extends VerticalBox {
    constructor(title = "") {
        super();
        this._hasRelativeWidth = false;
        this._width = 100;

        this._height = this._paddingTop + this._paddingBottom;

        this._handle = null;

        this._title = title;
        this._classification = "park";

        this._canResizeHorizontally = false;
        this._minWidth = 100;
        this._maxWidth = 100;
        this._canResizeVertically = false;
        this._minHeight = 100;
        this._maxHeight = 100;
    }

    open() {
        let desc = this._getDescription();
        this._handle = ui.openWindow(desc);
    }

    isOpen() {
        return this._handle != null;
    }

    _getDescription() {
        let widgets = super._getDescription();

        return {
            classification: this._classification,
            width: this._width,
            height: this._height,
            minWidth: this._minWidth,
            maxWidth: this._maxWidth,
            minHeight: this._minHeight,
            maxHeight: this._maxHeight,
            title: this._title,
            widgets: widgets,
            onUpdate: () => {
                this._update();
            }
        }
    }

    getWindow() {
        return this;
    }

    setHorizontalResize(canResizeHorizontally, minWidth, maxWidth) {
        this._canResizeHorizontally = canResizeHorizontally;
        if (canResizeHorizontally) {
            this._minWidth = minWidth;
            this._maxWidth = maxWidth;
        }
        else {
            this._minWidth = this._width;
            this._maxWidth = this._width;
        }
    }

    setVerticalResize(canResizeVertically, minHeight, maxHeight) {
        this._canResizeVertically = canResizeVertically;
        if (canResizeVertically) {
            this._minHeight = minHeight;
            this._maxHeight = maxHeight;
        }
        else {
            this._minHeight = this._height;
            this._maxHeight = this._height;
        }
    }

    setWidth(pixels) {
        if (this.isOpen()) {
            this._handle.width = pixels;
        }
        super.setWidth(pixels);
        if (!this._canResizeHorizontally) {
            this._minWidth = this._width;
            this._maxWidth = this._width;
        }
    }

    setHeight(pixels) {
        if (pixels < 16)
            pixels = 16;
        if (this.isOpen()) {
            this._handle.height = pixels;
        }
        super.setHeight(pixels);
        if (!this._canResizeVertically) {
            this._minHeight = this._height;
            this._maxHeight = this._height;
        }
    }

    getPixelWidth() {
        return this._width;
    }

    getPixelHeight() {
        return this._height;
    }

    setPadding(top, bottom, left, right) {
        this._paddingTop = top + 15;
        this._paddingBottom = bottom + 1;
        this._paddingLeft = left;
        this._paddingRight = right;
    }

    _update() {
        if (this._handle.width != this._width || this._handle.height != this._height) {
            this.setWidth(this._handle.width);
            this.setHeight(this._handle.height);
        }
        super._update();
        this._requireSync = false;
    }
}

let numberCount = 0;
function NumberGen() {
    numberCount++;
    return numberCount - 1;
}

class Widget extends Element {
    constructor() {
        super();

        this.setMargins(2, 4, 2, 2);
        this._type = "none";
        this._name = NumberGen();
    }

    _getDescription() {
        let calcPos = this._getWindowPixelPosition();
        return {
            type: this._type,
            name: this._name,
            x: calcPos.x,
            y: calcPos.y,
            width: this.getPixelWidth(),
            height: this.getPixelHeight()
        }
    }

    _update() {
        if (this.requiresSync()) {
            let handle = this.getHandle();
            let desc = this._getDescription();
            this._applyDescription(handle, desc);
        }
        this._requireSync = false;
    }

    getHandle() {
        let window = this.getWindow();
        if (window != null) {
            return window._handle.findWidget(this._name);
        }
        return null;
    }

    _applyDescription(handle, desc) {
        handle.x = desc.x;
        handle.y = desc.y;
        handle.width = desc.width;
        handle.height = desc.height;
    }
}

Widget.NumberGen = NumberGen;

class Label extends Widget {
    constructor(text = "") {
        super();

        this._type = "label";
        this._text = text;
        this._name = this._type + "-" + this._name;
        this._height = 10;
    }

    getText() {
        return this._text;
    }

    setText(text) {
        this._text = text;
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.text = this._text;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

class Button extends Widget {
    constructor(text = "", onClick = null) {
        super();

        this._type = "button";
        this._text = text;
        this._name = this._type + "-" + this._name;
        this._height = 13;
        this._onClick = onClick;
    }

    getText() {
        return this._text;
    }

    setText(text) {
        this._text = text;
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.text = this._text;
        desc.onClick = () => { if (this._onClick) this._onClick(); };
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

class Checkbox extends Widget {
    constructor(text = "", onChange = null) {
        super();

        this._type = "checkbox";
        this._text = text;
        this._name = this._type + "-" + this._name;
        this._height = 10;
        this._onChange = onChange;
        this._isChecked;
    }

    setIsChecked(checked) {
        this._isChecked = checked;
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.text = this._text;
        desc.onChange = (checked) => {
            this._isChecked = checked;
            if (this._onChange) this._onChange(checked);
        };
        desc.isChecked = this._isChecked;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

class HorizontalBox extends Box {
    constructor() {
        super();

        this._remainingWidthFiller = null;
        this._isHorizontal = true;
    }

    addChild(child) {
        super.addChild(child);
        if (child._hasRelativeWidth) {
            child.onDimensionsChanged();
        }
    }

    _updateChildDimensions() {
        let xPos = this._paddingLeft;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            child._x = xPos;
            child._y = this._paddingTop;
            xPos += child.getPixelWidth();

            if (i < this._children.length - 1) {
                xPos += Math.max(child._marginRight, this._children[i + 1]._marginLeft);
            }
        }

        if (!this._hasRelativeWidth && xPos + this._paddingRight > this._width) {
            this.setWidth(xPos + this._paddingRight);
        }
    }

    getRemainingWidth() {
        let width = 0;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (!child._isRemainingFiller)
                width += child.getPixelWidth();

            if (i < this._children.length - 1) {
                width += Math.max(child._marginRight, this._children[i + 1]._marginLeft);
            }
        }
        return this.getContentWidth() - width;
    }

    setRemainingWidthFiller(child) {
        if (this._children.indexOf(child) < 0) {
            throw new Error("The remaining width filler has to be a child of this element.");
        }
        if (this._remainingWidthFiller != null) {
            this._remainingWidthFiller._isRemainingFiller = false;
        }
        this._remainingWidthFiller = child;
        child._isRemainingFiller = true;
        this._updateChildDimensions();
        child.onDimensionsChanged();
    }
}

class Dropdown extends Widget {
    constructor(items = [], onChange = null) {
        super();

        this._type = "dropdown";
        this._name = this._type + "-" + this._name;
        this._height = 13;
        this._onChange = onChange;
        this._items = items.slice(0);
        this._selectedIndex = 0;
    }

    getItems() {
        return this._items.slice(0);
    }

    setItems(items) {
        this._items = items.slice(0);
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.items = this._items;
        desc.onChange = (i) => {
            this._selectedIndex = i;
            if (this._onChange) this._onChange(i);
        };
        desc.selectedIndex = this._selectedIndex;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.items = desc.items;
        desc.selectedIndex = desc.selectedIndex;
    }
}

class GroupBox extends VerticalBox {
    constructor(text = "") {
        super();

        this._text = text;
        this._name = "groupbox-" + Widget.NumberGen();
        if (this._text != "")
            this._paddingTop = 13;
        else
            this._paddingTop = 8;
        this._paddingBottom = 5;
    }

    getText() {
        return this._text;
    }

    setText(text) {
        if (Boolean(this._text.length) != Boolean(text.length)) {
            if (text.length == 0) {
                this._paddingTop -= 5;
            }
            else {
                this._paddingTop += 5;
            }
            this.onDimensionsChanged();
        }
        this._text = text;
        this.requestSync();
    }

    _getDescription() {
        let fullDesc = super._getDescription();

        let calcPos = this._getWindowPixelPosition();
        fullDesc.unshift({
            type: "groupbox",
            name: this._name,
            text: this._text,
            x: calcPos.x,
            y: calcPos.y,
            width: this.getPixelWidth(),
            height: this.getPixelHeight()
        });
        return fullDesc;
    }

    _update() {
        if (this.requiresSync()) {
            let handle = this.getHandle();
            let desc = this._getDescription();
            this._applyDescription(handle, desc[0]);
        }
        super._update();
    }

    getHandle() {
        let window = this.getWindow();
        if (window != null) {
            return window._handle.findWidget(this._name);
        }
        return null;
    }

    _applyDescription(handle, desc) {
        handle.x = desc.x;
        handle.y = desc.y;
        handle.width = desc.width;
        handle.height = desc.height;
        handle.text = desc.text;
    }
}

class Spinner extends Widget {
    constructor(value = 0, step = 1, onChange = null) {
        super();

        this._type = "spinner";
        this._value = Number(value);
        this._step = Number(step);
        this._decimals = Math.max(this.countDecimals(this._step), this.countDecimals(this._value));
        this._name = this._type + "-" + this._name;
        this._height = 13;
        this._onChange = onChange;
    }

    getDecimalPlaces() {
        return this._decimals;
    }

    setDecimalPlaces(decimals) {
        this._decimals = decimals;
        this.requestSync();
    }

    getValue() {
        return this._value;
    }

    setValue(value) {
        this._value = value;
        this.requestSync();
    }

    getStep() {
        return this._step;
    }

    setStep(step) {
        this._step = step;
        this.requestSync();
    }

    countDecimals(val) {
        if ((val % 1) != 0)
            return val.toString().split(".")[1].length;
        return 0;
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.text = this._value.toFixed(this._decimals);
        desc.onIncrement = () => {
            this._value += this._step;
            if (this._onChange) this._onChange(this._value);
            this.requestSync();
        };
        desc.onDecrement = () => {
            this._value -= this._step;
            if (this._onChange) this._onChange(this._value);
            this.requestSync();
        };
        desc.isChecked = this._isChecked;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.text = desc.text;
    }
}

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
