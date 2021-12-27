import {ATriangleMeshElement} from "../../../anigraph/arender/basic/ATriangleMeshElement";
import {
    AMaterial,
    AObjectState,
    Color,
    NodeTransform3D,
    Quaternion,
    V2,
    V3,
    V4,
    Vec2,
    Vec3,
    VertexArray3D
} from "../../../anigraph";
import {RingSegment} from "./RingSegment";
import * as THREE from "three";


export class RingElement extends ATriangleMeshElement{
    protected segment!: RingSegment;
    nSamples:number=20
    isSmooth:boolean=true;
    colors:Color[]=[];
    get radius(){return this.segment.radius;}
    get height(){return this.segment.length;}

    static CreateSegment(segment:RingSegment, material?:AMaterial){
        let element = new RingElement();
        element.init(segment.ComputeGeometry(), material?.threejs);
        element.setSegment(segment);
        return element;
    }

    setSegment(segment:RingSegment){
        this.segment=segment;
        this.setVerts(segment.ComputeGeometry());
        this.setTransform(this.segment.getTransform())
    }

}
