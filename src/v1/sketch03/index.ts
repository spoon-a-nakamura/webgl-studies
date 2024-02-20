import * as THREE from 'three'
import { Three } from './Three'

class Canvas extends Three {
	private box: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>

	constructor(canvas: HTMLCanvasElement) {
		super(canvas)

		this.init()
		this.box = this.createBox()
		this.renderer.setAnimationLoop(this.render.bind(this))
	}

	private init() {
		this.scene.background = new THREE.Color('#012')
	}

	private createBox() {
		const geometry = new THREE.BoxGeometry()
		const material = new THREE.MeshBasicMaterial()
		const mesh = new THREE.Mesh(geometry, material)
		this.scene.add(mesh)
		return mesh
	}

	protected render() {
		this.updateTime()

		this.box.rotation.x += this.time.delta * 0.1
		this.box.rotation.y += this.time.delta * 0.2
		this.box.rotation.z += this.time.delta * 0.3

		super.render()
	}
}

new Canvas(document.querySelector<HTMLCanvasElement>('canvas')!)
