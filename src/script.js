import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import generatePoints from "./generatePoints";
import moveLights from "./moveLights";

/**
 * Debug
 */
// const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded"
};

const audio = new Audio("/Positive-Hip-Hop.mp3");

// gui.addColor(parameters, "materialColor").onChange(() => {
//   material.color.set(parameters.materialColor);
//   particlesMaterial.color.set(parameters.materialColor);
// });

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Disco
 */

const loadingManager = new THREE.LoadingManager(() => {
  gsap.delayedCall(0.5, () => {
    gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 });
  });
  // window.setTimeout(() => {
  // }, 500);
});
const gltfLoader = new GLTFLoader(loadingManager);

let disco;
let discoHasLoaded;

gltfLoader.load("/models/disco.glb", (file) => {
  disco = file.scene;
  disco.traverse((child) => {
    if (child.receiveShadow) {
      child.receiveShadow = true;
    }
    if (child.type == "SkinnedMesh") {
      child.frustumCulled = false;
    }
  });
  disco.rotateY(Math.PI * 1.5);
  disco.position.x = -1;
  disco.position.y = -0.5;
  disco.position.z = 4;

  // const folder = gui.addFolder("DISCO");
  // folder.add(disco.position, "x", -10, 10, 0.5);
  // folder.add(disco.position, "y", -10, 10, 0.5);
  // folder.add(disco.position, "z", -10, 10, 0.5);
  // folder.add(disco.rotation, "y", -10, 10, Math.PI / 2);
  scene.add(disco);
});

const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: {
    uAlpha: {
      value: 1
    }
  },
  vertexShader: `
    void main() {
        gl_Position =  vec4(position, 1.0);
    }`,
  fragmentShader: `
  uniform float uAlpha;
    void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
    }
    `
});

const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

/**
 *
 * Confetti
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

const createRandomRGBColor = () => {
  var red = getRandomInt(0, 257);
  var green = getRandomInt(0, 257);
  var blue = getRandomInt(0, 257);
  return { red, green, blue };
};

const count = 1000;
const positions = new Float32Array(count * 3);
const objectsDistance = 4;

for (let i = 0; i < count; i++) {
  let i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 8;
  positions[i3 + 1] = Math.random() * 0.5 * 8;
  positions[i3 + 2] = (Math.random() - 0.5) * 4;
}

// const particlesGeometry = new THREE.BufferGeometry();
// console.log(particlesGeometry);
// particlesGeometry.setAttribute(
//   "position",
//   new THREE.BufferAttribute(positions, 3)
// );

const shinyMaterial = new THREE.MeshStandardMaterial({
  color: "red"
});

// const particleMaterial = new THREE.PointsMaterial({
//   vertexColors: THREE.VertexColors,
//   sizeAttenuation: true,
//   size: 0.03
// });

// const particles = new THREE.Points(particlesGeometry, particleMaterial);

/**
 * Models
 */

let animationMixer;
let modelHasLoaded;

let model;

const animations = {};

const playAnimation = (name) => {
  const newAction = animations[name];
  const oldAction = animations.current;
  if (newAction !== oldAction) {
    newAction.reset();
    newAction.play();
    newAction.crossFadeFrom(oldAction, 1);
    animations.current = newAction;
  }
};

gltfLoader.load("/models/girl.glb", (file) => {
  model = file.scene;
  animationMixer = new THREE.AnimationMixer(model);

  model.traverse((child) => {
    if (child.castShadow) {
      child.castShadow = true;
    }
    if (child.type == "SkinnedMesh") {
      child.castShadow = true;
      child.frustumCulled = false;
      child.material.roughnessMap = null;
      child.material.metalness = 0;
      child.material.roughness = 1;
    }
  });
  scene.add(model);
  gltfLoader.load("/models/idle.glb", (file) => {
    animations.idle = animationMixer.clipAction(file.animations[0]);
    animations.current = animations.idle;
    animations.idle.play();

    gltfLoader.load("/models/stretch.glb", (file) => {
      animations.stretch = animationMixer.clipAction(file.animations[0]);
      animations.stretch.timeScale = 1.5;
      gltfLoader.load("/models/tut_dance.glb", (file) => {
        animations.dance = animationMixer.clipAction(file.animations[0]);
        // animations.dance.play();
        modelHasLoaded = true;
      });
    });
  });
});
// /**
//  * Lights
//  */
// const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
// directionalLight.castShadow = true;
// directionalLight.position.set(-1.5, 2, 5.5);
// // scene.add(directionalLight);

