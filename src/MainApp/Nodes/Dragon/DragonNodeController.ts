import {AInteractionEvent, AKeyboardInteraction, ASceneNodeController, Quaternion} from "../../../anigraph";
import {DragonNodeModel} from "./DragonNodeModel";

export class DragonNodeController extends ASceneNodeController<DragonNodeModel> {

    onKeyDown(interaction: AKeyboardInteraction, event: AInteractionEvent) {
        if (interaction.keysDownState[' ']) {
            this.spin();
        }
        if (interaction.keysDownState[']']) {
            this.model.transform.rotation = this.model.transform.rotation.times(Quaternion.RotationZ(Math.PI * 0.1));
        }
        if (interaction.keysDownState['[']) {
            this.model.transform.rotation = this.model.transform.rotation.times(Quaternion.RotationZ(-Math.PI * 0.1));
        }
    }


    onKeyUp(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    }

    spin(duration?: number) {
        duration = duration ?? this.model.spinDuration;
        if(this.model.isSpinning){
            return;
        }
        const self = this;
        const rotationStart = this.model.transform.rotation;
        this.addTimedAction((actionProgress) => {
            self.model.isSpinning = true;
            self.model.transform.rotation = rotationStart.times(Quaternion.FromAxisAngle(self.model.transform.rotation.Mat3().c2, actionProgress * self.model.nSpins * Math.PI * 2))
            }, duration,
            () => {
            self.model.isSpinning=false;
                self.model.transform.rotation = rotationStart;
            },
            this.model.tween)
    }

}
