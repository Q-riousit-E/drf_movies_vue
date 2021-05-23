import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { NodePass } from 'three/examples/jsm/nodes/postprocessing/NodePass.js'
import * as Nodes from 'three/examples/jsm/nodes/Nodes.js'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import gsap from 'gsap'

// data to be received from vue
function main(movieObjs, isVisible, loadingThree, picked_movie_id, currMovieGenre) {
  // // test
  // console.log(movieObjs)

  ////////////////////////////////////////////////////////////////////////
  //// Communication with Vue
  // html querying
  const loadingElem = document.querySelector('#loading')
  const progressBarElem = loadingElem.querySelector('.progressbar')

  ////////////////////////////////////////////////////////////////////////
  //// Setup
  const canvas = document.querySelector('#c')
  const scene = new THREE.Scene()
  const loadManager = new THREE.LoadingManager()
  const loader = new THREE.TextureLoader(loadManager)
  const gui = new GUI()
  const gsapDuration = 1
  // scene.background = new THREE.Color('gray')
  
  // Camera
  const fov = 80    // field of view in degrees
  const aspect = window.innerWidth / window.innerHeight
  const near = 0.1
  const far = 500
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  // const cameraStartingPos = {x: -5, y: 5, z: 0}
  const cameraStartingPos = {x: 0, y: 5, z: 10}
  const cameraTargetStartDist = 50
  const cameraTargetStart = {x: 0, y: cameraStartingPos.y, z: cameraTargetStartDist}
  const cameraScrollDist = 200
  const cameraZoominValue = 0.92
  let cameraTarget = {...cameraTargetStart}
  let cameraScrollIdx = 0
  camera.position.set(cameraStartingPos.x, cameraStartingPos.y, cameraStartingPos.z)
  camera.lookAt(new THREE.Vector3(cameraTargetStart.x, cameraTargetStart.y, cameraTargetStart.z))
  const camFolder = gui.addFolder("Camera")
  camFolder.add(camera.position, 'y').min(0).max(30).step(0.1)

  // // Fog
  // const fogNear = 1
  // const fogFar = 2
  // const fogColor = 'lightblue'
  // scene.fog = new THREE.Fog(fogColor, fogNear, fogFar)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ 
    canvas,
    alpha: true,
  })
  let currBgc = {r: 30, g: 40, b: 42, opacity: 1}
  renderer.setClearColor(new THREE.Color(`rgb(${currBgc.r}, ${currBgc.g}, ${currBgc.b})`), currBgc.opacity)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.shadowMap.enabled = true
  // renderer.toneMapping = THREE.ReinhardToneMapping

  //// PostProcessing
  const frame = new Nodes.NodeFrame()

  // 2. Romance 
  const params = {
    exposure: 1,
    bloomStrength: 0.22,
    bloomThreshold: 0.34,
    bloomRadius: 0
  }
  let romanceFlag = false
  const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  const romanceComposer = new EffectComposer( renderer );
  romanceComposer.addPass(new RenderPass(scene, camera));
  romanceComposer.addPass( bloomPass );

  const bloomFolder = gui.addFolder("Bloom")
  bloomFolder.add( params, 'exposure', 0.1, 2 ).step(0.01).onChange( function ( value ) {
    renderer.toneMappingExposure = Math.pow( value, 4.0 );
  } );
  bloomFolder.add( params, 'bloomThreshold', 0.0, 1.0 ).step(0.01).onChange( function ( value ) {
    bloomPass.threshold = Number( value );
  } );
  bloomFolder.add( params, 'bloomStrength', 0.0, 0.5 ).step(0.01).onChange( function ( value ) {
    bloomPass.strength = Number( value );
  } );
  bloomFolder.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
    bloomPass.radius = Number( value );
  } );

  // 5. Horror
  // init
  let horrorFlag = false
  const horrorComposer = new EffectComposer(renderer)
  const nodePass = new NodePass()
  horrorComposer.addPass(new RenderPass(scene, camera))
  horrorComposer.addPass(nodePass)

  // blur
  const size = renderer.getDrawingBufferSize( new THREE.Vector2() )
  const blurScreen = new Nodes.BlurNode( new Nodes.ScreenNode() )
  const blurVal = 0.8
  blurScreen.size = new THREE.Vector2( size.width, size.height )
  blurScreen.radius.x = blurVal
  blurScreen.radius.y = blurVal
  
  nodePass.input = blurScreen;
  nodePass.needsUpdate = true;

  // glitch
  const glitchPass = new GlitchPass()
  horrorComposer.setSize(canvas.clientWidth, canvas.clientHeight)
  horrorComposer.addPass(glitchPass)

  //////////////////////////////////////////////////////////////////////
  //// Objects
  // Movies
  const geometry = new THREE.BoxGeometry(10, 15, 10);
	const radius = 60
  const movieRotationSpeed = 0.0025
  const moviesLootAtZ = 20
  const movieEnlargeScale = {value: 1, goal: 0.3}
  const pickedRadius = 61
  const pickedAngle = -0.075  // this has to depend on screen size
  const movieGenreIdx = {
    'sci_fi': 0,
    'romance': 1,
    'animation': 2,
    'action': 3,
    'horror': 4
  }
  let movieRotation = true
  let moviesFaceCam = true
  let pickedMovieFaceCam = false
  let pickedMovieStartRotating = false
  
  const movieGroup = new THREE.Group()
  movieGroup.position.set(0, 0, 0)
  for (let genre in movieObjs) {
    movieObjs[genre].forEach((movieObj, idx) => {
      // comment this out for instant load
      makeInstance(geometry, genre, movieObj, idx)
    })
  }
  scene.add(movieGroup)
 
  function makeInstance(geometry, genre, movieObj, idx) {
    // w92 for faster loading for testing -> change to w-500 for final result
    const material = new THREE.MeshStandardMaterial({map: loader.load(movieObj.poster_path.replace('/original/', '/w92/'))})
    const movie = new THREE.Mesh(geometry, material);
    const numMovies = movieObjs[genre].length
		const rad = idx * (2*Math.PI / numMovies)
    const x = radius * Math.cos(rad)
    const y = -movieGenreIdx[genre] * cameraScrollDist
    const z = radius * Math.sin(rad)
    movie.position.set(x, y, z);
    movie.lookAt(cameraStartingPos.x, cameraStartingPos.y, cameraStartingPos.z)
		movie.rad = rad
    movie.movie_id = movieObj.id
    
    movieGroup.add(movie)
  }
  main.makeInstance = makeInstance
  
  /////////////////////////////////////////////////////////////////////////////
  //// 1. Sci-fi
  // Particles
  const particlesGeometry = new THREE.BufferGeometry
  const starsGeometry = new THREE.BufferGeometry
  const particlesCnt = 3000
  const starsCnt = 1000

  let positions = []
  let posiitionsStars = []
  for (let i=0; i < particlesCnt; i++) {
    const x = (Math.random()-0.5) * Math.random() * cameraScrollDist * 1.3
    const y = (Math.random()-0.5) * Math.random() * cameraScrollDist * 1.3
    const z = (Math.random()-0.5) * Math.random() * cameraScrollDist * 1.3
    if (x**2 + y**2 + z**2 > radius**2) {
      positions.push(x)
      positions.push(y)
      positions.push(z)
    }
  }
  for (let i=0; i < starsCnt; i++) {
    const x = (Math.random()-0.5) * Math.random() * cameraScrollDist * 1.3
    const y = (Math.random()-0.5) * Math.random() * cameraScrollDist * 1.3
    const z = (Math.random()-0.5) * Math.random() * cameraScrollDist * 1.3
    if (x**2 + y**2 + z**2 > radius**2) {
      posiitionsStars.push(x)
      posiitionsStars.push(y)
      posiitionsStars.push(z)
    }
  }
  const material = new THREE.PointsMaterial({ size: 0.05, transparent: true })
  particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const particlesMesh = new THREE.Points(particlesGeometry, material)
  scene.add(particlesMesh)
  
  // Stars
  const star = loader.load('./star4.png')
  const starMaterial = new THREE.PointsMaterial({ size: 3, map: star, transparent: true })
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(posiitionsStars, 3))
  const starsMesh = new THREE.Points(starsGeometry, starMaterial)  
  scene.add(starsMesh)

  // Amongus Character
  const mtlLoader = new MTLLoader()
  let character
  let characterLoaded = false
  let characterMoveRight = true
  let characterMoveDown = true
  mtlLoader.load('amongus/among us.mtl', (mtl) => {
    mtl.preload()
    const objLoader = new OBJLoader()
    objLoader.setMaterials(mtl)
    objLoader.load('amongus/among us.obj', (root) => {
      character = root
      scene.add(character)
      character.position.set(3*radius, 1.8*radius, 3*radius)
      character.rotation.set(0, 180, -90)
      character.scale.set(0.1, 0.1, 0.1)
      characterLoaded = true
    })
  })

  //// 2. Romance
  const heartGroup = new THREE.Group()
  heartGroup.position.set(0, -cameraScrollDist, radius * 1.6)
  const x = 0, y = 0
  const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
  const heartX = 150
  const heartMinY = -50
  const heartMaxY = 90
  const heartShape = new THREE.Shape()
  .moveTo( x + 25, y + 25 )
  .bezierCurveTo( x + 25, y + 25, x + 20, y, x, y )
  .bezierCurveTo( x - 30, y, x - 30, y + 35, x - 30, y + 35 )
  .bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 )
  .bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 )
  .bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y )
  .bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 )
  
  for (let i=0; i<10; i++) {
    const x = getRand(-heartX, heartX)
    const y = getRand(heartMinY, heartMaxY)
    const rotY = getRand(-Math.PI, Math.PI)
    const size = getRand(0.04, 0.08)
    addShape( heartShape, extrudeSettings, 0xf00000, x, y, 0, 0, rotY, Math.PI, size );
  }

  function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    const mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
    const speedX = (Math.random() - 0.5) * 2
    const speedY = (Math.random() - 0.5)
    const rotSpeed = getRand(0.01, 0.03)

    mesh.position.set( x, y, z );
    mesh.rotation.set( rx, ry, rz );
    mesh.scale.set( s, s, s );
    mesh.speedX = speedX
    mesh.speedY = speedY
    mesh.rotSpeed = rotSpeed
    heartGroup.add( mesh );
  }
  scene.add(heartGroup)

  //// 3. Animation
  let mixer
  let playAnimation = false
  let pokeLights
  let pokemon

  const animationFolder = gui.addFolder("Animation")
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('three/examples/js/libs/draco/gltf/')

  const gltfLoader = new GLTFLoader()
  gltfLoader.setDRACOLoader(dracoLoader)
  gltfLoader.load('rayquaza_384/scene.gltf', function (gltf) {
    const model = gltf.scene
    pokemon = model
    const pokemonScale = {val: 0.07}
    
    model.position.set(120, 30 - 2*cameraScrollDist, 1.3*radius)
    // model.position.set(120, 30, 1.3*radius)
    model.rotation.set(-0.19, -2.11, 0)
    model.scale.set(pokemonScale.val, pokemonScale.val, pokemonScale.val)
    scene.add(model)
    // console.log(dumpObject(model).join('\n'));
    pokeLights = model.getObjectByName('Sphere001')
    pokeLights.scale.set(0.1, 0.1, 0.1)
    
    // animate model
    mixer = new THREE.AnimationMixer(model)
    mixer.clipAction(gltf.animations[0]).play()
    playAnimation = true

    // gui
    animationFolder.add(pokemonScale, 'val').min(0.03).max(0.5).step(0.001).onChange(() => {
      model.scale.set(pokemonScale.val, pokemonScale.val, pokemonScale.val)
    })
    animationFolder.add(model.position, 'x').min(-100).max(100).step(0.1)
    animationFolder.add(model.position, 'y').min(-60).max(60).step(0.1)
    animationFolder.add(model.position, 'z').min(4*cameraTargetStartDist).max(6*cameraTargetStartDist).step(10)
    animationFolder.add(model.rotation, 'x').min(-3).max(3).step(0.01)
    animationFolder.add(model.rotation, 'y').min(-3).max(3).step(0.01)
    animationFolder.add(model.rotation, 'z').min(-3).max(3).step(0.01)
  })

  //// 4. Action
  // pivot to make gun rotate 
  const pivot = new THREE.Object3D()
  const pivotInitialPos = {x: -3.9, y: 3.6, z: 6.5}
  pivot.position.set(pivotInitialPos.x, pivotInitialPos.y - 3*cameraScrollDist, pivotInitialPos.z)
  pivot.rotation.set(0, 0, 0)
  scene.add(pivot)

  // 0: before cocking, 1: during cocking, 2: when cocking is done
  let gunReady = 0        
  let actionFlag = false
  let gunModel

  const gunLoadedPos = {x: 0.2, y: 1.4, z: 21.2}
  const gunLoadedRot = {x: 3.2, y: 1.5, z: 3.1}

  const actionFolder = gui.addFolder("Action")
  dracoLoader.setDecoderPath('three/examples/js/libs/draco/gltf/')
  gltfLoader.load('sniper/scene.gltf', function (gltf) {
    const model = gltf.scene
    gunModel = model

    const targetScale = {val: 0.03}
    pivot.add(model)
    model.position.set(0.2 - pivotInitialPos.x, -13 - pivotInitialPos.y, 21.2 - pivotInitialPos.z)
    model.rotation.set(3.2, 1.5, 5)
    model.scale.set(targetScale.val, targetScale.val, targetScale.val)

    // gui
    actionFolder.add(targetScale, 'val').min(0.005).max(10).step(0.01).onChange(() => {
      model.scale.set(targetScale.val, targetScale.val, targetScale.val)
    })
    actionFolder.add(model.position, 'x').min(-100).max(100).step(0.1)
    actionFolder.add(model.position, 'y').min(-60).max(60).step(0.1)
    actionFolder.add(model.position, 'z').min(0).max(6*cameraTargetStartDist).step(0.1)
    actionFolder.add(model.rotation, 'x').min(-Math.PI*2).max(Math.PI*2).step(0.01)
    actionFolder.add(model.rotation, 'y').min(-Math.PI*2).max(Math.PI*2).step(0.01)
    actionFolder.add(model.rotation, 'z').min(-Math.PI*2).max(Math.PI*2).step(0.01)
  })

  function loadGun() {
    gsap.to(gunModel.position, {
      duration: 0.5,
      ease: 'expo',
      x: gunLoadedPos.x - pivotInitialPos.x,
      y: gunLoadedPos.y - pivotInitialPos.y,
      z: gunLoadedPos.z - pivotInitialPos.z,
    })
    gsap.to(gunModel.rotation, {
      duration: 0.5,
      ease: 'expo',
      x: gunLoadedRot.x,
      y: gunLoadedRot.y,
      z: gunLoadedRot.z,
      onComplete: function () {
        gunReady = 2
      }
    })
  }

  let gunReboundPosTween, gunReboundRotTween 
  let currGunPos, currGunRot
  function gunRoboudMotion () {
    console.log('rebound gun')
    
    // kill previous ondone rebounds
    if (gunReboundPosTween) {
      gunReboundPosTween.kill()
      gunReboundRotTween.kill()
    } else {
      // update pos, rot if no tween happening
      currGunPos = {...gunModel.position}
      currGunRot = {x: gunModel.rotation.x, y: gunModel.rotation.y, z: gunModel.rotation.z}
    }

    // jerk back motion
    gunModel.position.set(currGunPos.x, currGunPos.y, currGunPos.z - 3)
    gunModel.rotation.set(currGunRot.x, currGunRot.y, currGunRot.z - 0.7)

    // bring gun back to former position and rotation
    gunReboundPosTween = gsap.to(gunModel.position, {
      duration: 1,
      x: currGunPos.x,
      y: currGunPos.y,
      z: currGunPos.z,
    })
    gunReboundRotTween = gsap.to(gunModel.rotation, {
      duration: 1,
      x: currGunRot.x,
      y: currGunRot.y,
      z: currGunRot.z,
    })
  }

  function shootGun() {
    console.log('shoot gun')
  }


  // reset gun and pivot to initial state
  function putGunDown () {
    pivot.position.set(pivotInitialPos.x, pivotInitialPos.y - 3*cameraScrollDist, pivotInitialPos.z)
    pivot.rotation.set(0, 0, 0)
    gunModel.position.set(0.2 - pivotInitialPos.x, -13 - pivotInitialPos.y, 21.2 - pivotInitialPos.z)
    gunModel.rotation.set(3.2, 1.5, 5)

    gunReady = 0
  }
  
  /////////////////////////////////////////////////////////////////////////////////////
  //// Loading
  loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
    const progress = itemsLoaded / itemsTotal
    progressBarElem.style.transform = `scaleX(${progress})`
  }

  loadManager.onLoad = () => {
    loadingThree.value = false
  }
  
  /////////////////////////////////////////////////////////////////////////////////////
  //// Lights
  // 0. Directional Light for whole scene
  const light0 = new THREE.DirectionalLight( 'rgb(245, 246, 250)', 1.1 )
  light0.position.set(0, 10, 0)
  light0.target.position.set(25, 0, radius)
  scene.add( light0 )
  scene.add(light0.target)
  const directionalLightFolder = gui.addFolder("0. Directional Light")
  directionalLightFolder.add(light0, 'intensity', 0, 10, 0.01);
  directionalLightFolder.add(light0.position, 'x', -10, 10);
  directionalLightFolder.add(light0.position, 'z', -10, 10);
  directionalLightFolder.add(light0.position, 'y', -10, 10);
  directionalLightFolder.add(light0.target.position, 'x', -60, 60);
  directionalLightFolder.add(light0.target.position, 'z', -60, 60);
  directionalLightFolder.add(light0.target.position, 'y', -60, 60);

  // 2. Romance - for hearts
  const light2 = new THREE.PointLight( 0xffffff, 0.27 )
  light2.position.set(0, -1*cameraScrollDist, radius*1.4)
  scene.add( light2 )
  const pointLightFolder2 = gui.addFolder("2. Romance Light")
  pointLightFolder2.add(light2, 'intensity', 0, 2, 0.01);
  pointLightFolder2.add(light2.position, 'x', -10, 10);
  pointLightFolder2.add(light2.position, 'z', -10, 10);
  pointLightFolder2.add(light2.position, 'y', 0, 10);

  // 3. Animation - for pokemons
  const light3 = new THREE.PointLight( 0xffffff, 0.5 )
  light3.position.set(-2, 2*cameraScrollDist, 2*cameraTargetStartDist)
  scene.add( light3 )
  const pointLightFolder3 = gui.addFolder("3. Animation Light")
  pointLightFolder3.add(light3, 'intensity', 0, 20, 0.01);
  pointLightFolder3.add(light3.position, 'x', -10, 10);
  pointLightFolder3.add(light3.position, 'z', 0, 100);
  pointLightFolder3.add(light3.position, 'y', 0, 10);


  // const light2 = new THREE.SpotLight('rgb(245, 246, 250)', 10)
  // light2.position.set(20, 20, 20)
  // light2.target.position.set(0, 0, radius)
  // light2.penumbra = 0.6
  // light2.angle = 50
  // light2.distance = 20
  // scene.add(light2)
  // scene.add(light2.target)

  // const helper = new THREE.SpotLightHelper(light2);
  // scene.add(helper);
  // light2.target.updateMatrixWorld();

  //////////////////////////////////////////////////////////////////////////
  //// Events variables
  const mouseVector = {x: 0, y: 0}
	const raycaster = new THREE.Raycaster()
  let picked_id = -1
  let is_clicked = false
  
  ///////////////////////////////////////////////////////////////////////////
  //// Functions
  //  Utility
  function getRand(min, max) {
    return Math.random() * (max - min) + min
  }

  // GLTFloader
  // to see child components of 3D model
  function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
  }

  // Event Handlers
  function onWindowResize() {
    const width = window.innerWidth
    const height = window.innerHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize( width, height )
    romanceComposer.setSize(width, height)
    horrorComposer.setSize(width, height)
  }
  
	function onCanvasMouseDown( event ) {
    event.preventDefault()
    const rect = canvas.getBoundingClientRect()
		mouseVector.x = (event.clientX - rect.left) * canvas.width / rect.width
		mouseVector.y = (event.clientY - rect.top) * canvas.height / rect.height
		is_clicked = true
		
		pickImage()

    // if gun is ready and sth is clicked -> show reboud motion
    if (gunReady === 2) {
      gunRoboudMotion()
    }
	}
  
	function onCanvasMouseUp( event ) {
    event.preventDefault()
		is_clicked = false
	}

  // for particles animation
  let tempX = 0
  let tempY = 0
  function onCanvasMouseMove( event ) {
    // from -1 to 1
    tempX = (event.clientX/window.innerWidth - 0.5) * 2
    tempY = (event.clientY/window.innerHeight - 0.5) * 2

    if (!is_clicked) {
      return
    }
    event.preventDefault();
    const deltaX = event.clientX - mouseVector.x
    const deltaY = event.clientY - mouseVector.y
    mouseVector.x = event.clientX
		mouseVector.y = event.clientY
    rotateMovie(deltaX, deltaY)
  }
  
  function onCanvasScroll (e) {
    // if (picked_id !== -1) {
    //   return
    // }
    if (e.deltaY > 0) {
      onScrollEvent('down')
    } else {
      onScrollEvent('up')
    }
  }
  
  function onScrollEvent (direction) {
    // on scrolling down
    if (picked_id !== -1) {
      return
    }
    if (direction === 'down') {
      if (cameraScrollIdx === 4) {
        return
      }
      cameraScrollIdx += 1
      gsap.to(camera.position, {
        duration:1,
        x: cameraStartingPos.x,
        y: -cameraScrollIdx * cameraScrollDist + cameraStartingPos.y,
        z: cameraStartingPos.z,
        onUpdate:function(){
          camera.updateProjectionMatrix()
        }
      })
      // on scrolling up
    } else if (direction === 'up') {
      if (cameraScrollIdx === 0) {
        return
      }
      cameraScrollIdx -= 1
      gsap.to(camera.position, {
        duration:1,
        x: cameraStartingPos.x,
        y: -cameraScrollIdx * cameraScrollDist + cameraStartingPos.y,
        z: cameraStartingPos.z,
        onUpdate:function(){
          camera.updateProjectionMatrix();
        }
      })
    } else {
      for (let genre in movieObjs) {
        if (genre === direction) {
          cameraScrollIdx = movieGenreIdx[genre]
          gsap.to(camera.position, {
            duration:1,
            x: cameraStartingPos.x,
            y: -cameraScrollIdx * cameraScrollDist + cameraStartingPos.y,
            z: cameraStartingPos.z,
            onUpdate:function(){
              camera.updateProjectionMatrix();
            }
          })
          // change background
        }
      }
    }
    changeBackground()
  }
  main.onScrollEvent = onScrollEvent

  // change background according to genre
  function changeBackground() {
    // reset other scene flags
    romanceFlag = false
    horrorFlag = false
    actionFlag = false
    if (gunReady == 2) {
      putGunDown()
    }

    switch (cameraScrollIdx) {
      // 1. Sci-fi
      case 0:
        currMovieGenre.value = 'sci_fi'
        gsap.to(currBgc, {
          duration: 1,
          r: 33,
          g: 40,
          b: 42,
          opacity: 1,
          onUpdate: function () {
            renderer.setClearColor(new THREE.Color(`rgb(${Math.floor(currBgc.r)}, ${Math.floor(currBgc.g)}, ${Math.floor(currBgc.b)})`), currBgc.opacity)
          }
        })
        break

      // 2. Romance
      case 1:
        romanceFlag = true
        currMovieGenre.value = 'romance'
        gsap.to(currBgc, { 
          duration: 1,
          r: 248,
          g: 165,
          b: 194,
          opacity: 0.7,
          onUpdate: function () {
            renderer.setClearColor(new THREE.Color(`rgb(${Math.floor(currBgc.r)}, ${Math.floor(currBgc.g)}, ${Math.floor(currBgc.b)})`), currBgc.opacity)
          },
        })
        break

      // 3. Animation
      case 2:
        currMovieGenre.value = 'animation'
        gsap.to(currBgc, {
          duration: 1, 
          r: 24,
          g: 28,
          b: 41,
          opacity: 1,
          onUpdate: function () {
            renderer.setClearColor(new THREE.Color(`rgb(${Math.floor(currBgc.r)}, ${Math.floor(currBgc.g)}, ${Math.floor(currBgc.b)})`), currBgc.opacity)
          }
        })
        break
      
      // 4. Action
      case 3:
        currMovieGenre.value = 'action'
        gsap.to(currBgc, { 
          r: 126,
          g: 214,
          b: 223,
          opacity: 1,
          onUpdate: function () {
            renderer.setClearColor(new THREE.Color(`rgb(${Math.floor(currBgc.r)}, ${Math.floor(currBgc.g)}, ${Math.floor(currBgc.b)})`), currBgc.opacity)
          },
          onComplete: function () {
            actionFlag = true
          }
        })
        break
      
      // 5. Horror
      case 4:
        currMovieGenre.value = 'horror'
        gsap.to(currBgc, {
          duration: 1,
          r: 5,
          g: 5,
          b: 5,
          opacity: 1,
          onUpdate: function () {
            renderer.setClearColor(new THREE.Color(`rgb(${Math.floor(currBgc.r)}, ${Math.floor(currBgc.g)}, ${Math.floor(currBgc.b)})`), currBgc.opacity)
          },
          onComplete: function () {
            horrorFlag = true
          }
        })
        break
    }

  }

  // rotate movie to show other sides
  function rotateMovie(deltaX) {
    movieGroup.children.map((movie) => {
      if (movie.id === picked_id) {
        movie.rotation.y -= deltaX / 100
        tempMovieRotation.y = movie.rotation.y
      }
    })
  }

  const formerMovieRotation = {x: 0, y: 0, z: 0}
  const tempMovieRotation = {x: 0, y: 0, z: 0}
	function pickImage() {
    let intersects = null
    const checkingVector = {x: -10000, y: -10000}
    checkingVector.x = (mouseVector.x / window.innerWidth) * 2 - 1
    checkingVector.y = (mouseVector.y / window.innerHeight) * -2 + 1
    raycaster.setFromCamera(checkingVector, camera)
    intersects = raycaster.intersectObjects(movieGroup.children)
		if (picked_id === -1) {
      // if movie is clicked
			if (intersects.length > 0 && is_clicked) {
				
				setTimeout(() => {
					//display button
          isVisible.value = true

					// change camera far after animation moving in is done
					camera.far = 30
					camera.updateProjectionMatrix();

          // movies stop facing camera for mouse interaction
          moviesFaceCam = false
				}, 1000)

        // picked Movie Faces Cam
        pickedMovieFaceCam = true

        // stop movie rotation
        movieRotation = false
				
				document.body.classList.add('is-pointed')
        picked_id = intersects[0].object.id
				
				// Change camera position
				const targetObj = intersects[0].object
        picked_movie_id.value = targetObj.movie_id
        formerMovieRotation.x = targetObj.rotation.x
        formerMovieRotation.y = targetObj.rotation.y
        formerMovieRotation.z = targetObj.rotation.z

        // save camera target position before movement for resetPick camera lookat
				cameraTarget.x = camera.position.x
				cameraTarget.y = camera.position.y
				cameraTarget.z = cameraTargetStartDist
        gsap.to(camera.position, {
          duration:gsapDuration,
          x: Math.cos(targetObj.rad) * radius * cameraZoominValue, 
          y: targetObj.position.y, 
          z: Math.sin(targetObj.rad) * radius * cameraZoominValue,
          onUpdate:function(){
            camera.updateProjectionMatrix();
          }
        })
				gsap.to(cameraTarget, {
					duration: gsapDuration,
					x:targetObj.position.x, 
					y:targetObj.position.y, 
					z:targetObj.position.z,
          onUpdate:function(){
            camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z)
            camera.updateProjectionMatrix();
          }
				})
        // make movie smaller to prevent overlap
        movieGroup.children.forEach((movie) => {
          if (movie.id === picked_id) {
            gsap.to(movieEnlargeScale, {
              duration: gsapDuration,
              value: movieEnlargeScale.goal,
              onUpdate: function () {
                movie.scale.set(movieEnlargeScale.value, movieEnlargeScale.value, movieEnlargeScale.value)
              },
              onComplete: function () {
                tempMovieRotation.x = movie.rotation.x
                tempMovieRotation.y = movie.rotation.y
                tempMovieRotation.z = movie.rotation.z
              }
            })
            // set movie to left after camera movement
            setTimeout(() => {
              const newX = pickedRadius * Math.cos(movie.rad + pickedAngle)
              const newZ = pickedRadius * Math.sin(movie.rad + pickedAngle)
              const tempLookat = {x: camera.position.x, z: camera.position.z}
              gsap.to(movie.position, {
                duration: gsapDuration,
                x: newX,
                z: newZ
              })
              gsap.to(tempLookat, {
                duration: gsapDuration,
                x: camera.position.x,
                z: camera.position.z,
                onUpdate: function () {
                  movie.lookAt(tempLookat.x, camera.position.y, tempLookat.z)
                },
                onComplete: function () {
                  tempMovieRotation.y = movie.rotation.y
                  pickedMovieStartRotating = true
                }
              })
            }, 1100)
          }
        })
			} else if (is_clicked && gunReady === 2) {
        // if clicked but not movie shoot a bullet into space
        shootGun()      
      }
    // when clicking outside of overview page when movie is picked
    } else if (intersects.length === 0) {
      resetPickImage()
    }
	}
				
	function resetPickImage() {
			document.body.classList.remove('is-pointed');
      
      // movies face camera again
      moviesFaceCam = true

      // picked Movie Faces Cam
      pickedMovieFaceCam = false

      // picked movie stops auto rotating
      pickedMovieStartRotating = false
      
      setTimeout(() => {
        // resume movie ratation
        movieRotation = true
        picked_id = -1;
      }, 1000)

			// change camera far
			camera.far = 10000
			camera.updateProjectionMatrix();

			//Change camera position 
      const currY = camera.position.y
      gsap.to(camera.position, {
        duration: gsapDuration, 
        x: cameraStartingPos.x, 
        y: currY + cameraStartingPos.y, 
        z: cameraStartingPos.z,
        onUpdate: function (){
          camera.updateProjectionMatrix()
        }
      })
			gsap.to(cameraTarget, {
				duration: gsapDuration, 
				x:cameraTargetStart.x, 
				y:currY + cameraStartingPos.y, 
				z:cameraTargetStart.z,
        onUpdate: function (){
          camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z)
          camera.updateProjectionMatrix()
        }
			})
      movieGroup.children.forEach((movie) => {
        if (movie.id === picked_id) {
          console.log('former rotation:', formerMovieRotation)
          console.log('curr rotation:', tempMovieRotation)
          gsap.to(movie.position, {
            duration: gsapDuration,
            x: movie.x,
            z: movie.z
          })
          gsap.to(tempMovieRotation, {
            duration: gsapDuration,
            x: formerMovieRotation.x,
            y: formerMovieRotation.y,
            z: formerMovieRotation.z,
            onUpdate: function () {
              movie.rotation.x = tempMovieRotation.x
              movie.rotation.y = tempMovieRotation.y
              movie.rotation.z = tempMovieRotation.z
            }
          })
          gsap.to(movieEnlargeScale, {
            duration: gsapDuration,
            value: 1,
            onUpdate: function () {
              movie.scale.set(movieEnlargeScale.value, movieEnlargeScale.value, movieEnlargeScale.value)
            }
          })
        }
      })
      isVisible.value = false
  }
  main.resetPickImage = resetPickImage

  ///////////////////////////////////////////////////////////////////////////
  //// Rendering
  renderer.render(scene, camera)
  
  function render(time) {
    time *= 0.001

    // update camera aspect
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()

    // 0. update movies position
    movieGroup.children.forEach((movie) => {
      if (movieRotation) {
        const newRad = movie.rad + movieRotationSpeed
        movie.rad = newRad > 2 * Math.PI ? newRad - 2 * Math.PI : newRad
        const newX = radius * Math.cos(movie.rad)
        const newZ = radius * Math.sin(movie.rad)
        movie.x = newX
        movie.z = newZ
        movie.position.set(movie.x, movie.position.y, movie.z)
      }
      if (moviesFaceCam && movie.id !== picked_id) {
        movie.lookAt(camera.position.x, camera.position.y, moviesLootAtZ)
      }
      if (pickedMovieFaceCam && moviesFaceCam && movie.id === picked_id) {
        movie.lookAt(camera.position)
      }
      if (movie.id === picked_id && pickedMovieStartRotating) {
        movie.rotation.y += 0.005
        tempMovieRotation.y = movie.rotation.y
      }
    })

    // 1. Sci-fi update particles and amongus only when camera is clone enough
    if (camera.position.y > -0.5 * cameraScrollDist) {
      if (characterLoaded) {
        character.rotation.x += Math.random() * 0.007
        character.rotation.y += Math.random() * 0.007
        character.rotation.z += Math.random() * 0.007
        if (character.position.x < -300) {
          character.position.x = -299
          characterMoveRight = !characterMoveRight
        } else if (character.position.x > 300) {
          character.position.x = 299
          characterMoveRight = !characterMoveRight
        }
        if (character.position.y > 170) {
          character.position.y = 165
          characterMoveDown = !characterMoveDown
        } else if (character.position.y < -15) {
          character.position.y = -14
          characterMoveDown = !characterMoveDown
        }
      }
      if (tempX === 0 && tempY === 0) {
        particlesMesh.rotation.y = time * 0.2
        starsMesh.rotation.y = time * 0.2
        if (characterLoaded) {
          character.position.x -= characterMoveRight? 0.6 : -0.6
        }
      } else {
        if (characterLoaded) {
          character.position.x -= characterMoveRight? tempX * 1 : -tempX * 1
          character.position.y -= characterMoveDown? tempY * 0.5 : -tempY * 0.5
        }
        particlesMesh.rotation.x = -(tempY) + time * 0.1
        particlesMesh.rotation.y = (tempX) + time * 0.1
        starsMesh.rotation.x = -(tempY) + time * 0.1
        starsMesh.rotation.y = (tempX) + time * 0.1
      }
    }

    // 2. Romance
    if (camera.position.y < -0.8 * cameraScrollDist && camera.position.y > -1.2 * cameraScrollDist) {
      heartGroup.children.forEach((heart) => {
        heart.position.x += heart.speedX * 0.7
        heart.position.y += heart.speedY * 0.7
        heart.rotation.y += heart.rotSpeed
        if (heart.position.x > heartX || heart.position.x < -heartX) {
          heart.speedX *= -1
        }
        if (heart.position.y > heartMaxY || heart.position.y < heartMinY) {
          heart.speedY *= -1
        }
      })
    }

    // 3. Animation - animate pokemon
    if (camera.position.y < -1.8 * cameraScrollDist && camera.position.y > -2.2 * cameraScrollDist) {
      if (playAnimation) {
        mixer.update(0.005)
        pokemon.position.x -= 0.09
        if (pokemon.position.x < -120) {
          playAnimation = false
        }
      }
    }

    // 4. Action - load gun
    if (camera.position.y < -2.8 * cameraScrollDist && camera.position.y > -3.2 * cameraScrollDist) {
      if (actionFlag) {
        if (gunReady === 0) {
          setTimeout(() => {
            loadGun()
            gunReady = 1
          }, 1000)
        } else if (gunReady === 2) {
          // rotate gun around pivot
          pivot.rotation.x = tempY > 0 ? tempY * 0.6 : tempY * 0.7
          pivot.rotation.y = (tempX > 0 ? -tempX * 0.8 : -tempX * 0.9) - 0.07
        }
      }
    }

		// mouse interaction
		raycaster.setFromCamera( mouseVector, camera );

    // Rendering
    if (horrorFlag) {
      frame.update( time ).updateNode( nodePass.material );
      horrorComposer.render()
    } else if (romanceFlag) {
      romanceComposer.render()
    } else {
      renderer.render(scene, camera)
    }
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)

  ///////////////////////////////////////////////////////////////////////
  //// EventListeners
  window.addEventListener('resize', onWindowResize)
  window.addEventListener('mouseup', onCanvasMouseUp, false);
  canvas.addEventListener('mousedown', onCanvasMouseDown, false)
  window.addEventListener('mousemove', onCanvasMouseMove, false)
  window.addEventListener('mousewheel', onCanvasScroll, false)
}

export { main }
