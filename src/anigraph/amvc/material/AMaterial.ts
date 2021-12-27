import {folder} from "leva";
import {AObject} from "../../aobject";
import {MaterialParameters} from "three/src/materials/Material";
import {ASerializable} from "../../aserial";
import {AMaterialModel} from "./AMaterialModel";

import {Color} from "../../amath";


enum AMaterialEvents{
    CHANGE='MATERIAL_CHANGE',
    UPDATE='MATERIAL_UPDATE'
}

@ASerializable("AMaterial")
export class AMaterial extends AObject{
    protected _model!:AMaterialModel;
    public _material!:THREE.Material;
    static Events = AMaterialEvents;
    get threejs(){return this._material;}

    get model(){
        return this._model;
    }

    constructor(...args:any[]) {
        super();
    }

    init(model:AMaterialModel){
        this.setModel(model);
    }


    //##################//--Values--\\##################
    //<editor-fold desc="Values">
    getModelColor(){
        let c = this.getValue('color');
        if(c){
            return Color.FromThreeJS(c);
        }else{
            return Color.FromString("#77bb77");
        }
    }
    setModelColor(v:Color|THREE.Color){
        if(v instanceof  Color){
            this.setValue('color', v.asThreeJS());
        }else{
            this.setValue('color', v);
        }
    }
    setValue(name:string, value:any){
        let vals:{[name:string]:any}={};
        vals[name]=value;
        this.setValues(vals);
    }
    setValues(values:MaterialParameters){
        this.threejs.setValues(values);
        this.signalEvent(AMaterial.Events.UPDATE, values);
    }
    getValue(name:string):any{
        // @ts-ignore
        return this.threejs[name];
    }
    //</editor-fold>
    //##################\\--Values--//##################

    setModel(model:AMaterialModel){
        this._model = model;
        this._material = model._CreateTHREEJS();
        // this.threejs.setValues(this._model.defaults);
    }

    getMaterialGUIParams() {
        const self = this;
        return {
            MaterialProps: folder(
                self.model.getMaterialGUIParams(self),
                { collapsed: false }
            ),
        }
    }

}

