/**
 * Base class for views in the Anigraph MVC scheme.
 * The primary responsibility for each view subclass is to specify how a model translates into Three.js rendering calls. The view itself should hold Three.js objects and make them available to controllers for specifying interactions.
 * Views should always be initialize
 */
import * as THREE from "three";
import {AObject} from "../../aobject/AObject";
import {AControllerInterface} from "./AController";
import {AModel} from "./AModel";
import {ARenderObject} from "../../arender";


export interface AViewClassInterface extends Function {new (...args:any[]): AView<AModel>}


/**
 * Base View Class
 */
export abstract class AView<NodeModelType extends AModel> extends AObject{
    /**
     * The three.js object for this view. Should be a subclass of THREE.Object3D
     * @type {THREE.Object3D}
     */
    abstract threejs: THREE.Object3D;
    abstract controller:AControllerInterface<NodeModelType>;
    protected elements:{[uid:string]:ARenderObject}={};

    addElement(element:ARenderObject){
        this.threejs.add(element.threejs);
        this.elements[element.uid]=element;
    }

    _removeElement(element:ARenderObject){
        this.threejs.remove(element.threejs);
        delete this.elements[element.uid];
    }

    moveElementToBack(element:ARenderObject){
        this._removeElement(element);
        this.addElement(element);
    }

    /**
     * initGraphics() is called AFTER the constructor and used to initialize any three.js objects for rendering
     */
    abstract initGraphics():void;




    init(){
        this.initGraphics();
        this.threejs.userData['modelID']=this.model.uid;
    }
    get model(){
        return this.controller.model;
    }


    addChildView(childView:AView<AModel>){
        this.threejs.add(childView.threejs);
    }

    removeChildView(childView:AView<AModel>){
        this.threejs.remove(childView.threejs);
    }

    /**
     * The contructor should always work without arguments
     */
    constructor(){
        super();
    }

    getElementList(){
        return Object.values(this.elements);
    }
    mapOverElements(fn:(element:ARenderObject)=>any[]|void){
        return this.getElementList().map(fn);
    }

    disposeElements(){
        let elementKeys = Object.keys(this.elements);
        for(let e of elementKeys){
            let element = this.elements[e];
            this._removeElement(element);
            element.dispose();
        }
    }

    dispose() {
        this.disposeElements();
        super.dispose();

    }

    /**
     * Placeholder for initGraphics, which should be implemented in subclass.
     * initGraphics should NOT initialize or refer to any properties that are declared in one of the subclasses.
     * In TypeScript, properties declared in a subclass are initialized AFTER the parent constructor is called,
     * which means that any initialization that happens in a parent class's constructor will be overwritten...
     */
    // _initGraphics(){
    //     throw new Error(`Function initGraphics() not currently implemented in class ${this.constructor.name}!`);
    // }
}
