//
//  UIKitSkeletonView.h
//  UIKitLayout
//
//  Created by Aleksei Savelev on 15/06/2022
//

#import "UIKitSkeletonView.h"
#import "UIKitShimmerLayer.h"

static const long kInFlightCommandBuffers = 3;

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
    NSMutableDictionary *_layers;
    
    id<MTLDevice> _device;
    id<MTLCommandQueue> _commandQueue;
    id<MTLLibrary> _library;
    
    // constant synchronization for buffering <kInFlightCommandBuffers> frames
    dispatch_semaphore_t _inflight_semaphore;
    
    id<MTLRenderPipelineState> _pipelineState;
    id <MTLBuffer> _vertexBuffer;
    id <MTLBuffer> _indexBuffer;
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
        
        _layers = [NSMutableDictionary new];
        
        _device = MTLCreateSystemDefaultDevice();
        _commandQueue = [_device newCommandQueue];
        _library = [_device newDefaultLibrary];
        if (!_library) {
            NSLog(@">> ERROR: Couldnt create a default shader library");
            // assert here becuase if the shader libary isn't loading, nothing good will happen
            assert(0);
        }
        
        _inflight_semaphore = dispatch_semaphore_create(kInFlightCommandBuffers);
        
        _vertexBuffer = [_device newBufferWithBytes:kRectVertices length:sizeof(kRectVertices) options:MTLResourceOptionCPUCacheModeDefault];
        _vertexBuffer.label = @"ShimmerRectVertices";
        
        _indexBuffer = [_device newBufferWithBytes:kRectIndices length:sizeof(kRectIndices) options:MTLResourceOptionCPUCacheModeDefault];
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
        
        vertexDescriptor.layouts[0].stride = sizeof(*kRectVertices);
        
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
    return self;
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
    [_layers enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, UIKitShimmerLayer *layer, BOOL * _Nonnull stop) {
        if (layer == nil) {
            return;
        }
        // TODO: do we need to pass sth to it?
        [self render:layer];
    }];
}

- (void)render:(UIKitShimmerLayer *)layer {
    id<CAMetalDrawable> drawable = layer.currentDrawable;
    if (drawable == nil) {
        return;
    }
    
    // Allow the renderer to preflight 3 frames on the CPU (using a semapore as a guard) and commit them to the GPU.
    // This semaphore will get signaled once the GPU completes a frame's work via addCompletedHandler callback below,
    // signifying the CPU can go ahead and prepare another frame.
    dispatch_semaphore_wait(_inflight_semaphore, DISPATCH_TIME_FOREVER);
    
    // create a new command buffer for each renderpass to the current drawable
    id <MTLCommandBuffer> commandBuffer = [_commandQueue commandBuffer];
    
    MTLRenderPassDescriptor *renderPassDescriptor = layer.renderPassDescriptor;
//    MTLRenderPassDescriptor *renderPassDescriptor = [MTLRenderPassDescriptor renderPassDescriptor];
    if (renderPassDescriptor) {        
        id <MTLRenderCommandEncoder> renderEncoder = [commandBuffer renderCommandEncoderWithDescriptor:renderPassDescriptor];
        
        [renderEncoder setRenderPipelineState:_pipelineState];
        
        [renderEncoder setVertexBuffer:_vertexBuffer offset:0 atIndex:0];
        
        [renderEncoder drawIndexedPrimitives:MTLPrimitiveTypeTriangle
                                  indexCount:(sizeof(kRectIndices) / sizeof(*kRectIndices))
                                   indexType:MTLIndexTypeUInt16
                                 indexBuffer:_indexBuffer
                           indexBufferOffset:0];
        
        [renderEncoder endEncoding];
        
        [commandBuffer presentDrawable:drawable];
    }
    
    // call the view's completion handler which is required by the view since it will signal its semaphore and set up the next buffer
    __block dispatch_semaphore_t block_sema = _inflight_semaphore;
    [commandBuffer addCompletedHandler:^(id<MTLCommandBuffer> buffer) {
        // GPU has completed rendering the frame and is done using the contents of any buffers previously encoded on the CPU for that frame.
        // Signal the semaphore and allow the CPU to proceed and construct the next frame.
        dispatch_semaphore_signal(block_sema);
    }];
    
    // finalize rendering here. this will push the command buffer to the GPU
    [commandBuffer commit];
}

#pragma mark Layers access and release

- (UIKitShimmerLayer *)dequeueLayerForView:(UIView *)view {
    if (_layers[@((intptr_t)view)] != nil) {
        return _layers[@((intptr_t)view)];
    }
    
    BOOL shouldStartLoop = _layers.count == 0;
    
    UIKitShimmerLayer *newLayer = [[UIKitShimmerLayer alloc] initWithDevice:_device library:_library commandQueue:_commandQueue];
    newLayer.frame = view.frame;
    
    // TODO: We also need to find coords for a view in the window, to run shimmers in sync
    
    _layers[@((intptr_t)view)] = newLayer;
    
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

@end

@implementation UIKitSkeletonView {
    UIKitShimmerLayer *_shimmerLayer;
}

- (void)setLoading:(BOOL)loading {
    _loading = loading;
    if (loading) {
        _shimmerLayer = [[UIKitSkeletonsCoordinator sharedCoordinator] dequeueLayerForView:self];
        
//        [self.layer addSublayer:_shimmerLayer];
        [self.layer insertSublayer:_shimmerLayer atIndex:0];
    } else {
        [_shimmerLayer removeFromSuperlayer];
        [[UIKitSkeletonsCoordinator sharedCoordinator] releaseLayerForView:self];
    }
}

@end
