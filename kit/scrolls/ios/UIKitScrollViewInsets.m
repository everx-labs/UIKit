//
//  UIKitScrollViewInsets.m
//  Pods
//
//  Created by Aleksei Savelev on 14.02.2022.
//

#import "UIKitScrollViewInsets.h"
#import "UIKitScrollViewInsetsSafeArea.h"
#import "UIKitScrollViewInsetsKeyboard.h"

#import <React/RCTAssert.h>

static inline UIViewAnimationOptions animationOptionsWithCurve(UIViewAnimationCurve curve) {
   // UIViewAnimationCurve #7 is used for keyboard and therefore private - so we can't use switch/case here.
   // source: https://stackoverflow.com/a/7327374/5281431
   RCTAssert(UIViewAnimationCurveLinear << 16 == UIViewAnimationOptionCurveLinear, @"Unexpected implementation of UIViewAnimationCurve");
   return curve << 16;
}

@implementation UIKitScrollViewInsets {
    RCTBridge *_bridge;
    RCTScrollView *_rctScrollView;
    UIKitScrollViewInsetsSafeArea *_insetsSafeArea;
    UIKitScrollViewInsetsKeyboard *_insetsKeyboard;
    UIEdgeInsets _indicatorInsets;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    if ([self init]) {
        _bridge = bridge;
    }
    
    return self;
}

- (void)didMoveToWindow {
    /**
     * It's actually a very fragile way to access a scroll view
     * but I had to use it, as refs and nativeID looks to be
     * even worse in this particular situation.
     * Hence it is very important to place the component as it is now!
     */
    UIView *view = self.superview.subviews[0];
    
    if (![view isKindOfClass:[RCTScrollView class]]) {
        return;
    }
    
    _rctScrollView = (RCTScrollView *)view;
    
    if (_insetsSafeArea == NULL && self.automaticallyAdjustContentInsets) {
        _insetsSafeArea = [[UIKitScrollViewInsetsSafeArea alloc] initWithRCTScrollView:_rctScrollView];
    }
    
    if (_insetsKeyboard == NULL && self.automaticallyAdjustKeyboardInsets) {
        _insetsKeyboard = [[UIKitScrollViewInsetsKeyboard alloc]initWithRCTScrollView:_rctScrollView withDelegate:self];
    }
    
    [self reset];
    
    // Force `layoutSubviews` to be called,
    // sometimes it's not called without it
    // but `layoutSubviews` is an only place
    // (besides `safeAreaInsetsDidChange`, that is also inconsistent)
    // to access safeAreaInsets
    [self setNeedsLayout];
}

- (void)layoutSubviews {
    [self onInsetsShouldBeRecalculated];
}

- (void)safeAreaInsetsDidChange {
    [self onInsetsShouldBeRecalculated];
}

- (void)onInsetsShouldBeRecalculated {
    InsetsChange change = InsetsChangeInstantMake(self.contentInset, self.contentInset);
    
    if (_insetsSafeArea != NULL) {
        change = [_insetsSafeArea calculateInsets:self.contentInset];
    }
    
    [self applyInsetsChange:change];
}

- (void)onInsetsShouldBeRecalculated:(NSNotification *)notification {
    InsetsChange change = InsetsChangeInstantMake(self.contentInset, self.contentInset);
    
    if (_insetsSafeArea != NULL) {
        change = [_insetsSafeArea calculateInsets:self.contentInset];
    }
    
    if (_insetsKeyboard != NULL) {
        InsetsChange keyboardChange = [_insetsKeyboard calculateInsets:change.insets withNotification:notification];
        
        if (!UIEdgeInsetsEqualToEdgeInsets(change.insets, keyboardChange.insets)) {
            change = keyboardChange;
        }
    }
    
    [self applyInsetsChange:change];
}

- (void)reset {
    if (_rctScrollView == NULL) {
        return;
    }
    
    /**
     * It's `never` by default in RN,
     * https://github.com/facebook/react-native/blob/6e6443afd04a847ef23fb6254a84e48c70b45896/React/Views/ScrollView/RCTScrollView.m#L297
     * but just to be sure we do it again, as it can brake things otherwise
     */
    if (@available(iOS 11.0, *)) {
        _rctScrollView.automaticallyAdjustContentInsets = NO;
        _rctScrollView.scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    }
    if (@available(iOS 13.0, *)) {
        _rctScrollView.scrollView.automaticallyAdjustsScrollIndicatorInsets = NO;
    }
}

- (void)applyInsetsChange:(InsetsChange)change {
    if (!change.animated) {
        [self setInsets:change.insets withIndicator:change.indicatorInsets];
        return;
    }
    
    [self setInsets:change.insets withIndicator:change.indicatorInsets duration:change.duration curve:change.curve];
}

- (void)setInsets:(UIEdgeInsets)insets withIndicator:(UIEdgeInsets)indicatorInsets {
    if (!UIEdgeInsetsEqualToEdgeInsets(_rctScrollView.scrollView.contentInset, insets)) {
        [_rctScrollView.scrollView setContentInset:insets];
    }
        
    if (!UIEdgeInsetsEqualToEdgeInsets(_rctScrollView.scrollView.scrollIndicatorInsets, indicatorInsets)) {
        [_rctScrollView.scrollView setScrollIndicatorInsets:indicatorInsets];
    }
}

- (void)setInsets:(UIEdgeInsets)insets withIndicator:(UIEdgeInsets)indicatorInsets duration:(NSTimeInterval)duration curve:(UIViewAnimationCurve)curve {
    [UIView animateWithDuration:duration
                          delay:0.0
                        options:animationOptionsWithCurve(curve)
                     animations:^{
        [self->_rctScrollView.scrollView setContentInset:insets];
        [self->_rctScrollView.scrollView setScrollIndicatorInsets:indicatorInsets];
    } completion:nil];
}

@end
