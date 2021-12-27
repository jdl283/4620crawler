import * as THREE from "three";
import {Mat3, Mat4, TransformationInterface} from "../amath";
import {AMaterial} from "../amvc/material/AMaterial";
import {ASerializable} from "../aserial";


@ASerializable("ARenderObject")
export abstract class ARenderObject {
    /**
     * This should be what is added to the threejs scenevis
     */
    abstract get threejs():THREE.Object3D;

    onMaterialUpdate(newMaterial:AMaterial, ...args:any[]){
    }
    onMaterialChange(newMaterial:AMaterial, ...args:any[]){
    }

    setObject3DName(name:string){
        this.threejs.name = name;
    }

    /**
     * This should be whatever receives events
     */
    get eventHandler(){return this.threejs;}

    setMatrix(mat:Mat3|Mat4){
        if(mat instanceof Mat3){
            Mat4.From2DMat3(mat).assignTo(this.threejs.matrix);;
        }else{
            mat.assignTo(this.threejs.matrix);
        }

    }

    getMatrix(){return
        Mat4.FromThreeJS(this.threejs.matrix);
    }

    get uid(){
        return this.threejs.uuid;
    }

    add(toAdd:ARenderObject){
        this.threejs.add(toAdd.threejs);
    }
    remove(toRemove:ARenderObject){
        this.threejs.remove(toRemove.threejs);
    }

    get serializationLabel(){
        // @ts-ignore
        return this.constructor._serializationLabel
    }

    /** Get set visible */
    set visible(value){this.threejs.visible = value;}
    get visible(){return this.threejs.visible;}

    public setTransform(T:TransformationInterface){
        let mat = T.getMatrix();
        if(mat instanceof Mat3){
            mat = Mat4.From2DMat3(mat);
        }
        (mat as Mat4).assignTo(this.threejs.matrix);
    };

    dispose(){
        if(this.threejs){
            // this._mesh.dispose();
            this.threejs.parent?.remove(this.threejs);
        }

    }
}
