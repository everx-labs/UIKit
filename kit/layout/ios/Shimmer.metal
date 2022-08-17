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
//  return accent;
    float param = x;
    float param_1 = _min;
    float param_2 = _max;
    float nx = normalizeX(param, param_1, param_2);
    return mix(background, accent, mirroredLinearHorizontalGradient(nx));
}

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

struct ShimmerUniforms {
  float gradientWidth;
  float skew;
  float progressShift;
  packed_float2 resolution;
  packed_float4 backgroundColor;
  packed_float4 accendColor;
};

fragment float4 shimmer_frag(ShimmerVertexOut in [[stage_in]],
                             constant ShimmerUniforms &uniforms [[buffer(11)]]) {
  float2 resolution = uniforms.resolution;
  float gradientWidth = uniforms.gradientWidth / resolution.x;
  float skewDegrees = uniforms.skew;
  float4 backgroundColor = float4(uniforms.backgroundColor[0],
                                  uniforms.backgroundColor[1],
                                  uniforms.backgroundColor[2],
                                  1.0);
  float4 accentColor = float4(uniforms.accendColor[0],
                              uniforms.accendColor[1],
                              uniforms.accendColor[2],
                              1.0);
  float2 currentPoint = in.position.xy / resolution.xy;
  float ratio = resolution.y / resolution.x;
  float skewX = ((1.0 - currentPoint.y) * tan(skewDegrees * 0.01745329238474369049072265625)) * ratio;
  
  return gradient(accentColor,
                  backgroundColor,
                  currentPoint.x,
                  0.0 + skewX + uniforms.progressShift,
                  gradientWidth + skewX + uniforms.progressShift);
}

