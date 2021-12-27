import {ASerializable} from "../../aserial";
import {ASelectionModel} from "./ASelectionModel";
import {ASelectionView} from "./ASelectionView";
import {AInteractionEvent} from "../../ainteraction";
import {ASupplementalController} from "../supplementals/ASupplementalController";
import {ASceneNodeModel} from "../node/base/ASceneNodeModel";
import {ASceneNodeController} from "../node/base/ASceneNodeController";

@ASerializable("ASelectionController")
export abstract class ASelectionController<NodeModelType extends ASceneNodeModel, SelectionModelType extends ASelectionModel<NodeModelType>> extends ASupplementalController<ASelectionModel<NodeModelType>,NodeModelType>{
    protected _model!:SelectionModelType;
    public view!:ASelectionView<NodeModelType, SelectionModelType>;
    get model(){return this._model;}

    // /**
    //  * You should never call init() inside of the constructor! This
    //  */
    constructor(){
        super();
    }

    selectModel(model?:NodeModelType, event?:AInteractionEvent){
        let editExistingSelection = false;
        if(event){
            editExistingSelection = event.shiftKey;
        }
        this.model.selectModel(model, editExistingSelection);
    }

    abstract initNodeControllerInSelectionInteractions(controller:ASceneNodeController<NodeModelType>):void;


    init(selectionModel:SelectionModelType, selectionView?:ASelectionView<NodeModelType, SelectionModelType>){
        // this.initModel();
        super.init(selectionModel, selectionView);
    }


    dispose(){
        super.dispose();
    }
}

