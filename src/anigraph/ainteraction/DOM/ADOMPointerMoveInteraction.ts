import {
    AInteraction,
    AInteractionEvent,
    AInteractionEventListener,
    AReceivesInteractionsInterface, DOMEventInterface, DOMPointerEvents,
    PointerEvents
} from "../AInteraction";
import {CallbackType} from "../../basictypes";
import {ADragInteraction} from "../ADragInteraction";
import {ASceneController} from "../../amvc";


export type ADOMPointerMoveInteractionCallback = (interaction?:ADOMPointerMoveInteraction, event?:AInteractionEvent)=>any;

export class ADOMPointerMoveInteraction extends AInteraction{
    public pointerState:{[name:string]:any}={};
    clearPointerState(){
        this.pointerState={};
    }
    setPointerState(name:string, value:any){
        this.pointerState[name]=value;
    }
    getPointerState(name:string){
        return this.pointerState[name];
    }



    static Create(element:any, moveCallback:ADOMPointerMoveInteractionCallback, handle?:string, ...args:any[]){
        const interaction = new this(element, moveCallback, handle);
        interaction.bindMethods();
        return interaction;
    }

    constructor(element:AReceivesInteractionsInterface, callback:CallbackType, handle?:string){
        super(element, undefined, handle);
        const self = this;
        this.moveCallback = callback??this.moveCallback;

        this.addDOMEventListener(DOMPointerEvents.POINTER_MOVE, (event:AInteractionEvent)=>{
            self.moveCallback(self, event);
        });
    }

    moveCallback(interaction:ADOMPointerMoveInteraction, event?:AInteractionEvent){
        console.warn(`No click callback specified for event ${event}`);
    }

    bindMethods() {
        super.bindMethods();
        // this.moveCallback = this.moveCallback.bind(this);
    }
}
