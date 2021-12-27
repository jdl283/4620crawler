import * as THREE from "three";
import {ASceneView} from "../ASceneView";
import {NodeTransform3D, V3} from "../../../amath";
import {ASceneController} from "../ASceneController";
import {ASceneModel} from "../ASceneModel";
import {ASceneNodeModel} from "../../node";
import {ASerializable} from "../../../aserial";
import {ACamera} from "../../camera/ACamera";
import {A2DSceneController} from "./A2DSceneController";



@ASerializable("A2DSceneView")
export class A2DSceneView<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends ASceneView<NodeModelType, SceneModelType> {
    public controller!: A2DSceneController<NodeModelType, SceneModelType>;
}
