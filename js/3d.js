"use strict";
function main() {
  // Set the scene size.
  const WIDTH = 1280;
  const HEIGHT = 720;

  var objects = [];
  var lights = [];

  // Get the DOM element to attach to
  const container = document.querySelector("#container");

  // Create a WebGL renderer, camera
  // and a scene
  const renderer = new THREE.WebGLRenderer({antialias: true});

  const camera = new THREE.PerspectiveCamera(
    20,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 500;

  //Add Controls
  const controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.keys = [65, 83, 68];

  controls.addEventListener("change", render);

  //Create Scene

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb5f1ff);

  // Add the camera to the scene.
  scene.add(camera);

  // Start the renderer.
  renderer.setSize(WIDTH, HEIGHT);

  // Attach the renderer-supplied
  // DOM element.
  container.appendChild(renderer.domElement);

  //Floor
  scene.add(createPlane(500, 500, 0xffffff, 0, -100, -300));

  //~Body~
  objects.push(createSphere(60, 50, 50, 0xffffff, 0, -60, -300));
  objects.push(createSphere(40, 50, 50, 0xffffff, 0, 20, -300));
  objects.push(createSphere(30, 50, 50, 0xffffff, 0, 80, -300));

  //~Face~

  //Eyes
  objects.push(createSphere(2, 50, 50, 0x000000, -8, 85, -272));
  objects.push(createSphere(2, 50, 50, 0x000000, 8, 85, -272));

  //Nose

  //Mouth
  objects.push(createSphere(2, 50, 50, 0x000000, -13, 68, -275));
  objects.push(createSphere(2, 50, 50, 0x000000, -8, 65, -275));
  objects.push(createSphere(2, 50, 50, 0x000000, -3, 63, -275));
  objects.push(createSphere(2, 50, 50, 0x000000, 3, 63, -275));
  objects.push(createSphere(2, 50, 50, 0x000000, 13, 68, -275));
  objects.push(createSphere(2, 50, 50, 0x000000, 8, 65, -275));

  for (var i = 0; i < objects.length; i++) {
    scene.add(objects[i]);
  }

  //Lights
  // lights.push(createPointLight(0, 100, 130, 0xffffff, 0.8, 0));
  lights.push(createPointLight(-100, -100, -130, 0xff0000, 0.3, 0));
  lights.push(createPointLight(100, 100, -130, 0x00ff00, 0.3, 0));
  lights.push(setAmbientLight(0xb5f1ff, 0.9));

  for (var i = 0; i < lights.length; i++) {
    scene.add(lights[i]);
  }

  //Particles
  // create the particle variables
  var particleCount = 1800,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 15,
      map: new THREE.TextureLoader().load("img/snow.png"),
      blending: THREE.AdditiveBlending,
      transparent: true
    });

  // now create the individual particles
  for (var p = 0; p < particleCount; p++) {
    // create a particle with random
    // position values, -250 -> 250
    var pX = Math.random() * 500 - 250,
      pY = Math.random() * 500 - 250,
      pZ = Math.random() * 500 - 250,
      particle = new THREE.Vector3(pX, pY, pZ);

    // create a velocity vector
    particle.velocity = new THREE.Vector3(
      0, // x
      -Math.random(), // y: random vel
      0
    );
    // add it to the geometry
    particles.vertices.push(particle);
  }

  // create the particle system
  var particleSystem = new THREE.Points(particles, pMaterial);

  particleSystem.sortParticles = true;
  particleSystem.position.z = -300;

  // add it to the scene
  scene.add(particleSystem);

  render();
  animate();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
  }

  function render() {
    renderer.render(scene, camera);
  }
}

function createSphere(rad, seg, ring, colour, xPos, yPos, zPos) {
  const RADIUS = rad;
  const SEGMENTS = seg;
  const RINGS = ring;

  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: colour
  });

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS),
    sphereMaterial
  );

  if (xPos) {
    sphere.position.x = xPos;
  }

  if (yPos) {
    sphere.position.y = yPos;
  }

  if (zPos) {
    sphere.position.z = zPos;
  }

  return sphere;
}

function createPointLight(xPos, yPos, zPos, colour, str, dist) {
  const pointLight = new THREE.PointLight(colour, str, dist);

  pointLight.position.x = xPos;
  pointLight.position.y = yPos;
  pointLight.position.z = zPos;

  return pointLight;
}

function setAmbientLight(colour, str) {
  return new THREE.AmbientLight(colour, str);
}

function createPlane(width, height, colour, xPos, yPos, zPos) {
  var geometry = new THREE.PlaneGeometry(width, height, 32);
  var material = new THREE.MeshLambertMaterial({
    color: colour,
    side: THREE.DoubleSide
  });
  var plane = new THREE.Mesh(geometry, material);
  plane.rotateX(-Math.PI / 2);
  if (xPos) {
    plane.position.x = xPos;
  }

  if (yPos) {
    plane.position.y = yPos;
  }

  if (zPos) {
    plane.position.z = zPos;
  }
  return plane;
}

main();
