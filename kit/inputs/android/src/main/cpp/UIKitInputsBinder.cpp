//
// Created by Aleksei Savelev on 14.07.2022.
//

#include "UIKitInputsBinder.h"

namespace tonlabs::uikit {
using namespace facebook;

void UIKitInputsBinder::setText(std::string value) {
    auto method = getClass()->getMethod<void(int, std::string)>("bind");
    method(self(), uid, value);
    return;
}

}