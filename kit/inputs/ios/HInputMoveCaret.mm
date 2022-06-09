//
//  HInputMoveCaret.m
//  kit.inputs
//
//  Created by Anatolii Sergeev on 09.06.2022.
//

#import "HInputMoveCaret.h"
#import <React/RCTUIManager.h>
#import <React/RCTSinglelineTextInputView.h>
#import <React/RCTMultilineTextInputView.h>
#import <React/RCTBaseTextInputShadowView.h>
#import <React/RCTViewManager.h>
#import <React/RCTUIManagerUtils.h>

@implementation HInputMoveCaret

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

- (void)moveCaretToPosition:(NSNumber *)caretPosition byTag:(int)inputTag forUIManager:(RCTUIManager *)uiManager {
    NSLog(@"\n ------- moveCaretToPosition: value %@ --------", caretPosition);
//    UIView *view = [uiManager viewForReactTag:@(inputTag)];
//    if ([view isKindOfClass:[RCTBaseTextInputView class]]) {
//        RCTBaseTextInputView *baseTextInputView = (RCTBaseTextInputView *)view;
////        baseTextInputView.backedTextInputView.attributedText = [[NSAttributedString alloc] initWithString:value];
//    }
}

@end
