import {ASceneNodeModel} from "../base/ASceneNodeModel";
import {Color} from "../../../amath";
import {AObjectState} from "../../../aobject";
import {ASerializable} from "../../../aserial";

@ASerializable("ALightModel")
export abstract class ALightModel extends ASceneNodeModel{
    // @AObjectState lightColor!:Color;
    @AObjectState intensity:number;
    abstract isActive:boolean;
    static DefaultIntensity:number=1;
    constructor(color?:Color, intensity?:number) {
        super();
        this.color = color??Color.FromString("#cccccc");
        this.intensity = intensity??ALightModel.DefaultIntensity;
    }
}
