import {ASceneNodeView, VertexArray3D} from "../../../anigraph";
import {ExampleNodeModel} from "./ExampleNodeModel";
import {ExampleNodeController} from "./ExampleNodeController";
import {ATriangleMeshElement} from "../../../anigraph/arender/basic/ATriangleMeshElement";
import {ExampleRenderElement} from "./ExampleRenderElement";
import {AMeshView} from "../../../anigraph/amvc/node/mesh/AMeshView";

export class ExampleNodeView extends AMeshView{
    controller!:ExampleNodeController;
    // public extraElement!:ExampleRenderElement;
    onGeometryUpdate(){
        super.onGeometryUpdate();
    }
    initGraphics() {
        super.initGraphics();
        // this.element = new ExampleRenderElement();
        // this.element.init(VertexArray3D., this.model.material.threejs);
        // this.addElement(this.element);
    }
}
