import {ASceneNodeController, ASceneNodeView} from "../base";
import {AMeshModel} from "./AMeshModel";
import {ATriangleMeshElement} from "../../../arender/basic/ATriangleMeshElement";


export class AMeshView extends ASceneNodeView<AMeshModel>{
    controller!:ASceneNodeController<AMeshModel>;
    public element!:ATriangleMeshElement;
    get model(){
        return this.controller.model as AMeshModel;
    }
    onGeometryUpdate(){
        super.onGeometryUpdate();
        this.element.setVerts(this.model.verts);
    }

    initGraphics() {
        super.initGraphics();
        this.element = new ATriangleMeshElement();
        this.element.init(this.model.verts, this.model.material.threejs);
        this.addElement(this.element);
    }
}
