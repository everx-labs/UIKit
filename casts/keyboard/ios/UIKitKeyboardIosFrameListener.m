//
//  UIKitKeyboardIosFrameListener.mm
//  uikit.keyboard
//
//  Created by Aleksei Savelev on 12/10/2021
//

#import "UIKitKeyboardIosFrameListener.h"


@interface UIKitKeyboardIosFrameListener ()

@property (nonatomic, assign) UIView *keyboardView;

@end

@implementation UIKitKeyboardIosFrameListener {
    NSMapTable *_listeners;
    CADisplayLink *displayLink;
    CGFloat prevKeyboardTopPosition;
    int _windowsCount;
}
- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidHide:) name:UIKeyboardDidHideNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(windowDidBecomeVisible:) name:UIWindowDidBecomeVisibleNotification object:nil];
        _listeners = [NSMapTable strongToStrongObjectsMapTable];
        prevKeyboardTopPosition = 0;
        _windowsCount = 0;
    }
    return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

#pragma mark Coords gathering

/**
 * At first there was an infinit CADisplayLink pulling,
 * it started when listener was added, and stopped when last listener was gone.
 * It wasn't perfect solution, since in a lot of situations keyboard wasn't actually
 * shown, hence pulling did nothing, it was just a waste of CPU resource
 * (constant load around 2%).
 *
 * To prevent that we started to listen to keyboard `show/hide` events
 * and run CADisplayLink only when it's needed. Though it also didn't work well,
 * since `UIKeyboardWillShowNotification` can fire even when actual soft keyboard aren't present,
 * like when there is an `inputAccessoryView` and also when keyboard is open it still
 * waste resources, just like it did before.
 *
 * To solve that, we use combination of a subscription for `windows` changes, plus
 * KVO on `keyboardView` to see when animation is started, and run CADisplayLink
 * only when it's actually needed.
 * (See comment in `addFrameListener` on why KVO alone isn't enough).
 */
- (void)windowDidBecomeVisible:(NSNotification*)notification {
    // No need to listen for frame changes if no listeners attached
    if (displayLink == nil) {
        return;
    }
    
    UIView *keyboardView = [self findKeyboardView];
    if (keyboardView == _keyboardView) {
        return;
    }
    
    _keyboardView = keyboardView;
    
    [keyboardView addObserver:self forKeyPath:@"center" options:NSKeyValueObservingOptionNew context:nil];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context {
    if ([keyPath isEqualToString:@"center"] && object == _keyboardView) {
        CGFloat layerFrameY = _keyboardView.layer.frame.origin.y;
        CGFloat presentationLayerFrameY = [_keyboardView.layer presentationLayer].frame.origin.y;
        
        // start pulling if coords doesn't match
        // as it shows that there's animation in progress
        if (layerFrameY != presentationLayerFrameY) {
            displayLink.paused = NO;
        }
        
        [self callListenersIfNeeded:presentationLayerFrameY];
    }
}

- (void)callListenersIfNeeded:(CGFloat)keyboardFrameY {
    /**
     * Starting from some new iOS version
     * we found it on 15.5, it can return 0
     * that is just wrong value, we don't need to react to
     */
    if (keyboardFrameY == 0) {
        return;
    }

    CGFloat keyboardWindowH = self.keyboardView.window.bounds.size.height;
    CGFloat keyboardTopPosition =
        keyboardWindowH -
        keyboardFrameY;
    
    if (keyboardTopPosition == prevKeyboardTopPosition) {
        return;
    }
    
    prevKeyboardTopPosition = keyboardTopPosition;
    
    for (NSNumber *key in _listeners) {
        KeyboardFrameListener listener = [_listeners objectForKey:key];
        if (listener != nil) {
            listener(keyboardTopPosition);
        }
    }
}

- (void)pullKeyboardPosition {
    if (self.keyboardView == nil) {
        return;
    }
    
    CGFloat layerFrameY = self.keyboardView.layer.frame.origin.y;
    CGFloat presentationLayerFrameY = [self.keyboardView.layer presentationLayer].frame.origin.y;
    
    if (layerFrameY == presentationLayerFrameY) {
        // We reached the end of the animationn
        // no need to pull position anymore
        displayLink.paused = YES;
    }
    
    [self callListenersIfNeeded:presentationLayerFrameY];
}

/**
 * You might have a question: "Does Apple allow this?"
 * And it seems so.
 * I got it from https://github.com/JunyuKuang/KeyboardUtility/blob/master/KeyboardUtility/KeyboardFrameObserversManager.swift#L102-L127
 * And this repo has a closed issue about that https://github.com/JunyuKuang/KeyboardUtility/issues/1
 */
- (UIView *)findKeyboardView {
    /**
     * There was reverseobjectEnumerator before.
     * Usually a structure looks like this:
     *   - UIWindow
     *   - UITextEffectsWindow
     * Based on that it seemed that to access from the END is faster
     * But turned out there might be more than one UITextEffectsWindow,
     * and the one that works correct is placed closer to UIWindow.
     * Therefore now we begin from start, where UIWindow is on first place
     * and choose the closest UITextEffectsWindow.
     */
    for (UIWindow *window in [UIApplication.sharedApplication.windows objectEnumerator]) {
        if ([window isKindOfClass:NSClassFromString(@"UITextEffectsWindow")]) {
            for (UIView *containerView in window.subviews) {
                if ([containerView isKindOfClass:NSClassFromString(@"UIInputSetContainerView")]) {
                    for (UIView *hostView in containerView.subviews) {
                        if ([hostView isKindOfClass:NSClassFromString(@"UIInputSetHostView")]) {
                            return hostView;
                        }
                    }
                }
            }
        }
    }
    return nil;
}

- (UIView *)keyboardView {
    /**
     * If the count of windows has changed it means there might be a new UITextEffectsWindow,
     * thus we have to obtain a new `keyboardView`
     */
    int windowsCount = [UIApplication.sharedApplication.windows count];
    
    if (_keyboardView == nil || windowsCount != _windowsCount) {
        _keyboardView = [self findKeyboardView];
        _windowsCount = windowsCount;
    }
    return _keyboardView;
}

- (void)keyboardDidHide:(NSNotification *)notification {
    /**
     * Invalidate it just in case
     */
    _keyboardView = nil;
}

#pragma mark Listener management

- (void)addFrameListener:(NSNumber *)uid withListener:(void (^)(CGFloat height))withListener {
    if (_listeners.count == 0) {
        /**
         * KVO host view's frame sometimes can't get updated values. So instead, we use display link pulling.
         * Source:
         * https://github.com/JunyuKuang/KeyboardUtility/blob/master/KeyboardUtility/KeyboardFrameObserversManager.swift#L60-L62
         *
         * UPD: See `windowDidBecomeVisible` for updated algorithm
         */
        displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(pullKeyboardPosition)];
        [displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
        /**
         * Keep it paused by default to not waste CPU resources
         */
        displayLink.paused = YES;
    }
    [_listeners setObject:withListener forKey:uid];
}

- (void)removeFrameListener:(NSNumber *)uid {
    [_listeners removeObjectForKey:uid];
    if (_listeners.count == 0) {
        [displayLink invalidate];
        displayLink = nil;
    }
}

@end
