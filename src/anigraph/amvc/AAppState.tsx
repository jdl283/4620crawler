import {folder} from "leva";
import React, {useEffect, useRef} from "react";
import {v4 as uuidv4} from 'uuid';
import * as THREE from "three";
import {Loader} from "three/src/loaders/Loader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";


import {ClassInterface} from "../basictypes";
import {Color, Mat3, V2, Vec2} from "../amath";
import {VertexArray2D} from "../ageometry";
import {AObject, AObjectState, ASelection, SelectionEvents} from "../aobject";
import {ASerializable, GetASerializableClassByName} from "../aserial";
import {ATexture} from "../arender/ATexture";
import {
    ASceneController,
    ASceneControllerOptions,
    ASceneModel,
    ASceneNodeModel,
    ALoadedModel,
    ASelectionModel,
    AMVCMap
} from './index'
import {ASpriteModel} from "./derived/nodes/sprite/ASpriteModel";

enum SceneControllerIDs{
    default="default",
    ModelScene="MapWindow",
    ViewScene="GameWindow",
};
export type SceneControllerID = typeof SceneControllerIDs[keyof typeof SceneControllerIDs];
var _appState:AAppState<ASceneNodeModel, ASceneModel<ASceneNodeModel>>;

export function SetAppState(appState:AAppState<any, any>):AAppState<any, any>{
    if(_appState !== undefined){
        throw new Error(`Already set the app state to ${_appState}`);
    }
    _appState = appState;
    _appState.init();
    return _appState;
}

@ASerializable("AAppState")
export abstract class AAppState<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends AObject{
    // @AObjectState modelControlSpecs:{}
    @AObjectState _guiKey!:string;
    sceneModel!:SceneModelType;
    selectionModel!: ASelectionModel<NodeModelType>;
    @AObjectState _time:number;
    @AObjectState _currentNewModelTypeName!:string;
    @AObjectState _currentMaterialName!:string;
    protected _clockID!:number;
    protected _paused!:boolean;

    onAnimationFrameCallback(){
        // let ah = setInterval()
    }


    /** Get set currentNewModelTypeName */
    set currentNewModelTypeName(value:string){this._currentNewModelTypeName = value;}
    // @ts-ignore
    get currentNewModelTypeName():string{
        if (this._currentNewModelTypeName) {
            return this._currentNewModelTypeName;
        } else {
            for (let k in this.sceneControllers) {
                return this.sceneControllers[k].guiModelOptionsList[0];
            }
        }
    }

    setNodeMaterial(model:ASceneNodeModel, materialName?:string){
        const self = this;
        // return new Promise<ASceneNodeModel>(function(result, error) {
        let materialModel = materialName?this.materials.getMaterialModel(materialName):this.currentMaterialModel;

        if (model.material && model.material.model == materialModel) {
            return;
        } else {
            let mat = materialModel.CreateMaterial();
            model.setMaterial(mat);
            self.triggerGUIUpdate();
        }
    }

    CreateMaterial(modelName:string){
        return this.materials.getMaterialModel(modelName).CreateMaterial();
    }

    /** Get set currentNewModelTypeName */
    set currentMaterialName(value:string){
        const self = this;
        if(this._currentMaterialName!==value) {
            this._currentMaterialName = value;
            const model = this.selectionModel.singleSelectedModel;
            if (model) {
                this.setNodeMaterial(model);
                this.triggerGUIUpdate();
                // this.selectionModel
                // this.selectionModel.selectModel(model);
                // this.onSelectionChanged(this.selectionModel.2d);
            }
        }
    }

    get currentMaterialModel(){
        return this.materials.getMaterialModel(this._currentMaterialName);
    }

    // @ts-ignore
    get currentMaterialName():string{
        if (this._currentMaterialName) {
            return this._currentMaterialName;
        } else {
            for (let k in this.materials.materials) {
                return this.materials.getMaterialModel(k).name;
            }
        }
    }

