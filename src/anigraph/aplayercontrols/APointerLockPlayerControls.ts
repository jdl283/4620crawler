/***
 * You can listen for changes in the lock state by listening to the owner (controller) for events:
 * APointerLockPlayerControls.LockEvents.Lock, // for locking (the cursor)
 * APointerLockPlayerControls.LockEvents.Unlock, // for unlocking
 */
import * as THREE from "three";
import {APlayerControls, PointerLockEvents} from "./APlayerControls";
import {ASerializable} from "../aserial";
import {AClickInteraction, ADOMPointerMoveInteraction, AInteractionEvent, AKeyboardInteraction} from "../ainteraction";
import {A3DSceneController, ASceneController} from "../amvc";
import {CallbackType} from "../basictypes";
import {Quaternion, V3} from "../amath";

@ASerializable("APointerLockPlayerControls")
export class APointerLockPlayerControls extends APlayerControls{
    domElement!: HTMLElement;
    isLocked: boolean;
    minPolarAngle:number = 0; // radians
    maxPolarAngle:number = Math.PI; // radians
    _onLock!:CallbackType;
    _onUnlock!:CallbackType;
    onLock(...args:any[]){if(this._onLock){this._onLock(...args);}}
    onUnlock(...args:any[]){if(this._onUnlock){this._onUnlock(...args);}}
    static LockEvents=PointerLockEvents;

    constructor(domElement?:HTMLElement, ...args:any[]) {
        super();
        if(domElement){this.domElement=domElement};
        this.isLocked=false;
    }

    bindMethods(){
        super.bindMethods();
        this.onPointerlockChange = this.onPointerlockChange.bind(this);
        this.onPointerlockError = this.onPointerlockError.bind(this);
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.dispose = this.dispose.bind(this);
        this.lock = this.lock.bind(this);
        this.unlock = this.unlock.bind(this);
    }

    init(owner:A3DSceneController<any, any>, ...args:any[]){
        super.init(owner, ...args);
        const self = this;
        this.addInteraction(AClickInteraction.Create(this.domElement, ()=>{
            self.lock();
        }))

    }


    static Create(owner:A3DSceneController<any, any>, onLock?:CallbackType, onUnlock?:CallbackType, ...args:any[]){
        let controls = new this();
        if(onLock){controls._onLock=onLock;}
        if(onUnlock){controls._onUnlock=onUnlock};
        controls.init(owner);
        return controls;
    }

    beforeActivate() {
        this.connect();
    }
    beforeDeactivate(...args:any[]) {
        this.onUnlock();
        this.disconnect();
    }



    onMouseMove(interaction:ADOMPointerMoveInteraction,  event:AInteractionEvent ) {
        // console.log(event);
        if ( this.isLocked === false ) return;

        let webEvent = (event.DOMEvent as MouseEvent);
        // @ts-ignore
        const movementX = webEvent.movementX || webEvent.mozMovementX || webEvent.webkitMovementX || 0;
        // @ts-ignore
        const movementY = webEvent.movementY || webEvent.mozMovementY || webEvent.webkitMovementY || 0;


        // const _euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
        // _euler.setFromQuaternion( this.camera.pose.rotation );
        // _euler.y -= movementX * 0.002;
        // _euler.x -= movementY * 0.002;
        // let PI2=Math.PI*0.5;
        // _euler.x = Math.max( PI2 - this.maxPolarAngle, Math.min( PI2 - this.minPolarAngle, _euler.x ) );

        // const _euler = new THREE.Euler( 0, 0, 0, 'ZXY' );

        this.cameraNode.camera.pose.rotation = this.cameraNode.camera.pose.rotation.times(Quaternion.FromAxisAngle(this.cameraNode.up,movementX * 0.002));
        this.cameraNode.camera.pose.rotation = this.cameraNode.camera.pose.rotation.times(Quaternion.FromAxisAngle(this.cameraNode.right,movementY * 0.002));
        // _euler.x -= movementY * 0.002;

        // const _euler = new THREE.Euler( 0, 0, 0, 'ZYX' );
        // _euler.setFromQuaternion( this.cameraNode.camera.pose.rotation );
        // _euler.z -= movementX * 0.002;
        // _euler.x -= movementY * 0.002;
        // let PI2=Math.PI*0.5;
        // function btwn(num:number,min:number,max:number, shift:number=0){
        //     return Math.max(min, Math.min(max, num-shift))-shift;
        // }
        // _euler.x = btwn(_euler.x, 0, 2*PI2,0);

        // _euler.x = btwn(_euler.x, PI2-this.maxPolarAngle, PI2 - this.minPolarAngle);
        // _euler.x = Math.max( PI2 - this.maxPolarAngle, Math.min( PI2 - this.minPolarAngle, _euler.x ) );

        // let r = (new THREE.Quaternion()).setFromEuler(_euler);
        // this.cameraNode.camera.pose.rotation = Quaternion.FromQuaternion(r);
        // this.dispatchEvent( _changeEvent );
        // this.signalEvent()
    }

    onPointerlockChange() {
        const self = this;
        if ( self.domElement.ownerDocument.pointerLockElement === self.domElement ) {
            self.owner.signalEvent(APointerLockPlayerControls.LockEvents.Lock);
            self.isLocked = true;
        } else {
            self.owner.signalEvent(APointerLockPlayerControls.LockEvents.Unlock);
            self.isLocked = false;
        }
    }

    onPointerlockError(){
        console.error( 'Unable to use Pointer Lock API' );
    }

    connect(){
        const self = this;
        // self.domElement.ownerDocument.addEventListener( 'mousemove', self.onMouseMove );
        self.domElement.ownerDocument.addEventListener( 'pointerlockchange', self.onPointerlockChange );
        self.domElement.ownerDocument.addEventListener( 'pointerlockerror', self.onPointerlockError );
    }

    disconnect(){
        const self = this;
        // self.domElement.ownerDocument.removeEventListener( 'mousemove', self.onMouseMove );
        self.domElement.ownerDocument.removeEventListener( 'pointerlockchange', self.onPointerlockChange );
        self.domElement.ownerDocument.removeEventListener( 'pointerlockerror', self.onPointerlockError );

    }

    lock(){
        this.domElement.requestPointerLock();
        this.onLock();
    }

    unlock(){
        this.domElement.ownerDocument.exitPointerLock();
        this.onUnlock();
    }

    dispose(){
        this.disconnect();
    };

    // getObject(){
    //     return camera;
    // };

}
