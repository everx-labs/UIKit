//
//  UIKitLocalization.m
//  uikit.localization
//
//  Created by Aleksei Saveliev on 28.09.2021.
//

#import <Foundation/Foundation.h>

#import "UIKitLocalization.h"

@implementation UIKitLocalization

RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport {
    NSLocale* locale = [NSLocale currentLocale];
    NSString* grouping = nil;
    if (@available(ios 10, *)) {
        grouping = [locale groupingSeparator];
    }
    if (grouping == nil) {
        grouping = @"";
    }
    NSString* decimal = nil;
    if (@available(ios 10, *)) {
        decimal = [locale decimalSeparator];
    }
    if (decimal == nil) {
        decimal = @".";
    }
    
    NSDictionary* dateInfo = [self getDatePatternFromDate];
    
    NSDictionary* localeInfo =
    @{
        @"numbers": @{
                @"grouping": grouping,
                @"thousands": grouping,
                @"decimal": decimal,
                @"decimalGrouping": @"\u2009",
                @"decimalAlternative": @[
                    @"\u044E",
                    @"\u0431",
                    @"/",
                    @"?",
                    @"<",
                    @">",
                    @",",
                    @".",
                ],
        },
        @"dates": @{
                @"separator": [NSString stringWithFormat:@"%@", dateInfo[@"separator"]],
                @"localePattern": [NSString stringWithFormat:@"%@", dateInfo[@"localePattern"]],
                @"components": dateInfo[@"components"],
                @"dayOfWeek": [NSNumber numberWithUnsignedInteger: [NSCalendar currentCalendar].firstWeekday],
        },
    };
    return localeInfo;
}

// TODO: Research how to make this simple (probably won't be needed with RN 0.59+)
// To obtain the locale date format we only need NSDateFormatter and get
// the dateFormat property, this returns a string with the pattern used to parse
// dates: i.e. y/MM/dd... For our purpose, to create an UIDateInput component,
// handle formats like this one, in order to display the pattern while typing the
// date, is a little bit tricky: i.e. 198Y.MM.DD --> 1986.MM.DD --> 1986.0M.DD --> ......
- (NSDictionary*)getDatePatternFromDate {
    NSMutableDictionary* dateInfo = [NSMutableDictionary new];
    
    dateInfo[@"separator"] = @".";
    dateInfo[@"localePattern"] = @"YYYY.MM.DD";
    dateInfo[@"components"] = [NSArray arrayWithObjects:@"year", @"month", @"day", nil];
    
    NSDateFormatter* dateFormater = [NSDateFormatter new];
    [dateFormater setDateStyle:NSDateFormatterShortStyle];
    NSString* localePattern = [dateFormater dateFormat];
    NSString* separator = [[localePattern componentsSeparatedByCharactersInSet:[NSCharacterSet letterCharacterSet]] componentsJoinedByString:@""];
    
    if (localePattern != nil) {
        dateInfo[@"localePattern"] = [NSString stringWithString:localePattern];
    }
    
    if ([separator length] > 0) {
        separator = [NSString stringWithFormat:@"%c", [separator characterAtIndex:0]];
        dateInfo[@"separator"] = [NSString stringWithString:separator];
    }
    
    NSArray* splitPattern = [[dateInfo[@"localePattern"] uppercaseString] componentsSeparatedByString:separator];
    NSMutableArray* components = [NSMutableArray new];
    for(int i = 0; i < [splitPattern count]; i += 1) {
        NSString* part = (NSString*)[splitPattern objectAtIndex:i];
        NSString* comp = @"year";;
        
        if ([part containsString:@"D"]) comp = @"day";
        else if ([part containsString:@"M"]) comp = @"month";
        
        [components addObject:comp];
    }
    dateInfo[@"components"] = components;
    
    return dateInfo;
}


@end
