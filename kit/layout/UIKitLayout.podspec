require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "UIKitLayout"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/tonlabs/UIKit/kit/layout#readme"
  s.license      = "Apache-2.0"
  s.author       = { "author" => "tonlabs.io" }
  s.platforms    = { :ios => "9.0", :tvos => "11.0" }
  s.source       = { :git => "https://github.com/tonlabs/UIKit.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,metal}"
  s.requires_arc = true

  s.dependency "React-Core"

  s.script_phase = { 
    :name => 'Build Metal Library - MSL 2.3', 
    :script => <<~SCRIPTCONTENT,
        set -e
        set -u
        set -o pipefail
        cd "${PODS_TARGET_SRCROOT}/ios/"
        xcrun metal -target "air64-${LLVM_TARGET_TRIPLE_VENDOR}-${LLVM_TARGET_TRIPLE_OS_VERSION}${LLVM_TARGET_TRIPLE_SUFFIX:-""}" -ffast-math -std=ios-metal2.3 -o "${METAL_LIBRARY_OUTPUT_DIR}/UIKitLayout.metallib" *.metal
        SCRIPTCONTENT
    :execution_position => :after_compile
  }

  s.pod_target_xcconfig = { "METAL_LIBRARY_OUTPUT_DIR" => "${TARGET_BUILD_DIR}\/UIKitLayout.bundle\/" }

  s.resource_bundle = { 'UIKitLayout' => '' }
end
