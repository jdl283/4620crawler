import {
    APolygonElement,
    ASceneNodeModel,
    ASceneNodeView,
    ASerializable,
    GetAppState,
    Mat4,
    Vec3
} from "src/anigraph/index";
import {PyramidEnums, PyramidModel} from "./PyramidModel";
import {PyramidController} from "./PyramidController";


@ASerializable("PyramidView")
export class PyramidView extends ASceneNodeView<ASceneNodeModel>{
    public element!:APolygonElement;
    public controller!:PyramidController;
    public copies:APolygonElement[];
    get model(){
        return this.controller.model as PyramidModel;
    }
    constructor() {
        super();
        const self = this;
        this.copies = [];


        // You could use unsubscribe() like below to remove the subscription
        // this.unsubscribe("colorshift")
    }

    initGraphics() {
        super.initGraphics();
        this.element = new APolygonElement(this.model.verts, this.model.color);
        // this.addElement(this.element);
        // let newOb = NewObject3D();
        for(let c=0;c<PyramidEnums.maxNCopies;c++){
            let newCopy = new APolygonElement(this.model.verts, this.model.color);
            this.copies.push(newCopy);
            // newOb.add(newCopy.threejs);
            this.addElement(newCopy);
        }
        // this.threejs.add(newOb);

        const self=this;
        this.controller.subscribe(GetAppState().addClockListener((t:number)=>{
                self.element.setColor(self.model.color.Spun(self.model.colorSpeed*t/(2*Math.PI*100)));
                this.updateNonGeometry();
            }),
            "colorshift");

        this.updateNonGeometry();
        // this.controller.subscribe(this.model.addStateListener(()=>{self.updateNonGeometry();}));
    }

    updateNonGeometry(){

        for(let c=0;c<PyramidEnums.maxNCopies;c++){
            let P = Mat4.Translation3D(new Vec3(this.model.transform.anchor.x, this.model.transform.anchor.y, -this.model.nCopies+c));
            let Pinv = P.getInverse();
            if(c<this.model.nCopies){
                this.copies[c].visible=true;
                let alpha = c/(this.model.nCopies);
                Pinv.times(Mat4.Scale3D(
                    [Math.pow(this.model.spread,alpha*alpha),
                    Math.pow(this.model.spread,alpha*alpha),
                    Math.pow(this.model.spread,alpha*alpha)]
                    ))
                    .times(Mat4.Rotation2D( alpha*(this.model.twirl) ))
                    .times(P)
                    .assignTo(this.copies[c].threejs.matrix);
                this.copies[c].setColor(this.model.color.Spun(alpha*this.model.colorSpread));
            }else{
                this.copies[c].visible=false;
            }
        }
    }

    onGeometryUpdate(){
        super.onGeometryUpdate();
        this.element.setVerts(this.model.verts);
        for(let c=0;c<PyramidEnums.maxNCopies;c++){
            this.copies[c].setVerts(this.model.verts);
        }
        this.updateNonGeometry();
    }


}
