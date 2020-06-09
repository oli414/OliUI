import Widget from "./Widget";

/**
 * WIP. Viewport widget does not work as expected yet. Only use for testing.
 * A viewport widget. The size of the viewport widget cannot be changed while the window is open.
 */
class ViewportWidget extends Widget {
    /**
     * @param {number} [viewX]
     * @param {number} [viewY] 
     */
    constructor(viewX = 0, viewY = 0) {
        super();

        this._type = "viewport";
        this._name = this._type + "-" + this._name;
        this._height = 64;

        this._viewX = viewX;
        this._viewY = viewY;
        this._zoom = 0;
        this._rotation = 0;

        this._scrollView = false;

        this._initMove = false;
    }

    /**
     * Set the viewport's focus position.
     * @param {number} viewX 
     * @param {number} viewY 
     */
    setView(viewX, viewY) {
        this._viewX = viewX;
        this._viewY = viewY;
        this._scrollView = false;

        let handle = this.getHandle();
        if (handle != null)
            handle.viewport.moveTo({ x: viewX, y: viewY });
    }

    scrollView(viewX, viewY) {
        this._viewX = viewX;
        this._viewY = viewY;
        this._scrollView = true;

        let handle = this.getHandle();
        if (handle != null)
            handle.viewport.scrollTo({ x: viewX, y: viewY });
    }

    /**
     * Set the viewport's zoom level. 0 is fully zoomed in.
     * @param {number} zoomLevel 
     */
    setZoom(zoomLevel) {
        this._zoom = zoomLevel;
        this.requestSync();
    }

    /**
     * Set the viewport's rotation.
     * @param {number} rotation
     */
    setRotation(rotation) {
        this._rotation = rotation;
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        this._initMove = true;
        this.requestRefresh();
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.viewport.rotation = this._rotation;
        handle.viewport.zoom = this._zoom;
        handle.viewport.visibilityFlags = this._visibilityFlags;

        if (this._initMove) {
            handle.viewport.moveTo({ x: this._viewX, y: this._viewY });
            this._initMove = false;
        }
    }

    _update() {
        super._update();
    }
}

export default ViewportWidget;