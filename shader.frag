#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform float u_time;

float circle(vec2 pos, vec2 center, float radius) {
    float d = length(pos - center);
    float t = 0.01; // Line thickness
    return smoothstep(radius - t, radius, d) - smoothstep(radius, radius + t, d);
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_resolution.x/u_resolution.y;
    
    float rotation = u_time * 0.2;
    mat2 rot = mat2(cos(rotation), -sin(rotation),
                    sin(rotation), cos(rotation));
    uv = rot * uv;
    
    float scale = 1.0 + sin(u_time) * 0.2;
    uv *= scale;
    
    float pattern = 0.0;
    
    // Center circle
    pattern += circle(uv, vec2(0.0), 0.3);
    
    // Surrounding circles
    for(float i = 0.0; i < 6.0; i++) {
        float angle = i * 3.14159 * 2.0 / 6.0;
        vec2 center = vec2(cos(angle), sin(angle)) * 0.3;
        pattern += circle(uv, center, 0.3);
        
        // Second layer
        for(float j = 0.0; j < 6.0; j++) {
            float angle2 = j * 3.14159 * 2.0 / 6.0;
            vec2 offset = vec2(cos(angle2), sin(angle2)) * 0.3;
            pattern += circle(uv, center + offset, 0.3) * 0.5;
        }
    }
    
    vec3 color = vec3(pattern);
    gl_FragColor = vec4(color, 1.0);
} 