

### three.interaction
in `InteractionManager.js`
```javascript
processInteractive(interactionEvent, displayObject, func, hitTest, interactive) {
    //...
}
```
that's the function where it picks out the interactions... it gets called recursively on the scene object (so it gets called on the scene's descendents)


the interactionevent target is the thing that was set to interactive with a listener. So if you put an event on Object3D, that will be the target, not the child mesh where the intersection happens. Though, the child mesh will trigger the interaction.

the above function calls processClick(), which calls triggerevent
