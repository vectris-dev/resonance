#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_sentiment;

float circle(vec2 pos, vec2 center, float radius) {
    float d = length(pos - center);
    float t = 0.005; // Thinner lines
    return smoothstep(radius - t, radius, d) - smoothstep(radius, radius + t, d);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_resolution.x/u_resolution.y;
    
    float scale = 1.0 + sin(u_time * (0.5 + u_sentiment)) * (0.1 + u_sentiment * 0.2);
    uv *= scale;
    
    float pattern = 0.0;
    
    float timeScale = u_time * (0.5 + u_sentiment * 1.5);
    
    for(float layer = 0.0; layer < 3.0; layer++) {
        vec2 uv2 = uv;
        float layerTime = timeScale * (0.1 + layer * 0.1);
        mat2 layerRot = mat2(cos(layerTime), -sin(layerTime),
                            sin(layerTime), cos(layerTime));
        uv2 = layerRot * uv2;
        
        float baseRadius = 0.3 + u_sentiment * 0.1;
        
        pattern += circle(uv2, vec2(0.0), baseRadius) * (1.0 - layer * 0.2);
        
        for(float i = 0.0; i < 6.0; i++) {
            float angle = i * 3.14159 * 2.0 / 6.0;
            vec2 center = vec2(cos(angle), sin(angle)) * baseRadius;
            pattern += circle(uv2, center, baseRadius) * (1.0 - layer * 0.2);
            
            for(float j = 0.0; j < 6.0; j++) {
                float angle2 = j * 3.14159 * 2.0 / 6.0;
                float radiusOffset = sin(timeScale * 2.0 + i + j) * 0.02;
                vec2 offset = vec2(cos(angle2), sin(angle2)) * (baseRadius + radiusOffset);
                pattern += circle(uv2, center + offset, baseRadius) * 0.3;
            }
        }
    }
    
    float baseHue = mix(0.0, 0.7, u_sentiment);
    float hueVariation = sin(uv.x * 3.0 + uv.y * 2.0 + u_time * 0.2) * 0.1;
    float hue = mod(baseHue + hueVariation, 1.0);
    
    float saturation = mix(0.6, 0.9, 
        sin(uv.x * 2.0) * 0.5 + 0.5 * 
        sin(uv.y * 2.0 + u_time * 0.3) * 0.5 + 0.5);
    
    float brightness = 0.8 + u_sentiment * 0.2 * 
        (sin(uv.x * 4.0 + u_time) * 0.5 + 0.5);
    
    vec3 color = hsv2rgb(vec3(hue, saturation, brightness));
    
    float accentHue = mod(baseHue + 0.5, 1.0);
    vec3 accentColor = hsv2rgb(vec3(accentHue, saturation * 0.8, brightness * 1.2));
    
    color = mix(color, accentColor, 
        pattern * 0.3 * (sin(u_time + uv.x * 2.0) * 0.5 + 0.5));
    
    float glowIntensity = 0.8 + u_sentiment * 0.4;
    float glow = pattern * (glowIntensity + sin(timeScale * 2.0) * 0.2);
    color *= glow;
    
    gl_FragColor = vec4(color, 1.0);
} 