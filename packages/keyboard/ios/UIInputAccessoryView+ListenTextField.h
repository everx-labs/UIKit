//
//  UIInputAccessoryView+ScrollView.h
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 12/04/2021
//

#import <UIKit/UIKit.h>

#import "UIInputAccessoryView.h"
#import "TextFieldDelegateWrapper.h"

@interface UIInputAccessoryView (ListenTextField) <UITextFieldDelegate, UITextViewDelegate>

- (void)startListenToTextField;
- (void)stopListenToTextField;

@property (nonatomic, assign) BOOL isInAppearanceTransition;
@property (nonatomic, retain) TextFieldDelegateWrapper *delegateWrapper;

@end
