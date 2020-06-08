"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    /**
     * The element class is the base class for all UI elements.
     */

    var Element = function () {
        function Element() {
            _classCallCheck(this, Element);

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

        /**
         * Get the width of this element in pixels. For elements with a relative width the calculated width based on the element's parent is used.
         * @returns {number} The calculated width in pixels.
         */


        _createClass(Element, [{
            key: "getPixelWidth",
            value: function getPixelWidth() {
                if (this._parent == null) {
                    return this._width;
                } else if (this._isRemainingFiller && this._parent._isHorizontal) {
                    return this._parent.getRemainingWidth();
                } else if (this._hasRelativeWidth) {
                    if (!this._parent._isHorizontal) {
                        return this._parent.getContentWidth() / 100 * this._width;
                    } else {
                        return (this._parent.getContentWidth() - this._parent.getTotalChildMarginWidths()) / 100 * this._width;
                    }
                } else {
                    return this._width;
                }
            }

            /**
             * Set the element's width in pixels.
             * @param {number} width The new width in pixels. 
             */

        }, {
            key: "setWidth",
            value: function setWidth(width) {
                this._width = width;
                this._hasRelativeWidth = false;
                this.onDimensionsChanged();
            }

            /**
             * Get the height of this element in pixels. For elements with a relative height the calculated height based on the element's parent is used.
             * @returns {number} The calculated height in pixels.
             */

        }, {
            key: "getPixelHeight",
            value: function getPixelHeight() {
                if (this._parent == null) {
                    return this._height;
                } else if (this._isRemainingFiller && !this._parent._isHorizontal) {
                    return this._parent.getRemainingHeight();
                } else if (this._hasRelativeHeight) {
                    if (!this._parent._isHorizontal) {
                        return (this._parent.getContentHeight() - this._parent.getTotalChildMarginHeights()) / 100 * this._height;
                    } else {
                        return this._parent.getContentHeight() / 100 * this._height;
                    }
                } else {
                    return this._height;
                }
            }

            /**
             * Set the element's height in pixels.
             * @param {number} height The new height in pixels. 
             */

        }, {
            key: "setHeight",
            value: function setHeight(height) {
                this._height = height;
                this._hasRelativeHeight = false;
                this.onDimensionsChanged();
            }

            /**
             * Get the relative width as a percentage. 
             * If the element does not have a relative width the relative width is calculated using the real width of the parent.
             * @returns The width as a percentage relative to the parent.
             */

        }, {
            key: "getRelativeWidth",
            value: function getRelativeWidth() {
                if (this._hasRelativeWidth) {
                    return this._width;
                } else {
                    if (this._parent != null) {
                        return this._width / this._parent.getContentWidth() * 100;
                    }
                    throw new Error("The relative width could not be calculated since this element does not have a parent");
                }
            }

            /**
             * Set the relative width as a percentage.
             * @param {number} percentage The width as a percentage.
             */

        }, {
            key: "setRelativeWidth",
            value: function setRelativeWidth(percentage) {
                this._width = percentage;
                this._hasRelativeWidth = true;
                this.onDimensionsChanged();
            }

            /**
             * Get the relative height as a percentage. 
             * If the element does not have a relative height the relative height is calculated using the real height of the parent.
             * @returns The height as a percentage relative to the parent.
             */

        }, {
            key: "getRelativeHeight",
            value: function getRelativeHeight() {
                if (this._hasRelativeHeight) {
                    return this._height;
                } else {
                    if (this._parent != null) {
                        return this._height / this._parent.getContentHeight() * 100;
                    }
                    throw new Error("The relative height could not be calculated since this element does not have a parent");
                }
            }

            /**
             * Set the relative height as a percentage.
             * @param {number} percentage The height as a percentage.
             */

        }, {
            key: "setRelativeHeight",
            value: function setRelativeHeight(percentage) {
                this._height = percentage;
                this._hasRelativeHeight = true;
                this.onDimensionsChanged();
            }

            /**
             * @typedef {Object} Margins The spacing outside of the element.
             * @property {number} top       - The margin at the top of the element.
             * @property {number} bottom    - The margin at the bottom of the element.
             * @property {number} left      - The left side margin of the element.
             * @property {number} right     - The right side margin of the element.
             */

            /**
             * Get the margins (spacing outside of the element) on this element.
             * @returns {Margins} The margins for each side of the element.
             */

        }, {
            key: "getMargins",
            value: function getMargins() {
                return {
                    top: this._marginTop,
                    bottom: this._marginBottom,
                    left: this._marginLeft,
                    right: this._marginRight
                };
            }

            /**
             * Set the margins (spacing outside of the element).
             * @param {*} top The margin at the top of the element.
             * @param {*} bottom The margin at the bottom of the element.
             * @param {*} left The left side margin of the element.
             * @param {*} right The right side margin of the element.
             */

        }, {
            key: "setMargins",
            value: function setMargins(top, bottom, left, right) {
                this._marginTop = top;
                this._marginBottom = bottom;
                this._marginLeft = left;
                this._marginRight = right;
            }

            /**
             * Get the reference to the window at the root of the window tree.
             * @returns {Window|null} Reference to the window. Can be null if the element or its parents aren't part of a window.
             */

        }, {
            key: "getWindow",
            value: function getWindow() {
                if (this._parent == null) return null;
                return this._parent.getWindow();
            }

            /**
             * Request a synchronization with the real widgets. 
             * Values on this element and its children will be applied to the OpenRCT2 Plugin API UI widgets. 
             * The synchronization is performed at the next window update.
             */

        }, {
            key: "requestSync",
            value: function requestSync() {
                var window = this.getWindow();
                if (window != null && window.isOpen()) {
                    this._requireSync = true;
                }
            }

            /**
             * Check if this element, or one of its parents has requested a synchronization update.
             * @returns {boolean} True if this element, or one of its parents has requested a synchronization update.
             */

        }, {
            key: "requiresSync",
            value: function requiresSync() {
                if (this._parent != null) {
                    return this._requireSync || this._parent.requiresSync();
                }
                return this._requireSync;
            }

            /**
             * Update the dimensions of this element recursively and request for the OpenRCT2 Plugin API UI widgets to be updated.
             */

        }, {
            key: "onDimensionsChanged",
            value: function onDimensionsChanged() {
                if (this._parent != null) {
                    this._parent._updateChildDimensions();
                }
                this.requestSync();
            }
        }, {
            key: "_getDescription",
            value: function _getDescription() {
                return null;
            }
        }, {
            key: "_update",
            value: function _update() {
                this._requireSync = false;
            }
        }, {
            key: "_getWindowPixelPosition",
            value: function _getWindowPixelPosition() {
                if (this._parent) {
                    var pos = this._parent._getWindowPixelPosition();
                    pos.x += this._x;
                    pos.y += this._y;
                    return pos;
                } else {
                    return { x: this._x, y: this._y };
                }
            }
        }]);

        return Element;
    }();

    /**
     * The box class is the base class for UI elements that is able to hold children.
     * @extends Element
     */


    var Box = function (_Element) {
        _inherits(Box, _Element);

        function Box() {
            _classCallCheck(this, Box);

            var _this = _possibleConstructorReturn(this, (Box.__proto__ || Object.getPrototypeOf(Box)).call(this));

            _this._width = 100;

            _this.setPadding(3, 3, 4, 4);

            _this._isHorizontal = false;

            _this._children = [];
            return _this;
        }

        /**
         * Add a child to this box.
         * @param {Element} child The element to add as a child.
         */


        _createClass(Box, [{
            key: "addChild",
            value: function addChild(child) {
                this._children.push(child);
                child._parent = this;

                this._updateChildDimensions();
            }

            /**
             * Get the inner width of this box in pixels. The inner width is calculated by taking the width in pixels minus the paddings.
             * @returns {number} The inner width in pixels.
             */

        }, {
            key: "getContentWidth",
            value: function getContentWidth() {
                return this.getPixelWidth() - this._paddingLeft - this._paddingRight;
            }

            /**
             * Get the inner height of this box in pixels. The inner height is calculated by taking the height in pixels minus the paddings.
             * @returns {number} The inner width in pixels.
             */

        }, {
            key: "getContentHeight",
            value: function getContentHeight() {
                return this.getPixelHeight() - this._paddingTop - this._paddingBottom;
            }

            /**
             * @typedef {Object} Padding The spacing inside of the element.
             * @property {number} top       - The padding at the top of the element.
             * @property {number} bottom    - The padding at the bottom of the element.
             * @property {number} left      - The left side padding of the element.
             * @property {number} right     - The right side padding of the element.
             */

            /**
             * Get the padding (spacing inside of the element) on this element.
             * @returns { Padding } The padding for each side of the element.
             */

        }, {
            key: "getPadding",
            value: function getPadding() {
                return {
                    top: this._paddingTop,
                    bottom: this._paddingBottom,
                    left: this._paddingLeft,
                    right: this._paddingRight
                };
            }

            /**
             * Set the padding (spacing inside of the element).
             * @param {*} top The margin at the top of the element.
             * @param {*} bottom The margin at the bottom of the element.
             * @param {*} left The left side margin of the element.
             * @param {*} right The right side margin of the element.
             */

        }, {
            key: "setPadding",
            value: function setPadding(top, bottom, left, right) {
                this._paddingTop = top;
                this._paddingBottom = bottom;
                this._paddingLeft = left;
                this._paddingRight = right;
            }
        }, {
            key: "onDimensionsChanged",
            value: function onDimensionsChanged() {
                this._updateChildDimensions();
                for (var i = 0; i < this._children.length; i++) {
                    var child = this._children[i];
                    if (child._hasRelativeWidth || child._hasRelativeHeight) {
                        child.onDimensionsChanged();
                    }
                }
                _get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "onDimensionsChanged", this).call(this);
            }

            /**
             * Calculate the total width of all the margins of the children that are used between the child elements.
             */

        }, {
            key: "getTotalChildMarginWidths",
            value: function getTotalChildMarginWidths() {
                var width = 0;
                for (var i = 0; i < this._children.length; i++) {
                    var child = this._children[i];
                    if (i < this._children.length - 1) {
                        width += Math.max(child._marginRight, this._children[i + 1]._marginLeft);
                    }
                }
                return width;
            }

            /**
             * Calculate the total height of all the margins of the children that are used between the child elements.
             */

        }, {
            key: "getTotalChildMarginHeights",
            value: function getTotalChildMarginHeights() {
                var height = 0;
                for (var i = 0; i < this._children.length; i++) {
                    var child = this._children[i];
                    if (i < this._children.length - 1) {
                        height += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
                    }
                }
                return height;
            }
        }, {
            key: "_updateChildDimensions",
            value: function _updateChildDimensions() {}
        }, {
            key: "_getDescription",
            value: function _getDescription() {
                var fullDesc = [];
                for (var i = 0; i < this._children.length; i++) {
                    var rDesc = this._children[i]._getDescription();
                    if (rDesc != null) {
                        if (Array.isArray(rDesc)) {
                            fullDesc = fullDesc.concat(rDesc);
                        } else {
                            fullDesc.push(rDesc);
                        }
                    }
                }
                return fullDesc;
            }
        }, {
            key: "_update",
            value: function _update() {
                for (var i = 0; i < this._children.length; i++) {
                    this._children[i]._update();
                }
                this._requireSync = false;
            }
        }]);

        return Box;
    }(Element);

    /**
     * The vertical box is an element that holds children and positions them vertically in a top to bottom fasion.
     */


    var VerticalBox = function (_Box) {
        _inherits(VerticalBox, _Box);

        function VerticalBox() {
            _classCallCheck(this, VerticalBox);

            var _this2 = _possibleConstructorReturn(this, (VerticalBox.__proto__ || Object.getPrototypeOf(VerticalBox)).call(this));

            _this2._remainingHeightFiller = null;
            return _this2;
        }

        _createClass(VerticalBox, [{
            key: "addChild",
            value: function addChild(child) {
                _get(VerticalBox.prototype.__proto__ || Object.getPrototypeOf(VerticalBox.prototype), "addChild", this).call(this, child);
                if (child._hasRelativeHeight) {
                    child.onDimensionsChanged();
                }
            }

            /**
             * Calculate the left over vertical space.
             * @returns {number} The remaining vertical space in pixels.
             */

        }, {
            key: "getRemainingHeight",
            value: function getRemainingHeight() {
                var height = 0;
                for (var i = 0; i < this._children.length; i++) {
                    var child = this._children[i];
                    if (!child._isRemainingFiller) height += child.getPixelHeight();

                    if (i < this._children.length - 1) {
                        height += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
                    }
                }
                return this.getContentHeight() - height;
            }

            /**
             * Set a child element to take up the remaining vertical space.
             * @param {Element} child Reference to an element to fill the remaining vertical space. This element has to be a child of the box. 
             */

        }, {
            key: "setRemainingHeightFiller",
            value: function setRemainingHeightFiller(child) {
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
        }, {
            key: "_updateChildDimensions",
            value: function _updateChildDimensions() {
                var yPos = this._paddingTop;
                for (var i = 0; i < this._children.length; i++) {
                    var child = this._children[i];
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
        }]);

        return VerticalBox;
    }(Box);

    /**
     * A window that can hold elements.
     */


    var Window = function (_VerticalBox) {
        _inherits(Window, _VerticalBox);

        /**
         * @param {string} classification A custom unique "type" identifier to identify the window's classification by. This is used to manage multiple instances of the same kind of windows.
         * @param {string} [title] The window title that is displayed in the window's top bar.
         */
        function Window(classification) {
            var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

            _classCallCheck(this, Window);

            var _this3 = _possibleConstructorReturn(this, (Window.__proto__ || Object.getPrototypeOf(Window)).call(this));

            _this3._hasRelativeWidth = false;
            _this3._width = 100;

            _this3._height = _this3._paddingTop + _this3._paddingBottom;

            _this3._handle = null;

            _this3._title = title;
            _this3._classification = classification;

            _this3._canResizeHorizontally = false;
            _this3._minWidth = 100;
            _this3._maxWidth = 100;
            _this3._canResizeVertically = false;
            _this3._minHeight = 100;
            _this3._maxHeight = 100;
            return _this3;
        }

        /**
         * Open the window.
         */


        _createClass(Window, [{
            key: "open",
            value: function open() {
                var desc = this._getDescription();
                this._handle = ui.openWindow(desc);
            }

            /**
             * Check if the window is open.
             * @returns {boolean} True if the window is open.
             */

        }, {
            key: "isOpen",
            value: function isOpen() {
                return this._handle != null;
            }

            /**
             * Enable or disable the window's horizontal resizeability.
             * @param {boolean} canResizeHorizontally Wether or not the window should be set to be resizeable.
             * @param {number} [minWidth] The minimum width that the window can resize to. Should be lower or equal to the width of the window.
             * @param {number} [maxWidth] The maximum width that the window can resize to. Should be higher or equal to the width of the window.
             */

        }, {
            key: "setHorizontalResize",
            value: function setHorizontalResize(canResizeHorizontally) {
                var minWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var maxWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

                this._canResizeHorizontally = canResizeHorizontally;
                if (canResizeHorizontally) {
                    this._minWidth = minWidth;
                    this._maxWidth = maxWidth;
                    if (minWidth == 0) {
                        this._minWidth = this._width;
                    }
                    if (maxWidth == 0) {
                        this._minWidth = this._width;
                    }
                } else {
                    this._minWidth = this._width;
                    this._maxWidth = this._width;
                }
            }

            /**
             * Enable or disable the window's vertical resizeability.
             * @param {boolean} canResizeHorizontally Wether or not the window should be set to be resizeable.
             * @param {number} [minHeight] The minimum height that the window can resize to. Should be lower or equal to the height of the window.
             * @param {number} [maxHeight] The maximum height that the window can resize to. Should be higher or equal to the height of the window.
             */

        }, {
            key: "setVerticalResize",
            value: function setVerticalResize(canResizeVertically) {
                var minHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var maxHeight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

                this._canResizeVertically = canResizeVertically;
                if (canResizeVertically) {
                    this._minHeight = minHeight;
                    this._maxHeight = maxHeight;
                    if (minHeight == 0) {
                        this._minHeight = this._height;
                    }
                    if (maxHeight == 0) {
                        this._maxHeight = this._height;
                    }
                } else {
                    this._minHeight = this._height;
                    this._maxHeight = this._height;
                }
            }
        }, {
            key: "setWidth",
            value: function setWidth(pixels) {
                if (this.isOpen()) {
                    this._handle.width = pixels;
                }
                _get(Window.prototype.__proto__ || Object.getPrototypeOf(Window.prototype), "setWidth", this).call(this, pixels);
                if (!this._canResizeHorizontally) {
                    this._minWidth = this._width;
                    this._maxWidth = this._width;
                }
            }
        }, {
            key: "setHeight",
            value: function setHeight(pixels) {
                if (pixels < 16) pixels = 16;
                if (this.isOpen()) {
                    this._handle.height = pixels;
                }
                _get(Window.prototype.__proto__ || Object.getPrototypeOf(Window.prototype), "setHeight", this).call(this, pixels);
                if (!this._canResizeVertically) {
                    this._minHeight = this._height;
                    this._maxHeight = this._height;
                }
            }
        }, {
            key: "getPixelWidth",
            value: function getPixelWidth() {
                return this._width;
            }
        }, {
            key: "getPixelHeight",
            value: function getPixelHeight() {
                return this._height;
            }
        }, {
            key: "setPadding",
            value: function setPadding(top, bottom, left, right) {
                this._paddingTop = top + 15;
                this._paddingBottom = bottom + 1;
                this._paddingLeft = left;
                this._paddingRight = right;
            }
        }, {
            key: "getWindow",
            value: function getWindow() {
                return this;
            }
        }, {
            key: "_getDescription",
            value: function _getDescription() {
                var _this4 = this;

                var widgets = _get(Window.prototype.__proto__ || Object.getPrototypeOf(Window.prototype), "_getDescription", this).call(this);

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
                    onUpdate: function onUpdate() {
                        _this4._update();
                    }
                };
            }
        }, {
            key: "_update",
            value: function _update() {
                if (this._handle.width != this._width || this._handle.height != this._height) {
                    this.setWidth(this._handle.width);
                    this.setHeight(this._handle.height);
                }
                _get(Window.prototype.__proto__ || Object.getPrototypeOf(Window.prototype), "_update", this).call(this);
                this._requireSync = false;
            }
        }]);

        return Window;
    }(VerticalBox);

    var numberCount = 0;
    function NumberGen() {
        numberCount++;
        return numberCount - 1;
    }

    /**
     * This callback is called when a widget is click.
     * @callback onClickCallback
     */

    /**
     * This callback is called when the value on an input widget has changed.
     * @callback onChangeCallback
     * @param {*} value The new value of the input widget.
     */

    /**
     * The widget base class that wraps around the OpenRCT2 Plugin API UI widgets, and is mostly used for input widgets and labels.
     * @extends Element
     */

    var Widget = function (_Element2) {
        _inherits(Widget, _Element2);

        function Widget() {
            _classCallCheck(this, Widget);

            var _this5 = _possibleConstructorReturn(this, (Widget.__proto__ || Object.getPrototypeOf(Widget)).call(this));

            _this5.setMargins(2, 4, 2, 2);
            _this5._type = "none";
            _this5._name = NumberGen();
            return _this5;
        }

        /**
         * Get the reference to the OpenRCT2 Plugin API UI widget.
         * @returns {Widget} Reference to an OpenRCT2 Plugin API UI widget.
         */


        _createClass(Widget, [{
            key: "getHandle",
            value: function getHandle() {
                var window = this.getWindow();
                if (window != null) {
                    return window._handle.findWidget(this._name);
                }
                return null;
            }
        }, {
            key: "_getDescription",
            value: function _getDescription() {
                var calcPos = this._getWindowPixelPosition();
                return {
                    type: this._type,
                    name: this._name,
                    x: calcPos.x,
                    y: calcPos.y,
                    width: this.getPixelWidth(),
                    height: this.getPixelHeight()
                };
            }
        }, {
            key: "_update",
            value: function _update() {
                if (this.requiresSync()) {
                    var handle = this.getHandle();
                    var desc = this._getDescription();
                    this._applyDescription(handle, desc);
                }
                this._requireSync = false;
            }
        }, {
            key: "_applyDescription",
            value: function _applyDescription(handle, desc) {
                handle.x = desc.x;
                handle.y = desc.y;
                handle.width = desc.width;
                handle.height = desc.height;
            }
        }]);

        return Widget;
    }(Element);

    Widget.NumberGen = NumberGen;

    /**
     * A text label.
     */

    var Label = function (_Widget) {
        _inherits(Label, _Widget);

        /**
         * @param {string} text The label text.
         */
        function Label() {
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            _classCallCheck(this, Label);

            var _this6 = _possibleConstructorReturn(this, (Label.__proto__ || Object.getPrototypeOf(Label)).call(this));

            _this6._type = "label";
            _this6._text = text;
            _this6._name = _this6._type + "-" + _this6._name;
            _this6._height = 10;
            return _this6;
        }

        /**
         * Get the label text.
         */


        _createClass(Label, [{
            key: "getText",
            value: function getText() {
                return this._text;
            }

            /**
             * Set the label text.
             * @param {string} text 
             */

        }, {
            key: "setText",
            value: function setText(text) {
                this._text = text;
                this.requestSync();
            }
        }, {
            key: "_getDescription",
            value: function _getDescription() {
                var desc = _get(Label.prototype.__proto__ || Object.getPrototypeOf(Label.prototype), "_getDescription", this).call(this);
                desc.text = this._text;
                return desc;
            }
        }, {
            key: "_applyDescription",
            value: function _applyDescription(handle, desc) {
                _get(Label.prototype.__proto__ || Object.getPrototypeOf(Label.prototype), "_applyDescription", this).call(this, handle, desc);
                handle.text = desc.text;
            }
        }]);

        return Label;
    }(Widget);

    /**
     * A button input that can be clicked.
     */


    var Button = function (_Widget2) {
        _inherits(Button, _Widget2);

        /**
         * @param {string} [text] The button text.
         * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
         */
        function Button() {
            var onClick = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            _classCallCheck(this, Button);

            var _this7 = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this));

            _this7._type = "button";
            _this7._name = _this7._type + "-" + _this7._name;
            _this7._height = 13;
            _this7._onClick = onClick;
            return _this7;
        }

        _createClass(Button, [{
            key: "_getDescription",
            value: function _getDescription() {
                var _this8 = this;

                var desc = _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_getDescription", this).call(this);
                desc.onClick = function () {
                    if (_this8._onClick) _this8._onClick();
                };
                return desc;
            }
        }, {
            key: "_applyDescription",
            value: function _applyDescription(handle, desc) {
                _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_applyDescription", this).call(this, handle, desc);
            }
        }]);

        return Button;
    }(Widget);

    /**
     * A checkbox with text behind it.
     */


    var Checkbox = function (_Widget3) {
        _inherits(Checkbox, _Widget3);

        /**
         * @param {*} [text] The text displayed behind the checkbox.
         * @param {import("./Widget").onChangeCallback} [onChange] Callback for when the checkbox is ticked or unticked. The callback's parameter is boolean which is true if the checkbox is checked.
         */
        function Checkbox() {
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
            var onChange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            _classCallCheck(this, Checkbox);

            var _this9 = _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).call(this));

            _this9._type = "checkbox";
            _this9._text = text;
            _this9._name = _this9._type + "-" + _this9._name;
            _this9._height = 10;
            _this9._onChange = onChange;
            _this9._isChecked;
            return _this9;
        }

        /**
         * Check  if the checkbox is checked.
         * @returns {boolean} True if the checkbox is checked.
         */


        _createClass(Checkbox, [{
            key: "isChecked",
            value: function isChecked() {
                return this._isChecked;
            }

            /**
             * Set the state of the checkbox to check or unchecked.
             * @param {boolean} checked True if the checkbox should be checked.
             */

        }, {
            key: "setChecked",
            value: function setChecked(checked) {
                this._isChecked = checked;
                this.requestSync();
            }
        }, {
            key: "_getDescription",
            value: function _getDescription() {
                var _this10 = this;

                var desc = _get(Checkbox.prototype.__proto__ || Object.getPrototypeOf(Checkbox.prototype), "_getDescription", this).call(this);
                desc.text = this._text;
                desc.onChange = function (checked) {
                    _this10._isChecked = checked;
                    if (_this10._onChange) _this10._onChange(checked);
                };
                desc.isChecked = this._isChecked;
                return desc;
            }
        }, {
            key: "_applyDescription",
            value: function _applyDescription(handle, desc) {
                _get(Checkbox.prototype.__proto__ || Object.getPrototypeOf(Checkbox.prototype), "_applyDescription", this).call(this, handle, desc);
                handle.text = desc.text;
            }
        }]);

        return Checkbox;
    }(Widget);

    /**
     * The horizontal box is an element that holds children and positions them horizontally in a left to right fasion.
     */


    var HorizontalBox = function (_Box2) {
        _inherits(HorizontalBox, _Box2);

        function HorizontalBox() {
            _classCallCheck(this, HorizontalBox);

            var _this11 = _possibleConstructorReturn(this, (HorizontalBox.__proto__ || Object.getPrototypeOf(HorizontalBox)).call(this));

            _this11._remainingWidthFiller = null;
            _this11._isHorizontal = true;
            return _this11;
        }

        _createClass(HorizontalBox, [{
            key: "addChild",
            value: function addChild(child) {
                _get(HorizontalBox.prototype.__proto__ || Object.getPrototypeOf(HorizontalBox.prototype), "addChild", this).call(this, child);
                if (child._hasRelativeWidth) {
                    child.onDimensionsChanged();
                }
            }

            /**
             * Calculate the left over horizontal space.
             * @returns {number} The remaining horizontal space in pixels.
             */

        }, {
            key: "getRemainingWidth",
            value: function getRemainingWidth() {
                var width = 0;
                for (var i = 0; i < this._children.length; i++) {
                    var child = this._children[i];
                    if (!child._isRemainingFiller) width += child.getPixelWidth();

                    if (i < this._children.length - 1) {
                        width += Math.max(child._marginRight, this._children[i + 1]._marginLeft);
                    }
                }
                return this.getContentWidth() - width;
            }

            /**
             * Set a child element to take up the remaining horizontal space.
             * @param {Element} child Reference to an element to fill the remaining horizontal space. This element has to be a child of the box. 
             */

        }, {
            key: "setRemainingWidthFiller",
            value: function setRemainingWidthFiller(child) {
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
        }, {
            key: "_updateChildDimensions",
            value: function _updateChildDimensions() {
                var xPos = this._paddingLeft;
                for (var i = 0; i < this._children.length; i++) {
                    var child = this._children[i];
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
        }]);

        return HorizontalBox;
    }(Box);

    /**
     * A dropdown input field with a set number of items that the user can choose from.
     */


    var Dropdown = function (_Widget4) {
        _inherits(Dropdown, _Widget4);

        /**
         * @param {string[]} [items] String list with all the items to display in the dropdown.
         * @param {import("./Widget").onChangeCallback} [onChange] Callback for when a dropdown item is selected. The callback's parameter is the index to the item that was selected.
         */
        function Dropdown() {
            var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var onChange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            _classCallCheck(this, Dropdown);

            var _this12 = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this));

            _this12._type = "dropdown";
            _this12._name = _this12._type + "-" + _this12._name;
            _this12._height = 13;
            _this12._onChange = onChange;
            _this12._items = items.slice(0);
            _this12._selectedIndex = 0;
            return _this12;
        }

        /**
         * Get a copy of the dropdown items list.
         */


        _createClass(Dropdown, [{
            key: "getItems",
            value: function getItems() {
                return this._items.slice(0);
            }

            /**
             * Set the list of dropdown items.
             * @param {string[]} items List of all the items to display.
             */

        }, {
            key: "setItems",
            value: function setItems(items) {
                this._items = items.slice(0);
                this.requestSync();
            }
        }, {
            key: "_getDescription",
            value: function _getDescription() {
                var _this13 = this;

                var desc = _get(Dropdown.prototype.__proto__ || Object.getPrototypeOf(Dropdown.prototype), "_getDescription", this).call(this);
                desc.items = this._items;
                desc.onChange = function (i) {
                    _this13._selectedIndex = i;
                    if (_this13._onChange) _this13._onChange(i);
                };
                desc.selectedIndex = this._selectedIndex;
                return desc;
            }
        }, {
            key: "_applyDescription",
            value: function _applyDescription(handle, desc) {
                _get(Dropdown.prototype.__proto__ || Object.getPrototypeOf(Dropdown.prototype), "_applyDescription", this).call(this, handle, desc);
                handle.items = desc.items;
                desc.selectedIndex = desc.selectedIndex;
            }
        }]);

        return Dropdown;
    }(Widget);

    /**
     * The group box is a vertical box that a border and an optional label.
     */


    var GroupBox = function (_VerticalBox2) {
        _inherits(GroupBox, _VerticalBox2);

        function GroupBox() {
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            _classCallCheck(this, GroupBox);

            var _this14 = _possibleConstructorReturn(this, (GroupBox.__proto__ || Object.getPrototypeOf(GroupBox)).call(this));

            _this14._text = text;
            _this14._name = "groupbox-" + Widget.NumberGen();
            if (_this14._text != "") _this14._paddingTop = 13;else _this14._paddingTop = 8;
            _this14._paddingBottom = 5;
            return _this14;
        }

        /**
         * Get the label text of this groupbox.
         * @returns {string}
         */


        _createClass(GroupBox, [{
            key: "getText",
            value: function getText() {
                return this._text;
            }

            /**
             * Set the groupbox label text. Set to an empty string to remove the label text.
             * @param {string} text
             */

        }, {
            key: "setText",
            value: function setText(text) {
                if (Boolean(this._text.length) != Boolean(text.length)) {
                    if (text.length == 0) {
                        this._paddingTop -= 5;
                    } else {
                        this._paddingTop += 5;
                    }
                    this.onDimensionsChanged();
                }
                this._text = text;
                this.requestSync();
            }

            /**
             * Get the reference to the OpenRCT2 Plugin API UI widget.
             * @returns {Widget} Reference to an OpenRCT2 Plugin API UI widget.
             */

        }, {
            key: "getHandle",
            value: function getHandle() {
                var window = this.getWindow();
                if (window != null) {
                    return window._handle.findWidget(this._name);
                }
                return null;
            }
        }, {
            key: "_getDescription",
            value: function _getDescription() {
                var fullDesc = _get(GroupBox.prototype.__proto__ || Object.getPrototypeOf(GroupBox.prototype), "_getDescription", this).call(this);

                var calcPos = this._getWindowPixelPosition();
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
        }, {
            key: "_update",
            value: function _update() {
                if (this.requiresSync()) {
                    var handle = this.getHandle();
                    var desc = this._getDescription();
                    this._applyDescription(handle, desc[0]);
                }
                _get(GroupBox.prototype.__proto__ || Object.getPrototypeOf(GroupBox.prototype), "_update", this).call(this);
            }
        }, {
            key: "_applyDescription",
            value: function _applyDescription(handle, desc) {
                handle.x = desc.x;
                handle.y = desc.y;
                handle.width = desc.width;
                handle.height = desc.height;
                handle.text = desc.text;
            }
        }]);

        return GroupBox;
    }(VerticalBox);

    /**
     * A number input with an increase and decrease button.
     */


    var Spinner = function (_Widget5) {
        _inherits(Spinner, _Widget5);

        /**
         * Construct a spinner widget. The number of decimal places is set to the number of decimals of either the default value, or the step size whichever has more decimal places.
         * @param {number} [value] The default value of the spinner. 
         * @param {number} [step] The step size with which the spinner increases and decreases the value.
         * @param {import("./Widget").onChangeCallback} [onChange] Callback for when the spinner value changes. The callback's parameter is the new spinner value as a number.
         */
        function Spinner() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
            var onChange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            _classCallCheck(this, Spinner);

            var _this15 = _possibleConstructorReturn(this, (Spinner.__proto__ || Object.getPrototypeOf(Spinner)).call(this));

            _this15._type = "spinner";
            _this15._value = Number(value);
            _this15._step = Number(step);
            _this15._decimals = Math.max(_this15.countDecimals(_this15._step), _this15.countDecimals(_this15._value));
            _this15._name = _this15._type + "-" + _this15._name;
            _this15._height = 13;
            _this15._onChange = onChange;
            return _this15;
        }

        /**
         * Get the number of decimal places that the spinner displays.
         * @return {number}
         */


        _createClass(Spinner, [{
            key: "getDecimalPlaces",
            value: function getDecimalPlaces() {
                return this._decimals;
            }

            /**
             * Set the number of decimal places that the spinner displays.
             * @param {*} decimals 
             */

        }, {
            key: "setDecimalPlaces",
            value: function setDecimalPlaces(decimals) {
                this._decimals = decimals;
                this.requestSync();
            }

            /**
             * Get the spinner value
             * @returns {number}
             */

        }, {
            key: "getValue",
            value: function getValue() {
                return this._value;
            }

            /**
             * Set the spinner value.
             * @param {number} value 
             */

        }, {
            key: "setValue",
            value: function setValue(value) {
                this._value = value;
                this.requestSync();
            }

            /**
             * Get the step size that the spinner value increases and decreases by.
             * @return {number}
             */

        }, {
            key: "getStep",
            value: function getStep() {
                return this._step;
            }

            /**
             * Set the step size that the spinner value increases and decreases by.
             * @param {number} step 
             */

        }, {
            key: "setStep",
            value: function setStep(step) {
                this._step = step;
                this.requestSync();
            }

            /**
             * Get the amount of decimal places of a value.
             * @param {number} val 
             */

        }, {
            key: "countDecimals",
            value: function countDecimals(val) {
                if (val % 1 != 0) return val.toString().split(".")[1].length;
                return 0;
            }
        }, {
            key: "_getDescription",
            value: function _getDescription() {
                var _this16 = this;

                var desc = _get(Spinner.prototype.__proto__ || Object.getPrototypeOf(Spinner.prototype), "_getDescription", this).call(this);
                desc.text = this._value.toFixed(this._decimals);
                desc.onIncrement = function () {
                    _this16._value += _this16._step;
                    _this16._value = Number(_this16._value.toFixed(_this16._decimals));
                    if (_this16._onChange) _this16._onChange(_this16._value);
                    _this16.requestSync();
                };
                desc.onDecrement = function () {
                    _this16._value -= _this16._step;
                    _this16._value = Number(_this16._value.toFixed(_this16._decimals));
                    if (_this16._onChange) _this16._onChange(_this16._value);
                    _this16.requestSync();
                };
                desc.isChecked = this._isChecked;
                return desc;
            }
        }, {
            key: "_applyDescription",
            value: function _applyDescription(handle, desc) {
                _get(Spinner.prototype.__proto__ || Object.getPrototypeOf(Spinner.prototype), "_applyDescription", this).call(this, handle, desc);
                handle.text = desc.text;
            }
        }]);

        return Spinner;
    }(Widget);

    /**
     * A button input that can be clicked that has a text label.
     */


    var TextButton = function (_Button) {
        _inherits(TextButton, _Button);

        /**
         * @param {string} [text] The button text.
         * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
         */
        function TextButton() {
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
            var onClick = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            _classCallCheck(this, TextButton);

            var _this17 = _possibleConstructorReturn(this, (TextButton.__proto__ || Object.getPrototypeOf(TextButton)).call(this, onClick));

            _this17._text = text;
            return _this17;
        }

        /**
         * Get the button text.
         */


        _createClass(TextButton, [{
            key: "getText",
            value: function getText() {
                return this._text;
            }

            /**
             * Set the button text.
             * @param {string} text 
             */

        }, {
            key: "setText",
            value: function setText(text) {
                this._text = text;
                this.requestSync();
            }
        }, {
            key: "_getDescription",
            value: function _getDescription() {
                var desc = _get(TextButton.prototype.__proto__ || Object.getPrototypeOf(TextButton.prototype), "_getDescription", this).call(this);
                desc.text = this._text;
                return desc;
            }
        }, {
            key: "_applyDescription",
            value: function _applyDescription(handle, desc) {
                _get(TextButton.prototype.__proto__ || Object.getPrototypeOf(TextButton.prototype), "_applyDescription", this).call(this, handle, desc);
                handle.text = desc.text;
            }
        }]);

        return TextButton;
    }(Button);

    /**
     * An image button input that can be clicked.
     */


    var ImageButton = function (_Button2) {
        _inherits(ImageButton, _Button2);

        /**
         * @param {number} [image] The image index to display.
         * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
         */
        function ImageButton() {
            var image = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var onClick = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            _classCallCheck(this, ImageButton);

            var _this18 = _possibleConstructorReturn(this, (ImageButton.__proto__ || Object.getPrototypeOf(ImageButton)).call(this, onClick));

            _this18._image = image;
            return _this18;
        }

        /**
         * Get the button image index.
         */


        _createClass(ImageButton, [{
            key: "getImage",
            value: function getImage() {
                return this._image;
            }

            /**
             * Set the button image index.
             * @param {number} image The image index to display. 
             */

        }, {
            key: "setImage",
            value: function setImage(image) {
                this._image = image;
                this.requestSync();
            }
        }, {
            key: "_getDescription",
            value: function _getDescription() {
                var desc = _get(ImageButton.prototype.__proto__ || Object.getPrototypeOf(ImageButton.prototype), "_getDescription", this).call(this);
                desc.image = this.image;
                return desc;
            }
        }, {
            key: "_applyDescription",
            value: function _applyDescription(handle, desc) {
                _get(ImageButton.prototype.__proto__ || Object.getPrototypeOf(ImageButton.prototype), "_applyDescription", this).call(this, handle, desc);
                handle.image = desc.image;
            }
        }]);

        return ImageButton;
    }(Button);

    /**
     * The namespace for OliUI.
     * @namespace
     */


    var Oui = {
        Window: Window,
        VerticalBox: VerticalBox,
        HorizontalBox: HorizontalBox,
        GroupBox: GroupBox,
        Widgets: {
            Label: Label,
            /**
             * Alias for TextButton. See Oui.BaseClasses.Button for the button base class.
             */
            Button: TextButton,
            TextButton: TextButton,
            ImageButton: ImageButton,
            Checkbox: Checkbox,
            Dropdown: Dropdown,
            Spinner: Spinner
        },
        BaseClasses: {
            Element: Element,
            Box: Box,
            Widget: Widget,
            Button: Button
        }
    };

    // Expose the OpenRCT2 to Visual Studio Code's Intellisense


    function main() {
        ui.registerMenuItem("OliUI Demo", function () {

            var myWindow = new Oui.Window("My Window");
            myWindow.setWidth(300);

            {
                var groupBox = new Oui.GroupBox("Group Box");
                myWindow.addChild(groupBox);

                {
                    var label = new Oui.Widgets.Label("Label");
                    groupBox.addChild(label);
                }

                {
                    var button = new Oui.Widgets.Button("Click Me", function () {
                        if (groupBox.getText() == "") groupBox.setText("Group Box");else groupBox.setText("");
                    });
                    groupBox.addChild(button);
                }

                {
                    var checkBox = new Oui.Widgets.Checkbox("Checkbox", function () {
                        console.log("On change");
                    });
                    groupBox.addChild(checkBox);
                }

                {
                    var dropdown = new Oui.Widgets.Dropdown(["Option A", "Option B", "Option C"], function (i) {
                        console.log("On change " + i);
                    });
                    groupBox.addChild(dropdown);
                }

                {
                    var spinner = new Oui.Widgets.Spinner(0, 0.1, function (val) {
                        console.log("On change " + val);
                    });
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
})();
