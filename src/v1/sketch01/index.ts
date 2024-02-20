import * as THREE from 'three'
import rawVertexShader from './raw_triangle.vs'
import rawFragmentShader from './raw_triangle.fs'
// import vertexShader from './triangle.vs'
// import fragmentShader from './triangle.fs'

class Canvas {
	private readonly renderer: THREE.WebGLRenderer
	private readonly camera: THREE.PerspectiveCamera
	private readonly scene: THREE.Scene
	private readonly clock: THREE.Clock
	private triangle: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial, THREE.Object3DEventMap>

	constructor(canvas: HTMLCanvasElement) {
		this.renderer = this.createRenderer(canvas)
		this.camera = this.createCamera()
		this.scene = this.createScene()
		this.clock = new THREE.Clock()

		this.triangle = this.createTriangle()

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

	private createTriangle() {
		const geometry = new THREE.BufferGeometry()
		const r3 = 1.7320508
		// prettier-ignore
		const vertices = [
		  -1.0,     -r3 / 3,  0.0,
		   1.0,     -r3 / 3,  0.0,
		   0.0,  2 * r3 / 3,  0.0
		]

		// ----------------------------------------------
		// こういう求め方もできる
		// ----------------------------------------------
		// const c = Math.cos((Math.PI * 2) / 3)
		// const s = Math.sin((Math.PI * 2) / 3)
		// const p1 = [0, 1]
		// const p2 = [c * p1[0] - s * p1[1], s * p1[0] + c * p1[1]]
		// const p3 = [c * p2[0] - s * p2[1], s * p2[0] + c * p2[1]]
		// // prettier-ignore
		// const vertices = [
		// 	p2[0], p2[1], 0.0,
		// 	p3[0], p3[1], 0.0,
		// 	p1[0], p1[1], 0.0
		// ]

		// ----------------------------------------------
		// 逆回りにしたら...
		// ----------------------------------------------
		// const vertices = [
		//   -1.0,     -r3 / 3,  0.0,
		// 	  0.0,  2 * r3 / 3,  0.0,
		//    1.0,     -r3 / 3,  0.0,
		// ]
		// prettier-ignore
		const uv = [
      0.0, 0.0,
      1.0, 0.0,
      0.5, 1.0
    ]
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
		geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))

		// ----------------------------------------------
		// RawShaderMaterialとShaderMaterialの違い
		// https://threejs.org/docs/?q=material#api/en/materials/ShaderMaterial
		// Built-in attributes and uniforms
		// ▼ ここのif-else内で付加してる
		// https://github.com/mrdoob/three.js/blob/02d4c5aa091ea8b6137db5bf1ad38819308246e3/src/renderers/webgl/WebGLProgram.js#L477
		// ----------------------------------------------
		const material = new THREE.RawShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
			},
			vertexShader: rawVertexShader,
			fragmentShader: rawFragmentShader,
		})
		// const material = new THREE.ShaderMaterial({
		// 	uniforms: {
		// 		uTime: { value: 0 },
		// 	},
		// 	vertexShader,
		// 	fragmentShader,
		// })

		// ----------------------------------------------
		// geometryの観察
		// ----------------------------------------------
		console.log(geometry)

		// ----------------------------------------------
		// materialの観察
		// ----------------------------------------------
		material.onBeforeCompile = (shader) => {
			console.log(shader.vertexShader)
			console.log(shader.fragmentShader)

			// ----------------------------------------------
			// shaderObjectへcompileする前の処理なので、shaderの書き換えが可能！
			// ----------------------------------------------
			// shader.fragmentShader = shader.fragmentShader.replace(
			// 	'gl_FragColor = vec4(color, 1.0);',
			// 	'gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), 1.0);'
			// )
		}

		const mesh = new THREE.Mesh(geometry, material)
		this.scene.add(mesh)
		return mesh
	}

	private render() {
		const dt = this.clock.getDelta()
		this.triangle.material.uniforms.uTime.value += dt

		this.renderer.setRenderTarget(null)
		this.renderer.render(this.scene, this.camera)
	}
}

new Canvas(document.querySelector<HTMLCanvasElement>('canvas')!)
