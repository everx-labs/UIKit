//
//  UIObservingInputAccessoryView.m
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 05/03/2021
//

#import "UIObservingInputAccessoryView.h"

@implementation UIObservingInputAccessoryView

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.userInteractionEnabled = NO;
        self.translatesAutoresizingMaskIntoConstraints = NO;
    }
    return self;
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
    } else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

@end
