//
// Created by Aleksei Savelev on 14.07.2022.
//
#ifdef __ANDROID__

#include "UIKitInputControllerAndroid.h"

namespace tonlabs::uikit {
using namespace facebook;

void UIKitInputControllerAndroid::setText(std::string value, int caretPosition) {
    auto method = getClass()->getMethod<void(std::string, int)>("setText");
    method(self(), std::move(value), caretPosition);
}
}
#endif
