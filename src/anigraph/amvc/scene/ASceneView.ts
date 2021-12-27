import {AView} from "../base/AView";
import * as THREE from "three";

import {Color} from "../../amath";
import {saveAs} from "file-saver";
import {ASerializable} from "src/anigraph/aserial";
import {ASceneController} from "./ASceneController";
import {ASceneModel} from "./ASceneModel";
import {ASceneNodeModel} from "../node";
import {GetAppState} from "../AAppState";
import {AniGraphEnums} from "../../basictypes";
import {ABackgroundSelectionElement} from "../../arender/gui/ABackgroundSelectionElement";
import {ACamera} from "../camera/ACamera";

enum BackgroundOrder{
    Back="Back",
    Front="Front",
}

const BG_OFFSET=0.01;

@ASerializable("ASceneView")
export class ASceneView<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends AView<SceneModelType>{
    controller!:ASceneController<NodeModelType, SceneModelType>;
    public renderer!: THREE.WebGLRenderer;
    protected _cameraThreeObject!:THREE.Camera;
    public controls!:any[];
    public threejs!: THREE.Scene;
    public backgroundElement!:ABackgroundSelectionElement;
    static BackgroundOrder = BackgroundOrder;
    protected backgroundOrder:BackgroundOrder=BackgroundOrder.Back;

    protected _recordNextFrame:boolean=false;
    protected _recordNextFrameCallback!:(imageBlob:Blob|null)=>void;
    /** Get set backgroundElement */
    get backgroundThreeJSObject(){return this.backgroundElement.threejs;}

    protected _initBackgroundElement(){
        this.backgroundElement = new ABackgroundSelectionElement();
        this.backgroundElement.init();
        this.backgroundElement.mesh.name = AniGraphEnums.BackgroundElementName;
        this.backgroundElement.mesh.userData[AniGraphEnums.OccludesInteractions]=true;
        this.addElement(this.backgroundElement);
        this._updateBackgroundElement();
    }

    protected _initLighting() {
        this.threejs.add(new THREE.AmbientLight());
    }

    protected _updateBackgroundElement() {
        switch(this.backgroundOrder){
            case ASceneView.BackgroundOrder.Back:
                this.backgroundElement.setToFarPlane(this.threeCamera);
                break;
            case ASceneView.BackgroundOrder.Front:
                this.backgroundElement.setToNearPlane(this.threeCamera);
                break;
            default:
                throw new Error(`Unrecognized background order ${this.backgroundOrder}`);
                break;
        }
    }

    get camera(){
        return this.controller.camera;
    }

    /**
     * The current THREE.Camera being used by this 2d view
     * @type {Camera}
     * @private
     */
    get threeCamera(){
        return this._cameraThreeObject;
    }

    /**
     * should create the camera and bind functions that are used as callbacks.
     */
    constructor(){
        super();
        this.bindMethods();
    }

    bindMethods(){
        this.render = this.render.bind(this);
        this._saveSingleFrameCallback = this._saveSingleFrameCallback.bind(this);
        this.onCameraProjectionUpdate = this.onCameraProjectionUpdate.bind(this)
        this.onCameraPoseUpdate = this.onCameraPoseUpdate.bind(this)
    }

    init(){
        super.init();
        const cwidth = this.controller.container.clientWidth;
        const cheight = cwidth*AniGraphEnums.CONTEXT_ASPECT_HOW;
        this.renderer.setSize(cwidth, cheight);
        this.renderer.setSize(cwidth, cheight);
        this._initBackgroundElement();
        this._initLighting();
        //
    }

    onCameraProjectionUpdate(){
        this.controller.camera.getProjection().assignTo(this.threeCamera.projectionMatrix);
        this.controller.camera.getProjectionInverse().assignTo(this.threeCamera.projectionMatrixInverse);
        // this.threeCamera.updateProjectionMatrix();
    }

    onCameraPoseUpdate(){
        // this.controller.camera.getPose().assignToObject3DPose(this.threeCamera);
        // let p = this.controller.camera.getPose().clone();
        // p.rotation = p.rotation.getInverse();
        // p.assignToObject3DPose(this.threeCamera);
        // this.threeCamera.matrixWorldInverse.copy( this.threeCamera.matrixWorld).invert();

        this.controller.camera.getPose().getMatrix().assignTo(this.threeCamera.matrix);
        this.controller.camera.getPose().getMatrix().assignTo(this.threeCamera.matrixWorld);
        this.threeCamera.matrixWorldInverse.copy( this.threeCamera.matrixWorld).invert();
    }

    /**
     * Should be one of the BackgroundOrder enums ("Back" or "Front");
     * background order determines whether the background is in front or behind other scenevis content.
     * This is important for determining whether clicks that overlap scenevis objects should be directed at the scenevis
     * object as a target or the background.
     *
     * IMPORTANT! The convention is that background order should be "Back" by default. This means that
     * unless an interaction mode switches the background order to "Front", it should be "Back". This also means
     * that when an interaction mode that uses "Front" mode gets deactivated, it should switch things back to "Back".
     *
     * @param order
     */
    setBackgroundOrder(order:BackgroundOrder){
        this.backgroundOrder = order;
        this._updateBackgroundElement();
    }

    initRenderer(parameters?: { [name: string]: string }){
        let params = parameters ? parameters : {
            antialias: true,
            alpha: true
        }
        this.renderer = new THREE.WebGLRenderer(params);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    initGraphics(){
        if(!this.controller){
            throw new Error("must set controller before initializing graphics");
        }
        this.initRenderer();
        this.threejs = new THREE.Scene();
        this.threejs.userData['modelID']=this.model.uid;

        this._cameraThreeObject = new THREE.Camera();
        this._cameraThreeObject.matrixAutoUpdate=false;
        this.threejs.add(this.threeCamera);
    }

    recordNextFrame(callback?:(imageBlob:Blob|null)=>void){
        if(callback===undefined){
            this._recordNextFrameCallback = this._saveSingleFrameCallback;
        }else{
            this._recordNextFrameCallback=callback;
        }
        this._recordNextFrame = true;
    }

    _saveSingleFrameCallback(imageBlob:Blob|null){
        // @ts-ignore
        saveAs(imageBlob, `${this.controller.serializationLabel}.png`);
    }

    getDOMElement(){
        return this.renderer.domElement;
    }

    setBackgroundColor(color:Color){
        this.threejs.background = color.asThreeJS();
    }

    onWindowResize(width:number, height:number) {
        this._updateBackgroundElement();
        this.renderer.setSize(width, height);
    }

    render(){
        // requestAnimationFrame(()=>this.render);
        requestAnimationFrame(()=>this.render());
        GetAppState().onAnimationFrameCallback();
        this.renderer.render(this.threejs, this.threeCamera);
        if(this._recordNextFrame === true){
            this._recordNextFrame = false;
            let self = this;
            this.renderer.domElement.toBlob(function(blob:Blob|null){
                self._recordNextFrameCallback(blob);
            });
        }
        // if(this.controls){
            // @ts-ignore
            // this.controls.update();
            // this.updateCamera();
            // this._updateBackgroundElement();
        // }
    }

}
