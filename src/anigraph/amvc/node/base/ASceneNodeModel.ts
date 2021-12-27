import {folder} from "leva";
import {ASerializable} from "../../../aserial";
import {AObject, AObjectState, SelectionEvents} from "../../../aobject";
import {BoundingBox3D, Color, Mat4, NodeTransform3D, Quaternion, Vec3} from "../../../amath";
import {GeometrySet, HasBounds, VertexArray} from "../../../ageometry";
import {AModel} from '../../base'
import {ASceneModel} from "../../scene/ASceneModel";
import {AMaterial} from "../../material";

import {bezier} from "@leva-ui/plugin-bezier";
import {ACallbackSwitch} from "../../../aevents";
import {GetAppState} from "../../AAppState";
import {AInteractionEvent, AKeyboardInteraction, AKeyboardInteractionCallback} from "../../../ainteraction";

const MATERIAL_UPDATE_SUBSCRIPTION_HANDLE = 'MATERIAL_UPDATE_SUBSCRIPTION_SceneNodeModel';

enum SceneNodeEvents{
    KEYBOARD_KEY_DOWN_EVENT='NODE_KEYBOARD_KEY_DOWN_EVENT',
    KEYBOARD_KEY_UP_EVENT='NODE_KEYBOARD_KEY_UP_EVENT',
}

@ASerializable("ASceneNodeModel")
export class ASceneNodeModel extends AModel implements HasBounds{
    static SupportsUploadedModels=false;
    @AObjectState geometry!:GeometrySet;
    @AObjectState color!:Color;
    @AObjectState _transform!:NodeTransform3D;
    @AObjectState selectable!:boolean;
    protected _material!:AMaterial;

    static NodeEvents=SceneNodeEvents;

    get transform(){return this._transform;}
    setTransform(t:NodeTransform3D){this._transform=t;}
    protected set transform(t:NodeTransform3D){
        this.setTransform(t);
    }


    get material(){return this._material;}
    get verts():VertexArray<any>{
        return this.geometry.verts;
    }
    set verts(v:VertexArray<any>){
        this.geometry.verts = v;
    }

    getBounds(): BoundingBox3D {
        let b = this.geometry.getBounds();
        // b.transform = this.transform.clone();
            b.transform = this.getWorldTransform();
        return b;
    }

    addEnterSelectionListener(callback:(...args:any[])=>void, handle?:string){
        return this.addEventListener(SelectionEvents.SelectionItemEnter, callback, handle);
    }

    addExitSelectionListener(callback:(...args:any[])=>void, handle?:string){
        return this.addEventListener(SelectionEvents.SelectionItemExit, callback, handle);
    }

    getModelGUIControlSpec():{[name:string]:any}{
        let self = this;
        return {
            ModelName: {
                value:self.name,
                onChange:(v:any)=>{
                    self.name = v;
                }
            },

            color: {
                value: self.color.RGBuintAfloat,
                onChange: (v:any) => {
                    self.color = Color.FromRGBuintAfloat(v);
                },
            },

            depth: {
                value: self.transform.position.z,
                onChange:(v:any)=>{
                    self.transform.position.z = v;
                },
                min: -500,
                max: 500,
                step:1
            },
            position: {
                value: {x: self.transform.position.x, y:self.transform.position.y},
                joystick: "invertY",
                step: 10,
                onChange:(v: any)=>{
                    self.transform.position = new Vec3(v.x, v.y, self.transform.position.z);
                }
            },
            ...self.material.getMaterialGUIParams(),
            Transform: folder(
                {
                    scale: {
                        value: self.transform.scale.x,
                        min:0,
                        max:500,
                        step:0.01,
                        onChange:(v: any)=>{
                            self.transform.scale = new Vec3(v,v,v);
                        }
                    },
                },
                { collapsed: true }
            ),


        }
    }

    constructor() {
        super();
        this.geometry = new GeometrySet();
        this._transform = new NodeTransform3D();
        this.color = Color.Random();
        this.selectable = true;
        // this.initMaterial();
    }

    setMaterial(material:AMaterial|string){
        if(this.material === material){
            return;
        }else{
            let amaterial:AMaterial;
            if(material instanceof AMaterial){
                amaterial=material;
            }else{
                amaterial = GetAppState().CreateMaterial(material);
            }
            let color = this.color;
            if(this.material){
                this._disposeMaterial()
            }
            this._material = amaterial;
            if(color) {
                this._material.setModelColor(color);
            }
            this.setMaterialUpdateSubscriptions();
        }
        this.signalEvent(AMaterial.Events.CHANGE)
    }

    /**
     * IMPORTANT: There should only be one of these.
     */
    setMaterialUpdateSubscriptions(){
        const self = this;
        this.subscribe(this.material.addEventListener(AMaterial.Events.UPDATE, (...args:any[])=>{
            self.onMaterialUpdate(AMaterial.Events.UPDATE, ...args)
        }), MATERIAL_UPDATE_SUBSCRIPTION_HANDLE);
        this.material.subscribe(this.addStateKeyListener('color', ()=>{
            self.material.setModelColor(self.color);
            if('opacity' in self.material._material) self.material.setValue('opacity', self.color.a);
        }))
    }

    onMaterialUpdate(...args:any[]){
        this.signalEvent(AMaterial.Events.UPDATE, ...args);
    }

    addMaterialUpdateListener(callback:(...args:any[])=>void, handle?:string){
        return this.addEventListener(AMaterial.Events.UPDATE, callback, handle);
    }
    addMaterialChangeListener(callback:(...args:any[])=>void, handle?:string){
        return this.addEventListener(AMaterial.Events.CHANGE, callback, handle);
    }

    _disposeMaterial(){
        this.unsubscribe(MATERIAL_UPDATE_SUBSCRIPTION_HANDLE);
        this.material.dispose();
    }


    addTransformListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true):ACallbackSwitch{
        return this.addStateKeyListener('_transform', callback, handle, synchronous);
    }

    addGeometryListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true){
        return this.addStateKeyListener('geometry', callback, handle, synchronous);
    }
    addColorListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true){
        return this.addStateKeyListener('color', callback, handle, synchronous);
    }


    getWorldTransform(){
        let parent_ObjToWorld = Mat4.Identity();
        let parent = this.parent;
        while(parent && parent instanceof ASceneNodeModel){
            let parent_Model = parent.transform.getMatrix()
            parent_ObjToWorld = parent_Model.times(parent_ObjToWorld);
            parent = parent.parent;
        }
        let worldmat =  parent_ObjToWorld.times(this.transform.getMatrix());
        let worldpos = parent_ObjToWorld.times(this.transform.position.Point3DH).Point3D;
        return new NodeTransform3D(worldmat, worldpos, this.transform.rotation.clone());
    }

    getWorldPosition(){
        return this.getWorldTransform().position;
    }

    getSceneModel(){
        let scenemodel = this;
        while(!(scenemodel instanceof ASceneModel) && scenemodel.parent){
            // @ts-ignore
            scenemodel = scenemodel.parent;
        }
        return scenemodel;
    }
}

