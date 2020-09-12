import Widget from "./Widget";

/**
 * A column within a list view.
 */
class ListViewColumn {

    constructor(header = null) {
        this._listView = null;
        this._header = header;
        this._headerTooltip = "";

        this._canSort = false;

        this._widthMode = "auto"; // auto, ratio, fixed
        this._width = 0;
        this._minWidth = -1;
        this._maxWidth = -1;
        this._ratioWidth = 0;
    }

    /**
     * Get the header tooltip.
     */
    getTooltip() {
        return this._headerTooltip;
    }

    /**
     * Set the header tooltip.
     * @param {string} text 
     */
    setTooltip(text) {
        this._headerTooltip = text;
    }

    /**
     * Set wether or not the column can be sorted.
     * @param {boolean} canSort
     */
    setCanSort(canSort) {
        this._canSort = canSort;
        this.requestSync();
    }

    /**
     * Get wether or not the column can be sorted.
     * @returns {boolean}
     */
    canSort() {
        return this._canSort;
    }

    /**
     * Get the sorting order.
     * @returns {SortOrder}
     */
    getSortingOrder() {
        return this._sortOrder;
    }

    /**
     * Get the width mode ("auto", "ratio" or "fixed")
     * @returns {string}
     */
    getWidthMode() {
        return this._widthMode;
    }

    /**
     * Get the fixed width of the column if set.
     * @returns {number} 
     */
    getWidth() {
        return this._width;
    }

    /**
     * Set the fixed width of the column. Set to -1 to make the width dynamic.
     * @param {number} width 
     */
    setWidth(width) {
        if (width == -1) {
            this._widthMode = "auto";
        }
        this._widthMode = "fixed";
        this._width = width;
        this.requestSync();
    }

    /**
     * Get the ratio width if set.
     * @returns {number}
     */
    getRatioWidth() {
        return this._ratioWidth;
    }

    /**
     * Set the ratio width. All columns in the listview need to have their ratio width set in order for this to work.
     * @param {number} ratio 
     */
    setRatioWidth(ratio) {
        this._widthMode = "ratio";
        this._ratioWidth = ratio;
        this.requestSync();
    }

    /**
     * Get the minimum width if set.
     * @returns {number}
     */
    getMinWidth() {
        return this._minWidth;
    }

    /**
     * Set the minimum width of the column in pixels. The minimum width only works in the "auto" width mode. Set to -1 to disable.
     * @param {*} minWidth 
     */
    setMinWidth(minWidth) {
        this._minWidth = minWidth;
    }

    /**
     * Get the maximum width if set.
     * @returns {number}
     */
    getMaxWidth() {
        return this._minWidth;
    }

    /**
     * Set the maximum width of the column in pixels. The maximum width only works in the "auto" width mode. Set to -1 to disable.
     * @param {*} maxWidth 
     */
    setMaxWidth(maxWidth) {
        this._maxWidth = maxWidth;
    }

    _getDescription() {
        let desc = {
            header: this._header,
            canSort: this._canSort,
            headerTooltip: this._headerTooltip
        };
        if (this._widthMode == "auto") {
            if (this._minWidth > 0) {
                desc.minWidth = this._minWidth;
            }
            if (this._maxWidth > 0) {
                desc.maxWidth = this._maxWidth;
            }
        }
        else if (this._widthMode == "ratio") {
            desc.ratioWidth = this._ratioWidth;
        }
        else if (this._widthMode == "fixed") {
            desc.width = this._width;
        }

        return desc;
    }

    requestSync() {
        if (this._listView != null) {
            this._listView.requestSync();
        }
    }
}

/**
 * @callback onListViewCallback
 * @param {number} row The row/item index
 * @param {number} column The column index
 */

/**
 * A list view to display a list of items in a scrollable box.
 */
class ListView extends Widget {
    /**
     * @param {onListViewCallback} [onClick ]
     */
    constructor(onClick = null) {
        super();

        this._type = "listview";
        this._name = this._type + "-" + this._name;
        this._height = 64;

        this._scrollbars = "vertical";
        this._isStriped = false;
        this._showColumnHeaders = true;
        this._canSelect = false;

        this._columns = [];
        this._items = [];

        this._highlightedRow = -1;
        this._highlightedColumn = -1;

        this._selectedRow = -1;
        this._selectedColumn = -1;

        this._onHighlight = null;
        this._onClick = onClick
    }

    /**
     * Set the on click callback for when an item within the list view is clicked.
     * @param {onListViewCallback} onClick 
     */
    setOnClick(onClick) {
        this._onClick = onClick;
    }

    /**
     * Set the on higlight callback for when an item within the list view is highlighted.
     * @param {onListViewCallback} onHighlight 
     */
    setOnHighlight(onHighlight) {
        this._onHighlight = onHighlight;
    }

    /**
     * @typedef {Object} ListViewCell
     * @property {number} row - The row/item index
     * @property {number} column - The column index
     */

    /**
     * Get the selected cell.
     * @returns {ListViewCell}
     */
    getSelectedCell() {
        return {
            row: this._selectedRow,
            column: this._selectedColumn
        }
    }

    /**
     * Set the selected cell.
     * @param {*} row 
     * @param {*} [column] Default to 0
     */
    setSelectedCell(row, column = 0) {
        this._selectedRow = row;
        this._selectedColumn = column;
        this.requestSync();
    }

    /**
     * Wether or not the items can be selected.
     * @returns {boolean}
     */
    canSelect() {
        return this._canSelect;
    }

