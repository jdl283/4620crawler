import {ALoadedModel} from "./ALoadedModel";
import {ASceneNodeController, ASceneNodeView} from "../index";

export class ALoadedView extends ASceneNodeView<ALoadedModel>{
    public controller!:ASceneNodeController<ALoadedModel>;

    initGraphics() {
        super.initGraphics();
    }

}
