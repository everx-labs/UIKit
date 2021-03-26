//
//  UIInputAccessoryView.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 05/03/2021
//

#import "UIInputAccessoryView.h"
#import "UIInputAccessoryView+ScrollView.h"
#import "UIInputAccessoryView+CustomKeyboard.h"
#import "UIObservingInputAccessoryView.h"
#import "UICustomKeyboardViewController.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTScrollView.h>
#import <React/RCTConvert.h>
#import <React/RCTBaseTextInputView.h>

@interface UIInputAccessoryView() <UIObservingInputAccessoryViewDelegate>

// Overriding `inputAccessoryView` to `readwrite`.
@property (nonatomic, readwrite, retain) UIView *inputAccessoryView;
// Overriding `inputViewController` to `readwrite`.
@property (nonatomic, readwrite, retain) UIViewController *inputViewController;

@end

@implementation UIInputAccessoryView {
    BOOL _shouldBecomeFirstResponder;
    CGFloat _savedTransformY;
}

@synthesize inputAccessoryView;
@synthesize inputViewController;

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    if (self = [super init]) {
        UIObservingInputAccessoryView *inputAccessoryView = [UIObservingInputAccessoryView new];
        
        [self setInputAccessoryView:inputAccessoryView];
        
        inputAccessoryView.delegate = self;
        
        _shouldBecomeFirstResponder = YES;
        self.currentBridge = bridge;
        /**
         * Transform y can't be positive number
         * so 1 will mean that variable is not
         * initialized yet
         */
        _savedTransformY = 1;
    }
    return self;
}

- (BOOL)canBecomeFirstResponder {
    return true;
}

- (void)reactSetFrame:(CGRect)frame {
    [self.inputAccessoryView setFrame:frame];
    
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
    
    self.diffInHeightToApply = self.frame.size.height - frame.size.height;
    
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
    [self onInputAccessoryViewChangeKeyboardHeight:((UIObservingInputAccessoryView *)self.inputAccessoryView).keyboardHeight];
    [self handleFrameChanges];
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
    
    /**
     * Saved transform only could be less or equal to 0
     * If that's not true, the it means the transform hasn't been applied yet
     * so no need to handle content offset
     */
    if (_savedTransformY <= 0) {
        CGFloat diffBetweenTransformsY = accessoryTranslation - _savedTransformY;
        [self handleScrollViewOffsets:diffBetweenTransformsY];
    }
    
    if (!CGAffineTransformEqualToTransform(transform, self.transform)) {
        self.transform = transform;
        /**
         * It was possible to get this information from previous transform
         * instead of saving one, but it had as issue, when during frame change
         * we set transform to identity, we got 0 instead of correct previous value
         */
        _savedTransformY = transform.ty;
    }
    
    [self manageScrollViewInsets:(0 - accessoryTranslation)];
}

@end
