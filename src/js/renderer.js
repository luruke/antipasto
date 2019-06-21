import { WebGLRenderer } from 'three';
import { component } from 'bidello';
import settings from './settings';

class Renderer extends component(WebGLRenderer) {
  constructor() {
    super({
      powerPreference: 'high-performance',
      antialiasing: false,
    });

    // this.gammaFactor = 2.2;
    // this.gammaInput = true;
    // this.gammaOutput = true;

    this.setPixelRatio(settings.dpr);
  }

  onResize({ width, height }) {
    this.setSize(width, height);
  }
}

export default new Renderer();
