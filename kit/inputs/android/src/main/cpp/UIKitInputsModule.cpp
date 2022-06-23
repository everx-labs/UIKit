//
//  UIKitInputsModule.cpp
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#include "UIKitInputsModule.h"

namespace tonlabs {
namespace uikit {
using namespace facebook;
using namespace reanimated;

static jsi::Value __hostFunction_UIKitInputsModuleSpec_injectInputValue(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t count) {
    return static_cast<UIKitInputsModuleSpec *>(&turboModule)->injectInputValue(rt, std::move(args[0]));
}

UIKitInputsModuleSpec::UIKitInputsModuleSpec(std::shared_ptr<CallInvoker> jsInvoker) : TurboModule("UIKitInputsModule", jsInvoker) {
    methodMap_["injectInputValue"] = MethodMetadata{
      1, __hostFunction_UIKitInputsModuleSpec_injectInputValue};
}

jsi::Value UIKitInputsModule::injectInputValue(jsi::Runtime &rt, const jsi::Value &uid, const std::string &value) {
    

    // jsi::Value bottom = ShareableValue::adapt(rt,
    //                                           jsi::Value(0),
    //                                           _nativeReanimatedModule.get(),
    //                                           ValueType::MutableValueType)->getValue(rt);
    
    // std::shared_ptr<MutableValue> bottomMutable = bottom.asObject(runtime).getHostObject<MutableValue>(runtime);

    // _keyboardFrameListener.get()->injectInputValue(uid.asNumber(), [=, &bottom](double keyboardTopPosition) {
    //     // At the point we will be on UI thread
    //     // therefore we must take runtime on the same thread,
    //     // and it's the runtime that reanimated uses
    //     jsi::Runtime &reanimatedUIRuntime = *_nativeReanimatedModule->runtime.get();
    //     bottomMutable.get()->set(reanimatedUIRuntime,
    //                              jsi::PropNameID::forAscii(reanimatedUIRuntime, "value"),
    //                              jsi::Value(keyboardTopPosition));
    // });
    
    // return bottom;
}

} // namespace uikit
} // namespace tonlabs
