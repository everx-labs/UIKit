//
//  QUIHaptic.m
//  Quiver UI
//
//  Created by Алексей Савельев on 21.07.2021.
//

#import <Foundation/Foundation.h>

#import "QUIHapticModule.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#import <ReactCommon/RCTTurboModuleManager.h>

#import <RNReanimated/NativeReanimatedModule.h>

@implementation QUIHapticModule

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (void)setBridge:(RCTBridge *)bridge
{
  _bridge = bridge;
  
  // TODO(savelichalex): a little temporary hack to give time for runtime to initialize
  [NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(initialize) userInfo:nil repeats:NO];
}

- (void)initialize {
  RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
  
  if (!cxxBridge.runtime) {
    return;
  }
  
  jsi::Runtime *runtime = reinterpret_cast<facebook::jsi::Runtime *>(cxxBridge.runtime);
  
  jsi::Object reanimatedModuleProxy = runtime->global().getPropertyAsObject(*runtime, "__reanimatedModuleProxy");
  std::shared_ptr<reanimated::NativeReanimatedModule> reanimatedModule = std::static_pointer_cast<reanimated::NativeReanimatedModule>(reanimatedModuleProxy.getHostObject(*runtime));
  
  jsi::Runtime &reanimatedUIRuntime = *reanimatedModule->runtime.get();
  
  QUIHapticModule *_this = self;
  
  auto hapticImpactCallback = [_this](
                              jsi::Runtime& rt,
                              const jsi::Value& thisVal,
                              const jsi::Value *args,
                              size_t count
                              ) -> jsi::Value {
    const auto inputStyle = args[0].asString(rt);
    
    [_this hapticImpact:[NSString stringWithUTF8String:inputStyle.utf8(rt).c_str()]];
    
    return jsi::Value::undefined();
  };
  
  jsi::Value hapticImpact = jsi::Function::createFromHostFunction(
                                                                  reanimatedUIRuntime,
                                                                  jsi::PropNameID::forAscii(reanimatedUIRuntime, "_hapticImpact"),
                                                                  1,
                                                                  hapticImpactCallback);
  
  reanimatedUIRuntime.global().setProperty(reanimatedUIRuntime, "_hapticImpact", hapticImpact);
}

- (void)hapticImpact:(NSString *)inputStyle {
  UIAlertController *alertController = [UIAlertController alertControllerWithTitle:inputStyle message:@"" preferredStyle:UIAlertControllerStyleAlert];
  
  [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:alertController animated:YES completion:nil];
}

@end
