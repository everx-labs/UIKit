//
//  UIKitSkeletonView.h
//  UIKitLayout
//
//  Created by Aleksei Savelev on 15/06/2022
//

#import "UIKitSkeletonView.h"
#import "UIKitShimmerLayer.h"

static const long kInFlightCommandBuffers = 1;

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

@interface UIKitSkeletonsCoordinator : NSObject

+ (instancetype)sharedCoordinator;

- (UIKitShimmerLayer *)dequeueLayerForView:(UIView *)view;
- (void)releaseLayerForView:(UIView *)view;

@end

/**
 * Coordinator has two major functions:
 *  1. run a loop to call render of CAMetalLayer on view
 *  2. holds a pool of layers
 */
@implementation UIKitSkeletonsCoordinator {
    CADisplayLink* _displayLink;
    NSMapTable *_layers;
    
    // Cache of GUI rendering primitives
    id<MTLDevice> _device;
    id<MTLCommandQueue> _commandQueue;
    id<MTLLibrary> _library;
    id<MTLRenderPipelineState> _pipelineState;
    id <MTLBuffer> _vertexBuffer;
    id <MTLBuffer> _indexBuffer;
    
    // constant synchronization for buffering <kInFlightCommandBuffers> frames
    dispatch_semaphore_t _inflight_semaphore;
    
    // utility to calculate progress
    int _lastTime;
    
    // shimmer configuration consts
    float gradientWidth;
    float skewDegrees;
    int shimmerDuration;
    int skeletonDuration;
    // coords calculation utilities
    float _physicalSize;
    float _physicalX0;
}

+ (instancetype)sharedCoordinator
{
    static UIKitSkeletonsCoordinator *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[UIKitSkeletonsCoordinator alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        NSNotificationCenter* notificationCenter = [NSNotificationCenter defaultCenter];
        //  Register notifications to start/stop drawing as this app moves into the background
        [notificationCenter addObserver: self
                               selector: @selector(didEnterBackground:)
                                   name: UIApplicationDidEnterBackgroundNotification
                                 object: nil];
        
        [notificationCenter addObserver: self
                               selector: @selector(willEnterForeground:)
                                   name: UIApplicationWillEnterForegroundNotification
                                 object: nil];
        
        _layers = [NSMapTable strongToWeakObjectsMapTable];
        
        _device = MTLCreateSystemDefaultDevice();
        _commandQueue = [_device newCommandQueue];
        _library = [_device newDefaultLibrary];
        if (!_library) {
            NSLog(@">> ERROR: Couldnt create a default shader library");
            // assert here becuase if the shader libary isn't loading, nothing good will happen
            assert(0);
        }
        
        _inflight_semaphore = dispatch_semaphore_create(kInFlightCommandBuffers);
        
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
        
        // coords projection setup
        // TODO: should it be dynamic?
        gradientWidth = 100.0;
        skewDegrees = 10.0;
        shimmerDuration = 800;
        skeletonDuration = 1000;
        
        CGFloat screenWidth = [UIScreen mainScreen].bounds.size.width;
        
        if (skeletonDuration < shimmerDuration) {
            @throw @"Shimmer duration cannot be less than overall skeleton animation";
        }
        
        // TODO: should update on any arguments changes
        [self initProgressVars:shimmerDuration skeletonDuration:skeletonDuration screenWidth:screenWidth];
        
        _lastTime = 0;
    }
    return self;
}

- (void)initProgressVars:(int)shimmerDuration
        skeletonDuration:(int)skeletonDuration
             screenWidth:(CGFloat)screenWidth {
    float relativeShimmerDuration = ((float) shimmerDuration) / ((float) skeletonDuration);
    
    _physicalSize = screenWidth / relativeShimmerDuration;
    _physicalX0 = _physicalSize / 2 - screenWidth / 2;
}

#pragma mark Lifecycle

