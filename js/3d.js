"use strict";

class Snowglobe {
  constructor() {
    this.objects = [];
    this.lights = [];

    this.cameraAutoRotate = false;
  }

  init() {
    const windowWidth = 800;
    const windowHeight = 450;

    const container = document.querySelector("#container");

    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var scene = new THREE.Scene();

    //Skybox
    scene.background = new THREE.CubeTextureLoader()
      .setPath("img/skybox/")
      .load(["wallBigDark.jpg", "wallBigDarkRight.jpg", "ceiling.jpg", "floor.jpg", "wallBigDarkBack.jpg", "wallBigDarkForward.jpg"]);

    var camera = new THREE.PerspectiveCamera(20, windowWidth / windowHeight, 1, 500000);
    camera.position.set(0, 0, 3000);
    scene.add(camera);

    window.onload = () => {
      var loading = document.getElementById("loading-screen");

      //Disable shadows by default
      for (var i = 0; i < this.lights.length; i++) {
        if (this.lights[i].type !== "AmbientLight") {
          renderer.shadowMap.autoUpdate = false;
          renderer.clearTarget(this.lights[i].shadow.map);
        }
      }

      TweenMax.to(loading, 0.5, {autoAlpha: 0});

      document.getElementById("envelope").addEventListener("click",
      () => {
        this.animatePage();
      },
      {once: true});

      document.getElementById("rotate").addEventListener("change", () => {
        this.cameraAutoRotate = document.getElementById("rotate").checked;
      });

      document.getElementById("shadows").addEventListener("change", () => {
        for (var i = 0; i < this.lights.length; i++) {
          if (this.lights[i].type !== "AmbientLight") {
            renderer.shadowMap.autoUpdate = document.getElementById("shadows").checked;
            renderer.clearTarget(this.lights[i].shadow.map);
          }
        }
      });

      document.getElementById("ambient-light").addEventListener("change", () => {
        for (var i = 0; i < this.lights.length; i++) {
          if (this.lights[i].type === "AmbientLight") {
            this.lights[i].visible = document.getElementById("ambient-light").checked;
          }
        }
      });

      document.getElementById("room-light").addEventListener("change", () => {
        for (var i = 0; i < this.lights.length; i++) {
          if (this.lights[i].name === "RoomLight") {
            this.lights[i].visible = document.getElementById("room-light").checked;
          }
        }
      });

      document.getElementById("spot-lights").addEventListener("change", () => {
        for (var i = 0; i < this.lights.length; i++) {
          if (this.lights[i].type === "SpotLight" && this.lights[i].name !== "RoomLight") {
            this.lights[i].visible = document.getElementById("spot-lights").checked;
          }
        }
      });

      document.getElementById("music").addEventListener("change", () => {
        if (document.getElementById("music").checked) {
          document.getElementById("bgm").play();
        } else {
          document.getElementById("bgm").pause();
        }
      });

      for (var i = 0; i < this.objects.length; i++) {
        scene.add(this.objects[i]);
      }

      render();
      animate();
    };
    //Add Controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.5;
    controls.enablePan = false;
    controls.target.set(0, 225, 0);
    controls.enableDamping = true;
    controls.maxPolarAngle = this.degToRad(90);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.05;
    controls.minDistance = 250;
    controls.maxDistance = 8000;
    controls.addEventListener("change", () => {
      render();
    });

    //Initialize renderer
    renderer.setSize(windowWidth, windowHeight);
    container.appendChild(renderer.domElement);

    //Table
    this.addToScene(this.createBox(20000, 800, 10000, 0xffffff, "img/desk.jpg", "img/desk_normal.png", 100, [-5000, -695, -300]));

    //Base
    this.addToScene(this.createGlobeBase(900, 200, 0xffffff, "img/globe_base.png", "img/globe_base_normal.png", [0, -201, 0], 0xffffff, "img/ground_snow.jpg", "img/ground_snow_normal.png"));

    //Glass
    this.addToScene(this.createSphere(900, 900, 50, 0xffffff, [0, -102, 0], null, null, 0.2, scene.background, 0.95, false, false, true));

    //~Body~
    this.addToScene(this.createSphere(120, 50, 16, 0xffffff, [0, -40, 0], "img/ground_snow.jpg", "img/ground_snow_normal.png"));
    this.addToScene(this.createSphere(80, 50, 16, 0xffffff, [0, 110, 0], "img/ground_snow.jpg", "img/ground_snow_normal.png"));
    this.addToScene(this.createSphere(60, 50, 16, 0xffffff, [0, 220, 0], "img/ground_snow.jpg", "img/ground_snow_normal.png"));

    //~Face~

    //Eyes
    this.addToScene(this.createSphere(4, 50, 8, 0xffffff, [-16, 240, 54], "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(4, 50, 8, 0xffffff, [16, 240, 54], "img/rock.png", "img/rock_normal.png"));

    //Nose
    this.addToScene(this.createCone(5, 25, 32, 32, 0xffffff, [0, 224, 68], [90, 0, 0], "img/carrot.png", "img/carrot_normal.png", true, false));

    //Mouth
    this.addToScene(this.createSphere(4, 50, 8, 0xffffff, [-20, 214, 58], "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(4, 50, 8, 0xffffff, [-12, 207, 58], "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(4, 50, 8, 0xffffff, [-4, 203, 58], "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(4, 50, 8, 0xffffff, [4, 203, 58], "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(4, 50, 8, 0xffffff, [12, 207, 58], "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(4, 50, 8, 0xffffff, [20, 214, 58], "img/rock.png", "img/rock_normal.png"));

    //Buttons
    this.addToScene(this.createSphere(4, 50, 8, 0xffffff, [0, 150, 70], "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(4, 50, 8, 0xffffff, [0, 130, 78], "img/rock.png", "img/rock_normal.png"));
    this.addToScene(this.createSphere(4, 50, 8, 0xffffff, [0, 110, 80], "img/rock.png", "img/rock_normal.png"));

    //TopHat
    this.importObj("models/TopHat/", "TopHat.obj", "TopHat.mtl", [20, 20, 20], [0, 260, 0], [0, 0, 0], true, false, "Texture_TopHat0000.png");

    //Sticks
    this.importObj("models/Stick/", "Stick.obj", "Stick.obj.mtl", [25, 25, 25], [-80, 110, 0], [50, 120, 0], true, false, "Stick.jpg");
    this.importObj("models/Stick/", "Stick.obj", "Stick.obj.mtl", [25, 25, 25], [80, 100, 0], [50, -120, 0], true, false, "Stick.jpg");

    //Christmas Tree
    this.importObj("models/christmas_tree/", "christmas_tree.obj", "christmas_tree.mtl", [380, 380, 380], [250, -100, -350], [0, 0, 0], true, false);

    //Chair
    this.importObj("models/Chair/", "CHAIR_2012.obj", "CHAIR_2012.obj.mtl", [100, 100, 100], [-6000, -8000, 5000], [0, 180, 0], true, false);

    //Sled
    this.importObj("models/Sled/", "Sled01New.obj", "Sled01New.mtl", [600, 600, 600], [-200, -100, 500], [0, 150, 0], true, false, "Sled01new_BaseColor.png");

    //Monitor
    this.importObj("models/Computer/", "cgaxis_models_volume_59_01_obj.obj", "cgaxis_models_volume_59_01_obj.mtl", [250, 250, 250], [-6000, -280, 500], [0, 0, 0], true, false);

    //Keyboard
    this.importObj("models/Computer/", "cgaxis_models_volume_59_02_obj.obj", "cgaxis_models_volume_59_02_obj.mtl", [250, 250, 250], [-6000, -280, 3000], [0, 0, 0], true, false);

    //Headphones
    this.importObj("models/Computer/", "cgaxis_models_volume_59_11_obj.obj", "cgaxis_models_volume_59_11_obj.mtl", [250, 250, 250], [-10000, 0, 2500], [75, 0, 200], true, false);

    //Lamp
    this.importObj("models/Lamp/", "Lamp.obj", "Lamp.mtl", [12000, 12000, 12000], [3000, -290, -3000], [0, 0, 0], true, false, "Diffuse.png");

    //Text
    var loader = new THREE.FontLoader();
    loader.load("fonts/Heartbeat_in_Christmas_Regular.json", function(font) {
      var textGeo = new THREE.TextGeometry("Happy Holidays", {
        font: font,
        size: 250,
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
      textMesh.castShadow = true;
      textMesh.receiveShadow = false;

      textMesh.position.set(-550, 400, -5);
      scene.add(textMesh);
    });

    //Lights
    this.lights.push(this.createSpotLight(0xff0000, 0.3, 1000, 50, 1, 0.5, [20, -126, -54], [293, 223, -5], 256, 256));
    this.lights.push(this.createSpotLight(0x00ff00, 0.3, 1000, 50, 1, 0.5, [-20, -126, -54], [-293, 223, -5], 256, 256));
    this.lights.push(this.createSpotLight(0x0000ff, 0.5, 1000, 50, 1, 0.5, [0, 0, -340], [265, 314, -521], 256, 256));

    this.lights.push(this.createSpotLight(0xffc53f, 0.8, 1000000, 50, 1, 0, [0, 0, 0], [6300, 11719, 9551], 8192, 8192, "RoomLight"));

    this.lights.push(this.setAmbientLight(0xb5f1ff, 0.4));

    var cameraLight = this.createSpotLight(0xffffff, 0.8, 1000000, 1, 1, 0, [0, 0, -500], [1000, 5000, 20000], 8192, 8192);
    cameraLight.visible = false;
    camera.add(cameraLight);

    for (var i = 0; i < this.lights.length; i++) {
      scene.add(this.lights[i]);
    }

    //Snow
    var snowGeometry = new THREE.Geometry();
    var particleCount = 3000;

    for (var i = 0; i < particleCount; i++) {
      var snow = new THREE.Vector3();

      var distance = 800;
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

      controls.autoRotate = this.cameraAutoRotate;

      controls.update();

      render();
    };

    var render = () => {
      renderer.render(scene, camera);
    };
  }

  createSphere(rad, seg, ring, colour, pos, texturePath, normalMap, opacity, envMap, refractionRatio, depthWrite = true, wireframeEnabled = false, isGlobeGlass = false) {
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

    if (opacity != null) {
      sphereMaterial.transparent = true;
      sphereMaterial.opacity = opacity;

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
      sphere.castShadow = false;
      sphere.receiveShadow = false;
    } else {
      sphere = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS), sphereMaterial);
      sphere.castShadow = true;
      sphere.receiveShadow = false;
    }

    sphere.position.set(pos[0], pos[1], pos[2]);

    return sphere;
  }

  createCone(rad, height, rSeg, hSeg, colour, pos, rot, texturePath, normalMap, castShadow = true, receiveShadow = true) {
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

    cone.position.set(pos[0], pos[1], pos[2]);

    cone.rotation.set(this.degToRad(rot[0]), this.degToRad(rot[1]), this.degToRad(rot[2]));

    cone.castShadow = castShadow;
    cone.receiveShadow = receiveShadow;

    return cone;
  }

  createBox(width, height, depth, colour, texturePath, normalMap, shininess, pos) {
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

    box.position.set(pos[0], pos[1], pos[2]);

    box.castShadow = false;
    box.receiveShadow = true;

    return box;
  }

  createGlobeBase(width, height, colour, texturePath, normalMap, pos, groundColour, groundTexturePath, groundNormalMap) {
    var cylinderGeo = new THREE.CylinderGeometry(width, width, height, 64, 64);

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

    var groundMaterial = new THREE.MeshPhongMaterial({});

    if (groundColour != null) {
      groundMaterial.color = new THREE.Color(groundColour);
    }

    if (groundTexturePath != null) {
      var texture = new THREE.TextureLoader().load(groundTexturePath);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(16, 16);
      groundMaterial.map = texture;
    }

    if (groundNormalMap != null) {
      groundMaterial.normalMap = new THREE.TextureLoader().load(groundNormalMap);
    }

    var hiddenMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0});

    var baseMaterials = [cylinderMaterial, groundMaterial, hiddenMaterial];

    var cylinder = new THREE.Mesh(cylinderGeo, baseMaterials);

    cylinder.position.set(pos[0], pos[1], pos[2]);

    cylinder.castShadow = false;
    cylinder.receiveShadow = true;

    return cylinder;
  }

  createSpotLight(colour, str, distance, angle, blur, decay, pos, rot, shadowW, shadowH, name = "") {
    var spotLight = new THREE.SpotLight(colour, str, distance, this.degToRad(angle), blur, decay);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = shadowW;
    spotLight.shadow.mapSize.height = shadowH;
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 5000;

    spotLight.target.position.set(pos[0], pos[1], pos[2]);

    spotLight.position.set(rot[0], rot[1], rot[2]);

    spotLight.name = name;

    return spotLight;
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

  animatePage() {
    var timeline = new TimelineMax({});
    var envelope = document.getElementById("envelope");
    var card = document.getElementById("snowman-card");
    var cardContainer = document.getElementById("card-container");
    var instructionsCard = document.getElementById("instructions-card");
    var mouseInstructions = document.getElementById("mouse-instructions");
    var fade = document.getElementById("screen-fade");
    timeline.add(TweenMax.fromTo(card, 1, {autoAlpha: 1, y: 500}, {autoAlpha: 1, y: 300}));
    timeline.add(
      TweenMax.to(fade, 1, {
        opacity: 1,
        delay: 1,
        onComplete: () => {
          TweenMax.set(envelope, {autoAlpha: 0, display: "none"});
          TweenMax.set(instructionsCard, {display: "block"});
          if (window.innerWidth > 1095) {
            TweenMax.set(card, {x: 300});
          } else {
            if (this.mobileCheck()) {
              TweenMax.set(mouseInstructions, {display: "none"});
            }
          }
          TweenMax.set(cardContainer, {overflow: "visible"});
          TweenMax.set(instructionsCard, {autoAlpha: 1});

          document.getElementById("bgm").volume = 0.7;
          document.getElementById("bgm").play();

          window.addEventListener("resize", function() {
            if (window.innerWidth > 1095) {
              TweenMax.set(card, {x: 300});
            } else {
              TweenMax.set(card, {x: 0});
            }
          });
        }
      })
    );

    timeline.add(
      TweenMax.to(fade, 1, {
        opacity: 0,
        delay: 1,
        onComplete: () => {
          this.cameraAutoRotate = true;
        }
      })
    );

    envelope.src = "img/intro/Envelope_Opened.png";

    var envelopeOpen = new Audio("sound/intro/letter_open.wav");
    envelopeOpen.play();

    timeline.play();
  }

  importObj(dir, obj, mtl, scale, pos, rot, castShadow = false, receiveShadow = true, texture) {
    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(dir);
    mtlLoader.load(mtl, materials => {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(dir);
      objLoader.load(
        obj,
        object => {
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              if (texture) {
                child.material = new THREE.MeshPhongMaterial({});
                child.material.map = new THREE.TextureLoader().load(dir + texture);
              }
              child.castShadow = castShadow;
              child.receiveShadow = receiveShadow;
            }
          });
          object.scale.set(scale[0], scale[1], scale[2]);

          object.position.set(pos[0], pos[1], pos[2]);

          object.rotation.set(this.degToRad(rot[0]), this.degToRad(rot[1]), this.degToRad(rot[2]));

          object.castShadow = castShadow;
          object.receiveShadow = receiveShadow;
          this.addToScene(object);
        },
        function(xhr) {
          // console.log(xhr.loaded / xhr.total * 100 + "% loaded!!!!!!");
        },
        function(error) {
          console.warn("An obj loading error occured. (" + obj + ")");
        }
      );
    });
  }

  mobileCheck() {
    var check = false;
    (function(a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }
}

var snowglobe = new Snowglobe();
snowglobe.init();
