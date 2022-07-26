//
//  UIKitInputController.h
//  kit.inputs
//
//  Created by Anatolii Sergeev on 20.07.2022.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTBaseTextInputView.h>

@interface UIKitInputController : NSObject<RCTBridgeModule>

@property (nonatomic, weak) RCTBaseTextInputView *baseTextInputView;

- (void)setText:(NSString *)value andCaretPosition:(int) caretPosition;

@end
