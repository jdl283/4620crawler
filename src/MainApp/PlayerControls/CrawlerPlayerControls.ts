import {APlayerControls} from "../../anigraph/aplayercontrols/APlayerControls";
import {
    A3DSceneController, AClickInteraction,
    ADOMPointerMoveInteraction,
    AInteractionEvent, AKeyboardInteraction,
    CallbackType, GetAppState, Quaternion
} from "../../anigraph";
import {APointerLockPlayerControls} from "../../anigraph/aplayercontrols";
import {MainAppState} from "../MainAppState";

export class CrawlerPlayerControls extends APointerLockPlayerControls{
    /**
     * APlayerControls are a subclass of interactions that can only be added to SceneControllers
     * @returns {A3DSceneController<any, any>}
     */
    // get sceneController():A3DSceneController<any, any>{return this.owner;}


    static NameInGUI(){ // @ts-ignore
        return "CrawlerPlayerControls";}

    onLock(...args:any[]){
        // Do something when the pointer lock is entered
    }
    onUnlock(...args:any[]){
        // Do something when the pointer lock is released
    }

    // helper function to cast our appstate to the appropriate custom type
    get appState(){
        return GetAppState() as MainAppState;
    }

    static Create(owner:A3DSceneController<any, any>, onLock?:CallbackType, onUnlock?:CallbackType, ...args:any[]){
        let controls = new this();
        if(onLock){controls._onLock=onLock;}
        if(onUnlock){controls._onUnlock=onUnlock};
        controls.init(owner);
        return controls;
    }

    //##################//--Adding additional types of interactions--\\##################
    //<editor-fold desc="Adding additional types of interactions">


    /**
     * It may be convenient to bind methods that you intend to use as callbacks.
     * The relevant inherited methods are bound in the parent bindMethods() implementation,
     * but here we are adding a click callback, so we will bind it here.
     */
    bindMethods() {
        super.bindMethods();
        this.onClick = this.onClick.bind(this);

    }

    /**
     * We will add a custom click function here.
     */
    onClick(){
        if (this.appState._time - this.appState.lastDashTime > this.appState.dashCooldown)  {
            this.appState.lastDashTime = this.appState._time;
        }
    }

    /**
     * We will need to update our init function to add the new click interaction...
     * @param owner
     * @param args
     */
    init(owner:A3DSceneController<any, any>, ...args:any[]){
        super.init(owner, ...args);

        // initialize the controls
        this.addInteraction(AClickInteraction.Create(
            this.domElement,
            this.onClick
        ))
    }

    //</editor-fold>
    //##################\\--Adding additional types of interactions--//##################

    beforeActivate() {
        super.beforeActivate()
        // anything you want to do before the interaction mode is activated
    }
    beforeDeactivate(...args:any[]) {
        // anything you want to do before the interaction mode is deactivated
        this.onUnlock();
        this.disconnect();
    }

    onMouseMove(interaction:ADOMPointerMoveInteraction,  event:AInteractionEvent ) {
        // ignore if we aren't locked
        if ( this.isLocked === false ) return;

        // convenience function to get mouse movement across different browsers
        let mouseMovement = APlayerControls.GetMouseEventMovement(event);

        // Here we will map x movement of the mouse to rotation around the camera's up vector
        this.cameraNode.camera.pose.rotation = this.cameraNode.camera.pose.rotation.times(Quaternion.FromAxisAngle(this.cameraNode.up,mouseMovement.x * 0.002));
        // And y movement to rotation about the camera's right vector
        this.cameraNode.camera.pose.rotation = this.cameraNode.camera.pose.rotation.times(Quaternion.FromAxisAngle(this.cameraNode.right,mouseMovement.y * 0.002));
    }

    dispose(){
        super.dispose();
        // Any cleanup you need to do
    };


    /**
     * We will use 'wasd' controls for translating the camera here. When one of these buttons is pressed,
     * we will call this.cameraNode.moveXXX() to set the camera moving in the corresponding direction.
     * The camera will continue moving in this direction until the button is released (triggering a onKeyUp callback).
     * This works better than moving at every key down event, because those events can be sporadic, but setting state
     * lets us tie movement to a constant speed over time based on the game's clock, which is more consistent than event
     * handlers.
     * @param interaction
     * @param event
     */
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


    /**
     * When we receive a key up event we will halt motion in the corresponding direction.
     * @param interaction
     * @param event
     */
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


}
