import * as THREE from 'three';
import { ThreeBase } from './ThreeBase';
import VertexShader from './triangle.vs';
import FragmentShader from './triangle.fs';

class Canvas extends ThreeBase {
  private hexagons: THREE.Mesh[] = [];
  private hexagonSize = 1; // Size of a single hexagon, adjust as needed
  private hexagonCount = 100; // Total number of hexagons to animate

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, true);
    this.init();
    this.createHexagon(new THREE.Vector3(0.5, 0.5, 0), this.hexagonSize);
    // this.createHexagons();
    // this.animateHexagons();
  }

  private init() {
    this.scene.background = new THREE.Color('#111');
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
  }

  private createHexagon(center: THREE.Vector3, size: number): THREE.Mesh {
    const vertices = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      vertices.push(
        center.x + size * Math.cos(angle),
        center.y + size * Math.sin(angle),
        0
      );
    }
    // 六角形を形成するために最初の頂点を再度追加
    vertices.push(vertices[0], vertices[1], 0);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.ShaderMaterial({
      vertexShader: VertexShader,
      fragmentShader: FragmentShader,
      uniforms: {
        uColor: {
          value: new THREE.Color(Math.random(), Math.random(), Math.random()),
        },
      },
    });
    console.log(geometry);

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  }
  private createHexagons() {
    const hexWidth = Math.sqrt(3) * this.hexagonSize;
    const hexHeight = 2 * this.hexagonSize;
    let offsetX = -((this.hexagonCount / 10) * hexWidth) / 2;
    let offsetY = -((this.hexagonCount / 10) * hexHeight) / 2;
    for (let i = 0; i < this.hexagonCount; i++) {
      const col = Math.floor(i / 10);
      const row = i % 10;
      const x = offsetX + col * (hexWidth * 0.75);
      const y = offsetY + row * hexHeight + (col % 2) * (hexHeight / 2);
      const hexagon = this.createHexagon(
        new THREE.Vector3(x, y, 0),
        this.hexagonSize
      );
      // hexagon.visible = false;
      this.hexagons.push(hexagon);
      this.scene.add(hexagon);
    }
  }

  private animateHexagons(): void {
    const totalDuration = 10000; // アニメーションの総時間 (ms)
    const hexagons: THREE.Mesh[] = [];
    const hexagonCount = 300; // 生成する六角形の総数
    const hexagonSize = 0.1; // 六角形の一辺の長さ
    const hexWidth = hexagonSize * 2; // 六角形の幅
    const hexHeight = Math.sqrt(3) * hexagonSize; // 六角形の高さ
    const columnWidth = 1.5 * hexagonSize; // 列間の幅

    for (let i = 0; i < hexagonCount; i++) {
      const column = Math.floor(i / (hexagonCount / 10));
      const row = i % (hexagonCount / 10);
      const x = column * columnWidth;
      const y = row * hexHeight + (column % 2) * (hexHeight / 2); // 偶数列は半分ずらす
      const center = new THREE.Vector3(x, y, 0);
      const hexagon = this.createHexagon(center, hexagonSize);
      hexagons.push(hexagon);
      this.scene.add(hexagon);
      hexagon.visible = false; // 初期状態では非表示
    }

    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const progress = elapsedTime / totalDuration;
      const visibleCount = Math.min(
        hexagonCount,
        Math.ceil(progress * hexagonCount)
      );

      for (let i = 0; i < visibleCount; i++) {
        hexagons[i].visible = true;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  protected render() {
    this.updateTime();
    super.render();
  }
}

new Canvas(document.querySelector<HTMLCanvasElement>('canvas')!);
