// RetroArch NTSC for IKEMENGO - below are settings
// Make sure these settings match those of Pass 2.

#define TWO_PHASE
//#define THREE_PHASE
#define COMPOSITE
//#define SVIDEO

#define DISPLAY_SIZE vec2(320.0,240.0)
#define NTSC_CRT_GAMMA 2.5
#define NTSC_MONITOR_GAMMA 2.0

// Don't edit anything beyond this point.

#pragma format R8G8B8A8_SRGB

#if __VERSION__ >= 130
#define COMPAT_VARYING in
#define COMPAT_TEXTURE texture
out vec4 FragColor;
in vec3 vTexCoord;
#else
#define COMPAT_VARYING varying 
#define COMPAT_TEXTURE texture2D
#define vTexCoord gl_TexCoord[0]
#define FragColor gl_FragColor
#endif

uniform sampler2D Texture;
uniform vec2 TextureSize;
uniform float CurrentTime;

#define PI 3.14159265
#if defined(TWO_PHASE)
	#define CHROMA_MOD_FREQ (4.0 * PI / 15.0)
#elif defined(THREE_PHASE)
	#define CHROMA_MOD_FREQ (PI / 3.0)
#endif
#if defined(COMPOSITE)
	#define SATURATION 1.0
	#define BRIGHTNESS 1.0
	#define ARTIFACTING 1.0
	#define FRINGING 1.0
#elif defined(SVIDEO)
	#define SATURATION 1.0
	#define BRIGHTNESS 1.0
	#define ARTIFACTING 0.0
	#define FRINGING 0.0
#endif

mat3 mix_mat = mat3(
	BRIGHTNESS, FRINGING, FRINGING,
	ARTIFACTING, 2.0 * SATURATION, 0.0,
	ARTIFACTING, 0.0, 2.0 * SATURATION
);

// begin ntsc-rgbyuv
const mat3 yiq2rgb_mat = mat3(
   1.0, 0.956, 0.6210,
   1.0, -0.2720, -0.6474,
   1.0, -1.1060, 1.7046);

vec3 yiq2rgb(vec3 yiq)
{
   return yiq * yiq2rgb_mat;
}

const mat3 yiq_mat = mat3(
      0.2989, 0.5870, 0.1140,
      0.5959, -0.2744, -0.3216,
      0.2115, -0.5229, 0.3114
);

vec3 rgb2yiq(vec3 col)
{
   return col * yiq_mat;
}
// end ntsc-rgbyuv

void main(void){
	// begin ntsc-pass1
	
	float FrameCount = floor(mod(CurrentTime*60.0, 2.0));
   	
	vec3 col = COMPAT_TEXTURE(Texture, vTexCoord.xy).rgb;
	vec3 yiq = rgb2yiq(col);
	
	vec2 pix_no = vTexCoord.xy * DISPLAY_SIZE * vec2(4.0, 1.0);
	#if defined(TWO_PHASE)
		float chroma_phase = PI * (mod(pix_no.y, 2.0) + float(FrameCount));
	#elif defined(THREE_PHASE)
		float chroma_phase = 0.6667 * PI * (mod(pix_no.y, 3.0) + float(FrameCount));
	#endif
	float mod_phase = chroma_phase + pix_no.x * CHROMA_MOD_FREQ;
	
	float i_mod = cos(mod_phase);
	float q_mod = sin(mod_phase);

	yiq.yz *= vec2(i_mod, q_mod); // Modulate.
	yiq *= mix_mat; // Cross-talk.
	yiq.yz *= vec2(i_mod, q_mod); // Demodulate.

	FragColor = vec4(yiq, 1.0);

	// end ntsc-pass1
}
