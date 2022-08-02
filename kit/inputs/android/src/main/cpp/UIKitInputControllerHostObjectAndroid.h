//
// Created by Aleksei Savelev on 14.07.2022.
//

#pragma once

#ifdef __ANDROID__

#include <jsi/jsi.h>

#include <NativeReanimatedModule.h>
#include "UIKitInputBinderAndroid.h"

namespace tonlabs:: uikit {

using namespace facebook;

class UIKitInputControllerHostObjectSpec : public TurboModule {
public:
    UIKitInputControllerHostObjectSpec(std::shared_ptr<CallInvoker> jsInvoker);

    virtual void setTextAndCaretPosition(const jsi::Value &value, const jsi::Value &caretPosition) = 0;
};

class UIKitInputControllerHostObjectAndroid : public UIKitInputControllerHostObjectSpec {
public:
    UIKitInputControllerHostObjectAndroid(std::shared_ptr<CallInvoker> jsInvoker,
                                      jsi::Runtime &rt,
                                      jni::global_ref<UIKitInputControllerAndroid> javaInputController) :
    UIKitInputControllerHostObjectSpec(jsInvoker),
                _runtime(rt),
                _javaInputController(javaInputController) {};

    void setTextAndCaretPosition(const jsi::Value &value, const jsi::Value &caretPosition) override;

private:
    jsi::Runtime &_runtime;
    jni::global_ref<UIKitInputControllerAndroid> _javaInputController;
};

}
#endif
