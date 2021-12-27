import {AModel, AModelInterface} from "../base";
import {AObject, AObjectState} from "../../aobject";
import {ASerializable} from "../../aserial";
import {ASelection, SelectionEvents} from "../../aobject/ASelection";
import {GenericDict} from "../../basictypes";
import {BoundingBox3D, NodeTransform3D} from "../../amath";
import {ACallbackSwitch} from "../../aevents";

export enum SelectionListeners{
    VertsUpdate='Verts Updated',
    TransformUpdate='Transform Updated'
}


function SelectionListenerSubscriptionName(listenerType:SelectionListeners, model:AModel){
    return listenerType+model.uid;
}

export interface SelectableModel extends AModel{
    getBounds():BoundingBox3D;
    addTransformListener(callback:(self:AObject)=>void, handle?:string, synchronous?:boolean):ACallbackSwitch;
}

@ASerializable("ASelectionModel")
export class ASelectionModel<SelectableModelType extends SelectableModel> extends AModel{
    @AObjectState public name!:string;
    @AObjectState public _selection!:ASelection<SelectableModelType>;
    @AObjectState public isFrozen!:boolean;

    @AObjectState public bounds!:BoundingBox3D;
    @AObjectState public handleSize!:number;
    @AObjectState public lineWidth!:number;

    static SelectionEvents = SelectionEvents;

    constructor(name?:string) {
        super(name);
        this.handleSize=5;
        this.lineWidth=0.01;
    }

    /**
     * TODO Does this need to be conditional for when single model is selected?
     * @returns {NodeTransform2D}
     */
    get transform(){
        return this.bounds.transform;
    }
    set transform(value:NodeTransform3D){
        this.bounds.transform=value;
    }

    get singleSelectedModel():SelectableModelType|undefined{
        let selected = this.list();
        if(selected.length===1){
            return selected[0] as SelectableModelType;
        }
    }

    get selectedModels():SelectableModelType[]{
        return this.list() as SelectableModelType[];
    }


    /**
     * initspecs should be a dictionary mapping snapshot keys to functions used to compute their initial values
     * returns a function that takes a model as input and returns its snapshot dict.
     * @param initSpecs
     * @returns {(m: AModelInterface) => any}
     */
    getSelectionSnapshotStore(initSpecs?:{[name:string]:(m:AModelInterface)=>any}){
        let snapshotStore:GenericDict={};
        let selected = this.list();
        for(let m of selected){
            snapshotStore[m.uid]={};
            if(initSpecs){
                for(let key in initSpecs){
                    snapshotStore[m.uid][key]=initSpecs[key](m);
                }
            }
        }
        return (m:AModelInterface)=>{return snapshotStore[m.uid];}
    }

    get selection(){
        return this._selection;
    }

    getModelGUIControlSpecs(){
        if(!this.nSelectedModels){
            return {};
        }
        let model = this.selection.list()[0];
        // @ts-ignore
        if(typeof model.getModelGUIControlSpec == 'function'){
            // @ts-ignore
            return model.getModelGUIControlSpec();
        }else{
            return {};
        }

    }


    /**
     * Use the getter to add type constraints to 2d in subclass. E.g.,
     * get 2d():ASelection<ASceneNodeModel>{
     *     return this._selection as ASelection<ASceneNodeModel>;
     * }
     *
     */



    initSelection(){
        const self = this;
        // @ts-ignore
        this._selection = new ASelection<SelectableModelType>(
            [],
            (enteringSelection)=>{

                self.subscribe(enteringSelection.addStateKeyListener('geometry', ()=>{self.calculateBounds();},
                        SelectionListenerSubscriptionName(SelectionListeners.VertsUpdate,enteringSelection),
                        false
                    ),
                    SelectionListenerSubscriptionName(SelectionListeners.VertsUpdate,enteringSelection)
                );

                let transformListener = enteringSelection.addTransformListener(()=>{self.calculateBounds();},
                    SelectionListenerSubscriptionName(SelectionListeners.TransformUpdate,enteringSelection),
                    false
                );
                self.subscribe(transformListener,
                    SelectionListenerSubscriptionName(SelectionListeners.TransformUpdate,enteringSelection)
                );
                enteringSelection.signalEvent(SelectionEvents.SelectionItemEnter);
            },
            (remainingInSelection)=>{remainingInSelection.signalEvent(SelectionEvents.SelectionItemUpdate);},
            (leavingSelection:SelectableModelType)=>{
                self.unsubscribe(SelectionListenerSubscriptionName(SelectionListeners.VertsUpdate,leavingSelection));
                self.unsubscribe(SelectionListenerSubscriptionName(SelectionListeners.TransformUpdate,leavingSelection));
                leavingSelection.signalEvent(SelectionEvents.SelectionItemExit);
            }
        );
        this.bounds = new BoundingBox3D();
        this.subscribe(this.addSelectionStateListener(()=>{
            self.calculateBounds();
        }))
    }


    /**
     *
     * @param model
     * @param updateExistingSelection - this is what you would think of as whether the shift key is down. If se to true,
     * It means that the provided model should be added or subtracted from the 2d, rather than replacing the
     * 2d
     */
    selectModel(model?:SelectableModelType, editExistingSelection=false){
        if(this.isFrozen){
            return;
        }
        if(model){
            if(!editExistingSelection) {
                this.selection.set([model]);
            }else{
                this.selection.toggleSelected(model);
            }
        }else{
            if(!editExistingSelection) {
                this.selection.set([]);
            }
        }
        this.signalEvent(SelectionEvents.SelectionChanged, this.selection);
    }

    addSelectionStateListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true){
        return this.addStateKeyListener("_selection", callback, handle, synchronous);
        // return this.addStateListener(callback, handle, synchronous);
    }

    get nSelectedModels(){
        return this.list().length;
    }

    list(){
        return this.selection.list();
    }


    /**
     * If a single object is selected then we will use its bounds as bounds. If multiple objects are selected then we
     * will calculate bounds
     */
    calculateBounds(){
        let singleSelectedModel = this.singleSelectedModel;
        if(singleSelectedModel){
            let bounds = singleSelectedModel.getBounds();
            if(bounds) {
                // @ts-ignore
                this.bounds = bounds;
                return;
            }
        }
        let newBounds = new BoundingBox3D();
        let selectedModels = this.selectedModels;
        for(let m of selectedModels){
            newBounds.boundBounds(m.getBounds())
        }
        this.bounds = newBounds; // triggers update on anything that might have been listening to bounds.
    }
}
