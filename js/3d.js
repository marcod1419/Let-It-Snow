function main() {
  //Scene size
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  window.addEventListener("resize", function() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    renderer.setSize(windowWidth, windowHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  this.objects = [];
  this.lights = [];

  const container = document.querySelector("#container");

  const renderer = new THREE.WebGLRenderer({antialias: true});

  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xb5f1ff);

  //Skybox
  scene.background = new THREE.CubeTextureLoader().setPath("img/skybox/").load(["wall1.png", "wall1.png", "3.png", "floor.png", "wall1.png", "wall1.png"]);

  const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 50000);

  camera.position.set(0, 0, 900);
  camera.lookAt(scene.position);
  scene.add(camera);

  //GUI
  var settings = function() {
    this.cameraAutoRotate = false;
    this.cameraAutoRotateSpeed = 0.15;
    this.flashlight = false;
    this.flashlightStrength = 0.8;
    this.pointLights = true;
    this.ambientLight = true;
    this.ambientLightStrength = 0.9;
    // this.snowAmount = 10000;
    this.fun = function() {
      console.log("BOOM!");
    };
  };

  window.onload = function() {
    this.settings = new settings();
    var gui = new dat.GUI();
    gui.add(this.settings, "cameraAutoRotate");
    gui.add(this.settings, "cameraAutoRotateSpeed", 0.15, 5);
    gui.add(this.settings, "flashlight");
    gui.add(this.settings, "flashlightStrength", 0.1, 2);
    gui.add(this.settings, "pointLights");
    gui.add(this.settings, "ambientLight");
    gui.add(this.settings, "ambientLightStrength", 0.1, 2);
    // gui.add(this.settings, "snowAmount", 0, 10000);
    gui.add(this.settings, "fun");
    render();
    animate();
  };
  //Add Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  var rotateReset;
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.5;
  controls.enablePan = false;
  controls.target.set(0, 50, -300);
  controls.enableDamping = true;
  controls.maxPolarAngle = degToRad(90);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.15;
  controls.minDistance = 250;
  controls.maxDistance = 30000;
  controls.addEventListener("change", render);

  //Initialize renderer
  renderer.setSize(windowWidth, windowHeight);
  container.appendChild(renderer.domElement);

  //Floor
  addToScene(createCirclePlane(1500, 1500, 0xffffff, 0, -100, 0, "img/ground_snow.jpg", "img/ground_snow_normal.png"));

  //Base
  addToScene(createGlobeBase(1500, 200, 0x845100, null, null, 0, -201, 0));

  //Glass
  addToScene(createSphere(1500, 1500, 50, 0xffffff, 0, -100, 0, null, null, "img/glass_alpha.png", scene.background, 0.95, false, false, true));

  //~Body~
  addToScene(createSphere(60, 50, 50, 0xffffff, 0, -60, -300, "img/ground_snow.jpg", "img/ground_snow_normal.png"));
  addToScene(createSphere(40, 50, 50, 0xffffff, 0, 20, -300, "img/ground_snow.jpg", "img/ground_snow_normal.png"));
  addToScene(createSphere(30, 50, 50, 0xffffff, 0, 80, -300, "img/ground_snow.jpg", "img/ground_snow_normal.png"));

  //~Face~

  //Eyes
  addToScene(createSphere(2, 50, 50, 0xffffff, -8, 85, -272, "img/rock.png", "img/rock_normal.png"));
  addToScene(createSphere(2, 50, 50, 0xffffff, 8, 85, -272, "img/rock.png", "img/rock_normal.png"));

  //Nose
  addToScene(createCone(3, 20, 32, 32, 0xffffff, 0, 75, -265, 90, 0, 0, "img/carrot.png", "img/carrot_normal.png"));

  //Mouth
  addToScene(createSphere(2, 50, 50, 0xffffff, -13, 68, -275, "img/rock.png", "img/rock_normal.png"));
  addToScene(createSphere(2, 50, 50, 0xffffff, -8, 65, -275, "img/rock.png", "img/rock_normal.png"));
  addToScene(createSphere(2, 50, 50, 0xffffff, -3, 63, -275, "img/rock.png", "img/rock_normal.png"));
  addToScene(createSphere(2, 50, 50, 0xffffff, 3, 63, -275, "img/rock.png", "img/rock_normal.png"));
  addToScene(createSphere(2, 50, 50, 0xffffff, 13, 68, -275, "img/rock.png", "img/rock_normal.png"));
  addToScene(createSphere(2, 50, 50, 0xffffff, 8, 65, -275, "img/rock.png", "img/rock_normal.png"));

  //Trees
  const treeCount = 30;
  var treePos = randomNumberArray(-1000, 1000, -1000, 1200, -400, 400, -700, 900, treeCount, 20); //TODO: Make sure trees dont go out back
  for (var i = 0; i < treeCount; i++){
  	addToScene(createTree(30, 220, treePos[0][i] , 0, treePos[1][i]));
  }

  //Text
  var loader = new THREE.FontLoader();
  loader.load("fonts/Heartbeat_in_Christmas_Regular.json", function(font) {
    var textGeo = new THREE.TextGeometry("Happy Holidays", {
      font: font,
      size: 400,
      height: 10,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 10,
      bevelSize: 1,
      bevelSegments: 5
    });

    var texture = new THREE.TextureLoader().load("img/candycane.png");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.05, 0.05);

    var textMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture});
    var textMesh = new THREE.Mesh(textGeo, textMaterial);
    textMesh.position.set(-900, 700, -305);
    scene.add(textMesh);
  });

  for (var i = 0; i < objects.length; i++) {
    scene.add(objects[i]);
  }

  //Lights
  this.lights.push(createPointLight(-100, 100, -130, 0xff0000, 0.3));
  this.lights.push(createPointLight(100, 100, -130, 0x00ff00, 0.3));
  this.lights.push(createPointLight(0, 0, -400, 0x0000ff, 0.5));

  this.lights.push(setAmbientLight(0xb5f1ff, 0.9));

  var cameraLight = createPointLight(0, 0, 0, 0xffffff, 0.8);
  camera.add(cameraLight);

  for (var i = 0; i < this.lights.length; i++) {
    scene.add(this.lights[i]);
  }

  //Snow
  var snowGeometry = new THREE.Geometry();
  var particleCount = 10000;

  for (var i = 0; i < particleCount; i++) {
    var snow = new THREE.Vector3();

    var distance = 1400;
    var theta = THREE.Math.randFloatSpread(360);
    var phi = THREE.Math.randFloatSpread(360);

    snow.x = distance * Math.sin(theta) * Math.cos(phi);
    snow.y = distance * Math.sin(theta) * Math.sin(phi);
    snow.z = distance * Math.cos(theta);

    snow.velocity = new THREE.Vector3(0, -Math.random(), 0);

    snowGeometry.vertices.push(snow);
  }

  var snowMaterial = new THREE.PointsMaterial({
    size: 10,
    color: 0xffffff,
    map: new THREE.TextureLoader().load("img/snow.png"),
    blending: THREE.AdditiveBlending,
    transparent: true
  });

  var snowFall = new THREE.Points(snowGeometry, snowMaterial);
  snowFall.sortParticles = true;

  scene.add(snowFall);

  //Physics
  var particles = setInterval(function() {
    //Animate Snow
    var pCount = particleCount;
    while (pCount--) {
      var particle = snowGeometry.vertices[pCount];
      if (particle.y < -50) {
        theta = THREE.Math.randFloatSpread(360);
        phi = THREE.Math.randFloatSpread(360);
        particle.x = distance * Math.sin(theta) * Math.cos(phi);
        particle.y = distance * Math.sin(theta) * Math.sin(phi);
        particle.z = distance * Math.cos(theta);
        particle.velocity.y = -0.8;
      }
      particle.velocity.y -= 0.01;

      particle.add(particle.velocity);
    }
  }, 1000 / 60);

  function animate() {
    requestAnimationFrame(animate);

    snowFall.geometry.verticesNeedUpdate = true;

    controls.autoRotateSpeed = this.settings.cameraAutoRotateSpeed;
    controls.autoRotate = this.settings.cameraAutoRotate;

    if (this.settings.flashlight) {
      cameraLight.intensity = this.settings.flashlightStrength;
    } else {
      cameraLight.intensity = 0;
    }

    if (this.settings.pointLights) {
      for (var i = 0; i < this.lights.length; i++) {
        if (this.lights[i].type !== "AmbientLight") {
          this.lights[i].visible = true;
        }
      }
    } else {
      for (var i = 0; i < this.lights.length; i++) {
        if (this.lights[i].type !== "AmbientLight") {
          this.lights[i].visible = false;
        }
      }
    }

    if (this.settings.ambientLight) {
      for (var i = 0; i < this.lights.length; i++) {
        if (this.lights[i].type === "AmbientLight") {
          this.lights[i].visible = true;
          this.lights[i].intensity = this.settings.ambientLightStrength;
        }
      }
    } else {
      for (var i = 0; i < this.lights.length; i++) {
        if (this.lights[i].type === "AmbientLight") {
          this.lights[i].visible = false;
          this.lights[i].intensity = this.settings.ambientLightStrength;
        }
      }
    }

    controls.update();

    render();
  }

  function render() {
    renderer.render(scene, camera);
  }
}

