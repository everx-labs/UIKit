//
//  HDuplicateImageViewManager.m
//  uistory.chats
//
//  Created by Aleksei Saveliev on 02.08.2021.
//

#import "HDuplicateImageViewManager.h"
#import "HDuplicateImageView.h"

@implementation HDuplicateImageViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[HDuplicateImageView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(originalViewRef, NSNumber)

@end
