//
// Created by Aleksei Savelev on 14.07.2022.
//

#include "UIKitInputBinder.h"

namespace tonlabs::uikit {
using namespace facebook;

void UIKitInputBinder::setText(std::string value) {
    auto method = getClass()->getMethod<void(std::string)>("setText");
    method(self(), std::move(value));
}
}