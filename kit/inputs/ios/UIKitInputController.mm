//
//  UIKitInputController.h
//  kit.inputs
//
//  Created by Anatolii Sergeev on 01.06.2022.
//

#import "UIKitInputController.h"
#import <React/RCTBaseTextInputView.h>

@implementation UIKitInputController

RCT_EXPORT_MODULE()

- (void)setText:(NSString *)value andCaretPosition:(int)caretPosition {
    if (_baseTextInputView != NULL) {
        NSRange wholeTextRange = {0, [_baseTextInputView.attributedText length]};
        NSString *newText = [_baseTextInputView textInputShouldChangeText:value inRange:wholeTextRange];

        if (newText == nil) {
          return;
        }

        NSMutableAttributedString *attributedString = [_baseTextInputView.attributedText mutableCopy];
        [attributedString replaceCharactersInRange:wholeTextRange withString:newText];
        [_baseTextInputView.backedTextInputView setAttributedText:[attributedString copy]];

        UITextPosition *textPosition = [_baseTextInputView.backedTextInputView positionFromPosition:_baseTextInputView.backedTextInputView.beginningOfDocument offset:caretPosition];

        [_baseTextInputView.backedTextInputView setSelectedTextRange:[_baseTextInputView.backedTextInputView textRangeFromPosition:textPosition toPosition:textPosition] notifyDelegate:YES];

        [_baseTextInputView textInputDidChange];
    }
}

@end
