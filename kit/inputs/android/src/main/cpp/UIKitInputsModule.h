//
//  UIKitInputsModule.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#pragma once

#include "UIKitInputsModule.h"

//#include <jsi/jsi.h>

#ifdef __ANDROID__

#include <NativeReanimatedModule.h>
#include <ShareableValue.h>
#include <MutableValue.h>
#include "UIKitInputManager.h"

#elif __APPLE__

#include <RNReanimated/NativeReanimatedModule.h>
#include <RNReanimated/ShareableValue.h>
#include <RNReanimated/MutableValue.h>

#endif

namespace tonlabs {
namespace uikit {
using namespace facebook;
using namespace reanimated;

class JSI_EXPORT UIKitInputsModuleSpec : public TurboModule {
public:
    UIKitInputsModuleSpec(std::shared_ptr<CallInvoker> jsInvoker);

    virtual void callInjectInputValue(const jsi::Value &reactTag, const jsi::Value &value) = 0;
    virtual jsi::Value getInputValueInjector(const jsi::Value &reactTag) = 0;
};

class UIKitInputsModule : public UIKitInputsModuleSpec {
public:
    UIKitInputsModule(std::shared_ptr<CallInvoker> jsInvoker,
                      jsi::Runtime &rt,
 #ifdef __ANDROID__
                      jni::global_ref<UIKitInputManager::javaobject> javaInputsManager,
 #elif __APPLE__
            jni::global_ref<UIKitInputsManager::javaobject> javaInputsManager,
//     UIKitKeyboardFrameListener(UIKitKeyboardIosFrameListener *iosKeyboardFrameListener) : _iosKeyboardFrameListener(iosKeyboardFrameListener) {};
 #endif
                      std::shared_ptr<NativeReanimatedModule> nativeReanimatedModule) :
    UIKitInputsModuleSpec(jsInvoker),
    runtime(rt),
 #ifdef __ANDROID__
    _javaInputsManager(javaInputsManager),
 #endif
    _nativeReanimatedModule(std::move(nativeReanimatedModule)) {};

    void callInjectInputValue(const jsi::Value &reactTag, const jsi::Value &value) override;
    jsi::Value getInputValueInjector(const jsi::Value &reactTag) override;
private:
    jsi::Runtime &runtime;
 #ifdef __ANDROID__
    jni::global_ref<UIKitInputManager::javaobject> _javaInputsManager;
 #elif __APPLE__

 #endif
        std::shared_ptr<NativeReanimatedModule> _nativeReanimatedModule;
};

} // namespace uikit
} // namespace tonlabs
