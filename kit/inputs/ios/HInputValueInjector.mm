//
//  HInputValueInjector.m
//  kit.inputs
//
//  Created by Anatolii Sergeev on 01.06.2022.
//

#import "HInputValueInjector.h"
#import <React/RCTUIManager.h>
#import <React/RCTMultilineTextInputView.h>

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
    
    
    UIView *view = [uiManager viewForReactTag:@(inputTag)];
    RCTMultilineTextInputView *textInput = (RCTMultilineTextInputView *)view;
    /* Not working: */
    [textInput textInputShouldChangeText:(NSString *)@"000" inRange:(NSRange){.location = (NSUInteger)0, .length = (NSUInteger)3}];
}

@end
