import {ASceneNodeController, ASceneNodeView, Quaternion} from "../../../anigraph";
import {ExampleNodeModel} from "./ExampleNodeModel";

export class ExampleNodeController extends ASceneNodeController<ExampleNodeModel>{
    initInteractions() {
        super.initInteractions();

        const self=this;
        this.subscribe(
            this.model.addEventListener(ExampleNodeModel.SpinEventHandle, ()=>{
                self.spin();
            })
        )
    }

    spin(duration?:number){
        duration = duration??this.model.spinDuration;
        const self = this;
        const rotationStart = this.model.transform.rotation;
        this.addTimedAction((actionProgress)=>{
            self.model.transform.rotation = rotationStart.times(Quaternion.RotationZ(actionProgress*self.model.nSpins*Math.PI*2))
        }, duration,
            ()=>{
                self.model.transform.rotation = rotationStart;
            },
            this.model.tween)
    }

}