-(void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver: self
                                                    name: UIApplicationDidEnterBackgroundNotification
                                                  object: nil];
    
    [[NSNotificationCenter defaultCenter] removeObserver: self
                                                    name: UIApplicationWillEnterForegroundNotification
                                                  object: nil];
    
    [self endLoop];
}

- (void)didEnterBackground:(NSNotification*)notification {
    if (_displayLink == nil) {
        return;
    }
    _displayLink.paused = YES;
}

- (void)willEnterForeground:(NSNotification*)notification {
    if (_displayLink == nil) {
        return;
    }
    _displayLink.paused = NO;
}

#pragma mark Loop

- (void)startLoop {
    _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(render)];
    [_displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)endLoop {
    if (_displayLink == nil) {
        return;
    }
    [_displayLink invalidate];
    _displayLink = nil;
}

- (void)render {
    // <<< update progress
    _lastTime += (int) (_displayLink.duration * 1000);
    
    if (_lastTime > skeletonDuration) {
        _lastTime -= skeletonDuration;
    }
    
    float progress = (float) _lastTime / (float) skeletonDuration;
    // <<< end progress update
    
    NSEnumerator *enumerator = [_layers objectEnumerator];
    
    @autoreleasepool {
        UIKitShimmerLayer *layer;
        while ((layer = [enumerator nextObject])) {
            if (layer == nil) {
                return;
            }
            
            if ([layer shouldRender:progress]) {
                [self render:layer progress:progress];
            }
        }
    }
}

