//
//  UIKitScrollViewInsetsKeyboard.m
//  Pods
//
//  Created by Aleksei Savelev on 14.02.2022.
//

#import "UIKitScrollViewInsetsKeyboard.h"

@implementation UIKitScrollViewInsetsKeyboard {
    RCTScrollView *_rctScrollView;
    __weak id<UIKitScrollViewInsetsDelegate> _delegate;
}

- (instancetype)initWithRCTScrollView:(RCTScrollView *)rctScrollView withDelegate:(id<UIKitScrollViewInsetsDelegate>)delegate {
    if ([self init]) {
        _rctScrollView = rctScrollView;
        _delegate = delegate;
        
        [self registerKeyboardListener];
    }
    
    return self;
}

- (void)dealloc {
    [self unregisterKeyboardListener];
}

// Use https://github.com/tonlabs/UIKit/blob/reanimated-keyboard-listeners/casts/keyboard/ios/UIKitKeyboardIosFrameListener.m#L101 instead when it will be possible
- (void)registerKeyboardListener {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillChangeFrame:)
                                                 name:UIKeyboardWillChangeFrameNotification
                                               object:nil];
}

- (void)unregisterKeyboardListener {
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardWillChangeFrameNotification
                                                  object:nil];
}

- (void)keyboardWillChangeFrame:(NSNotification*)notification {
    if ([self isHorizontal:_rctScrollView.scrollView]) {
        return;
    }
    
    if ([_delegate respondsToSelector:@selector(onInsetsShouldBeRecalculated:)]) {
        [_delegate onInsetsShouldBeRecalculated:notification];
    }
}

- (InsetsChange)calculateInsets:(UIEdgeInsets)insetsInChain
               withNotification:(NSNotification*)notification
                   contentInset:(UIEdgeInsets)contentInset
keyboardInsetAdjustmentBehavior:(NSString *)keyboardInsetAdjustmentBehavior {
    if (notification == NULL) {
        return InsetsChangeInstantMake(insetsInChain, insetsInChain);
    }
    
    // Use it if you want insets change to be animated
    // double duration = [notification.userInfo[UIKeyboardAnimationDurationUserInfoKey] doubleValue];
    // UIViewAnimationCurve curve = (UIViewAnimationCurve)[notification.userInfo[UIKeyboardAnimationCurveUserInfoKey] unsignedIntegerValue];
    CGRect endFrame = [notification.userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
    
    CGPoint absoluteViewOrigin = [_rctScrollView convertPoint:_rctScrollView.bounds.origin toView:nil];
    CGFloat globalHeight = [[UIScreen mainScreen] bounds].size.height;
    
    CGFloat scrollViewLowerYUnconstrained = _rctScrollView.inverted ? absoluteViewOrigin.y : absoluteViewOrigin.y + _rctScrollView.bounds.size.height;
    CGFloat scrollViewLowerY = MIN(scrollViewLowerYUnconstrained,
                                   globalHeight);
    
    UIEdgeInsets newEdgeInsets = insetsInChain;
    
    CGFloat inset = MAX(scrollViewLowerY - endFrame.origin.y, 0);
    
    if ([keyboardInsetAdjustmentBehavior isEqualToString:@"inclusive"]) {
        inset = MAX(scrollViewLowerY - endFrame.origin.y - contentInset.bottom, 0);
    }
    
    if (_rctScrollView.inverted) {
        newEdgeInsets.top = MAX(inset, insetsInChain.top);
    } else {
        newEdgeInsets.bottom = MAX(inset, insetsInChain.bottom);
    }
    
    return InsetsChangeInstantMake(newEdgeInsets, newEdgeInsets);
}

- (BOOL)isHorizontal:(UIScrollView *)scrollView {
    return scrollView.contentSize.width > _rctScrollView.frame.size.width;
}

@end
