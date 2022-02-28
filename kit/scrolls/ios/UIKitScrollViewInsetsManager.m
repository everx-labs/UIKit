//
//  UIKitScrollViewInsets.h
//  Pods
//
//  Created by Aleksei Savelev on 14.02.2022.
//

#import "UIKitScrollViewInsetsManager.h"
#import "UIKitScrollViewInsets.h"

@implementation UIKitScrollViewInsetsManager

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (UIView *)view {
    return [[UIKitScrollViewInsets alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(automaticallyAdjustContentInsets, BOOL);
RCT_EXPORT_VIEW_PROPERTY(automaticallyAdjustKeyboardInsets, BOOL);
RCT_EXPORT_VIEW_PROPERTY(keyboardInsetAdjustmentBehavior, NSString);
RCT_EXPORT_VIEW_PROPERTY(contentInset, UIEdgeInsets);

@end
