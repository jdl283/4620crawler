import {AMeshModel} from "../../../anigraph/amvc/node/mesh/AMeshModel";
import {AObjectState, ASerializable, VertexArray3D} from "../../../anigraph";
import * as THREE from "three";

@ASerializable("SphereModel")
export class SphereModel extends AMeshModel{
    @AObjectState nSegments:[number,number];
    @AObjectState radius:number;
    constructor() {
        super();
        this.nSegments=[50,50];
        this.radius = 1;
        const self = this;
        this.subscribe(this.addStateKeyListener('nSegments',()=>{
            self.updateGeometry();
        }))

        this.subscribe(this.addStateKeyListener('radius',()=>{
            self.updateGeometry();
        }))
    }

    static async CreateDefaultNode(){
        let s = new SphereModel();
        s.radius = 100;
        s.nSegments=[100,100];
        return s;
    }

    updateGeometry(){
        this.verts = VertexArray3D.Sphere(this.radius, this.nSegments[0], this.nSegments[1]);
    }
}
