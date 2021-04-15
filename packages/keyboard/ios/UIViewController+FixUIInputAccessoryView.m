//
//  UIViewController+FixUIInputAccessoryView.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 12/04/2021
//

#import "UIInputAccessoryView.h"
#import "UIInputAccessoryView+ListenTextField.h"
#import "UIViewController+FixUIInputAccessoryView.h"

#import <objc/runtime.h>

@implementation UIViewController (FixUIInputAccessoryView)

+ (void)load
{
    if ([self instancesRespondToSelector:@selector(transitionCoordinator)]) {
        static dispatch_once_t onceToken;
        dispatch_once(&onceToken, ^{
            [self uikit_swizzleSelector:@selector(beginAppearanceTransition:animated:) withSelector:@selector(uikit_beginAppearanceTransition:animated:)];
            [self uikit_swizzleSelector:@selector(viewDidAppear:) withSelector:@selector(uikit_viewDidAppear)];
            [self uikit_swizzleSelector:@selector(viewDidDisappear:) withSelector:@selector(uikit_viewDidDisappear)];
        });
    }
}

+ (void)uikit_swizzleSelector:(SEL)originalSelector withSelector:(SEL)swizzledSelector
{
    Class class = [self class];

    Method originalMethod = class_getInstanceMethod(class, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);

    BOOL didAddMethod = class_addMethod(class, originalSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod));
    if (didAddMethod) {
        class_replaceMethod(class, swizzledSelector, method_getImplementation(originalMethod), method_getTypeEncoding(originalMethod));
    } else {
        method_exchangeImplementations(originalMethod, swizzledMethod);
    }
}

- (void)uikit_beginAppearanceTransition:(BOOL)isAppearing animated:(BOOL)animated
{
    [self uikit_beginAppearanceTransition:isAppearing animated:animated];

    if (isAppearing || !animated) {
        return;
    }

    if (![self.transitionCoordinator isInteractive]) {
        return;
    }
    
    UIInputAccessoryView *currentAccessoryView = [UIInputAccessoryView currentView];
    
    if (currentAccessoryView == nil) {
        return;
    }
    
    currentAccessoryView.isInAppearanceTransition = YES;
}

/**
 * Need to reset a flag if appearance transtion is ended
 */
- (void)uikit_viewDidAppear {
    [self uikit_viewDidAppear];
    
    UIInputAccessoryView *currentAccessoryView = [UIInputAccessoryView currentView];
    
    if (currentAccessoryView == nil) {
        return;
    }
    
    currentAccessoryView.isInAppearanceTransition = NO;
}

/**
 * Need to reset a flag if appearance transtion is ended
 */
- (void)uikit_viewDidDisappear {
    [self uikit_viewDidDisappear];
    
    UIInputAccessoryView *currentAccessoryView = [UIInputAccessoryView currentView];
    
    if (currentAccessoryView == nil) {
        return;
    }
    
    currentAccessoryView.isInAppearanceTransition = NO;
}

@end
