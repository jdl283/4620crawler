import {APointLightModel, V3, Vec3} from "../../../anigraph";


export class EnemyNodeModel extends APointLightModel{
    velocity:Vec3;
    size:number=1;

    constructor() {
        super();
        this.velocity=V3(0,0,0);
    }
}
