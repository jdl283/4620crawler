import {ASceneNodeController} from "../../amvc/node/base/ASceneNodeController";
import {AParticlesModel} from "./AParticlesModel";

export abstract class AParticlesController<T extends AParticlesModel> extends ASceneNodeController<T>{
}
