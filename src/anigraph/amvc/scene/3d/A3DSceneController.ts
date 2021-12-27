import {ASceneController, ASceneModel} from "../index";
import {ASceneNodeModel} from "../../node";
import {A3DSceneView} from "./A3DSceneView"
import {ACamera, ACameraNodeModel} from "../../camera";
import {NodeTransform3D, Quaternion, V3} from "../../../amath";
import {ASerializable} from "../../../aserial";
import {APerspectiveCamera} from "../../camera/APerspectiveCamera";
import {APointerLockPlayerControls} from "../../../aplayercontrols/APointerLockPlayerControls";
import {ClassInterface} from "../../../basictypes";
import {APlayerControlsBase} from "../../../aplayercontrols";

@ASerializable("A3DSceneController")
export class A3DSceneController<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends ASceneController<NodeModelType, SceneModelType>{
    public view!:A3DSceneView<NodeModelType, SceneModelType>;
    protected _model!:SceneModelType;

    initSelectionController(){

    }

    CreateView(){return new A3DSceneView<NodeModelType, SceneModelType>();}

    InstantiateNewCamera(): ACamera {
        return new APerspectiveCamera();
    }


    addControlType(controlClass:ClassInterface<APlayerControlsBase>, name?:string){
        // @ts-ignore
        let controls = controlClass.Create(this);
        // @ts-ignore
        this.defineInteractionMode(name??controlClass.NameInGUI(), controls);
    }

    initSceneCamera(){
        this.sceneCamera.setPose(new NodeTransform3D(V3(0,0,100.01)));
        const container = this.container;
        const cwidth = container.clientWidth;
        const cheight = cwidth*this.aspectRatio;
        // let cameraNode = ACameraNodeModel.CreatePerspectiveFOV(90, cwidth/cheight);
        let cameraNode = ACameraNodeModel.CreatePerspectiveNearPlane(-1,1,-1,1,1, 1000);
        this.model.addNode(cameraNode);
        // cameraNode.camera.setPose(new NodeTransform3D(V3(0,-100,1), Quaternion.FromAxisAngle(V3(1,0,0), Math.PI*0.5)));
        this.setCamera(cameraNode)
        this.onWindowResize();
    }





    initCameraControls() {
        let FPS = APointerLockPlayerControls.Create(this);
        this.defineInteractionMode('fps', FPS);
        this.setCurrentInteractionMode('fps');
        // const self = this;
        // this.addKeyboardInteraction(
        //     (interaction:AKeyboardInteraction, event:AInteractionEvent)=>{
        //         if(interaction.keysDownState['w']){
        //             this.camera.moveForward();
        //         }
        //         if(interaction.keysDownState['a']){
        //             this.camera.moveLeft();
        //         }
        //         if(interaction.keysDownState['s']){
        //             this.camera.moveBackward();
        //         }
        //         if(interaction.keysDownState['d']){
        //             this.camera.moveRight();
        //         }
        //         if(interaction.keysDownState['r']){
        //             this.camera.moveUp();
        //         }
        //         if(interaction.keysDownState['f']){
        //             this.camera.moveDown();
        //         }
        //     },
        //     (interaction:AKeyboardInteraction, event:AInteractionEvent)=>{
        //         // console.log(event);
        //         // console.log(interaction.keysDownState);
        //     }
        // );
    }
}
