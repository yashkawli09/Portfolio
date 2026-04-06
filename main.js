// ==========================
// IMPORTS (MUST BE FIRST)
// ==========================

import * as THREE from "three";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

// ==========================
// GSAP ANIMATIONS
// ==========================

gsap.registerPlugin(ScrollTrigger);

// Hero animations
gsap.from("#title", {
  opacity: 0,
  y: 50,
  duration: 1.5,
  ease: "power3.out"
});

gsap.from("#subtitle", {
  opacity: 0,
  y: 30,
  delay: 0.5,
  duration: 1.2,
  ease: "power3.out"
});

gsap.from("#scrollBtn", {
  opacity: 0,
  delay: 1,
  duration: 1
});

// Showcase animations
gsap.from("#showcase h2", {
  scrollTrigger: {
    trigger: "#showcase",
    start: "top 80%"
  },
  y: 100,
  opacity: 0,
  duration: 1.5
});

gsap.from("#showcase .group", {
  scrollTrigger: {
    trigger: "#showcase",
    start: "top 70%"
  },
  y: 150,
  opacity: 0,
  duration: 1.5,
  stagger: 0.3
});

// ==========================
// TOGGLE SECTION
// ==========================

let activeSection = null;

document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", function () {

    const id = this.dataset.section;
    const container = document.getElementById("expandedContainer");
    const sections = document.querySelectorAll(".hidden-content");

    sections.forEach(sec => sec.classList.add("hidden"));

    if (activeSection === id) {
      container.classList.remove("expanded");
      container.classList.add("collapsed");
      activeSection = null;
      return;
    }

    document.getElementById(id).classList.remove("hidden");

    container.classList.remove("collapsed");
    container.classList.add("expanded");

    activeSection = id;
  });
});

// ==========================
// THREE JS - 3DS MAX CARD
// ==========================

const threeContainer = document.getElementById("three-container");

if (threeContainer) {

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    threeContainer.clientWidth / threeContainer.clientHeight,
    0.1,
    1000
  );

  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0); // transparent background
  threeContainer.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Load GLB
  const loader = new GLTFLoader();
  let model;

  loader.load("models/main.glb", (gltf) => {

    model = gltf.scene;

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center model
    model.position.sub(center);

    // Auto scale
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.5 / maxDim;
    model.scale.setScalar(scale);

    scene.add(model);

    console.log("Model Loaded Successfully");

  }, undefined, (error) => {
    console.error("GLB Load Error:", error);
  });

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    if (model) {
      model.rotation.y += 0.01;
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // Resize handling
  window.addEventListener("resize", () => {
    camera.aspect = threeContainer.clientWidth / threeContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
  });
}