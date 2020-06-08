import Widget from "./Widget";

/**
 * A dropdown input field with a set number of items that the user can choose from.
 */
class Dropdown extends Widget {
    /**
     * @param {string[]} [items] String list with all the items to display in the dropdown.
     * @param {import("./Widget").onChangeCallback} [onChange] Callback for when a dropdown item is selected. The callback's parameter is the index to the item that was selected.
     */
    constructor(items = [], onChange = null) {
        super();

        this._type = "dropdown";
        this._name = this._type + "-" + this._name;
        this._height = 13;
        this._onChange = onChange;
        this._items = items.slice(0);
        this._selectedIndex = 0;
    }

    /**
     * Set the on change callback.
     * @param {import("./Widget").onChangeCallback} onChange 
     */
    setOnChange(onChange) {
        this._onChange = onChange;
    }

    /**
     * Get a copy of the dropdown items list.
     */
    getItems() {
        return this._items.slice(0);
    }

    /**
     * Set the list of dropdown items.
     * @param {string[]} items List of all the items to display.
     */
    setItems(items) {
        this._items = items.slice(0);
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.items = this._items;
        desc.onChange = (i) => {
            this._selectedIndex = i;
            if (this._onChange)
                this._onChange.call(this, i);
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

export default Dropdown;