function createSphere(rad, seg, ring, colour, xPos, yPos, zPos, texturePath, normalMap, alphaMap, envMap, refractionRatio, depthWrite=true, wireframeEnabled=false, isGlobeGlass=false) {
  const RADIUS = rad;
  const SEGMENTS = seg;
  const RINGS = ring;

  var sphereMaterial = new THREE.MeshPhongMaterial({});

  if(colour != null){
    sphereMaterial.color = new THREE.Color(colour);
  }

  if(texturePath != null){
    var texture = new THREE.TextureLoader().load(texturePath);
    sphereMaterial.map = texture;
  }

  if(normalMap != null){
    sphereMaterial.normalMap = new THREE.TextureLoader().load(normalMap);
  }

  if(alphaMap != null){
    sphereMaterial.transparent = true;
    sphereMaterial.alphaMap = new THREE.TextureLoader().load(alphaMap);
  }

  if(envMap != null){
    sphereMaterial.envMap = envMap;
  }

  if(refractionRatio != null){
    sphereMaterial.refractionRatio = refractionRatio;
  }

  sphereMaterial.depthWrite = depthWrite;
  sphereMaterial.wireframe = wireframeEnabled;

  var sphere;
  if(isGlobeGlass){
    sphere = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS, 0, Math.PI*2,degToRad(0),degToRad(90)), sphereMaterial);
  }
  else{
    sphere = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS), sphereMaterial);
  }

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

