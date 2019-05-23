import { WebGLRenderer } from 'three';
import { component } from 'bidello';

class Renderer extends component(WebGLRenderer) {
  constructor() {
    super({
      powerPreference: 'high-performance',
      antialiasing: false,
    })
  }

  onResize({ width, height }) {
    this.setSize(width, height);
  }
}

export default new Renderer();