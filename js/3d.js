"use strict";
function main() {
  // Set the scene size.
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  window.addEventListener("resize", function(){
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    renderer.setSize(windowWidth, windowHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  })

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
  renderer.setSize(windowWidth, windowHeight);

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
  objects.push(createCone(3, 20, 32, 32, 0xf48342, 0, 75, -265, 90, 0, 0));

  //Mouth
  objects.push(createSphere(2, 50, 50, 0x000000, -13, 68, -275));
  objects.push(createSphere(2, 50, 50, 0x000000, -8, 65, -275));
  objects.push(createSphere(2, 50, 50, 0x000000, -3, 63, -275));
  objects.push(createSphere(2, 50, 50, 0x000000, 3, 63, -275));
  objects.push(createSphere(2, 50, 50, 0x000000, 13, 68, -275));
  objects.push(createSphere(2, 50, 50, 0x000000, 8, 65, -275));

  //Text
  var loader = new THREE.FontLoader();
  loader.load('fonts/Miraculous&Christmas_Regular.json', function ( font ) {
      var geometry = new THREE.TextGeometry( 'Hello three.js!', {
      font: font,
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelSegments: 5
    } );
  } );

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

function createCone(rad, height, rSeg, hSeg, colour, xPos, yPos, zPos, xRot, yRot, zRot){
  var geometry = new THREE.ConeGeometry(rad, height, rSeg, hSeg);
  var material = new THREE.MeshLambertMaterial( {color: colour} );

  const cone = new THREE.Mesh( geometry, material );

  if (xPos) {
    cone.position.x = xPos;
  }

  if (yPos) {
    cone.position.y = yPos;
  }

  if (zPos) {
    cone.position.z = zPos;
  }

  if (xRot) {
    cone.rotation.x = degToRad(xRot);
  }

  if (yRot) {
    cone.rotation.y = degToRad(yRot);
  }

  if (zRot) {
    cone.rotation.z = degToRad(zRot);
  }

  return cone

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

function degToRad(deg){
  return deg*(Math.PI/180);
}

main();
