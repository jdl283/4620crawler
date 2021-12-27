/**
 * For defining interactions with graphics.
 * If you want to subclass to cover a different class of interactions (e.g., not using three.interaction) you just need to change the addEventListener call to use
 */
import * as THREE from "three";
import {Vec2} from "../amath";
import {AControllerInterface} from "../amvc/base/AController";
import {ACallbackSwitch} from "../aevents";
import {InteractionEvent} from "../thirdparty/threeinteraction";
import {AModelInterface} from "../amvc/base/AModel";
import {ASceneNodeController} from "../amvc/node/base/ASceneNodeController";
import {AMockInteractiveElement} from "./AMockInteractiveElement";

export const enum PointerEvents{
    POINTER_UP = 'pointerup',
    POINTER_DOWN='pointerdown',
    POINTER_MOVE = 'pointermove',
    POINTER_CLICK = 'click',
    POINTER_WHEEL='wheel'
}

export const enum DOMPointerEvents{
    POINTER_CLICK = 'pointertap',
    POINTER_MOVE = 'pointermove',
}


interface ReceivesOnOffInteractionsInterface{
    on(eventType:string, callback:(...args:any[])=>any):any;
    off(eventType:string, callback:(...args:any[])=>any):any;
    once(eventType:string, callback:(...args:any[])=>any):any;
}

interface ReceivesEventListenerInteractionsInterface{
    addEventListener(eventType:string, callback:(event:any)=>any, ...args:any[]):any;
    removeEventListener(eventType:string, callback:(event:any)=>any, ...args:any[]):any;
}

export type AReceivesInteractionsInterface = ReceivesEventListenerInteractionsInterface|ReceivesOnOffInteractionsInterface;

export interface AInteractionEventListener{
    eventType: string;
    addListener: () => void;
    removeListener: () => void;
}

export interface DOMEventInterface extends Event{
    clientX?:number;
    clientY?:number;
    key?:string;
    code?:string;
}


export abstract class AInteractionEvent{
    public interaction!:AInteraction;
    abstract _event:DOMEventInterface|InteractionEvent;
    abstract get DOMEvent():Event;
    abstract preventDefault():void;
    abstract elementIsTarget(event:AReceivesInteractionsInterface):boolean;
    abstract get eventIsOnTarget():boolean;
    abstract get positionInContext():Vec2;
    abstract get cursorPosition():Vec2;
    abstract get targetModel():AModelInterface;
    abstract get shiftKey():boolean;
    abstract get altKey():boolean;
    abstract get ctrlKey():boolean;
    abstract get onFirstIntersection():boolean;
}

export class AMockInteractionEvent extends AInteractionEvent{
    public _cursorPosition:Vec2;
    _shiftKey:boolean;
    _altKey:boolean;
    _ctrlKey:boolean;
    static GetMockElement(){
        return {
            addEventListener:(eventType:string, callback:(event:any)=>any, ...args:any[])=>{return;},
            removeEventListener:(eventType:string, callback:(event:any)=>any, ...args:any[])=>{}
        }
    }
    get onFirstIntersection(){return true;}
    public _event!:DOMEventInterface;
    constructor(interaction:AInteraction, cursorPosition:Vec2, shiftKey:boolean=false, altKey:boolean=false, ctrlKey:boolean=false, event?:DOMEventInterface){
        super();
        this._event = (event as DOMEventInterface);
        if(!this._event){
            // @ts-ignore
            this._event = this;
        }
        this.interaction=interaction;
        this._cursorPosition = cursorPosition;
        this._shiftKey = shiftKey;
        this._altKey = altKey;
        this._ctrlKey=ctrlKey;
    }
    get DOMEvent(){return this._event;}
    preventDefault(){}
    elementIsTarget(event:AReceivesInteractionsInterface){return true;};
    get eventIsOnTarget(){return true;}
    get positionInContext() {return this._cursorPosition;};
    get cursorPosition(){return this._cursorPosition;};
    get targetModel(){
        return (this.interaction.owner as ASceneNodeController<any>).sceneController.model;
    }
    get shiftKey(){return this._shiftKey};
    get altKey(){return this._altKey;};
    get ctrlKey(){return this._ctrlKey;}
}


