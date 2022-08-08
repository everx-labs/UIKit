//
//  RCTConvert+ShimmerColor.h
//  UIKitLayout
//
//  Created by Aleksei Savelev on 20.07.2022.
//

#import <React/RCTConvert.h>

typedef struct {
    float r;
    float g;
    float b;
    float a;
} ShimmerColor;

@interface RCTConvert (_ShimmerColor)

+ (NSNumber *)rgbaToNumber:(int)r g:(int)g b:(int)b a:(int)a;

+ (ShimmerColor)ShimmerColor:(id)json;

@end
