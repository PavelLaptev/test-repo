shader_type canvas_item;

// Sample shader uniforms
uniform float brightness : hint_range(0.0, 2.0) = 1.0;
uniform float contrast : hint_range(0.0, 2.0) = 1.0;
uniform vec4 tint_color : hint_color = vec4(1.0);
uniform float time_speed : hint_range(0.0, 5.0) = 1.0;

// Sample varying
varying vec2 world_position;

void vertex() {
	world_position = VERTEX;
}

void fragment() {
	// Get the base texture color
	vec4 tex_color = texture(TEXTURE, UV);
	
	// Apply brightness and contrast
	tex_color.rgb *= brightness;
	tex_color.rgb = (tex_color.rgb - 0.5) * contrast + 0.5;
	
	// Apply tint
	tex_color *= tint_color;
	
	// Add some animated effect
	float wave = sin(TIME * time_speed + UV.x * 10.0) * 0.1;
	tex_color.rgb += wave;
	
	// Apply alpha
	tex_color.a *= COLOR.a;
	
	COLOR = tex_color;
}
