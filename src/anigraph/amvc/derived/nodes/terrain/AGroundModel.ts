import {ASceneNodeModel} from "../../../node";
import {VertexArray2D, VertexArray3D} from "../../../../ageometry";
import {ASerializable} from "../../../../aserial";
import {Color} from "../../../../amath";

@ASerializable("AGroundModel")
export class AGroundModel extends ASceneNodeModel{
    constructor() {
        super();
        this.selectable = false;
        this.color=Color.FromRGBA(0,0.5,0,0.2);
        // this.verts = new VertexArray3D();
    }

    get verts():VertexArray3D{
        return this.geometry.verts as VertexArray3D;
    }
    set verts(v:VertexArray3D){
        this.geometry.verts = v;
    }


    getModelGUIControlSpec() {
        let self = this;
        const spec = {
            depth: {
                value: self.transform.position.z,
                min: -5,
                max: 5,
                step: 0.001,
                onChange: (v: any) => {
                    self.transform.position.z = v;
                }
            }
        };
        return {...super.getModelGUIControlSpec(), ...spec}
    }
}
