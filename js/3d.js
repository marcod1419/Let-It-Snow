"use strict";

class Snowglobe {
  constructor() {
    this.objects = [];
    this.lights = [];
  }

  init() {
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

    const container = document.querySelector("#container");

    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // shadows LQ: THREE.PCFShadowMap HQ: THREE.PCFSoftShadowMap consider changing shadow res

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xb5f1ff);

    //Skybox
    scene.background = new THREE.CubeTextureLoader()
      .setPath("img/skybox/")
      .load(["wall1.png", "wall1.png", "3.png", "floor.png", "wall1.png", "wall1.png"]);

    const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500000);

    camera.position.set(0, 0, 900);
    camera.lookAt(scene.position);
    scene.add(camera);

    //GUI
    var settings = function() {
      this.cameraAutoRotate = false;
      this.cameraAutoRotateSpeed = 0.15;
      this.flashlight = false;
      this.flashlightStrength = 0.8;
      this.spotLights = true;
      this.roomLight = true;
      this.roomLightStrength = 0.8;
      this.ambientLight = true;
      this.ambientLightStrength = 0.4;
      // this.highQuality = true;
      this.x1 = 16054;
      this.y1 = 10000;
      this.z1 = 0;
      this.x2 = 0;
      this.y2 = 0;
      this.z2 = 0;
      this.snowAmount = 10000;
      this.disableShadows = false;
      this.fun = function() {
        console.log("Disabling Shadows...");
      };
    };

    window.onload = () => {
      this.settings = new settings();
      var gui = new dat.GUI();
      gui.add(this.settings, "cameraAutoRotate");
      gui.add(this.settings, "cameraAutoRotateSpeed", 0.15, 5);
      var flashLight = gui.add(this.settings, "flashlight");
      var flashLightStrength = gui.add(this.settings, "flashlightStrength", 0.1, 2);
      var spotLights = gui.add(this.settings, "spotLights");
      var ambientLight = gui.add(this.settings, "ambientLight");
      var ambientLightStrength = gui.add(this.settings, "ambientLightStrength", 0.1, 2);
      var roomLight = gui.add(this.settings, "roomLight");
      gui.add(this.settings, "roomLightStrength", 0.1, 2);
      var disableShadows = gui.add(this.settings, "disableShadows");
      gui.add(this.settings, "x1", 0, 100000);
      gui.add(this.settings, "y1", 0, 100000);
      gui.add(this.settings, "z1", 0, 100000);
      gui.add(this.settings, "x2", 0, 10000);
      gui.add(this.settings, "y2", 0, 10000);
      gui.add(this.settings, "z2", 0, 10000);

      // gui.add(this.settings, "snowAmount", 0, 10000);
      gui.add(this.settings, "fun");

      spotLights.onChange(() => {
        if (this.settings.spotLights) {
          for (var i = 0; i < this.lights.length; i++) {
            if (this.lights[i].type === "SpotLight" && this.lights[i].name !== "RoomLight") {
              this.lights[i].visible = true;
            }
          }
        } else {
          for (var i = 0; i < this.lights.length; i++) {
            if (this.lights[i].type === "SpotLight" && this.lights[i].name !== "RoomLight") {
              this.lights[i].visible = false;
            }
          }
        }
      });

      roomLight.onChange(() => {
        if (this.settings.roomLight) {
          for (var i = 0; i < this.lights.length; i++) {
            if (this.lights[i].name === "RoomLight") {
              this.lights[i].visible = true;
              this.lights[i].intensity = this.settings.roomLightStrength;
            }
          }
        } else {
          for (var i = 0; i < this.lights.length; i++) {
            if (this.lights[i].name === "RoomLight") {
              this.lights[i].visible = false;
              this.lights[i].intensity = this.settings.roomLightStrength;
            }
          }
        }
      });

      ambientLight.onChange(() => {
        if (this.settings.ambientLight) {
          for (var i = 0; i < this.lights.length; i++) {
            if (this.lights[i].type === "AmbientLight") {
              this.lights[i].visible = true;
            }
          }
        } else {
          for (var i = 0; i < this.lights.length; i++) {
            if (this.lights[i].type === "AmbientLight") {
              this.lights[i].visible = false;
            }
          }
        }
      });

      ambientLightStrength.onChange(() => {
        for (var i = 0; i < this.lights.length; i++) {
          if (this.lights[i].type === "AmbientLight") {
            this.lights[i].intensity = this.settings.ambientLightStrength;
          }
        }
      });

      disableShadows.onChange(() => {
        if (this.settings.disableShadows) {
          for (var i = 0; i < this.lights.length; i++) {
            if (this.lights[i].type !== "AmbientLight") {
              renderer.shadowMap.autoUpdate = false;
              renderer.clearTarget(this.lights[i].shadow.map);
            }
          }
        } else {
          for (var i = 0; i < this.lights.length; i++) {
            if (this.lights[i].type !== "AmbientLight") {
              renderer.shadowMap.autoUpdate = true;
              renderer.clearTarget(this.lights[i].shadow.map);
            }
          }
        }
      });

      flashLight.onChange(() => {
        cameraLight.visible = this.settings.flashlight;
      });

      flashLightStrength.onChange(() => {
        cameraLight.intensity = this.settings.flashlightStrength;
      });

      render();
      animate();
    };
    //Add Controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    var rotateReset;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.5;
    controls.enablePan = false;
    controls.target.set(0, 50, -300);
    controls.enableDamping = true;
    controls.maxPolarAngle = this.degToRad(90);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.15;
    controls.minDistance = 250;
    controls.maxDistance = 30000;
    controls.addEventListener("change", () => {
      render();
    });

    //Initialize renderer
    renderer.setSize(windowWidth, windowHeight);
    container.appendChild(renderer.domElement);

    //Floor
    this.addToScene(this.createCirclePlane(1500, 1500, 0xffffff, 0, -100, 0, "img/ground_snow.jpg", "img/ground_snow_normal.png"));

    //Table
    this.addToScene(this.createBox(50000, 800, 20000, 0xffffff, "img/desk.jpg", "img/desk_normal.png", 100, -15000, -695, -300));

    //Base
    this.addToScene(this.createGlobeBase(1500, 200, 0x845100, null, null, 0, -201, 0));

    //Glass
    this.addToScene(
      this.createSphere(1500, 1500, 50, 0xffffff, 0, -100, 0, null, null, "img/glass_alpha.png", scene.background, 0.95, false, false, true)
    );

    //~Body~
    this.addToScene(this.createSphere(60, 50, 16, 0xffffff, 0, -60, -300, "img/ground_snow.jpg", "img/ground_snow_normal.png"));
    this.addToScene(this.createSphere(40, 50, 16, 0xffffff, 0, 20, -300, "img/ground_snow.jpg", "img/ground_snow_normal.png"));
    this.addToScene(this.createSphere(30, 50, 16, 0xffffff, 0, 80, -300, "img/ground_snow.jpg", "img/ground_snow_normal.png"));

    //~Face~

    //Eyes
    this.addToScene(this.createSphere(2, 50, 8, 0xffffff, -8, 85, -272, "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(2, 50, 8, 0xffffff, 8, 85, -272, "img/rock.png", "img/rock_normal.png"));

    //Nose
    this.addToScene(this.createCone(3, 20, 32, 32, 0xffffff, 0, 75, -265, 90, 0, 0, "img/carrot.png", "img/carrot_normal.png", true, false));

    //Mouth
    this.addToScene(this.createSphere(2, 50, 8, 0xffffff, -13, 68, -275, "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(2, 50, 8, 0xffffff, -8, 65, -275, "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(2, 50, 8, 0xffffff, -3, 63, -275, "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(2, 50, 8, 0xffffff, 3, 63, -275, "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(2, 50, 8, 0xffffff, 13, 68, -275, "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(2, 50, 8, 0xffffff, 8, 65, -275, "img/rock.png", "img/rock_normal.png"));

    //Trees
    const treeCount = 0;
    var treePos = this.randomNumberArray(-1000, 1000, -1000, 1200, -400, 400, -700, 900, treeCount, 20); //TODO: Make sure trees dont go out back
    for (var i = 0; i < treeCount; i++) {
      this.addToScene(this.createTree(30, 220, treePos[0][i], 0, treePos[1][i]));
    }

    //Campfire
    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath("models/male02/");
    mtlLoader.load("male02.mtl", function(materials) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath("models/male02/");
      objLoader.load(
        // resource URL
        "male02.obj",
        // called when resource is loaded
        function(object) {
          object.position.y = -100;
          scene.add(object);
        },
        // called when loading is in progresses
        function(xhr) {
          console.log(xhr.loaded / xhr.total * 100 + "% loaded");
        },
        // called when loading has errors
        function(error) {
          console.log("An error happened");
        }
      );
    });

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

    for (var i = 0; i < this.objects.length; i++) {
      scene.add(this.objects[i]);
    }

    //Lights
    this.lights.push(this.createSpotLight(0xff0000, 0.3, 1000, 50, 1, 0.5, 20, -126, -354, 293, 223, -5, 256, 256));
    this.lights.push(this.createSpotLight(0x00ff00, 0.3, 1000, 50, 1, 0.5, -20, -126, -354, -293, 223, -5, 256, 256));
    this.lights.push(this.createSpotLight(0x0000ff, 0.3, 1000, 50, 1, 0.5, 0, 0, -340, -35, 314, -521, 256, 256));
    // scene.add(new THREE.SpotLightHelper(this.lights[1]));

    this.lights.push(this.createSpotLight(0xffc53f, 0.8, 1000000, 50, 1, 0, 0, 0, 0, 6300, 11719, 9551, 4096, 4096, "RoomLight"));

    this.lights.push(this.setAmbientLight(0xb5f1ff, 0.4));

    var cameraLight = this.createPointLight(0xffffff, 0.8, 0, 0, 0);
    cameraLight.visible = false;
    camera.add(cameraLight);

    for (var i = 0; i < this.lights.length; i++) {
      scene.add(this.lights[i]);
    }

    //Snow
    var snowGeometry = new THREE.Geometry();
    var particleCount = 5000;

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
        if (particle.y < -200) {
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

    var animate = () => {
      requestAnimationFrame(animate);
      snowFall.geometry.verticesNeedUpdate = true;

      for (var i = 0; i < this.lights.length; i++) {
        if (this.lights[i].type === "SpotLight") {
          this.lights[i].target.updateMatrixWorld();
        }
      }

      // lights[3].position.x = this.settings.x1;
      // lights[3].position.y = this.settings.y1;
      // lights[3].position.z = this.settings.z1;
      // lights[3].target.position.x = this.settings.x2;
      // lights[3].target.position.y = this.settings.y2;
      // lights[3].target.position.z = this.settings.z2;

      controls.autoRotateSpeed = this.settings.cameraAutoRotateSpeed;
      controls.autoRotate = this.settings.cameraAutoRotate;

      controls.update();

      render();
    };

    var render = () => {
      renderer.render(scene, camera);
    };
  }

  createSphere(rad, seg, ring, colour, xPos, yPos, zPos, texturePath, normalMap, alphaMap, envMap, refractionRatio, depthWrite = true, wireframeEnabled = false, isGlobeGlass = false) {
    const RADIUS = rad;
    const SEGMENTS = seg;
    const RINGS = ring;

    var sphereMaterial = new THREE.MeshPhongMaterial({});

    if (colour != null) {
      sphereMaterial.color = new THREE.Color(colour);
    }

    if (texturePath != null) {
      var texture = new THREE.TextureLoader().load(texturePath);
      sphereMaterial.map = texture;
    }

    if (normalMap != null) {
      sphereMaterial.normalMap = new THREE.TextureLoader().load(normalMap);
    }

    if (alphaMap != null) {
      sphereMaterial.transparent = true;
      sphereMaterial.alphaMap = new THREE.TextureLoader().load(alphaMap);
    }

    if (envMap != null) {
      sphereMaterial.envMap = envMap;
    }

    if (refractionRatio != null) {
      sphereMaterial.refractionRatio = refractionRatio;
    }

    sphereMaterial.depthWrite = depthWrite;
    sphereMaterial.wireframe = wireframeEnabled;

    var sphere;
    if (isGlobeGlass) {
      sphere = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS, 0, Math.PI * 2, this.degToRad(0), this.degToRad(90)), sphereMaterial);
    } else {
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

    sphere.castShadow = true;
    sphere.receiveShadow = false;

    return sphere;
  }

  createCone(rad, height, rSeg, hSeg, colour, xPos, yPos, zPos, xRot, yRot, zRot, texturePath, normalMap, castShadow=true, receiveShadow=true) {
    var geometry = new THREE.ConeGeometry(rad, height, rSeg, hSeg);

    var coneMaterial = new THREE.MeshPhongMaterial({});

    if (colour != null) {
      coneMaterial.color = new THREE.Color(colour);
    }

    if (texturePath != null) {
      var texture = new THREE.TextureLoader().load(texturePath);
      coneMaterial.map = texture;
    }

    if (normalMap != null) {
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
      cone.rotation.x = this.degToRad(xRot);
    }

    if (yRot) {
      cone.rotation.y = this.degToRad(yRot);
    }

    if (zRot) {
      cone.rotation.z = this.degToRad(zRot);
    }

    cone.castShadow = castShadow;
    cone.receiveShadow = receiveShadow;

    return cone;
  }

  createBox(width, height, depth, colour, texturePath, normalMap, shininess, xPos, yPos, zPos) {
    var geometry = new THREE.CubeGeometry(width, height, depth);

    var boxMaterial = new THREE.MeshPhongMaterial({});
    boxMaterial.shininess = shininess;

    if (colour != null) {
      boxMaterial.color = new THREE.Color(colour);
    }

    if (texturePath != null) {
      var texture = new THREE.TextureLoader().load(texturePath);
      boxMaterial.map = texture;
    }

    if (normalMap != null) {
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
    box.castShadow = true;
    box.receiveShadow = true;

    return box;
  }

  createPlane(width, height, colour, xPos, yPos, zPos, texturePath, normalMap) {
    var geometry = new THREE.PlaneGeometry(width, height, 32);

    var planeMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide});

    if (colour != null) {
      planeMaterial.color = new THREE.Color(colour);
    }

    if (texturePath != null) {
      var texture = new THREE.TextureLoader().load(texturePath);
      planeMaterial.map = texture;
    }

    if (normalMap != null) {
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

    plane.receiveShadow = true;

    return plane;
  }

  createCirclePlane(rad, seg, colour, xPos, yPos, zPos, texturePath, normalMap) {
    var geometry = new THREE.CircleGeometry(rad, seg, 16); //TODO: Add sides param to function

    var circlePlaneMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide});

    if (colour != null) {
      circlePlaneMaterial.color = new THREE.Color(colour);
    }

    if (texturePath != null) {
      var texture = new THREE.TextureLoader().load(texturePath);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(16, 16);
      circlePlaneMaterial.map = texture;
    }

    if (normalMap != null) {
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

    circlePlane.castShadow = false;
    circlePlane.receiveShadow = true;
    return circlePlane;
  }

  createCylinder(radTop, radBottom, height, colour, texturePath, normalMap, xPos, yPos, zPos) {
    var cylinderGeo = new THREE.CylinderGeometry(radTop, radBottom, height, 16, 16); //TODO: Add sides param to function

    var cylinderMaterial = new THREE.MeshPhongMaterial({});

    if (colour != null) {
      cylinderMaterial.color = new THREE.Color(colour);
    }

    if (texturePath != null) {
      var texture = new THREE.TextureLoader().load(texturePath);
      cylinderMaterial.map = texture;
    }

    if (normalMap != null) {
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

    cylinder.castShadow = true;
    cylinder.receiveShadow = true;

    return cylinder;
  }

  createTree(width, height, xPos, yPos, zPos) {
    var tree = [];

    tree.push(this.createCylinder(width, width, height, 0x593c2f, "img/trunk.jpg", "img/trunk_normal.png", xPos, yPos, zPos));
    tree.push(
      this.createCone(width * 4, height / 2, 32, 32, 0x00ff00, xPos, yPos + height / 1.5, zPos, 0, 0, 0, "img/tree.jpg", "img/tree_normal.png", true, true)
    );
    tree.push(
      this.createCone(width * 4.5, height / 2, 32, 32, 0x00ff00, xPos, yPos + height / 1.2, zPos, 0, 0, 0, "img/tree.jpg", "img/tree_normal.png", true, true)
    );
    // tree.push(this.createCone(width*5, height/2, 32, 32, 0x00ff00, xPos, yPos+height/1, zPos, 0, 0, 0, "", "")); Art stuff, let's deal with it later.

    return tree;
  }

  createGlobeBase(width, height, colour, texturePath, normalMap, xPos, yPos, zPos) {
    var cylinderGeo = new THREE.CylinderGeometry(width, width, height, 50, 50);

    var cylinderMaterial = new THREE.MeshPhongMaterial({});

    if (colour != null) {
      cylinderMaterial.color = new THREE.Color(colour);
    }

    if (texturePath != null) {
      var texture = new THREE.TextureLoader().load(texturePath);
      cylinderMaterial.map = texture;
    }

    if (normalMap != null) {
      cylinderMaterial.normalMap = new THREE.TextureLoader().load(normalMap);
    }

    var hiddenMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0});

    var baseMaterials = [cylinderMaterial, hiddenMaterial, hiddenMaterial];

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

    cylinder.castShadow = true;
    cylinder.receiveShadow = true;

    return cylinder;
  }

  createPointLight(colour, str, xPos, yPos, zPos) {
    var pointLight = new THREE.PointLight(colour, str);

    if (xPos && yPos && zPos) {
      pointLight.target.position.set(xPos, yPos, zPos);
    }

    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 256;
    pointLight.shadow.mapSize.height = 256;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 5000;

    return pointLight;
  }

  createSpotLight(colour, str, distance, angle, blur, decay, xPos, yPos, zPos, xRot, yRot, zRot, shadowW, shadowH, name = "") {
    var spotLight = new THREE.SpotLight(colour, str, distance, this.degToRad(angle), blur, decay);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = shadowW;
    spotLight.shadow.mapSize.height = shadowH;
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 5000;

    if (xPos && yPos && zPos) {
      spotLight.target.position.set(xPos, yPos, zPos);
    }
    if (xRot && yRot && zRot) {
      spotLight.position.set(xRot, yRot, zRot);
    }

    spotLight.name = name;

    return spotLight;
  }

  createDirectionalLight(colour, str, xPos, yPos, zPos, xRot, yRot, zRot) {
    var directionalLight = new THREE.DirectionalLight(colour, str);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 256;
    directionalLight.shadow.mapSize.height = 256;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 5000;

    if (xPos && yPos && zPos) {
      directionalLight.target.position.set(xPos, yPos, zPos);
    }

    if (xRot && yRot && zRot) {
      directionalLight.position.set(xRot, yRot, zRot);
    }

    return directionalLight;
  }

  setAmbientLight(colour, str) {
    return new THREE.AmbientLight(colour, str);
  }

  degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  addToScene(obj) {
    if (obj.constructor === Array) {
      for (var i = 0; i < obj.length; i++) {
        this.objects.push(obj[i]);
      }
    } else {
      this.objects.push(obj);
    }
  }

  randomNumber(min, max, spacing = 0, rollNegative) {
    var num = Math.floor(Math.random() * (max - min)) + min + spacing;
    if (rollNegative) {
      num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    }

    return num;
  }

  randomNumberArray(minX, maxX, minZ, maxZ, xLimitMin, xLimitMax, zLimitMin, zLimitMax, amount, spacing) {
    var pos = [[], []];
    var xPos;
    var zPos;

    for (var i = 0; i < amount; i++) {
      xPos = this.randomNumber(minX, maxX, spacing, true);
      zPos = this.randomNumber(minZ, maxZ, spacing, true);

      if (xPos >= xLimitMin && xPos <= xLimitMax) {
        while (zPos >= zLimitMin && zPos <= zLimitMax) {
          zPos = this.randomNumber(minZ, maxZ, spacing, true);
        }
      }
      pos[0].push(xPos);
      pos[1].push(zPos);
    }

    return pos;
  }
}

var snowglobe = new Snowglobe();
snowglobe.init();