- (void)render:(UIKitShimmerLayer *)layer progress:(float)progress {
    id<CAMetalDrawable> drawable = layer.currentDrawable;
    if (drawable == nil) {
        return;
    }
    
    // Allow the renderer to preflight 3 frames on the CPU (using a semapore as a guard) and commit them to the GPU.
    // This semaphore will get signaled once the GPU completes a frame's work via addCompletedHandler callback below,
    // signifying the CPU can go ahead and prepare another frame.
//    dispatch_semaphore_wait(_inflight_semaphore, DISPATCH_TIME_FOREVER);
    
    // create a new command buffer for each renderpass to the current drawable
    id <MTLCommandBuffer> commandBuffer = [_commandQueue commandBuffer];
    
//    const float backgroundColor[] = { 0.9609375, 0.96484375, 0.96875 };
    const float backgroundColor[] = { 1.0, 1.0, 1.0 };
//    const float accentColor[] = { 0.92578125,  0.9296875, 0.94140625 };
    const float accentColor[] = { 0.0, 0.0, 0.0 };
    MTLRenderPassDescriptor *renderPassDescriptor = [layer getRenderPassDescriptor:backgroundColor];
//    MTLRenderPassDescriptor *renderPassDescriptor = [MTLRenderPassDescriptor renderPassDescriptor];
    if (renderPassDescriptor) {        
        id <MTLRenderCommandEncoder> renderEncoder = [commandBuffer renderCommandEncoderWithDescriptor:renderPassDescriptor];
        
        [renderEncoder setRenderPipelineState:_pipelineState];
        
        [renderEncoder setVertexBuffer:_vertexBuffer offset:0 atIndex:0];
        
        float width = (float) layer.bounds.size.width;
        float height = (float) layer.bounds.size.height;
        
        float layerProgressShift = [layer getLayerProgressShift:progress];
//        NSLog(@"layerProgressShift: %f", layerProgressShift);
        const float uniforms[] = {
            gradientWidth, // gradient width
            skewDegrees, // skew degrees
            layerProgressShift,
            width, height, // resolution
            backgroundColor[0], backgroundColor[1], backgroundColor[2], // background color
            accentColor[0], accentColor[1], accentColor[2], // accent color
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
    
    // call the view's completion handler which is required by the view since it will signal its semaphore and set up the next buffer
//    __block dispatch_semaphore_t block_sema = _inflight_semaphore;
//    [commandBuffer addCompletedHandler:^(id<MTLCommandBuffer> buffer) {
//        // GPU has completed rendering the frame and is done using the contents of any buffers previously encoded on the CPU for that frame.
//        // Signal the semaphore and allow the CPU to proceed and construct the next frame.
//        dispatch_semaphore_signal(block_sema);
//    }];
    
    // finalize rendering here. this will push the command buffer to the GPU
    [commandBuffer commit];
    
    [layer setReadyForNextDrawable];
}

#pragma mark Layers access and release

- (UIKitShimmerLayer *)dequeueLayerForView:(UIView *)view {
    UIKitShimmerLayer *layer = [_layers objectForKey:@((intptr_t)view)];
    if (layer != nil) {
        return nil;
    }
    
    BOOL shouldStartLoop = _layers.count == 0;
    
    ProgressCoords progressCoords = [self getLayerProgressCoords:view];
    UIKitShimmerLayer *newLayer = [[UIKitShimmerLayer alloc] initWithDevice:_device
                                                                    library:_library
                                                               commandQueue:_commandQueue
                                                             progressCoords:progressCoords];
    newLayer.frame = view.frame;
//    newLayer.frame = CGRectMake(0, 0, view.bounds.size.width, view.bounds.size.width);
    newLayer.position = CGPointMake(view.bounds.size.width / 2, view.bounds.size.height / 2);
    
    [_layers setObject:newLayer forKey:@((intptr_t)view)];
    
    if (shouldStartLoop) {
        [self startLoop];
    }
    
    return newLayer;
}

- (void)releaseLayerForView:(UIView *)view {
    // TODO: make it deferred to re-use layers if it possible
    [_layers removeObjectForKey:@((intptr_t)view)];
    
    if (_layers.count == 0) {
        [self endLoop];
    }
}

- (ProgressCoords)getLayerProgressCoords:(UIView *)view {
    CGPoint absoluteViewOrigin = [view.window convertPoint:view.frame.origin fromView:view.superview];
    CGRect rect = CGRectMake(absoluteViewOrigin.x, absoluteViewOrigin.y, view.frame.size.width, view.frame.size.height);
    
    float skewTan = tanf(skewDegrees * (M_PI / 180.0f));
    // when we apply a skew to the gradient rect we have to also calculate cathetus of of triangle from the side of it
    float skewGradientWidth = gradientWidth + (rect.size.height * skewTan);
    // calculate cathetus of a triangle that is projected from the bottom of a rect to the upper edge (that is 0)
    float absoluteSkewXProjection = (rect.origin.y + rect.size.height) * skewTan;
    
    ProgressCoords coords;
    float start = (_physicalX0 + rect.origin.x - skewGradientWidth + absoluteSkewXProjection);
    coords.start = [self getRelativeToPhysicalSizeX:start] / _physicalSize;
    float end = (_physicalX0 + rect.origin.x + rect.size.width + absoluteSkewXProjection);
    coords.end = [self getRelativeToPhysicalSizeX:end] / _physicalSize;
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

// TODO: remove layer on RN refresh
@implementation UIKitSkeletonView {
    UIKitShimmerLayer *_shimmerLayer;
    CGColorRef _originalLayerColor;
}

- (void)didMoveToWindow {
    // detached
    if (self.superview == nil && _shimmerLayer != nil) {
        [_shimmerLayer removeFromSuperlayer];
        [[UIKitSkeletonsCoordinator sharedCoordinator] releaseLayerForView:self];
    }
}

- (void)setLoading:(BOOL)loading {
    _loading = loading;
    if (loading) {
        _shimmerLayer = [[UIKitSkeletonsCoordinator sharedCoordinator] dequeueLayerForView:self];
        
        [self.layer insertSublayer:_shimmerLayer atIndex:0];
        _originalLayerColor = self.layer.backgroundColor;
        self.layer.backgroundColor = [[UIColor whiteColor] CGColor];
        
        [self setNeedsLayout];
    } else {
        [_shimmerLayer removeFromSuperlayer];
        [[UIKitSkeletonsCoordinator sharedCoordinator] releaseLayerForView:self];
        self.layer.backgroundColor = _originalLayerColor;
    }
}

@end
