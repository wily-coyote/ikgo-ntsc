#define IMAGE_SIZE vec2(640.0, 480.0)
#define BORDER vec2(8.0, 4.0)

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
	vec2 normal = BORDER / IMAGE_SIZE;
	normal = step(normal, texcoord) * (vec2(1.0) - step(vec2(1.0) - normal, texcoord));
	float inside = normal.x * normal.y;
	vec3 color = COMPAT_TEXTURE(Texture, texcoord).rgb * inside;
	FragColor = vec4(color, 1.0);
}
