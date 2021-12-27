export default Interaction;
/**
 * The interaction manager deals with mouse, touch and pointer events. Any DisplayObject can be interactive
 * if its interactive parameter is set to true
 * This manager also supports multitouch.
 *
 * reference to [pixi.js](http://www.pixijs.com/) impl
 *
 * @example
 * import { Scene, PerspectiveCamera, WebGLRenderer, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
 * import { Interaction } from 'three.interaction';
 * const renderer = new WebGLRenderer({ canvas: canvasElement });
 * const scenevis = new Scene();
 * const camera = new PerspectiveCamera(60, width / height, 0.1, 100);
 *
 * const interaction = new Interaction(renderer, scenevis, camera);
 * // then you can bind every interaction event with any mesh which you had `add` into `scenevis` before
 * const cube = new Mesh(
 *   new BoxGeometry(1, 1, 1),
 *   new MeshBasicMaterial({ color: 0xffffff }),
 * );
 * scenevis.add(cube);
 * cube.on('touchstart', ev => {
 *   console.log(ev);
 * });
 *
 * cube.on(PointerEvents.POINTER_DOWN, ev => {
 *   console.log(ev);
 * });
 *
 * cube.on('pointerdown', ev => {
 *   console.log(ev);
 * });
 * // and so on ...
 *
 * // you can also listen on parent-node or any display-tree node,
 * // source event will bubble up along with display-tree.
 * // you can stop the bubble-up by invoke ev.stopPropagation function.
 * scenevis.on('touchstart', ev => {
 *   console.log(ev);
 * })
 *
 * @class
 * @extends InteractionManager
 */
declare class Interaction extends InteractionManager {
    /**
     * a ticker
     *
     * @private
     * @member {Ticker}
     */
    private ticker;
}

import InteractionManager from "./InteractionManager";
