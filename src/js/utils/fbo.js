/*
this.position = new FBO({
  width: 128,
  height: 128,
  name: 'position',
  shader: require('./position.frag'),
  uniforms: {
    uTime: {
      value: 0
    },
  },
});

this.position.target
this.position.update()
*/

import {
  WebGLRenderTarget,
  NearestFilter,
  DataTexture,
  RGBAFormat,
  FloatType,
  HalfFloatType,
  Camera,
  Scene,
  Mesh,
  PlaneBufferGeometry,
  MeshBasicMaterial,
} from 'three';
import MagicShader from 'magicshader';
import renderer from '/js/renderer';
import triangle from './triangle';
import camera from '/js/camera';

export const isAvailable = (() => {
  const gl = renderer.getContext();

  if (!gl.getExtension('OES_texture_float')) {
    return false;
  }

  if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) === 0) {
    return false;
  }

  return true;
})();

const iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
const type = iOS ? HalfFloatType : FloatType;

export default class FBO {
  constructor({
    width,
    height,
    data,
    name,
    shader,
    texture,
    uniforms = {},
    rtOptions = {},
    debug = false
  }) {
    this.options = arguments[0];
    this.renderer = renderer;
    this.camera = new Camera();
    this.scene = new Scene();
    this.index = 0;
    this.copyData = true;
    this.texture = texture || new DataTexture(
      data || new Float32Array((width * height * 4)),
      width,
      height,
      RGBAFormat,
      FloatType,
      // type,
    );
    this.texture.needsUpdate = true;

    this.rt = [this.createRT(), this.createRT()];

    this.material = new MagicShader({
      name: name || 'FBO',
      defines: {
        RESOLUTION: `vec2(${width.toFixed(1)}, ${height.toFixed(1)})`
      },
      uniforms: {
        ...uniforms,
        texture: {
          value: this.texture
        }
      },
      vertexShader: `
        precision highp float;
        attribute vec3 position;

        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: shader || `
        precision highp float;
        uniform sampler2D texture;

        void main() {
          vec2 uv = gl_FragCoord.xy / RESOLUTION.xy;
          gl_FragColor = texture2D(texture, uv);
        }
      `,
    });

    this.mesh = new Mesh(triangle, this.material);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);

    if (this.options.debug) {
      this.initDebug();
    }
  }

  initDebug() {
    this.debugGeometry = new PlaneBufferGeometry(2, 2);
    this.debugMaterial = new MeshBasicMaterial({
      map: this.target,
    });

    this.debugMesh = new Mesh(this.debugGeometry, this.debugMaterial);
    this.debugMesh.position.set(0, 0, -5);

    camera.add(this.debugMesh);
  }

  createRT() {
    return new WebGLRenderTarget(this.options.width, this.options.height, Object.assign({
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      stencilBuffer: false,
      depthBuffer: false,
      depthWrite: false,
      depthTest: false,
      type,
    }, this.options.rtOptions));
  }

  get target() {
    return this.rt[this.index].texture;
  }

  get uniforms() {
    return this.material.uniforms;
  }
  
  // TODO: test...
  resize(width, height) {
    this.material.defines.RESOLUTION = `vec2(${width.toFixed(1)}, ${height.toFixed(1)})`;
    this.options.width = width;
    this.options.height = height;

    this.rt.forEach(rt => {
      rt.setSize(width, height);
    });
  }

  update(switchBack = true) {
    const destIndex = this.index === 0 ? 1 : 0;
    const old = this.rt[this.index];
    const dest = this.rt[destIndex];

    this.material.uniforms.texture.value = this.copyData ? this.texture : old.texture;

    const oldMainTarget = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(dest);
    this.renderer.render(this.scene, this.camera);
    switchBack && this.renderer.setRenderTarget(oldMainTarget);

    this.index = destIndex;
    this.copyData = false;
  }
}
