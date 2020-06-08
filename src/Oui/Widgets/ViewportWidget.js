import Widget from "./Widget";

class Viewport {
    constructor() {
        this.left = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.rotation = 0;
        this.zoom = 0;
        this.visibilityFlags = 0;
    }

    getCentrePosition() {
        return {
            x: this.left + this.right / 2,
            y: this.top + this.bottom / 2
        }
    }
    moveTo(pos) {
        let width = (this.right - this.left);
        let height = (this.bottom - this.top);

        this.left = pos.x - width / 2;
        this.right = pos.x + width / 2;
        this.top = pos.y - height / 2;
        this.bottom = pos.y + height / 2;
        if (pos.z) {
            this.top -= pos.z;
            this.bottom -= pos.z;
        }
    }
    scrollTo(pos) {
        let width = (this.right - this.left);
        let height = (this.bottom - this.top);

        this.left = pos.x - width / 2;
        this.right = pos.x + width / 2;
        this.top = pos.y - height / 2;
        this.bottom = pos.y + height / 2;
    }
}

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
        this._viewport = new Viewport();

        this._viewX = viewX;
        this._viewY = viewY;
    }

    /**
     * Set the viewport's focus position.
     * @param {number} viewX 
     * @param {number} viewY 
     */
    setView(viewX, viewY) {
        this._viewX = viewX;
        this._viewY = viewY;
        this.updateViewport();
    }

    /**
     * Set the viewport's zoom level. 0 is fully zoomed in.
     * @param {number} zoomLevel 
     */
    setZoom(zoomLevel) {
        this._viewport.zoom = zoomLevel;
        this.requestSync();
    }

    /**
     * Set the viewport's rotation.
     * @param {number} rotation
     */
    setRotation(rotation) {
        this._viewport.rotation = rotation;
        this.requestSync();
    }

    /**
     * Recalculate the viewports positions.
     */
    updateViewport() {
        let width = this.getPixelWidth();
        let height = this.getPixelHeight();
        this._viewport.left = this._viewX - width / 2;
        this._viewport.right = this._viewX + width / 2;
        this._viewport.top = this._viewY - height / 2;
        this._viewport.bottom = this._viewY + height / 2;
        this.requestSync();
    }

    _getDescription() {
        let desc = super._getDescription();
        desc.viewport = this._viewport;
        return desc;
    }

    _applyDescription(handle, desc) {
        super._applyDescription(handle, desc);
        handle.viewport.top = desc.viewport.top;
        handle.viewport.bottom = desc.viewport.bottom;
        handle.viewport.left = desc.viewport.left;
        handle.viewport.right = desc.viewport.right;
        handle.viewport.rotation = desc.viewport.rotation;
        handle.viewport.zoom = desc.viewport.zoom;
        handle.viewport.visibilityFlags = desc.viewport.visibilityFlags;
    }

    _update() {
        this.updateViewport();
        super._update();
    }
}

export default ViewportWidget;