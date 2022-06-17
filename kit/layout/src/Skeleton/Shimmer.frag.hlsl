struct ShimmerInput {
    float4 pos : SV_Position;
    float2 u_resolution;
};

#define PI 3.14159265359

float normalizeX(float x, float min, float max) {
    return (x - min) / (max - min);
}

float4 mirroredLinearHorizontalGradient(float x) {
    if (x < 0.5) {
        float nx = normalizeX(x, 0.0, 0.5);
        return smoothstep(0.0, 1.0, float4(float3(nx, nx, nx), 1.0));
    } else {
        float nx = 1.0 - normalizeX(x, 0.5, 1.0);
        return smoothstep(0.0, 1.0, float4(float3(nx, nx, nx), 1.0));
    }
}

float4 gradient(float4 accent, float4 background, float x, float min, float max) {
    if (x < min) {
        return background;
    }

    if (x > max) {
        return background;
    }

    float nx = normalizeX(x, min, max);

    return lerp(background, accent, mirroredLinearHorizontalGradient(nx));
}

float4 shimmer_frag(ShimmerInput input) : SV_Target {
    // TODO: uniforms
    float gradientWidth = 0.4;
    float skewDegrees = 15.0;
    float4 backgroundColor = float4(float3(0.451, 0.451, 0.451), 1.0);
    float4 accentColor = float4(float3(1.0, 1.0, 1.0), 1.0);

    float2 currentPoint = input.pos.xy / input.u_resolution;

    float ratio = input.u_resolution.y / input.u_resolution.x;
    float skewX = currentPoint.y * tan(skewDegrees * (PI / 180.0)) * ratio;

    return gradient(
        accentColor, 
        backgroundColor, 
        currentPoint.x, 
        0.0 + skewX, 
        gradientWidth + skewX
    );
}