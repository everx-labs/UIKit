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

class UIKitInputBinderHostObjectSpec : public TurboModule {
public:
    UIKitInputBinderHostObjectSpec(std::shared_ptr<CallInvoker> jsInvoker);

    virtual void setText(const jsi::Value &value) = 0;
};

class UIKitInputBinderHostObject : public UIKitInputBinderHostObjectSpec {
public:
    UIKitInputBinderHostObject(std::shared_ptr<CallInvoker> jsInvoker,
                      jsi::Runtime &rt,
                      jni::global_ref<UIKitInputBinderAndroid> javaInputBinder) :
                UIKitInputBinderHostObjectSpec(jsInvoker),
                _runtime(rt),
                _javaInputBinder(javaInputBinder) {};

    void setText(const jsi::Value &value) override;

private:
    jsi::Runtime &_runtime;
    jni::global_ref<UIKitInputBinderAndroid> _javaInputBinder;
};

}
#endif
