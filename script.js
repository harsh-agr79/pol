import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js";

const gui = new dat.GUI();

const loader = new THREE.TextureLoader();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.BoxBufferGeometry(10, 10, 0.2);

// Materials

// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0xff0000)

const material = new THREE.MeshStandardMaterial({
  color: "white",
  // map: texture,
  // displacementMap: height,
  displacementScale: 0.6,
  // alphaMap: alpha,
  // transparent: true,
  // depthTest: false
});

let light = new THREE.DirectionalLight(0x99ffff, 1.0);
light.position.set(0, 100, 0);
light.target.position.set(0, 0, 0);
light.castShadow = true;
scene.add(light);

let light2 = new THREE.DirectionalLight(0xffff, 1.0);
light2.position.set(-100, 0, 0);
// light2.rotation.set(Math.PI / 2, Math.PI / 2, 0);
light2.target.position.set(0, 0, 0);
light2.castShadow = true;
scene.add(light2);

// Mesh
const plane = new THREE.Mesh(geometry, material);
const plane2 = new THREE.Mesh(geometry, material);
scene.add(plane2);
scene.add(plane);

plane2.position.x = 5;
plane2.position.z = 0;
plane2.position.y = 5;
plane.rotation.set(Math.PI / 2, 0, 0);
plane2.rotation.set(Math.PI / 2, Math.PI / 2, 0);
plane.castShadow = false;
plane.receiveShadow = true;
plane2.castShadow = false;
plane2.receiveShadow = true;
// gui.add(plane.rotation, 'x', 0,4,0.001)

const cgeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 32);
const cmaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cylinder = new THREE.Mesh(cgeometry, cmaterial);
cylinder.position.y = 3;
cylinder.castShadow = true;
cylinder.receiveShadow = false;
var degrees = {
  x: 0,
  y: 0,
  z: 0,
};

gui
  .add(degrees, "x")
  .name("Inc To Hori")
  .min(0)
  .max(90)
  .step(1)
  // This function is called each time the value is changed
  .onChange(() => {
    console.log(degrees.x);

    // Convert the degrees to radians, then assign to mesh rotation
    cylinder.rotation.x = THREE.MathUtils.degToRad(90-degrees.x);
  });
gui
  .add(degrees, "z")
  .name("Inc To Vert")
  .min(0)
  .max(90)
  .step(1)
  // This function is called each time the value is changed
  .onChange(() => {
    // Convert the degrees to radians, then assign to mesh rotation
    cylinder.rotation.z = THREE.MathUtils.degToRad(degrees.z-180);
  });
// gui.add(cylinder.position, "y", 0,10,0.01);
scene.add(cylinder);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth * 0.7;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = -12;
camera.position.y = 3;
camera.position.z = 7;
// camera.rotation.set(0, -Math.PI / 2, 0);
// scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true
// controls.keys = {
// 	LEFT: 'ArrowLeft', //left arrow
// 	UP: 'ArrowUp', // up arrow
// 	RIGHT: 'ArrowRight', // right arrow
// 	BOTTOM: 'ArrowDown' // down arrow
// }
gui.add(camera.position, "y", 0, 10, 0.001).name("Camera Y-co");
gui.add(camera.position, "x", -20, 20, 0.001).name("Camera X-co");
var obj = {
  fv: function () {
    camera.position.set(-5, 2, 0);
    camera.rotation.set(0, -Math.PI / 2, 0);
  },
};

gui.add(obj, "fv").name("Front View");

var obj2 = {
  tv: function () {
    camera.position.set(0, 10, 0);
    camera.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
  },
};

gui.add(obj2, "tv").name("TOP View");
controls.update();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

document.addEventListener("mousemove", animateheight);

let mouseY = 0;

function animateheight(event) {
  mouseY = event.clientY;
}

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // plane.rotation.z = .5 * elapsedTime
  // plane.material.displacementScale = .3 + mouseY * 0.0008

  // Update Orbital Controls
  // controls.update()
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();