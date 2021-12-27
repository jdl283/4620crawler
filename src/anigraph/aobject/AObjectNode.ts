import {AObject, AObjectState} from "./AObject";
import {ASerializable} from "../aserial/ASerializable";
import {ref} from "valtio";

export enum AObjectNodeEvents{
    NewParent = 'NewParent',
    NewChild = 'NewChild'
}

@ASerializable("AObjectNode")
export class AObjectNode extends AObject{
    @AObjectState public children:AObjectNode[];
    protected _parent!:AObjectNode|null;


    constructor(){
        super();
        // @ts-ignore
        this.children = (this.children===undefined)?[]:this.children;
        // @ts-ignore
        this._parent = (this._parent===undefined)?null:this._parent;
    }

    public get parent(){
        return this._parent;
    };
    public set parent(v:AObjectNode|null){
        let oldParent = this._parent;
        let newParent = v;
        this._parent=v;
        if(newParent!==oldParent){
            this.signalEvent(AObjectNodeEvents.NewParent, newParent, oldParent);
        }
    }

    mapOverChildren(fn:(child:AObjectNode)=>any[]|void){
        var rvals = [];
        for(let child of this.children){
            rvals.push(fn(child));
        }
        return rvals;
    }

    getDescendantList(){
        const rval:AObjectNode[] = [];
        this.mapOverChildren((c:AObjectNode)=>{
            rval.push(c);
            for(let cc of c.getDescendantList()){
                rval.push(cc);
            };
        })
        return rval;
    }

    getCameraNodes(){

    }

    filterChildren(fn:(child:AObjectNode, index?:number, array?:AObjectNode[])=>boolean){
        return this.children.filter(fn);
    }

    filterDescendants(fn:(child:AObjectNode, index?:number, array?:AObjectNode[])=>boolean){
        return this.getDescendantList().filter(fn);
    }

    mapOverDescendants(fn:(child:AObjectNode)=>any[]|void){
        return this.getDescendantList().map(fn);
    }

    release(...args:any[]){
        this.releaseChildren(...args)
        if(this._parent!==null){
            this._parent._removeChild(this);
        }
        //would do super.release(args) here...
    }

    _removeChild(child:AObjectNode, triggerNewParentEvent:boolean=false){
        for(let c=0;c<this.children.length;c++){
            if(this.children[c].uid===child.uid){
                this.children.splice(c,1);
                if(triggerNewParentEvent){
                    child.parent=null;
                }else{
                    child._parent = null;
                }
                return;
            }
        }
        throw new Error(`Tried to remove node ${child} that is not a child of ${this}`);
    }

    removeChild(child:AObjectNode){
        this._removeChild(child, true);
    }


    releaseChildren(...args:any[]){
        return this.mapOverChildren((child:AObjectNode)=>{return child.release(...args);});
    }

    removeChildren(){
        const self = this;
        return this.mapOverChildren((child:AObjectNode)=>{self.removeChild(child);});
    }

    addChild(child:AObjectNode, position?:number){
        if(this.children.includes(child)){
            throw new Error(`Tried to add existing child ${child} to node ${this}`);
        }
        if(child.parent){
            this._removeFromParent(false);
            child.reparent(this);
        }else{
            child.parent=this;
        }
        if(position!==undefined){
            this.children.splice(position, 0, ref(child));
        }else{
            this.children.push(ref(child));
        }
    }

    static fromJSON(state_dict:{[name:string]:any}){
        const rval = (this.CreateWithState(state_dict) as AObjectNode);
        rval.mapOverChildren((c:AObjectNode)=>{
                c._parent = rval;
            }
        );
        return rval;
    }
    toJSON(){
        return this.state;
    }


    //##################//--Reparenting--\\##################
    //<editor-fold desc="Reparenting">

    getChildWithID(uid:string){
        for(let c=0;c<this.children.length;c++){
            if(this.children[c].uid===uid){
                return this.children[c];
            }
        }
    }

    _removeFromParent(triggerNewParentEvent:boolean=false){
        if(this._parent){
            this._parent._removeChild(this, triggerNewParentEvent);
        }
    }

    _attachToNewParent(newParent:AObjectNode){
        newParent.addChild(this);
    }

    _uidsToChildrenList(uidList:string[]){
        let aon_array:AObjectNode[] = [];
        for(let uid of uidList){
            let child = this.getChildWithID(uid);
            if(child) {
                aon_array.push(child);
            }else{
                throw new Error(`unrecognized child uid: ${uid}`);
            }
        }
        return aon_array;
    }

    _childrenListToUIDs(childrenList:AObjectNode[]){
        let rval:string[]= [];
        for(let c of childrenList){
            rval.push(c.uid);
        }
        return rval;
    }

    reorderChildren(uidList:string[]){
        for(let uid of uidList){
            let child = this.getChildWithID(uid);
            if(child){
                child.reparent(this);
            }else{
                throw new Error ("Tried to reorder children with uid that does not belong to parent.")
            }
        }
    }


    reparent(newParent:AObjectNode){
        this._removeFromParent(false);
        this._attachToNewParent(newParent);
    }
    //</editor-fold>
    //##################\\--Reparenting--//##################


}






