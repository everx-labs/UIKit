//
//  UIInputAccessoryViewManager.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 05/03/2021
//

#import "UIInputAccessoryViewManager.h"
#import "UIInputAccessoryView.h"

@implementation UIInputAccessoryViewManager

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (UIView *)view {
    return [[UIInputAccessoryView alloc] initWithBridge:self.bridge];
}

@end
