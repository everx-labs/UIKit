//
//  UIInputAccessoryView+ScrollView.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 26/03/2021
//

#import "UIInputAccessoryView+ScrollView.h"
#import "UIObservingInputAccessoryView.h"
#import "UICustomKeyboardViewController.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTScrollView.h>
#import <React/RCTConvert.h>
#import <React/RCTBaseTextInputView.h>

#import <objc/runtime.h>

@implementation UIInputAccessoryView (ScrollView)

@dynamic managedScrollViewNativeID;

- (NSString *)managedScrollViewNativeID {
    return objc_getAssociatedObject(self, @selector(managedScrollViewNativeID));
}

- (void)setManagedScrollViewNativeID:(NSString *)managedScrollViewNativeID {
    return objc_setAssociatedObject(
                                    self,
                                    @selector(managedScrollViewNativeID),
                                    managedScrollViewNativeID,
                                    OBJC_ASSOCIATION_COPY_NONATOMIC);
}

//MARK:- Managing scroll view

- (void)handleFrameChanges {
    if (self.managedScrollViewNativeID == nil) {
        return;
    }
    
    RCTScrollView *scrollView = [self getScrollViewWithID:self.managedScrollViewNativeID];
    
    if (scrollView == nil) {
        return;
    }
    
    if (scrollView.scrollView.contentSize.height < scrollView.scrollView.frame.size.height) {
        return;
    }
    
    if (self.diffInHeightToApply != 0) {
        [self handleScrollViewOffsets:self.diffInHeightToApply];
        self.diffInHeightToApply = 0;
    }
}

- (void)handleScrollViewOffsets:(CGFloat)diffBetweenTransformsY {
    if (diffBetweenTransformsY == 0) {
        return;
    }
    
    if (self.managedScrollViewNativeID == nil) {
        return;
    }
    
    RCTScrollView *scrollView = [self getScrollViewWithID:self.managedScrollViewNativeID];
    
    if (scrollView == nil) {
        return;
    }
    
    /**
     * The guard is needed to prevent changing of content offset
     * while user scrolls it, i.e. when `keyboardDismissMode`
     * set to `interactive` and user tries to dismiss keyboard by scrolling
     */
    if (scrollView.scrollView.tracking) {
        return;
    }
    
    CGFloat yToScroll = scrollView.scrollView.contentOffset.y + diffBetweenTransformsY;
    [scrollView.scrollView setContentOffset:CGPointMake(0, yToScroll)];
    
}

