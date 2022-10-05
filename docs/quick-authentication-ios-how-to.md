# Sign-in users with a Microsoft Account to iOS apps using Microsoft Quick Authentication


On iOS, Microsoft Quick Authentication offers a library that makes it easier to add **Sign in with Microsoft** support to native apps. Quick Authentication uses the Microsoft Authentication Library (MSAL) for iOS to handle authentication and authorization for users with personal Microsoft accounts.

> Microsoft Quick Authentication is in public preview. This preview is provided without a service-level agreement and isn't recommended for production workloads. Some features might be unsupported or have constrained capabilities. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/).

## How it works
Microsoft Quick Authentication allows you to easily add a fully functioning sign-in button to your iOS application that will take the user through to sign-in workflow with a Microsoft Account (MSA). Additionally, Quick Authentication allows you to sign-in your users silently whenever possible, to let them sign out of your application, and to perform more advanced tasks such as requesting an access token to retrieve additional account information. **[TODO** mention Microsoft Graph here?]

To enable Quick Authentication in your application, you will need to follow these high level steps. Each step is further detailed in the rest of this document. 
- First register your application for iOS on Azure (you can reuse the same Azure registration as for your web site). 
- Install Microsoft Quick Authentication SDK and import the required header files in your application.
- Create a Quick Authentication sign-in client object (`MSQASignIn`) with the proper configuration.
- Add an Quick Authentication sign-in button somewhere in your application storyboard or XIB file.
- Set a callback on the sign-in button to be notified when the user has completed the sign-in workflow.
- Implement the callback to integrate the user account to your own identity system.

Quick Authentication will show a fully functioning sign-in button, looking as follows in its default form, and customizable like with Quick Authentication for the web:

[**TODO**: capture and insert image from actual phone]

  ![Standard sign-in button showing the Sign in with Microsoft text label](./media/large.png)

Note that at this time, the personalization of the user experience available with Quick Authentication for the web is not available to iOS native apps. However, your users will still be able to sign-in using the button shown above, and benefit from SSO in some circumstances.

## Registering your application
If you have already registered a single-page web or an Android application, you can reuse the same application registration. To find that registration go to [Microsoft | App registrations](https://ms.portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps) and select your existing application registration in the list. This will open a page describing your application registration.

 If you have not yet registered an application or wish to use a new registration, complete the steps in [Register an application with the Microsoft identity platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) to register your application.

Now that you have created a application registration, you can extend it to iOS as follows. On the Azure page describing your app registration:
1. Open the *Authentication* tab on the left of that page
3. Click *Add Platform*
4. Select *iOS / MacOS*
5. Enter your app's Bundle ID, which can be found in XCode in the Info.plist or "Build Settings".
7. Click *Configure*

[**TODO:** Add screen shots to list above]

## Installing Microsoft Quick Authentication SDK
1. Install CocoaPods following the instruction in the [Getting Started guide](https://guides.cocoapods.org/using/getting-started.html)
2. Create a Podfile for your application and add the dependency on Microsoft Quick Authentication:
```
$ pod init & pod ‘MicrosoftQuickAuth’
```
3. Install the dependency:
```
$ pod install
```

# Configurating your application
Create a `MSQAConfiguration` object to set the client ID the application used, and the scopes includes “User.Read” by default. 

```
#import <MSQA/MSQASignIn.h>

MSQAConfiguration *config = [[MSQAConfiguration alloc]
      initWithClientID:@"YOUR_IOS_CLIENT_ID"];
```
and initialize the MSQASignIn as below:
```
NSError *error = nil;
MSQASignIn *msSignIn = [[MSQASignIn alloc] initWithConfiguration:config
                                                           error:&error];
```                                                           
The error will not be nil if an error occurred, e.g., the passed client ID is nil. All the methods of MSQASignIn should be called from UI thread. If you call other functions, e.g., fetch the token, before configuring MSQASignIn, the completionBlock will be invoked asynchronously on UI thread.
Also, if the client ID is an invalid one, the later signing-in or acquiring token action will fail and the authentication page looks like below:
