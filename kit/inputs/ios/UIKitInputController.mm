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

- (instancetype)initWith:(RCTBaseTextInputView *)baseTextInputView {
    self = [super init];
    _baseTextInputView = baseTextInputView;
    return self;
}

- (void)setText:(NSString *)value andCaretPosition:(int)caretPosition {
    if (_baseTextInputView != NULL) {
        /* Set text */
        _baseTextInputView.backedTextInputView.attributedText = [[NSAttributedString alloc] initWithString:value];

        /* Set caretPosition */
        UITextPosition *startPosition = [_baseTextInputView.backedTextInputView positionFromPosition:_baseTextInputView.backedTextInputView.beginningOfDocument offset:caretPosition];
        UITextPosition *endPosition = [_baseTextInputView.backedTextInputView positionFromPosition:_baseTextInputView.backedTextInputView.beginningOfDocument offset:caretPosition];
        UITextRange *textRange = [_baseTextInputView.backedTextInputView textRangeFromPosition:startPosition toPosition:endPosition];
        [_baseTextInputView.backedTextInputView setSelectedTextRange:textRange notifyDelegate:false];
    }
}

@end
