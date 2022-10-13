# Microsoft Quick Authentication for iOS configuration and Objective-C API reference

These settings and APIs allow you to customize the appearance and behavior of the UI provided by Microsoft Quick Authentication and to invoke functionality provided by MSAL for iOS, such as signing out or requesting an access token for user information in the Microsoft Graph.

For information about how to use Quick Authentication for iOS, see [Sign-in users with a Microsoft Account to iOS apps using Microsoft Quick Authentication](./quick-authentication-ios-how-to.md).

> Microsoft Quick Authentication is in public preview. This preview is provided without a service-level agreement and isn't recommended for production workloads. Some features might be unsupported or have constrained capabilities. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/).

## Creating a sign-in button
Refer to the [how to guide](quick-authentication-ios-how-to.md#adding-a-sign-in-button-to-your-application) to learn how to create a sign-in button declaratively in a storyboard or XIB file.

You can also create the sign-in button programmatically using: 
```objectivec
- (instancetype)initWithFrame:(CGRect)frame
```
or to customize the appearance of the button during creation:
```objectivec
- (nullable instancetype)initWithCoder:(NSCoder*)coder
```

[**TODO**: Minggang, can developers used the version of this method with NSCoder. If yes, please describe NSCoder]

[**TODO**: Minggang, please add code example or reference to the demo sample code]

 ## Customizing the appearance of the sign-in button
To customize the appearance of the button, you can set the following properties on the `MSQASignInButton` instance:

| Properties |  Description | Values | Default value |
| -- | -- | -- | -- |
| type | The button type | kMSQASignInButtonTypeStandard<br> kMSQASignInButtonTypeIcon|kMSQASignInButtonTypeStandard | 
| theme | The button visual theme | kMSQASignInButtonThemeDark<br>  kMSQASignInButtonThemeLight |	kMSQASignInButtonThemeDark |
| size | Predefined sizes. If width or height are specified, they override this setting.<br> **Large**:<br>&nbsp; width: 280px<br>&nbsp; height: 42px<br>&nbsp; textSize: 16px<br>&nbsp; iconSize: 20px<br> **Medium**:<br>&nbsp; width: 280px<br>&nbsp; height: 36px<br>&nbsp; textSize: 14px<br>&nbsp; iconSize: 16px<br> **Small**:<br>&nbsp; width: 280px<br>&nbsp; height: 28px<br>&nbsp; textSize: 12px<br>&nbsp; iconSize: 12px | kMSQASignInButtonSizeSmall<br> kMSQASignInButtonSizeMedium<br> kMSQASignInButtonSizeLarge | kMSQASignInButtonSizeLarge |
| text |	Button text	| kMSQASignInButtonTextSignInWith<br> kMSQASignInButtonTextSignUpWith <br> kMSQASignInButtonTextSignIn<br> kMSQASignInButtonTextContinueWith | kMSQASignInButtonTextSignInWith |
| shape | Shape of button corners. | kMSQASignInButtonShapeRectangular<br> kMSQASignInButtonShapePill<br>kMSQASignInButtonShapeRounded |kMSQASignInButtonShapeRectangular |
| logoAlignment | Where the Microsoft logo should be in the button | kMSQASignInButtonLogoLeft<br> kMSQASignInButtonLogoCenter | kMSQASignInButtonLogoLeft |

[**TODO** can I set these properties declaratively in the storyboard or XIB?]

Example code:
```objectivec
msSignInButton.theme = kMSQASignInButtonThemeDark;
msSignInButton.type = kMSQASignInButtonTypeStandard;
```
[**TODO** how do I retrieve a button defined declaratively in the storyboard or the XIB file?]


## MSQASignIn Methods
The following methods of `MSQASignIn` offer programatic triggering of the sign-in flow and additional functionality. Note that these methods are asynchronous and internally dispatch their work to another thread. As a result, they can be called on the main thread and their completion block will be called back asynchronously on the same thread. 

| Method | Description |
|--|--|
| initWithConfiguration() | Initialize the MSQASignIn object. |
| signInWithCompletionBlock() | Starts the process of signing in the user with an MSA. |
| signOutWithCompletionBlock() | Signs the user out of this application. |
| getCurrentAccountWithCompletionBlock() | gets the current [AccountData](#AccountData) for the user. |
| acquireTokenSilentWithParameter() | Attempts to acquire an access token silently (with no user interaction). |
| acquireTokenWithParameters() | Acquires an access token interactively, will pop-up web UI. | |

### MSQASignIn method: initWithConfiguration
Initializes the MSQASignIn object, through which you can utilize most of Microsoft Quick Authentication functionality.
```objectivec
- (instancetype)initWithConfiguration:(MSQAConfiguration *)configuration
                                error:(NSError *_Nullable *_Nullable)error;
```
where `MSQAConfiguration` is defined as: 

```objectivec
/// The class represents the configuration for the `MSQASignIn`.
@interface MSQAConfiguration : NSObject

/// The client ID of the app from the Microsoft developer portal.
@property(nonatomic, readonly) NSString *clientID;

/// The permissions you want to include in the access token to be fetched.
@property(nonatomic, readonly) NSArray<NSString *> *scopes;

/// Unavailable, use `initWithClientID`.
/// :nodoc:
+ (instancetype)new NS_UNAVAILABLE;

/// Unavailable, use `initWithClientID`.
/// :nodoc
- (instancetype)init NS_UNAVAILABLE;

/// Initialize `MSQAConfiguration` class.
/// @param clientID The client ID of the app from the Microsoft developer
/// portal.
- (instancetype)initWithClientID:(NSString *)clientID;

@end
```

### MSQACompletionBlock and MSQAAccountData

[**TODO** consistency: MSQAAccountData in iOS and MSQAAccountInfo in Android - Minggang: use MSQAAccountInfo everywhere once you have changed the code]

`MSQASignIn` methods that return account information do so by invoking an `MSQACompletionBlock` 

with `MSQACompletionBlock` defined as
```objectivec
typedef void (^MSQACompletionBlock)(MSQAAccountData *_Nullable account,
                                    NSError *_Nullable error);
```
with the `MSQAAccountData` argument containing the following information:

```objectivec
@interface MSQAAccountData : NSObject <NSCopying> 

// MSA user's full name.
@property(nonatomic, readonly) NSString *fullName;

// MSA user's email address or phone.
@property(nonatomic, readonly) NSString *userName;

// CID for MSA account.
@property(nonatomic, readonly) NSString *userId;

// The user profile photo in Base64 encoded, will be nil if none.
@property(nonatomic, readonly, nullable) NSString *base64Photo;

// MSA account id token.
@property(nonatomic, readonly, nullable) NSString *idToken;

/// MSA user's surname.
@property(nonatomic, readonly, nullable) NSString *surname;

/// MSA user's given name.
@property(nonatomic, readonly, nullable) NSString *givenName;

/// MSA user's email.
@property(nonatomic, readonly, nullable) NSString *email;

@end
```
### MSQASignIn method: getCurrentAccountWithCompletionBlock
This method returns the account the user is currently signed-in with, if any, through the callback. 
```objectivec
- (void)getCurrentAccountWithCompletionBlock:(MSQACompletionBlock)completionBlock;
```

| Parameters | Description | 
| -- | -- | 
| completionBlock | callback invoked when the operation is complete or an error occurred. |
| &nbsp;&nbsp; account | Returns information about the account if one was retreived. Nil if no account was retrieved. |
| &nbsp;&nbsp; error  | If an error occurred, returns information about the error, otherwise nil. If there is no signed in account, both account and error will be nil.

Code example (Objective-C):
```objectivec
[_msSignIn getCurrentAccountWithCompletionBlock:^(
               MSQAAccountData *_Nullable account, NSError *_Nullable error) {
  if (account) {
    // Use account
  }
  else if (error) {
    // Handle the error
  }
}];
```
### MSQASignIn method: signInWithViewController:completionBlock
Interactively signs-in the user into your site and returns the account asynchronously through the callback.
```objectivec
- (void)signInWithViewController:(UIViewController *)controller
                 completionBlock:(MSQACompletionBlock)completionBlock;
```
| Parameters | Description |
| -- | -- | 
| controller | The view controller used to present the sign-in UI.|
| completionBlock | The completion block that will be called with the account information |
| &nbsp;&nbsp; account | Returns information about the account if one was retreived. Nil if no account was retrieved. |
| &nbsp;&nbsp; error | If an error occurred, returns information about the error, otherwise nil|

Code example (Objective-C):
```objectivec
[_msSignIn
    signInWithViewController:(UIViewController *)controller
             completionBlock: ^(MSQAAccountData *account, NSError *error) {
      if (account == nil)
        return;

      NSString *fullName = account.fullName; // "John Doe"
      NSString *userName = account.userName; // JohnDoe@hotmail.com
      NSData *data = [[NSData alloc]
        initWithBase64EncodedString:_accountData.base64Photo
                            options:
                              NSDataBase64DecodingIgnoreUnknownCharacters];
      NSImage *photo = [UIImage imageWithData:data];
      // Use these values in UX.
    }];
```

### MSQASignIn method: signOutWithCompletionBlock
Signs the user out  [**TODO** be clearer on where to put that code]:
```objectivec
- signOutWithCompletionBlock:^(NSError *_Nullable error);
```
Example code (Objective-C): 
```objectivec
- (IBAction)signOut:(id)sender {
  [_msSignIn
      signOutWithCompletionBlock:^(NSError *_Nullable error) {
        if (error)
          NSLog(@"Error:%@", error.description);
      }];
}
```

### MSQASignIn method: acquireTokenWithParameters:completionBlock
Acquires an access token to access additional account information about the user stored in the Microsoft Graph, using interactive authentication if necessary.

```objectivec
- (void)acquireTokenWithParameters:(MSQAInteractiveTokenParameters *)
                                   parameters
                   completionBlock:(MSQACompletionBlock)completionBlock;
```

| Parameters | Description | 
| -- | -- |
| parameters | Contains the parameters used to fetch the token |
| completionBlock | The completion block that will be called on completion or on failure [**TODO** Minggang: this needs to return a token, not account data].
| completionBlock | callback invoked when the operation is complete or an error occurred. |
| &nbsp;&nbsp; token | Returns the token. Nil if no token was retrieved. |
| &nbsp;&nbsp; error | If an error occurred, returns information about the error, otherwise nil. 

Code example (Objective-C):
``` objectivec
MSQASilentTokenParameters *parameters =
    [[MSQASilentTokenParameters alloc] initWithScopes:@[ @"User.Read" ]];
[_msSignIn
    acquireTokenSilentWithParameters:parameters
                     completionBlock:^(MSQAAccountData *account, NSError *error) {
  if (error) {
    MSQAWebviewParameters *webParameters = [[MSQAWebviewParameters alloc]
        initWithAuthPresentationViewController:self];
    MSQAInteractiveTokenParameters *params =
        [[MSALInteractiveTokenParameters alloc]
             initWithScopes:@[ @"User.Read" ]
          webviewParameters:webParameters];

    [_msSignIn acquireTokenWithParameters: params
                    completionBlock:^(MSQAAccountData *account, NSError 
                                      *error) {
                     if (!error) {
                       NSString *userId = account.userId;
                       NSString *idToken = account.idToken;
                     } else {
                       // Check the error
                     }
                   }];
  } else {
    // You'll want to get the account identifier to
    // retrieve and reuse the account
    // for later acquireToken calls
    NSString *userId = account.userId;
    NSString *idToken = account.idToken;
  }}];
```

## MSQASIgnIn method: acquireTokenSilentWithParameters:completionBlock
Attempt to acquires an access token to access additional account information about the user without interaction with the user. Fails if it is not possible.
```objectivec
- (void) acquireTokenSilentWithParameters:(MSQASilentTokenParameters *)
                                           parameters
                     completionBlock:(MSQACompletionBlock)completionBlock;
```
[**TODO** what is the proper way to indent the code above?]

| Parameter | Description |
| -- | -- |
| parameters | Contains the parameters used to fetch the token. |
| completionBlock | The completion block that will be called on completion or on failure [**TODO** Minggang: this needs to return a token, not account data].
| completionBlock | callback invoked when the operation is complete or an error occurred. |
| &nbsp;&nbsp; token | Returns the token. Nil if no token was retrieved. |
| &nbsp;&nbsp; error | If an error occurred, returns information about the error, otherwise nil. 

Code exampl (Objective-C):
```objectivec
MSQASilentTokenParameters *parameters =
    [[MSQASilentTokenParameters alloc] initWithScopes:@[ @"User.Read" ]];

[_msSignIn acquireTokenWithParameters:parameters
                      completionBlock:^(MSQAAccountData *account, NSError *error) {
                       if (!error) {
                         // Use access token.
                       } else {
                         // Check the error
                       }
                     }];
```
##	Logging
`MSQALogger` is a singleton object representing the logger. Use `MSQALogger`. `sharedInstance` to access the shared instance.

### Setting the logging level
   
Set the log level by setting the `logLevel` property of `MSQALogger`, the default log level is `MSQALogLevelInfo`.
```objectivec
@property(atomic) MSQALogLevel logLevel;
```
With MSQALogLevel defined as:
```objectivec
typedef NS_ENUM(NSInteger, MSQALogLevel) {
  /** Disable all logging */
  MSQALogLevelNothing,
 
  /** Default level, prints out information only when errors occur */
  MSQALogLevelError,
 
  /** Warnings only */
  MSQALogLevelWarning,
 
  /** Library entry points, with parameters and various keychain operations */
  MSQALogLevelInfo,
 
  /** API tracing */
  MSQALogLevelVerbose,
 
  /** API tracing */
  MSQALogLevelLast = MSQALogLevelVerbose,
};
```

### Setting the logging callback

The logging messages will be passed through the callback that can be set on `MSQALogger` using `setLogCallback`
```objectivec
- (void)setLogCallback:(MSQALogCallback)callback; 
```
With MSQALogCallback defined as:
```objectivec
typedef void (^MSQALogCallback)(MSQALogLevel level,
                                NSString *_Nullable message);
```

### Enable MSAL logging
As the Microsoft Quick Authentication SDK builds on top of [MSAL for iOS](https://github.com/AzureAD/microsoft-authentication-library-for-objc), you can enable logging in MSAL and receive the messages through the same callback as above, at the same log level. MSAL logging is disabled by default. Use `MSQALogger`'s property `enableMSALLogging`:
```
@property(atomic) BOOL enableMSALLogging;
```
