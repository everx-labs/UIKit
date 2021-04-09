//
//  UIObservingInputAccessoryView.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 05/03/2021
//

#import "UIObservingInputAccessoryView.h"

@implementation UIObservingInputAccessoryView {
    UIView *_filler;
    NSLayoutConstraint *_heightContraint;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.userInteractionEnabled = NO;
        /**
         * A filler is needed to set a proper height for the current view
         * as for some reason it's not enough to just set frame
         */
        _filler = [UIView new];
        
        [self addSubview:_filler];
        
        self.autoresizingMask = UIViewAutoresizingFlexibleHeight;
        _filler.translatesAutoresizingMaskIntoConstraints = NO;
        
        _heightContraint = [_filler.heightAnchor constraintEqualToConstant:0];
        _heightContraint.active = YES;
        
        [_filler.leftAnchor constraintEqualToAnchor:self.leftAnchor].active = YES;
        [_filler.rightAnchor constraintEqualToAnchor:self.rightAnchor].active = YES;
        [_filler.topAnchor constraintEqualToAnchor:self.topAnchor].active = YES;
        [_filler.bottomAnchor constraintEqualToAnchor:self.bottomAnchor].active = YES;
        
        _keyboardHeight = 0;
    }
    return self;
}

- (CGSize)intrinsicContentSize {
    // This is needed so the view size is based on autolayout constraints.
    return CGSizeZero;
}

- (void)setFrame:(CGRect)frame {
    [super setFrame:frame];
    [_filler setFrame:CGRectMake(0, 0, frame.size.width, frame.size.height)];
    
    _heightContraint.constant = frame.size.height;
    
    [self layoutIfNeeded];
}

- (void)willMoveToSuperview:(UIView *)newSuperview {
    if (self.superview) {
        [self.superview removeObserver:self forKeyPath:@"center"];
    }
    
    if (newSuperview != nil) {
        [newSuperview addObserver:self forKeyPath:@"center" options:NSKeyValueObservingOptionNew context:nil];
    }
    
    [super willMoveToSuperview:newSuperview];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if (
        (object == self.superview) &&
        ([keyPath isEqualToString:@"center"])
        ) {
        CGFloat centerY = [change[NSKeyValueChangeNewKey] CGPointValue].y;
        
        CGFloat boundsH = self.superview.bounds.size.height;
        CGFloat keyboardH =
            self.window.bounds.size.height -
            (centerY - boundsH / 2) -
            self.frame.size.height;
        
        CGFloat keyboardHeight = MAX(0, keyboardH);
        
        [_delegate onInputAccessoryViewChangeKeyboardHeight:keyboardHeight];
        _keyboardHeight = keyboardHeight;
    } else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

@end
