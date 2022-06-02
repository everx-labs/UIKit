//
//  HInputValueInjector.m
//  kit.inputs
//
//  Created by Anatolii Sergeev on 01.06.2022.
//

#import "HInputValueInjector.h"

@implementation HInputValueInjector

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (void)setBridge:(RCTBridge *)bridge
{
    _bridge = bridge;
}

- (void)injectInput:(int)viewTag value:(NSString *)value {
    NSLog(@"injectInputValue: value -------%@--------", value);

    NSLog(@"injectInputValue: viewTag -------%i--------", viewTag);
    
}

@end
