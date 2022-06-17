//
//  UIKitSkeletonViewManager.m
//  UIKitLayout
//
//  Created by Aleksei Savelev on 15/06/2022
//

#import "UIKitSkeletonViewManager.h"
#import "UIKitSkeletonView.h"

@implementation UIKitSkeletonViewManager

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (UIView *)view {
    return [[UIKitSkeletonView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(loading, BOOL);

@end
