//
//  UIKitInputsManager.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#include <fbjni/fbjni.h>

#include "UIKitInputsManager.h"

namespace tonlabs {
namespace uikit {

using namespace facebook;

UIKitInputsManager::UIKitInputsManager(
    jni::alias_ref<UIKitInputsManager::jhybridobject> jThis) 
    : javaPart_(jni::make_global(jThis)) {};

void UIKitInputsManager::injectInputValue(int uid, std::string value) {
    // TODO: somehow turn it into JInteger and JString
    // and call java method
};

}
}