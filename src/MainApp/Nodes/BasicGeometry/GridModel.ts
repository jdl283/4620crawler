import {AMeshModel} from "../../../anigraph/amvc/node/mesh/AMeshModel";
import {AObjectState, ASerializable, VertexArray3D} from "../../../anigraph";
import * as THREE from "three";

@ASerializable("GridModel")
export class GridModel extends AMeshModel{
    @AObjectState resolution:[number,number];
    @AObjectState sizeWH:[number,number];
    constructor() {
        super();
        this.resolution = [20,20];
        this.sizeWH=[100,100];
        const self = this;
        this.subscribe(this.addStateKeyListener('resolution',()=>{
            self.updateGeometry();
        }))
    }

    static async CreateDefaultNode(width:number=100, height:number=100, resolutionX:number=100, resolutionY:number=100){
        let g = new GridModel();
        g.sizeWH= [width, height];
        g.resolution = [resolutionX,resolutionY];
        return g;
    }

    updateGeometry(){
        this.verts = VertexArray3D.IndexedGrid(this.sizeWH[0], this.sizeWH[1], this.resolution[0], this.resolution[1]);
    }
}
