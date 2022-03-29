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
     * If count of windows is changed it means there might be a new UITextEffectsWindow,
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

- (void)keyboardDidHide:(NSNotification *)notification {
    /**
     * Invalidate it just in case
     */
    _keyboardView = nil;
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
