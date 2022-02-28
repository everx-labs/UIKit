//
//  UIKitScrollViewInsetsModifier.h
//  Pods
//
//  Created by Aleksei Savelev on 14.02.2022.
//

#import <Foundation/Foundation.h>

typedef struct {
    BOOL animated;
    
    UIEdgeInsets insets;
    UIEdgeInsets indicatorInsets;
    NSTimeInterval duration;
    UIViewAnimationCurve curve;
} InsetsChange;

static inline InsetsChange InsetsChangeEmpty() {
    InsetsChange change;
    
    change.animated = NO;
    
    change.insets = UIEdgeInsetsZero;
    change.indicatorInsets = UIEdgeInsetsZero;
    
    return change;
}

static inline InsetsChange InsetsChangeInstantMake(UIEdgeInsets insets, UIEdgeInsets indicatorInsets) {
    InsetsChange change;
    
    change.animated = NO;
    
    change.insets = insets;
    change.indicatorInsets = indicatorInsets;
    
    return change;
}

static inline InsetsChange InsetsChangeAnimatedMake(UIEdgeInsets insets, UIEdgeInsets indicatorInsets, NSTimeInterval duration, UIViewAnimationCurve curve) {
    InsetsChange change;
    
    change.animated = YES;
    
    change.insets = insets;
    change.indicatorInsets = indicatorInsets;
    change.duration = duration;
    change.curve = curve;
    
    return change;
}

@protocol UIKitScrollViewInsetsDelegate <NSObject>

- (void)onInsetsShouldBeRecalculated;
- (void)onInsetsShouldBeRecalculated:(NSNotification *)notification;

@end
