import {AMeshModel} from "../../../anigraph/amvc/node/mesh/AMeshModel";
import {
    AObjectState,
    ASceneNodeModel,
    ASerializable, BoundingBox3D,
    Color, GetAppState, NodeTransform3D, Quaternion,
    V2,
    V3,
    Vec2,
    Vec3,
    VertexArray3D
} from "../../../anigraph";

import {RingSegment} from "./RingSegment";
import {MainAppState} from "../../MainAppState";

@ASerializable("RingNodeModel")
export class RingNodeModel extends ASceneNodeModel{
    @AObjectState segments:RingSegment[];

    constructor(segments?:RingSegment[], ...args:any[]) {
        super();

        // these will not be selectable through clicking in map view...
        // you can still select through the scene graph view though
        this.selectable=false;

        this.segments=[];
        if(segments){this.segments=segments;}
        const self=this;

        // To make sure that anything listening to our geometry knows when the segments change,
        // we will trigger a geometry update whenever they change.
        this.subscribe(this.addStateKeyListener('segments', ()=>{
            self.geometry.touch();
        }))


        //How to subscribe to some AppState property:
        // let appState = GetAppState() as MainAppState;
        // self.subscribe(GetAppState().addStateKeyListener('thing', ()=>{
        //     console.log(`thing is: ${appState.thing}`)
        // }))


    }

    static async CreateDefaultNode(radius:number=5, height=10, samples:number=50, isSmooth:boolean=true, ...args:any[]) {
        let newNode = new this();

        let joints = [
            V3(0,0,0),
            V3(0,0,50),
            V3(0,100,100),
            V3(0,-100,150),
        ]
        newNode.segments = [
            new RingSegment(joints[0], joints[1], radius, [Color.FromString('#ff0000'), Color.FromString('#00ff00')]),
            new RingSegment(joints[1], joints[2], radius, [Color.FromString('#00ff00'), Color.FromString('#0000ff')]),
            new RingSegment(joints[2], joints[3], radius, [Color.FromString('#0000ff'), Color.FromString('#ffffff')]),
        ]
        newNode.color = Color.Random();
        newNode.color.a = 0.5; // we can even make it semi-transparent
        return newNode;
    }

    getBoundsForSegments(){
        let b = new BoundingBox3D();
        for (let s of this.segments){
            b.boundBounds(s.getBounds());
        }
        return b;
    }

    getBounds(): BoundingBox3D {
        let b = this.getBoundsForSegments();
        b.transform = this.getWorldTransform();
        return b;
    }

}
