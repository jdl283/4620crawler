import {Vector} from "./Vector";
import {Random} from "./Random";
import {ASerializable} from "../aserial/ASerializable";


// function V2(elements?: Array<number>):Vec2;
function V2(...args: Array<any>):Vec2{
    return new Vec2(...args);
}

export {V2};

@ASerializable("Vec2")
export class Vec2 extends Vector{

    static N_DIMENSIONS:number=2;

    /**
     * Creates Vec2 from x and y
     * @param x
     * @param y
     */
    public constructor(x: number, y: number);
    /**
     * Creates Vec2 from a list of elements
     * @param elements
     */
    public constructor(elements?: Array<number>);
    public constructor(...args: Array<any>) { // common logic constructor
        super(...args);
    }

    _setToDefault(){
        this.elements = [0,0];
    }

    get nDimensions(){
        return 2;
    };

    toString(){
        return `Vec2(${this.x}, ${this.y})`
    }

    static Random(){
        var r = new this(Random.floatArray(2));
        return r;
    }

    // get Vec2DH(){
    //     return new Vec3(this.x, this.y, 0);
    // }
    //
    // get Point2DH(){
    //     return new Vec3(this.x, this.y, 1);
    // }
}

