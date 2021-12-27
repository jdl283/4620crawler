import {ASerializable} from "../../../../aserial";
import {CubicBezierModel} from "../cubicbezier";
import {AObjectState} from "../../../../aobject";

@ASerializable("AExtrudedShapeModel")
export class AExtrudedShapeModel extends CubicBezierModel{
    @AObjectState extrudeSettings:{[name:string]:any};

    constructor() {
        super();
        this.extrudeSettings = {};
        this.extrudeDepth=10;
    }

    setExtrudeSetting(name:string, value:any){
        this.extrudeSettings[name]=value;
    };
    getExtrudeSetting(name:string){
        return this.extrudeSettings[name];
    }

    get extrudeDepth(){
        return this.getExtrudeSetting('depth');
    }
    set extrudeDepth(v:number){
        this.setExtrudeSetting('depth', v);
    }

    getModelGUIControlSpec(){
        const self = this;
        const customSpec = {
            extrudeDepth:{
                value:self.extrudeDepth,
                min:-100,
                max:100,
                step:1,
                onChange:(v:number)=>{
                    self.extrudeDepth = v;
                }
            },
        }
        return {...super.getModelGUIControlSpec(), ...customSpec}
    }

}
