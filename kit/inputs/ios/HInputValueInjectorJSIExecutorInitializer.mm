//
//  HInputValueInjectorJSIExecutorInitializer.m
//  kit.inputs
//
//  Created by Sergeev Anatolii on 01.06.2022.
//

#import "HInputValueInjectorJSIExecutorInitializer.h"
#import "HInputValueInjector.h"

#import <RNReanimated/NativeReanimatedModule.h>
#import <RNReanimated/REAModule.h>

namespace tonlabs {
namespace uikit {
using namespace facebook::react;

JSIExecutor::RuntimeInstaller HInputValueInjectorJSIExecutorRuntimeInstaller(
                                                             RCTBridge *bridge,
                                                             JSIExecutor::RuntimeInstaller runtimeInstallerToWrap) {
    const auto runtimeInstaller = [bridge, runtimeInstallerToWrap](facebook::jsi::Runtime &runtime)
    {
        if (!bridge)
        {
            return;
        }
        
        auto jsCallInvoker = bridge.jsCallInvoker;
        
        HInputValueInjector *inputValueInjector = [bridge moduleForName:@"HInputValueInjector"];
        
        jsi::Object reanimatedModuleProxy = runtime.global().getPropertyAsObject(runtime, "__reanimatedModuleProxy");
        std::shared_ptr<reanimated::NativeReanimatedModule> reanimatedModule = std::static_pointer_cast<reanimated::NativeReanimatedModule>(reanimatedModuleProxy.getHostObject(runtime));
        
        jsi::Runtime &reanimatedUIRuntime = *reanimatedModule->runtime.get();
        
        
        auto injectInputValueCallback = [inputValueInjector, &bridge](
                                            jsi::Runtime& rt,
                                            const jsi::Value& thisVal,
                                            const jsi::Value *args,
                                            size_t count
                                            ) -> jsi::Value {
            int viewTag = static_cast<int>(args[0].asNumber());
            const auto value = args[1].asString(rt);

            [inputValueInjector injectInputValue:[NSString stringWithUTF8String:value.utf8(rt).c_str()] byTag:viewTag forUIManager:bridge.uiManager];
            
            return jsi::Value::undefined();
        };
        
        jsi::Value injectInputValue = jsi::Function::createFromHostFunction(
                                                                        reanimatedUIRuntime,
                                                                        jsi::PropNameID::forAscii(reanimatedUIRuntime, "_injectInputValue"),
                                                                        2,
                                                                        injectInputValueCallback);
        
        reanimatedUIRuntime.global().setProperty(reanimatedUIRuntime, "_injectInputValue", injectInputValue);

        if (runtimeInstallerToWrap)
        {
            runtimeInstallerToWrap(runtime);
        }
    };
    return runtimeInstaller;
}

} // namespace uikit
} // namespace tonlabs
