//
//  UIKitScrollViewInsets+SafeArea.m
//  Pods
//
//  Created by Aleksei Savelev on 14.02.2022.
//

#import "UIView+React.h"

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

    UIEdgeInsets newInsets;
    UIEdgeInsets indicatorInsets;
    
    if (_rctScrollView.inverted) {
        newInsets = UIEdgeInsetsMake(currentInsets.bottom + safeAreaInsets.bottom,
                                     currentInsets.left + safeAreaInsets.left,
                                     currentInsets.top + safeAreaInsets.top,
                                     currentInsets.right + safeAreaInsets.right);
        
        CGFloat indicatorInsetBottom = newInsets.top;
        
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
        newInsets = UIEdgeInsetsMake(currentInsets.top + safeAreaInsets.top,
                                     currentInsets.left + safeAreaInsets.left,
                                     currentInsets.bottom + safeAreaInsets.bottom,
                                     currentInsets.right + safeAreaInsets.right);
        
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
    UIEdgeInsets safeAreaInsets = [self getRawSafeAreaInsets];
    
    CGFloat screenHeight = [[UIScreen mainScreen] bounds].size.height;
    CGFloat absoluteSafeBottomY = screenHeight - safeAreaInsets.bottom;
    
    CGRect absoluteViewRect = [_rctScrollView.window convertRect:_rctScrollView.frame toView:_rctScrollView.superview];
    CGPoint absoluteViewOrigin = absoluteViewRect.origin;
    CGFloat viewBottomY = absoluteViewOrigin.y + _rctScrollView.bounds.size.height;

    CGFloat topInset = MAX(safeAreaInsets.top - absoluteViewOrigin.y, 0);
    CGFloat bottomInset = MAX(MIN(viewBottomY, screenHeight) - absoluteSafeBottomY, 0);
    
    return (UIEdgeInsets){topInset, safeAreaInsets.left, bottomInset, safeAreaInsets.right};
}

- (UIEdgeInsets)getRawSafeAreaInsets {
#if __IPHONE_OS_VERSION_MAX_ALLOWED > __IPHONE_10_3
    if (@available(iOS 11.0, *)) {
        UIView *view = _rctScrollView;
        while (view) {
          UIViewController *controller = view.reactViewController;
          if (controller) {
              return controller.view.safeAreaInsets;
          }
          view = view.superview;
        }
        return UIEdgeInsetsZero;
    }
#endif
    return UIEdgeInsetsZero;
}

@end
