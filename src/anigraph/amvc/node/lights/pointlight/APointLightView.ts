import * as THREE from "three";
import {ALightView} from "../ALightView";
import {ALightController} from "../ALightController";
import {APointLightElement} from "../../../../arender/scenevis/APointLightElement";
import {APointLightModel} from "./APointLightModel";
import {ASerializable} from "../../../../aserial";

@ASerializable("APointLightView")
export class APointLightView extends ALightView<APointLightModel>{
    controller!:ALightController<APointLightModel>;
    element!:APointLightElement;
    _light!:THREE.PointLight;
    get light(){return this._light;}

    get model():APointLightModel{
        return this.controller.model;
    }

    initGraphics() {
        super.initGraphics();
        this._light = new THREE.PointLight(this.model.color.asThreeJS(), this.model.intensity);
        this.element=new APointLightElement(this.model.color.Darken(10));
        // this.element.init(this.model.color.Darken(10), this.model.intensity);
        this.addElement(this.element);
        this.threejs.add(this._light);

        const self=this;
        // this.addMaterialChangeCallback(
        //     ()=>{
        //         self.element.setColor(self.model.color.Darken(10));
        //     },
        //     'model.color'
        // )

        this.subscribe(this.model.addStateKeyListener('intensity', ()=>{
            self.light.intensity = (self.model.intensity);
        }))
        this.addLightColorChangeCallback(()=>{
            self.light.color = self.model.color.asThreeJS();
            self.element.setColor(self.model.color);
        });
    }

}
