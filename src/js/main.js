import * as helpers from 'bidello/helpers';
import renderer from './renderer';
import camera from './camera';
import scene from './scene';
import { component } from 'bidello';
import settings from './settings';
import postfx from './postfx';

class Site extends component() {
  init() {
    document.body.appendChild(renderer.domElement);
  }

  onRaf() {
    // renderer.render(scene, camera);
    postfx.render(scene, camera);
  }
}

new Site();