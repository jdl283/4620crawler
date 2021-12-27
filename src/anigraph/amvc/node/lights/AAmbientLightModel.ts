import {ALightModel} from "./ALightModel";
import {BoundingBox3D, Color} from "../../../amath";
import {AObjectState} from "../../../aobject";
import {AniGraphEnums} from "../../../basictypes";

export class AAmbientLightModel extends ALightModel{
    // @AObjectState color!:Color;
    @AObjectState intensity!:number;
    @AObjectState isActive!:boolean;

    static DefaultIntensity:number=1;

    constructor(color:Color, intensity?:number) {
        super();
        this.color=color;
        this.intensity=(intensity!==undefined)?intensity:AAmbientLightModel.DefaultIntensity;
    }

    getBounds(): BoundingBox3D {
        return BoundingBox3D.BoxAtLocationWithSize(this.getWorldPosition(), AniGraphEnums.LightBoxSize);
    }
}
