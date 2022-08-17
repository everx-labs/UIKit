//
//  UIKitShimmerRenderer.m
//  UIKitLayout
//
//  Created by Aleksei Savelev on 19.07.2022.
//

#import <React/RCTUtils.h>
#import <React/RCTConvert.h>

#import <Foundation/Foundation.h>
#import "UIKitShimmerRenderer.h"

// From https://www.raywenderlich.com/books/metal-by-tutorials/v3.0/chapters/4-the-vertex-function
static const float kRectVertices[] = {
    -1.0,  1.0, 0.0,
     1.0,  1.0, 0.0,
    -1.0, -1.0, 0.0,
     1.0, -1.0, 0.0
};

// Also from https://www.raywenderlich.com/books/metal-by-tutorials/v3.0/chapters/4-the-vertex-function
static const uint16_t kRectIndices[] = {
    0, 3, 2,
    0, 1, 3
};

static id<MTLLibrary> MTLCreateUIKitLayoutLibrary(id<MTLDevice> device) {
    NSBundle *bundleFile = [NSBundle bundleWithURL:[[NSBundle bundleForClass:[UIKitShimmerRenderer class]]
                                                    URLForResource:@"UIKitLayout"
                                                    withExtension:@"bundle"]];
    NSURL *libFile = [bundleFile URLForResource:@"UIKitLayout" withExtension:@"metallib"];
    
    NSError *libraryError = NULL;
    id<MTLLibrary> lib = [device newLibraryWithFile:libFile.path error:&libraryError];
    
    if (!lib) {
        return nil;
    }
    
    return lib;
}

@implementation UIKitShimmerRenderer {
    // Cache of GUI rendering primitives
    id<MTLCommandQueue> _commandQueue;
    id<MTLLibrary> _library;
    id<MTLRenderPipelineState> _pipelineState;
    id <MTLBuffer> _vertexBuffer;
    id <MTLBuffer> _indexBuffer;
    
    // shimmer configuration consts
    float gradientWidth;
    float skewDegrees;
    int shimmerDuration;
    int skeletonDuration;
    ShimmerColor backgroundColor;
    ShimmerColor accentColor;
    // coords calculation utilities
    float _physicalSize;
    float _physicalX0;
    
    NSMapTable *_views;
    
    // helps to calculate a global progress
    CFTimeInterval _lastTime;
}

+ (instancetype)sharedRenderer
{
    static UIKitShimmerRenderer *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[UIKitShimmerRenderer alloc] init];
    });
    return sharedInstance;
}

+ (SkeletonConfig)defaultConfig {
    static SkeletonConfig sharedConfig;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedConfig = (SkeletonConfig) {
            200.0,
            10.0,
            800,
            2000,
            [RCTConvert ShimmerColor:[RCTConvert rgbaToNumber:245 g:246 b:247 a:255]],
            [RCTConvert ShimmerColor:[RCTConvert rgbaToNumber:237 g:238 b:241 a:255]]
        };
    });
    return sharedConfig;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self initRenderPipeline];
        
        _lastTime = 0;
        
        // Initialize it to have a proper compare in `configure`
        gradientWidth = 0;
        skeletonDuration = 0;
        shimmerDuration = 0;
        
        // Helps to set a proper `_lastTime`
        // and update views when configuration is changed
        _views = [NSMapTable strongToWeakObjectsMapTable];
        
        [self configure:[UIKitShimmerRenderer defaultConfig]];
    }
    return self;
}

- (void)initRenderPipeline {
    _device = MTLCreateSystemDefaultDevice();
    _commandQueue = [_device newCommandQueue];
    
    _library = MTLCreateUIKitLayoutLibrary(_device);
    
    if (!_library) {
        NSLog(@">> ERROR: Couldnt create a default shader library");
        // assert here becuase if the shader libary isn't loading, nothing good will happen
        assert(0);
    }
    
    _vertexBuffer = [_device newBufferWithBytes:kRectVertices
                                         length:sizeof(kRectVertices)
                                        options:MTLResourceOptionCPUCacheModeDefault];
    _vertexBuffer.label = @"ShimmerRectVertices";
    
    _indexBuffer = [_device newBufferWithBytes:kRectIndices
                                        length:sizeof(kRectIndices)
                                       options:MTLResourceOptionCPUCacheModeDefault];
    _indexBuffer.label = @"ShimmerRectIndices";
    
    // get the vertex function from the library
    id <MTLFunction> vertexProgram = [_library newFunctionWithName:@"shimmer_vertex"];
    if(!vertexProgram) {
        NSLog(@">> ERROR: Couldn't load vertex function from default library");
    }
    
    // get the fragment function from the library
    id <MTLFunction> fragmentProgram = [_library newFunctionWithName:@"shimmer_frag"];
    if(!fragmentProgram) {
        NSLog(@">> ERROR: Couldn't load fragment function from default library");
    }
    
    // create a pipeline state descriptor which can be used to create a compiled pipeline state object
    MTLRenderPipelineDescriptor *pipelineStateDescriptor = [[MTLRenderPipelineDescriptor alloc] init];
    
    MTLVertexDescriptor *vertexDescriptor = [MTLVertexDescriptor vertexDescriptor];
    vertexDescriptor.attributes[0].format = MTLVertexFormatFloat3;
    vertexDescriptor.attributes[0].offset = 0;
    vertexDescriptor.attributes[0].bufferIndex = 0;
    
    vertexDescriptor.layouts[0].stride = sizeof(*kRectVertices) * 3;
    
    pipelineStateDescriptor.label = @"SkeletonPipeline";
    pipelineStateDescriptor.vertexFunction = vertexProgram;
    pipelineStateDescriptor.vertexDescriptor = vertexDescriptor;
    pipelineStateDescriptor.fragmentFunction = fragmentProgram;
//        pipelineStateDescriptor.fragmentBuffers
    pipelineStateDescriptor.colorAttachments[0].pixelFormat = MTLPixelFormatBGRA8Unorm;
    
    // create a compiled pipeline state object. Shader functions (from the render pipeline descriptor)
    // are compiled when this is created unlessed they are obtained from the device's cache
    NSError *error = nil;
    _pipelineState = [_device newRenderPipelineStateWithDescriptor:pipelineStateDescriptor error:&error];
    
    if (!_pipelineState) {
        NSLog(@">> ERROR: Couldnt create a valid pipeline state");
        // cannot render anything without a valid compiled pipeline state object.
        assert(0);
    }
}

- (void)configure:(SkeletonConfig)config {
    gradientWidth = config.gradientWidth;
    skewDegrees = config.skewDegrees;
    shimmerDuration = config.shimmerDuration;
    skeletonDuration = config.skeletonDuration;
    backgroundColor = config.backgroundColor;
    accentColor = config.accentColor;
    
    if (skeletonDuration < shimmerDuration) {
        @throw @"Shimmer duration cannot be less than overall skeleton animation";
    }
    
    [self updateProgressVars];
    
    if ([_views count] == 0) {
        return;
    }
    
    // Update views progress coords if configuration is changed
    
    NSEnumerator *enumerator = [_views objectEnumerator];

    UIKitSkeletonView *view;
    while ((view = [enumerator nextObject])) {
        if (view == nil) {
            return;
        }

        [view updateProgressCoords:[self getViewProgressCoords:view]];
    }
}

- (void)updateProgressVars {
    float relativeShimmerDuration = ((float) shimmerDuration) / ((float) skeletonDuration);
    
    float skewTan = tanf(skewDegrees * (M_PI / 180.0f));
    // when we apply a skew to the gradient rect
    // we have to also calculate cathetus of the triangle from the side of it
    // to make a rectange and use the rectangle witdh
    float maxSkewGradientWidth = gradientWidth + (RCTScreenSize().height * skewTan);
    
    CGFloat screenWidth = RCTScreenSize().width;
    
    _physicalSize = (screenWidth + maxSkewGradientWidth) / relativeShimmerDuration;
    _physicalX0 = _physicalSize / 2 - screenWidth / 2;
}

- (void)retainShimmer:(UIKitSkeletonView *)view {
    if ([_views count] == 0) {
        _lastTime = CACurrentMediaTime() * 1000;
    }
    [_views setObject:view forKey:@((intptr_t)view)];
}

- (void)releaseShimmer:(UIKitSkeletonView *)view {
    [_views removeObjectForKey:@((intptr_t)view)];
}

#pragma mark Metal drawing delegate

- (float)calcGlobalProgress {
    CFTimeInterval t = CACurrentMediaTime() * 1000;
    
    while (t > _lastTime + skeletonDuration) {
        _lastTime += skeletonDuration;
    }
    
    return ((float) (t - _lastTime)) / ((float) skeletonDuration);
}