    get currentNewModelType(){
        // @ts-ignore
        return GetASerializableClassByName(this.currentNewModelTypeName);
    }



    NewNode(){
        let newNode = new (GetAppState().currentNewModelType)() as NodeModelType;
        this.setNodeMaterial(newNode);
        return newNode;
    }

    async addDefaultNode(color?:Color, position?:Vec2, ...args:any[]){
        // this.sceneModel.addNode(this.currentNewModelType.CreateDefaultNode());
        if(typeof this.currentNewModelType.CreateDefaultNode == 'function') {
            this.sceneModel.addNode(await this.currentNewModelType.CreateDefaultNode());
        }else{
            this.sceneModel.addNode(this.CreateTestSquare(color, position));
        }
    }


    protected _getSpecSceneController(){
        for(let k in this.sceneControllers){
            return this.sceneControllers[k];
        }
    }

    abstract NewSceneModel(...args:[]):SceneModelType;

    abstract initSelection():void;

    getControlPanelStandardSpec():{}{
        let sceneControllerControls:any = {};
        for(let s in this.sceneControllers){
            sceneControllerControls[s] = this.sceneControllers[s].getControlPanelSpecs();
        }
        return {
            SceneModel: folder(
                {
                    ...this.sceneModel.getSceneModelControlSpec()
                },
                { collapsed: true }
            ),
            SceneViews: folder(
                {
                    ...sceneControllerControls
                },
                {collapsed: false}
            )
        };
    }

    // @AObjectState selectedModel!: AModel | undefined;
    private _initCalled:boolean=false;

    freezeSelection(){
        this.selectionModel.isFrozen=true;
    }
    unfreezeSelection(){
        this.selectionModel.isFrozen=false;
    }

    // static SetAppState(...args:[]){
    //     // SetAppState(new this(...args));
    //     _appState = new this(...args);
    //     _appState.init();
    //     return _appState;
    // }

    static GetAppState(){
        return GetAppState();
        // if(_appState===undefined){
        //     throw new Error("Must set app state!");
        // }
        // return _appState;
    }

    get materials(){
        return this.sceneModel.materials;
    }


    //##################//--Selection--\\##################
    //<editor-fold desc="Selection">

    handleSceneGraphSelection(m:any){
        this.selectionModel.selectModel(m);
        console.log(`Model: ${m.uid}`)
        console.log(m);
        console.log(`Transform with matrix:\n${m.transform.getMatrix().asPrettyString()}`)
        console.log(Mat3.Translation2D([5,6]));
        console.log(m.transform.getMatrix());
        console.log(m.transform);
    }

    get modelSelection(){
        return this.selectionModel.selectedModels;
    }


    /**
     * Will activate or deactivate the SelectionChanged subscription
     * @param value
     */
    set selectionSubscriptionIsActive(value){
        if(value!=this.selectionSubscriptionIsActive){
            if(value){
                this.deactivateSubscription(SelectionEvents.SelectionChanged);
            }else{
                this.activateSubscription(SelectionEvents.SelectionChanged);
            }
        }
    }

    get selectionSubscriptionIsActive(){
        return this._subscriptions[SelectionEvents.SelectionChanged].active;
    }

    onSelectionChanged(selection:ASelection<NodeModelType>){
        this.triggerGUIUpdate()
        return;
    }

    // selectModel(model?:NodeModelType, event?:AInteractionEvent){
    //     this.selectionModel.selectModel(model);
    // }

    //</editor-fold>
    //##################\\--Selection--//##################


    init(){
        if(this._initCalled){
            throw new Error("AAppState already initialized!");
        }
        this.initSelection();
        this._initCalled=true;
    }


    setInteractionMode(modeName?: string) {
        for (let k in this.sceneControllers) {
            if (modeName) {
                let imode = this.sceneControllers[k].getInteractionMode(modeName);
                if (imode) {
                    this.sceneControllers[k].setCurrentInteractionMode(modeName);
                }
            } else {
                this.sceneControllers[k].setCurrentInteractionMode();
            }
        }
    }

