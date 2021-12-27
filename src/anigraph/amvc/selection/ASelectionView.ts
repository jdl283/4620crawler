// import {} from "../../aobject";
// import {ASerializable} from "../../aserial";
// import {ASupplementalView} from "../base";
// import {ASceneNodeModel} from "../node";
// import {ASelectionController} from "./ASelectionController";
// import {ASelectionModel} from "./ASelectionModel";

import {AObjectState} from "../../aobject";
import {ASerializable} from "../../aserial";
import {ASupplementalView} from "../supplementals";
import {ASceneNodeModel} from "../node";
import {ASelectionModel} from "./ASelectionModel";
import {ASelectionController} from "./ASelectionController";


// import {
//     AObjectState,
//     ASerializable,
//     ASupplementalView,
//     ASceneNodeModel,
//     ASelectionController,
//     ASelectionModel
// } from "src/anigraph";
// import {ASupplementalView} from "../base";
// import {ASceneNodeModel} from "../node";
// import {ASelectionController} from "./ASelectionController";
// import {ASelectionModel} from "./ASelectionModel";

import {GETSERIALIZABLES} from "../../aserial";
let serializables = GETSERIALIZABLES();

@ASerializable("ASelectionView")
export class ASelectionView<NodeModelType extends ASceneNodeModel, SelectionModelType extends ASelectionModel<NodeModelType>> extends ASupplementalView<SelectionModelType, NodeModelType>{
    @AObjectState showSelectionBox!:boolean;
    public controller!:ASelectionController<NodeModelType, SelectionModelType>;
    /**
     * initGraphics() is called AFTER the constructor and used to initialize any three.js objects for rendering
     */
    initGraphics():void{};
    init(){
        super.init();
        this.sceneView.addChildView(this);
    }

    /**
     * The contructor should always work without arguments
     */
    constructor(){
        super();
    }
}
