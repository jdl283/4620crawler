import {ASceneNodeModel} from "../base/ASceneNodeModel";
import {VertexArray2D} from "../../../ageometry";
import {ASerializable} from "../../../aserial";


@ASerializable("A2DPolygonModel")
export class A2DPolygonModel extends ASceneNodeModel{
    get verts(){
        return this.geometry.verts as VertexArray2D;
    }
    set verts(v:VertexArray2D){
        this.geometry.verts = v;
    }

    constructor() {
        super();
        this.verts = new VertexArray2D();
        // this.color = new Color(0.5, 0.5, 0.5);
        // this.color = Color.Random();
    }

    // recenter(){
    //     for(let ip=0;ip<this.verts.length;ip++){
    //         let p=this.verts.position.getAt(ip);
    //     }
    // }

}


