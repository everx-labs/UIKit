//
//  HDuplicateRCTImageView.m
//  uikit.media
//
//  Created by Aleksei Saveliev on 02.08.2021.
//

#import "HDuplicateRCTImageView.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUtils.h>
#import <React/RCTUIManagerUtils.h>

@implementation HDuplicateRCTImageView {
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
        HDuplicateRCTImageView *strongSelf = weakSelf;
        if (!strongSelf) {
            return;
        }
        
        [strongSelf->_bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
            UIView *originalImageView = viewRegistry[originalViewTag];
            
            RCTExecuteOnMainQueue(^{
                HDuplicateRCTImageView *strongSelf = weakSelf;
                if (!strongSelf) {
                    return;
                }
                [strongSelf setValue:[originalImageView valueForKey:@"_imageSource"] forKey:@"_imageSource"];
                [strongSelf setValue:[originalImageView valueForKey:@"image"] forKey:@"image"];
            });

        }];
        [strongSelf->_bridge.uiManager setNeedsLayout];
    });
}

@end
