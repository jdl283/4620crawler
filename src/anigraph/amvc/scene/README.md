



## ASceneController
The scene controller contains a map that determines, for each model class, what controller and view classes to create.

#### Cameras
The scene controller has a `.camera` getter to get the current camera being used. It also has a default scene camera, `.sceneCamera`, which is separate from the model hierarchy and used as a default when no node cameras are currently selected. 

The camera is handled by the scene controller

