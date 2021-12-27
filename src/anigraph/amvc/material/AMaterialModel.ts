import * as THREE from "three";
import {ColorRepresentation} from "three";
import {MaterialParameters} from "three/src/materials/Material";
import {AObjectState} from "../../aobject";
import {ClassInterface} from "../../basictypes";
import {AModel} from "../base/AModel";
import {ASerializable} from "../../aserial";
import {AMaterial} from "./AMaterial";
import {Color} from "../../amath";


type MaterialParams = {
    [P in keyof MaterialParameters]?:MaterialParameters[P];
} & {
    color?:ColorRepresentation|undefined;
};


export abstract class AMaterialModelBase<ParamInterface extends {[name:string]:any}> extends AModel{
    @AObjectState sharedParameters!:{[name:string]:any};
    public _defaults!:ParamInterface;
    public materialClass!:ClassInterface<THREE.Material>;
    public name!:string;
    get defaults(){return this._defaults;}
    set defaults(v:ParamInterface){this._defaults=v;}

    // abstract get color():Color;
    // abstract set color(c:Color);

    setSharedParam(name:string, val:any){
        console.warn("Shader params not implemented yet. Need to add listeners to model.");
        this.sharedParameters[name]=val;
    }
    setSharedParameters(params:ParamInterface){
        this.sharedParameters = params;
    }

    getMaterialGUIParams(material:AMaterial){
        const self = this;
        return {}
    }

    static MaterialGUIColorControl(material:AMaterial, paramKey?:string){
        const paramName = paramKey?paramKey:'color';
        let rval:{[name:string]:any} = {};
        rval[paramName] = {
            value: material.getValue(paramName)?Color.FromThreeJS(material.getValue(paramName)).toHexString():"#000000",
            onChange: (v: string) => {
                let selectedColor = Color.FromString(v);
                material.setValue(paramName, selectedColor.asThreeJS());
            },
        }
        return rval;
    }

    static MaterialGUIControl(material:AMaterial, paramName:string, defaultValue:any, otherSpecs:{[name:string]:any}){
        let rval:{[name:string]:any} = {};
        rval[paramName] = {
            value: material.getValue(paramName)?material.getValue(paramName):defaultValue,
            onChange: (v: string) => {
                material.setValue(paramName, v);
            },
            ...otherSpecs
        }
        return rval;
    }

    constructor(name?:string, materialClass?:ClassInterface<THREE.Material>, defaults?:ParamInterface, sharedParams?:ParamInterface, ...args:any[]) {
        super();
        if(name){this.name=name;}
        if(materialClass){this.materialClass=materialClass;}
        if(sharedParams){this.sharedParameters=sharedParams;}else{this.sharedParameters={};}
        if(defaults){this.defaults=defaults;}
    }

    _CreateTHREEJS(){
        return new this.materialClass({
            ...this.defaults,
            ...this.sharedParameters
        }, );
    }

    CreateMaterial(){
        let material =  new AMaterial();
        material.init(this);
        material.setValues({...this.defaults, ...this.sharedParameters});
        return material;
    }

}


@ASerializable("AMaterialModel")
export class  AMaterialModel extends AMaterialModelBase<MaterialParams>{

    // get color(){
    //     // @ts-ignore
    //     return ('color' in this.sharedParameters)?Color.FromThreeJS(this.sharedParameters.color):('color' in this.defaults && this.defaults.color!==undefined)?Color.FromThreeJS(this.defaults.color):Color.FromString("#00aa00");
    // };
    // set color(c:Color){
    //     if('color' in this.sharedParameters){
    //         this.sharedParameters.color = c;
    //     }else if('color' in this.defaults){
    //
    //     }
    // }

    constructor(name?:string, materialClass?:ClassInterface<THREE.Material>, defaults?:MaterialParameters, sharedParams?:MaterialParams, ...args:any[]) {
        super(name, materialClass, sharedParams, defaults, );
    }


}

