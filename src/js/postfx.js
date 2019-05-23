import {
  WebGLRenderTarget,
  OrthographicCamera,
  RGBFormat,
  BufferGeometry,
  BufferAttribute,
  Mesh,
  Scene,
  RawShaderMaterial,
  Vector2,
} from 'three';

import renderer from './renderer';
import { component } from 'bidello';

const vertexShader = `
precision highp float;
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 1.0, 1.0);
}`;

const fragmentShader = `
precision highp float;
uniform sampler2D uScene;
uniform vec2 uResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec3 color = vec3(uv, 1.0);
  color = texture2D(uScene, uv).rgb;

  // Do your cool postprocessing here
  color.g += sin(uv.x * 50.0);

  gl_FragColor = vec4(color, 1.0);
}`;

class PostFX extends component() {
  init() {
    this.renderer = renderer;
    this.scene = new Scene();
    this.dummyCamera = new OrthographicCamera();
    this.geometry = new BufferGeometry();

    const vertices = new Float32Array([
      -1.0, -1.0,
      3.0, -1.0,
      -1.0, 3.0
    ]);

    this.geometry.addAttribute('position', new BufferAttribute(vertices, 2));
    this.resolution = new Vector2();
    this.renderer.getDrawingBufferSize(this.resolution);

    this.target = new WebGLRenderTarget(this.resolution.x, this.resolution.y, {
      format: RGBFormat,
      stencilBuffer: false,
      depthBuffer: true,
    });

    this.material = new RawShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        uScene: { value: this.target.texture },
        uResolution: { value: this.resolution },
      },
    });

    this.triangle = new Mesh(this.geometry, this.material);
    this.triangle.frustumCulled = false;
    this.scene.add(this.triangle);
  }

  onResize() {
    this.renderer.getDrawingBufferSize(this.resolution);
    this.target.setSize(this.resolution.x, this.resolution.y);
  }

  render(scene, camera) {
    this.renderer.setRenderTarget(this.target);
    this.renderer.render(scene, camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.dummyCamera);
  }
}

export default new PostFX();