//
//  HDuplicateImageView.m
//  uikit.media
//
//  Created by Aleksei Saveliev on 02.08.2021.
//

#import "HDuplicateImageView.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUtils.h>
#import <React/RCTUIManagerUtils.h>
#import <RNFastImage/FFFastImageView.h>

@implementation HDuplicateImageView {
    // Weak reference back to the bridge, for image loading
    __weak RCTBridge *_bridge;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    // Weak reference back to the bridge, for image loading
    _bridge = bridge;
    
    return [super initWithBridge:bridge];
}

- (void)setOriginalViewRef:(NSNumber *)originalViewTag {
    __weak typeof(self)weakSelf = self;
    RCTExecuteOnUIManagerQueue(^{
        HDuplicateImageView *strongSelf = weakSelf;
        if (!strongSelf) {
            return;
        }
        
        [strongSelf->_bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
            UIView *originalImageView = viewRegistry[originalViewTag];
            
            RCTExecuteOnMainQueue(^{
                HDuplicateImageView *strongSelf = weakSelf;
                if (!strongSelf) {
                    return;
                }
                if ([originalImageView isKindOfClass:[RCTImageView class]]) {
                    // If React Image is being duplicated
                    [strongSelf setValue:[originalImageView valueForKey:@"_imageSource"] forKey:@"_imageSource"];
                    [strongSelf setValue:[originalImageView valueForKey:@"image"] forKey:@"image"];
                } else if ([originalImageView isKindOfClass:[RCTView class]]) {
                    // If FastImage is being duplicated
                    NSArray<__kindof UIView *> *subviews = originalImageView.subviews;
                    
                    if ([subviews[0] isKindOfClass:[FFFastImageView class]]) {
                        FFFastImageView *fastImageView = subviews[0];
                        [strongSelf setValue:[fastImageView valueForKey:@"_source"] forKey:@"_imageSource"];
                        [strongSelf setValue:[fastImageView valueForKey:@"image"] forKey:@"image"];
                    }
                }
            });

        }];
        [strongSelf->_bridge.uiManager setNeedsLayout];
    });
}

@end
