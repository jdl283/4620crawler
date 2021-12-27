import {ASceneNodeController} from "../../node/base/ASceneNodeController";
import {ASceneNodeModel} from "../../node/base/ASceneNodeModel";
import {ADragInteraction} from "../../../ainteraction/ADragInteraction";
import {AInteractionEvent} from "../../../ainteraction";
import {GetAppState} from "../../AAppState";
import {AniGraphEnums} from "../../../basictypes";
import {Vec3} from "../../../amath";
import {ASceneController, ASceneModel} from "../../scene";

export class A2DSceneNodeController<NodeModelType extends ASceneNodeModel> extends ASceneNodeController<NodeModelType>{
    static CreateShapeInteraction<NodeType extends ASceneNodeModel>(sceneController:ASceneController<NodeType, ASceneModel<NodeType>>, CreateShapeName?:string){
        CreateShapeName=CreateShapeName?CreateShapeName:AniGraphEnums.CreateShapeInteractionName;
        const appState = GetAppState();
        return ADragInteraction.Create(sceneController.backgroundThreeJSObject,
            (interaction:ADragInteraction, event: AInteractionEvent) => {
                if(interaction.getInteractionState("newShape")===undefined){
                    let newShape = sceneController.model.NewNode();
                    newShape.verts.position.push(Vec3.FromVec2(event.cursorPosition));
                    newShape.verts.position.push(Vec3.FromVec2(event.cursorPosition));
                    // @ts-ignore
                    newShape.color = appState.selectedColor;
                    sceneController.model.addNode(newShape);
                    sceneController.selectModel(newShape);
                    appState.freezeSelection();
                    interaction.setInteractionState("newShape", newShape);
                    // sceneController.disableDraggingOnSelected();
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

            },
            CreateShapeName);
    }
    initInteractions() {
        super.initInteractions();
        this.enableSelectionMode();
        // this.addDragPositionInteraction();
    }

}
