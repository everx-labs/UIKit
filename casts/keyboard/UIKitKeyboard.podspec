require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

class ReactNativeVersion
  def find_nearest_app_rn_version(path, level = 0)
    rnPackageJsonPath = File.join(__dir__, path, "node_modules", "react-native", "package.json")
    if File.exist?(rnPackageJsonPath)
      package = JSON.parse(File.read(rnPackageJsonPath))
      return package["version"].split(".")[1].to_i
    end
    # If it more that 10 than we assume that it's not an RN project
    if level == 10
      throw "You can't use uikit.keyboard in not RN project"
    end
    return find_nearest_app_rn_version(File.join('..', path), level + 1);
  end
end

react_native_version = ReactNativeVersion.new.find_nearest_app_rn_version('..', 0)

if react_native_version >= 64
  folly_prefix = "RCT-"
else
  folly_prefix = ""
end

folly_flags = "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -DRNVERSION=" + react_native_version.to_s
folly_compiler_flags = folly_flags + " " + "-Wno-comma -Wno-shorten-64-to-32"

Pod::Spec.new do |s|
  s.name         = "UIKitKeyboard"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/tonlabs/UIKit/casts/keyboard#readme"
  s.license      = "Apache-2.0"
  s.author       = { "author" => "tonlabs.io" }
  s.platforms    = { :ios => "10.0", :tvos => "11.0" }
  s.source       = { :git => "https://github.com/tonlabs/UIKit.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}", "cpp/*.{h,cpp}"
  s.exclude_files = "cpp/UIKitKeyboardAndroidFrameListener.{h,cpp}", "cpp/UIKitKeyboardModule.cpp", "cpp/UIKitKeyboardFrameListener.cpp"
  s.pod_target_xcconfig = {
    :GCC_PREPROCESSOR_DEFINITIONS => "HAVE_FULLFSYNC=1",
    :WARNING_CFLAGS => "-Wno-shorten-64-to-32 -Wno-comma -Wno-unreachable-code -Wno-conditional-uninitialized -Wno-deprecated-declarations",
    :USE_HEADERMAP => "No"
  }
  s.compiler_flags = folly_compiler_flags
  s.xcconfig = {
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++17",
    "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/#{folly_prefix}Folly\" \"$(PODS_ROOT)/boost-for-react-native\" \"$(PODS_ROOT)/Headers/Private/React-Core\"",
    "OTHER_CFLAGS" => "$(inherited)" + " " + folly_flags
  }
  s.requires_arc = true

  s.dependency "React-Core"
  s.dependency "React-callinvoker"
  s.dependency "React-jsiexecutor"
  s.dependency "ReactCommon/turbomodule/core"
  s.dependency "#{folly_prefix}Folly"
end