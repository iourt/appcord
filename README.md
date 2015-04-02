# appcord

cordova create cordova com.example.club Club
cordova platform add ios
cordova platform add android

cordova build ios
[
cordova prepare ios
cordova compile ios
]


cordova plugin add https://github.com/Telerik-Verified-Plugins/NativePageTransitions.git

安装WKWebView
cordova plugin add com.telerik.plugins.wkwebview
cordova prepare

platforms/ios/CordovaLib/Classes/CDVViewController.m
for (id subview in self.webView.subviews){  //webView是要被禁止滚动和回弹的UIWebView
    if ([[subview class] isSubclassOfClass: [UIScrollView class]])
        ((UIScrollView *)subview).bounces = NO;
}
