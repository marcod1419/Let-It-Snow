function main() {
  // Set the scene size.
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  window.addEventListener("resize", function() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    renderer.setSize(windowWidth, windowHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  var objects = [];
  var lights = [];

  // Get the DOM element to attach to
  const container = document.querySelector("#container");

  // Create a WebGL renderer, camera
  // and a scene
  const renderer = new THREE.WebGLRenderer({antialias: true});

  //Create Scene

  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xb5f1ff);

  //Skybox
  scene.background = new THREE.CubeTextureLoader()
  .setPath("img/skybox/")
  .load(["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"]);

  const camera = new THREE.PerspectiveCamera(
    20,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  camera.position.set(0, 0, 900);
  camera.lookAt(scene.position);
  scene.add(camera);

  //GUI
  var settings = function() {
    this.cameraAutoRotate = true;
    this.cameraAutoRotateSpeed = 0.15;
    this.flashlight = false;
    this.flashlightStrength = 0.8;
    this.pointLights = true;
    this.ambientLight = true;
    this.ambientLightStrength = 0.9;
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
    gui.add(this.settings, "fun");
    render();
    animate();
  };
  //Add Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  var rotateReset;
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.enablePan = false;
  controls.target.set(0, 50, -300);
  controls.enableDamping = true;
  controls.maxPolarAngle = degToRad(90);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.15;
  controls.minDistance = 250;
  controls.maxDistance = 1800;
  controls.addEventListener("change", render);

  // window.addEventListener("mousedown", function(){
  //   clearTimeout(rotateReset);
  //   controls.autoRotate = false;
  //   rotateReset = setTimeout(function(){
  //     controls.autoRotate = true;
  //   }, 5000);
  // });

  // Start the renderer.
  renderer.setSize(windowWidth, windowHeight);

  // Attach the renderer-supplied
  // DOM element.
  container.appendChild(renderer.domElement);

  //Floor
  scene.add(
    createPlane(5000, 5000, 0xffffff, 0, -100, -300, "img/ground_snow.jpg", "img/ground_snow_normal.png")
  );

  //~Body~
  objects.push(
    createSphere(60,50,50,0xffffff,0,-60,-300,"img/ground_snow.jpg", "img/ground_snow_normal.png")
  );
  objects.push(
    createSphere(40,50,50,0xffffff,0,20,-300,"img/ground_snow.jpg", "img/ground_snow_normal.png")
  );
  objects.push(
    createSphere(30,50,50,0xffffff,0,80,-300,"img/ground_snow.jpg", "img/ground_snow_normal.png")
  );

  //~Face~

  //Eyes
  objects.push(
    createSphere(2,50,50,0xffffff,-8,85,-272,"img/rock.png", "img/rock_normal.png")
  );
  objects.push(
    createSphere( 2, 50, 50, 0xffffff, 8, 85, -272, "img/rock.png", "img/rock_normal.png")
  );

  //Nose
  objects.push(
    createCone(3, 20, 32, 32, 0xffffff, 0, 75, -265, 90, 0, 0, "img/carrot.png", "img/carrot_normal.png")
  );

  //Mouth
  objects.push(
    createSphere( 2, 50, 50, 0xffffff, -13, 68, -275, "img/rock.png", "img/rock_normal.png")
  );
  objects.push(
    createSphere( 2, 50, 50, 0xffffff, -8, 65, -275, "img/rock.png", "img/rock_normal.png")
  );
  objects.push(
    createSphere( 2, 50, 50, 0xffffff, -3, 63, -275, "img/rock.png", "img/rock_normal.png")
  );
  objects.push(
    createSphere( 2, 50, 50, 0xffffff, 3, 63, -275, "img/rock.png", "img/rock_normal.png")
  );
  objects.push(
    createSphere(2,50,50,0xffffff,13,68,-275,"img/rock.png","img/rock_normal.png")
  );
  objects.push(
    createSphere(2,50,50,0xffffff,8,65,-275,"img/rock.png","img/rock_normal.png")
  );

  //Text
  var loader = new THREE.FontLoader();
  loader.load("fonts/Heartbeat in Christmas_Regular.json", function(font) {
    var textGeo = new THREE.TextGeometry("Happy Holidays", {
      font: font,
      size: 100,
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
    texture.repeat.set( 0.05, 0.05 );

    var textMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture});
    var textMesh = new THREE.Mesh(textGeo, textMaterial);
    textMesh.position.set(-200, 150, -305);
    scene.add(textMesh);
  });

  for (var i = 0; i < objects.length; i++) {
    scene.add(objects[i]);
  }

  //Lights
  lights.push(createPointLight(-100, 100, -130, 0xff0000, 0.3));
  lights.push(createPointLight(100, 100, -130, 0x00ff00, 0.3));
  lights.push(createPointLight(0, 0, -400, 0x0000ff, 0.5));

  lights.push(setAmbientLight(0xb5f1ff, 0.9));

  var cameraLight = createPointLight(0, 0, 0, 0xffffff, 0.8); //0.8 = on
  camera.add(cameraLight);

  for (var i = 0; i < lights.length; i++) {
    scene.add(lights[i]);
  }


//Snow
var snowGeometry = new THREE.Geometry();
var particleCount = 10000;

for ( var i = 0; i < particleCount; i ++ ) {

	var snow = new THREE.Vector3();
	snow.x = THREE.Math.randFloatSpread( 2000 );
	snow.y = THREE.Math.randFloatSpread( 2000 );
	snow.z = THREE.Math.randFloatSpread( 2000 );

	snow.velocity = new THREE.Vector3(-Math.random(), 0, 0);   

	snowGeometry.vertices.push( snow );

}

var snowMaterial = new THREE.PointsMaterial( {size: 10, color: 0xffffff, map: new THREE.TextureLoader().load("img/snow.png"),  blending: THREE.AdditiveBlending, transparent: true});

var snowFall = new THREE.Points( snowGeometry, snowMaterial );
snowFall.sortParticles = true;


scene.add( snowFall );





  function animate() {
    requestAnimationFrame(animate);

    //Animate Snow
    snowFall.rotation.y += 0.001;
     var pCount = particleCount;
     while (pCount--) {
     	  var particle = snowGeometry.vertices[pCount];
     	   if (particle.x < -200) {
		      particle.x = 200;
		      particle.velocity.x = 0;
		    }
		    particle.velocity.x -= Math.random() * .1;

		    particle.x = particle.velocity.x;
		    particle.y = particle.velocity.y;
		    particle.z = particle.velocity.z;
		  
     }

      snowFall.geometry.__dirtyVertices = true;


    controls.autoRotateSpeed = this.settings.cameraAutoRotateSpeed;
    controls.autoRotate = this.settings.cameraAutoRotate;

    if (this.settings.flashlight) {
      cameraLight.intensity = this.settings.flashlightStrength;
    } else {
      cameraLight.intensity = 0;
    }

    if (this.settings.pointLights) {
      for (var i = 0; i < lights.length; i++) {
        if(lights[i].type !== "AmbientLight"){
          lights[i].visible = true;
        }
      }
    } else {
      for (var i = 0; i < lights.length; i++) {
        if(lights[i].type !== "AmbientLight"){
          lights[i].visible = false;
        }
      }
    }

    if (this.settings.ambientLight) {
      for (var i = 0; i < lights.length; i++) {
        if(lights[i].type === "AmbientLight"){
          lights[i].visible = true;
          lights[i].intensity = this.settings.ambientLightStrength
        }
      }
    } else {
      for (var i = 0; i < lights.length; i++) {
        if(lights[i].type === "AmbientLight"){
          lights[i].visible = false;
          lights[i].intensity = this.settings.ambientLightStrength
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

function createSphere(rad, seg, ring, colour, xPos, yPos, zPos, texturePath, normalMap) {
  const RADIUS = rad;
  const SEGMENTS = seg;
  const RINGS = ring;

  var texture = new THREE.TextureLoader().load(texturePath);
  var normalMap;

  if (normalMap) {
    normalMap = new THREE.TextureLoader().load(normalMap);
  } else {
    normalMap = null;
  }

  const sphereMaterial = new THREE.MeshPhongMaterial({
    color: colour,
    map: texture,
    normalMap: normalMap
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

function createCone(rad, height, rSeg, hSeg, colour, xPos, yPos, zPos, xRot, yRot, zRot, texturePath, normalMap) {
  var geometry = new THREE.ConeGeometry(rad, height, rSeg, hSeg);
  var texture = new THREE.TextureLoader().load(texturePath);
  var normalMap;

  if (normalMap) {
    normalMap = new THREE.TextureLoader().load(normalMap);
  } else {
    normalMap = null;
  }

  var material = new THREE.MeshPhongMaterial({color: colour, map: texture, normalMap: normalMap});

  const cone = new THREE.Mesh(geometry, material);

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

function createPlane(width, height, colour, xPos, yPos, zPos, texturePath, normalMap) {
  var geometry = new THREE.PlaneGeometry(width, height, 32);

  var texture = new THREE.TextureLoader().load(texturePath);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 16, 16 );

  var normalMap;

  if (normalMap) {
    normalMap = new THREE.TextureLoader().load(normalMap);
  } else {
    normalMap = null;
  }

  var material = new THREE.MeshPhongMaterial({
    color: colour,
    side: THREE.DoubleSide,
    map: texture,
    normalMap: normalMap
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

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

main();
