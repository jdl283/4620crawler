// static GetSplineValueForAlpha(alpha, p0, p1, p2, p3){
//     var a = ((p0*-1)+(p1*3)+(p2*-3)+p3)*alpha*alpha*alpha;
//     var b =((p0*3)+(p1*-6)+(p2*3))*alpha*alpha;
//     var c =((p0*-3)+(p1*3))*alpha;
//     var d = p0;
//     return a+b+c+d;
// }


// import {ASerializable, AObjectState, A2DPolygonModel, Color} from "src/anigraph/index"

import {ASerializable} from "../../../../aserial";
import {AObjectState} from "../../../../aobject";
import {A2DPolygonModel} from "../../../node/shape";
import {Color} from "../../../../amath";

@ASerializable("CubicBezierModel")
export class CubicBezierModel extends A2DPolygonModel{
    @AObjectState inEditMode:boolean;
    @AObjectState nSubdivisions:number;
    @AObjectState strokeWidth:number;
    @AObjectState fillAlpha:number;
    @AObjectState strokeColor:Color;
    constructor() {
        super();
        this.inEditMode=false;
        this.nSubdivisions = 20;
        this.strokeWidth = 0.005;
        this.strokeColor = Color.FromString("#000000");
        // this.color = Color.Random();
        this.fillAlpha = 1;
    }

    getModelGUIControlSpec(){
        const self = this;
        const customSpec = {
            ModelName: {
                value:self.name,
                onChange:(v:string)=>{
                    self.name = v;
                }
            },
            inEditMode: {
                value: self.inEditMode,
                onChange: (v: boolean) => {
                    self.inEditMode=v;
                }
            },
            nSubdivisions:{
                value:self.nSubdivisions,
                min:0,
                max:30,
                step:1,
                onChange:(v:number)=>{
                    self.nSubdivisions = v;
                }
            },
            fillAlpha:{
                value:self.fillAlpha,
                min:0,
                max:1,
                step:0.001,
                onChange:(v:number)=>{
                    self.fillAlpha = v;
                }
            },
        }
        return {...customSpec, ...super.getModelGUIControlSpec()}
    }

}
