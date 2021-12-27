/**
 * Selection controllers are owned by the scenevis controller.
 * The 2d model has a 2d object, which holds a set of AModels.
 * The view is a view of this 2d.
 * The controller specifies interaction with the view (i.e., interactions that modify the selected models).
 *
 * By default, node controllers have
 */

import {ASerializable} from "../../../aserial";
import {Mat4, NodeTransform3D, Precision, Quaternion, V3, Vec3, Vec4} from "../../../amath";
import {AModelInterface} from "../../base";
import {ADragInteraction, AInteractionEvent, AStaticClickInteraction} from "../../../ainteraction";
import {ASceneNodeModel, ASceneNodeController, SceneNodeControllerInteractionModes} from "../../node";
import {ASelectionModel, ASelectionController} from "../index";
import {A2DSelectionView} from "./A2DSelectionView";
import {AObject} from "../../../aobject";

@ASerializable("A2DSelectionController")
export class A2DSelectionController<NodeModelType extends ASceneNodeModel> extends ASelectionController<NodeModelType, ASelectionModel<NodeModelType>> {
    protected _model!: ASelectionModel<NodeModelType>;
    public view!:A2DSelectionView<NodeModelType>;
    get model() {
        return this._model;
    }

    constructor() {
        super();
    }

    init(model: ASelectionModel<NodeModelType>, view?:A2DSelectionView<NodeModelType>) {
        super.init(model, view);
    }

    initView() {
        const self = this;
        if (!this.view) {
            this.view = new A2DSelectionView();
            this.updateHUDTransform();
            this.view.controller = this;
        }
        this.view.init();
        this.subscribe(this.sceneController.addCameraProjectionListener(()=>{
            self.updateHUDTransform();
        }), "CameraProjectionUpdate");
        this.subscribe(this.sceneController.addCameraPoseListener(()=>{
            self.updateHUDTransform();
        }), "CameraProjectionUpdate");

    }

    updateHUDTransform(){
        this.view.setHUDTransform(this.sceneController.camera.getHUDTransform());
    }

    initNodeControllerInSelectionInteractions(controller: ASceneNodeController<NodeModelType>) {
        const inSelectionModeName = SceneNodeControllerInteractionModes.inSelection;
        const model = controller.model;
        const selectionModel = this.model;
        controller.defineInteractionMode(inSelectionModeName);
        controller.setCurrentInteractionMode(inSelectionModeName);
        controller.addInteraction(
            AStaticClickInteraction.Create(
                controller.view.threejs,
                function (event: AInteractionEvent) {
                    if (event.shiftKey) {
                        controller.sceneController.selectModel(model, event);
                    }
                },
                "ShiftSelectNodeInSelection"
            )
        )
        const dragSelectionInteraction = ADragInteraction.Create(controller.view.threejs,
            function (interaction: ADragInteraction, event: AInteractionEvent) {
                interaction.setInteractionState(
                    'selectionStartStore',
                    selectionModel.getSelectionSnapshotStore({
                        'startTransform': (m: AModelInterface) => {
                            return (m as ASceneNodeModel).transform.clone();
                        }
                    })
                );
                interaction.dragStartPosition=event.cursorPosition;
            },
            function (interaction: ADragInteraction, event: AInteractionEvent) {
                let selected = selectionModel.list();
                let store = interaction.getInteractionState('selectionStartStore');
                if(event.altKey && selectionModel.singleSelectedModel){
                    let m = selectionModel.singleSelectedModel as ASceneNodeModel;
                    let stored = store(m)
                    let storedTransform = (stored.startTransform as NodeTransform3D);
                    let oldposition = stored.startTransform.position;
                    m.setTransform(
                        NodeTransform3D.FromMatrix(
                            Mat4.Translation2D(
                            event.cursorPosition.minus(
                                interaction.dragStartPosition
                            )
                        ).times(
                            storedTransform.getMatrix()
                        ),
                        oldposition,
                        stored.startTransform.rotation
                        )
                    );
                }else {
                    for (let m of selected) {
                        let stored = store(m);
                        (m as ASceneNodeModel).transform.position =
                            stored.startTransform.position
                                .plus(Vec3.FromVec2(event.cursorPosition))
                                .minus(Vec3.FromVec2(interaction.dragStartPosition));
                    }
                }

            },
            function (interaction, event) {
            },
            "DragWhenSelected"
        );
        controller.addInteraction(dragSelectionInteraction);
        controller.setCurrentInteractionMode();
    }


