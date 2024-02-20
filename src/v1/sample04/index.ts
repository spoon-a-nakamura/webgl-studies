import * as THREE from 'three'
import { Three } from './Three'

class Canvas extends Three {
	private sun!: THREE.Mesh
	private earth!: THREE.Mesh

	constructor(canvas: HTMLCanvasElement) {
		super(canvas)

		this.init()
		this.createPlanet()
		this.renderer.setAnimationLoop(this.render.bind(this))
	}

	private init() {
		this.scene.background = new THREE.Color('#000')
		// this.camera.position.z = 12
		this.camera.position.set(0, -10, 5)
		this.camera.lookAt(0, 0, 0)
	}

	private createPlanet() {
		const sunGeo = new THREE.IcosahedronGeometry(1, 5)
		const sunMat = new THREE.MeshBasicMaterial({ color: '#f05e1c', wireframe: true })
		const sun = new THREE.Mesh(sunGeo, sunMat)

		const earthGeo = new THREE.IcosahedronGeometry(0.5, 5)
		const earthMat = new THREE.MeshBasicMaterial({ color: '#459ad8', wireframe: true })
		const earth = new THREE.Mesh(earthGeo, earthMat)
		earth.position.x = 5

		const moonGeo = new THREE.IcosahedronGeometry(0.1, 5)
		const moonMat = new THREE.MeshBasicMaterial({ color: '#f0e152' })
		const moon = new THREE.Mesh(moonGeo, moonMat)
		moon.position.x = 1

		const orbitEarthGeo = new THREE.TorusGeometry(5, 0.01, 3, 100)
		const orbitEarthMat = new THREE.MeshBasicMaterial({ color: '#555' })
		const orbitEarth = new THREE.Mesh(orbitEarthGeo, orbitEarthMat)

		const orbitMoonGeo = new THREE.TorusGeometry(1, 0.01, 3, 100)
		const orbitMoonMat = new THREE.MeshBasicMaterial({ color: '#555' })
		const orbitMoon = new THREE.Mesh(orbitMoonGeo, orbitMoonMat)

		sun.add(earth)
		sun.add(orbitEarth)
		earth.add(moon)
		earth.add(orbitMoon)

		this.scene.add(sun)

		this.sun = sun
		this.earth = earth

		// ----------------------------------------------
		// 月のVertexShaderで、modelMatrixを掛けなかったらどうなる？
		// ----------------------------------------------
		moonMat.onBeforeCompile = (shader) => {
			console.log(shader.vertexShader)
			// shader.vertexShader = shader.vertexShader.replace(
			// 	'#include <project_vertex>',
			// 	'gl_Position = projectionMatrix * viewMatrix * vec4( transformed, 1.0 );'
			// )
		}
	}

	protected render() {
		this.updateTime()

		this.sun.rotation.z += this.time.delta * 0.5
		this.earth.rotation.z += this.time.delta

		super.render()
	}
}

new Canvas(document.querySelector<HTMLCanvasElement>('canvas')!)
