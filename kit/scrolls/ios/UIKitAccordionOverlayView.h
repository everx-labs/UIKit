//
//  UIKitAccordionOverlayView.h
//  UIKitScrolls
//
//  Created by Aleksei Savelev on 14/12/2021
//

#import <UIKit/UIKit.h>
#import <React/RCTView.h>
#import <React/RCTComponent.h>

@class RCTBridge;

@interface UIKitAccordionOverlayView : RCTView

- (instancetype)initWithBridge:(RCTBridge *)bridge;

@property (nonatomic, readwrite, retain) RCTBridge *currentBridge;
@property (nonatomic, copy) RCTBubblingEventBlock onCommandFinished;

- (void)show:(NSNumber *)startY endY:(NSNumber *)endY;
- (void)append:(NSNumber *)startY endY:(NSNumber *)endY;
- (void)moveAndHide:(NSNumber *)shiftY duration:(NSNumber *)duration;

@end
