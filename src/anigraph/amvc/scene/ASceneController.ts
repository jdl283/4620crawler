import {ASceneModel, SceneEvents} from "./ASceneModel";
import {ASceneView} from "./ASceneView";
import {AController, AControllerInterface, AModel, AModelClassInterface,} from "../base";
import {ASelectionController, ASelectionModel} from "../selection";
import {ASceneNodeModel, ASceneNodeView} from "../node";
import {ASupplementalController} from "../supplementals";
import {v4 as uuidv4} from 'uuid';
import {V4, Vec2} from "../../amath";
import * as THREE from "three";
import {AInteractionEvent, AStaticClickInteraction} from "../../ainteraction";
import {AMVCMap, AMVCSpec} from "./AMVCMap";
import {AKeyboardInteraction} from "../../ainteraction/DOM/AKeyboardInteraction";
import {ACamera, HasCamera} from "../camera/ACamera";
import {Interaction} from "../../thirdparty";
import {AObject, AObjectState} from "../../aobject";
import {A2DSelectionController} from "../selection/2d";
import {AniGraphEnums, ClassInterface} from "../../basictypes";
import {ACameraNodeModel} from "../camera";
import {folder} from "leva";
import {ASerializable} from "../../aserial";
import {AOrthoCamera} from "../camera/AOrthoCamera";
import {ExampleThirdPersonControls} from "../../../MainApp/PlayerControls/ExampleThirdPersonControls";
export interface ASceneControllerOptions {
    usesThreeInteractive?:boolean;
    sceneNumber?:number;
}

interface HasNameInGUI{
    NameInGUI():string;
}

@ASerializable("ASceneController")
export abstract class ASceneController<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends AController<SceneModelType> implements HasCamera{
    @AObjectState aspectRatio!:number;
    protected _camera!:ACamera;
    public classMap:AMVCMap;
    public nodeControllers:{[modelID:string]:AControllerInterface<NodeModelType>}={};
    public supControllers:{[name:string]:ASupplementalController<AModel,NodeModelType>}={};
    public container: HTMLElement;
    protected _model!:SceneModelType;
    protected selectionController!:ASelectionController<NodeModelType, ASelectionModel<NodeModelType>>;
    public _threeInteraction:any;
    abstract InstantiateNewCamera():ACamera;
    /**
     * whether or not modified three.interactive-based interactions are enabled (e.g., for click and drag interactions)
     * @private
     */
    protected _usesThreeInteractive
    get usesThreeInteractive(){return this._usesThreeInteractive;}
    abstract view:ASceneView<NodeModelType, SceneModelType>;

    protected _cameraNode!:ACameraNodeModel;
    get cameraNode(){return this._cameraNode;}

    abstract CreateView():ASceneView<NodeModelType,SceneModelType>;

    get model():SceneModelType{
        return this._model;
    };

    get appState(){
        return this.model.appState;
    }

    setModel(sceneModel:SceneModelType){
        super.setModel(sceneModel);
    }

    //##################//--Camera Basics--\\##################
    //<editor-fold desc="Camera Basics">
    get camera(){
        return this._camera;
    }

    protected _sceneCamera!:ACamera;
    /**
     * The default / 2d camera. This camera is special in that it is not part of the 2d model hierarchy.
     * This means that it does not affect other 2d controllers or models.
     * @returns {ACamera}
     */
    get sceneCamera(){
        return this._sceneCamera;
    }
    get threeCamera(){return this.view.threeCamera;}
    abstract initCameraControls():void;
    setCamera(camera:ACamera|ACameraNodeModel){
        const POSE_UPDATE_HANDLE = ACamera.CameraUpdateEvents.POSE_UPDATED+'_SceneController_'+this.serializationLabel;
        const PROJECTION_UPDATE_HANDLE = ACamera.CameraUpdateEvents.PROJECTION_UPDATED+'_SceneController_'+this.serializationLabel;

        this.unsubscribe(POSE_UPDATE_HANDLE, false);
        this.unsubscribe(PROJECTION_UPDATE_HANDLE, false);

        if(camera instanceof ACameraNodeModel){
            this._cameraNode= camera;
            this._camera = this.cameraNode.camera;
        }else{
            this._camera = camera;
        }
        const self = this;
        this.subscribe(this.camera.addPoseListener(()=>{
            self.signalCameraPoseUpdate()
        }),
            POSE_UPDATE_HANDLE
        )
        this.subscribe(this.camera.addProjectionListener(()=>{
                self.signalCameraProjectionUpdate()
            }),
            PROJECTION_UPDATE_HANDLE
        );
    }

