import {AParticlesModel} from "./AParticlesModel";
import {NodeTransform3D, V3} from "../../amath";
import {VertexArray2D} from "../../ageometry";

export abstract class A2DParticlesModel extends AParticlesModel{
    // @AObjectState transform:NodeTransform2D;
    // @AObjectState verts!:VertexArray2D;

    constructor() {
        super();
        // this.transform = new NodeTransform2D();
        this.verts = new VertexArray2D();
    }

    // getBounds():BoundingBox2D{
    //     let b = new BoundingBox2D();
    //     b.transform = this.getWorldTransform();
    //     b.boundVertexPositionArrray(this.verts.position);
    //     return b;
    // }

    recenterAnchor(){
        let centerPoint = this.getBounds().center??V3();
        this.transform = new NodeTransform3D(this.transform.getMatrix(), centerPoint);
    }

}
