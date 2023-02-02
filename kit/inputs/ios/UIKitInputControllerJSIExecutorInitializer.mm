//
//  UIKitInputControllerJSIExecutorInitializer.m
//  kit.inputs
//
//  Created by Sergeev Anatolii on 01.06.2022.
//

#import "UIKitInputControllerJSIExecutorInitializer.h"
#import "UIKitInputController.h"

#import <React/RCTBaseTextInputView.h>

#import <RNReanimated/NativeReanimatedModule.h>
#import <RNReanimated/REAModule.h>

namespace tonlabs {
namespace uikit {
using namespace facebook::react;

JSIExecutor::RuntimeInstaller
UIKitInputControllerJSIExecutorRuntimeInstaller(RCTBridge *bridge,
                                                   JSIExecutor::RuntimeInstaller runtimeInstallerToWrap) {
    const auto runtimeInstaller = [bridge, runtimeInstallerToWrap](facebook::jsi::Runtime &runtime) {
        if (!bridge) {
            return;
        }
        
        auto jsCallInvoker = bridge.jsCallInvoker;
        jsi::Object reanimatedModuleProxy = runtime.global().getPropertyAsObject(runtime, "__reanimatedModuleProxy");
        
        std::shared_ptr<reanimated::NativeReanimatedModule> reanimatedModule = std::static_pointer_cast<reanimated::NativeReanimatedModule>(reanimatedModuleProxy.getHostObject(runtime));
        
        jsi::Runtime &reanimatedUIRuntime = *reanimatedModule->runtime.get();
        
        auto bindCallback = [bridge](jsi::Runtime &rt,
                                                      const jsi::Value &thisVal,
                                                      const jsi::Value *args,
                                                      size_t count) -> jsi::Object {
            int viewTag = static_cast<int>(args[0].asNumber());
            UIView *view = [bridge.uiManager viewForReactTag:@(viewTag)];
            
            UIKitInputController *inputController = [[UIKitInputController alloc] init];
            
            if ([view isKindOfClass:[RCTBaseTextInputView class]]) {
                RCTBaseTextInputView *baseTextInputView = (RCTBaseTextInputView *)view;
                inputController.baseTextInputView = baseTextInputView;
            }
            
            auto setTextAndCaretPositionCallback = [inputController, &bridge, viewTag](jsi::Runtime &rt,
                                                                       const jsi::Value &thisVal,
                                                                       const jsi::Value *args,
                                                                       size_t count) -> jsi::Value {
                const auto text = args[0].asString(rt);
                int caretPosition = args[1].asNumber();
                const auto stingifiedValue =
                [NSString stringWithUTF8String:text.utf8(rt).c_str()];
                
                [inputController setText:stingifiedValue andCaretPosition:caretPosition];
                
                return jsi::Value::undefined();
            };
            
            jsi::PropNameID propNameOfSetTextMethod = jsi::PropNameID::forAscii(rt, "setTextAndCaretPosition");
            jsi::Value setText = jsi::Function::createFromHostFunction(rt, propNameOfSetTextMethod, 2, setTextAndCaretPositionCallback);
            
            jsi::Object inputManager = jsi::Object(rt);
            inputManager.setProperty(rt, propNameOfSetTextMethod, setText);
            
            return inputManager;
        };
        
        jsi::Value bind = jsi::Function::createFromHostFunction(reanimatedUIRuntime,
                                                                jsi::PropNameID::forAscii(reanimatedUIRuntime, "bind"),
                                                                1,
                                                                bindCallback);
        
        jsi::Object uiKitInputController = jsi::Object(reanimatedUIRuntime);
        uiKitInputController.setProperty(reanimatedUIRuntime, "bind", bind);
        
        
        reanimatedUIRuntime.global().setProperty(reanimatedUIRuntime, "_uiKitInputBinder", uiKitInputController);
        
        if (runtimeInstallerToWrap) {
            runtimeInstallerToWrap(runtime);
        }
    };
    return runtimeInstaller;
}

} // namespace uikit
} // namespace tonlabs
