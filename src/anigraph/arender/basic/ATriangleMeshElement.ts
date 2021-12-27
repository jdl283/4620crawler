import {ARenderElement} from "../ARenderElement";
import * as THREE from "three";
import {VertexArray3D} from "../../ageometry/VertexArray3D";
import {ASerializable} from "../../aserial";

@ASerializable("ATriangleMeshElement")
export class ATriangleMeshElement extends ARenderElement{
    protected verts!:VertexArray3D;

    get mesh(){
        return this._element;
    }

    initGeometry(verts?:VertexArray3D){
        if(!this._geometry){
            if(verts){
                this.verts = verts;
            }
            this.setGeometry(this.verts);
        }else{
            throw new Error("Tried to re-init geometry in ATriangleMeshElements")
        }
    }

    _createDefaultMaterial(){
        return new THREE.MeshBasicMaterial({
            color: 0x22aa22,
            transparent: true,
            side: THREE.DoubleSide,
            opacity:1.0
        })
    }

    setVerts(verts:VertexArray3D){
        this.verts = verts;
        this.setGeometry(this.verts);
    }

}
