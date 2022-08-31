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
        /** Setup text */
        UITextRange *textRange = [
            _baseTextInputView.backedTextInputView
            textRangeFromPosition:_baseTextInputView.backedTextInputView.beginningOfDocument
            toPosition:_baseTextInputView.backedTextInputView.endOfDocument
        ];
        [_baseTextInputView.backedTextInputView replaceRange:textRange withText:value];

        /** Setup caret position */
        UITextPosition *caretTextPosition = [
            _baseTextInputView.backedTextInputView
            positionFromPosition:_baseTextInputView.backedTextInputView.beginningOfDocument
            offset:caretPosition];

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
