//
//  UIKitShimmerRenderer.h
//  UIKitLayout
//
//  Created by Aleksei Savelev on 19.07.2022.
//

#import "MetalKit/MetalKit.h"

#import "UIKitSkeletonView.h"
#import "RCTConvert+ShimmerColor.h"

typedef struct {
    float gradientWidth;
    float skewDegrees;
    int shimmerDuration;
    int skeletonDuration;
    ShimmerColor backgroundColor;
    ShimmerColor accentColor;
} SkeletonConfig;

@interface UIKitShimmerRenderer : NSObject <MTKViewDelegate>

+ (instancetype)sharedRenderer;
+ (SkeletonConfig)defaultConfig;

@property (nonatomic, readonly, retain) id<MTLDevice> device;

- (void)retainShimmer:(UIKitSkeletonView *)view;
- (void)releaseShimmer:(UIKitSkeletonView *)view;

- (void)configure:(SkeletonConfig)config;

@end
