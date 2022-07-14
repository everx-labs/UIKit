//
// Created by Aleksei Savelev on 14.07.2022.
//

#include "UIKitInputsBinder.h"

namespace tonlabs::uikit {
using namespace facebook;

void UIKitInputsBinder::setText(std::string value) {
    auto method = getClass()->getMethod<void(std::string)>("setText");
    method(self(), value);
}
}