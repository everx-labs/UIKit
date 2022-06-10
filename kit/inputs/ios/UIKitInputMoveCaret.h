//
//  UIKitInputMoveCaret.h
//  kit.inputs
//
//  Created by Anatolii Sergeev on 01.06.2022.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTUIManager.h>

@interface UIKitInputMoveCaret : NSObject<RCTBridgeModule>

- (void)moveCaretToPosition:(int)caretPosition byTag:(int)viewTag forUIManager:(RCTUIManager *)uiManager;

@end
