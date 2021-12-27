# How Selection & Selection Controllers Work


SelectionModel is a dimension-independent class. It can have 2D or 3D vies and controllers specific to each scenecontroller.

### Overview:
AppState has a property `selectionModel`, which should be a subclass of [ASelectionModel](ASelectionModel.ts). The selection model has an AObjectState property `_selection` which is an instance of the map-like class [ASelection\<AModel>](../../aobject/ASelection.ts). This approach was designed to expose the current selection through a model-like interface to various controllers and views.

Top to bottom, the AppState has the ASelectionModel and various [ASceneController](../scene/ASceneController.ts)'s. The scene controllers each may or may not have an [ASelectionController](ASelectionController.ts), which generally uses the AppState's selectionmodel as its model. The [ASceneNodeController](../node/base/ASceneNodeController.ts)'s can put click (or other) listeners on node views to report selection by calling their [ASceneController](../scene/ASceneController.ts)'s `selectModel(...)`function. The scene controller then calls its [ASelectionController]('./ASelectionController)'s `selectModel(...)` function, which modifies the [ASelectionModel](ASelectionModel.ts), which triggers a `SelectionEvents.SelectionChanged` event, updating anything that listens to the selection. The convention should be to pass events that trigger selection at least as far as to the [ASelectionController](ASelectionController.ts)'s `selectModel(...)`, so it can specify how modifiers change the effect on selection.

The intended way to handle selection is to have [ASelectionController](ASelectionController.ts)'s modify the selection through their [ASelectionModel](ASelectionModel.ts). Other classes can then subscribe to the selection model in different ways, described below/

### Responding to selection changes with callbacks:
There are different ways to listen for changes to a selection, which will result in different frequencies of callbacks being called. In general, we want to minimize unnecessary callbacks (["aint no caller-back-er"](https://www.youtube.com/watch?v=Kgjkth6BRRY)), which is why this flexability is useful.

- **Subscribing to [`SelectionEvents`](ASelectionModel.ts)**: One option is to only respond when specific events are triggered on the selection model. The main event is `SelectionEvents.SelectionChanged`, which gets triggered explicitly by the selection model whenever the set of selected models changes.
```typescript
// where `this` extends AObject
this.subscribe(SelectionEvents.SelectionChanged, 
    selectionModel.addEventListener(SelectionEvents.SelectionChanged, (selection: ASelection) => {
        // Response
    })
);
```
- **Listening for State Changes**: Another option is to respond any time a change happens *within any of the selected models*. For example, if you have a polygon selected and it changes its geometry, you might want to recalculate a bounding box for the selection view. We can accomplish this by adding a state listener to our selection model.
```typescript
// where `this` extends AObject
this.subscribe(this.selectionModel.addSelectionStateListener(()=>{
    // Response
}));

```


### Classes:
- [ASelection](../../aobject/ASelection.ts): A container class that maps unique keys to selected items. Allows for selection operations that specify callbacks on enter, exit, and update similar to d3.js.
- [ASelectionModel](ASelectionModel.ts): AModel class with an `ASelection<AModel>` property that is AObjectState, so it can be listened to. Also signals the events in [`SelectionEvents`](ASelectionModel.ts) enum, specifically `SelectionEvenets.SelectionChanged`, whenever `selectModel(model?:AModel)` is called.
- [ASelectionController](ASelectionController.ts): Controller class to handle interactions with selection.
- [ASelectionView](ASelectionView.ts): View class for displaying any visuals that are part of selection (e.g., bounding box, handles for editing, etc.).

## AppState and Selection:

[AAppState](../AAppState.tsx) has the following:
```typescript
public selectionModel!: ASelectionModel;
get modelSelection(){
    return this.selectionModel.selection;
}
```
and 
When you create an [ASelectionController](ASelectionController.ts), you can either provide a selection model to it's constructor, or it will use `AAppState.GetAppState().selectionModel` as it's selection model.

In `AppState` subclasses, you can also respond to selection events by registering event listeners with `selectionModel`. This provides a way, for example, to expose controls for the selected model in the app's gui. In general, most of the logic around selection should happen inside of a `SelectionController` subclass, though. 
