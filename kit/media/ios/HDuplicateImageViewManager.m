//
//  HDuplicateImageViewManager.m
//  uikit.media
//
//  Created by Aleksei Saveliev on 02.08.2021.
//

#import "HDuplicateImageViewManager.h"
#import "HDuplicateFastImageView.h"

@implementation HDuplicateImageViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[HDuplicateFastImageView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(originalViewRef, NSNumber)

@end
