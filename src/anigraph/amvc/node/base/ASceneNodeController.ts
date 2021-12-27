import {AController} from "../../base/AController";
import {ASceneNodeView} from "./ASceneNodeView";
import {ASceneNodeModel} from "./ASceneNodeModel";
import {AInteractionEvent, AStaticClickInteraction} from "../../../ainteraction";
import {SelectionEvents} from "../../../aobject/ASelection";
import {ASceneController, ASceneModel} from "../../scene";
import {AModel} from "../../base/AModel";
import {AObjectNodeEvents} from "../../../aobject";
import {AKeyboardInteraction} from "../../../ainteraction/DOM/AKeyboardInteraction";


// export interface ASceneNodeControllerInterface extends AControllerInterface{
//     sceneController:ASceneController;
// }

export enum SceneNodeControllerInteractionModes{
    inSelection='InSelection',
    EditingNode='EditingNode',
}


export class ASceneNodeController<NodeModelType extends ASceneNodeModel> extends AController<NodeModelType>{
    protected _model!:NodeModelType;
    public view!:ASceneNodeView<NodeModelType>;
    protected _sceneController!:ASceneController<ASceneNodeModel, ASceneModel<ASceneNodeModel>>;

    get model():NodeModelType{
        return this._model;
    };

    getParent(){
        if(this.model.parent) {
            return this.sceneController.getNodeControllerForModel(this.model.parent as NodeModelType);
        }else{
            return undefined;
        }
    }

    constructor() {
        super();
    }

    initInteractions() {
        this.enableSelectionMode();
    }

    init(model:NodeModelType, view:ASceneNodeView<NodeModelType>){
        super.init(model, view);

        const self = this;
        this.subscribe(this.model.addEventListener(AObjectNodeEvents.NewParent, (newParent:AModel, oldParent:AModel)=>{
            let newParentController = self.getParent();
            self.view.setParentView(newParentController?newParentController.view:null);
        }))
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



    initView() {
        this.view.init();
    };


    addKeyboardInteraction(
        keyDownCallback:(interaction:AKeyboardInteraction, event:AInteractionEvent)=>void,
        keyUpCallback?:(interaction:AKeyboardInteraction, event:AInteractionEvent)=>void){
        this.addInteraction(
            AKeyboardInteraction.Create(
                this.sceneController.container,
                keyDownCallback,
                keyUpCallback,
            ),
        )
    }

    addKeyboardEventConsoleListener(){
        this.addKeyboardInteraction(
            (interaction:AKeyboardInteraction, event:AInteractionEvent)=>{
                console.log(event);
                console.log(interaction.keysDownState);
            },
            (interaction:AKeyboardInteraction, event:AInteractionEvent)=>{
                console.log(event);
                console.log(interaction.keysDownState);
            }
        );
    }

    /**
     * only call if you want to enable 2d
     */
    enableSelectionMode(){
        const self = this;
        const model = this.model;
        if(!this.sceneController.getSelectionController()){
            return;
        }
        this.addInteraction(AStaticClickInteraction.Create(this.view.threejs,
            function(event:AInteractionEvent){
                self.sceneController.selectModel(model, event);
            }, "SelectNode"
        ))

        this.subscribe(this.model.addEventListener(SelectionEvents.SelectionItemEnter, ()=>{
            self.setCurrentInteractionMode(SceneNodeControllerInteractionModes.inSelection);
        }))
        this.subscribe(this.model.addEventListener(SelectionEvents.SelectionItemExit, ()=>{
            self.setCurrentInteractionMode();
        }))

        if(this.sceneController.getSelectionController()){
            this.sceneController.getSelectionController().initNodeControllerInSelectionInteractions(this);
        }
    }

    onKeyDown(interaction: AKeyboardInteraction, event: AInteractionEvent){;}
}

export class BasicSceneNodeController extends ASceneNodeController<ASceneNodeModel>{
}
