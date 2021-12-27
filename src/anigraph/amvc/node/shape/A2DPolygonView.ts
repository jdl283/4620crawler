import {ASceneNodeView} from "../base/ASceneNodeView";
import {ASceneNodeController} from "../base/ASceneNodeController";
import {A2DPolygonModel} from "./index";
import {APolygonElement} from "../../../arender/2d/APolygonElement";

export class A2DPolygonView extends ASceneNodeView<A2DPolygonModel>{
    public element!:APolygonElement;

    public controller!:ASceneNodeController<A2DPolygonModel>;

    get model():A2DPolygonModel{
        return (this.controller.model as A2DPolygonModel);
    }

    init(){
        super.init();
    }

    onGeometryUpdate(){
        super.onGeometryUpdate();
        this.element.setVerts(this.model.verts);
    }

    initGraphics() {
        super.initGraphics();
        this.element = new APolygonElement(this.model.verts, this.model.color);
        this.addElement(this.element);
        // this.threejs.position.set(model.transform.position.x, model.transform.position.y, 0);

        // this.addMaterialChangeCallback(()=>{
        //         self.element.setColor(model.color);
        //     },
        //     'model.color');

        // this.controller.subscribe(
        //     this.model.addStateKeyListener('geometry', ()=>{
        //         this.onGeometryUpdate();
        //     }),
        //     'model.verts'
        // );
    }
}
