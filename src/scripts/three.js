import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { NodePass } from 'three/examples/jsm/nodes/postprocessing/NodePass.js'
import * as Nodes from 'three/examples/jsm/nodes/Nodes.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import gsap from 'gsap'

// data to be received from vue
const vueData = []

function main(movieObjs, isVisible, loadingThree, picked_movie_id) {
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
  const cameraStartingPos = {x: 0, y:0, z: 10}
  const cameraTargetStartDist = 50
  const cameraTargetStart = {x: 0, y: 0, z: cameraTargetStartDist}
  const cameraScrollDist = 200
  const cameraZoominValue = 0.92
  let cameraTarget = {...cameraTargetStart}
  let cameraScrollIdx = 0
  camera.position.set(cameraStartingPos.x, cameraStartingPos.y, cameraStartingPos.z)
  camera.lookAt(new THREE.Vector3(cameraTargetStart.x, cameraTargetStart.y, cameraTargetStart.z))

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
    bloomStrength: 0.32,
    bloomThreshold: 0.25,
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
    'comedy': 3,
    'action': 4,
    'horror': 5
  }
  let movieRotation = true
  let moviesFaceCam = true
  let pickedMovieFaceCam = false
  let formerMovieRotation
  
  const movies = []
  for (let genre in movieObjs) {
    movieObjs[genre].forEach((movieObj, idx) => {
      // comment this out for instant load
      makeInstance(geometry, genre, movieObj, idx)
    })
  }
 
  function makeInstance(geometry, genre, movieObj, idx) {
    // w92 for faster loading for testing -> change to w-500 for final result
    const material = new THREE.MeshStandardMaterial({map: loader.load(movieObj.poster_path.replace('/original/', '/w92/'))})
    
    const movie = new THREE.Mesh(geometry, material);
    scene.add(movie);
    
    const numMovies = movieObjs[genre].length
		const rad = idx * (2*Math.PI / numMovies)
    const x = radius * Math.cos(rad)
    const y = -movieGenreIdx[genre] * cameraScrollDist
    const z = radius * Math.sin(rad)
    movie.position.set(x, y, z);
    movie.lookAt(cameraStartingPos.x, cameraStartingPos.y, cameraStartingPos.z)
		movie.rad = rad
    movie.movie_id = movieObj.id
    
    movies.push(movie)
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
    console.log(objLoader.materials)
    objLoader.load('amongus/among us.obj', (root) => {
      character = root
      scene.add(character)
      character.position.set(5*radius, 1.8*radius, 3*radius)
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
  const heartShape = new THREE.Shape()
  .moveTo( x + 25, y + 25 )
  .bezierCurveTo( x + 25, y + 25, x + 20, y, x, y )
  .bezierCurveTo( x - 30, y, x - 30, y + 35, x - 30, y + 35 )
  .bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 )
  .bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 )
  .bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y )
  .bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 )
  
  for (let i=0; i<10; i++) {
    const x = (Math.random()-0.5)*200
    const y = (Math.random()-0.5)*100
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
    console.log(mesh.position)
  }
  scene.add(heartGroup)
  
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
  const light0 = new THREE.PointLight( 0xffffff, 2 )
  light0.position.set(0, -2*cameraScrollDist, radius*1.4)
  scene.add( light0 )
  const pointLightFolder = gui.addFolder("Point Light")
  pointLightFolder.add(light0, 'intensity', 0, 2, 0.01);
  pointLightFolder.add(light0.position, 'x', -10, 10);
  pointLightFolder.add(light0.position, 'z', -10, 10);
  pointLightFolder.add(light0.position, 'y', 0, 10);

  const light1 = new THREE.DirectionalLight( 'rgb(245, 246, 250)', 0.7 )
  light1.position.set(0, 10, 0)
  light1.target.position.set(0, 0, radius)
  scene.add( light1 )
  scene.add(light1.target)
  const directionalLightFolder = gui.addFolder("Directional Light")
  directionalLightFolder.add(light1, 'intensity', 0, 2, 0.01);
  directionalLightFolder.add(light1.position, 'x', -10, 10);
  directionalLightFolder.add(light1.position, 'z', -10, 10);
  directionalLightFolder.add(light1.position, 'y', -10, 10);
  directionalLightFolder.add(light1.target.position, 'x', -10, 10);
  directionalLightFolder.add(light1.target.position, 'z', -10, 10);
  directionalLightFolder.add(light1.target.position, 'y', -10, 10);

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
  //// Events
  const mouseVector = new THREE.Vector2()
	const raycaster = new THREE.Raycaster()
  let picked_id = -1
  let is_clicked = false
  
  ///////////////////////////////////////////////////////////////////////////
  //// Functions
  //  Utility
  function getRand(min, max) {
    return Math.random() * (max - min) + min
  }

  // Event Handlers
  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );
    horrorComposer.setSize( width, height );
  }
  
	function onCanvasMouseDown( event ) {
    event.preventDefault()
		mouseVector.x = event.clientX
		mouseVector.y = event.clientY
		is_clicked = true
		
		pickImage( mouseVector );
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
      // rotateScreenOnMouse(tempX, tempY)
      return
    }
    event.preventDefault();
    const deltaX = event.clientX - mouseVector.x
    const deltaY = event.clientY - mouseVector.y
    mouseVector.x = event.clientX
		mouseVector.y = event.clientY
    rotateMovie(deltaX, deltaY)
  }
  // function rotateScreenOnMouse(tempX, tempY) {
    // console.log(tempX, tempY)
    // camera.rotation.y = tempX * 0.001
    // camera.rotation.x = tempY * 0.001
    // camera.updateProjectionMatrix()
  // }
  
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
      if (cameraScrollIdx === 5) {
        return
      }
      cameraScrollIdx += 1
      gsap.to(camera.position, {
        duration:1,
        x: cameraStartingPos.x,
        y: -cameraScrollIdx * cameraScrollDist,
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
        y: -cameraScrollIdx * cameraScrollDist,
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
            y: -cameraScrollIdx * cameraScrollDist,
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
    romanceFlag = false
    horrorFlag = false
    switch (cameraScrollIdx) {
      case 0:
        console.log('sci-fi')
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
        case 1:
          console.log('romance')
          romanceFlag = true
          gsap.to(currBgc, { 
            duration: 1,
            r: 255,
            g: 121,
            b: 121,
            opacity: 0.7,
            onUpdate: function () {
              renderer.setClearColor(new THREE.Color(`rgb(${Math.floor(currBgc.r)}, ${Math.floor(currBgc.g)}, ${Math.floor(currBgc.b)})`), currBgc.opacity)
            },
          })
          // scene.background = new THREE.Color( 0xf0f0f0 )
        break
      case 2:
        console.log('animation')
        gsap.to(currBgc, {
          duration: 1,
          r: 186,
          g: 220,
          b: 88,
          opacity: 1,
          onUpdate: function () {
            renderer.setClearColor(new THREE.Color(`rgb(${Math.floor(currBgc.r)}, ${Math.floor(currBgc.g)}, ${Math.floor(currBgc.b)})`), currBgc.opacity)
          }
        })
        break
      case 3:
        console.log('comedy')
        gsap.to(currBgc, { 
          r: 126,
          g: 214,
          b: 223,
          opacity: 1,
          onUpdate: function () {
            renderer.setClearColor(new THREE.Color(`rgb(${Math.floor(currBgc.r)}, ${Math.floor(currBgc.g)}, ${Math.floor(currBgc.b)})`), currBgc.opacity)
          }
        })

        break
      case 4:
        console.log('action')
        gsap.to(currBgc, { 
          duration: 1,
          r: 223,
          g: 249,
          b: 251,
          opacity: 1,
          onUpdate: function () {
            renderer.setClearColor(new THREE.Color(`rgb(${Math.floor(currBgc.r)}, ${Math.floor(currBgc.g)}, ${Math.floor(currBgc.b)})`), currBgc.opacity)
          }
        })

        break
      case 5:
        console.log('horror')
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
    movies.map((movie) => {
      if (movie.id === picked_id) {
        movie.rotation.y -= deltaX / 100
      }
    })
  }
  
	function pickImage(vector) {
		if (picked_id === -1) {
			//collision detection
			var intersects = null
      vector.x = (vector.x / window.innerWidth) * 2 - 1
      vector.y = (vector.y / window.innerHeight) * 2 - 1
			raycaster.setFromCamera(vector, camera)
			intersects = raycaster.intersectObjects(scene.children)
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
				
				// Change object position
				const targetObj = intersects[0].object
        picked_movie_id.value = targetObj.movie_id
        formerMovieRotation = {x: targetObj.rotation.x, y: targetObj.rotation.y, z: targetObj.rotation.z}
				cameraTarget.x = camera.position.x
				cameraTarget.y = camera.position.y
				cameraTarget.z = cameraTargetStartDist
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
				gsap.to(camera.position, {
					duration:gsapDuration,
					x: Math.cos(targetObj.rad) * radius * cameraZoominValue, 
					y: targetObj.position.y, 
					z: Math.sin(targetObj.rad) * radius * cameraZoominValue,
					onUpdate:function(){
						camera.updateProjectionMatrix();
					}
				})
        // make movie smaller to prevent overlap
        movies.forEach((movie) => {
          if (movie.id === picked_id) {
            gsap.to(movieEnlargeScale, {
              duration: gsapDuration,
              value: movieEnlargeScale.goal,
              onUpdate: function () {
                // console.log(movieEnlargeScale.value)
                movie.scale.set(movieEnlargeScale.value, movieEnlargeScale.value, movieEnlargeScale.value)
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
                }
              })
            }, 1100)
          }
        })
			}
		}
	}
				
	function resetPickImage() {
			document.body.classList.remove('is-pointed');
      
      // movies face camera again
      moviesFaceCam = true

      // picked Movie Faces Cam
      pickedMovieFaceCam = false
      
      setTimeout(() => {
        // resume movie ratation
        movieRotation = true
        picked_id = -1;
      }, 1000)

			// change camera far
			camera.far = 10000
			camera.updateProjectionMatrix();

			//Change object position 
			gsap.to(cameraTarget, {
				duration: gsapDuration, 
				x:cameraTargetStart.x, 
				y:camera.position.y, 
				z:cameraTargetStart.z,
        onUpdate: function (){
          camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z)
          camera.updateProjectionMatrix()
        }
			})
      const currY = camera.position.y
			gsap.to(camera.position, {
				duration: gsapDuration, 
				x: cameraStartingPos.x, 
				y: currY, 
				z: cameraStartingPos.z,
				onUpdate: function (){
          camera.updateProjectionMatrix()
				}
			})
      movies.forEach((movie) => {
        let tempMovieRotation = {x: movie.rotation.x, y: movie.rotation.y, z: movie.rotation.z}
        if (movie.id === picked_id) {
          gsap.to(movie.position, {
            duration: gsapDuration,
            x: movie.x,
            z: movie.z
          })
          gsap.to(tempMovieRotation, {
            duration: gsapDuration,
            y: formerMovieRotation.y,
            onUpdate: function () {
              movie.rotation.y = tempMovieRotation.y
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

    // update movies position
    movies.forEach((movie) => {
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
    })

    // 1. Sci-fi update particles and amongus only when camera is clone enough
    if (camera.position.y > -1.5 * cameraScrollDist) {
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
        } else if (character.position.y < -50) {
          character.position.y = -49
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
    if (camera.position.y < 0 && camera.position.y > -2.5 * cameraScrollDist) {
      heartGroup.children.forEach((heart) => {
        heart.position.x += heart.speedX * 0.7
        heart.position.y += heart.speedY * 0.7
        heart.rotation.y += heart.rotSpeed
        if (heart.position.x > 150 || heart.position.x < -150) {
          heart.speedX *= -1
        }
        if (heart.position.y > 70 || heart.position.y < -70) {
          heart.speedY *= -1
        }
      })
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
