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
    CGFloat _lastKnownKeyboardY;
    
    BOOL displayLinkPausedByDefault;
}
- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidHide:) name:UIKeyboardDidHideNotification object:nil];
        _listeners = [NSMapTable strongToStrongObjectsMapTable];
        prevKeyboardTopPosition = 0;
        _windowsCount = 0;
        _lastKnownKeyboardY = 0;
        
        displayLinkPausedByDefault = YES;
    }
    return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
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

- (void)updateKeyboardFrameForListeners {
    if (self.keyboardView == nil) {
        return;
    }
    
    CGFloat keyboardFrameY = [self.keyboardView.layer presentationLayer].frame.origin.y;
    // Doing as little work as possible, as it runs a lot of times with CADisplayLink
    if (keyboardFrameY == _lastKnownKeyboardY) {
        return;
    }

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

- (void)keyboardWillShow:(NSNotification *)notification {
    displayLinkPausedByDefault = NO;
    
    if (displayLink == nil) {
        return;
    }
    displayLink.paused = NO;
}

- (void)keyboardDidHide:(NSNotification *)notification {
    /**
     * Invalidate it just in case
     */
    _keyboardView = nil;
    displayLinkPausedByDefault = YES;
    
    if (displayLink == nil) {
        return;
    }
    displayLink.paused = YES;
}

- (void)addFrameListener:(NSNumber *)uid withListener:(void (^)(CGFloat height))withListener {
    if (_listeners.count == 0) {
        /**
         * KVO host view's frame sometimes can't get updated values. So instead, we use display link pulling.
         * Source:
         * https://github.com/JunyuKuang/KeyboardUtility/blob/master/KeyboardUtility/KeyboardFrameObserversManager.swift#L60-L62
         */
        displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(updateKeyboardFrameForListeners)];
        [displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
        /**
         * There're 2 situations:
         * - when keyboard isn't opened yet, we should keep it paused to not waste CPU resources;
         * - when keyboard is open during displayLink creation, let it work from the start.
         */
        displayLink.paused = displayLinkPausedByDefault;
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
