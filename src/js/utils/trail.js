import { component } from 'bidello';
import FBO from './fbo';
import { Vector2, LinearFilter } from 'three';

const shader = `
precision highp float;

uniform sampler2D texture;
uniform vec2 uPointer;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
  uv -= disc_center;
  float dist = sqrt(dot(uv, uv));
  return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
}

void main() {
  vec2 uv = gl_FragCoord.xy / RESOLUTION.xy;
  vec4 color = texture2D(texture, uv);

  color.rgb += circle(uv, uPointer, 0.0, 0.1);
  color.rgb = mix(color.rgb, vec3(0.0), .009);
  color.rgb = clamp(color.rgb, vec3(0.0), vec3(1.0));
  color.a = 1.0;

  gl_FragColor = color;
}
`;

class Trail extends component() {
  init() {
    this.fbo = new FBO({
      width: 256,
      height: 256,
      name: 'trail',
      shader,
      uniforms: {
        uPointer: { value: new Vector2() }
      },
      rtOptions: {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
      },
      // debug: true,
    });

    this.pointerTarget = new Vector2();
  }

  onPointerMove({ pointer }) {
    this.pointerTarget.set(
      pointer.x / window.innerWidth,
      1 - (pointer.y / window.innerHeight)
    );
  }

  onRaf({ delta }) {
    // this.fbo.uniforms.uPointer.value.lerp(this.pointerTarget, 7 * delta);
    this.fbo.uniforms.uPointer.value.copy(this.pointerTarget);
    this.fbo.update();
  }
}

export default new Trail();