//
//  UIKitSkeletonModule.m
//  UIKitLayout
//
//  Created by Aleksei Savelev on 20.07.2022.
//

#import <Foundation/Foundation.h>

#import "RCTConvert+ShimmerColor.h"

#import "UIKitSkeletonModule.h"
#import "UIKitShimmerRenderer.h"

@implementation UIKitSkeletonModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(configure:(NSDictionary *)configuration) {
    if (configuration == nil) {
        return;
    }
    
    SkeletonConfig defaultConfig = [UIKitShimmerRenderer defaultConfig];
    SkeletonConfig config = {
        [configuration valueForKey:@"gradientWidth"] != nil ?
            [RCTConvert float:[configuration objectForKey:@"gradientWidth"]] :
            defaultConfig.gradientWidth,
        [configuration valueForKey:@"skewDegrees"] != nil ?
            [RCTConvert float:[configuration objectForKey:@"skewDegrees"]] :
            defaultConfig.skewDegrees,
        [configuration valueForKey:@"shimmerDuration"] != nil ?
            [RCTConvert int:[configuration objectForKey:@"shimmerDuration"]] :
            defaultConfig.shimmerDuration,
        [configuration valueForKey:@"skeletonDuration"] != nil ?
             [RCTConvert int:[configuration objectForKey:@"skeletonDuration"]] :
            defaultConfig.skeletonDuration,
        [configuration valueForKey:@"backgroundColor"] != nil ?
            [RCTConvert ShimmerColor:[configuration objectForKey:@"backgroundColor"] ]:
            defaultConfig.backgroundColor,
        [configuration valueForKey:@"accentColor"] != nil ?
            [RCTConvert ShimmerColor:[configuration objectForKey:@"accentColor"]] :
            defaultConfig.accentColor,
    };
    
    [[UIKitShimmerRenderer sharedRenderer] configure:config];
}

@end
