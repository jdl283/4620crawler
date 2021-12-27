import {AView} from "../../base/AView";
import {ASceneController, ASceneModel, ASceneView} from "../../scene";
import {ASceneNodeController} from "./ASceneNodeController";
import {ASceneNodeModel} from "./ASceneNodeModel";
import * as THREE from "three";
import {AModel} from "../../base/AModel";
import {ARenderObject, NewObject3D} from "../../../arender";
import {ASVGElement} from "../../../arender/loaded/ASVGElement";
import {SVGItem} from "../../../amath/svg/SVGItem";
import {Object3DModelWrapper} from "../../../ageometry";
import {ALoadedElement, ALoadedElementInterface} from "../../../arender/loaded/ALoadedElement";
import {ALoadedBoundsElement} from "../../../arender/loaded/ALoadedBoundsElement";
import {AObject} from "../../../aobject";
import {ASerializable} from "../../../aserial";

@ASerializable("ASceneNodeView")
export abstract class ASceneNodeView<NodeModelType extends ASceneNodeModel> extends AView<NodeModelType>{
    public threejs!: THREE.Object3D;
    abstract controller:ASceneNodeController<NodeModelType>;
    protected _loadedElements:{[uid:string]:ALoadedElementInterface}= {};

    _initTransformListener(){
        const model = this.model;
        this.addTransformChangeCallback(()=>{
            model.transform.getMatrix().assignTo(this.threejs.matrix);
        }, 'model.transform ASceneNodeView._initTransformListener Listener');
        model.transform.getMatrix().assignTo(this.threejs.matrix);
    }

    _initMaterialListener(){
        const self=this;
        this.addMaterialUpdateCallback((...args:any[])=>{
            self.onMaterialUpdate(...args);
        })
        this.addMaterialChangeCallback(()=>{
            self.onMaterialChange();
        })

        this.addModelColorCallback((...args:any[])=>{
            self.onModelColorChange();
        })
    }

    onMaterialUpdate(...args:any[]){
        const self = this;
        this.mapOverElements((element:ARenderObject)=>{
            element.onMaterialUpdate(self.model.material, ...args);
        })
    }

    onMaterialChange(){
        const self = this;
        this.mapOverElements((element:ARenderObject)=>{
            element.onMaterialChange(self.model.material);
        })
    }

    onModelColorChange(){
        const self = this;
        this.mapOverElements((element:ARenderObject)=>{
            if('setColor' in element){
                // @ts-ignore
                element.setColor(self.model.color);
            }
        })
    }

    addMaterialUpdateCallback(callback:(self?:AObject)=>void, handle?:string){
        const self = this;
        this.controller.subscribe(
            self.model.addMaterialUpdateListener( ()=>{
                callback();
            }),
            handle
        );
    }

    addMaterialChangeCallback(callback:(self?:AObject)=>void, handle?:string){
        const self = this;
        this.controller.subscribe(
            self.model.addMaterialChangeListener( ()=>{
                callback();
            }),
            handle
        );
    }

    addModelColorCallback(callback:(self?:AObject)=>void, handle?:string){
        const self = this;
        this.subscribe(
            self.model.addColorListener( ()=>{
                callback();
            }),
            handle
        );
    }


    addTransformChangeCallback(callback:(self?:AObject)=>void, handle?:string){
        this.controller.subscribe(
            this.model.addTransformListener(()=>{
                callback();
            }),
            handle
        );
    }

    get sceneController(){
        if(this.controller instanceof ASceneController){
            return this.controller;
        }else{
            return this.controller.sceneController;
        }
    }

    get model(){
        return this.controller.model as NodeModelType;
    }


    constructor() {
        super();
        this.threejs = NewObject3D();
        // this.threejs.name = this.serializationLabel;
    }

    getSceneView():ASceneView<NodeModelType, ASceneModel<NodeModelType>>{
        return this.controller.sceneController.view;
    }

    get camera(){
        return this.controller.sceneController.camera;
    }

    /**
     * Adds the threejs object to its parent in the scenegraph
     * This function should also initialize threejs graphics in subclasses:
     * initGraphics(){
     *     super.initGraphics();
     *     // initialize other threejs objects and add them to this.threejs
     * }
     */
    initGraphics() {
        const parentView = this.getParentView();
        let targetView = parentView?parentView:this.getSceneView();
        this.setParentView(targetView);
        this._initTransformListener();
        this._initMaterialListener();
        this.initLoadedObjects();
        const self = this;
        this.controller.subscribe(
            this.model.addGeometryListener(()=>{
                self.onGeometryUpdate();
            }),
            'model.verts'
        )
        if(this.threejs.name==""){
            if(this.model.name && this.model.name!=""){
                this.threejs.name = this.model.name;
            }else{
                this.threejs.name = this.serializationLabel;
            }

        }
    }

    // initSVG(){
    //     if(this.model.svg){
    //         let svgElement = new ASVGElement(this.model.svg);
    //         this.addElement(svgElement)
    //     }
    // }

    onGeometryUpdate(){
        for(let loadedUID in this._loadedElements){
            this._loadedElements[loadedUID].updateSourceTransform();
        }
    }

    initLoadedObjects(){
        const self = this;
        for(let mname in this.model.geometry.members){
            let m = this.model.geometry.members[mname];
            if(m instanceof SVGItem){
                let svgElement = new ASVGElement(m);
                this.addElement(svgElement);
            }else if (m instanceof Object3DModelWrapper){
                let obj = new ALoadedElement(m);
                obj.setMaterial(this.model.material.threejs);
                this.addLoadedElement(obj);
            }
        }
    }

    addLoadedElement(element:ALoadedElement|ALoadedBoundsElement){
        this.addElement(element);
        this._loadedElements[element.uid]=element;
    }

    _removeElement(element: ARenderObject) {
        super._removeElement(element);
        if(element.uid in this._loadedElements){
            delete this._loadedElements[element.uid];
        }
    }

    setParentView(parentView:AView<AModel>|null){
        let currentParent = this.getParentView();
        if(currentParent && (currentParent !== parentView)){
            currentParent.removeChildView(this);
        }
        if(parentView){
            parentView.addChildView(this);
        }
    }

    getParentView(){
        let parentcontroller = this.controller.getParent();
        return parentcontroller?.view;
    }

}