    initSelectionController(){
        const self = this;
        this.selectionController = new A2DSelectionController<NodeModelType>();
        this.selectionController.sceneController = this;
        this.selectionController.init((this.appState.selectionModel as ASelectionModel<NodeModelType>));
        this.registerSupController(this.selectionController)
        this.addInteraction(AStaticClickInteraction.Create(this.backgroundThreeJSObject, (event: AInteractionEvent) => {
            self.selectModel(undefined, event);
        }, "DESELECTION ON BACKGROUND CLICK"))

    }


    setCurrentInteractionMode(name?: string|HasNameInGUI) {
        if(typeof name === 'string'){
            super.setCurrentInteractionMode(name);
        }else{
            super.setCurrentInteractionMode(name?.NameInGUI());
        }
    }

    signalCameraProjectionUpdate(){
        this.signalEvent(ACamera.CameraUpdateEvents.PROJECTION_UPDATED);
        if(this.view){this.view.onCameraProjectionUpdate()};
    }
    addCameraProjectionListener(callback:(self:AObject)=>void, handle?:string){
        return this.addEventListener(ACamera.CameraUpdateEvents.PROJECTION_UPDATED, callback,  handle);
    }
    signalCameraPoseUpdate(){
        this.signalEvent(ACamera.CameraUpdateEvents.POSE_UPDATED);
        if(this.view){this.view.onCameraPoseUpdate()};
    }
    addCameraPoseListener(callback:(self:AObject)=>void, handle?:string){
        return this.addEventListener(ACamera.CameraUpdateEvents.POSE_UPDATED, callback,  handle);
    }
    //</editor-fold>
    //##################\\--Camera Basics--//##################

    //##################//--Selection--\\##################
    //<editor-fold desc="Selection">
    selectModel(model?:NodeModelType, event?:AInteractionEvent){
        if(!this.selectionController){
            return;
        }
        if(model?.selectable){
            this.selectionController.selectModel(model, event);
        }else{
            this.selectionController.selectModel(undefined, event);
        }
        if(model===undefined){
            this.selectionController.selectModel(undefined, event);
        }
    }

    getSelectionController(){
        return this.selectionController;
    }

    getSelectedModelController(){
        let selectedModel = this.selectionController.model.singleSelectedModel;
        if(selectedModel){
            return this.sceneController.getNodeControllerForModel(selectedModel);
        }
    }
    //</editor-fold>
    //##################\\--Selection--//##################

    //##################//--GUI--\\##################
    //<editor-fold desc="GUI">
    get guiModelOptions(){
        return this.classMap.getGUIModelOptions();
    }

    get guiModelOptionsList(){
        return this.classMap.getGUIModelOptionsList();
    }
    //</editor-fold>
    //##################\\--GUI--//##################

    getControlPanelSpecs(){
        const self = this;
        let controlSpecs:any = {};
        controlSpecs['Mode: ('+this.uid+')']={
                value: self._currentInteractionModeName,
                options: self._interactions.getGUISelectableModesList(),
                onChange: (v: any) => {
                    self.setCurrentInteractionMode(v);
                }
            }
        return folder({
            ...controlSpecs
            },
                {collapsed: true}
            );
        return controlSpecs;
    }


