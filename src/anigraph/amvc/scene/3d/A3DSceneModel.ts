import {ASceneModel} from "../ASceneModel";
import {ASceneNodeModel} from "../../node/base/ASceneNodeModel";
import {Color, Mat3, V2, Vec2} from "../../../amath";
import {VertexArray2D} from "../../../ageometry";
import {AAmbientLightModel} from "../../node/lights/AAmbientLightModel";


export abstract class A3DSceneModel<NodeModelType extends ASceneNodeModel> extends ASceneModel<NodeModelType>{
    // protected _DefaultNodeClass: = NodeModelType;
    // protected abstract _DefaultNodeClass:AModelClassInterface<NodeModelType>;
    abstract NewNode():NodeModelType;

    constructor(name:string) {
        super(name);
        this.ambientLight = new AAmbientLightModel(Color.FromString('#ffffff'));
    }

    CreateTestModel(position?:Vec2, color?:Color){
        position = position?position:V2();
        color = color?color:Color.FromString('#55aa55');
        let newShape = this.NewNode();
        let sz = 25;
        let sq=0.5;
        let tform = Mat3.Translation2D(position).times(Mat3.Rotation(Math.PI/3)).times(Mat3.Translation2D(sz*3, sz*2));
        let verts = new VertexArray2D();
        verts.position.push(V2(-sz, -sz));
        verts.position.push(V2(0,-sz*sq));
        verts.position.push(V2(sz, -sz));
        verts.position.push(V2(sz*sq, 0));
        verts.position.push(V2(sz, sz));
        verts.position.push(V2(-sz, sz));
        newShape.color = color;
        newShape.verts.ApplyMatrix(tform);
        return newShape;
    }

    CreateTestSquare(position?:Vec2, color?:Color){
        position = position?position:V2();
        // color = color?color:Color.FromString('#55aa55');
        // color = color?color:Color.FromString('#ffbb00');
        color = color?color:Color.FromString('#888888');
        let newShape = this.NewNode();
        let sz = 25;
        let verts = new VertexArray2D();
        verts.position.push(V2(sz, -sz));
        verts.position.push(V2(-sz, -sz));
        verts.position.push(V2(-sz, sz));
        verts.position.push(V2(sz, sz));

        newShape.color = color;
        newShape.verts = verts;
        // newShape.recenterAnchor();
        // newShape.verts = verts;
        // this.sceneController.model.addNode(newShape);
        return newShape;
    }

}


//
// export class A3DSceneModel<NodeModelType extends ASceneNodeModel> extends ABase2DSceneModel<NodeModelType>{
//     protected _DefaultNodeClass:AModelClassInterface<NodeModelType>=ASceneNodeModel;
// }
