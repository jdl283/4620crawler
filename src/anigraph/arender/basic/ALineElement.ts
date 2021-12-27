// import {ALineSegmentsElement, ARenderElement, Color, VertexArray, VertexArray2D} from "src/anigraph/arender";
import {ALineSegmentsElement} from "./ALineSegmentsElement";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {Line2} from "three/examples/jsm/lines/Line2";

export class ALineElement extends ALineSegmentsElement{
    get geometry():LineGeometry{
        return this._geometry as LineGeometry;
    }
    get threejs():Line2{
        return this._element as Line2;
    }
    _createLineGeometry() {
        this._geometry = new LineGeometry();
    }
}

