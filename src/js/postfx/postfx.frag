precision highp float;
uniform sampler2D uScene;
uniform vec2 uResolution;

#ifdef FXAA
  #pragma glslify: fxaa = require(glsl-fxaa)
#endif

void main() {
  #ifdef FXAA
  	vec3 color = fxaa(uScene, gl_FragCoord.xy, uResolution).rgb;
  #else
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec3 color = texture2D(uScene, uv).rgb;
  #endif

  gl_FragColor = vec4(color, 1.0);
}