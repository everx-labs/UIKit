//
//  UIKitScrollView.h
//  UIKitScrolls
//
//  Created by Aleksei Savelev on 02.03.2022.
//

#import <React/RCTScrollView.h>

@interface UIKitScrollView : RCTScrollView

- (instancetype)initWithBridge:(RCTBridge *)bridge;

@property (nonatomic, copy) NSString *keyboardInsetAdjustmentBehavior;

@end
