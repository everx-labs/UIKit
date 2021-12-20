//
//  UIKitAccordionOverlayViewManager.m
//  UIKitScrolls
//
//  Created by Aleksei Savelev on 14/12/2021
//

#import "UIKitAccordionOverlayViewManager.h"
#import "UIKitAccordionOverlayView.h"

#import <React/RCTView.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation UIKitAccordionOverlayViewManager

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (UIView *)view {
    return [[UIKitAccordionOverlayView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(onCommandFinished, RCTBubblingEventBlock)

RCT_EXPORT_METHOD(show:(nonnull NSNumber*)reactTag startY:(nonnull NSNumber *)startY endY:(nonnull NSNumber *)endY {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        UIKitAccordionOverlayView *view = (UIKitAccordionOverlayView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[UIKitAccordionOverlayView class]]) {
            return;
        }
        [view show:startY endY:endY];
        view.onCommandFinished(@{
            @"finishedCommand": @"show",
        });
    }];
})

RCT_EXPORT_METHOD(append:(nonnull NSNumber*)reactTag startY:(nonnull NSNumber *)startY endY:(nonnull NSNumber *)endY {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        UIKitAccordionOverlayView *view = (UIKitAccordionOverlayView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[UIKitAccordionOverlayView class]]) {
            return;
        }
        [view append:startY endY:endY];
        view.onCommandFinished(@{
            @"finishedCommand": @"append",
        });
    }];
})

RCT_EXPORT_METHOD(moveAndHide:(nonnull NSNumber*)reactTag shiftY:(nonnull NSNumber *)shiftY duration:(nonnull NSNumber *)duration {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        UIKitAccordionOverlayView *view = (UIKitAccordionOverlayView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[UIKitAccordionOverlayView class]]) {
            return;
        }
        [view moveAndHide:shiftY duration:duration onFinish:^() {
            view.onCommandFinished(@{
                @"finishedCommand": @"moveAndHide",
            });
        }];
    }];
})

@end
