//
//  UIInputAccessoryView+ScrollView.h
//  UIKitKeyboard
//
//  Created by Aleksei Savelev on 26/03/2021
//

#import <UIKit/UIKit.h>

#import "UIInputAccessoryView.h"

@interface UIInputAccessoryView (ScrollView)

@property (nonatomic, copy) NSString *managedScrollViewNativeID;

- (void)handleFrameChanges;
- (void)handleScrollViewOffsets:(CGFloat)diffBetweenTransformsY;
- (void)manageScrollViewInsets:(CGFloat)accessoryTranslation;
- (void)resetScrollViewInsets;
- (UIEdgeInsets)getSafeAreaInsets;

@end
