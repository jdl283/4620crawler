import {AObjectState} from "../../aobject/AObject";
import {ASerializable} from "../../aserial/ASerializable";
import {AObjectNode} from "../../aobject/AObjectNode";
import {ACallbackSwitch} from "../../aevents";

export interface AModelInterface{
    uid:string;
    name:string;
    parent:AObjectNode|null;
    serializationLabel:string;
    addEventListener(eventName:string, callback:(...args:any[])=>void, handle?:string):ACallbackSwitch;
}

export interface AModelClassInterface<T extends AModelInterface> extends Function {
    new (...args:any[]): T
    SerializationLabel():string;
}

export interface ANodeModelClassInterface<NodeModelType> extends Function {
    new (...args:any[]): NodeModelType
    SerializationLabel():string;
}


enum AModelEvents{
    DISPOSE='DISPOSE'
}

@ASerializable("AModel")
export abstract class AModel extends AObjectNode implements AModelInterface{
    @AObjectState public name!:string;

    static Events = AModelEvents;


    constructor(name?:string){
        super();
        this.name = name?name:this.serializationLabel;
    }

    dispose() {
        super.dispose();
        this.signalEvent(AModel.Events.DISPOSE);
    }

}