function createCone(rad, height, rSeg, hSeg, colour, xPos, yPos, zPos, xRot, yRot, zRot, texturePath, normalMap) {
  var geometry = new THREE.ConeGeometry(rad, height, rSeg, hSeg);

  var coneMaterial = new THREE.MeshPhongMaterial({});

  if(colour != null){
    coneMaterial.color = new THREE.Color(colour);
  }

  if(texturePath != null){
    var texture = new THREE.TextureLoader().load(texturePath);
    coneMaterial.map = texture;
  }

  if(normalMap != null){
    coneMaterial.normalMap = new THREE.TextureLoader().load(normalMap);
  }

  const cone = new THREE.Mesh(geometry, coneMaterial);

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

  return cone;
}

function createBox(width, height, depth, colour, texturePath, normalMap, xPos, yPos, zPos){
  var geometry = new THREE.CubeGeometry(width, height, depth);

  var boxMaterial = new THREE.MeshPhongMaterial({});

  if(colour != null){
    boxMaterial.color = new THREE.Color(colour);
  }

  if(texturePath != null){
    var texture = new THREE.TextureLoader().load(texturePath);
    boxMaterial.map = texture;
  }

  if(normalMap != null){
    boxMaterial.normalMap = new THREE.TextureLoader().load(normalMap);
  }

  var box = new THREE.Mesh(geometry, boxMaterial);
  if (xPos) {
    box.position.x = xPos;
  }

  if (yPos) {
    box.position.y = yPos;
  }

  if (zPos) {
    box.position.z = zPos;
  }
  return box;
}

function createPlane(width, height, colour, xPos, yPos, zPos, texturePath, normalMap) {
  var geometry = new THREE.PlaneGeometry(width, height, 32);

  var planeMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide});

  if(colour != null){
    planeMaterial.color = new THREE.Color(colour);
  }

  if(texturePath != null){
    var texture = new THREE.TextureLoader().load(texturePath);
    planeMaterial.map = texture;
  }

  if(normalMap != null){
    planeMaterial.normalMap = new THREE.TextureLoader().load(normalMap);
  }

  var plane = new THREE.Mesh(geometry, planeMaterial);
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

function createCirclePlane(rad, seg, colour, xPos, yPos, zPos, texturePath, normalMap) {
  var geometry = new THREE.CircleGeometry(rad, seg, 32);

 
  var circlePlaneMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide});

  if(colour != null){
    circlePlaneMaterial.color = new THREE.Color(colour);
  }

  if(texturePath != null){
     var texture = new THREE.TextureLoader().load(texturePath);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(16, 16);
    circlePlaneMaterial.map = texture;
  }

  if(normalMap != null){
    circlePlaneMaterial.normalMap = new THREE.TextureLoader().load(normalMap);
  }

  var circlePlane = new THREE.Mesh(geometry, circlePlaneMaterial);

  circlePlane.rotateX(-Math.PI / 2);
  if (xPos) {
    circlePlane.position.x = xPos;
  }

  if (yPos) {
    circlePlane.position.y = yPos;
  }

  if (zPos) {
    circlePlane.position.z = zPos;
  }
  return circlePlane;
}

