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
    
    /**
     * https://developer.apple.com/documentation/uikit/uiview/1622621-frame
     * It contains following warning:
     *  If the transform property is not the identity transform,
     *  the value of this property is undefined and therefore should be ignored.
     *
     * Because of that before changing a frame we set it to identity
     * as it still gonna be applied to correct one on `layoutSubview`
     */
    self.transform = CGAffineTransformIdentity;
    
    CGFloat parentHeight = self.superview.frame.size.height;
    
    if (parentHeight <= 0) {
        parentHeight = [[UIScreen mainScreen] bounds].size.height;
    }
    
    self.frame = CGRectMake(0,
                            parentHeight - frame.size.height,
                            frame.size.width,
                            frame.size.height);
    
    if (_shouldBecomeFirstResponder) {
        _shouldBecomeFirstResponder = NO;
        [self becomeFirstResponder];
    }
}

/**
 * The method handle two cases:
 *  1. The one described above, to apply transform after frame was changed
 *  2. To manage insets of scroll view (if it's needed) on mount
 */
- (void)layoutSubviews {
    [self onInputAccessoryViewChangeKeyboardHeight:((UIObservingInputAccessoryView *)_inputAccessoryView).keyboardHeight];
}

- (void)willMoveToSuperview:(UIView *)newSuperview {
    // Current view was unmounted
    if (newSuperview == nil) {
        [self resetScrollViewInsets];
    }
}

//MARK:- UIObservingInputView delegate

- (void)onInputAccessoryViewChangeKeyboardHeight:(CGFloat)keyboardHeight {
    CGFloat safeAreaBottom = [self getSafeAreaBottom];
    CGFloat accessoryTranslation = MIN(-safeAreaBottom, -keyboardHeight);
    
    CGAffineTransform transform = CGAffineTransformMakeTranslation(0, accessoryTranslation);
    
    CGFloat oldTransformY = self.transform.ty;
    CGFloat diffBetweenTransformsY = accessoryTranslation - oldTransformY;
    
    if (!CGAffineTransformEqualToTransform(transform, self.transform)) {
        self.transform = transform;
    }
    
    [self handleScrollViewOffsets:diffBetweenTransformsY];
    [self manageScrollViewInsets:(0 - accessoryTranslation)];
}

//MARK:- Managing scroll view

- (void)handleScrollViewOffsets:(CGFloat)diffBetweenTransformsY {
    RCTScrollView *scrollView = [self getScrollViewWithID:self.managedScrollViewNativeID];
    
    if (scrollView == nil) {
        return;
    }
    
    if (!scrollView.scrollView.tracking) {
        [scrollView.scrollView setContentOffset:CGPointMake(0, scrollView.scrollView.contentOffset.y + diffBetweenTransformsY)];
    }
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
    CGFloat insetBottom = accessoryTranslation + self.frame.size.height;
    
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
    
    CGFloat safeAreaBottom = [self getSafeAreaBottom:scrollView];
    CGFloat safeAreaTop = [self getSafeAreaTop:scrollView];
    
    UIEdgeInsets insets = UIEdgeInsetsZero;
    
    if (scrollView.inverted) {
        insets = UIEdgeInsetsMake(safeAreaBottom,
                                  scrollView.scrollView.contentInset.left,
                                  safeAreaTop,
                                  scrollView.scrollView.contentInset.right);
    } else {
        insets = UIEdgeInsetsMake(safeAreaTop,
                                  scrollView.scrollView.contentInset.left,
                                  safeAreaBottom,
                                  scrollView.scrollView.contentInset.right);
    }
    
    if (!UIEdgeInsetsEqualToEdgeInsets(scrollView.scrollView.contentInset, insets)) {
        [scrollView.scrollView setContentInset:insets];
    }
    
    if (!UIEdgeInsetsEqualToEdgeInsets(scrollView.scrollView.scrollIndicatorInsets, insets)) {
        [scrollView.scrollView setScrollIndicatorInsets:insets];
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
