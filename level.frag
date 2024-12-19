#define LOW 0.125
#define HIGH 1.0

// Don't edit anything past this point.

#if __VERSION__ >= 130
#define COMPAT_VARYING in
#define COMPAT_TEXTURE texture
out vec4 FragColor;
#else
#define COMPAT_VARYING varying
#define FragColor gl_FragColor
#define COMPAT_TEXTURE texture2D
#endif

uniform sampler2D Texture;

COMPAT_VARYING vec2 texcoord;

void main(void) {
	vec3 color = COMPAT_TEXTURE(Texture, texcoord.xy).rgb;
	color *= vec3(HIGH - LOW);
	color += vec3(LOW);
	FragColor = vec4(color, 1.0);
}