    //##################//--Initializations--\\##################
    //<editor-fold desc="Initializations">
    /**
     * # Initializations:
     * init() should always be called AFTER the constructor...
     * this is because of typescripts weird property overwriting, where values initialized by a parent are overwritten
     * when the child constructor executes.
     *
     * - All of the basic controller initializations
     * - initClassSpec(): class specs define what views and controllers to use for each model type
     */

    /**
     *
     * @param container
     * @param sceneModel
     */
    constructor(container: HTMLElement, classMap?:AMVCMap, options?:ASceneControllerOptions) {
        super();
        this.aspectRatio = AniGraphEnums.CONTEXT_ASPECT_HOW;
        this.classMap=classMap?classMap:new AMVCMap();
        this.initClassSpec();
        this.container = container;
        if(options){
            let defaultValues:ASceneControllerOptions = {
                usesThreeInteractive:false
            }
            let initOptions =  {...defaultValues, ...options};
            this._usesThreeInteractive = initOptions.usesThreeInteractive;
        }
        this._sceneCamera = this.InstantiateNewCamera();
        if(this._camera === undefined){this.setCamera(this._sceneCamera);}
    }



    init(sceneModel:SceneModelType, sceneView?:ASceneView<NodeModelType, SceneModelType>){
        super.init(sceneModel, sceneView);
        this.getDOMElement().classList.add(this.serializationLabel);
        this.onWindowResize = this.onWindowResize.bind(this);
        window.addEventListener("resize", this.onWindowResize)
    }

    onWindowResize() {
        const container = this.container;
        const cwidth = container.clientWidth;
        const cheight = cwidth*this.aspectRatio;
        this.camera.onCanvasResize(cwidth, cheight);
        this.view.onWindowResize(cwidth, cheight);
    }

    initView(){
        this.view = this.CreateView();
        this.view.controller = this;
        this.view.init();
        // this.view.subscribe(this.addCameraProjectionListener(this.view.onCameraProjectionUpdate));
        // this.view.subscribe(this.addCameraPoseListener(this.view.onCameraPoseUpdate));
        this.initSceneCamera();
        this.container.appendChild(this.view.getDOMElement());
        this.signalCameraPoseUpdate();
        this.signalCameraProjectionUpdate();

    }

    /**
     * Runs after view has been created (so it's threeCamera has been created), before view.init() has been called
     */
    abstract initSceneCamera():void;

    initDefaultScene(){
    }


    //</editor-fold>
    //##################\\--Initializations--//##################

    //##################//--SceneController Access--\\##################
    //<editor-fold desc="SceneController Access">
    /** Get set sceneController */
    get sceneController(){return this;}
    getContextDOMElement(){
        return this.getDOMElement();
    }
    normalizedToViewCoordinates(v:Vec2){
        const cam = this.camera;
        const tvec= cam.getProjection().getInverse().times(V4(v.x, v.y, 0.0,1.0));
        return tvec.Point3D.XY;
    }
    viewToNormalizedCoordinates(v:Vec2){
        const cam = this.view.threeCamera;
        const tvec= new THREE.Vector4(v.x, v.y, 0.0,1.0).applyMatrix4(cam.projectionMatrix);
        return new Vec2(tvec.x/tvec.w, tvec.y/tvec.w);
    }

    //</editor-fold>
    //##################\\--SceneController Access--//##################


    initInteractions() {
        const appController = this;

        // If modified three.interaction-based interactions are being used, initialize here
        if(this.usesThreeInteractive) {
            this._threeInteraction = new Interaction(this.view.renderer, this.view.threejs, this.view.threeCamera, {
                autoPreventDefault: true
            });
            // If 2d is enabled, initialize it here
            if(!this.selectionController){
                this.initSelectionController();
            }
        }

        // this.addKeyboardInteraction(
        //     (interaction:AKeyboardInteraction, event:AInteractionEvent)=>{
        //         console.log(event);
        //     },
        //     (interaction:AKeyboardInteraction, event:AInteractionEvent)=>{
        //         console.log(event);
        //     }
        // );

        this.subscribe(this.model.addEventListener(SceneEvents.NodeAdded, (newNodeModel:NodeModelType)=>{
                appController.onNodeAdded(newNodeModel);
            }),
            SceneEvents.NodeAdded);

        this.subscribe(this.model.addEventListener(SceneEvents.NodeRemoved, (newNodeModel:NodeModelType)=>{
                appController.onNodeRemoved(newNodeModel);
            }),
            SceneEvents.NodeRemoved);
        // this.view.initCameraControls();
        this.initCameraControls();
    }


