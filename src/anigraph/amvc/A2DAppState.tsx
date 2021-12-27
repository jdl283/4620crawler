import {AAppState} from "./AAppState";
import {ASerializable} from "../aserial";
import {ASelectionModel} from "./selection";
import {ASceneModel} from "./scene";
import {ASceneNodeModel} from "./node";
import {ASelection, SelectionEvents} from "../aobject/ASelection";

@ASerializable("A2DAppState")
export abstract class A2DAppState<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends AAppState<NodeModelType, SceneModelType> {
    initSelection(){
        this.selectionModel = new ASelectionModel<NodeModelType>();
        this.selectionModel.initSelection();
        let selectionEvents = SelectionEvents;

        //##################//--For testing...--\\##################
        //<editor-fold desc="For testing...">
        if(!selectionEvents){
            // @ts-ignore
            selectionEvents = (this.selectionModel.constructor).SelectionEvents;
        }
        //</editor-fold>
        //##################\\--For testing...--//##################

        this.subscribe(
            this.selectionModel.addEventListener(selectionEvents.SelectionChanged, (selection: ASelection<NodeModelType>) => {
                this.onSelectionChanged(selection);
            }),
            SelectionEvents.SelectionChanged
        );
        this.selectionSubscriptionIsActive=false;
    }

}
