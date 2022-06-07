//
//  HInputValueInjector.m
//  kit.inputs
//
//  Created by Anatolii Sergeev on 01.06.2022.
//

#import "HInputValueInjector.h"
#import <React/RCTUIManager.h>
#import <React/RCTSinglelineTextInputView.h>
#import <React/RCTMultilineTextInputView.h>
#import <React/RCTBaseTextInputShadowView.h>
#import <React/RCTViewManager.h>
#import <React/RCTUIManagerUtils.h>

@implementation HInputValueInjector

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (void)setBridge:(RCTBridge *)bridge
{
    _bridge = bridge;
}

- (void)injectInputValue:(NSString *)value byTag:(int)inputTag forUIManager:(RCTUIManager *)uiManager {
    NSLog(@"\n ------- injectInputValue: value %@ --------", value);
     UIView *view = [uiManager viewForReactTag:@(inputTag)];
    if ([view isKindOfClass:[RCTBaseTextInputView class]]) {
        RCTBaseTextInputView *baseTextInputView = (RCTBaseTextInputView *)view;
        baseTextInputView.backedTextInputView.attributedText = [[NSAttributedString alloc] initWithString:value];
    }
}

@end
