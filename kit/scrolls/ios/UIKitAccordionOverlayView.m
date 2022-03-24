//
//  UIKitAccordionOverlayView.m
//  UIKitScrolls
//
//  Created by Aleksei Savelev on 14/12/2021
//

#import "UIKitAccordionOverlayView.h"

#import <AVFoundation/AVFoundation.h>

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTScrollView.h>
#import <React/RCTConvert.h>
#import <React/RCTBaseTextInputView.h>
#import <React/RCTTouchHandler.h>
#import <React/RCTLog.h>

@implementation UIKitAccordionOverlayView {
    UIView *overlayContainerView;
    UIImageView *overlayImageView;
    CGFloat prevContentOffsetY;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    if (self = [super init]) {
        self.currentBridge = bridge;
        
        overlayContainerView = [[UIView alloc] init];
        overlayContainerView.clipsToBounds = YES;
        overlayImageView = [[UIImageView alloc] init];
        
        [overlayContainerView addSubview:overlayImageView];
        
        prevContentOffsetY = 0.0f;
    }
    return self;
}

- (void)show:(NSNumber *)startY endY:(NSNumber *)endY {
    RCTLogInfo(@"show accordion overlay with startY: %@, endY: %@", startY, endY);
    
    /**
     * Prevent scrolling during animation
     * to make the whole thing easier to work with
     * and remove edge cases
     */
    [self disableScrollViewIfAny];
    /**
     * Sometimes during animation contentOffset.y might change
     * and to react on that changes we have to listen for them
     */
    [self listenToScrollChangesIfAny];
    
    UIImage *screenshot = [self takeScreenshot:startY endY:endY];
    
    /**
     * Just in case the command was fired before 'hide' was called
     */
    [overlayContainerView removeFromSuperview];
    
    // Reset any applied earlier transforms
    overlayImageView.transform = CGAffineTransformIdentity;
    [overlayImageView setImage:screenshot];
    overlayImageView.frame = [self getDownscaledRect:CGRectMake(0, 0, screenshot.size.width, screenshot.size.height)];
    CGFloat top = [self getImageTop:startY];
    RCTLogInfo(@"top %f", top);
    overlayContainerView.frame = CGRectMake(0, top, self.frame.size.width, self.frame.size.height);
//    overlayContainerView.transform = CGAffineTransformMakeTranslation(0, top);
    
    [self addSubview:overlayContainerView];
}

- (void)append:(NSNumber *)startY endY:(NSNumber *)endY {
    RCTLogInfo(@"append to accordion overlay with startY: %@, endY: %@", startY, endY);
    
    UIImage *screenshot = [self takeScreenshot:startY endY:endY];
    UIImage *prevScreenshot = overlayImageView.image;
    
    CGSize size = CGSizeMake(screenshot.size.width, prevScreenshot.size.height + screenshot.size.height);
    
    UIGraphicsBeginImageContextWithOptions(size, NO, 0);
    
    [prevScreenshot drawInRect:CGRectMake(0, 0, size.width, prevScreenshot.size.height)];
    [screenshot drawInRect:CGRectMake(0, prevScreenshot.size.height, size.width, size.height - prevScreenshot.size.height)];
    
    UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
    
    UIGraphicsEndImageContext();
    
    [overlayImageView setImage:newImage];
    overlayImageView.frame = [self getDownscaledRect:CGRectMake(0, 0, size.width, size.height)];
}

- (void)moveAndHide:(NSNumber *)shiftY duration:(NSNumber *)duration onFinish:(onFinishCb)onFinish {
    RCTLogInfo(@"move accordion overlay with shiftY: %@, duration: %@", shiftY, duration);
    
    __weak UIImageView *weakOverlayImageView = overlayImageView;
    __weak typeof(self)weakSelf = self;
    [UIView
     animateWithDuration:(duration.floatValue / 1000)
     animations:^{
        UIImageView *strongOverlayImageView = weakOverlayImageView;
        if (!strongOverlayImageView) {
            return;
        }
        RCTLogInfo(@"animating...");
        strongOverlayImageView.transform = CGAffineTransformMakeTranslation(0, shiftY.floatValue);
    }
     completion:^(BOOL finished) {
        UIKitAccordionOverlayView *strongSelf = weakSelf;
        if (!strongSelf) {
            return;
        }
        RCTLogInfo(@"completing...");
        [strongSelf hide:onFinish];
    }];
}

- (void)hide:(onFinishCb)onFinish {
    RCTLogInfo(@"hide accordion overlay");
    [overlayContainerView removeFromSuperview];
    
    [self enableScrollViewIfAny];
    [self unlistenToScrollChangesIfAny];
    onFinish();
}

// MARK:- helpers

- (void)disableScrollViewIfAny {
    UIView *view = self.subviews[0];
    
    if (![view isKindOfClass:[RCTScrollView class]]) {
        return;
    }
    
    ((RCTScrollView *)view).scrollView.scrollEnabled = NO;
}

- (void)enableScrollViewIfAny {
    UIView *view = self.subviews[0];
    
    if (![view isKindOfClass:[RCTScrollView class]]) {
        return;
    }
    
    ((RCTScrollView *)view).scrollView.scrollEnabled = YES;
}

