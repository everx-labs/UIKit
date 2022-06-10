#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTCxxBridgeDelegate.h>

#if __has_include(<reacthermes/HermesExecutorFactory.h>)
#import <reacthermes/HermesExecutorFactory.h>
typedef facebook::react::HermesExecutorFactory ExecutorFactory;
#elif __has_include(<React/HermesExecutorFactory.h>)
#import <React/HermesExecutorFactory.h>
typedef facebook::react::HermesExecutorFactory ExecutorFactory;
#else
#import <React/JSCExecutorFactory.h>
typedef facebook::react::JSCExecutorFactory ExecutorFactory;
#endif

#if __has_include(<React/RCTJSIExecutorRuntimeInstaller.h>)
#import <React/RCTJSIExecutorRuntimeInstaller.h>
#endif

#import <RNReanimated/REAInitializer.h>

#import <UIKitControls/HHapticJSIExecutorInitializer.h>
#import <UIKitKeyboard/UIKitKeyboardJSIExecutorInstaller.h>
#import <UIKitInputs/UIKitInputValueInjectorJSIExecutorInitializer.h>

#if DEBUG
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@interface AppDelegate () <RCTCxxBridgeDelegate>

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#if DEBUG
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"UIKit"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge {
  const auto withUIKitKeyboardInstaller = tonlabs::uikit::UIKitKeyboardJSIExecutorInstaller(bridge, NULL);
  const auto withUIKitInputValueInjectorInstaller = tonlabs::uikit::UIKitInputValueInjectorJSIExecutorRuntimeInstaller(bridge, withUIKitKeyboardInstaller);
  const auto withHHapticInstaller = tonlabs::uikit::HHapticJSIExecutorRuntimeInstaller(bridge, withUIKitInputValueInjectorInstaller);
  const auto withReanimatedInstaller = reanimated::REAJSIExecutorRuntimeInstaller(bridge, withHHapticInstaller);

  #if __has_include(<React/RCTJSIExecutorRuntimeInstaller.h>)
    // installs globals such as console, nativePerformanceNow, etc.
    return std::make_unique<ExecutorFactory>(RCTJSIExecutorRuntimeInstaller(withReanimatedInstaller));
  #else
    return std::make_unique<ExecutorFactory>(withReanimatedInstaller);
  #endif
}

@end
