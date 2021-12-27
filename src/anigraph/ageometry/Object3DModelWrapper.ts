import * as THREE from "three";
import {HasBounds} from "./ModelGeometry";
import {BoundingBox3D} from "../amath/BoundingBox3D";
import {V3} from "../amath/Vec3";
import {VertexArray3D} from "./VertexArray3D";
import {ref} from 'valtio'
import {NodeTransform3D} from "../amath/NodeTransform3D";

export class Object3DModelWrapper implements HasBounds{
    public object:THREE.Object3D;
    protected _sourceTransform:NodeTransform3D;
    get sourceTransform(){return this._sourceTransform;}

    get sourceScale(){return this.sourceTransform.scale;}
    get uid(){
        return this.object.uuid;
    }
    constructor(object:THREE.Object3D) {
        this.object=ref(object);
        this.object.matrixAutoUpdate=false;
        this._sourceTransform = new NodeTransform3D();
    }

    getNewSceneObject(){
        let obj:THREE.Object3D;
        if(this.object instanceof THREE.Mesh){
            obj = new THREE.Mesh(this.object.geometry, this.object.material);
        }else{
            obj = this.object.clone();
        }
        obj.matrixAutoUpdate=false;
        this.sourceTransform.getMatrix().assignTo(obj.matrix);
        return obj;
    }

    getBoundingBoxVertexArray(){
        return VertexArray3D.BoundingBoxMeshVertsForObject3D(this.object);
    }

    setSourceScale(sourceScale:number){
        this._sourceTransform.scale=sourceScale;
        // Mat4.Scale3D(sourceScale).assignTo(this.object.matrix);
        this._sourceTransform.getMatrix().assignTo(this.object.matrix);
    }

    set sourceTransform(v:NodeTransform3D){
        this._sourceTransform = v;
        this._sourceTransform.getMatrix().assignTo(this.object.matrix);
    }

    getBounds(): BoundingBox3D {
        let threebox = new THREE.Box3().setFromObject(this.object);
        let bounds = new BoundingBox3D()
        bounds.minPoint=V3(threebox.min.x, threebox.min.y, threebox.min.z);
        bounds.maxPoint=V3(threebox.max.x, threebox.max.y, threebox.max.z);
        return bounds;
    }
    // getBounds(){
    //     return this.getBounds3D();
    // }

}
