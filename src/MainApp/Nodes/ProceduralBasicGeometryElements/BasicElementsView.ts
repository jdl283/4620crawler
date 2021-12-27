import {ASceneNodeController, ASceneNodeModel, ASceneNodeView, ASerializable} from "../../../anigraph";
import {RingNodeModel} from "../ExampleProcedureGeometry/RingNodeModel";
import {BasicElementsModel} from "./BasicElementsModel";
import {SphereElement} from "./SphereElement";
import {RectangleElement} from "./RectangleElement";

@ASerializable("BasicElementsView")
export class BasicElementsView extends ASceneNodeView<BasicElementsModel>{
    controller!:ASceneNodeController<BasicElementsModel>;
    sphereElements!:SphereElement[];
    rectangleElements!:RectangleElement[];
    initGraphics() {
        super.initGraphics();
        this.sphereElements=[];
        this.rectangleElements=[];
        const self = this;
        this.controller.subscribe(this.model.addStateKeyListener('spheres', ()=>{
            self.updateSpheres();
        }))

        this.controller.subscribe(this.model.addStateKeyListener('rectangles', ()=>{
            self.updateRectangles();
        }))
        this.updateSpheres();
        this.updateRectangles();
    }

    disposeSpheres(){
        for(let s of this.sphereElements){
            this._removeElement(s);
        }
        this.sphereElements = [];
    }

    disposeRectangles(){
        for(let r of this.rectangleElements){
            this._removeElement(r);
        }
        this.rectangleElements = [];
    }

    updateSpheres(){
        this.disposeSpheres();
        for(let s of this.model.spheres){
            let sphere = SphereElement.CreateSphere(s, this.model.material);
            this.sphereElements.push(sphere);
            this.addElement(sphere);
        }
    }

    updateRectangles(){
        this.disposeRectangles();
        for(let r of this.model.rectangles){
            let rectangle = RectangleElement.CreateRectangle(r, this.model.material);
            this.rectangleElements.push(rectangle);
            this.addElement(rectangle);
        }
    }
}
