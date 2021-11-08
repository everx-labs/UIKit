//
//  UIKitKeyboardIosFrameListener.h
//  uikit.keyboard
//
//  Created by Aleksei Savelev on 12/10/2021
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

typedef void (^KeyboardFrameListener)(CGFloat height);

@interface UIKitKeyboardIosFrameListener : NSObject<RCTBridgeModule>

- (void)addFrameListener:(NSNumber *)uid withListener:(KeyboardFrameListener)withListener;
- (void)removeFrameListener:(NSNumber *)uid;

@end
