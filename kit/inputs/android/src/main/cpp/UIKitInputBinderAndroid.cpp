//
// Created by Aleksei Savelev on 14.07.2022.
//
#ifdef __ANDROID__

#include "UIKitInputBinderAndroid.h"

namespace tonlabs::uikit {
using namespace facebook;

void UIKitInputBinderAndroid::setText(std::string value) {
    auto method = getClass()->getMethod<void(std::string)>("setText");
    method(self(), std::move(value));
}
}
#endif
