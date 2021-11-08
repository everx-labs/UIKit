//
//  UIKitKeyboardModule.h
//  uikit.keyboard
//
//  Created by Aleksei Savelev on 20/10/2021
//

#pragma once

#include "UIKitKeyboardFrameListener.h"

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

class JSI_EXPORT UIKitKeyboardModuleSpec : public TurboModule {
public:
    UIKitKeyboardModuleSpec(std::shared_ptr<CallInvoker> jsInvoker);

    virtual jsi::Value addFrameListener(jsi::Runtime &runtime, const jsi::Value &uid) = 0;
    virtual jsi::Value removeFrameListener(jsi::Runtime &runtime, const jsi::Value &uid) = 0;
};

class UIKitKeyboardModule : public UIKitKeyboardModuleSpec {
public:
    UIKitKeyboardModule(std::shared_ptr<CallInvoker> jsInvoker,
                        jsi::Runtime &rt,
                        std::shared_ptr<NativeReanimatedModule> nativeReanimatedModule,
                        std::unique_ptr<UIKitKeyboardFrameListener> keyboardFrameListener) :
    UIKitKeyboardModuleSpec(jsInvoker),
    runtime(rt),
    _keyboardFrameListener(std::move(keyboardFrameListener)),
    _nativeReanimatedModule(std::move(nativeReanimatedModule)) {};

    jsi::Value addFrameListener(jsi::Runtime &runtime, const jsi::Value &uid) override;
    jsi::Value removeFrameListener(jsi::Runtime &runtime, const jsi::Value &uid) override;

private:
    jsi::Runtime &runtime;
    std::unique_ptr<UIKitKeyboardFrameListener> _keyboardFrameListener;
    std::shared_ptr<NativeReanimatedModule> _nativeReanimatedModule;
};

} // namespace uikit
} // namespace tonlabs
