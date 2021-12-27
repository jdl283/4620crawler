import * as THREE from "three";
import {ASceneNodeView} from "../node/base/ASceneNodeView";
import {ACameraNodeModel} from "./ACameraNodeModel";
import {ACameraNodeController} from "./ACameraNodeController";
import {ACameraElement, APolygonElement} from "../../arender";
import {AObjectState} from "../../aobject";
import {ASerializable} from "../../aserial";

@ASerializable("ACameraNodeView")
export class ACameraNodeView extends ASceneNodeView<ACameraNodeModel>{
    // @AObjectState isActive:boolean;
    controller!:ACameraNodeController;
    // _camera!: THREE.Camera
    // element!:ACameraElement;
    public element!:APolygonElement;


    // _initTransformListener(){
    //     const model = this.model;
    //     this.model.addCameraPoseListener(()=>{
    //         model.camera.getPose().getMatrix().assignTo(this.threejs.matrix);
    //     }, 'CAMERANODEVIEW model.transform ASceneNodeView._initTransformListener Listener');
    //     model.transform.getMatrix().assignTo(this.threejs.matrix);
    // }
    _initMaterialListener(){
    }

    constructor(...args:any[]) {
        super();
        // this.isActive=false;
    }

    onGeometryUpdate(){
        super.onGeometryUpdate();
        this.element.setVerts(this.model.verts);
    }

    initGraphics() {
        super.initGraphics();
        this.element = new APolygonElement(this.model.verts, this.model.color);
        this.addElement(this.element);
    }
}
