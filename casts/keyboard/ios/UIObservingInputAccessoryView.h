//
//  UIObservingInputAccessoryView.h
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 05/03/2021
//

#import <UIKit/UIKit.h>

@protocol UIObservingInputAccessoryViewDelegate <NSObject>

- (void)onInputAccessoryViewChangeKeyboardHeight:(CGFloat)keyboardHeight;

@end


@interface UIObservingInputAccessoryView : UIView

@property (nonatomic, weak) id<UIObservingInputAccessoryViewDelegate> delegate;
@property (nonatomic, readonly) CGFloat keyboardHeight;

@end
