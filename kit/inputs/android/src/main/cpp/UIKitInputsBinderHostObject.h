//
// Created by Aleksei Savelev on 14.07.2022.
//

#pragma once

#include <jsi/jsi.h>

#include "UIKitInputsBinder.h"

namespace tonlabs {
namespace uikit {

using namespace facebook;

class UIKitInputsBinderHostObjectSpec : public TurboModule {
public:
    UIKitInputsBinderHostObjectSpec(std::shared_ptr<CallInvoker> jsInvoker);

    virtual void setText(const jsi::Value &value) = 0;
};

class UIKitInputsBinderHostObject : public UIKitInputsBinderHostObjectSpec {
public:
    UIKitInputsModule(std::shared_ptr <CallInvoker> jsInvoker,
                      jsi::Runtime &rt,
                      jni::global_ref<UIKitInputsBinder::javaobject> javaInputsBinder) :
                UIKitInputsModuleSpec(jsInvoker),
                _runtime(rt),
                _javaInputsBinder(javaInputsBinder) {};

    void setText(const jsi::Value &value) override;

private:
    jsi::Runtime &_runtime;
    jni::global_ref<UIKitInputsBinder::javaobject> _javaInputsBinder;
};

} // namespace uikit
} // namespace tonlabs
