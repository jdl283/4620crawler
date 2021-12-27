import {ExampleDragOrbitControls} from "./ExampleDragOrbitControls";
import {ADragInteraction, AInteractionEvent, NodeTransform3D, Quaternion} from "../../anigraph";

export class ExampleDragOrbitControlsRestricted extends ExampleDragOrbitControls{
    dragStartCallback(interaction:ADragInteraction, event:AInteractionEvent){
        interaction.dragStartPosition = event.cursorPosition;
        interaction.setInteractionState('startPose', this.cameraNode.camera.pose.clone());
    }
    dragMoveCallback(interaction:ADragInteraction, event:AInteractionEvent){
        let startPose:NodeTransform3D = interaction.getInteractionState('startPose').clone();
        let mouseMovement = event.cursorPosition.minus(interaction.dragStartPosition);
        let rotationX = mouseMovement.y*0.002;
        let rotationY = mouseMovement.x*0.002;
        let qY = Quaternion.FromAxisAngle(this.cameraNode.right, rotationX);
        let qX = Quaternion.FromAxisAngle(this.cameraNode.up, rotationY);
        let newPose = startPose;
        let q = qX.times(qY);
        newPose = new NodeTransform3D(q.getInverse().appliedTo(newPose.position), newPose.rotation.times(q));
        this.cameraNode.camera.pose = newPose;
    }
}
