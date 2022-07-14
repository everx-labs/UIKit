//
// Created by Aleksei Savelev on 14.07.2022.
//

#include <fbjni/fbjni.h>
#include <jsi/jsi.h>

namespace tonlabs::uikit {
using namespace facebook;

public class UIKitInputsBinder : public jni::JavaClass<UIKitInputsBinder> {
public:
    static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/inputs/UIKitInputBinder;";

    void setText(std::string value);
};
}