- (void)listenToScrollChangesIfAny {
    UIView *view = self.subviews[0];
    
    if (![view isKindOfClass:[RCTScrollView class]]) {
        return;
    }
    
    UIScrollView *scrollView = ((RCTScrollView *)view).scrollView;
    
    [scrollView addObserver:self forKeyPath:@"contentOffset" options:NSKeyValueObservingOptionNew context:nil];
    
    prevContentOffsetY = scrollView.contentOffset.y;
}


- (void)unlistenToScrollChangesIfAny {
    UIView *view = self.subviews[0];
    
    if (![view isKindOfClass:[RCTScrollView class]]) {
        return;
    }
    
    UIScrollView *scrollView = ((RCTScrollView *)view).scrollView;
    
    [scrollView removeObserver:self forKeyPath:@"contentOffset" context:nil];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context {
    if (![object isKindOfClass:[UIScrollView class]] || ![keyPath isEqualToString:@"contentOffset"]) {
        return;
    }
    
    UIScrollView *scrollView = object;
    CGFloat contentOffsetY = scrollView.contentOffset.y;
    CGFloat contentOffsetYDiff = prevContentOffsetY - contentOffsetY;
    
    if (contentOffsetYDiff == 0) {
        return;
    }
    
    CGRect containerRect = overlayContainerView.frame;
    containerRect.origin.y += contentOffsetYDiff;
    overlayContainerView.frame = containerRect;
    [overlayContainerView setNeedsLayout];
}

- (CGFloat)getImageTop:(NSNumber *)startY {
    if ([startY isEqual:@0]) {
        return 0.0f;
    }
    
    UIView *view = self.subviews[0];
    
    if ([view isKindOfClass:[RCTScrollView class]]) {
        CGFloat scrollOffset = ((RCTScrollView *)view).scrollView.contentOffset.y;
        return startY.floatValue - scrollOffset;
    }
    
    return startY.floatValue;
}

// MARK:- screenshot

- (UIImage *)takeScreenshot:(NSNumber *)startY endY:(NSNumber *)endY {
    UIView *view = self.subviews[0];
    
    if ([view isKindOfClass:[RCTScrollView class]]) {
        return [self takeScreenshot:((RCTScrollView *)view).contentView startY:startY endY:endY];
    }
    
    return [self takeScreenshot:view startY:startY endY:endY];
}

- (UIImage *)takeScreenshot:(UIView *)view startY:(NSNumber *)startY endY:(NSNumber *)endY {
    // if should be not less than a curren wrapper height
    // to fill bottom pixels properly
    // if size of the content less than a visible area
    CGFloat height = MAX(view.frame.size.height, self.frame.size.height);
    CGSize size = CGSizeMake(view.frame.size.width, height);
    
    UIGraphicsBeginImageContextWithOptions(size, NO, 0);
    
    CGContextRef context = UIGraphicsGetCurrentContext();

    // Not sure if we should copy it though,
    // did it just not to mess with original `backgroundColor`
    UIColor *bgColor = [self.backgroundColor copy];
    [bgColor setFill];
    CGContextFillRect(context, CGRectMake(0, 0, size.width, size.height));
    
    BOOL success = [view drawViewHierarchyInRect:CGRectMake(0, 0, view.frame.size.width, view.frame.size.height) afterScreenUpdates:NO];
    
    CGImageRef fullViewImageRef = CGBitmapContextCreateImage(context);
    
    CGFloat cropHeight = endY.floatValue - startY.floatValue;
    CGRect cropRect = [self getUpscaledRect:CGRectMake(0,
                                                       startY.floatValue,
                                                       size.width,
                                                       cropHeight)];
    
    CGImageRef croppedImageRef = CGImageCreateWithImageInRect(fullViewImageRef,
                                                              cropRect);
    
    UIImage *croppedImage = [UIImage imageWithCGImage:croppedImageRef];
    
    CGImageRelease(fullViewImageRef);
    CGImageRelease(croppedImageRef);
    
    UIGraphicsEndImageContext();
    
    if (!success) {
        // TODO: can we do sth here?
    }
    
    return croppedImage;
}

- (CGRect)getUpscaledRect:(CGRect)rect {
    CGRect copyRect = CGRectUnion(rect, CGRectNull);
    CGFloat scaleFactor = [UIScreen mainScreen].scale;
    
    copyRect.origin.x *= scaleFactor;
    copyRect.origin.y *= scaleFactor;
    copyRect.size.width *= scaleFactor;
    copyRect.size.height *= scaleFactor;
    
    return copyRect;
}

- (CGRect)getDownscaledRect:(CGRect)rect {
    CGRect copyRect = CGRectUnion(rect, CGRectNull);
    CGFloat scaleFactor = [UIScreen mainScreen].scale;
    
    copyRect.origin.x /= scaleFactor;
    copyRect.origin.y /= scaleFactor;
    copyRect.size.width /= scaleFactor;
    copyRect.size.height /= scaleFactor;
    
    return copyRect;
}

@end
