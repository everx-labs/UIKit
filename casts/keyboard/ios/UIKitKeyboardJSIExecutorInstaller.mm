//
//  UIKitKeyboardJSIExecutorInstaller.m
//  uikit.keyboard
//
//  Created by Aleksei Saveliev on 12.10.2021.
//

#import "UIKitKeyboardJSIExecutorInstaller.h"
#import "UIKitKeyboardIosFrameListener.h"
#import "UIKitKeyboardFrameListener.h"
#import "UIKitKeyboardModule.h"

#import <RNReanimated/NativeReanimatedModule.h>

namespace tonlabs {
namespace uikit {
using namespace facebook::react;

JSIExecutor::RuntimeInstaller UIKitKeyboardJSIExecutorInstaller(
                                                                RCTBridge *bridge,
                                                                JSIExecutor::RuntimeInstaller runtimeInstallerToWrap) {
    const auto runtimeInstaller = [bridge, runtimeInstallerToWrap](facebook::jsi::Runtime &runtime)
    {
        if (!bridge)
        {
            return;
        }
        
        
        UIKitKeyboardIosFrameListener *keyboardIosFrameListener = [bridge moduleForName:@"UIKitKeyboardIosFrameListener"];
        
        jsi::Object reanimatedModuleProxy = runtime.global().getPropertyAsObject(runtime, "__reanimatedModuleProxy");
        std::shared_ptr<reanimated::NativeReanimatedModule> reanimatedModule = std::static_pointer_cast<reanimated::NativeReanimatedModule>(reanimatedModuleProxy.getHostObject(runtime));

        auto keyboardFrameListener =
            std::make_unique<tonlabs::uikit::UIKitKeyboardFrameListener>(keyboardIosFrameListener);
        
        auto keyboardModule = std::make_unique<UIKitKeyboardModule>(bridge.jsCallInvoker,
                                                                    runtime,
                                                                    reanimatedModule,
                                                                    std::move(keyboardFrameListener));
        
        runtime.global().setProperty(runtime, "__uikitKeyboard", jsi::Object::createFromHostObject(runtime, std::move(keyboardModule)));
        
        if (runtimeInstallerToWrap)
        {
            runtimeInstallerToWrap(runtime);
        }
    };
    return runtimeInstaller;
}

} // namespace uikit
} // namespace tonlabs
