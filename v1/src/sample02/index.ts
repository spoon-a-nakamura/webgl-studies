import * as THREE from 'three'

class Canvas {
	private readonly renderer: THREE.WebGLRenderer
	private readonly camera: THREE.PerspectiveCamera
	private readonly scene: THREE.Scene
	private readonly clock: THREE.Clock
	private box: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>

	constructor(canvas: HTMLCanvasElement) {
		this.renderer = this.createRenderer(canvas)
		this.camera = this.createCamera()
		this.scene = this.createScene()
		this.clock = new THREE.Clock()

		this.box = this.createBox()

		window.addEventListener('resize', this.resize.bind(this))
		this.renderer.setAnimationLoop(this.render.bind(this))
	}

	private createRenderer(canvas: HTMLCanvasElement) {
		const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setPixelRatio(window.devicePixelRatio)
		return renderer
	}

	private createCamera() {
		const camera = new THREE.PerspectiveCamera(50, this.size.aspect, 0.01, 100)
		camera.position.z = 5
		return camera
	}

	private createScene() {
		const scene = new THREE.Scene()
		scene.background = new THREE.Color('#012')
		return scene
	}

	private get size() {
		const { width, height } = this.renderer.domElement
		return { width, height, aspect: width / height }
	}

	private resize() {
		const { innerWidth: width, innerHeight: height } = window
		this.renderer.setSize(width, height)
		this.camera.aspect = width / height
		this.camera.updateProjectionMatrix()
	}

	private createBox() {
		const geometry = new THREE.BoxGeometry()
		const material = new THREE.MeshBasicMaterial()
		// ----------------------------------------------
		// geometryの観察
		// position: 72 -> 72 / 3(x,y,z) = 24頂点
		// 24 / 8(頂点数) = 3 つまり、1頂点あたり、3つの座標がある
		// ----------------------------------------------
		// material.wireframe = true
		console.log(geometry)

		// ----------------------------------------------
		// materialの観察
		// https://github.com/mrdoob/three.js/tree/master/src/renderers/shaders/ShaderChunk
		// ----------------------------------------------
		material.onBeforeCompile = (shader) => {
			console.log(shader.uniforms)
			console.log(shader.vertexShader)
			console.log(shader.fragmentShader)

			// ----------------------------------------------
			// fragmentShaderの変更
			// ----------------------------------------------
			// shader.fragmentShader = shader.fragmentShader.replace(
			// 	'vec3 outgoingLight = reflectedLight.indirectDiffuse;',
			// 	'vec3 outgoingLight = vec3(1.0, 0.0, 0.0);'
			// )
			// console.log(shader.fragmentShader)

			// ----------------------------------------------
			// uniformの追加
			// ----------------------------------------------
			// Object.assign(shader.uniforms, { uTime: { value: 0 } })
			// material.userData.uniforms = shader.uniforms
			// console.log(shader.uniforms)

			// ----------------------------------------------
			// vertexShaderの変更
			// ----------------------------------------------
			// shader.vertexShader = shader.vertexShader.replace(
			// 	'#include <common>',
			// 	`#include <common>
			// 	uniform float uTime;`
			// )

			// shader.vertexShader = shader.vertexShader.replace(
			// 	'#include <begin_vertex>',
			// 	`vec3 transformed = vec3( position );
			// 	transformed += normal * (sin(uTime) * 0.1 + 0.1);
			// 	`
			// )
			// console.log(shader.vertexShader)

			// ----------------------------------------------
			// これを実行したらどうなるでしょうか？
			// project_vertex：座標系変換の行列計算をしている場所
			// ----------------------------------------------
			// shader.vertexShader = shader.vertexShader.replace(
			// 	'#include <project_vertex>',
			// 	'gl_Position = vec4( transformed, 1.0 );'
			// )
		}

		const mesh = new THREE.Mesh(geometry, material)
		this.scene.add(mesh)
		return mesh
	}

	private render() {
		const dt = this.clock.getDelta()
		this.box.rotation.x += dt * 0.1
		this.box.rotation.y += dt * 0.2
		this.box.rotation.z += dt * 0.3

		if (this.box.material.userData.uniforms) {
			this.box.material.userData.uniforms.uTime.value += dt
		}

		this.renderer.setRenderTarget(null)
		this.renderer.render(this.scene, this.camera)
	}
}

new Canvas(document.querySelector<HTMLCanvasElement>('canvas')!)
