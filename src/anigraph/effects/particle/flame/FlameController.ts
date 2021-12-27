// import {ASceneNodeController, ASceneNodeModel} from "../../../amvc";
import {ASceneNodeModel} from "../../../amvc/node/base/ASceneNodeModel";
import {ASceneNodeController} from "../../../amvc/node/base/ASceneNodeController";
// import {FlameModel} from "./FlameModel";
import {ASerializable} from "../../../aserial";

// import {NodeTransform} from "../../../amath";

@ASerializable("FlameController")
export class FlameController extends ASceneNodeController<ASceneNodeModel>{
    initInteractions() {
        super.initInteractions();
    }
}
