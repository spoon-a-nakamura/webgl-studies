import * as THREE from 'three';
import { ThreeBase } from './ThreeBase';
import rawVertexShader from './raw_triangle.vs';
import rawFragmentShader from './raw_triangle.fs';

class Canvas extends ThreeBase {
  private square: THREE.Mesh<
    THREE.BufferGeometry,
    THREE.ShaderMaterial,
    THREE.Object3DEventMap
  >;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, true);
    this.init();
    this.square = this.createSquare();
  }

  private init() {
    this.scene.background = new THREE.Color('#111');
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
  }

  private createSquare() {
    const geometry = new THREE.BufferGeometry();

    // prettier-ignore
    const vertices = [
      -1.0, -1.0, 0.0, // 左下
      1.0, -1.0, 0.0,  // 左上
      1.0,  1.0, 0.0,  // 右上
      -1.0,  1.0, 0.0, // 右下
    ];

    // prettier-ignore
    const indices = [
      0, 1, 2, // ひとつめ
      2, 3, 0  // ふたつめ
    ];

    geometry.setIndex(indices);
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: rawVertexShader,
      fragmentShader: rawFragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  }

  protected render() {
    this.updateTime();
    // this.camera.position.z += this.time.delta * -0.3;
    // this.square.rotation.z += this.time.delta * this.time.elapsed;
    this.square.material.uniforms.uTime.value = this.time.elapsed;
    super.render();
  }
}

new Canvas(document.querySelector<HTMLCanvasElement>('canvas')!);
