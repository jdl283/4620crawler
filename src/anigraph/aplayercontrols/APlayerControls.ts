/**
 * Player Controls. An InteractionMode that activates interactions with a given DOM element.
 * You can create custom controls by subclassing to define your own:
 * onMouseMove: callback for mouse movement
 * onKeyDown & onKeyUp: callbacks for when keys are pressed and released
 */

import {AKeyboardInteraction} from "../ainteraction/DOM/AKeyboardInteraction";
import {AInteractionEvent, AInteractionMode} from "../ainteraction";
import {A3DSceneController, ACamera, ACameraNodeModel} from "../amvc";
import {ASerializable} from "../aserial";
import {ADOMPointerMoveInteraction} from "../ainteraction/DOM/ADOMPointerMoveInteraction";
import {V2} from "../amath";
import {AWheelInteraction} from "../ainteraction/AWheelInteraction";

export enum PointerLockEvents{
    Lock="PointerLock_Lock",
    Unlock="PointerLock_Unlock",
}

@ASerializable("APlayerControlsBase")
export abstract class APlayerControlsBase extends AInteractionMode {

    static NameInGUI(){ // @ts-ignore
        return this.SerializationLabel();}

    abstract setupInteractions(): void;
    public owner!: A3DSceneController<any, any>;


    static GetMouseEventMovement(event:AInteractionEvent){
        let webEvent = (event.DOMEvent as MouseEvent);
        // @ts-ignore
        const movementX = webEvent.movementX || webEvent.mozMovementX || webEvent.webkitMovementX || 0;
        // @ts-ignore
        const movementY = webEvent.movementY || webEvent.mozMovementY || webEvent.webkitMovementY || 0;
        return V2(movementX, movementY);
    }

    /**
     * If you use the regular constructor, it's best to call init(...) to initialize after.
     * @param owner
     * @param args
     */
    constructor(owner?:A3DSceneController<any, any>, ...args:any[]) {
        super();
        this.name = this.serializationLabel;
        this.isGUISelectable = true;
        if(owner){
            this.owner = owner
        };
    }

    /**
     * APlayerControls are a subclass of interactions that can only be added to SceneControllers
     * @returns {A3DSceneController<any, any>}
     */
    get sceneController(): A3DSceneController<any, any> {
        return this.owner;
    }

    get serializationLabel() {
        // @ts-ignore
        return this.constructor._serializationLabel
    }

    /**
     * This is a model that contains a camera.
     * The camera itself just encapsulates a pose and projection matrix. The model is what the camera belongs to,
     * and can be an actual entity in the scene.
     * @returns {ACameraNodeModel}
     */
    get cameraNode(): ACameraNodeModel {
        return this.owner.cameraNode;
    }

    get camera(): ACamera {
        return this.cameraNode.camera;
    }

    /**
     * This is the DOM element that is the game window being controlled
     * @type {HTMLElement}
     */
    domElement!: HTMLElement;



    init(owner: A3DSceneController<any, any>, ...args: any[]) {
        this.owner = owner;
        this.domElement = owner.container;
        this.setupInteractions();
    }

    dispose(){
    }

}


@ASerializable("APlayerControls")
export class APlayerControls extends APlayerControlsBase{



    bindMethods(){
        super.bindMethods();
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.dispose = this.dispose.bind(this);
        this.wheelCallback = this.wheelCallback.bind(this);
    }



    /**
     * Create an instance in a single call, instead of calling new followed by init
     * @param owner
     * @param args
     * @returns {APlayerControls}
     * @constructor
     */
    static Create(owner: A3DSceneController<any, any>, ...args: any[]) {
        let controls = new this();
        controls.init(owner);
        return controls;
    }

    init(owner:A3DSceneController<any, any>, ...args:any[]){
        super.init(owner, ...args);
    }

    setupInteractions(){
        this.addInteraction(AKeyboardInteraction.Create(
            this.domElement.ownerDocument,
            this.onKeyDown,
            this.onKeyUp
        ))

        this.addInteraction(ADOMPointerMoveInteraction.Create(
            this.domElement,
            this.onMouseMove
        ))
    }

    onMouseMove(interaction?: ADOMPointerMoveInteraction, event?:AInteractionEvent){

    }

    onKeyDown(interaction:AKeyboardInteraction, event:AInteractionEvent){
        if(interaction.keysDownState['w']){
            this.cameraNode.moveForward();
        }
        if(interaction.keysDownState['a']){
            this.cameraNode.moveLeft();
        }
        if(interaction.keysDownState['s']){
            this.cameraNode.moveBackward();
        }
        if(interaction.keysDownState['d']){
            this.cameraNode.moveRight();
        }
        if(interaction.keysDownState['r']){
            this.cameraNode.moveUp();
        }
        if(interaction.keysDownState['f']){
            this.cameraNode.moveDown();
        }
    }

    onKeyUp(interaction:AKeyboardInteraction, event:AInteractionEvent){
        if(!interaction.keysDownState['w']){
            this.cameraNode.haltForward();
        }
        if(!interaction.keysDownState['a']){
            this.cameraNode.haltLeft();
        }
        if(!interaction.keysDownState['s']){
            this.cameraNode.haltBackward();
        }
        if(!interaction.keysDownState['d']){
            this.cameraNode.haltRight();
        }
        if(!interaction.keysDownState['r']){
            this.cameraNode.haltUp();
        }
        if(!interaction.keysDownState['f']){
            this.cameraNode.haltDown();
        }
    }

    wheelCallback(interaction:AWheelInteraction, event?:AInteractionEvent){
        console.log(event);
    }
}
