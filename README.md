### Install
```npm install```

### Run
* ```npm run dev```
* Go to `localhost:8080` in the web browser

### Environment
The provided ```index.ts``` script loads a simple Babylon.js scene and adds three primitive objects: Cylinder, Cube, IcoSphere.

#### Task 1) UI & Primitive Meshes
Selecting a mesh should bring up a UI window with primitives parameters adjustment. 
You can choose any library or plain HTML to implement the following UI
When a primitive mesh is selected, the UI should display options specific for the selected primitive. It should be possible to set:
* For the *Cube*: 3 dimensions: width, height, depth (range 0.1-2.0)
* For the *Cylinder*: Diameter and height (range 0.1-2.0)
* For the *IcoSphere*: Diameter (range 0.1-2.0) and subdivisions (range 1-10)

#### Task 2) Bouncing Animation
Implement the following algorithm:
`applyBouncing(node: TransformNode, amplitude: number, duration: time)`

where
* `node` - an object which should play this animation
* `amplitude` - the start height of the bounce.
* `"duration` - Period of time in ms from the start of the animation when the object is at the topmost point to the end of the animation when the object has completely stopped. E.g. if duration is 2 seconds the whole animation should finish in 2 seconds i.e. it will be twice as fast vs if duration is 4 seconds. But the overall animation is the same.

The result of this animation should roughly match the following video:(https://www.youtube.com/watch?v=a7oSbf8NiLw)

Please implement this on a mesh in the scene e.g. a sphere, so that the animation can be viewed