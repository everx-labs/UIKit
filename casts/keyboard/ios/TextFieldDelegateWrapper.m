//
//  TextFieldDelegateWrapper.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 12/04/2021
//

#import "TextFieldDelegateWrapper.h"

@implementation TextFieldDelegateWrapper

- (instancetype)init {
    return self;
}

- (id)forwardingTargetForSelector:(SEL)aSelector {
    if ([self.interceptorDelegate respondsToSelector:aSelector]) {
        return self.interceptorDelegate;
    } else if ([self.originalDelegate respondsToSelector:aSelector]) {
        return self.originalDelegate;
    } else {
        return nil;
    }
}

- (BOOL)respondsToSelector:(SEL)aSelector {
    if ([self.interceptorDelegate respondsToSelector:aSelector]) {
        return YES;
    } else if ([self.originalDelegate respondsToSelector:aSelector]) {
        return YES;
    } else {
        return NO;
    }
}

- (void)forwardInvocation:(NSInvocation *)invocation {
    [invocation invokeWithTarget:self.originalDelegate];
}

- (NSMethodSignature *)methodSignatureForSelector:(SEL)sel {
    return [self.originalDelegate methodSignatureForSelector:sel];
}

@end
