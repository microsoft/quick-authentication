#Microsoft Quick Authentication for iOS configuration and Objective-C API reference

These settings and APIs allow you to customize the appearance and behavior of the UI provided by Microsoft Quick Authentication and to invoke functionality provided by MSAL for iOS, such as signing out or requesting an access token for user information in the Microsoft Graph.

For information about how to use Quick Authentication for iOS, see [Sign-in users with a Microsoft Account to iOS apps using Microsoft Quick Authentication](./quick-authentication-ios-how-to.md).

> Microsoft Quick Authentication is in public preview. This preview is provided without a service-level agreement and isn't recommended for production workloads. Some features might be unsupported or have constrained capabilities. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/).

## Creating and configuring MSQASignIn

[**TODO** consitency: MSQASignIn in iOS and MSQASignInClient is Android]

<br>
<br>


## MSQAAccountData
On success, the completion block will be invoked with the `MSQAAccountData` containing the following information:

[**TODO** consistency: MSQAAccountData in iOS and MSQAAccountInfo in Android]

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

@end
```

## MSQASignIn Methods
The following methods of `MSQASignIn` offer programatic triggering of the sign-in flow and additional functionality. Note that these methods are asynchronous and internally dispatch their work to another thread. As a result, they can be called on the main thread and their completion block will be called back asynchronously on the same thread. 

| Method | Description |
|--|--|
| signIn() | Starts the process of signing in the user with MSA. |
| signOut() | Signs the user out of this application. |
| getCurrentAccountWithCompletionBlock() | gets the current [AccountData](#AccountData) for the user. |
| acquireTokenSilent() | Perform acquire token silent call. |
| acquireToken() | Acquires an access token interactively, will pop-up web UI. |

## MSQASignIn method: getCurrentAccountWithCompletionBlock
This method returns the account the user is currently signed-in with, if any, through the callback. 
```objectivec
- (void)getCurrentAccountWithCompletionBlock:(MSQACompletionBlock)completionBlock;
```

with `MSQACompletionBlock` defined as
```objectivec
typedef void (^MSQACompletionBlock)(MSQAAccountData *_Nullable account,
                                    NSError *_Nullable error);
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
  if (error) {
    // Handle the error
  }
}];
```
## MSQASignIn method: signInWithViewController:completionBlock
Interactively signs-in the user into your site and returns the account asynchronously through the callback.
```objectivec
- (void)signInWithViewController:(UIViewController *)controller
                 completionBlock:(MSQACompletionBlock)completionBlock;
```
with `MSQACompletionBlock` defined as
```objectivec
typedef void (^MSQACompletionBlock)(MSQAAccountData *_Nullable account,
                                    NSError *_Nullable error);
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
                 completionBlock: ^(
               MSQAAccountData *account, NSError *error) {
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

## MSQASignIn method: acquireTokenWithParameters:completionBlock
Acquires an access token to access additional account information about the user stored in the Microsoft Graph, using interactive authentication if necessary.

```objectivec
- (void)acquireTokenWithParameters:(MSQAInteractiveTokenParameters *)
                                   parameters
                   completionBlock:(MSQACompletionBlock)completionBlock;
```

| Parameters | Description | 
| -- | -- |
| parameters | Contains the parameters used to fetch the token |
| completionBlock | The completion block that will be called with the account information if the operation completed [**TODO** this needs to return a token, not account data] and NSError if error happens.
Returns: none
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

3.6.4	- acquireTokenSilentWithParameters:completionBlock
- (void) acquireTokenSilentWithParameters:(MSQASilentTokenParameters *)
                                           parameters
                     completionBlock:(MSQACompletionBlock)completionBlock;
Acquire a token silently for a provided identifier.
Parameters:
parameters - MSQASilentTokenParameters represents the parameters used to fetch the token.
completionBlock  - The completion block that will be called with MSQAAccountData and NSError if error happens.
Returns: none
Here’s an example of snippet in Objective-C:
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
3.7	LOGGING
MSQALogger represents the logger, which adopts the singleton pattern. Using MSQALogger.sharedInstance to access the instance of it.
3.7.1	Set log level
Change the log level by setting the logLevel  property, the default log level is MSQALogLevelInfo.
@property(atomic) MSQALogLevel logLevel;
MSQALogLevel is defined as:
/// Represents the priority of the logging message.
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

3.7.2	Set the callback
The logging messages will be passed through the callback that’s set by
- (void)setLogCallback:(MSQALogCallback)callback; 
The MSQALogCallback is defined as:
typedef void (^MSQALogCallback)(MSQALogLevel level,
                                NSString *_Nullable message);
3.7.3	Enable MSAL logging
As the Quick Auth SDK builds on top of MSAL for iOS, we can enable its logging and receive the messages through the same callback above, meanwhile, it will share the same log level too. The default setting is disabled. Setting the property enableMSALLogging can make this change, and it’s defined as:
@property(atomic) BOOL enableMSALLogging;
