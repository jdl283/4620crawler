import {
    BoundingBox3D,
    Color,
    NodeTransform3D,
    Quaternion,
    V2,
    V3,
    V4,
    Vec2,
    Vec3,
    VertexArray3D
} from "../../../anigraph";

export class RingSegment{
    start:Vec3;
    end:Vec3;
    radius:number;
    colors: Color[]=[];
    nSamples:number;
    isSmooth:boolean;
    constructor(start:Vec3, end:Vec3, radius:number=10, colors?:Color[], nSamples:number=10, isSmooth:boolean=true){
        this.start=start;
        this.end=end;
        this.radius=radius;
        this.nSamples=nSamples;
        this.isSmooth=isSmooth;
        if(colors){this.colors=colors;}
    }

    get vec(){return this.end.minus(this.start);}
    get direction(){return this.vec.getNormalized();}
    get length(){return this.vec.L2();}

    getTransform(){
        return new NodeTransform3D(
            this.start,
            Quaternion.FromRotationBetweenTwoVectors(V3(0,0,1), this.direction)
        );
    }
    // Quaternion.FromRotationBetweenTwoVectors(V3(0,0,1), this.direction)

    getBounds(){
        let b = new BoundingBox3D();
        b.boundPoint(this.start.minus(V3(this.radius,this.radius,this.radius)));
        b.boundPoint(this.end.plus(V3(this.radius,this.radius,this.radius)));
        b.transform = this.getTransform();
        return b;
    }

    ComputeGeometry(){
        // Let's define some geometry. We will create a VertexArray3D with normals and texture coordinates
        let verts = VertexArray3D.CreateForRendering(true, true, true);
        let color0 = V4(1,1,1,1);
        let color1 = V4(1,1,1,1);
        if(this.colors.length) {
            color0 = this.colors[0].Vec4;
            if(this.colors.length>1) {
                color1 = this.colors[1].Vec4;
            }else{
                color1 = this.colors[0].Vec4;
            }
        }




        //Now, lets assign it geometry for a ring.
        //Specifically, we will sample a bunch of points along a circle, and at each point we will
        //add two vertices offset perpendicular to that circle.

        // let's first compute a circle of nSamples vertices in the XY plane
        // we will also calculate their texture coordinates, which we will map to the bottom of our image (v=1, in uv coordinates)
        let samplesXY0:Vec3[] = [];
        let uv0:Vec2[]=[];
        let dstep = 1/(this.nSamples-1);
        let dtheta = Math.PI*2*dstep;

        for(let s=0;s<this.nSamples;s++){
            let theta = s*dtheta;
            let v = V3(Math.cos(theta),Math.sin(theta), 0);
            samplesXY0.push(v.times(this.radius));
            uv0.push(V2(s*dstep, 1));
        }

        // now we'll compute another circle translated in z
        let samplesXYh = samplesXY0.map((v)=>{
            return v.plus(V3(0,0,this.length));
        })
        // and we'll map its texture coordinates to the bottom of our image (v=0).
        let uvh = uv0.map((v)=>{
            return V2(v.x,0);
        })

        // Now we will calculate normals and assign indices.
        // This will work a bit differently depending on whether we want a smooth ring or one with flat faces.
        if(!this.isSmooth) {
            // First, let's consider the flat case, which is a bit simpler...
            // Here we are just going to add the vertices three at a time as triangles
            // In this case, the normal will be calculated automatically as the normal to
            // the specified triangle.
            for (let s = 0; s < this.nSamples; s++) {
                // first let's get the 4 vertices and texture coordinates in one segment of our ring in zig-zag order
                let v0 = samplesXY0[s];
                let t0 = uv0[s];
                let v1 = samplesXYh[s];
                let t1 = uvh[s];
                let v2 = samplesXY0[(s + 1) % this.nSamples];
                let t2 = uv0[(s + 1) % this.nSamples];
                let v3 = samplesXYh[(s + 1) % this.nSamples];
                let t3 = uvh[(s + 1) % this.nSamples];

                // Now let's add twp triangles to make a square
                verts.addTriangleCCW(v2, v1, v0, [t2, t1, t0], [color0,color0,color0]);
                verts.addTriangleCCW(v3, v1, v2, [t3, t1, t2], [color1,color1,color1]);
            }

        }else{
            // Now, let's consider the smooth case.
            // Here, we are going to use indexed per-vertex normals.
            // We'll start by adding our vertices to the VertexArray
            // with their corresponding normals and texture coordinates.
            // Note that the normals for both ring of vertices are the same
            // and are equal to the values we calculated in samplesXY0

            for (let s = 0; s < this.nSamples; s++) {
                verts.addVertex(
                    samplesXY0[s],
                    samplesXY0[s].getNormalized(),
                    uv0[s],
                    color0
                );
                verts.addVertex(
                    samplesXYh[s],
                    samplesXY0[s].getNormalized(),
                    uvh[s],
                    color1
                );
            }

            // Of, now we need to specify our triangles by providing indices.
            // Each triplet of integers specifies a triangle that should be drawn to connect
            // the corresponding vertices. Note that the order you specify the vertices in will
            // determine which side of the triangle is front-facing. You should specify verts
            // in counter-clockwise order relative to the front of the triangle, or they may be
            // culled (not show up) when you render.

            let nverts = this.nSamples*2;
            for (let s = 0; s < this.nSamples; s++) {
                // first let's get the 4 vertices in one segment of our ring
                let v0 = (s * 2);
                let v1 = (s * 2 + 1) % nverts;
                let v2 = (s * 2 + 2) % nverts;
                let v3 = (s * 2 + 3) % nverts;

                //now let's add two triangles to make a square
                verts.indices.push([v2, v1, v0]);
                verts.indices.push([v2, v3, v1]);
            }
        }

        //now let's return the geometry
        return verts;
    }

}
