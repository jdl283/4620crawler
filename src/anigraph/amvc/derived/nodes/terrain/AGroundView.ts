import {A2DPolygonView, ASceneNodeController, ASceneNodeModel, ASceneNodeView} from "../../../node";
import {AGroundModel} from "./AGroundModel";
import {ATriangleMeshElement} from "../../../../arender/basic/ATriangleMeshElement";


export class AGroundView extends ASceneNodeView<ASceneNodeModel>{
    controller!:ASceneNodeController<AGroundModel>
    public element!:ATriangleMeshElement;
    get model(){
        return this.controller.model as AGroundModel;
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
