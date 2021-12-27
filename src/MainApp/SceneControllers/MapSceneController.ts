import {
    AInteractionEvent,
    AMVCSpec,
    ASceneModel,
    ASceneNodeModel,
    Base2DAppSceneController,
    BasicSceneNodeController, NodeTransform3D, V3
} from "../../anigraph";
import {BasicMapSceneControllerSpecs} from "./SceneControllerSpecs";
import {folder} from "leva";
import {ExampleNodeModel} from "../Nodes/Example/ExampleNodeModel";
import {ExampleNodeView} from "../Nodes/Example/ExampleNodeView";
import {ExampleNodeController} from "../Nodes/Example/ExampleNodeController";
import {AWheelInteraction} from "../../anigraph/ainteraction/AWheelInteraction";

export class MapSceneController extends Base2DAppSceneController<ASceneNodeModel, ASceneModel<ASceneNodeModel>>{
    initClassSpec() {
        super.initClassSpec();
        this.addClassSpecs(BasicMapSceneControllerSpecs());
        this.addClassSpec(new AMVCSpec(ExampleNodeModel, ExampleNodeView, ExampleNodeController));
        // add additional specs here
    }

    /**
     * You can add control specs for the map scene here.
     * you can look at leva (https://github.com/pmndrs/leva) for more details on defining specs.
     * @returns {any}
     */
    getControlPanelSpecs(){
        const self = this;
        let controlSpecs:any = {};
        return folder({
                ...controlSpecs
            },
            {collapsed: true}
        );
        return controlSpecs;
    }

    initInteractions() {
        super.initInteractions();
        this.wheelCallback = this.wheelCallback.bind(this);
        this.addInteraction(AWheelInteraction.Create(
            this.container,
            this.wheelCallback
        ));
    }

    wheelCallback(interaction:AWheelInteraction, event?:AInteractionEvent){
        if(event) {
            let zoom = (event.DOMEvent as WheelEvent).deltaY;
            this.sceneCamera.zoom = this.sceneCamera.zoom + 0.005 * zoom;
        }
    }

    initSceneCamera(){
        this.onWindowResize();
        this.sceneCamera.zoom=0.75;
        this.sceneCamera.setPose(new NodeTransform3D(V3(0,0,2000)));
    }


}
