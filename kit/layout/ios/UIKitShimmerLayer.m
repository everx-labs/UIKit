//
//  UIKitShimmerLayer.m
//  UIKitLayout
//
//  Created by Aleksei Savelev on 15/06/2022
//

#import "UIKitShimmerLayer.h"

@implementation UIKitShimmerLayer {
    id<MTLCommandQueue> _commandQueue;
    id<MTLLibrary> _library;
    id<CAMetalDrawable> _currentDrawable;
}

- (instancetype)initWithDevice:(id<MTLDevice>)device library:(id<MTLLibrary>)lib commandQueue:(id<MTLCommandQueue>)queue {
    if (self = [super init]) {
        _library = lib;
        _commandQueue = queue;
        
        self.device = device;
        self.pixelFormat = MTLPixelFormatBGRA8Unorm;
        self.opaque = YES;
    }
    
    return self;
}

- (id<CAMetalDrawable>)currentDrawable {
    if (_currentDrawable == nil) {
        _currentDrawable = [self nextDrawable];
    }
    
    return _currentDrawable;
}

- (void)setReadyForNextDrawable {
    _currentDrawable = nil;
}

- (MTLRenderPassDescriptor *)renderPassDescriptor {
    MTLRenderPassDescriptor *renderPassDescriptor = [MTLRenderPassDescriptor renderPassDescriptor];
    
    if (renderPassDescriptor == nil) {
        return nil;
    }
    
    // create a color attachment every frame since we have to recreate the texture every frame
    MTLRenderPassColorAttachmentDescriptor *colorAttachment = renderPassDescriptor.colorAttachments[0];
    colorAttachment.texture = self.currentDrawable.texture;
    // make sure to clear every frame for best performance
    colorAttachment.loadAction = MTLLoadActionClear;
    // TODO: use proper color
    colorAttachment.clearColor = MTLClearColorMake(0.65f, 0.65f, 0.65f, 1.0f);
    
    return renderPassDescriptor;
}

@end
