import {ADragInteraction, AHandleElement, AInteractionEvent,} from "../../../../index";
import {ASceneNodeModel} from "../../../node/base/ASceneNodeModel";
import {ASceneNodeView} from "../../../node/base/ASceneNodeView";
import {ASceneNodeController} from "../../../node/base/ASceneNodeController";

import {EditVertsModel} from "./EditVertsModel";
import {EditVertsView} from "./EditVertsView";


const EditingInteractionModeName = 'editing';

export class EditVertsController extends ASceneNodeController<ASceneNodeModel> {
    public view!:ASceneNodeView<ASceneNodeModel>;

    constructor() {
        super();

        // let's define an interaction mode called "editing"
        this.defineInteractionMode(EditingInteractionModeName);
    }

    initInteractions() {
        super.initInteractions();

        const self=this;
        const model = this.model as EditVertsModel;
        /***
         * Now every time the inEditMode attribute changes in our model, activate or deactivate edit mode and toggle the
         * visibility of the handles. We will put the handle interactions on this edit mode so that they are only active
         * when we are in edit mode...
         */
        this.subscribe(this.model.addStateKeyListener('inEditMode', ()=> {
            let view = self.view as unknown as EditVertsView;
            if (model.inEditMode) {
                self.setCurrentInteractionMode(EditingInteractionModeName);
                for (let h = 0; h < view.vertexHandles.length; h++) {
                        view.vertexHandles[h].visible = true;
                }
            } else {
                self.setCurrentInteractionMode();
                for (let h = 0; h < view.vertexHandles.length; h++) {
                    view.vertexHandles[h].visible = false;
                }
            }
        }));
    }

    initHandleInteractions(handleElement: AHandleElement) {
        const model = this.model;
        // Add the handle's interaction to the editing interaction mode
        this.getInteractionMode(EditingInteractionModeName).addInteraction(ADragInteraction.Create(handleElement.threejs,
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    //This is basically just casting the interaction's element attribute to an AHandleElement
                    // @ts-ignore
                    interaction.setInteractionState('startValue', model.verts.position.getPoint2DAt(handleElement.index));
                    interaction.dragStartPosition = event.cursorPosition;
                },
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    model.verts.position.setAt(handleElement.index,
                        interaction.getInteractionState('startValue').plus(
                            event.cursorPosition.minus(interaction.dragStartPosition)
                        ));
                }
            )
        );
    }

}
