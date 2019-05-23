import { component } from 'bidello';
import {
  Object3D,
  BoxBufferGeometry,
  Mesh
} from 'three';
import MagicShader from 'magicshader';

export default class extends component(Object3D) {
  init() {
    this.geometry = new BoxBufferGeometry(1, 1, 1);
    this.material = new MagicShader({
      name: 'Cube',
      vertexShader: `
      precision highp float;
      
      attribute vec3 position;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
  
      uniform vec3 color; // ms({ value: '#ff0000' })
  
      void main() {
        gl_FragColor = vec4(color, 1.0);
      }
    `
    })
    this.mesh = new Mesh(this.geometry, this.material);

    this.add(this.mesh);
  }

  onRaf({ delta }) {
    this.mesh.rotation.x += 0.3 * delta;
    this.mesh.rotation.y += 0.3 * delta;
  }
}