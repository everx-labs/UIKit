precision mediump float;

struct ShimmerUniforms {
    float gradientWidth;
    float skew;
    float progressShift;
    vec2 resolution;
    vec4 backgroundColor;
    vec4 accentColor;
};

uniform ShimmerUniforms inUniforms;

#define PI 3.14159265359

float normalizeX(float x, float min, float max) {
    return (x - min) / (max - min);
}

vec4 mirroredLinearHorizontalGradient(float x) {
    if (x < 0.5) {
        float nx = normalizeX(x, 0.0, 0.5);
        return smoothstep(0.0, 1.0, vec4(vec3(nx, nx, nx), 1.0));
    } else {
        float nx = 1.0 - normalizeX(x, 0.5, 1.0);
        return smoothstep(0.0, 1.0, vec4(vec3(nx, nx, nx), 1.0));
    }
}

vec4 gradient(vec4 accent, vec4 background, float x, float min, float max) {
    if (x < min || x > max) {
        return background;
    }

    float nx = normalizeX(x, min, max);

    return mix(background, accent, mirroredLinearHorizontalGradient(nx));
}

void main() {
    // // This is for debug purpose
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // gl_FragColor = inUniforms.backgroundColor;
    // return;
    float gradientWidth = inUniforms.gradientWidth / inUniforms.resolution.x;
    vec2 currentPoint = gl_FragCoord.xy / inUniforms.resolution;
    float ratio = inUniforms.resolution.y / inUniforms.resolution.x;
    float skewX = currentPoint.y * tan(inUniforms.skew * (PI / 180.0)) * ratio;

    gl_FragColor = gradient(
        inUniforms.accentColor, 
        inUniforms.backgroundColor, 
        currentPoint.x, 
        0.0 + skewX, 
        gradientWidth + skewX
    );
}