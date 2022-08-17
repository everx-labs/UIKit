//
//  RCTConvert+ShimmerColor.m
//  UIKitLayout
//
//  Created by Aleksei Savelev on 20.07.2022.
//

#import "RCTConvert+ShimmerColor.h"

@implementation RCTConvert (_ShimmerColor)

+ (NSNumber *)rgbaToNumber:(int)r g:(int)g b:(int)b a:(int)a {
     unsigned int hex = (unsigned int)((a << 24) | (r << 16) | (g << 8) | b >> 0);
     return [NSNumber numberWithInt:hex];
 }

+ (ShimmerColor)ShimmerColor:(id)json {
    UIColor *color = [RCTConvert UIColor:json];
    
    if (color == nil) {
        assert(0);
    }
    
    CGFloat red = 0;
    CGFloat green = 0;
    CGFloat blue = 0;
    CGFloat alpha = 0;
    
    [color getRed:&red green:&green blue:&blue alpha:&alpha];
    
    ShimmerColor c = { red, green, blue, alpha };
    return c;
}

@end
