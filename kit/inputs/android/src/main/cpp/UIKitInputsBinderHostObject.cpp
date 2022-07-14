//
// Created by Aleksei Savelev on 14.07.2022.
//

#include "UIKitInputsBinderHostObject.h"

namespace tonlabs::uikit {
using namespace facebook;
using namespace reanimated;

static jsi::Value __hostFunction_UIKitInputsBinderHostObjectSpec_setText(
        jsi::Runtime &rt,
        TurboModule &turboModule,
        const jsi::Value *args,
        size_t count) {
    static_cast<UIKitInputsBinderHostObject *>(&turboModule)->setText(std::move(args[0]));
    return jsi::Value::undefined();
}

UIKitInputsBinderHostObjectSpec::UIKitInputsBinderHostObjectSpec(std::shared_ptr<CallInvoker> jsInvoker) : TurboModule("UIKitInputsBinderHostObject", jsInvoker) {
    methodMap_["setText"] = MethodMetadata{
                1, __hostFunction_UIKitInputsBinderHostObjectSpec_setText};
}

void UIKitInputsModule::setText(const jsi::Value &value) {
    std::string value = val.getString(runtime).utf8(runtime);

    #ifdef __ANDROID__
    _javaInputsBinder->setText(value);
    #endif
}
}
