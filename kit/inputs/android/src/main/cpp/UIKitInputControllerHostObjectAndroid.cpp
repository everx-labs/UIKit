//
// Created by Aleksei Savelev on 14.07.2022.
//
#ifdef __ANDROID__

#include "UIKitInputControllerHostObjectAndroid.h"

#include <utility>

namespace tonlabs::uikit {
using namespace facebook;
using namespace reanimated;

static jsi::Value __hostFunction_UIKitInputControllerHostObjectSpec_setText(
        jsi::Runtime &rt,
        TurboModule &turboModule,
        const jsi::Value *args,
        [[maybe_unused]] size_t count) {
    dynamic_cast<UIKitInputControllerHostObjectAndroid *>(&turboModule)->setText(std::move(args[0]), std::move(args[1]));
    return jsi::Value::undefined();
}

    UIKitInputControllerHostObjectSpec::UIKitInputControllerHostObjectSpec(std::shared_ptr<CallInvoker> jsInvoker) : TurboModule("UIKitInputControllerHostObjectAndroid", std::move(jsInvoker)) {
    methodMap_["setText"] = MethodMetadata{
                1, __hostFunction_UIKitInputControllerHostObjectSpec_setText};
}

void UIKitInputControllerHostObjectAndroid::setText(const jsi::Value &value, const jsi::Value &caretPosition) {
    std::string val = value.getString(_runtime).utf8(_runtime);
    int caretPlace = static_cast<int>(caretPosition.asNumber());
    _javaInputController->setText(val, caretPlace);
}
}
#endif