    /**
     * Set wether or not the items can be selected.
     * @param {boolean} canSelect 
     */
    setCanSelect(canSelect) {
        this._canSelect = canSelect;
        this.requestSync();
    }

    /**
     * Wether or not to show the column header.
     * @returns {boolean}
     */
    showColumnHeaders() {
        return this._showColumnHeaders;
    }

    /**
     * Wether or not to show the column header. The headers can only be visible when the columns are set.
     * @param {boolean} showColumnHeaders
     */
    setShowColumnHeaders(showColumnHeaders) {
        this._showColumnHeaders = showColumnHeaders;
        this.requestSync();
    }

    /**
     * Wether or not the item color is different for every other item.
     * @returns {boolean}
     */
    isStriped() {
        return this._isStriped;
    }

    /**
     * Set wether or not the item color is different for every other item.
     * @param {boolean} striped
     */
    setIsStriped(striped) {
        this._isStriped = striped;
        this.requestSync();
    }

    /**
     * @param {ListViewColumn[]|string[]} columns 
     */
    setColumns(columns) {
        let originalColumnsSize = this._columns.length;
        if (columns.length > 0) {
            let listViewColumns = columns;

            // Convert string columns to list view columns first
            if (typeof columns[0] === "string") {
                listViewColumns = [];
                for (let i = 0; i < columns.length; i++) {
                    let listViewColumn = new ListViewColumn(columns[i]);
                    listViewColumns.push(listViewColumn);
                }
            }
            for (let i = 0; i < listViewColumns.length; i++) {
                listViewColumns[i]._listView = this;
            }
            this._columns = listViewColumns;
        }
        if (this._columns.length != originalColumnsSize) {
            this.requestRefresh();
        }
        else {
            this.requestSync();
        }
    }

    /**
     * Get all the columns in this list view.
     * @returns {ListViewColumn[]}
     */
    getColumns() {
        return this._columns;
    }

    /**
     * Add an item to the list of items. Either as a string for list views with zero  or one columns, or as a string array with one item for each column.
     * @param {string[]|string} columns 
     */
    addItem(columns) {
        if (this._columns.length > 1 && (typeof columns === "string" || (typeof columns !== "string" && columns.length <= 1))) {
            throw new Error("Expected " + this._columns.length + " but only got one column for the item.");
        }
        if (typeof columns !== "string" && columns.length > 1 && columns.length != this._columns.length) {
            throw new Error("The number of fields in the item is not equal to the number of columns on this list view.");
        }
        if (typeof columns === "string") {
            columns = [columns];
        }
        this._items.push(columns);
        this.requestRefresh();
    }

    /**
     * Get all the items in this list view.
     * @returns {string[][]}
     */
    getItems() {
        return this._items;
    }

    /**
     * Remove item at the specified index.
     * @param {number} index 
     */
    removeItem(index) {
        this._items.splice(index, 1);
        if (this._selectedRow == index)
            this._selectedRow = this._selectedColumn = -1;
        else if (this._selectedRow > index)
            this._selectedRow--;
        this.requestRefresh();
    }

    /**
     * @returns {ScrollbarType}
     */
    getScrollbars() {
        return this._scrollbars;
    }

    /**
     * Set which scrollbars are available on the listview.
     * @param {ScrollbarType} scrollbars 
     */
    setScrollbars(scrollbars) {
        this._scrollbars = scrollbars;
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.scrollbars = this._scrollbars;
        desc.isStriped = this._isStriped;

        desc.onClick = (item, column) => {
            this._selectedRow = item;
            this._selectedColumn = column;
            if (this._onClick != null)
                this._onClick.call(this, this._selectedRow, this._selectedColumn);
        };
        desc.onHighlight = (item, column) => {
            this._highlightedRow = item;
            this._highlightedColumn = column;
            if (this._onHighlight != null)
                this._onHighlight.call(this, this._highlightedRow, this._highlightedColumn);
        };

        desc.showColumnHeaders = this._showColumnHeaders;
        if (this._columns.length == 0)
            desc.showColumnHeaders = false; // Showing column headers when there are no columns causes a crash.

        desc.canSelect = this._canSelect;
        if (this._canSelect && this._selectedRow >= 0 && this._selectedColumn >= 0) {
            desc.selectedCell = {
                row: this._selectedRow,
                column: this._selectedColumn
            };
        }

        let columnDesc = [];
        for (let i = 0; i < this._columns.length; i++) {
            columnDesc.push(this._columns[i]._getDescription());
        }
        desc.columns = columnDesc;

        desc.items = this._items;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.scrollbars = desc.scrollbars;
        handle.isStriped = desc.isStriped;
        handle.showColumnHeaders = desc.showColumnHeaders;
        handle.canSelect = desc.canSelect;
        if (desc.selectedCell) {
            if (handle.selectedCell == null) {
                handle.selectedCell = desc.selectedCell;
            }
            else {
                handle.selectedCell.row = desc.selectedCell.row;
                handle.selectedCell.column = desc.selectedCell.column;
            }
        }

        for (let i = 0; i < handle.columns.length && i < desc.columns.length; i++) {
            handle.columns[i] = desc.columns[i];
        }

        for (let i = 0; i < handle.items.length && i < desc.items.length; i++) {
            for (let j = 0; j < handle.items[i].length && j < desc.items[i].length; j++) {
                handle.items[i][j] = desc.items[i][j];
            }
        }
    }
}

ListView.ListViewColumn = ListViewColumn;

export default ListView;