//
//  UIKitShimmerLayer.h
//  UIKitLayout
//
//  Created by Aleksei Savelev on 15/06/2022
//

#import <UIKit/UIKit.h>
#import <QuartzCore/CAMetalLayer.h>
#import <Metal/Metal.h>
#import <MetalKit/MetalKit.h>

typedef struct _ProgressCoords {
    float start;
    float end;
    float shift;
} ProgressCoords;

@interface UIKitShimmerLayer : CAMetalLayer

- (instancetype)initWithDevice:(id<MTLDevice>)device library:(id<MTLLibrary>)lib commandQueue:(id<MTLCommandQueue>)queue
    progressCoords:(ProgressCoords)progressCoords;

//- (void)render;

@property (nonatomic, readonly) id<CAMetalDrawable> currentDrawable;
@property (nonatomic, readonly) MTLRenderPassDescriptor *renderPassDescriptor;

- (void)setReadyForNextDrawable;

- (BOOL)shouldRender: (float)globalProgress;
- (float)getLayerProgressShift:(float)globalProgress;

@end
