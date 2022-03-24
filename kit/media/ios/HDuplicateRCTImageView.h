//
//  HDuplicateRCTImageView.h
//  uikit.media
//  Used for duplicate RCTImageView (default `Image` from ReactNative)
//
//  Created by Aleksei Saveliev on 02.08.2021.
//

#import <React/RCTImageView.h>

@interface HDuplicateRCTImageView : RCTImageView

@property (nonatomic, copy) NSNumber *originalViewRef;

@end