- (void)manageScrollViewInsets:(CGFloat)accessoryTranslation {
    if (self.managedScrollViewNativeID == nil) {
        return;
    }
    
    RCTScrollView *scrollView = [self getScrollViewWithID:self.managedScrollViewNativeID];
    
    if (scrollView == nil) {
        return;
    }
    
    CGFloat safeAreaBottom = [self getSafeAreaBottom:scrollView];
    CGFloat safeAreaTop = [self getSafeAreaTop:scrollView];
    
    UIEdgeInsets insets = UIEdgeInsetsZero;
    UIEdgeInsets indicatorInsets = UIEdgeInsetsZero;
    
    /**
     * You could wonder why indicator insets are different from regular one,
     * that's because in RN `contentInsetAdjustmentBehavior` by default set to `never`,
     * that kinda tells ScrollView to not take safe area insets into account,
     * but as it usually happens in iOS, it continue to do it for indicator insets...
     */
    CGFloat insetBottom = accessoryTranslation + self.frame.size.height - [self getMarginFromBottom:scrollView];
    
    if (scrollView.inverted) {
        CGFloat indicatorInsetBottom = insetBottom;
        
        if (@available(iOS 13.0, *)) {
            // nothing
        } else {
            indicatorInsetBottom -= safeAreaTop;
        }
        
        insets = UIEdgeInsetsMake(insetBottom,
                                  scrollView.scrollView.contentInset.left,
                                  safeAreaTop,
                                  scrollView.scrollView.contentInset.right);
        indicatorInsets = UIEdgeInsetsMake(
                                  indicatorInsetBottom,
                                  scrollView.scrollView.contentInset.left,
                                  safeAreaTop,
                                  scrollView.scrollView.contentInset.right);
    } else {
        CGFloat indicatorInsetBottom = insetBottom;
        
        if (@available(iOS 13.0, *)) {
            // nothing
        } else {
            indicatorInsetBottom -= safeAreaBottom;
        }
        
        insets = UIEdgeInsetsMake(safeAreaTop,
                                  scrollView.scrollView.contentInset.left,
                                  insetBottom,
                                  scrollView.scrollView.contentInset.right);
        indicatorInsets = UIEdgeInsetsMake(
                                  safeAreaTop,
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
    if (@available(iOS 13.0, *)) {
        scrollView.scrollView.automaticallyAdjustsScrollIndicatorInsets = NO;
    }
    
    if (!UIEdgeInsetsEqualToEdgeInsets(scrollView.scrollView.contentInset, insets)) {
        [scrollView.scrollView setContentInset:insets];
    }
    
    if (!UIEdgeInsetsEqualToEdgeInsets(scrollView.scrollView.scrollIndicatorInsets, indicatorInsets)) {
        [scrollView.scrollView setScrollIndicatorInsets:indicatorInsets];
    }
}

- (void)resetScrollViewInsets {
    if (self.managedScrollViewNativeID == nil) {
        return;
    }
    
    RCTScrollView *scrollView = [self getScrollViewWithID:self.managedScrollViewNativeID];
    
    if (scrollView == nil) {
        return;
    }
    
    UIEdgeInsets insets = scrollView.contentInset;
    
    if (!UIEdgeInsetsEqualToEdgeInsets(scrollView.scrollView.contentInset, insets)) {
        [scrollView.scrollView setContentInset:insets];
    }
    
    if (!UIEdgeInsetsEqualToEdgeInsets(scrollView.scrollView.scrollIndicatorInsets, insets)) {
        [scrollView.scrollView setScrollIndicatorInsets:insets];
    }
}

- (RCTScrollView *)getScrollViewWithID:(NSString *)scrollViewNativeID {
    UIView *view = [self.currentBridge.uiManager viewForNativeID:scrollViewNativeID withRootTag:self.rootTag];
    
    if ([view isKindOfClass:[RCTScrollView class]]) {
        return (RCTScrollView *)view;
    }
    
    return nil;
}

- (CGFloat)getMarginFromBottom:(RCTScrollView *)scrollView {
    CGFloat positionInSuperview = [scrollView.scrollView.superview convertPoint:scrollView.scrollView.frame.origin toView:nil].y;
    CGFloat globalHeight = [[UIScreen mainScreen] bounds].size.height;
    
    return globalHeight - positionInSuperview;
}

// MARK:- Utils

- (CGFloat)getSafeAreaBottom {
    return [self getSafeAreaBottom:self.superview ? self.superview : self];
}

- (CGFloat)getSafeAreaBottom:(UIView *)view {
    CGFloat bottomSafeArea = 0;
#if __IPHONE_OS_VERSION_MAX_ALLOWED > __IPHONE_10_3
    if (@available(iOS 11.0, *)) {
        bottomSafeArea = view.safeAreaInsets.bottom;
    }
#endif
    return bottomSafeArea;
}

- (CGFloat)getSafeAreaTop {
    return [self getSafeAreaTop:self.superview ? self.superview : self];
}

- (CGFloat)getSafeAreaTop:(UIView *)view {
    CGFloat topSafeArea = 0;
#if __IPHONE_OS_VERSION_MAX_ALLOWED > __IPHONE_10_3
    if (@available(iOS 11.0, *)) {
        topSafeArea = view.safeAreaInsets.top;
    }
#endif
    return topSafeArea;
}

@end
