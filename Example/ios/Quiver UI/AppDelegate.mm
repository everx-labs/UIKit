#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
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
#import <UIKitInputs/UIKitInputControllerJSIExecutorInitializer.h>

@interface AppDelegate () <RCTCxxBridgeDelegate>

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"UIKit";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge {
  const auto withUIKitKeyboardInstaller = tonlabs::uikit::UIKitKeyboardJSIExecutorInstaller(bridge, NULL);
  const auto withUIKitInputControllerInstaller = tonlabs::uikit::UIKitInputControllerJSIExecutorRuntimeInstaller(bridge, withUIKitKeyboardInstaller);
  const auto withHHapticInstaller = tonlabs::uikit::HHapticJSIExecutorRuntimeInstaller(bridge, withUIKitInputControllerInstaller);
  const auto withReanimatedInstaller = reanimated::REAJSIExecutorRuntimeInstaller(bridge, withHHapticInstaller);

  #if __has_include(<React/RCTJSIExecutorRuntimeInstaller.h>)
    // installs globals such as console, nativePerformanceNow, etc.
    return std::make_unique<ExecutorFactory>(RCTJSIExecutorRuntimeInstaller(withReanimatedInstaller));
  #else
    return std::make_unique<ExecutorFactory>(withReanimatedInstaller);
  #endif
}

@end
