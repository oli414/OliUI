import Widget from "./Widget";

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

    setItems(items) {
        this._items = items.slice(0);
        this.requestSync();
    }

    getDescription() {
        let desc = super.getDescription();
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
        handle.onChange = desc.onChange;
        handle.items = desc.items;
        desc.selectedIndex = desc.selectedIndex;
    }
}

export default Dropdown;