    get selectedModels() {
        return this.selectionModel.selectedModels as NodeModelType[];
    }

    getModelControlSpecs() {
        return (this.modelSelection.length > 0) ? this.selectedModels[0].getModelGUIControlSpec() : {};
    }


    pauseClock(){
        if(!this._paused){
            this._paused=true;
            clearInterval(this._clockID);
        }
    }
    unpauseClock(){
        if(this._paused){
            const self = this;
            this._paused=false;
            this._clockID = setInterval(()=>{
                if(!self._paused) {
                    self._time = Date.now();
                }
            });
        }
    }
    toggleClockPause(){
        if(this._paused){
            this.unpauseClock();
        }else{
            this.pauseClock();
        }
    }

    addSVG(name:string, svgText:string){
        throw new Error("SVG support disabled...")
        // // let svgmodel = new ASVGModel(svgText);
        // let newModel = this.sceneModel.NewNode();
        // // newModel.setSVG(svgText);
        // this.sceneModel.addNode(newModel);
    }

    imageUploaded(name:string, texture:THREE.Texture){
        console.log(name);
        console.log(texture);
        let atex = new ATexture(texture, name);
        atex.setTexData('width', texture.image.width)
        atex.setTexData('height', texture.image.width)
        let newSprite = new ASpriteModel(atex);
        this.sceneModel.addNode(newSprite);
        // let newModel = this.sceneModel.NewNode();
    }


    // loadBackgroundCubeMap(path:string, ){
    //
    // }

    loadModelFromURL(path:string, callback:(obj:THREE.Object3D)=>void){
        let extension = path.split('.').pop();
        let loader:Loader;
        switch (extension) {
            case 'obj':
                loader = new OBJLoader();
                break;
            case 'ply':
                loader = new PLYLoader();
                break;
            default:
                throw new Error(`Extension "${extension}" not recognized`);
        }
        loader.setCrossOrigin("");
        // @ts-ignore
        loader.load(path, callback);
    }


    async modelUploaded(name:string, obj:THREE.Object3D){
        console.log(name+" uploaded");
        // console.log(obj);

        let newModel:ASceneNodeModel;
        if(this.currentNewModelType.SupportsUploadedModels){
             newModel= this.sceneModel.NewNode();
             newModel.geometry.addMember(obj);
        }else{
            if(obj instanceof THREE.BufferGeometry) {
                if(obj.attributes.normal == undefined){
                    obj.computeVertexNormals()
                }
                let threemesh = new THREE.Mesh(
                    obj,
                    new THREE.MeshBasicMaterial()
                    // normalMaterial()
                );
                newModel = new ALoadedModel(threemesh);
            }else{
                newModel = new ALoadedModel(obj);
            }
        }
        this.sceneModel.addNode(newModel);
        this.setNodeMaterial(newModel);
        return newModel;
        // let newModel = this.sceneModel.NewNode();
    }

    /** Get set selectedModel */
    // set selectedModel(value:NodeModelType|undefined){this._selectedModel = value;}
    // get selectedModel(){return this._selectedModel;}

    public sceneControllers:{[name:string]:ASceneController<NodeModelType, SceneModelType>}={};
    static SceneControllerIDs=SceneControllerIDs;

    constructor(sceneModel?:SceneModelType){
        super();
        this._paused=true;
        this._time = Date.now();
        this.unpauseClock();

        if(sceneModel){
            this.sceneModel=sceneModel;
        }else{
            this.sceneModel = this.NewSceneModel();
        }
        if(this.sceneModel.appState){
            console.log(this);
            throw new Error(`Scene model ${sceneModel} already has appState: ${this.sceneModel.appState}`)
        }
        this.sceneModel.appState = this;
    }

    abstract initSceneModel():void;

    addClockListener(callback:(t:number)=>any){
        const self = this;
        return this.addStateKeyListener('_time', ()=>{
            callback(self._time);
        });
    }


