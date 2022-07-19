//
//  UIKitSkeletonView.h
//  UIKitLayout
//
//  Created by Aleksei Savelev on 15/06/2022
//

#import <UIKit/UIKit.h>
#import <Metal/Metal.h>
#import <MetalKit/MetalKit.h>

#import <React/RCTView.h>

#import "UIKitShimmerRenderer.h"

typedef struct _ProgressCoords {
    float start;
    float end;
    float shift;
} ProgressCoords;

@interface UIKitSkeletonView : MTKView

- (instancetype)initWithRenderer:(UIKitShimmerRenderer *)renderer;

@property (nonatomic, assign) BOOL loading;

- (BOOL)shouldRender: (float)globalProgress;
- (float)getProgressShift:(float)globalProgress;
- (void)updateProgressCoords:(ProgressCoords)progressCoords;

@end
