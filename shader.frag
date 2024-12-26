#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform float u_time;

float circle(vec2 pos, vec2 center, float radius) {
    float d = length(pos - center);
    float t = 0.008; // Thinner lines
    return smoothstep(radius - t, radius, d) - smoothstep(radius, radius + t, d);
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_resolution.x/u_resolution.y;
    
    // Add wave distortion
    float wave = sin(uv.x * 3.0 + u_time) * 0.02;
    uv.y += wave;
    
    // Dynamic rotation speed
    float rotation = u_time * 0.2 + sin(u_time * 0.5) * 0.3;
    mat2 rot = mat2(cos(rotation), -sin(rotation),
                    sin(rotation), cos(rotation));
    uv = rot * uv;
    
    // Breathing effect with multiple frequencies
    float scale = 1.0 + sin(u_time) * 0.1 + sin(u_time * 0.5) * 0.1;
    uv *= scale;
    
    float pattern = 0.0;
    
    // Multiple layers with different rotations
    for(float layer = 0.0; layer < 3.0; layer++) {
        vec2 uv2 = uv;
        float layerTime = u_time * (0.1 + layer * 0.1);
        mat2 layerRot = mat2(cos(layerTime), -sin(layerTime),
                            sin(layerTime), cos(layerTime));
        uv2 = layerRot * uv2;
        
        // Center circle
        pattern += circle(uv2, vec2(0.0), 0.3) * (1.0 - layer * 0.2);
        
        // Surrounding circles
        for(float i = 0.0; i < 6.0; i++) {
            float angle = i * 3.14159 * 2.0 / 6.0;
            vec2 center = vec2(cos(angle), sin(angle)) * 0.3;
            pattern += circle(uv2, center, 0.3) * (1.0 - layer * 0.2);
            
            // Second layer with dynamic radius
            for(float j = 0.0; j < 6.0; j++) {
                float angle2 = j * 3.14159 * 2.0 / 6.0;
                float radiusOffset = sin(u_time * 2.0 + i + j) * 0.02;
                vec2 offset = vec2(cos(angle2), sin(angle2)) * (0.3 + radiusOffset);
                pattern += circle(uv2, center + offset, 0.3) * 0.3;
            }
        }
    }
    
    // Add subtle color variation
    vec3 color1 = vec3(1.0, 1.0, 1.0);  // White
    vec3 color2 = vec3(0.9, 0.95, 1.0);  // Slight blue tint
    vec3 color = mix(color1, color2, sin(u_time) * 0.5 + 0.5);
    
    // Add glow effect
    float glow = pattern * (0.8 + sin(u_time * 2.0) * 0.2);
    color *= glow;
    
    gl_FragColor = vec4(color, 1.0);
} 