import {ASceneNodeView} from "./ASceneNodeView";
import {ATriangleMeshElement} from "../../../arender/basic/ATriangleMeshElement";
import {VertexArray3D} from "../../../ageometry";
import {ASceneNodeController} from "./ASceneNodeController";
import {NodeTransform3D} from "../../../amath";
import {ASerializable} from "../../../aserial";

@ASerializable("ASceneNodeProxyView")
export class ASceneNodeProxyView extends ASceneNodeView<any>{
    controller!:ASceneNodeController<any>
    element!:ATriangleMeshElement;

    _initTransformListener(){
        const model = this.model;
        this.addTransformChangeCallback(()=>{
            model.transform.getMatrix().assignTo(this.threejs.matrix);
        }, 'model.transform ASceneNodeView._initTransformListener Listener');
        model.transform.getMatrix().assignTo(this.threejs.matrix);
    }

    onGeometryUpdate(){
        super.onGeometryUpdate();
        this.element.setVerts(VertexArray3D.MeshVertsForBoundingBox3D(this.model.getBounds()));
        this.element.setTransform(new NodeTransform3D());
    }

    initGraphics() {
        super.initGraphics();
        this.element = new ATriangleMeshElement();
        this.element.init(VertexArray3D.MeshVertsForBoundingBox3D(this.model.getBounds()), this.model.color);
        this.addElement(this.element);
    }

}
