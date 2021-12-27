/**
 * This is the doc comment for index.ts in amath
 *
 * Specify this is a module comment and rename it to my-module:
 * @module amath
 */

import {Matrix} from "./Matrix";

export * from './Precision';
export * from './Random';
export * from './Vector';
export * from './Vec2';
export * from './Vec3';
export * from './Vec4';
export * from './Color';
export * from './Matrix';
export * from './Mat3';
export * from './Mat4';
export * from './NodeTransform';
export * from './NodeTransform2D';
export * from './Quaternion';
export * from './NodeTransform3D';
export * from './BoundingBox';
export * from './BoundingBox2D';
export * from './BoundingBox3D';
export * from './BezierTween';
// export * from '../ageometry/VertexAttributeArray';
// export * from '../ageometry/VertexArray';
// export * from '../ageometry/VertexArray2D';
// export * from '../ageometry/VertexArray3D';
// export * from '../ageometry/ModelGeometry';
// export * from '../ageometry/Object3DModelWrapper';

export interface TransformationInterface {
    getMatrix(): Matrix;
}

// export * from '';


// import {Precision} from "./Precision";
// import {Vector} from "./Vector";
// import {Vec2, V2} from "./Vec2";
// import {Vec3, V3} from "./Vec3";
// import {Vec4} from "./Vec4";
// import {Matrix} from "./Matrix";
// import {Mat3} from "./Mat3";
// import {NodeTransform2D} from "./NodeTransform2D";
// import {VertexAttributeArray, VertexAttributeArray2D, VertexAttributeArray3D} from "./VertexAttributeArray";
// import {VertexArray} from "./VertexArray";
// import {VertexArray2D} from "./VertexArray2D";
// import {Color} from "./Color";
//
// export {
//     Precision,
//     Vector,
//     Vec2, V2,
//     Vec3, V3,
//     Vec4,
//     Matrix,
//     Mat3,
//     NodeTransform2D,
//     VertexAttributeArray,
//     VertexAttributeArray2D,
//     VertexAttributeArray3D,
//     VertexArray2D,
//     Color
// }
