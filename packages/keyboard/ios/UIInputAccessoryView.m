//
//  UIInputAccessoryView.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 05/03/2021
//

#import "UIInputAccessoryView.h"
#import "UIObservingInputAccessoryView.h"

#import <React/RCTBridge.h>

@interface UIInputAccessoryView() <UIObservingInputAccessoryViewDelegate>

// Overriding `inputAccessoryView` to `readwrite`.
@property (nonatomic, readwrite, retain) UIView *inputAccessoryView;

@end

@implementation UIInputAccessoryView {
    BOOL _shouldBecomeFirstResponder;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    if (self = [super init]) {
        UIObservingInputAccessoryView *inputAccessoryView = [UIObservingInputAccessoryView new];
        
        _inputAccessoryView = inputAccessoryView;
        
        inputAccessoryView.delegate = self;
        
        _shouldBecomeFirstResponder = YES;
    }
    return self;
}

- (BOOL)canBecomeFirstResponder {
    return true;
}

- (void)reactSetFrame:(CGRect)frame {
    [_inputAccessoryView setFrame:frame];
    
    self.frame = CGRectMake(
                            0,
                            [[UIScreen mainScreen] bounds].size.height - frame.size.height,
                            frame.size.width,
                            frame.size.height
                            );
    
    if (_shouldBecomeFirstResponder) {
        _shouldBecomeFirstResponder = NO;
        [self becomeFirstResponder];
    }
}

-(CGFloat)getSafeAreaBottom
{
    CGFloat bottomSafeArea = 0;
#if __IPHONE_OS_VERSION_MAX_ALLOWED > __IPHONE_10_3
    if (@available(iOS 11.0, *)) {
        bottomSafeArea = self.superview ? self.superview.safeAreaInsets.bottom : self.safeAreaInsets.bottom;
    }
#endif
    return bottomSafeArea;
}

//MARK:- UIObservingInputView delegate

- (void)onInputAccessoryViewChangeKeyboardHeight:(CGFloat)keyboardHeight {
    CGFloat safeAreaBottom = [self getSafeAreaBottom];
    
    CGFloat accessoryTranslation = MIN(-safeAreaBottom, -keyboardHeight);
    
    self.transform = CGAffineTransformMakeTranslation(0, accessoryTranslation);
}

@end
