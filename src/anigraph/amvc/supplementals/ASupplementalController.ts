import {AController, AModel} from "../base"
import {ASceneNodeModel} from "../node/base/ASceneNodeModel";
import {ASceneController, ASceneModel} from "../scene";
import {ASerializable} from "../../aserial";

@ASerializable("ASupplementalController")
export abstract class ASupplementalController<ModelType extends AModel, NodeModelType extends ASceneNodeModel> extends AController<ModelType>{
    protected _sceneController!:ASceneController<NodeModelType, ASceneModel<NodeModelType>>;
    /**
     * We treat the parent of supplemental controllers to be the scenevis controller.
     * This is to make supplemental controllers compatable with the scenevis node controller interface.
     */
    getParent(){
        return this.sceneController;
    }


    //##################//--Scene Controller Access--\\##################
    //<editor-fold desc="Scene Controller Access">

    /** Get set sceneController */
    set sceneController(value){this._sceneController = value;}
    get sceneController(){return this._sceneController;}

    /**
     * Go through the scenevis controller to access the application state.
     * @returns {AAppState}
     */
    get appState(){return this.sceneController.appState;}
    getContextDOMElement(){
        return this.sceneController.getDOMElement();
    }
    //</editor-fold>
    //##################\\--Scene Controller Access--//##################

    constructor(sceneController?:ASceneController<NodeModelType, ASceneModel<NodeModelType>>) {
        super();
        if(sceneController){
            this.sceneController=sceneController
        }
    }
}




