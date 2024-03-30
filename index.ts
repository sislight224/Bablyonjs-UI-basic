import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Quaternion, ActionManager, ExecuteCodeAction, Mesh, TransformNode, Animation, Plane } from 'babylonjs';
import 'babylonjs-loaders';

const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Couldn't find a canvas. Aborting the demo")

const engine = new Engine(canvas, true, {});
const scene = new Scene(engine);

let selectedMesh: Mesh | null = null;
let cylinderParams = { diameter: 1, height: 2, tessellation: 24 };
let icoSphereParams = { diameter: 1, subdivisions: 4 };


function prepareScene() {
	// Camera
	const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 4, new Vector3(0, 0, 0), scene);
	camera.attachControl(canvas, true);

	// Light
	new HemisphericLight("light", new Vector3(0.5, 1, 0.8).normalize(), scene);

	// Objects
	const plane = MeshBuilder.CreateBox("Plane", {}, scene);
	plane.rotationQuaternion = Quaternion.FromEulerAngles(0, Math.PI, 0);

	const icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", {}, scene);
	icosphere.position.set(-2, 0, 0);

	const cylinder = MeshBuilder.CreateCylinder("Cylinder", {}, scene);
	cylinder.position.set(2, 0, 0);

	// Handle Selection Event
	plane.actionManager = new ActionManager(scene);
	plane.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
		selectMesh(plane);
	}));

	icosphere.actionManager = new ActionManager(scene);
	icosphere.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
		selectMesh(icosphere);
	}));

	cylinder.actionManager = new ActionManager(scene);
	cylinder.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
		selectMesh(cylinder);
	}));
}

function selectMesh(mesh: Mesh) {

	selectedMesh = mesh;

	const meshControls = document.getElementById('meshControls');
	const cubeControls = document.getElementById('cubeControls');
	const cylinderControls = document.getElementById('cylinderControls');
	const icosphereControls = document.getElementById('icosphereControls');
	
	
	if(meshControls != null) {
		meshControls.style.display = 'block';
	}
    // Hide all controls initially
    if(!!cubeControls && !!cylinderControls && !! icosphereControls) {
		cubeControls.style.display = 'none';
		cylinderControls.style.display = 'none';
		icosphereControls.style.display = 'none';

		console.log(mesh.name)

		const duration = 24;   //24 frame every second
		// Show and update controls based on the selected mesh
		if (mesh.name === "Plane") { // Assuming 'Plane' refers to the cube
			cubeControls.style.display = 'block';
			// Update slider values here based on the mesh's current properties
			applyBouncing(mesh, 1, duration);
		}

		if(mesh.name === "Cylinder") {
			cylinderControls.style.display = 'block';
			applyBouncing(mesh, 1, duration);
		}
		
		if(mesh.name === "IcoSphere") {
			icosphereControls.style.display = 'block';
			applyBouncing(mesh, 1, duration);
		}

		// Repeat for other meshes

	}


}

function applyBouncing(node: TransformNode, amplitude: number, duration: number) {
    // Create an animation for the Y position
    let bounceAnimation = new Animation("bounce", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    // Define keyframes
    let keyFrames = []; 

    keyFrames.push({
        frame: 0,
        value: node.position.y
    });

    keyFrames.push({
        frame: duration / 2,
        value: node.position.y + amplitude
    });

    keyFrames.push({
        frame: duration,
        value: node.position.y
    });

    bounceAnimation.setKeys(keyFrames);

    // Apply the animation to the node
    node.animations = [];
    node.animations.push(bounceAnimation);
    scene.beginAnimation(node, 0, duration, false);
}

function initParameter() {
	const cubeWidth = document.getElementById("cubeWidth");
	const cubeHeight = document.getElementById("cubeHeight");
	const cubeDepth = document.getElementById("cubeDepth");

	const cylinderDiameter = document.getElementById("cylinderDiameter");
	const cylinderHeight = document.getElementById("cylinderHeight");

	const icosphereDiameter = document.getElementById("icosphereDiameter");
	const icosphereSubdivisions = document.getElementById("icosphereSubdivisions");

	if(!cubeWidth || !cubeHeight || !cubeDepth || !cylinderDiameter || !cylinderHeight || !icosphereDiameter || !icosphereSubdivisions) return;

	cubeWidth.addEventListener("input", function(event: any) {
		if (selectedMesh && selectedMesh.name === "Plane") { // Assuming 'Plane' is the name of your cube
			let newSize = parseFloat(event.target.value);
			selectedMesh.scaling.x = newSize;
		}
	});
	cubeHeight.addEventListener("input", function(event: any) {
		if (selectedMesh && selectedMesh.name === "Plane") {
			let newSize = parseFloat(event.target.value);
			selectedMesh.scaling.y = newSize;
		}
	});
	cubeDepth.addEventListener("input", function(event: any) {
		if (selectedMesh && selectedMesh.name === "Plane") {
			let newSize = parseFloat(event.target.value);
			selectedMesh.scaling.z = newSize;
		}
	});

	cylinderDiameter.addEventListener("input", function(event: any) {
		if (selectedMesh && selectedMesh.name === "Cylinder") { // Assuming 'Plane' is the name of your cube
			let newSize = parseFloat(event.target.value);
			recreateMesh({diameter: newSize})
		}
	});
	cylinderHeight.addEventListener("input", function(event: any) {
		if (selectedMesh && selectedMesh.name === "Cylinder") {
			let newSize = parseFloat(event.target.value);
			recreateMesh({height: newSize})
		}
	});
	
	icosphereDiameter.addEventListener("input", function(event: any) {
		if (selectedMesh && selectedMesh.name === "IcoSphere") { // Assuming 'Plane' is the name of your cube
			let newSize = parseFloat(event.target.value);
			recreateMesh({radius: newSize})
		}
	});
	icosphereSubdivisions.addEventListener("input", function(event: any) {
		if (selectedMesh && selectedMesh.name === "IcoSphere") {
			let newSize = parseFloat(event.target.value);
			recreateMesh({subdivisions: newSize})
		}
	});
}

function recreateMesh(newParams: Object) {
    if (selectedMesh && selectedMesh.name === "Cylinder") {
        let oldMesh = selectedMesh;
        cylinderParams = { ...cylinderParams, ...newParams }; // Update global parameters
        selectedMesh = MeshBuilder.CreateCylinder("Cylinder", cylinderParams, scene);
        selectedMesh.position = oldMesh.position.clone(); // Preserve the position
        oldMesh.dispose(); // Remove the old mesh
    }

    if (selectedMesh && selectedMesh.name === "IcoSphere") {
        let oldMesh = selectedMesh;
        icoSphereParams = { ...icoSphereParams, ...newParams }; // Update global parameters
        selectedMesh = MeshBuilder.CreateIcoSphere("IcoSphere", icoSphereParams, scene);
        selectedMesh.position = oldMesh.position.clone(); // Preserve the position
        oldMesh.dispose(); // Remove the old mesh
    }
}


prepareScene();
initParameter();

engine.runRenderLoop(() => {
	scene.render();
});

window.addEventListener("resize", () => {
	engine.resize();
})