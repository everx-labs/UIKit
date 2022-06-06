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
    NSLog(@"injectInputValue: value -------%@--------", value);

    NSLog(@"injectInputValue: viewTag -------%i--------", inputTag);
    
    RCTExecuteOnUIManagerQueue(^{
        RCTBaseTextInputShadowView *shadowView = (RCTBaseTextInputShadowView *)[uiManager shadowViewForReactTag:@(inputTag)];
        [shadowView setText:value];
    });

    /* Not working: */
//    UIView *view = [uiManager viewForReactTag:@(inputTag)];
//    if ([view isKindOfClass:[RCTSinglelineTextInputView class]]) {
//        RCTSinglelineTextInputView *singlelineTextInput = (RCTSinglelineTextInputView *)view;
//        [singlelineTextInput
//            textInputShouldChangeText:(NSString *)@"000"
//            inRange:(NSRange){.location = (NSUInteger)0, .length = (NSUInteger)3}
//        ];
//    }
//    else if ([view isKindOfClass:[RCTMultilineTextInputView class]]) {
//        RCTMultilineTextInputView *multilineTextInput = (RCTMultilineTextInputView *)view;
//    }
}

@end
