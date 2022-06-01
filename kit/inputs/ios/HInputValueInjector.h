//
//  HInputValueInjector.h
//  kit.inputs
//
//  Created by Anatolii Sergeev on 01.06.2022.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface HInputValueInjector : NSObject<RCTBridgeModule>

- (void)injectInputValue:(NSString *)value;

@end
