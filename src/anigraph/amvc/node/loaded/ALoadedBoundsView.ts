import {ASceneNodeController, ASceneNodeView} from "../index";
import {ALoadedModel} from "./ALoadedModel";
import {Object3DModelWrapper} from "../../../ageometry";
import {ALoadedBoundsElement} from "../../../arender/loaded/ALoadedBoundsElement";
import {ARenderObject} from "../../../arender";

export class ALoadedBoundsView extends ASceneNodeView<ALoadedModel>{
    public controller!:ASceneNodeController<ALoadedModel>;
    initLoadedObjects(){
        const self = this;
        for(let mname in this.model.geometry.members){
            let m = this.model.geometry.members[mname];
            if (m instanceof Object3DModelWrapper){
                let obj = new ALoadedBoundsElement(m);
                obj.init();
                this.addLoadedElement(obj);
            }
        }
    }

    initGraphics() {
        super.initGraphics();
        const self = this;
        this.addModelColorCallback(()=>{
            for(let loadedUID in self._loadedElements){
                ((self._loadedElements[loadedUID]) as ALoadedBoundsElement).onModelColorChange(self.model.color);
            }
        })
    }

    _initMaterialListener(){}

    onMaterialUpdate(...args:any[]){}

    onMaterialChange(){}

}
