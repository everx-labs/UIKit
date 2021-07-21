require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

reactNativeVersion = package["devDependencies"]["react-native"].split(".")[1].to_i

if reactNativeVersion >= 64
  folly_prefix = "RCT-"
else
  folly_prefix = ""
end

folly_flags = "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -DRNVERSION=" + reactNativeVersion.to_s
folly_compiler_flags = folly_flags + " " + "-Wno-comma -Wno-shorten-64-to-32"

Pod::Spec.new do |s|
  s.name         = "UIKitHydrogen"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/tonlabs/UIKit/packages/keyboard#readme"
  s.license      = "Apache-2.0"
  s.author       = { "author" => "tonlabs.io" }
  s.platforms    = { :ios => "11.0", :tvos => "11.0" }
  s.source       = { :git => "https://github.com/tonlabs/UIKit.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"
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
  s.dependency "ReactCommon/turbomodule/core"
  s.dependency "#{folly_prefix}Folly"
end