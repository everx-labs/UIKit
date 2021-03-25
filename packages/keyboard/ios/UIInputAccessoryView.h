//
//  UIInputAccessoryView.h
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 05/03/2021
//

#import <UIKit/UIKit.h>

@class RCTBridge;

@interface UIInputAccessoryView : UIView

- (instancetype)initWithBridge:(RCTBridge *)bridge;

@property (nonatomic, copy) NSString *managedScrollViewNativeID;
@property (nonatomic, copy) NSDictionary *customKeyboardView;

@end
