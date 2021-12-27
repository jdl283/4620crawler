import {ASceneNodeView} from "../base/ASceneNodeView";
import {ALightModel} from "./ALightModel";
import {ALightController} from "./ALightController";
import {AObject} from "../../../aobject";

export abstract class ALightView<NodeModelType extends ALightModel> extends ASceneNodeView<NodeModelType>{
    abstract controller:ALightController<NodeModelType>;
    abstract _light:THREE.Light;
    addLightColorChangeCallback(callback:(self?:AObject)=>void, handle?:string){
        const self = this;
        this.controller.subscribe(
            self.model.addStateKeyListener(
                'color',
                ()=>{
                    callback();
                }, undefined, false,
            ),
            handle
        );
    }

}
