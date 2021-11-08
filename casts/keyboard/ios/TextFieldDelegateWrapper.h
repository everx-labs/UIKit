//
//  TextFieldDelegateWrapper.h
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 12/04/2021
//

#import <UIKit/UIKit.h>

@interface TextFieldDelegateWrapper : NSObject <UITextFieldDelegate, UITextViewDelegate>

@property (nonatomic, weak) id originalDelegate;
@property (nonatomic, weak) id interceptorDelegate;

- (instancetype)init;

@end
