//
//  UICustomKeyboardViewController.h
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 25/03/2021
//

#import <UIKit/UIKit.h>

@class RCTBridge;

@interface UICustomKeyboardViewController : UIInputViewController

- (instancetype)initWithBridge:(RCTBridge *)bridge
                    moduleName:(NSString *)moduleName
             initialProperties:(NSDictionary *)initialProperties
               backgroundColor:(UIColor *)backgroundColor
                keyboardHeight:(CGFloat)keyboardHeight;

@end
