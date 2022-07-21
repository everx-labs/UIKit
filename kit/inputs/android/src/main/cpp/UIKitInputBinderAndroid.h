//
// Created by Aleksei Savelev on 14.07.2022.
//

#pragma once

#ifdef __ANDROID__
#include <fbjni/fbjni.h>
#include <jsi/jsi.h>

namespace tonlabs::uikit {
using namespace facebook;

class UIKitInputBinderAndroid : public jni::JavaClass<UIKitInputBinderAndroid> {
public:
    static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/inputs/UIKitInputBinder;";

    void setText(std::string value);
};
}
#endif
