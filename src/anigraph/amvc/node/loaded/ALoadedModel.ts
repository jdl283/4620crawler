import {ASceneNodeModel} from "../base/ASceneNodeModel";
import {NodeTransform3D, Vec3} from "../../../amath";
import * as THREE from "three";
import {Object3DModelWrapper, VertexArray3D} from "../../../ageometry";
import {ASerializable} from "../../../aserial";
import {AObjectState} from "../../../aobject";


@ASerializable("ALoadedModel")
export class ALoadedModel extends ASceneNodeModel{
    static SupportsUploadedModels=true;
    @AObjectState sourceTransform:NodeTransform3D;
    get sourceScale(){
        return this.sourceTransform.scale
    }
    set sourceScale(v:number|Vec3){
        this.sourceTransform.scale=v;
    }

    get verts(){return this.geometry.verts as VertexArray3D;}
    set verts(v:VertexArray3D){this.geometry.verts = v;}
    loadedObjects:Object3DModelWrapper[]=[];

    constructor(obj:THREE.Object3D|Object3DModelWrapper) {
        super();
        let object = obj;
        this.sourceTransform = new NodeTransform3D();
        if(obj instanceof THREE.BufferGeometry) {
            if(obj.attributes.normal == undefined){
                obj.computeVertexNormals()
            }
            let threemesh = new THREE.Mesh(
                obj,
                this.material.threejs
            );
            object = new Object3DModelWrapper(threemesh);
        }else if(obj instanceof THREE.Mesh || obj instanceof THREE.Group){
            object = new Object3DModelWrapper(obj);
        }else if (obj instanceof Object3DModelWrapper) {
            object = obj;
        }else{
            throw new Error(`Unrecognized loaded object ${obj} of type ${typeof obj}`);
        }
        this.addLoadedObject(object);
        this.sourceScale=1;
        const self = this;
        this.subscribe(this.addStateKeyListener('sourceTransform', ()=>{
            self.geometry.sourceTransform = self.sourceTransform;
        }), 'loadedmodel.sourceTransform');
    }

    addLoadedObject(object:Object3DModelWrapper){
        this.geometry.addMember(object);
        this.loadedObjects.push(object);
    }
}
