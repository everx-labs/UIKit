//
//  HDuplicateFastImageView.h
//  uikit.media
//  Used for duplicate FFFastImageView (component `Image` from the package `react-native-fast-image`)
//
//  Created by Aleksei Saveliev on 02.08.2021.
//

#import <React/RCTBridge.h>
#import <RNFastImage/FFFastImageView.h>

@interface HDuplicateFastImageView : FFFastImageView

@property (nonatomic, copy) NSNumber *originalViewRef;
- (instancetype)initWithBridge:(RCTBridge *)bridge;

@end
