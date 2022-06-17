The shader itself is written in HLSL language,
then using SPIR-V is transpiled to other languages:

-   GLSL for OpenGL 3.1
-   MSL for Metal (iOS)

Before doing transpilation install:
`brew install glslang`
`brew install spirv-cross`

Create SPIR-V binary:
`glslangValidator -V Shimmer.frag.hlsl -o Shimmer.frag.spv -e shimmer_frag`

Transpile to GLSL:
`spirv-cross Shimmer.frag.spv --version 310 --es --output Shimmer.frag.glsl`

And then to Metal
`spirv-cross Shimmer.frag.spv --msl --output Shimmer.frag.msl`
