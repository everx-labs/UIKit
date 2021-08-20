//
//  HHapticModule.h
//  uikit.hydrogen
//
//  Created by Aleksei Saveliev on 21.07.2021.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface HHapticModule : NSObject<RCTBridgeModule>

- (void)hapticImpact:(NSString *)inputStyle;
- (void)hapticSelection;
- (void)hapticNotification:(NSString *)inputType;

@end
