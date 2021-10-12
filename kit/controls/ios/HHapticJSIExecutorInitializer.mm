//
//  HHapticJSIExecutorInitializer.m
//  kit.controls
//
//  Created by Aleksei Saveliev on 20.08.2021.
//

#import "HHapticJSIExecutorInitializer.h"
#import "HHapticModule.h"

#import <RNReanimated/NativeReanimatedModule.h>

namespace tonlabs {
namespace uikit {
using namespace facebook::react;

JSIExecutor::RuntimeInstaller HHapticJSIExecutorRuntimeInstaller(
                                                             RCTBridge *bridge,
                                                             JSIExecutor::RuntimeInstaller runtimeInstallerToWrap) {
    const auto runtimeInstaller = [bridge, runtimeInstallerToWrap](facebook::jsi::Runtime &runtime)
    {
        if (!bridge)
        {
            return;
        }
        
        auto jsCallInvoker = bridge.jsCallInvoker;
        
        HHapticModule *hapticModule = [bridge moduleForName:@"HHapticModule"];
        
        jsi::Object reanimatedModuleProxy = runtime.global().getPropertyAsObject(runtime, "__reanimatedModuleProxy");
        std::shared_ptr<reanimated::NativeReanimatedModule> reanimatedModule = std::static_pointer_cast<reanimated::NativeReanimatedModule>(reanimatedModuleProxy.getHostObject(runtime));
        
        jsi::Runtime &reanimatedUIRuntime = *reanimatedModule->runtime.get();
        
        
        auto hapticImpactCallback = [hapticModule](
                                            jsi::Runtime& rt,
                                            const jsi::Value& thisVal,
                                            const jsi::Value *args,
                                            size_t count
                                            ) -> jsi::Value {
            const auto inputStyle = args[0].asString(rt);
            
            [hapticModule hapticImpact:[NSString stringWithUTF8String:inputStyle.utf8(rt).c_str()]];
            
            return jsi::Value::undefined();
        };
        
        jsi::Value hapticImpact = jsi::Function::createFromHostFunction(
                                                                        reanimatedUIRuntime,
                                                                        jsi::PropNameID::forAscii(reanimatedUIRuntime, "_hapticImpact"),
                                                                        1,
                                                                        hapticImpactCallback);
        
        reanimatedUIRuntime.global().setProperty(reanimatedUIRuntime, "_hapticImpact", hapticImpact);
        
        auto hapticSelectionCallback = [hapticModule](
                                               jsi::Runtime& rt,
                                               const jsi::Value& thisVal,
                                               const jsi::Value *args,
                                               size_t count
                                               ) -> jsi::Value {
            [hapticModule hapticSelection];
            
            return jsi::Value::undefined();
        };
        
        jsi::Value hapticSelection = jsi::Function::createFromHostFunction(
                                                                           reanimatedUIRuntime,
                                                                           jsi::PropNameID::forAscii(reanimatedUIRuntime, "_hapticSelection"),
                                                                           0,
                                                                           hapticSelectionCallback);
        
        reanimatedUIRuntime.global().setProperty(reanimatedUIRuntime, "_hapticSelection", hapticSelection);
        
        auto hapticNotificationCallback = [hapticModule](
                                                  jsi::Runtime& rt,
                                                  const jsi::Value& thisVal,
                                                  const jsi::Value *args,
                                                  size_t count
                                                  ) -> jsi::Value {
            const auto inputType = args[0].asString(rt);
            
            [hapticModule hapticNotification:[NSString stringWithUTF8String:inputType.utf8(rt).c_str()]];
            
            return jsi::Value::undefined();
        };
        
        jsi::Value hapticNotification = jsi::Function::createFromHostFunction(
                                                                              reanimatedUIRuntime,
                                                                              jsi::PropNameID::forAscii(reanimatedUIRuntime, "_hapticNotification"),
                                                                              1,
                                                                              hapticNotificationCallback);
        
        reanimatedUIRuntime.global().setProperty(reanimatedUIRuntime, "_hapticNotification", hapticNotification);
        
        if (runtimeInstallerToWrap)
        {
            runtimeInstallerToWrap(runtime);
        }
    };
    return runtimeInstaller;
}

} // namespace uikit
} // namespace tonlabs
