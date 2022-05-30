//
//  RCTScrollViewManager+UIKitScrolls.m
//  UIKitScrolls
//
//  Created by Aleksei Savelev on 02.03.2022.
//

#import <objc/runtime.h>

#import "RCTScrollViewManager+UIKitScrolls.h"
#import "UIKitScrollView.h"

/**
 * This is how we replace ScrollView from RN
 * with our own implementation
 * (just swizzle `view` method of a manager)
 */
@implementation RCTScrollViewManager (UIKitScrolls)

+(void)load {
    Class class = [self class];
    SEL originalViewGetter = @selector(view);
    SEL swizzledViewGetter = @selector(uikitscroll_view);

    Method originalMethod = class_getInstanceMethod(class, originalViewGetter);
    Method swizzledMethod = class_getInstanceMethod(class, swizzledViewGetter);

    BOOL didAddMethod = class_addMethod(class, originalViewGetter, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod));
    if (didAddMethod) {
        class_replaceMethod(class, swizzledViewGetter, method_getImplementation(originalMethod), method_getTypeEncoding(originalMethod));
    } else {
        method_exchangeImplementations(originalMethod, swizzledMethod);
    }
}

-(UIView *)uikitscroll_view {
    return [[UIKitScrollView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(automaticallyAdjustKeyboardInsets, BOOL);
RCT_EXPORT_VIEW_PROPERTY(keyboardInsetAdjustmentBehavior, NSString);
RCT_EXPORT_VIEW_PROPERTY(testID, NSString);

@end
