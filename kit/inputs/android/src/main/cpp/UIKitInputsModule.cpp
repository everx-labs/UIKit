//
//  UIKitInputsModule.cpp
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#include "UIKitInputsModule.h"

namespace tonlabs::uikit {
using namespace facebook;
using namespace reanimated;

static jsi::Value __hostFunction_UIKitInputsModuleSpec_injectInputValue(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t count) {
    static_cast<UIKitInputsModuleSpec *>(&turboModule)->injectInputValue(rt, std::move(args[0]), std::move(args[1]));
    return jsi::Value::undefined();
}

UIKitInputsModuleSpec::UIKitInputsModuleSpec(std::shared_ptr<CallInvoker> jsInvoker) : TurboModule("UIKitInputsModule", jsInvoker) {
    methodMap_["injectInputValue"] = MethodMetadata{
      1, __hostFunction_UIKitInputsModuleSpec_injectInputValue};
}

void UIKitInputsModule::injectInputValue(jsi::Runtime &rt, const jsi::Value &reactTag, const jsi::Value &val) {
    int viewTag = static_cast<int>(reactTag.asNumber());
    std::string value = val.getString(rt).utf8(rt);
    #ifdef __ANDROID__
        static_cast<UIKitInputsManager>(_javaInputsManager).injectInputValue(viewTag, value);
    #endif
}
}
