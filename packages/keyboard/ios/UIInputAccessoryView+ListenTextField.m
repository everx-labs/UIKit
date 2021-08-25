//
//  UIInputAccessoryView+ScrollView.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 12/04/2021
//

#import "UIInputAccessoryView+ListenTextField.h"

#import <objc/runtime.h>

/**
 * MOTIVATION:
 * It seems that UIKit (UINavigationController in particular)
 * tries to resign first responder from a TextField or TextView
 * when animation between ViewControllers is happening.
 * In our case it looks very ugly, keyboard view is disappeared immediately
 * when `inputAccessoryView` is still animating (to bottom, that is also wrong).
 *
 * So, to fix it, we have to:
 * 1. listen to current view controller animation, and set a flag that it's happening;
 * 2. listen to textfields and prevent them to lose focus.
 */
@implementation UIInputAccessoryView (ListenTextField)

- (BOOL)isInAppearanceTransition {
    NSNumber *isInAppearanceTransitionBool = objc_getAssociatedObject(self, @selector(isInAppearanceTransition));
    return [isInAppearanceTransitionBool boolValue];
}

- (void)setIsInAppearanceTransition:(BOOL)isInAppearanceTransition {
    NSNumber *isInAppearanceTransitionBool = [NSNumber numberWithBool:isInAppearanceTransition];
    return objc_setAssociatedObject(self,
                                    @selector(isInAppearanceTransition),
                                    isInAppearanceTransitionBool,
                                    OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (TextFieldDelegateWrapper *)delegateWrapper {
    return objc_getAssociatedObject(self, @selector(delegateWrapper));
}

- (void)setDelegateWrapper:(TextFieldDelegateWrapper *)delegateWrapper {
    return objc_setAssociatedObject(self,
                                    @selector(delegateWrapper),
                                    delegateWrapper,
                                    OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

// MARK:- Methods

- (void)startListenToTextField {
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    [center addObserver:self selector:@selector(didBeginEditing:) name:UITextFieldTextDidBeginEditingNotification object:nil];
    [center addObserver:self selector:@selector(didBeginEditing:) name:UITextViewTextDidBeginEditingNotification object:nil];
}

- (void)didBeginEditing:(NSNotification *)note {
    UITextField *currentTextField = note.object;
    
    if (![currentTextField isDescendantOfView:self]) {
        return;
    }
    if ([currentTextField.delegate isKindOfClass:[TextFieldDelegateWrapper class]]) {
        return;
    }
    
    TextFieldDelegateWrapper *delegateWrapper = [[TextFieldDelegateWrapper alloc] init];
    delegateWrapper.originalDelegate = currentTextField.delegate;
    delegateWrapper.interceptorDelegate = self;
    
    self.delegateWrapper = delegateWrapper;
    // Can't set it usual way because of https://github.com/facebook/react-native/blob/1465c8f3874cdee8c325ab4a4916fda0b3e43bdb/Libraries/Text/TextInput/Multiline/RCTUITextView.m#L64-L66
    [currentTextField setValue:delegateWrapper forKey:@"_delegate"];
}

- (BOOL)textFieldShouldEndEditing:(UITextField *)textField {
    if (self.isInAppearanceTransition) {
        return NO;
    }
    
    return [self.delegateWrapper.originalDelegate textFieldShouldEndEditing:textField];
}

- (BOOL)textViewShouldEndEditing:(UITextView *)textView {
    if (self.isInAppearanceTransition) {
        return NO;
    }
    
    return [self.delegateWrapper.originalDelegate textViewShouldEndEditing:textView];
}

- (void)stopListenToTextField {
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    [center removeObserver:self name:UITextFieldTextDidBeginEditingNotification object:nil];
    [center removeObserver:self name:UITextViewTextDidBeginEditingNotification object:nil];
}

@end
