import {Color, Mat4, Vec2} from "../../../../amath";
import {VertexArray2D} from "../../../../ageometry";
import {
    AHandleElement,
    ALineElement,
    ALineSegmentsElement,
    APolygonElement,
    ARenderElement,
    ARenderGroup
} from "../../../../arender";
import {ASceneNodeView} from "../../../node/base/ASceneNodeView";
import {CubicBezierController} from "./CubicBezierController";
import {CubicBezierModel} from "./CubicBezierModel";


enum StrokeRatios{
    Main=1,
    Control=0.25,
    Ref=0.5

}

// static GetSplineValueForAlpha(alpha, p0, p1, p2, p3){
//     var a = ((p0*-1)+(p1*3)+(p2*-3)+p3)*alpha*alpha*alpha;
//     var b =((p0*3)+(p1*-6)+(p2*3))*alpha*alpha;
//     var c =((p0*-3)+(p1*3))*alpha;
//     var d = p0;
//     return a+b+c+d;
// }



function GetSplineValueForAlpha(alpha:number, p0:Vec2, p1:Vec2, p2:Vec2, p3:Vec2){
    var a = p0.times(-1)
        .plus(p1.times(3))
        .plus(p2.times(-3))
        .plus(p3)
        .times(alpha*alpha*alpha);
    var b =p0.times(3)
        .plus(p1.times(-6))
        .plus(p2.times(3))
        .times(alpha*alpha);
    var c =p0.times(-3)
        .plus(p1.times(3))
        .times(alpha);
    var d = p0;
    return a
        .plus(b)
        .plus(c)
        .plus(d);
}


export class CubicBezierView extends ASceneNodeView<CubicBezierModel>{
    // @ts-ignore
    controller!:CubicBezierController;
    public fillElement!:ARenderElement;
    public strokeElement!:ALineElement;
    // let's give the EditVertsView an array of handle elements...
    public vertexHandles: AHandleElement[];
    public handleLines!:ALineSegmentsElement;
    public inSelectionRenderGroup!:ARenderGroup;
    protected inSelection:boolean=false;

    constructor() {
        super();
        this.vertexHandles = [];
    }

    _updateSplineGeometry(){
        let splineVerts = new VertexArray2D();
        if(this.model.verts.length>3) {
            // GetSplineValueForAlpha
            for(let k=0;k<this.model.verts.length-3;k+=3){
                let p0=this.model.verts.getPoint2DAt(k);
                let p1=this.model.verts.getPoint2DAt(k+1);
                let p2=this.model.verts.getPoint2DAt(k+2);
                let p3=this.model.verts.getPoint2DAt(k+3);
                for(let s=0;s<this.model.nSubdivisions;s++){
                    splineVerts.addVertex(GetSplineValueForAlpha(s/(this.model.nSubdivisions-1),p0,p1,p2,p3));
                }
            }
        }else{
            splineVerts=this.model.verts;
        }
        if(splineVerts.nVerts>1) {
            this.fillElement.setVerts(splineVerts);
            this.strokeElement.setVerts(splineVerts);
        }
    }
    _updateHandleGeometry(){
        let handleVerts = new VertexArray2D();
        if(this.model.verts.length>3) {
            // GetSplineValueForAlpha
            for(let k=0;k<this.model.verts.length-3;k+=3){
                let p0=this.model.verts.getPoint2DAt(k);
                let p1=this.model.verts.getPoint2DAt(k+1);
                let p2=this.model.verts.getPoint2DAt(k+2);
                let p3=this.model.verts.getPoint2DAt(k+3);
                handleVerts.addVertex(p0);
                handleVerts.addVertex(p1);
                handleVerts.addVertex(p2);
                handleVerts.addVertex(p3);
            }
            this.handleLines.setVerts(handleVerts);
        }
        let handlesEnter = this.model.verts.length - this.vertexHandles.length;
        if (handlesEnter > 0) {
            for (let nh = 0; nh < handlesEnter; nh++) {
                let newHandle = new AHandleElement(8, Color.FromString("#888888"));
                newHandle.index = this.vertexHandles.length;
                this.controller.initHandleInteractions(newHandle);
                this.inSelectionRenderGroup.add(newHandle);
                this.vertexHandles.push(newHandle);
            }
        }
        for (let h = 0; h < this.vertexHandles.length; h++) {
            this.vertexHandles[h].threejs.matrix = Mat4.Translation2D(this.model.verts.getPoint2DAt(h)).asThreeJS();
        }
    }

    onGeometryUpdate(){
        super.onGeometryUpdate();
        this._updateHandleGeometry();
        this._updateSplineGeometry();
    }

    get model() {
        return this.controller.model as CubicBezierModel;
    }

    initGeometry(){
        this.fillElement = new APolygonElement(this.model.verts, this.model.color);
        this.addElement(this.fillElement);
        this.strokeElement = new ALineElement(this.model.verts, this.model.strokeColor, this.model.strokeWidth);
        this.addElement(this.strokeElement);
        this.inSelectionRenderGroup = new ARenderGroup();
        this.handleLines = new ALineSegmentsElement(this.model.verts, this.model.strokeColor, 0.002);
        this.handleLines.setColor(Color.FromString("#5588ff"))
        // this.addElement(this.handleLine);
        this.inSelectionRenderGroup.add(this.handleLines);
        this.addElement(this.inSelectionRenderGroup);
    }

    initGraphics() {
        super.initGraphics();
        this.initGeometry();
        this._initUpdateSubscriptions();
        this.initEditModeSubscriptions();
        // this.fillElement.visible=false;
    }

    _initUpdateSubscriptions(){
        const self = this;
        const model = self.model;

        // this.addMaterialChangeCallback(()=>{
        //     self.fillElement.setColor(model.color);
        // },
        //     'model.color');

        // this.controller.subscribe(
        //     this.model.addStateKeyListener('geometry', ()=>{
        //         self.onGeometryUpdate();
        //     }),
        //     'model.verts'
        // );

        this.controller.subscribe(
            this.model.addStateKeyListener('strokeColor', ()=>{
                self.strokeElement.setColor(model.strokeColor);
            }),
            'model.strokeColor'
        );

        this.controller.subscribe(
            this.model.addStateKeyListener('strokeWidth', ()=>{
                self.strokeElement.material.linewidth=model.strokeWidth;
                self.strokeElement.setColor(model.strokeColor);
            }),
            'model.strokeWidth'
        );
        this.controller.subscribe(
            this.model.addStateKeyListener('nSubdivisions', ()=>{
                self.onGeometryUpdate();
            }),
            'model.nSubdivisions'
        );
        this.controller.subscribe(
            this.model.addStateKeyListener('fillAlpha', ()=>{
                self.fillElement.setOpacity(model.fillAlpha);
            }),
            'model.fillAlpha'
        );
    }
    initEditModeSubscriptions(){
        const self = this;
        const model = self.model;
        this.controller.subscribe(
            this.model.addEnterSelectionListener(()=>{
                self.inSelection=true;
                if(model.inEditMode) {
                    self.inSelectionRenderGroup.visible=true;
                }
            })
        )
        this.controller.subscribe(
            this.model.addExitSelectionListener(()=>{
                self.inSelection=false;
                self.inSelectionRenderGroup.visible=false;
            })
        )

        this.controller.subscribe(
            this.model.addStateKeyListener('inEditMode', ()=>{
                if(self.inSelection && self.model.inEditMode){
                    self.inSelectionRenderGroup.visible=true;
                }else{
                    self.inSelectionRenderGroup.visible=false;
                }
            })
        );
    }
}


