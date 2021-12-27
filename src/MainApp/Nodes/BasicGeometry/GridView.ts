import {AMeshView} from "../../../anigraph/amvc/node/mesh/AMeshView";
import {ASceneNodeController, Mat4} from "../../../anigraph";
import {GridModel} from "./GridModel";


export class GridView extends AMeshView{
    //let's cast model to GridModel to make typescript happy
    get model():GridModel{return this.controller.model as GridModel;}

    initGraphics() {
        super.initGraphics();
        const self = this;
        this.controller.subscribe(this.model.addStateKeyListener('sizeWH', ()=>{
            self.element.setTransform(Mat4.Scale3D([self.model.sizeWH[0], self.model.sizeWH[0], 1]));
        }))
    }
}
