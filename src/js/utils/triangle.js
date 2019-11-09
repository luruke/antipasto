import {
  BufferGeometry,
  BufferAttribute,
} from 'three';

const vertices = new Float32Array([
  -1.0, -1.0,
  3.0, -1.0,
  -1.0, 3.0
]);

const geometry = new BufferGeometry();
geometry.setAttribute('position', new BufferAttribute(vertices, 2));

export default geometry;