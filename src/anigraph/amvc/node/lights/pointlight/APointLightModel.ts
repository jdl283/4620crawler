import {ALightModel} from "../ALightModel";
import {AObjectState} from "../../../../aobject";
import {BoundingBox3D, Color, Quaternion, V3} from "../../../../amath";
import {ASerializable} from "../../../../aserial";
import {AClock} from "../../../AClock";
import {AniGraphEnums} from "../../../../basictypes";

@ASerializable("APointLightModel")
export class APointLightModel extends ALightModel{
    @AObjectState falloff!:number;
    @AObjectState isActive!:boolean;
    @AObjectState orbitRate!:number;
    public clock:AClock;
    @AObjectState time:number;
    // @AObjectState color!:Color;

    getModelGUIControlSpec() {
        let self = this;
        return {
            intensity: {
                value: self.intensity,
                onChange: (v: any) => {
                    self.intensity = v;
                },
                min: 0,
                max: 50,
                step: 0.1
            },
            orbitRate: {
                value: self.orbitRate,
                onChange: (v: any) => {
                    self.orbitRate = v;
                },
                min: 0,
                max: 5,
                step: 0.01
            },
            ...super.getModelGUIControlSpec()
        }
    }

    constructor() {
        super();
        this.clock = new AClock();
        this.time = 0;
        this.orbitRate=0;
        this.intensity=1;
        const self = this;
        this.subscribe(this.clock.addTimeListener((t:number)=>{
                if(self.orbitRate>0){
                    self.transform.rotation = Quaternion.FromAxisAngle(V3(0,0,1), (self.orbitRate*2*Math.PI*t));
                }
            }),
            'PointlightTimeUpdate');
        self.clock.play();
    }

    getBounds(): BoundingBox3D {
        let b = new BoundingBox3D();
        b.boundBounds(BoundingBox3D.BoxAtLocationWithSize(V3(), AniGraphEnums.LightBoxSize));
        b.transform = this.transform;
        return b;
    }
}
