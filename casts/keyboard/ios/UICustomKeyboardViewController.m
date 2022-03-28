//
//  UICustomKeyboardViewController.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 25/03/2021
//

#import "UICustomKeyboardViewController.h"

#import <React/RCTRootView.h>

@implementation UICustomKeyboardViewController

- (instancetype)initWithBridge:(RCTBridge *)bridge
                    moduleName:(NSString *)moduleName
             initialProperties:(NSDictionary *)initialProperties
               backgroundColor:(UIColor *)backgroundColor
                keyboardHeight:(CGFloat)keyboardHeight {
    if (self = [super init]) {
        self.inputView = [[UIInputView alloc] initWithFrame:CGRectZero inputViewStyle:UIInputViewStyleKeyboard];
        
        UIView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:moduleName initialProperties:initialProperties];
        rootView.translatesAutoresizingMaskIntoConstraints = NO;
        
        [self.inputView addSubview:rootView];
        
        [NSLayoutConstraint activateConstraints:@[
            [rootView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor],
            [rootView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor],
            [rootView.topAnchor constraintEqualToAnchor:self.view.topAnchor],
            [rootView.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor],
        ]];
        
        if (keyboardHeight > 0) {
            NSLayoutConstraint *inputViewHeightConstraint = [self.view.heightAnchor constraintEqualToConstant:keyboardHeight];
            inputViewHeightConstraint.active = YES;
            [self.inputView setAllowsSelfSizing:YES];
        }
        
        self.view.backgroundColor = backgroundColor;
        self.inputView.backgroundColor = backgroundColor;
        [self.inputView setNeedsLayout];
        
        self.view.translatesAutoresizingMaskIntoConstraints = NO;
    }
    
    return self;
}

@end