// const lightsFolder = gui.addFolder("LIGHTS");
// lightsFolder.add(directionalLight.position, "x", -10, 10, 0.5);
// lightsFolder.add(directionalLight.position, "y", -10, 10, 0.5);
// lightsFolder.add(directionalLight.position, "z", -10, 10, 0.5);

const ambientLight = new THREE.AmbientLight("#F9CCCA", 0.4);
scene.add(ambientLight);
// const ambientLightFolder = gui.addFolder("ambientLight!");

// ambientLightFolder.add(ambientLight.position, "x", -50, 50, 1);
// ambientLightFolder.add(ambientLight.position, "y", -50, 50, 1);
// ambientLightFolder.add(ambientLight.position, "z", -50, 50, 1);

// ambientLightFolder.add(ambientLight, "intensity", 0, 1, 0.1);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0);
directionalLight.position.set(-1, 1, 6);
scene.add(directionalLight);
// const directionalLightFolder = gui.addFolder("Directional!");
directionalLight.target.position.set(-1, 1, 0);
scene.add(directionalLight.target);

// directionalLightFolder.add(directionalLight.position, "x", -50, 50, 1);
// directionalLightFolder.add(directionalLight.position, "y", -50, 50, 1);
// directionalLightFolder.add(directionalLight.position, "z", -50, 50, 1);

// directionalLightFolder.add(directionalLight, "intensity", 0, 1, 0.1);

// Spotlight

const spotlightIntensity = 0.4;
const spotlightAngle = Math.PI * 0.04;

const spotLight = new THREE.SpotLight(
  0xffffff,
  spotlightIntensity,
  10,
  spotlightAngle,
  0.25,
  0
);
spotLight.position.set(0, 7, 3);

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 10;
spotLight.shadow.camera.fov = 30;

const spotLight1 = new THREE.SpotLight(
  0xffffff,
  spotlightIntensity,
  10,
  spotlightAngle,
  0.25,
  0
);
spotLight1.position.set(-3, 7, 0);

spotLight1.castShadow = true;

spotLight1.shadow.mapSize.width = 1024;
spotLight1.shadow.mapSize.height = 1024;

spotLight1.shadow.camera.near = 1;
spotLight1.shadow.camera.far = 10;
spotLight1.shadow.camera.fov = 30;

const spotLight2 = new THREE.SpotLight(
  0xffffff,
  spotlightIntensity,
  10,
  spotlightAngle,
  0.25,
  0
);
spotLight2.position.set(-2, 7, 3);

spotLight2.castShadow = true;

spotLight2.shadow.mapSize.width = 1024;
spotLight2.shadow.mapSize.height = 1024;

spotLight2.shadow.camera.near = 1;
spotLight2.shadow.camera.far = 10;
spotLight2.shadow.camera.fov = 30;

// const spotLightFolder = gui.addFolder("SPOTLIGHT!");

// spotLightFolder.add(spotLight.position, "x", -50, 50, 1);
// spotLightFolder.add(spotLight.position, "y", -50, 50, 1);
// spotLightFolder.add(spotLight.position, "z", -50, 50, 1);

// spotLightFolder.add(spotLight, "intensity", 0, 1, 0.1);
// spotLightFolder.add(spotLight, "distance", -50, 50, 1);
// spotLightFolder.add(spotLight, "angle", 0, Math.PI * 0.2, Math.PI * 0.01);
// spotLightFolder.add(spotLight, "penumbra", 0, 1, 0.1);
// spotLightFolder.add(spotLight, "decay", 0, 1, 0.1);

// const spotLightTargetFolder = gui.addFolder("spotLightTargetFolder!");
// spotLightTargetFolder.add(spotLight.target.position, "y").step(0.05);

spotLight.target.position.y = 0.4;
spotLight1.target.position.y = 0.4;
spotLight2.target.position.y = 0.4;

// spotLight1.target.position.set(-1, 0.4, 0);
// spotLight2.target.position.set(-2, 0.4, 0);
const helper = new THREE.SpotLightHelper(spotLight);
// scene.add(helper);
scene.add(spotLight);
scene.add(spotLight.target);
scene.add(spotLight1);
scene.add(spotLight1.target);
scene.add(spotLight2);
scene.add(spotLight2.target);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pageHeight: document.body.scrollHeight - window.innerHeight
};

