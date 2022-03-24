//
//  UIKitScrollViewInsetsSafeArea.h
//  Pods
//
//  Created by Aleksei Savelev on 14.02.2022.
//

#import <React/RCTScrollView.h>

#import "UIKitScrollViewInsetsDelegate.h"

@interface UIKitScrollViewInsetsSafeArea : NSObject

- (instancetype)initWithRCTScrollView:(RCTScrollView *)rctScrollView;

- (InsetsChange)calculateInsets:(UIEdgeInsets)insets;

@end
