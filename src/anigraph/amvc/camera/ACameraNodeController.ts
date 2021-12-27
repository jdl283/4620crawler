import {ASceneNodeController} from "../node/base/ASceneNodeController";
import {ACameraNodeModel} from "./ACameraNodeModel";
import {ASerializable} from "../../aserial";

@ASerializable("ACameraNodeController")
export class ACameraNodeController extends ASceneNodeController<ACameraNodeModel>{


}
