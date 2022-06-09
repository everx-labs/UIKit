//
//  HInputMoveCaret.m
//  kit.inputs
//
//  Created by Anatolii Sergeev on 09.06.2022.
//

#import "HInputMoveCaret.h"
#import <React/RCTUIManager.h>
#import <React/RCTBaseTextInputView.h>

@implementation HInputMoveCaret

RCT_EXPORT_MODULE()

- (void)moveCaretToPosition:(int)caretPosition byTag:(int)inputTag forUIManager:(RCTUIManager *)uiManager {
    UIView *view = [uiManager viewForReactTag:@(inputTag)];
    if ([view isKindOfClass:[RCTBaseTextInputView class]]) {
        RCTBaseTextInputView *baseTextInputView = (RCTBaseTextInputView *)view;
        [baseTextInputView setSelectionStart:caretPosition selectionEnd:caretPosition];
    }
}

@end
