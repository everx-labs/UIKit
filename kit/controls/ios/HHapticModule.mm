//
//  HHapticModule.m
//  kit.controls
//
//  Created by Aleksei Saveliev on 21.07.2021.
//

#import <AudioToolbox/AudioToolbox.h>
#import <AudioToolbox/AudioServices.h>
#import <Foundation/Foundation.h>
#include <sys/types.h>
#include <sys/sysctl.h>

#import "HHapticModule.h"

@implementation HHapticModule

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

- (void)hapticImpact:(NSString *)inputStyle {
    if ([self supportsHapticFor6SAnd6SPlus]) {
        AudioServicesPlaySystemSound((SystemSoundID) 1520);
        return;
    }
    
    UIImpactFeedbackStyle style;
    if ([inputStyle isEqualToString:@"light"]) {
        style = UIImpactFeedbackStyleLight;
    } else if ([inputStyle isEqualToString:@"medium"]) {
        style = UIImpactFeedbackStyleMedium;
    } else if ([inputStyle isEqualToString:@"heavy"]) {
        style = UIImpactFeedbackStyleHeavy;
    } else {
        throw [NSException exceptionWithName:@"IncorrectInputStyle" reason:@"Haptic impact was called with incorrect input style" userInfo:nil];
    }
    
    UIImpactFeedbackGenerator *feedback = [[UIImpactFeedbackGenerator alloc] initWithStyle:style];
    [feedback prepare];
    [feedback impactOccurred];
    feedback = nil;
}

- (void)hapticSelection {
    if ([self supportsHapticFor6SAnd6SPlus]) {
        AudioServicesPlaySystemSound((SystemSoundID) 1519);
        return;
    }
    
    UISelectionFeedbackGenerator *feedback = [UISelectionFeedbackGenerator new];
    [feedback prepare];
    [feedback selectionChanged];
    feedback = nil;
}

- (void)hapticNotification:(NSString *)inputType {
    if ([self supportsHapticFor6SAnd6SPlus]) {
        AudioServicesPlaySystemSound((SystemSoundID) 1521);
        return;
    }
    
    UINotificationFeedbackType type;
    if ([inputType isEqualToString:@"success"]) {
        type = UINotificationFeedbackTypeSuccess;
    } else if ([inputType isEqualToString:@"warning"]) {
        type = UINotificationFeedbackTypeWarning;
    } else if ([inputType isEqualToString:@"error"]) {
        type = UINotificationFeedbackTypeError;
    } else {
        throw [NSException exceptionWithName:@"IncorrectInputType" reason:@"Haptic notification was called with incorrect input type" userInfo:nil];
    }
    
    UINotificationFeedbackGenerator *feedback = [UINotificationFeedbackGenerator new];
    [feedback prepare];
    [feedback notificationOccurred:type];
    feedback = nil;
}

-(Boolean)supportsHapticFor6SAnd6SPlus {
    return ([[self platform] isEqualToString:@"iPhone8,1"]  // iPhone 6S
            || [[self platform] isEqualToString:@"iPhone8,2"]); // iPhone 6S Plus
}

- (NSString *)platform {
    size_t size;
    sysctlbyname("hw.machine", NULL, &size, NULL, 0);
    char *machine = (char *)malloc(size);
    sysctlbyname("hw.machine", machine, &size, NULL, 0);
    NSString *platform = [NSString stringWithUTF8String:machine];
    free(machine);
    return platform;
}

@end
