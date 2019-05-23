import { PerspectiveCamera, Vector3 } from 'three';
import { component } from 'bidello';

class Camera extends component(PerspectiveCamera) {
  constructor() {
    super(35, 0, 0.1, 500);

    this.position.set(0, 0, -10);
    this.lookAt(new Vector3(0, 0, 0));
  }

  onResize({ ratio }) {
    this.aspect = ratio;
    this.updateProjectionMatrix();
  }
}

export default new Camera();