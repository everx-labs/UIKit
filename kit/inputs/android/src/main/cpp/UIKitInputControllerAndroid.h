//
// Created by Aleksei Savelev on 14.07.2022.
//

#pragma once

#ifdef __ANDROID__
#include <fbjni/fbjni.h>
#include <jsi/jsi.h>

namespace tonlabs::uikit {
using namespace facebook;

class UIKitInputControllerAndroid : public jni::JavaClass<UIKitInputControllerAndroid> {
public:
    static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/inputs/UIKitInputController;";

    void setText(std::string value, int caretPosition);
};
}
#endif
