//
//  UIInputAccessoryView.h
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 05/03/2021
//

#import <UIKit/UIKit.h>

@class RCTBridge;

@interface UIInputAccessoryView : UIView

+ (instancetype)currentView;

- (instancetype)initWithBridge:(RCTBridge *)bridge;

@property (nonatomic, readwrite, retain) RCTBridge *currentBridge;
@property (nonatomic, readwrite) CGFloat diffInHeightToApply;

@end
