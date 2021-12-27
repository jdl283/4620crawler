import {ARenderGroup, ASceneNodeView} from "../../../anigraph";
import {RingNodeModel} from "./RingNodeModel";
import {RingElement} from "./RingElement";
import {RingNodeController} from "./RingNodeController";

export class RingNodeView extends ASceneNodeView<RingNodeModel>{
    controller!:RingNodeController;
    ringElements:RingElement[]=[];
    element!:ARenderGroup;

    initGraphics() {
        super.initGraphics();
        this.element = new ARenderGroup();
        this.addElement(this.element);
        const self = this;
        this.controller.subscribe(this.model.addStateKeyListener('segments', ()=>{
            this.updateSegments();
        }))
        this.updateSegments();
    }

    disposeElements(){
        super.disposeElements();
        this.ringElements=[];
    }

    dispose(){
        this.disposeElements();
    }

    updateSegments(){
        this.disposeElements();
        this.element = new ARenderGroup();
        this.addElement(this.element);
        for(let s of this.model.segments){
            let seg = RingElement.CreateSegment(s, this.model.material);
            this.ringElements.push(seg);
            this.element.add(seg);
        }
    }


}