- (void)drawInMTKView:(UIKitSkeletonView *)view {
    float globalProgress = [self calcGlobalProgress];
    
    if (![view shouldRender:globalProgress]) {
        return;
    }
    
    id<CAMetalDrawable> drawable = view.currentDrawable;
    if (drawable == nil) {
        return;
    }
    
    // create a new command buffer for each renderpass to the current drawable
    id <MTLCommandBuffer> commandBuffer = [_commandQueue commandBuffer];
    
    MTLRenderPassDescriptor *renderPassDescriptor = [view currentRenderPassDescriptor];
    if (renderPassDescriptor) {
        id <MTLRenderCommandEncoder> renderEncoder = [commandBuffer renderCommandEncoderWithDescriptor:renderPassDescriptor];
        
        [renderEncoder setRenderPipelineState:_pipelineState];
        
        [renderEncoder setVertexBuffer:_vertexBuffer offset:0 atIndex:0];
        
        // TODO: move conversion outside of the render
        float scaledGradientWidth = ceil(gradientWidth * RCTScreenScale());
        
        // TODO: move conversion outside of the render
        CGSize scaledViewSize = RCTSizeInPixels(view.frame.size, RCTScreenScale());
        float scaledWidth = (float) scaledViewSize.width;
        float scaledHeight = (float) scaledViewSize.height;
        
        float progressShift = [view getProgressShift:globalProgress];
        
        const float uniforms[] = {
            scaledGradientWidth, // gradient width
            skewDegrees, // skew degrees
            progressShift,
            scaledWidth, scaledHeight, // resolution
            backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a, // background color
            accentColor.r, accentColor.g, accentColor.b, accentColor.a // accent color
        };
        
        [renderEncoder setFragmentBytes:&uniforms length:sizeof(uniforms) atIndex:11];
        
        [renderEncoder drawIndexedPrimitives:MTLPrimitiveTypeTriangle
                                  indexCount:(sizeof(kRectIndices) / sizeof(*kRectIndices))
                                   indexType:MTLIndexTypeUInt16
                                 indexBuffer:_indexBuffer
                           indexBufferOffset:0];
        
        [renderEncoder endEncoding];
        
        [commandBuffer presentDrawable:drawable];
    }
    
    // finalize rendering here. this will push the command buffer to the GPU
    [commandBuffer commit];
    
//    [commandBuffer waitUntilCompleted];
}

- (void)mtkView:(UIKitSkeletonView *)view drawableSizeWillChange:(CGSize)size {
    [view updateProgressCoords:[self getViewProgressCoords:view]];
}

#pragma mark Shimmer calculations

- (ProgressCoords)getViewProgressCoords:(UIView *)view {
    CGPoint absoluteViewOrigin = [view.window convertPoint:view.frame.origin fromView:view.superview];
    CGRect rect = CGRectMake(absoluteViewOrigin.x, absoluteViewOrigin.y, view.frame.size.width, view.frame.size.height);
    
    float skewTan = tanf(skewDegrees * (M_PI / 180.0f));
    // when we apply a skew to the gradient rect
    // we have to also calculate cathetus of the triangle from the side of it
    // to make a rectange and use the rectangle witdh
    float skewGradientWidth = gradientWidth + (rect.size.height * skewTan);
    // calculate cathetus of a triangle that is projected from the bottom of a rect to the upper edge (that is 0)
    float absoluteSkewXProjection = (rect.origin.y + rect.size.height) * skewTan;
    
    ProgressCoords coords;
    float start = (_physicalX0 + rect.origin.x - skewGradientWidth + absoluteSkewXProjection);
    coords.start = [self getRelativeToPhysicalSizeX:start] / _physicalSize;
    float end = (_physicalX0 + rect.origin.x + rect.size.width + absoluteSkewXProjection);
    coords.end = [self getRelativeToPhysicalSizeX:end] / _physicalSize;
    // how much a shimmer gradient rectangle takes compare to a width of a view
    coords.shift = skewGradientWidth / rect.size.width;
    
    return coords;
}

- (float)getRelativeToPhysicalSizeX:(float)x {
    float _x = x;
    while (_x > _physicalSize) {
        _x -= _physicalSize;
    }
    return _x;
}

@end