    triggerGUIUpdate(){
        this._guiKey = uuidv4();
    }

    CreateTestSquare(color?:Color, position?:Vec2, ){
        position = position?position:V2();
        // color = color?color:Color.FromString('#55aa55');
        color = color?color:Color.FromString('#888888');
        let newShape = this.NewNode();
        let sz = 25;
        let verts = new VertexArray2D();
        verts.position.push(V2(sz, -sz));
        verts.position.push(V2(-sz, -sz));
        verts.position.push(V2(-sz, sz));
        verts.position.push(V2(sz, sz));

        newShape.color = color;
        newShape.verts = verts;
        // newShape.recenterAnchor();
        // newShape.verts = verts;
        // this.sceneController.model.addNode(newShape);
        return newShape;
    }


    selectModel(model?: NodeModelType) {
        this.selectionModel.selectModel(model);
    }


    addSceneControllerClass(container:HTMLDivElement, sceneControllerClass:ClassInterface<ASceneController<NodeModelType,SceneModelType>>, name?:string){
        const newController = new sceneControllerClass(container, this.sceneModel);
        let newname = name?name:sceneControllerClass.name;
        this.addSceneController(newController, newname);
    }

    addSceneController(sceneController:ASceneController<NodeModelType, SceneModelType>, name:string){
        let newname = name?name:(sceneController.constructor).name;
        let counter = 2;
        while(newname in this.sceneControllers){
            newname = newname+String(counter);
        }
        this.sceneControllers[newname]= sceneController;
        this.sceneControllers[newname].init(this.sceneModel);
        this.sceneControllers[newname].render();
    }


    AppComponent(sceneControllerClass:ClassInterface<ASceneController<NodeModelType,SceneModelType>>,
                 name:string,
                 classMap:AMVCMap,
                 options:ASceneControllerOptions){
        const self = this;
        async function initThreeJSContext(container: HTMLDivElement) {
            let sceneController = new sceneControllerClass(container, classMap, options);
            // @ts-ignore
            let controllerName =sceneControllerClass._serializationLabel?sceneControllerClass._serializationLabel:sceneControllerClass.name;
            if(name!==undefined){
                controllerName = name;
            }
            self.addSceneController(sceneController, controllerName);
            self.triggerGUIUpdate();
        }


        return function ReturnAppComponent(props:any) {
            const container = useRef(null as unknown as HTMLDivElement);
            useEffect(() => {
                (async () => {
                    await initThreeJSContext(container.current);
                    // container.t
                })();
            }, []);
            return (
                <div className="canvas">
                <div
                    className="anigraphcontainer"
                    ref={container}
                    tabIndex={options.sceneNumber}
                    key={options.sceneNumber?options.sceneNumber:uuidv4()}
                >
                    {props.children}
                </div>
            </div>
        );
        }
    }

    //##################//--React.CreateClass approach--\\##################
    //<editor-fold desc="React.CreateClass approach">
    // function createclass(){
    //     return React.CreateClass({
    //         render: function () {
    //             const container = useRef(null as unknown as HTMLDivElement);
    //             useEffect(() => {
    //                 (async () => {
    //                     await initThreeJSContext(container.current);
    //                 })();
    //             }, []);
    //             return (
    //                 <div className="canvas">
    //                     <div id={'anigraphcontainer'} ref={container}/>
    //                 </div>
    //             );
    //         }
    //     });
    // }
    //</editor-fold>
    //##################\\--React.CreateClass approach--//##################




    // initSceneController(container:HTMLDivElement){
    //     this.sceneController = new Base2DApp1SceneController(container, this.sceneModel);
    //     this.sceneController.init();
    //     this.sceneController.render();
    // }
}


export function GetAppState():AAppState<ASceneNodeModel,ASceneModel<ASceneNodeModel>>{
    // if(_appState === undefined){
    //     _appState = new AAppState();
    // }
    if(_appState===undefined){
        throw new Error("Must set app state!");
    }
    return _appState;
}
