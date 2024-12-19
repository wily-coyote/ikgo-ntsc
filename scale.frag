// Negative values adds a border to the image
// Positive values crop the image
#define IMAGE_SIZE vec2(640.0, 480.0)
#define BORDER vec2(-8.0, -4.0)

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
	vec2 border = BORDER / IMAGE_SIZE;
	vec2 coord = (texcoord.xy * (vec2(1.0) - (border * vec2(2.0)))) + border;
	vec2 normal = step(vec2(0.0), coord) * (vec2(1.0)-step(vec2(1.0), coord));
	float inside = normal.x * normal.y;
	vec3 color = COMPAT_TEXTURE(Texture, coord).rgb * inside;
	FragColor = vec4(color, 1.0);
}
