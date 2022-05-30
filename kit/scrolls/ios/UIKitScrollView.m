//
//  UIKitScrollView.m
//  UIKitScrolls
//
//  Created by Aleksei Savelev on 02.03.2022.
//

#import "UIKitScrollView.h"
#import "UIKitScrollViewInsets.h"

@implementation UIKitScrollView {
    UIKitScrollViewInsets *_insets;
    // It's an actual prop of a superview,
    // but we want to have our own version that isn't synced
    BOOL _automaticallyAdjustContentInsetsInternal;
    // It's an actual prop of a superview,
    // but we want to have our own version that isn't synced
    UIEdgeInsets _contentInsetInternal;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    if (self = [super initWithEventDispatcher:bridge.eventDispatcher]) {
        _insets = [[UIKitScrollViewInsets alloc] initWithScrollView:self];
        _automaticallyAdjustContentInsetsInternal = false;
    }
    
    return self;
}

- (instancetype)initWithEventDispatcher:(id<RCTEventDispatcherProtocol>)eventDispatcher {
    if (self = [super initWithEventDispatcher:eventDispatcher]) {
        //
    }
    
    return self;
}

- (void)didMoveToWindow {
    [super didMoveToWindow];
    
    if (self.window == nil) {
        return;
    }
    
    [_insets setContentInset:_contentInsetInternal];
    [_insets setKeyboardInsetAdjustmentBehavior:self.keyboardInsetAdjustmentBehavior];
    [_insets setAutomaticallyAdjustContentInsets:_automaticallyAdjustContentInsetsInternal];
    [_insets setAutomaticallyAdjustKeyboardInsets:self.automaticallyAdjustKeyboardInsets];
    if ([_insets didMoveToWindow]) {
        [super setAutomaticallyAdjustContentInsets:NO];
        [_insets reset];
    }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    [_insets onInsetsShouldBeRecalculated];
}

- (void)safeAreaInsetsDidChange {
    [_insets onInsetsShouldBeRecalculated];
}

- (void)setAutomaticallyAdjustContentInsets:(BOOL)automaticallyAdjustContentInsets {
    [super setAutomaticallyAdjustContentInsets:false];
    
    _automaticallyAdjustContentInsetsInternal = automaticallyAdjustContentInsets;
    
    [_insets setAutomaticallyAdjustContentInsets:automaticallyAdjustContentInsets];
    
    if ([self setParentContentInset]) {
        return;
    }
    
    [_insets onInsetsShouldBeRecalculated];
}

- (void)setAutomaticallyAdjustKeyboardInsets:(BOOL)automaticallyAdjustKeyboardInsets {
    _automaticallyAdjustKeyboardInsets = automaticallyAdjustKeyboardInsets;
    
    [_insets setAutomaticallyAdjustKeyboardInsets:automaticallyAdjustKeyboardInsets];
    [_insets onInsetsShouldBeRecalculated];
}

- (void)setContentInset:(UIEdgeInsets)contentInset {
    _contentInsetInternal = contentInset;
    
    [_insets setContentInset:contentInset];
    
    if ([self setParentContentInset]) {
        return;
    }
    
    [_insets onInsetsShouldBeRecalculated];
}

- (BOOL)setParentContentInset {
    BOOL autoInsets = _automaticallyAdjustContentInsetsInternal || self.automaticallyAdjustKeyboardInsets;
    
    if (!autoInsets) {
        [super setContentInset:_contentInsetInternal];
        
        return true;
    }
    
    return false;
}

- (void)setKeyboardInsetAdjustmentBehavior:(NSString *)keyboardInsetAdjustmentBehavior {
    _keyboardInsetAdjustmentBehavior = keyboardInsetAdjustmentBehavior;
    
    [_insets setKeyboardInsetAdjustmentBehavior:keyboardInsetAdjustmentBehavior];
    [_insets onInsetsShouldBeRecalculated];
}

/**
 * This is need for detox,
 * since it simply search for RCTScrollView
 * https://github.com/wix/Detox/blob/c5562b4573d34df4ffa4a6db283ff105cfc7caf0/detox/ios/Detox/Invocation/Element.swift#L82
 *
 * But since here we replace implementation with our own
 * we can use the logic from detox that looks for UIScrollView
 * https://github.com/wix/Detox/blob/c5562b4573d34df4ffa4a6db283ff105cfc7caf0/detox/ios/Detox/Invocation/Element.swift#L77
 */
- (void)setTestID:(NSString *)testID {
    self.scrollView.accessibilityIdentifier = testID;
}

@end
