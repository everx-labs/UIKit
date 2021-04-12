//
//  UIInputAccessoryView+ScrollView.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 12/04/2021
//

#import "UIInputAccessoryView+ListenTextField.h"

#import <React/UIView+React.h>

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
    return objc_setAssociatedObject(
                                    self,
                                    @selector(isInAppearanceTransition),
                                    isInAppearanceTransitionBool,
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
    
    if ([currentTextField isDescendantOfView:self]) {
        currentTextField.delegate = self;
    }
}

- (BOOL)textFieldShouldEndEditing:(UITextField *)textField {
    return !self.isInAppearanceTransition;
}

- (BOOL)textViewShouldEndEditing:(UITextView *)textView {
    return !self.isInAppearanceTransition;
}

- (void)stopListenToTextField {
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    [center removeObserver:self name:UITextFieldTextDidBeginEditingNotification object:nil];
    [center removeObserver:self name:UITextViewTextDidBeginEditingNotification object:nil];
}

@end
