import {ASceneNodeModel} from "../base";
import {VertexArray3D} from "../../../ageometry";
import {ATexture} from "../../../arender/ATexture";
import {AObject} from "../../../aobject";
import {ACamera} from "../../camera";
import {AShaderMaterial} from "../../material";


export class AMeshModel extends ASceneNodeModel{
    constructor() {
        super();
    }

    get material():AShaderMaterial{return this._material as AShaderMaterial;}
    get verts():VertexArray3D{
        return this.geometry.verts as VertexArray3D;
    }
    set verts(v:VertexArray3D){
        this.geometry.verts = v;
    }

}
