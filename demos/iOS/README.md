## How to set up the demo

1. Install [MSAL](https://cocoapods.org/pods/MSAL) by running the commond below:
```
pod install
```

2. Open `QuickAuthSample.xcworkspace` using Xcode.

3. Ensure your deveice is connected and execute "Run" from Xcode. 

## How to integrate the Microsoft Quick Auth into other apps

Currently, We only provide the binary framework used for iOS ***arm64*** devices, the package locates at ```MSQASignIn.framework\```. Please follow this [instruction](https://developer.apple.com/library/archive/technotes/tn2435/_index.html#//apple_ref/doc/uid/DTS40017543-CH1-EMBED_SECTION) to embed it into your application. Meanwhile, you need to install MSAL as the first setup above.