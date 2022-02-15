//
//  UIKitScrollViewInsets+SafeArea.m
//  Pods
//
//  Created by Aleksei Savelev on 14.02.2022.
//

#import "UIKitScrollViewInsetsSafeArea.h"

@implementation UIKitScrollViewInsetsSafeArea {
    RCTScrollView *_rctScrollView;
}

- (instancetype)initWithRCTScrollView:(RCTScrollView *)rctScrollView {
    if ([self init]) {
        _rctScrollView = rctScrollView;
    }
    
    return self;
}

- (InsetsChange)calculateInsets:(UIEdgeInsets)currentInsets {
    UIEdgeInsets safeAreaInsets = [self getSafeAreaInsets];
    
    UIEdgeInsets newInsets = UIEdgeInsetsMake(currentInsets.top + safeAreaInsets.top,
                                              currentInsets.left + safeAreaInsets.left,
                                              currentInsets.bottom + safeAreaInsets.bottom,
                                              currentInsets.right + safeAreaInsets.right);
    
    UIEdgeInsets indicatorInsets;
    
    if (_rctScrollView.inverted) {
        CGFloat indicatorInsetBottom = newInsets.bottom;
        
        if (@available(iOS 13.0, *)) {
            // nothing
        } else {
            indicatorInsetBottom -= safeAreaInsets.top;
        }
        
        indicatorInsets = UIEdgeInsetsMake(indicatorInsetBottom,
                                           newInsets.left,
                                           newInsets.bottom,
                                           newInsets.right);
    } else {
        CGFloat indicatorInsetBottom = newInsets.bottom;
        
        if (@available(iOS 13.0, *)) {
            // nothing
        } else {
            indicatorInsetBottom -= safeAreaInsets.bottom;
        }
        
        indicatorInsets = UIEdgeInsetsMake(newInsets.top,
                                           newInsets.left,
                                           indicatorInsetBottom,
                                           newInsets.right);
    }
    
    return InsetsChangeInstantMake(newInsets, indicatorInsets);
}

- (UIEdgeInsets)getSafeAreaInsets {
#if __IPHONE_OS_VERSION_MAX_ALLOWED > __IPHONE_10_3
    if (@available(iOS 11.0, *)) {
        return _rctScrollView.safeAreaInsets;
    }
#endif
    return UIEdgeInsetsZero;
}

@end
