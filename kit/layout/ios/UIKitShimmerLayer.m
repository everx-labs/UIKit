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
    ProgressCoords _progressCoords;
    BOOL _needFirstRender;
    BOOL _lastShouldRenderCheck;
}

- (instancetype)initWithDevice:(id<MTLDevice>)device library:(id<MTLLibrary>)lib commandQueue:(id<MTLCommandQueue>)queue
    progressCoords:(ProgressCoords)progressCoords{
    if (self = [super init]) {
        _library = lib;
        _commandQueue = queue;
        _progressCoords = progressCoords;
        
        self.device = device;
        self.pixelFormat = MTLPixelFormatBGRA8Unorm;
        self.opaque = YES;
        
        _needFirstRender = YES;
        _lastShouldRenderCheck = NO;
    }
    
    return self;
}

- (id<CAMetalDrawable>)currentDrawable {
    if (_needFirstRender) {
        _needFirstRender = NO;
    }
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
    // TODO: use proper color, is there any?
    colorAttachment.clearColor = MTLClearColorMake(0.65f, 0.65f, 0.65f, 1.0f);
    
    return renderPassDescriptor;
}

- (BOOL)shouldRender: (float)globalProgress {
    _lastShouldRenderCheck = [self _shouldRender:globalProgress];
    return _lastShouldRenderCheck;
}

- (BOOL)_shouldRender:(float)globalProgress {
    if (_needFirstRender) {
        return YES;
    }
    
    BOOL shouldRender = [self _shouldRenderWithProgress:globalProgress];
    
    // Allow last frame to be rendered to clear animation
    if (_lastShouldRenderCheck == YES && shouldRender == NO) {
        return YES;
    }
    
    return shouldRender;
}

- (BOOL)_shouldRenderWithProgress:(float)globalProgress {
    if (_progressCoords.end > _progressCoords.start) {
        if (globalProgress < _progressCoords.start || globalProgress > _progressCoords.end) {
            return NO;
        }
        return YES;
    }
    if (globalProgress < _progressCoords.start && globalProgress > _progressCoords.end) {
        return NO;
    }
    return YES;
}

- (float)getLayerProgressShift:(float)globalProgress {
    return [self getLayerProgress:globalProgress] * (1 + _progressCoords.shift) - _progressCoords.shift;
}

- (float)getLayerProgress:(float)globalProgress {
    if (_progressCoords.end > _progressCoords.start) {
        if (globalProgress < _progressCoords.start || globalProgress > _progressCoords.end) {
            return 0;
        }
        return (globalProgress - _progressCoords.start) / (_progressCoords.end - _progressCoords.start);
    }
    if (globalProgress < _progressCoords.start && globalProgress > _progressCoords.end) {
        return 0;
    }
    if (globalProgress <= _progressCoords.end) {
        float tail = 1 - _progressCoords.start;
        return (globalProgress + tail) / (_progressCoords.end + tail);
    }
    float head = _progressCoords.end;
    return (globalProgress - _progressCoords.start) / (1 - _progressCoords.start + head);
}

@end