    addKeyboardInteraction(
        keyDownCallback:(interaction:AKeyboardInteraction, event:AInteractionEvent)=>void,
        keyUpCallback?:(interaction:AKeyboardInteraction, event:AInteractionEvent)=>void){
        this.addInteraction(
            AKeyboardInteraction.Create(
                this.container,
                keyDownCallback,
                keyUpCallback,
            ),
        )
    }

    addKeyboardEventConsoleListener(){
        this.addKeyboardInteraction(
            (interaction:AKeyboardInteraction, event:AInteractionEvent)=>{
                console.log(event);
                console.log(interaction.keysDownState);
            },
            (interaction:AKeyboardInteraction, event:AInteractionEvent)=>{
                console.log(event);
                console.log(interaction.keysDownState);
            }
        );
    }


    addClassSpec(spec:AMVCSpec){
        this.classMap.addSpec(spec);
    }
    addClassSpecs(specs:AMVCSpec[]|AMVCSpec){
        this.classMap.addSpecs(specs);
    }



    get backgroundThreeJSObject(){
        return this.view.backgroundThreeJSObject;
    }

    initClassSpec(){
        // this.addClassSpec(AModel, ASceneNodeView, ASceneNodeController);
    }

    getModelClassSpec(modelClass:string|AModel|AModelClassInterface<AModel>){
        return this.classMap.getSpecForModel(modelClass);
    }


    /**
     * Should create the new controller and view in response to the new node.
     * It is important that the new controller be registered
     * @param newModel
     */
    onNodeAdded(newModel:NodeModelType){
        const classSpec = this.classMap.getSpecForModel(newModel.serializationLabel);
        const newNodeView = new classSpec.viewClass();
        const newNodeController = new classSpec.controllerClass();
        // @ts-ignore
        newNodeController.sceneController = this.sceneController;
        newNodeController.init(newModel, newNodeView as unknown as ASceneNodeView<ASceneNodeModel>);
        this.registerController(newNodeController);
    }

    onNodeRemoved(newModel:NodeModelType){
        // controller should remove itself if model is set...
    }


    getDOMElement(){
        return this.view.getDOMElement();
    }

    render(){
        if(!this.view){
            throw new Error(`Must call ${this.constructor.name}.initView() before rendering...`);
        }
        this.view.render();
    }

    registerController(controller:AControllerInterface<AModel>){
        if(controller.model.uid in this.nodeControllers){
            throw new Error(`Tried to re-register node controller for ${controller.model}.\nOld: ${this.nodeControllers[controller.model.uid]}\nNew:${controller}`);
        }
        this.nodeControllers[controller.model.uid]=controller;
    }

    registerSupController(controller:ASupplementalController<AModel, NodeModelType>, name?: string){
        name = name?name:controller.serializationLabel;
        if(!name){
            name = uuidv4();
        }
        if(name in this.supControllers){
            throw new Error(`Tried to re-register side controller ${controller}.\nOld: ${this.supControllers[name]}\nNew:${controller}`);
        }
        this.supControllers[name]=controller;
        if(controller.sceneController!==this){
            throw new Error("Scene controller is wrong?");
        }
    }

    getNodeControllerForModel(model:AModel){
        if(model===this.model){
            return this;
        }
        return this.nodeControllers[model.uid];
    }

    onKeyDown(interaction: AKeyboardInteraction, event: AInteractionEvent){;}

}
