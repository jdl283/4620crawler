import {ASceneController, ASceneModel, ASceneView} from "../index";
import {ASceneNodeModel} from "../../node";
import {A2DSceneView} from "./A2DSceneView"
import {ACamera} from "../../camera/ACamera";
import {NodeTransform3D, V3} from "../../../amath";
import {AniGraphEnums} from "../../../basictypes";
import {ASerializable} from "../../../aserial";
import {AOrthoCamera} from "../../camera/AOrthoCamera";


@ASerializable("A2DSceneController")
export class A2DSceneController<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends ASceneController<NodeModelType, SceneModelType>{
    public view!:ASceneView<NodeModelType, SceneModelType>;
    protected _model!:SceneModelType;


    CreateView(){return new A2DSceneView<NodeModelType, SceneModelType>();}

    // onWindowResize() {
    //     const container = this.container;
    //     const cwidth = container.clientWidth;
    //     const cheight = cwidth*this.aspectRatio;
    //     this.sceneCamera.setProjectionOrtho(
    //         -cwidth /2,
    //         cwidth/2,
    //         -cheight/2,
    //         cheight/2,
    //         ACamera.DEFAULT_NEAR,
    //         ACamera.DEFAULT_FAR
    //     );
    //     this.view.onWindowResize(cwidth, cheight);
    // }

    InstantiateNewCamera(){
        return new AOrthoCamera();
    }

    initSceneCamera(){
        this.onWindowResize();
        this.sceneCamera.setPose(new NodeTransform3D(V3(0,0,2000)));
    }

    initCameraControls(){

    }
}
