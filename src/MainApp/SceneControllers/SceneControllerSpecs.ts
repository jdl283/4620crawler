import {
    A2DPolygonModel, A2DPolygonView, ACameraNodeController, ACameraNodeModel, ACameraNodeView,
    AExtrudedShapeModel, AExtrudedShapeView, ALoadedBoundsView, ALoadedModel, ALoadedView,
    AMVCSpec,
    APointLightController,
    APointLightModel,
    APointLightView, ASceneNodeController, ASceneNodeProxyView, BasicSceneNodeController
} from "../../anigraph";
import {
    AGroundModel,
    AGroundView,
    ASpriteModel, ASpriteView,
    CubicBezierController,
    CubicBezierModel,
    CubicBezierView, EditVertsController, EditVertsModel, EditVertsView, PyramidController,
} from "../../anigraph/amvc/derived";
import {FlameModel} from "../../anigraph/effects/particle/flame/FlameModel";
import {FlameView} from "../../anigraph/effects/particle/flame/FlameView";
import {DragonNodeModel} from "../Nodes/Dragon/DragonNodeModel";
import {DragonNodeController} from "../Nodes/Dragon/DragonNodeController";
import {ASceneNodeBoundsView} from "../../anigraph/amvc/node/base/ASceneNodeBoundsView";
import {DragonNodeView} from "../Nodes/Dragon/DragonNodeView";
import {EnemyNodeModel} from "../Nodes/Enemy/EnemyNodeModel";
import {RingNodeModel} from "../Nodes/ExampleProcedureGeometry/RingNodeModel";
import {AMeshView} from "../../anigraph/amvc/node/mesh/AMeshView";
import GroundView from "../Nodes/Ground/GroundView";
import {GroundController} from "../Nodes/Ground/GroundController";
import {GroundModel} from "../Nodes/Ground/GroundModel";
import {RingNodeView} from "../Nodes/ExampleProcedureGeometry/RingNodeView";
import {RingNodeController} from "../Nodes/ExampleProcedureGeometry/RingNodeController";
import {BasicElementsModel, BasicElementsView} from "../Nodes/ProceduralBasicGeometryElements";
import {SphereModel} from "../Nodes/BasicGeometry/SphereModel";
import {GridModel} from "../Nodes/BasicGeometry/GridModel";
import {GridView} from "../Nodes/BasicGeometry/GridView";




export function CommonSpecs(){
    return [
            new AMVCSpec(APointLightModel, APointLightView, APointLightController),
            new AMVCSpec(A2DPolygonModel,A2DPolygonView, BasicSceneNodeController),
            new AMVCSpec(CubicBezierModel,CubicBezierView, CubicBezierController),
            new AMVCSpec(EditVertsModel, EditVertsView, EditVertsController),
            new AMVCSpec(ASpriteModel, ASpriteView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),
            new AMVCSpec(ACameraNodeModel, ACameraNodeView, ACameraNodeController, {canCreateDefault:true, isGUIOption:true}),
        new AMVCSpec(EnemyNodeModel, APointLightView, APointLightController),
        new AMVCSpec(BasicElementsModel, BasicElementsView, BasicSceneNodeController, {canCreateDefault:true, isGUIOption:true}),
        new AMVCSpec(SphereModel, AMeshView, BasicSceneNodeController, {canCreateDefault:true, isGUIOption:true}),
    ];
}

export function BasicMapSceneControllerSpecs(){
    return [
        ...CommonSpecs(),
        new AMVCSpec(AExtrudedShapeModel,CubicBezierView, CubicBezierController),
        new AMVCSpec(FlameModel, A2DPolygonView, ASceneNodeController),
        new AMVCSpec(ALoadedModel, ALoadedBoundsView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),
        new AMVCSpec(GroundModel, GroundView, GroundController, {canCreateDefault:false, isGUIOption:false}),
        new AMVCSpec(DragonNodeModel, ALoadedBoundsView, DragonNodeController, {canCreateDefault:true, isGUIOption:true}),
        new AMVCSpec(RingNodeModel, ASceneNodeBoundsView, RingNodeController, {canCreateDefault:true, isGUIOption:true}),
        new AMVCSpec(GridModel, ASceneNodeProxyView, BasicSceneNodeController, {canCreateDefault:true, isGUIOption:true}),
        ];
}

export function BasicGameSceneControllerSpecs(){
    return [
        ...CommonSpecs(),
        new AMVCSpec(AExtrudedShapeModel,AExtrudedShapeView, CubicBezierController),
        new AMVCSpec(ALoadedModel, ALoadedView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),
        new AMVCSpec(FlameModel, FlameView, ASceneNodeController),
        new AMVCSpec(DragonNodeModel, DragonNodeView, DragonNodeController, {canCreateDefault:true, isGUIOption:true}),
        new AMVCSpec(RingNodeModel, RingNodeView, RingNodeController, {canCreateDefault:true, isGUIOption:true}),
        new AMVCSpec(GroundModel, GroundView, GroundController, {canCreateDefault:false, isGUIOption:false}),
        new AMVCSpec(GridModel, GridView, BasicSceneNodeController, {canCreateDefault:true, isGUIOption:true}),
    ]
}