let hasLoaded = false;

window.onload = () => {
  hasLoaded = true;
  sizes.pageHeight = document.body.scrollHeight - window.innerHeight;
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
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
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);

const initialZoom = 2;
camera.position.set(0, 0, 0);

cameraGroup.position.x = 0;
cameraGroup.position.y = 0.97;
cameraGroup.position.z = 0.54;
camera.zoom = initialZoom;
camera.updateProjectionMatrix();

// const folder = gui.addFolder("CAMERA");
// folder.add(cameraGroup.position, "x").step(0.05);
// folder.add(cameraGroup.position, "y").step(0.05);
// folder.add(cameraGroup.position, "z").step(0.01);
// folder
//   .add(camera, "zoom")
//   .step(0.1)
//   .onChange(() => {
//     camera.updateProjectionMatrix();
//   });

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const sectionNumber = Math.round(scrollY / sizes.height);
});

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Crazy Array
 */

const distanceChange = 0.05;
const distanceChangeX = 0.06;

const cameraCoordinateArray = generatePoints(
  camera.position,
  distanceChange,
  initialZoom
);

const focusPoint = new THREE.Vector3(0.01, 0.95, 0);

// const focusFolder = gui.addFolder("FOCUs");
// focusFolder.add(focusPoint, "x", -10, 10, 0.01);
// focusFolder.add(focusPoint, "y", -10, 10, 0.01);
// focusFolder.add(focusPoint, "z", -10, 10, 0.01);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // objects distance becomes something arbitrary like cameraTravelDistance
  if (hasLoaded && modelHasLoaded) {
    const percentageTraversed = Math.abs(
      Math.round((scrollY / sizes.pageHeight) * 100)
    );

    const sectionNumber = Math.round(scrollY / sizes.height);

    switch (sectionNumber) {
      case 0:
        audio.pause();
        playAnimation("idle");
        break;
      case 1:
        audio.play();
        playAnimation("stretch");
        break;
      case 2:
        audio.play();
        playAnimation("dance");
        break;
    }

    const { position, target, zoom, spotLightAngle } =
      cameraCoordinateArray[percentageTraversed];

    gsap.to(camera.position, {
      duration: 0.1,
      x: position.x,
      y: position.y,
      z: position.z
    });

    if (percentageTraversed > 70) {
      directionalLight.intensity = 0.3;
    } else if (percentageTraversed > 75) {
      directionalLight.intensity = 0.4;
    } else if (percentageTraversed > 80) {
      directionalLight.intensity = 0.4;
    } else if (percentageTraversed > 85) {
      directionalLight.intensity = 0.8;
    } else {
      directionalLight.intensity = 0;
    }

    camera.zoom = zoom;
    if (sectionNumber === 2) {
      // do some fun sttuff
      spotLight.color.set("red");
      spotLight1.color.set("blue");
      spotLight.intensity = 1;
      spotLight1.intensity = 1;
      spotLight2.color.set("green");
      spotLight2.intensity = 1;
      moveLights(spotLight.target, elapsedTime, 1);
      moveLights(spotLight1.target, elapsedTime, 0.5);
      // moveLights(spotLight2.target, elapsedTime, 1);
    }
    if (
      sectionNumber !== 2 &&
      !isInPosition(spotLight.target) &&
      !isInPosition(spotLight1.target)
    ) {
      gsap.to(spotLight.target.position, { x: 0, z: 0, y: 0.4, duration: 0.5 });
      gsap.to(spotLight1.target.position, {
        x: 0,
        z: 0,
        y: 0.4,
        duration: 0.5
      });
      gsap.to(spotLight2.target.position, {
        x: 0,
        z: 0,
        y: 0.4,
        duration: 0.5
      });
      spotLight.color.set("white");
      spotLight1.color.set("white");
      spotLight.intensity = 0.4;
      spotLight1.intensity = 0.4;
      spotLight2.color.set("white");
      spotLight2.intensity = 0.4;
    }
    // spotLight.angle = spotLightAngle;

    camera.updateProjectionMatrix();
    animationMixer.update(deltaTime);
    camera.lookAt(new THREE.Vector3(target.x, target.y, target.z));
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

const isInPosition = (target) => {
  return (
    target.position.x === 0 &&
    target.position.y === 0.4 &&
    target.position.z === 0
  );
};

tick();
