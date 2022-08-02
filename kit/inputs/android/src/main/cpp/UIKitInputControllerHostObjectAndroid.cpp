//
// Created by Aleksei Savelev on 14.07.2022.
//
#ifdef __ANDROID__

#include "UIKitInputControllerHostObjectAndroid.h"

#include <utility>

namespace tonlabs::uikit {
using namespace facebook;
using namespace reanimated;

static jsi::Value __hostFunction_UIKitInputControllerHostObjectSpec_setTextAndCaretPosition(
        jsi::Runtime &rt,
        TurboModule &turboModule,
        const jsi::Value *args,
        [[maybe_unused]] size_t count) {
    dynamic_cast<UIKitInputControllerHostObjectAndroid *>(&turboModule)->setTextAndCaretPosition(std::move(args[0]), std::move(args[1]));
    return jsi::Value::undefined();
}

    UIKitInputControllerHostObjectSpec::UIKitInputControllerHostObjectSpec(std::shared_ptr<CallInvoker> jsInvoker) : TurboModule("UIKitInputControllerHostObjectAndroid", std::move(jsInvoker)) {
    methodMap_["setTextAndCaretPosition"] = MethodMetadata{
                1, __hostFunction_UIKitInputControllerHostObjectSpec_setTextAndCaretPosition};
}

void UIKitInputControllerHostObjectAndroid::setTextAndCaretPosition(const jsi::Value &value, const jsi::Value &caretPosition) {
    std::string val = value.getString(_runtime).utf8(_runtime);
    int caretPlace = static_cast<int>(caretPosition.asNumber());
    _javaInputController->setTextAndCaretPosition(val, caretPlace);
}
}
#endif
