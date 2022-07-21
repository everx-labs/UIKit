//
//  UIKitInputsModuleAndroid.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#pragma once

#ifdef __ANDROID__
#include <NativeReanimatedModule.h>

#include "UIKitInputControllerAndroid.h"

namespace tonlabs :: uikit {
using namespace facebook;
using namespace reanimated;

class JSI_EXPORT UIKitInputsModuleSpec : public TurboModule {
public:
    UIKitInputsModuleSpec(std::shared_ptr<CallInvoker> jsInvoker);

    virtual jsi::Object bind(const jsi::Value &reactTag) = 0;
};

class [[maybe_unused]] UIKitInputsModuleAndroid : public UIKitInputsModuleSpec {
public:
    [[maybe_unused]] UIKitInputsModuleAndroid(std::shared_ptr<CallInvoker> jsInvoker,
                                              jsi::Runtime &rt,
                                              jni::global_ref<UIKitInputControllerAndroid::javaobject> javaInputsManager
 ) :
    UIKitInputsModuleSpec(jsInvoker),
    _jsInvoker(jsInvoker),
    _runtime(rt),
    _javaInputsManager(javaInputsManager)
    {};

    jsi::Object bind(const jsi::Value &reactTag) override;
private:
    jsi::Runtime &_runtime;
    jni::global_ref<UIKitInputControllerAndroid::javaobject> _javaInputsManager;
    std::shared_ptr<CallInvoker> _jsInvoker;
};

}
#endif
