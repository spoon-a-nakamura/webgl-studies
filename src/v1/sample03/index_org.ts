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
		const mesh = new THREE.Mesh(geometry, material)
		this.scene.add(mesh)
		return mesh
	}

	private render() {
		const dt = this.clock.getDelta()
		this.box.rotation.x += dt * 0.1
		this.box.rotation.y += dt * 0.2
		this.box.rotation.z += dt * 0.3

		this.renderer.setRenderTarget(null)
		this.renderer.render(this.scene, this.camera)
	}
}

new Canvas(document.querySelector<HTMLCanvasElement>('canvas')!)
