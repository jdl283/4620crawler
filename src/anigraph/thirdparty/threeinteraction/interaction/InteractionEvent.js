/**
 * Event class that mimics native DOM events.
 *
 * @class
 */
class InteractionEvent {
  /**
   * InteractionEvent constructor
   */
  constructor() {
    /**
     * Whether this event will continue propagating in the tree
     *
     * @member {boolean}
     */
    this.stopped = false;

    /**
     * The object which caused this event to be dispatched.
     *
     * @member {Object3D}
     */
    this.target = null;

    /**
     * The object whose event listener’s callback is currently being invoked.
     *
     * @member {Object3D}
     */
    this.currentTarget = null;

    /**
     * Type of the event
     *
     * @member {string}
     */
    this.type = null;

    /**
     * InteractionData related to this event
     *
     * @member {InteractionData}
     */
    this.data = null;

    /**
     * ray caster detial from 3d-mesh
     *
     * @member {Intersects}
     */
    this.intersects = [];

    /**
     * The index of the intersection that triggered this event
     * ABENOTE Added by Abe
     * @type {number}
     */
    this.triggeringIntersectionIndex=-1;

    /**
     * If this is set to positive then events triggered by any intersection behind the first intersect will be skipped.
     * @type {boolean}
     */
    this.blockOccludedIntersects=false;

  }

  get isFromClosestIntersect(){
    return this.triggeringIntersectionIndex===0;
  }

  /**
   * Prevents event from reaching any objects other than the current object.
   *
   */
  stopPropagation() {
    this.stopped = true;
  }

  /**
   * Resets the event.
   *
   * @private
   */
  _reset() {
    this.stopped = false;
    this.currentTarget = null;
    this.target = null;
    this.intersects = [];
    this.triggeringIntersectionIndex=-1;
    this.blockOccludedIntersects=false;
  }
}

export default InteractionEvent;
