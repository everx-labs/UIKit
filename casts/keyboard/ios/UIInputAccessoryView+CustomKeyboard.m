//
//  UIInputAccessoryView+CustomKeyboard.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 26/03/2021
//

#import "UIInputAccessoryView+CustomKeyboard.h"
#import "UIObservingInputAccessoryView.h"
#import "UICustomKeyboardViewController.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTScrollView.h>
#import <React/RCTConvert.h>
#import <React/RCTBaseTextInputView.h>

#import <objc/runtime.h>

@interface UIInputAccessoryView ()

// Overriding `inputViewController` to `readwrite`.
@property (nonatomic, readwrite, retain) UIViewController *inputViewController;

@end

@implementation UIInputAccessoryView (CustomKeyboard)

@dynamic customKeyboardView;

- (NSDictionary *)customKeyboardView {
    return objc_getAssociatedObject(self, @selector(customKeyboardView));
}

- (void)setCustomKeyboardView:(NSDictionary *)customKeyboardView {
    NSDictionary *currentCustomKeyboardView = self.customKeyboardView;
    
    if (customKeyboardView == currentCustomKeyboardView) {
        return;
    }
    
    if (customKeyboardView == nil) {
        /**
         * Imagine following situation:
         * You have a TextInput and you want to close custom keyboard.
         * Then TextInput is focused obvious solution is to set
         * `customKeyboardView` prop to `null`, that trigers closing of it.
         * At the same time with focus on input you might want to see
         * default keyboard, but after focus event, with passing a prop
         * we have to call `becomeFirstResponder`, to apply `inputView` changes.
         * Hence in order not to lost focus on text input
         * we need to do it here manually.
         */
        UIView *focusedView = [self getFirstResponder];
        
        if (focusedView == nil || focusedView == self) {
            /**
             * If no other keyboards should be shown, just closing it.
             */
            self.inputViewController = nil;
            
            [self reloadInputViews];
        } else {
            [self becomeFirstResponder];
            
            self.inputViewController = nil;
            
            if ([focusedView respondsToSelector:@selector(reactFocus)]) {
                [focusedView reactFocus];
            } else {
                [focusedView becomeFirstResponder];
            }
        }
    } else {
        NSString *moduleName = [customKeyboardView objectForKey:@"moduleName"];
        NSDictionary *initialProps = [customKeyboardView objectForKey:@"initialProps"];
        UIColor *backgroundColor = [RCTConvert UIColor:[customKeyboardView objectForKey:@"backgroundColor"]];
    
        self.inputViewController = [[UICustomKeyboardViewController alloc]
                                initWithBridge:self.currentBridge
                                moduleName:moduleName
                                initialProperties:initialProps
                                backgroundColor:backgroundColor
                                keyboardHeight:((UIObservingInputAccessoryView *)self.inputAccessoryView).keyboardHeight];
        
        [self reloadInputViews];
        /**
         * Even though it might be already a first responder
         * It's crucial to call it again, as only after this call
         * `inputViewController` changes will be applied
         */
        [self becomeFirstResponder];
    }
    
    objc_setAssociatedObject(self, @selector(customKeyboardView), customKeyboardView, OBJC_ASSOCIATION_COPY_NONATOMIC);
}

-(UIView*)getFirstResponder
{
    return [self getFirstResponder:self];
}

-(UIView*)getFirstResponder:(UIView*)view
{
    if (view == nil || [view isFirstResponder])
    {
        return view;
    }
    
    for (UIView *subview in view.subviews)
    {
        UIView *firstResponder = [self getFirstResponder:subview];
        if(firstResponder != nil)
        {
            return firstResponder;
        }
    }
    return nil;
}


@end
