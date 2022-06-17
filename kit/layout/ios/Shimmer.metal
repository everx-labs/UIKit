//
//  Shimmer.metal
//  UIKitLayout
//
//  Created by Aleksei Savelev on 15.06.2022.
//

#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct ShimmerInput
{
    float4 pos;
    float2 u_resolution;
};

struct shimmer_frag_out
{
    float4 _entryPointOutput [[color(0)]];
};

struct shimmer_frag_in
{
    float2 input_u_resolution [[user(locn0)]];
};

static inline __attribute__((always_inline))
float normalizeX(thread const float& x, thread const float& _min, thread const float& _max)
{
    return (x - _min) / (_max - _min);
}

static inline __attribute__((always_inline))
float4 mirroredLinearHorizontalGradient(thread const float& x)
{
    if (x < 0.5)
    {
        float param = x;
        float param_1 = 0.0;
        float param_2 = 0.5;
        float nx = normalizeX(param, param_1, param_2);
        return smoothstep(float4(0.0), float4(1.0), float4(float3(nx, nx, nx), 1.0));
    }
    else
    {
        float param_3 = x;
        float param_4 = 0.5;
        float param_5 = 1.0;
        float nx_1 = 1.0 - normalizeX(param_3, param_4, param_5);
        return smoothstep(float4(0.0), float4(1.0), float4(float3(nx_1, nx_1, nx_1), 1.0));
    }
}

static inline __attribute__((always_inline))
float4 gradient(thread const float4& accent, thread const float4& background, thread const float& x, thread const float& _min, thread const float& _max)
{
    if (x < _min)
    {
        return background;
    }
    if (x > _max)
    {
        return background;
    }
    float param = x;
    float param_1 = _min;
    float param_2 = _max;
    float nx = normalizeX(param, param_1, param_2);
    float param_3 = nx;
    return mix(background, accent, mirroredLinearHorizontalGradient(param_3));
}

static inline __attribute__((always_inline))
float4 _shimmer_frag(thread const ShimmerInput& _input)
{
    float gradientWidth = 0.4000000059604644775390625;
    float skewDegrees = 15.0;
    float4 backgroundColor = float4(0.4510000050067901611328125, 0.4510000050067901611328125, 0.4510000050067901611328125, 1.0);
    float4 accentColor = float4(1.0);
    float2 currentPoint = _input.pos.xy / _input.u_resolution;
    float ratio = _input.u_resolution.y / _input.u_resolution.x;
    float skewX = (currentPoint.y * tan(skewDegrees * 0.01745329238474369049072265625)) * ratio;
    float4 param = accentColor;
    float4 param_1 = backgroundColor;
    float param_2 = currentPoint.x;
    float param_3 = 0.0 + skewX;
    float param_4 = gradientWidth + skewX;
    return gradient(param, param_1, param_2, param_3, param_4);
}

//vertex VertexOut basic_vertex( // 1
//  const device VertexIn* vertex_array [[ buffer(0) ]], // 2
//  unsigned int vid [[ vertex_id ]]) {                  // 3
//    // 4
//    VertexIn v = vertex_array[vid];
//
//    // 5
//    VertexOut outVertex = VertexOut();
//    outVertex.computedPosition = float4(v.position, 1.0);
//    outVertex.color = v.color;
//    return outVertex;
//}

struct ShimmerVertexIn {
    float4 position [[attribute(0)]];
};

struct ShimmerVertexOut {
    float4 position [[position]];
};

vertex ShimmerVertexOut shimmer_vertex(ShimmerVertexIn in [[stage_in]]) {
    ShimmerVertexOut out {
        .position = in.position
    };
    return out;
}

fragment float4 shimmer_frag(ShimmerVertexOut in [[stage_in]]) {
    return float4(0.4, 0.4, 0.4, 1.0);
}