    addSingleSelectionInteraction(element:any,
                                  dragStartCallback:(interaction:ADragInteraction, model:NodeModelType, event?:any)=>any,
                                  dragMoveCallback:(interaction:ADragInteraction, model:NodeModelType, event?:any)=>any,
                                  dragEndCallback?:(interaction:ADragInteraction, model:NodeModelType, event?:any)=>any,
                                  handle?:string){
        const self=this;
        const selectionModel = this.model;
        return this.addInteraction(
            ADragInteraction.Create(
                element,
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    let model = (selectionModel.singleSelectedModel as NodeModelType);
                    if (!model) {
                        return;
                    }
                    dragStartCallback(interaction, model, event);
                },
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    let model = (selectionModel.singleSelectedModel as NodeModelType);
                    if (!model) {
                        return;
                    }
                    dragMoveCallback(interaction, model, event);
                },
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    if(dragEndCallback){
                        let model = (selectionModel.singleSelectedModel as NodeModelType);
                        if (!model) {
                            return;
                        }
                        dragEndCallback(interaction, model, event);
                    }
                },
                handle
            )
        )
    }

    addGroupSelectionInteraction(element:any,
                                  dragStartCallback:(interaction:ADragInteraction, model:NodeModelType, selectionTransform:NodeTransform3D, event?:any)=>any,
                                  dragMoveCallback:(interaction:ADragInteraction, model:NodeModelType, selectionTransform:NodeTransform3D, event?:any)=>any,
                                  dragEndCallback?:(interaction:ADragInteraction, model:NodeModelType, selectionTransform:NodeTransform3D, event?:any)=>any,
                                  handle?:string){
        const self=this;
        const selectionModel = this.model;
        return this.addInteraction(
            ADragInteraction.Create(
                element,
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    let selection = (selectionModel.list() as NodeModelType[]);
                    for(let m of selection){
                        dragStartCallback(interaction, m, selectionModel.bounds.transform, event);
                    }
                    dragStartCallback(interaction, (self.model as unknown as NodeModelType), self.model.transform, event);

                },
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    let selection = (selectionModel.list() as NodeModelType[]);
                    for(let m of selection){
                        dragMoveCallback(interaction, m, selectionModel.bounds.transform, event);
                    }
                    dragMoveCallback(interaction, (self.model as unknown as NodeModelType), this.model.transform, event);
                },
                (interaction: ADragInteraction, event: AInteractionEvent) => {
                    if(dragEndCallback){
                        let selection = (selectionModel.list() as NodeModelType[]);
                        for(let m of selection){
                            dragEndCallback(interaction, m, selectionModel.bounds.transform, event);
                        }
                        dragEndCallback(interaction, (self.model as unknown as NodeModelType), this.model.transform, event);
                    }
                },
                handle
            )
        )
    }

    initInteractions() {
        this.addSingleSelectionInteraction(
            this.view.anchorElement.threejs,
            (interaction: ADragInteraction, model:NodeModelType, event: AInteractionEvent) => {
                interaction.setInteractionState('singleSelectedModel', model);
                interaction.dragStartPosition = Vec3.FromVec2(event.cursorPosition);
                let transform = model.transform.clone()
                interaction.setInteractionState('startTransform', transform);
            },
            (interaction: ADragInteraction, model:NodeModelType, event: AInteractionEvent) => {
                let cursorChange = Vec3.FromVec2(event.cursorPosition).minus(interaction.dragStartPosition);
                let startTransform = interaction.getInteractionState('startTransform');
                model.setTransform(new NodeTransform3D(
                    startTransform.getMatrix(),
                    startTransform.position.plus(cursorChange),
                    startTransform.rotation.clone()
                ));
            },
            (interaction: ADragInteraction, model:NodeModelType, event: AInteractionEvent) => {
            }
        )
        this.addHandleControls();
    }

    //##################//--Your Callbacks--\\##################
    //<editor-fold desc="Your Callbacks">
    /***
     * This is the drag start callback function. This function will be called
     * when the mouse is pressed down, so we'll want to store the interaction's
     * initial state.
     *
     * @param interaction: the drag interaction
     * @param model: the node model of the shape whose bounding box is dragged
     * @param event: the AInteractionEvent of this interaction
     */
    dragBBoxCornerStartCallback(interaction: ADragInteraction, model: NodeModelType, event: AInteractionEvent) {
        let transform = model.transform.clone();
        interaction.dragStartPosition = event.cursorPosition;;
        interaction.setInteractionState('startTransform', transform);
        interaction.setInteractionState('startBoundingBox', model.getBounds().clone());
    }

    /***
     * This is the drag move callback function. This function will be called
     * when the mouse is being dragged, so we want to determine which
     * transformations to use and then apply them to the shape.
     *
     * @param interaction: the drag interaction
     * @param model: the node model of the shape whose bounding box is dragged
     * @param event: the AInteractionEvent of this interaction
     */
    dragBBoxCornerMoveCallback(interaction: ADragInteraction, model: NodeModelType, event: AInteractionEvent) {
        let startTransform:NodeTransform3D = interaction.getInteractionState('startTransform').clone();
        let startBBox = interaction.getInteractionState('startBoundingBox').clone();
        let startCursor = interaction.dragStartPosition.clone();
        let newCursor = event.cursorPosition.clone();
        let PR = Mat4.Translation3D(startTransform.position).times(startTransform.rotation.Mat4());
        let RiPi = PR.getInverse();

        let transformOrigin = startTransform.position;
        if(event.shiftKey && event.altKey){
            transformOrigin=startBBox.center;
            PR = Mat4.Translation3D(transformOrigin).times(startTransform.rotation.Mat4());
            RiPi = PR.getInverse();
            if(RiPi === null){
                return;
            }
            let startCursorT = RiPi.times(Vec4.FromPoint2DXY(startCursor));
            let newCursorT = RiPi.times(Vec4.FromPoint2DXY(newCursor));
            const denomX = Precision.signedTiny(startCursorT.x);
            const denomY = Precision.signedTiny(startCursorT.y);
            var rescaleX = Precision.signedTiny(newCursorT.x) / denomX;
            var rescaleY = Precision.signedTiny(newCursorT.y) / denomY;

            // Let's update the model's transform
            model.setTransform(new NodeTransform3D(PR.times(
                    Mat4.Scale3D([rescaleX, rescaleY,1])).times(
                    RiPi
                ).times(startTransform.getMatrix()),
                startTransform.position,
                startTransform.rotation
            ));
        }else{

            if (event.altKey) {
                let startoffset = Vec3.From2DHPoint(startCursor).minus(startTransform.position);
                let newoffset = Vec3.From2DHPoint(newCursor).minus(startTransform.position);
                let nown = newoffset.getNormalized();
                let startn = startoffset.getNormalized();
                let rotationAngle = (Math.atan2(nown.y, nown.x) - Math.atan2(startn.y, startn.x));
                let newTransform = startTransform.clone();
                let rold = startTransform.rotation;
                let rdelta = Quaternion.FromAxisAngle(V3(0.0,0.0,-1.0),rotationAngle);
                newTransform.rotation = rold.times(rdelta).normalize();
                model.setTransform(newTransform);
            } else {
                PR = Mat4.Translation3D(transformOrigin).times(startTransform.rotation.Mat4());
                RiPi = PR.getInverse();
                if(RiPi === null){
                    return;
                }
                let startCursorT = RiPi.times(Vec4.FromPoint2DXY(startCursor));
                let newCursorT = RiPi.times(Vec4.FromPoint2DXY(newCursor));
                const denomX = Precision.signedTiny(startCursorT.x);
                const denomY = Precision.signedTiny(startCursorT.y);
                var rescaleX = Precision.signedTiny(newCursorT.x) / denomX;
                var rescaleY = Precision.signedTiny(newCursorT.y) / denomY;
                var rescaleZ = 1.0;

                if (!event.shiftKey) {
                    const absval = Math.max(Math.abs(Precision.signedTiny(rescaleX)), Math.abs(Precision.signedTiny(rescaleY)));
                    rescaleX = rescaleX < 0 ? -absval : absval;
                    rescaleY = rescaleY < 0 ? -absval : absval;
                    rescaleZ = Math.max(rescaleX, rescaleY);
                }

                // Let's update the model's transform
                model.setTransform(new NodeTransform3D(PR.times(
                        Mat4.Scale3D([rescaleX, rescaleY, rescaleZ])).times(
                        RiPi
                    ).times(startTransform.getMatrix()),
                    startTransform.position,
                    startTransform.rotation
                ));
            }
        }
    }

    /***
     * This is the drag end callback function. This function will be called when
     * the mouse is let go after dragging.
     *
     * @param interaction: the drag interaction
     * @param model: the node model of the shape whose bounding box is dragged
     * @param event: the AInteractionEvent of this interaction
     */
    dragBBoxCornerEndCallback(interaction: ADragInteraction, model: NodeModelType, event: AInteractionEvent) {
    }
    //</editor-fold>
    //##################\\--Your Callbacks--//##################


    addHandleControls() {
        for (let h = 0; h < 4; h++) {
            this.addSingleSelectionInteraction(
                this.view.handles[h].threejs,
                this.dragBBoxCornerStartCallback,
                this.dragBBoxCornerMoveCallback,
                this.dragBBoxCornerEndCallback,
                'HandleResize'
            )
        }

    }


}
