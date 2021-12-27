import {CubicBezierController, CubicBezierView} from "../cubicbezier";
import {ALineElement, ARenderGroup} from "../../../../arender";
import {AExtrudedShapeElement} from "../../../../arender/3d/AExtrudedShapeElement";

export class AExtrudedShapeView extends CubicBezierView{
    controller!:CubicBezierController;
    public fillElement!:AExtrudedShapeElement;

    initGeometry(){
        this.fillElement = new AExtrudedShapeElement(this.model.verts, this.model.material.threejs);
        this.addElement(this.fillElement);
        this.strokeElement = new ALineElement(this.model.verts, this.model.strokeColor, this.model.strokeWidth);
        // this.addElement(this.strokeElement);
        this.inSelectionRenderGroup = new ARenderGroup();
        this.addElement(this.inSelectionRenderGroup);
        this.inSelectionRenderGroup.add(this.strokeElement);
        this.inSelectionRenderGroup.visible=false;
    }

    _updateHandleGeometry() {
        return; // not using handles here
    }

    _initUpdateSubscriptions() {
        super._initUpdateSubscriptions();
        const self = this;
        this.controller.subscribe(
            this.model.addStateKeyListener('extrudeSettings', ()=>{
                // @ts-ignore
                self.fillElement.setExtrudeSettingsDict(self.model.extrudeSettings);
                self.onGeometryUpdate();
            }),
            'model.extrudeSettings'
        );
    }

    initEditModeSubscriptions(){
        this.inSelectionRenderGroup.visible=false;
    }

}
