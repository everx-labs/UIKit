//
//  UIKitKeyboardModule.cpp
//  uikit.keyboard
//
//  Created by Aleksei Savelev on 20/10/2021
//

#include "UIKitKeyboardModule.h"

namespace tonlabs {
namespace uikit {
using namespace facebook;
using namespace reanimated;

static jsi::Value __hostFunction_UIKitKeyboardModuleSpec_addFrameListener(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t count) {
    return static_cast<UIKitKeyboardModuleSpec *>(&turboModule)->addFrameListener(rt, std::move(args[0]));
}

static jsi::Value __hostFunction_UIKitKeyboardModuleSpec_removeFrameListener(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t count) {
    return static_cast<UIKitKeyboardModuleSpec *>(&turboModule)->removeFrameListener(rt, std::move(args[0]));
}

UIKitKeyboardModuleSpec::UIKitKeyboardModuleSpec(std::shared_ptr<CallInvoker> jsInvoker) : TurboModule("UIKitKeyboardModule", jsInvoker) {
    methodMap_["addFrameListener"] = MethodMetadata{
      1, __hostFunction_UIKitKeyboardModuleSpec_addFrameListener};
    methodMap_["removeFrameListener"] = MethodMetadata{
      1, __hostFunction_UIKitKeyboardModuleSpec_removeFrameListener};
}

jsi::Value UIKitKeyboardModule::addFrameListener(jsi::Runtime &rt, const jsi::Value &uid) {
    jsi::Value bottom = ShareableValue::adapt(rt,
                                              jsi::Value(0),
                                              _nativeReanimatedModule.get(),
                                              ValueType::MutableValueType)->getValue(rt);
    
    std::shared_ptr<MutableValue> bottomMutable = bottom.asObject(runtime).getHostObject<MutableValue>(runtime);

    _keyboardFrameListener.get()->addFrameListener(uid.asNumber(), [=, &bottom](double keyboardTopPosition) {
        // At the point we will be on UI thread
        // therefore we must take runtime on the same thread,
        // and it's the runtime that reanimated uses
        jsi::Runtime &reanimatedUIRuntime = *_nativeReanimatedModule->runtime.get();
        bottomMutable.get()->set(reanimatedUIRuntime,
                                 jsi::PropNameID::forAscii(reanimatedUIRuntime, "value"),
                                 jsi::Value(keyboardTopPosition));
    });
    
    return bottom;
}

jsi::Value UIKitKeyboardModule::removeFrameListener(jsi::Runtime &rt, const jsi::Value &uid) {
    _keyboardFrameListener.get()->removeFrameListener(uid.asNumber());
    return jsi::Value::undefined();
}


} // namespace uikit
} // namespace tonlabs
