import "./style.css";
import "gsap";
import gsap from "gsap";
import introJs from "intro.js";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let ASPECT = { x: window.innerWidth, y: window.innerHeight };

let scene = new Three.Scene();

let geometry = new Three.SphereGeometry(3, 128, 128);
let material = new Three.MeshStandardMaterial({
  color: "#C9F4AA",
});
let mesh = new Three.Mesh(geometry, material);
scene.add(mesh);

// lighting
const light_amb = new Three.AmbientLight(0x404040, 0.3); // soft white light
// scene.add( light_amb );
let light = new Three.PointLight(0xffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// camera
let camera = new Three.PerspectiveCamera(45, ASPECT.x / ASPECT.y);
camera.position.z = 10;
scene.add(camera);

// canvas
let canvas = document.getElementById("webgl");
let renderer = new Three.WebGLRenderer({ canvas });

renderer.setSize(ASPECT.x, ASPECT.y);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

/* Creating a new instance of the OrbitControls class, which is a class that allows the user to control
the camera with the mouse. */
let controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = 1;

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
  window.requestAnimationFrame(animate);
};

animate(scene, camera);

let rgb = [];
let mouseDown = false;
window.addEventListener("mousedown", () => {
  mouseDown = true;
});
window.addEventListener("mouseup", () => {
  mouseDown = false;
});

window.addEventListener("mousemove", (event) => {
  if (mouseDown) {
    rgb = [
      Math.round((event.pageX / ASPECT.x) * 255),
      Math.round((event.pageY / ASPECT.y) * 255),
      225,
    ];
    let newColor = new Three.Color(`rgb(${rgb.join(",")})`);
    console.log(rgb.join(","));
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

introJs().start().addHints();