function createCylinder(radTop, radBottom, height, colour, texturePath, normalMap, xPos, yPos, zPos){
	var cylinderGeo = new THREE.CylinderGeometry(radTop, radBottom, height, 50, 50);

  var cylinderMaterial = new THREE.MeshPhongMaterial({});

  if(colour != null){
    cylinderMaterial.color = new THREE.Color(colour);
  }

  if(texturePath != null){
    var texture = new THREE.TextureLoader().load(texturePath);
    cylinderMaterial.map = texture;
  }

  if(normalMap != null){
    cylinderMaterial.normalMap = new THREE.TextureLoader().load(normalMap);
  }


	var cylinder = new THREE.Mesh(cylinderGeo, cylinderMaterial);

	if (xPos) {
    	cylinder.position.x = xPos;
	}

	if (yPos) {
	    cylinder.position.y = yPos;
	}

	if (zPos) {
	    cylinder.position.z = zPos;
	 }

	 return cylinder;
}

function createTree(width, height, xPos, yPos, zPos) {
	var tree = [];

	tree.push(createCylinder(width, width, height, 0x593c2f, "img/trunk.jpg", "img/trunk_normal.png", xPos, yPos, zPos));
	tree.push(createCone(width*4, height/2, 32, 32, 0x00ff00, xPos, yPos+height/1.5, zPos, 0, 0, 0, "img/tree.jpg", "img/tree_normal.png"));
	tree.push(createCone(width*4.5, height/2, 32, 32, 0x00ff00, xPos, yPos+height/1.2, zPos, 0, 0, 0, "img/tree.jpg", "img/tree_normal.png"));
	// tree.push(createCone(width*5, height/2, 32, 32, 0x00ff00, xPos, yPos+height/1, zPos, 0, 0, 0, "", "")); Art stuff, let's deal with it later.

	return tree;
}

function createGlobeBase(width, height, colour, texturePath, normalMap, xPos, yPos, zPos){
  var cylinderGeo = new THREE.CylinderGeometry(width, width, height, 50, 50);

  var cylinderMaterial = new THREE.MeshPhongMaterial({});

  if(colour != null){
    cylinderMaterial.color = new THREE.Color(colour);
  }

  if(texturePath != null){
    var texture = new THREE.TextureLoader().load(texturePath);
    cylinderMaterial.map = texture;
  }

  if(normalMap != null){
    cylinderMaterial.normalMap = new THREE.TextureLoader().load(normalMap);
  }

  var hiddenMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0});

  var baseMaterials = [cylinderMaterial, hiddenMaterial, cylinderMaterial];


  var cylinder = new THREE.Mesh(cylinderGeo, baseMaterials);

  if (xPos) {
      cylinder.position.x = xPos;
  }

  if (yPos) {
      cylinder.position.y = yPos;
  }

  if (zPos) {
      cylinder.position.z = zPos;
   }

   return cylinder;
}


function createPointLight(xPos, yPos, zPos, colour, str) {
  const pointLight = new THREE.PointLight(colour, str);

  pointLight.position.x = xPos;
  pointLight.position.y = yPos;
  pointLight.position.z = zPos;

  return pointLight;
}

function createSpotLight(xPos, yPos, zPos, colour, str) {
  const spotLight = new THREE.SpotLight(colour, str);

  spotLight.position.x = xPos;
  spotLight.position.y = yPos;
  spotLight.position.z = zPos;

  return spotLight;
}

function setAmbientLight(colour, str) {
  return new THREE.AmbientLight(colour, str);
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

function addToScene(obj){
  if(obj.constructor === Array){
    for (var i = 0; i < obj.length; i++){
      this.objects.push(obj[i]);
    }
  }
  else{
    this.objects.push(obj);
  }
}

function randomNumber(min, max, spacing=0, rollNegative){
	var num = Math.floor(Math.random() * (max-min)) + min + spacing;
  if(rollNegative){
    num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  } 

	return num;
}

function randomNumberArray(minX, maxX, minZ, maxZ, xLimitMin, xLimitMax, zLimitMin, zLimitMax, amount, spacing){
	var pos = [[],[]];


	for (var i = 0; i < amount; i++){
		xPos = randomNumber(minX,maxX, spacing, true);
		zPos = randomNumber(minZ,maxZ, spacing, true);

		if (xPos >= xLimitMin && xPos <= xLimitMax){
			while (zPos >= zLimitMin && zPos <= zLimitMax){
				zPos = randomNumber(minZ,maxZ, spacing, true);
			}
		}
		pos[0].push(xPos);
		pos[1].push(zPos);

	}

	return pos;
}

main();