export class ADOMInteractionEvent extends AInteractionEvent{
    public _event:DOMEventInterface;
    constructor(event:DOMEventInterface, interaction:AInteraction){
        super();
        this._event = event;
        this.interaction=interaction;
    }
    get onFirstIntersection(){return true;}
    get DOMEvent() {
        return this._event;
    }
    get shiftKey(){
        return (this._event as PointerEvent).shiftKey;
    }
    get altKey(){
        return (this._event as PointerEvent).altKey;
    }
    get ctrlKey(){
        return (this._event as PointerEvent).ctrlKey;
    }

    preventDefault(){
        this._event.preventDefault();
    }
    elementIsTarget(element:AReceivesInteractionsInterface){
        return this._event.target===element;
    }
    get positionInContext(){
        const contextElement = this.interaction.owner.getContextDOMElement();
        const svgrect = contextElement.getBoundingClientRect();
        // @ts-ignore
        return new Vec2(this._event.clientX-svgrect.left, this._event.clientY-svgrect.top);
    }
    get cursorPosition(){
        return this.positionInContext;
    }
    get targetModel(){
        return (this.interaction.owner as ASceneNodeController<any>).sceneController.model;
    }
    get eventIsOnTarget(){
        return this._event.target===this._event.currentTarget;
    }
}

export class AThreeJSInteractionEvent extends AInteractionEvent{
    public _event:InteractionEvent;
    constructor(event:InteractionEvent, interaction:AInteraction){
        super();
        this._event = event;
        this.interaction=interaction;
    }
    get DOMEvent() {
        return this._event.data.originalEvent;
    }
    get shiftKey():boolean{
        return this._event.data.originalEvent.shiftKey;
    }
    get altKey(){
        return this._event.data.originalEvent.altKey;
    }
    get ctrlKey(){
        return this._event.data.originalEvent.ctrlKey;
    }
    get clientXY() {
        return new Vec2(this.DOMEvent.clientX, this.DOMEvent.clientY);
    }
    get normalizedXY(){
        return new Vec2(this._event.data.global.x, this._event.data.global.y);
    }
    get intersections(){
        return this._event.intersects;
    }
    get onFirstIntersection(){return this._event.isFromClosestIntersect;}
    preventDefault(){
        // this.DOMEvent.preventDefault();
    }
    elementIsTarget(element:AReceivesInteractionsInterface){
        return this._event.target===element;//===this._event.currentTarget;
    }
    get eventIsOnTarget(){
        return this._event.target===this._event.currentTarget;
    }
    get positionInContext(){
        const contextElement = this.interaction.owner.getContextDOMElement();
        const svgrect = contextElement.getBoundingClientRect();
        // @ts-ignore
        return new Vec2(this.DOMEvent.clientX-svgrect.left, this.DOMEvent.clientY-svgrect.top);
    }
    get cursorPosition(){
        return (this.interaction.owner as ASceneNodeController<any>).sceneController.normalizedToViewCoordinates(this.normalizedXY);
        // return this.normalizedXY;
    }
    get targetModel(){
        return (this.interaction.owner as ASceneNodeController<any>).sceneController.nodeControllers[this._event.target.userData['modelID']].model
    }

}



export class AInteraction extends ACallbackSwitch {
    public interactionState:{[name:string]:any}={};
    setInteractionState(name:string, value:any){
        this.interactionState[name]=value;
    }
    getInteractionState(name:string){
        return this.interactionState[name];
    }
    clearInteractionState(){
        this.interactionState={};
    }
    protected _eventListeners:AInteractionEventListener[];

    /**
     * `owner` is whatever holds the interactions.
     * @type {AControllerInterface}
     */
    public owner!: AControllerInterface<any>;
    /**
     * `element` is typically the thing being interacted with. For example, if you are adding a click interaction to a THREE.Mesh, then the element would be the THREE.Mesh.
     * @type {any}
     */
    public element: AReceivesInteractionsInterface;

