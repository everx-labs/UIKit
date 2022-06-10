//
//  UIKitInputValueInjector.m
//  kit.inputs
//
//  Created by Anatolii Sergeev on 01.06.2022.
//

#import "UIKitInputValueInjector.h"
#import <React/RCTUIManager.h>
#import <React/RCTBaseTextInputView.h>


@implementation UIKitInputValueInjector

RCT_EXPORT_MODULE()

- (void)injectInputValue:(NSString *)value byTag:(int)inputTag forUIManager:(RCTUIManager *)uiManager {
    UIView *view = [uiManager viewForReactTag:@(inputTag)];
    if ([view isKindOfClass:[RCTBaseTextInputView class]]) {
        RCTBaseTextInputView *baseTextInputView = (RCTBaseTextInputView *)view;
        baseTextInputView.backedTextInputView.attributedText = [[NSAttributedString alloc] initWithString:value];
    }
}

@end
