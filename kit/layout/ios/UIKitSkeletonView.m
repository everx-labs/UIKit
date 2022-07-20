//
//  UIKitSkeletonView.h
//  UIKitLayout
//
//  Created by Aleksei Savelev on 15/06/2022
//

#import "UIKitSkeletonView.h"
#import "UIKitShimmerRenderer.h"

@implementation UIKitSkeletonView {
    ProgressCoords _progressCoords;
    BOOL _needFirstRender;
    BOOL _lastShouldRenderCheck;
    
    // To decide whether it's needed to run a view updates after `willEnterForeground` or not
    BOOL _shouldUnpause;
}

- (instancetype)initWithRenderer:(UIKitShimmerRenderer *)renderer {
    if (self = [super init]) {
        
        self.device = renderer.device;
//        self.pixelFormat = MTLPixelFormatBGRA8Unorm;
        self.delegate = renderer;
        
        [((UIKitShimmerRenderer *)self.delegate) retainShimmer:self];
        
        // Run by default
        self.paused = NO;
        self.enableSetNeedsDisplay = NO;
        
        _needFirstRender = YES;
        _lastShouldRenderCheck = NO;
        
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
        
        _shouldUnpause = NO;
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
    
    [((UIKitShimmerRenderer *)self.delegate) releaseShimmer:self];
}

- (void)didEnterBackground:(NSNotification*)notification {
    _shouldUnpause = !self.paused;
    self.paused = YES;
}

- (void)willEnterForeground:(NSNotification*)notification {
    if (_shouldUnpause) {
        self.paused = NO;
    }
}

#pragma mark Metal related

- (MTLRenderPassDescriptor *)currentRenderPassDescriptor {
    MTLRenderPassDescriptor* onscreenDescriptor = [super currentRenderPassDescriptor];
    
    // create a color attachment every frame since we have to recreate the texture every frame
    MTLRenderPassColorAttachmentDescriptor *colorAttachment = onscreenDescriptor.colorAttachments[0];
    colorAttachment.texture = self.currentDrawable.texture;
    // make sure to clear every frame for best performance
//    colorAttachment.loadAction = MTLLoadActionClear;
    colorAttachment.loadAction = MTLLoadActionDontCare;
    
    return onscreenDescriptor;
}

#pragma mark Shimmer related

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

- (float)getProgressShift:(float)globalProgress {
//    return [self getProgress:globalProgress];
    return [self getProgress:globalProgress] * (1 + _progressCoords.shift) - _progressCoords.shift;
}

- (float)getProgress:(float)globalProgress {
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

- (void)updateProgressCoords:(ProgressCoords)progressCoords {
    _progressCoords = progressCoords;
}

@end
