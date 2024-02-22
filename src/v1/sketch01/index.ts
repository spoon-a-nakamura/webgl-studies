import * as THREE from 'three';
import { ThreeBase } from './ThreeBase';
import rawVertexShader from './raw_triangle.vs';
import rawFragmentShader from './raw_triangle.fs';

class Canvas extends ThreeBase {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.init();
    this.createTriangle();
  }

  private init() {
    this.scene.background = new THREE.Color('#111');
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
  }

  private createTriangle() {
    const geometry = new THREE.BufferGeometry();
    const r3 = 1.7320508;

    // prettier-ignore
    const vertices = [
			-1.0,	-r3 / 3,		0.0,
			1.0,	-r3 / 3,		0.0,
			0.0,	2 * r3 / 3,	0.0
		]

    // prettier-ignore
    const uv = [
      0.0, 1.0,
      1.0, 1.2,
      0.8, 0.6
    ]

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: rawVertexShader,
      fragmentShader: rawFragmentShader,
    });

    console.log(geometry);

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  }

  protected render() {
    this.updateTime();
    super.render();
  }
}

new Canvas(document.querySelector<HTMLCanvasElement>('canvas')!);
