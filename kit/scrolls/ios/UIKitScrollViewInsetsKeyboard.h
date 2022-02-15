//
//  UIKitScrollViewInsetsKeyboard.h
//  Pods
//
//  Created by Aleksei Savelev on 14.02.2022.
//

#import <React/RCTScrollView.h>

#import "UIKitScrollViewInsetsDelegate.h"

@interface UIKitScrollViewInsetsKeyboard : NSObject

- (instancetype)initWithRCTScrollView:(RCTScrollView *)rctScrollView withDelegate:(id<UIKitScrollViewInsetsDelegate>)delegate;

- (InsetsChange)calculateInsets:(UIEdgeInsets)insets withNotification:(NSNotification *)notification;

@end
