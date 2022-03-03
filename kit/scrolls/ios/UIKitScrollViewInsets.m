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

/**
 * Probably better to do it with category, since it has to access scroll view
 */
@implementation UIKitScrollViewInsets {
    __weak RCTScrollView *_rctScrollView;
    UIKitScrollViewInsetsSafeArea *_insetsSafeArea;
    UIKitScrollViewInsetsKeyboard *_insetsKeyboard;
    UIEdgeInsets _indicatorInsets;
}

- (instancetype)initWithScrollView:(RCTScrollView *)rctScrollView {
    if (self = [self init]) {
        _rctScrollView = rctScrollView;
        _keyboardInsetAdjustmentBehavior = @"exclusive";
    }
    
    return self;
}

- (BOOL)didMoveToWindow {
    if (_rctScrollView == NULL) {
        return NO;
    }
    
    BOOL shouldReset = NO;
    
    if (_insetsSafeArea == NULL && self.automaticallyAdjustContentInsets) {
        _insetsSafeArea = [[UIKitScrollViewInsetsSafeArea alloc] initWithRCTScrollView:_rctScrollView];
        shouldReset = YES;
    }
    
    if (_insetsKeyboard == NULL && self.automaticallyAdjustKeyboardInsets) {
        _insetsKeyboard = [[UIKitScrollViewInsetsKeyboard alloc]initWithRCTScrollView:_rctScrollView withDelegate:self];
        shouldReset = YES;
    }
    
    return shouldReset;
}

- (void)setAutomaticallyAdjustContentInsets:(BOOL)automaticallyAdjustContentInsets {
    _automaticallyAdjustContentInsets = automaticallyAdjustContentInsets;
    
    if (automaticallyAdjustContentInsets) {
        _insetsSafeArea = [[UIKitScrollViewInsetsSafeArea alloc] initWithRCTScrollView:_rctScrollView];
        [self reset];
    } else {
        _insetsSafeArea = NULL;
    }
    
    [self onInsetsShouldBeRecalculated];
}

- (void)setAutomaticallyAdjustKeyboardInsets:(BOOL)automaticallyAdjustKeyboardInsets {
    _automaticallyAdjustKeyboardInsets = automaticallyAdjustKeyboardInsets;
    
    if (automaticallyAdjustKeyboardInsets) {
        _insetsKeyboard = [[UIKitScrollViewInsetsKeyboard alloc] initWithRCTScrollView:_rctScrollView
                                                                          withDelegate:self];
        [self reset];
    } else {
        _insetsKeyboard = NULL;
    }
    
    [self onInsetsShouldBeRecalculated];
}

- (void)setContentInset:(UIEdgeInsets)contentInset {
    _contentInset = contentInset;
    
    [self onInsetsShouldBeRecalculated];
}

- (void)setKeyboardInsetAdjustmentBehavior:(NSString *)keyboardInsetAdjustmentBehavior {
    _keyboardInsetAdjustmentBehavior = keyboardInsetAdjustmentBehavior;
    
    [self onInsetsShouldBeRecalculated];
}

- (void)onInsetsShouldBeRecalculated {
    if (_insetsSafeArea == NULL && _insetsKeyboard == NULL) {
        return;
    }
    
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
        InsetsChange keyboardChange = [_insetsKeyboard calculateInsets:change.insets
                                                      withNotification:notification
                                                          contentInset:self.contentInset
                                       keyboardInsetAdjustmentBehavior:self.keyboardInsetAdjustmentBehavior];
        
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
    if (_rctScrollView == NULL) {
        return;
    }
    
    if (!UIEdgeInsetsEqualToEdgeInsets(_rctScrollView.scrollView.contentInset, insets)) {
        [_rctScrollView.scrollView setContentInset:insets];
    }
        
    if (!UIEdgeInsetsEqualToEdgeInsets(_rctScrollView.scrollView.scrollIndicatorInsets, indicatorInsets)) {
        [_rctScrollView.scrollView setScrollIndicatorInsets:indicatorInsets];
    }
}

- (void)setInsets:(UIEdgeInsets)insets withIndicator:(UIEdgeInsets)indicatorInsets duration:(NSTimeInterval)duration curve:(UIViewAnimationCurve)curve {
    if (_rctScrollView == NULL) {
        return;
    }
    
    [UIView animateWithDuration:duration
                          delay:0.0
                        options:animationOptionsWithCurve(curve)
                     animations:^{
        [self->_rctScrollView.scrollView setContentInset:insets];
        [self->_rctScrollView.scrollView setScrollIndicatorInsets:indicatorInsets];
    } completion:nil];
}

@end
