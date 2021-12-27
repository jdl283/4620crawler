import {ASceneNodeModel} from "../../../node/base/ASceneNodeModel";
import {VertexArray3D} from "../../../../ageometry";
import {ASerializable} from "../../../../aserial";
import {AObjectState} from "../../../../aobject";
import {ATexture} from "../../../../arender/ATexture";


@ASerializable("ASpriteModel")
export class ASpriteModel extends ASceneNodeModel{
    @AObjectState sourceScale!:number;
    public texture!:ATexture;
    get verts(){return this.geometry.verts as VertexArray3D;}
    set verts(v:VertexArray3D){this.geometry.verts = v;}
    constructor(texture?:ATexture) {
        super();
        this.sourceScale = 100;
        if(texture){
            this.setTexture(texture);
        }else {
            this.verts = VertexArray3D.SpriteGeometry(this.texture, this.sourceScale);
        }
    }

    setTexture(tex:ATexture){
        this.texture = tex;
        this.verts = VertexArray3D.SpriteGeometry(this.texture, this.sourceScale);
    }

    static async CreateDefaultNode(){
        let node = new this();
        return node;
    }
}


