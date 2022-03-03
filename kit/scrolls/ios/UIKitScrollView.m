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
    
    [_insets setContentInset:_contentInsetInternal];
    [_insets setKeyboardInsetAdjustmentBehavior:self.keyboardInsetAdjustmentBehavior];
    [_insets setAutomaticallyAdjustContentInsets:_automaticallyAdjustContentInsetsInternal];
    [_insets setAutomaticallyAdjustKeyboardInsets:self.automaticallyAdjustKeyboardInsets];
    if ([_insets didMoveToWindow]) {
        [super setAutomaticallyAdjustContentInsets:NO];
        [_insets reset];
    }
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

@end
