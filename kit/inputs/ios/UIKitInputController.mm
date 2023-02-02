//
//  UIKitInputController.h
//  kit.inputs
//
//  Created by Anatolii Sergeev on 01.06.2022.
//

#import "UIKitInputController.h"
#import <React/RCTBaseTextInputView.h>
#import <React/RCTTextAttributes.h>

@implementation UIKitInputController

RCT_EXPORT_MODULE()

- (void)setText:(NSString *)value andCaretPosition:(int)caretPosition {
    if (_baseTextInputView != NULL) {
        /** Setup text */
        NSString *previousValue = _baseTextInputView.backedTextInputView.attributedText.string;
        if (previousValue != value) {
            NSMutableAttributedString *newAttributedText =
                [_baseTextInputView.backedTextInputView.attributedText mutableCopy];
            // Apply text attributes if original input view doesn't have text.
            if (_baseTextInputView.backedTextInputView.attributedText.length == 0) {
                newAttributedText = [
                    [NSMutableAttributedString alloc]
                    initWithString:[_baseTextInputView.textAttributes applyTextAttributesToText:value]
                    attributes:_baseTextInputView.textAttributes.effectiveTextAttributes
                ];
            } else {
                NSRange range = [previousValue rangeOfString:previousValue];
                [newAttributedText replaceCharactersInRange:range withString:value];
            }
            _baseTextInputView.backedTextInputView.attributedText = newAttributedText;
        }
        
        /** Setup caret position */
        UITextPosition *caretTextPosition = [
            _baseTextInputView.backedTextInputView
            positionFromPosition:_baseTextInputView.backedTextInputView.beginningOfDocument
            offset:caretPosition
        ];
        [_baseTextInputView.backedTextInputView
            setSelectedTextRange:[
                _baseTextInputView.backedTextInputView
                textRangeFromPosition:caretTextPosition
                toPosition:caretTextPosition
            ]
            notifyDelegate:YES
        ];
    }
}

@end
