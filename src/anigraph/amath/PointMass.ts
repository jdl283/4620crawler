import {Vec3} from "./Vec3";


export abstract class PointMassInterface{
    abstract getPosition():Vec3;
    abstract getMass():number;
    abstract getVelocity():Vec3;
}