    public onlyOnFirstIntersection:boolean=true;

    _shouldIgnoreEvent(event:Event|InteractionEvent){
            return false;
    }

    // static Create(element:any, clickCallback?:CallbackType, handle?:string, ...args:any[]);

    getWindowElement(){
        return window;
    }

    getSceneElement(){
        // return this.owner.sceneController.view._backgroundElement;
        if(!('sceneController' in this.owner)){throw new Error("Tried to get background element on controller class without a sceneController property...");}
        // return (this.owner as ASceneNodeController<any>).sceneController.view.backgroundThreeJSObject;
        return (this.owner as ASceneNodeController<any>).sceneController.view.threejs;
    }

    /**
     * Event listeners is a list of event listeners associated with the interaction. Often this may just be a single event listener, but in the case of, for example, dragging, it may contain multiple event listeners.
     * And event listener is one call of [...].on(...).
     * @type {any[]}
     * @private
     */
    /** Get eventListeners */
    get eventListeners(){return this._eventListeners;};

    /**
     *
     * @param element
     * @param eventListeners
     * @param onlyMouseDownOnTarget - should this trigger only when the element is the target of the interaction. Defaults to true.
     * @param handle
     */
    constructor(element:AReceivesInteractionsInterface, eventListeners?:AInteractionEventListener[], handle?:string){
        super(handle);
        this.element = element;
        this._eventListeners = eventListeners?eventListeners:[];
    }

    bindMethods(){

    }

    addEventListener(eventType:string, callback:(...args:any[])=>any){
        const interaction = this;
        const modcallbackthree = function(event:InteractionEvent){
            if(!interaction._shouldIgnoreEvent(event)) {
                callback(new AThreeJSInteractionEvent(event, interaction));
            }
        }

        const modcallbackmock = function(event:InteractionEvent){
            callback(event);
        }

        const modcallbackdom = function(event:Event){
            if(!interaction._shouldIgnoreEvent(event)) {
                callback(new ADOMInteractionEvent(event, interaction));
            }
        }

        let modcallback=modcallbackthree;
        if(interaction.element instanceof AMockInteractiveElement){
            modcallback=modcallbackmock;
        }
        const isdominteraction = !(interaction.element instanceof THREE.Object3D || interaction.element instanceof AMockInteractiveElement);
        if(isdominteraction){
            // @ts-ignore
            modcallback=modcallbackdom;
        }
        // const modcallback = (isdominteraction)?modcallbackdom:modcallbackthree;

        function addListener(this:AInteractionEventListener){
            if(interaction.element instanceof THREE.Object3D || interaction.element instanceof AMockInteractiveElement){
                // @ts-ignore
                interaction.element.on(eventType, modcallback);
                // switch (eventType) {
                //     case PointerEvents.POINTER_DOWN:{
                //         // @ts-ignore
                //         interaction.element.on('touchstart', modcallback);
                //         break;
                //     }
                //     case PointerEvents.POINTER_MOVE:{
                //         // @ts-ignore
                //         interaction.element.on('touchmove', modcallback);
                //         break;
                //     }
                //     case PointerEvents.POINTER_UP:{
                //         // @ts-ignore
                //         interaction.element.on('touchend', modcallback);
                //         break;
                //     }
                //     default:{
                //         break;
                //     }
                // }
            }else{
                // @ts-ignore
                interaction.element.addEventListener(eventType, modcallback);
            }
        }

        function removeListener(this:AInteractionEventListener){
            // interaction.element.off(eventType, modcallback);
            if(interaction.element instanceof THREE.Object3D || interaction.element instanceof AMockInteractiveElement){
                // @ts-ignore
                interaction.element.off(eventType, modcallback);
                // switch (eventType) {
                //     case PointerEvents.POINTER_DOWN:{
                //         // @ts-ignore
                //         interaction.element.off('touchstart', modcallback);
                //         break;
                //     }
                //     case PointerEvents.POINTER_MOVE:{
                //         // @ts-ignore
                //         interaction.element.off('touchmove', modcallback);
                //         break;
                //     }
                //     case PointerEvents.POINTER_UP:{
                //         // @ts-ignore
                //         interaction.element.off('touchend', modcallback);
                //         break;
                //     }
                //     default:{
                //         break;
                //     }
                // }
            }else{
                // @ts-ignore
                interaction.element.removeEventListener(eventType, modcallback);
            }
        }
        // const eventListener = {eventType:eventType, addListener: addListener, removeListener: removeListener, active:false, once:false, counter:0};
        const eventListener = {eventType:eventType, addListener: addListener, removeListener: removeListener};
        eventListener.addListener = eventListener.addListener.bind(eventListener);
        eventListener.removeListener = eventListener.removeListener.bind(eventListener)
        this.eventListeners.push(eventListener);
        return eventListener;
    }

