import {Sphere} from "./SphereElement";
import {Rectangle} from "./RectangleElement";
import {AObjectState, ASceneNodeModel, ASerializable, BoundingBox3D} from "../../../anigraph";

@ASerializable("BasicElementsModel")
export class BasicElementsModel extends ASceneNodeModel{
    @AObjectState spheres:Sphere[];
    @AObjectState rectangles:Rectangle[];
    @AObjectState radii:number;


    getModelGUIControlSpec(): { [p: string]: any } {
        const self = this;
        return {
            ...super.getModelGUIControlSpec(),
            radii:{
                value: self.radii,
                min: 1,
                max:1000,
                step:1,
                onChange(v:any){
                    self.radii=v
                }
            }
        };
    }

    constructor(...args:any[]){
        super();
        this.spheres=[];
        this.rectangles=[];
        this.radii = 50;
        const self = this;

        this.subscribe(this.addStateKeyListener('radii', ()=>{
            let newSpheres = [];
            for(let s of self.spheres){
                newSpheres.push(new Sphere(self.radii, s.transform));
            }
            self.spheres = newSpheres;
        }))
    }

    addShape(shape:Sphere|Rectangle){
        if(shape instanceof Sphere){
            this.spheres.push(shape);
        }else{
            this.rectangles.push(shape);
        }
    }

    static async CreateDefaultNode(radius:number=50, ...args:any[]){
        let m = new BasicElementsModel();
        let s = new Sphere(radius);
        let r = new Rectangle(2*radius, 2*radius, ...args);
        r.transform.position.z = -radius;
        m.addShape(s);
        m.addShape(r);
        return m;
    }

    getBounds(): BoundingBox3D {
        let b = new BoundingBox3D();
        for(let s of this.spheres){
            b.boundBounds(s.getBounds());
        }
        for(let r of this.rectangles){
            b.boundBounds(r.getBounds());
        }
        b.transform = this.transform;
        return b;
    }
}
