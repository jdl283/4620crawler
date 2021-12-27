import * as THREE from "three";
import {AModel} from "../base/AModel";
import {AView} from "../base/AView"
import {ASceneNodeModel} from "../node";
import {ASceneController} from "../scene";
import {ASupplementalController} from "./ASupplementalController";

// import {
//     AModel,
//     AView,
//     ASceneNodeModel,
//     ASceneController,
//     ASupplementalController
// } from "src/anigraph";


export abstract class ASupplementalView<ModelType extends AModel, NodeModelType extends ASceneNodeModel> extends AView<ModelType>{
    public threejs!: THREE.Object3D;
    abstract controller:ASupplementalController<ModelType,NodeModelType>;

    get sceneController(){
        if(this.controller instanceof ASceneController){
            return this.controller;
        }else{
            return this.controller.sceneController;
        }
    }
    get sceneView(){
        return this.controller.sceneController.view;
    }
    abstract initGraphics():void;

}


