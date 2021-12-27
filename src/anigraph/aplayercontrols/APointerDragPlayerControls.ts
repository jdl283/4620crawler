/***
 * You can listen for changes in the lock state by listening to the owner (controller) for events:
 * APointerLockPlayerControls.LockEvents.Lock, // for locking (the cursor)
 * APointerLockPlayerControls.LockEvents.Unlock, // for unlocking
 */
import * as THREE from "three";
import {APlayerControls} from "./APlayerControls";
import {ASerializable} from "../aserial";
import {
    ADragInteraction,
    AInteractionEvent,
} from "../ainteraction";
import {A3DSceneController} from "../amvc";
import {Quaternion} from "../amath";
import {AWheelInteraction} from "../ainteraction/AWheelInteraction";

@ASerializable("APointerLockPlayerControls")
export class APointerDragPlayerControls extends APlayerControls{
    domElement!: HTMLElement;



    constructor(domElement?:HTMLElement, ...args:any[]) {
        super();
        if(domElement){this.domElement=domElement};
    }

    bindMethods(){
        super.bindMethods();
        this.dragStartCallback = this.dragStartCallback.bind(this);
        this.dragMoveCallback = this.dragMoveCallback.bind(this);
        this.dragEndCallback = this.dragEndCallback.bind(this);
    }

    init(owner:A3DSceneController<any, any>, ...args:any[]) {
        super.init(owner, ...args);
        this.addInteraction(ADragInteraction.Create(
            this.domElement,
            this.dragStartCallback,
            this.dragMoveCallback,
            this.dragEndCallback
        ));
        this.addInteraction(AWheelInteraction.Create(
            this.domElement,
            this.wheelCallback
        ));
    }

    dragStartCallback(interaction:ADragInteraction, event:AInteractionEvent){
        interaction.dragStartPosition = event.cursorPosition;
    }
    dragMoveCallback(interaction:ADragInteraction, event:AInteractionEvent){
        let mouseMovement = event.cursorPosition.minus(interaction.dragStartPosition);
        // Here we will map x movement of the mouse to rotation around the camera's up vector
        this.cameraNode.camera.pose.rotation = this.cameraNode.camera.pose.rotation.times(Quaternion.FromAxisAngle(this.cameraNode.up,mouseMovement.x * 0.002));
        // And y movement to rotation about the camera's right vector
        this.cameraNode.camera.pose.rotation = this.cameraNode.camera.pose.rotation.times(Quaternion.FromAxisAngle(this.cameraNode.right,mouseMovement.y * 0.002));
    }
    dragEndCallback(interaction:ADragInteraction, event?:AInteractionEvent){
    }



}
