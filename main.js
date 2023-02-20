import "./style.css";
import "gsap";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ASPECT = { x: window.innerWidth, y: window.innerHeight };

const MIN_CULLING_DIST = 0.01;

const EARTH_RADIUS = 3.6;
const EARTH_POSITION = [-0.2, 0, 0];
const EARTH_RESOLUTION = [128, 128];

const IS_ZOOMING = false;
const IS_PANNING = false;

const LIGHT_INTENSITY = 4;

const scene = new Three.Scene();

const textureLoader = new Three.TextureLoader();
const earthColorMap = textureLoader.load("./textures/earth3.jpg");
const earthNormalMap = textureLoader.load("./textures/earth_normal.tif");
const earthSpecMap = textureLoader.load("./textures/earth_spec.tif");
const cloudColorMap = textureLoader.load("./textures/earth_clouds.jpg");

const sphereGeometry = new Three.SphereGeometry(
  EARTH_RADIUS,
  ...EARTH_RESOLUTION
);
const sphereMaterial = new Three.MeshStandardMaterial({
  fog: true,
  roughness: 1,
  map: earthColorMap,
  // aoMap: earthSpecMap
  // normalMap: earthNormalMap,
  // normalMapType: Three.ObjectSpaceNormalMap
});
const mesh = new Three.Mesh(sphereGeometry, sphereMaterial);
mesh.position.set(...EARTH_POSITION);
scene.add(mesh);

const cloudsGeometry = new Three.SphereGeometry(
  EARTH_RADIUS + MIN_CULLING_DIST,
  ...EARTH_RESOLUTION
);
const cloudsMaterial = new Three.MeshStandardMaterial({
  roughness: 1,
  transparent: true,
  alphaMap: cloudColorMap,
});
const cloudMesh = new Three.Mesh(cloudsGeometry, cloudsMaterial);
cloudMesh.position.set(...EARTH_POSITION);
scene.add(cloudMesh);

/* LIGHTING */
// let hemiLight = new Three.HemisphereLight(0xffeeb1, 0x080820, 4);
// scene.add(hemiLight);

let spotLight = new Three.SpotLight(0xffeeb1, LIGHT_INTENSITY);
let light = new Three.PointLight(0xffff, 10, 10);
light.position.set(10, 10, 10);
scene.add(spotLight, light);

// camera
let camera = new Three.PerspectiveCamera(45, ASPECT.x / ASPECT.y);
camera.position.z = 12;
scene.add(camera);

// canvas
let canvas = document.getElementById("webgl");
let renderer = new Three.WebGLRenderer({ canvas });
renderer.toneMapping = Three.ReinhardToneMapping;
renderer.toneMappingExposure = 2.5;
renderer.setSize(ASPECT.x, ASPECT.y);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

/* Creating a new instance of the OrbitControls class, which is a class that allows the user to control
the camera with the mouse. */
let controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = IS_PANNING;
controls.enableZoom = IS_ZOOMING;
controls.autoRotate = 20;

/* updating the aspect ratio of the camera when the window is resized. */
window.addEventListener("resize", () => {
  ASPECT.x = window.innerWidth;
  ASPECT.y = window.innerHeight;
  camera.aspect = ASPECT.x / ASPECT.y;
  camera.updateProjectionMatrix();
  renderer.setSize(ASPECT.x, ASPECT.y);
});

const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  const SPOTLIGHT_OFFSET = 5;
  spotLight.position.set(
    camera.position.x + SPOTLIGHT_OFFSET,
    camera.position.y + SPOTLIGHT_OFFSET,
    camera.position.z + SPOTLIGHT_OFFSET
  );
  window.requestAnimationFrame(animate);
};

animate();
