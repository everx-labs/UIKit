//
//  UIKitShimmerRenderer.h
//  UIKitLayout
//
//  Created by Aleksei Savelev on 19.07.2022.
//

#import "MetalKit/MetalKit.h"

@interface UIKitShimmerRenderer : NSObject <MTKViewDelegate>

+ (instancetype)sharedRenderer;

@property (nonatomic, readonly, retain) id<MTLDevice> device;

- (void)retainShimmer;
- (void)releaseShimmer;

@end
