// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Scene } from 'three';
import { component } from 'bidello';
import Cube from './cube/cube';

class Stage extends component(Scene) {
  init() {
    this.add(new Cube());
  }
}

export default new Stage();