    addSceneEventListener(eventType: string, callback: (...args: any[]) => any, options?: boolean | AddEventListenerOptions){
        const interaction = this;
        // @ts-ignore
        const once:boolean = ((options!==undefined) && ((typeof options)!=="boolean"))?options.once:false;

        let modcallback = function(event:InteractionEvent){
            if(!interaction._shouldIgnoreEvent(event)) {
                callback(new AThreeJSInteractionEvent(event, interaction));
            }
        }

        function addListener(){
            // @ts-ignore
            this.active = true;
            if(once){
                // @ts-ignore
                interaction.getSceneElement().once(eventType, modcallback);
            }else{
                // @ts-ignore
                interaction.getSceneElement().on(eventType, modcallback);
            }
        }
        function removeListener(){
            // @ts-ignore
            interaction.getSceneElement().off(eventType, modcallback);
        }
        const eventListener = {eventType:eventType, addListener: addListener, removeListener: removeListener};
        eventListener.addListener = eventListener.addListener.bind(eventListener);
        eventListener.removeListener = eventListener.removeListener.bind(eventListener)

        this.eventListeners.push(eventListener);
        return eventListener;
    };

    addDOMEventListener(eventType: string, callback: (...args: any[]) => any, options?: boolean | AddEventListenerOptions){
        const interaction = this;
        // @ts-ignore
        const once:boolean = ((options!==undefined) && ((typeof options)!=="boolean"))?options.once:false;
        // @ts-ignore
        const capture:boolean = ((options!==undefined) && ((typeof options)!=="boolean"))?options.capture:false;

        let modcallback = function(event:DOMEventInterface){
            // if(!interaction._shouldIgnoreEvent(event)) {
                callback(new ADOMInteractionEvent(event, interaction));
            // }
        }
        function addListener(){
            // this.active = true;
            // @ts-ignore
            interaction.element.addEventListener(eventType, modcallback, {once:once, capture:capture});
        }
        function removeListener(){
            // this.active=false;
            // @ts-ignore
            interaction.element.removeEventListener(eventType, modcallback, {once:once, capture:capture});
        }
        const eventListener = {eventType:eventType, addListener: addListener, removeListener: removeListener};
        eventListener.addListener = eventListener.addListener.bind(eventListener);
        eventListener.removeListener = eventListener.removeListener.bind(eventListener)
        this.eventListeners.push(eventListener);
        return eventListener;
    };


    activate() {
        // if(!this.isActive) {
        this.deactivate();
        for (let eventListener of this.eventListeners) {
            eventListener.addListener();
        }
        this.active = true;
        // }
    }

    _deactivateEventListeners() {
        for (let eventListener of this.eventListeners) {
            eventListener.removeListener();
        }
    }

    clearEventListeners() {
        this._deactivateEventListeners();
        this._eventListeners = [];
    }

    deactivate() {
        // if(this.isActive){
        this._deactivateEventListeners();
        this.active = false;
        // }
    }

    dispose() {
        this.deactivate();
        this._eventListeners = [];
        // super.dispose();
    }
}
