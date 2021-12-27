import {AMeshView} from "../../../anigraph/amvc/node/mesh/AMeshView";
import {ASceneNodeController, ASerializable} from "../../../anigraph";
import {AGroundModel} from "../../../anigraph/amvc/derived";
import {ATriangleMeshElement} from "../../../anigraph/arender/basic/ATriangleMeshElement";
import {GroundModel} from "./GroundModel";
import {GroundElement} from "./GroundElement";

@ASerializable("GroundView")
export default class GroundView extends AMeshView{
    controller!:ASceneNodeController<GroundModel>
    public element!:GroundElement;
    get model(){
        return this.controller.model as GroundModel;
    }
    onGeometryUpdate(){
        super.onGeometryUpdate();
    }

    initGraphics() {
        super.initGraphics();
    }
}
