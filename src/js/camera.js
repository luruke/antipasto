import { PerspectiveCamera, Vector3 } from 'three';
import { component } from 'bidello';
import OrbitControls from 'orbit-controls-es6';
import renderer from './renderer';

class Camera extends component(PerspectiveCamera) {
  constructor() {
    super(35, 0, 0.1, 500);

    this.position.set(0, 0, 10);
    this.lookAt(new Vector3(0, 0, 0));
    this.initOrbitControl();
  }

  initOrbitControl() {
    const controls = new OrbitControls(this, renderer.domElement);

    controls.enabled = true;
    controls.maxDistance = 1500;
    controls.minDistance = 0;
  }

  onResize({ ratio }) {
    this.aspect = ratio;
    this.updateProjectionMatrix();
  }
}

export default new Camera();