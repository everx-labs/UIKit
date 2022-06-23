//
//  UIKitInputsModule.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#pragma once

#include "UIKitInputsModule.h"

#include <jsi/jsi.h>

#ifdef __ANDROID__

#include <NativeReanimatedModule.h>
#include <ShareableValue.h>
#include <MutableValue.h>

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

    virtual jsi::Value injectInputValue(jsi::Runtime &runtime, const jsi::Value &uid) = 0;
};

class UIKitInputsModule : public UIKitInputsModuleSpec {
public:
    UIKitInputsModule(std::shared_ptr<CallInvoker> jsInvoker,
                        jsi::Runtime &rt,
                        std::shared_ptr<NativeReanimatedModule> nativeReanimatedModule,
                        std::unique_ptr<UIKitInputsModule> uiKitInputsModule) :
    UIKitInputsModuleSpec(jsInvoker),
    runtime(rt),
    _uiKitInputsModule(std::move(uiKitInputsModule)),
    _nativeReanimatedModule(std::move(nativeReanimatedModule)) {};

    jsi::Value injectInputValue(jsi::Runtime &runtime, const jsi::Value &uid, const std::string &value) override;

private:
    jsi::Runtime &runtime;
    std::unique_ptr<UIKitInputsModule> _uiKitInputsModule;
    std::shared_ptr<NativeReanimatedModule> _nativeReanimatedModule;
};

} // namespace uikit
} // namespace tonlabs
