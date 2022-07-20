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

- (void)setText:(NSString *)value {
    if (_baseTextInputView != NULL) {
        _baseTextInputView.backedTextInputView.attributedText = [[NSAttributedString alloc] initWithString:value];
    }
}

@end
