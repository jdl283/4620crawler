import {
    ADragInteraction,
    AInteraction,
    AInteractionEvent,
    AniGraphEnums,
    ASceneController,
    ASceneModel,
    ASceneView,
    ASelectionModel,
    AStaticClickInteraction,
    ASceneNodeModel,
    GetAppState,
    Vec3,
    A2DSceneController,
    A2DSceneView,
    A2DSelectionController
} from "src/anigraph/index";

class Base2DAppSceneControllerBase<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends A2DSceneController<NodeModelType, SceneModelType> {
    public view!: A2DSceneView<NodeModelType, SceneModelType>;

    initCameraControls() {
        console.log("initCameraControls not implemented!")
    }
}


export class Base2DAppSceneController<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends Base2DAppSceneControllerBase<NodeModelType, SceneModelType> {
    init(sceneModel:SceneModelType, sceneView?:ASceneView<NodeModelType, SceneModelType>) {
        super.init(sceneModel,sceneView);
    }

    initClassSpec() {
        // super.initClassSpec();
        // this.addClassSpec(Base2DAppNodeModel, Base2DAppNodeView, Base2DAppNodeController);

    }

    /**
     * Change the create shape interaction depending on what kind of model is selected in the new shape type dropdown
     */
    updateCreateShapeInteraction(){
        const self = this;
        const appState = GetAppState();
        const CreateShapeName = AniGraphEnums.CreateShapeInteractionName;
        if(this.isInteractionModeDefined(CreateShapeName)){
            this.clearInteractionMode(CreateShapeName);
        }
        this.defineInteractionMode(CreateShapeName);
        this.setCurrentInteractionMode(CreateShapeName);

        // @ts-ignore
        let CurrentNodeControllerClass = self.classMap.getSpecForModel(appState.currentNewModelTypeName).controllerClass;
        let createShapeInteraction:AInteraction;
        if(CurrentNodeControllerClass && 'CreateShapeInteraction' in CurrentNodeControllerClass){
            // @ts-ignore
            createShapeInteraction = CurrentNodeControllerClass.CreateShapeInteraction(this, CreateShapeName);
        }else{
            createShapeInteraction = ADragInteraction.Create(this.backgroundThreeJSObject,
                (interaction:ADragInteraction, event: AInteractionEvent) => {
                    if(interaction.getInteractionState("newShape")===undefined){
                        let newShape = this.model.NewNode();
                        newShape.verts.position.push(Vec3.FromVec2(event.cursorPosition));
                        newShape.verts.position.push(Vec3.FromVec2(event.cursorPosition));
                        // @ts-ignore
                        newShape.color = appState.selectedColor;
                        self.sceneController.model.addNode(newShape);
                        self.selectModel(newShape);
                        GetAppState().freezeSelection();
                        interaction.setInteractionState("newShape", newShape);
                        // this.disableDraggingOnSelected();
                    }else{
                        (interaction.getInteractionState("newShape") as ASceneNodeModel).verts.addVertex(event.cursorPosition);
                    }
                }, (interaction, event)=>{
                    let newshape = interaction.getInteractionState("newShape");
                    if(newshape) {
                        newshape.verts.position.setAt(newshape.verts.length - 1, event.cursorPosition);
                    }else{
                        throw new Error("Should not be dragging on create shape without a selected model...");
                    }
                }, (interaction, event)=>{
                    // interaction.setInteractionState("newShape", undefined);
                },
                CreateShapeName);
        }

        this.getInteractionMode(CreateShapeName).setBeforeActivateCallback(()=>{
            self.view.setBackgroundOrder(ASceneView.BackgroundOrder.Front);
        });
        this.getInteractionMode(CreateShapeName).setAfterDeactivateCallback(()=>{
            self.view.setBackgroundOrder(ASceneView.BackgroundOrder.Back);
        });
        this.addInteraction(createShapeInteraction);
        this.setCurrentInteractionMode();
    }

    /**
     * Gets called in init() function
     */
    initInteractions() {
        super.initInteractions();
        this.updateCreateShapeInteraction();
    }



}

// console.log("Loaded Base2DAppSceneController");
