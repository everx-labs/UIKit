//
//  UIInputAccessoryViewManager.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 05/03/2021
//

#import "UIInputAccessoryViewManager.h"
#import "UIInputAccessoryView.h"

#import <React/RCTView.h>

@implementation UIInputAccessoryViewManager

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(managedScrollViewNativeID, NSString);

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (UIView *)view {
    return [[UIInputAccessoryView alloc] initWithBridge:self.bridge];
}

RCT_CUSTOM_VIEW_PROPERTY(transform, CATransform3D, RCTView)
{
    return;
}

@end
