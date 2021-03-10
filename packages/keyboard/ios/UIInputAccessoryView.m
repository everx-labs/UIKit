//
//  UIInputAccessoryView.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 05/03/2021
//

#import "UIInputAccessoryView.h"
#import "UIObservingInputAccessoryView.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTScrollView.h>

@interface UIInputAccessoryView() <UIObservingInputAccessoryViewDelegate>

// Overriding `inputAccessoryView` to `readwrite`.
@property (nonatomic, readwrite, retain) UIView *inputAccessoryView;

@end

@implementation UIInputAccessoryView {
    BOOL _shouldBecomeFirstResponder;
    RCTBridge *_bridge;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    if (self = [super init]) {
        UIObservingInputAccessoryView *inputAccessoryView = [UIObservingInputAccessoryView new];
        
        _inputAccessoryView = inputAccessoryView;
        
        inputAccessoryView.delegate = self;
        
        _shouldBecomeFirstResponder = YES;
        
        _bridge = bridge;
    }
    return self;
}

- (BOOL)canBecomeFirstResponder {
    return true;
}

- (void)reactSetFrame:(CGRect)frame {
    [_inputAccessoryView setFrame:frame];
    
    self.frame = CGRectMake(
                            0,
                            [[UIScreen mainScreen] bounds].size.height - frame.size.height,
                            frame.size.width,
                            frame.size.height
                            );
    
    if (_shouldBecomeFirstResponder) {
        _shouldBecomeFirstResponder = NO;
        [self becomeFirstResponder];
    }
    
    if (self.managedScrollViewNativeID != nil) {
        [self manageScrollViewInsets:0];
    }
}

//MARK:- UIObservingInputView delegate

- (void)onInputAccessoryViewChangeKeyboardHeight:(CGFloat)keyboardHeight {
    CGFloat safeAreaBottom = [self getSafeAreaBottom];
    
    CGFloat accessoryTranslation = MIN(-safeAreaBottom, -keyboardHeight);
    
    self.transform = CGAffineTransformMakeTranslation(0, accessoryTranslation);
    
    if (self.managedScrollViewNativeID != nil) {
        [self manageScrollViewInsets:(0 - accessoryTranslation)];
    }
}

//MARK:- Managing insets for scroll view

- (void)manageScrollViewInsets:(CGFloat)accessoryTranslation {
    RCTScrollView *scrollView = [self getScrollViewWithID:self.managedScrollViewNativeID];
    
    if (scrollView == nil) {
        return;
    }
    
    CGFloat safeAreaBottom = [self getSafeAreaBottom];
    CGFloat safeAreaTop = [self getSafeAreaTop];
    
    UIEdgeInsets insets = UIEdgeInsetsZero;
    UIEdgeInsets indicatorInsets = UIEdgeInsetsZero;
    
    /**
     * You could wonder why indicator insets are different from regular one,
     * that's because in RN `contentInsetAdjustmentBehavior` by default set to `never`,
     * that kinda tells ScrollView to not take safe area insets into account,
     * but as it usually happens in iOS, it continue to do it for indicator insets...
     */
    CGFloat insetBottom = accessoryTranslation + self.frame.size.height;
    
    if (scrollView.inverted) {
        CGFloat indicatorInsetBottom = accessoryTranslation + self.frame.size.height - safeAreaTop;
        
        insets = UIEdgeInsetsMake(
                                  insetBottom,
                                  scrollView.scrollView.contentInset.left,
                                  0,
                                  scrollView.scrollView.contentInset.right);
        indicatorInsets = UIEdgeInsetsMake(
                                  indicatorInsetBottom,
                                  scrollView.scrollView.contentInset.left,
                                  0,
                                  scrollView.scrollView.contentInset.right);
    } else {
        CGFloat indicatorInsetBottom = accessoryTranslation + self.frame.size.height - safeAreaBottom;
        
        insets = UIEdgeInsetsMake(
                                  0,
                                  scrollView.scrollView.contentInset.left,
                                  insetBottom,
                                  scrollView.scrollView.contentInset.right);
        indicatorInsets = UIEdgeInsetsMake(
                                  0,
                                  scrollView.scrollView.contentInset.left,
                                  indicatorInsetBottom,
                                  scrollView.scrollView.contentInset.right);
    }
    
    /**
     * It's `never` by default in RN,
     * https://github.com/facebook/react-native/blob/6e6443afd04a847ef23fb6254a84e48c70b45896/React/Views/ScrollView/RCTScrollView.m#L297
     * but just to be sure we do it again, as it can brake things otherwise
     */
    if (@available(iOS 11.0, *)) {
        scrollView.automaticallyAdjustContentInsets = NO;
        scrollView.scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    }
    
    if (!UIEdgeInsetsEqualToEdgeInsets(scrollView.scrollView.contentInset, insets)) {
        [scrollView.scrollView setContentInset:insets];
    }
    
    if (!UIEdgeInsetsEqualToEdgeInsets(scrollView.scrollView.scrollIndicatorInsets, indicatorInsets)) {
        [scrollView.scrollView setScrollIndicatorInsets:indicatorInsets];
    }
}

- (RCTScrollView *)getScrollViewWithID:(NSString *)scrollViewNativeID {
    UIView *view = [_bridge.uiManager viewForNativeID:scrollViewNativeID withRootTag:self.rootTag];
    
    if ([view isKindOfClass:[RCTScrollView class]]) {
        return (RCTScrollView *)view;
    }
    
    return nil;
}

// MARK:- Utils

-(CGFloat)getSafeAreaBottom
{
    CGFloat bottomSafeArea = 0;
#if __IPHONE_OS_VERSION_MAX_ALLOWED > __IPHONE_10_3
    if (@available(iOS 11.0, *)) {
        bottomSafeArea = self.superview ? self.superview.safeAreaInsets.bottom : self.safeAreaInsets.bottom;
    }
#endif
    return bottomSafeArea;
}

-(CGFloat)getSafeAreaTop
{
    CGFloat topSafeArea = 0;
#if __IPHONE_OS_VERSION_MAX_ALLOWED > __IPHONE_10_3
    if (@available(iOS 11.0, *)) {
        topSafeArea = self.superview ? self.superview.safeAreaInsets.top : self.safeAreaInsets.top;
    }
#endif
    return topSafeArea;
}

@end
