# Microsoft Quick Authentication for Android configuration and Java API reference

These settings and APIs allow you to customize the appearance and behavior of the UI provided by Microsoft Quick Authentication and to invoke functionality provided by MSAL for Android, such as signing out or requesting an access token for user information in the Microsoft Graph.

For information about how to use Quick Authentication for Android, see [Sign-in users with a Microsoft Account to Android apps using Microsoft Quick Authentication](./quick-authentication-android-how-to.md).

> Microsoft Quick Authentication is in public preview. This preview is provided without a service-level agreement and isn't recommended for production workloads. Some features might be unsupported or have constrained capabilities. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/).

## Creating and configuring MSQASignInClient
To create and configure [MSQASignInClient](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/MSQASignInClient.html), construct an instance of  [MSQASignInOptions](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/MSQASignInOptions.html), set the desired options on it, and pass it to the static `create` method of [MSQASignInClient](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/MSQASignInClient.html)..

```
public static void create​(@NonNull android.content.Context context, 
                          @NonNull MSQASignInOptions signInOptions, 
                          @NonNull ClientCreatedListener listener)
```

|Parameter|Description|
| -- | -- |
| context | Application's Context. The sdk requires the application context to be passed in PublicClientApplication. Cannot be null.
| signInOptions | A configuration object for client initialization.
| listener | A [ClientCreatedListener](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/ClientCreatedListener.html) defining callbacks to be invoked when the object is successfully created and when an error occurred. Cannot be null.

The [MSQASignInOptions](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/MSQASignInOptions.html) instance can be created by calling the build method on an instance of [MSQASignInOptions.Builder](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/MSQASignInOptions.Builder.html):
```java
public MSQASignInOptions build()
```
And a set of "setter" methods can be used to set configuration option on [MSQASignInOptions.Builder](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/MSQASignInOptions.Builder.html)

Code example:
```
MSQASignInClient.create(context,
    new MQASignInOptions.Builder()
            .setConfigResourceId(R.raw.auth_config_single_account)
            .build(),
    new ClientCreatedListener() {
        @Override
        public void onCreated(@NonNull MSQASignInClient client) {
            // success: use client
        }

        @Override
        public void onError(@NonNull MSQAException error) {
            // failure: handle error
        }
    });
```

## Logging
To facilitate debugging the following options are available to configure logging, using the following methods of [MSQASignInOptions.Builder](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/MSQASignInOptions.Builder.html). 

```java
public static void setLogLevel(@LogLevel int logLevel);
```
Sets the log level for diagnostic purposes. By default, the sdk sets the logging level to 'verbose'.
| Parameter | Description | 
|--|--|
| logLevel| Log level int enum |

```java
public static void setEnableLogcatLog(boolean enableLogcatLog);
```
Enables or disables Android logcat logging. By default, the sdk disables it.
Parameter | Description |
|--|--|
|enableLogcatLog | If true, enables Android logcat logging.

```java
public static void setExternalLogger(@NonNull ILogger externalLogger);
```
Configures external logging by providing a callback that the sdk will use to pass each log message.
|Parameter | Description|
|--|--|
| externalLogger| The reference to the ILogger that can output the logs to the designated places.

Here is a code example setting all three logging methods described above:
```java
MSQASignInOptions signInOptions = new MSQASignInOptions.Builder()
        .setConfigResourceId(R.raw.auth_config_single_account)
        .setEnableLogcatLog(true)
        .setLogLevel(LogLevel.VERBOSE)
        .setExternalLogger((logLevel, message) -> {
            // get log message here
            ```
        })
        .build();
```

## Sign-in button customization
[MSQASignInButton](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/view/MSQASignInButton.html) provides attributes and APIs to customize the button style. 

### Customizing the buttons type using parameters in the layout xml
You can customize the look and feel of the sign-in button by using the following parameters on the `com.microsoft.quick.auth.signin.view.MSQASignInButton` element in your application's layout xml:


| XML Parameter | Description | Values | Default Value |          
|--|--|--|--|
| msqa_button_type |The button type, either a simple icon or a standard button with text.  |	icon <br> standard | standard |
| msqa_ button_theme | The button visual theme. | light <br> dark |dark |
| msqa_ button_size	| Predefined sizes. If width or height are specified, they override this setting. <br> **large**: width: 280px, height: 42px,textSize: 16px, iconSize: 20px<br> **medium**: width: 280px, height: 36px, textSize: 14px, iconSize: 16px <br> **small**: width: 280px, height: 28px, textSize: 12px, iconSize: 12px	| small <br>medium<br>large | large 
| msqa_button_text | The text shown in the button.	| signin_with<br>signup_with<br>signin<br>continue_with |	signin_with<br> |
| msqa_button_shape	| The shape of the button. | rectangular<br>pill<br>rounded | rectangular |
| msqa_button_logo_alignment| Where the Microsoft logo should be in the button. |	left<br>center | left

Code example:
```xml
<com.microsoft.quick.auth.signin.view.MSQASignInButton
    app:msqa_button_type="standard"
    app:msqa_button_theme="dark"
    app:msqa_button_size="large"
    app:msqa_button_text="signin_with"
    app:msqa_button_shape="rectangular"
    app:msqa_button_logo_alignment="left"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content" />
```

### Customizing the button style programmatically:
You can also customize the button programmatically by using the following setter methods of [MSQASignInButton](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/view/MSQASignInButton.html):
| Setter Method | Description | Parameter Values | Default Value
| -- | -- | -- | -- |
| setButtonType(ButtonType type) | Set the ButtonType | ButtonTyle.ICON <br> ButtonTyle.STANDARD | ButtonTyle.STANDARD |
| setButtonTheme (ButtonTheme theme) | Set the ButtonTheme | ButtonTheme.LIGHT<br> ButtonTheme.DARK | ButtonTheme.DARK
| setButtonSize(ButtonSize size) | Set the ButtonSize. Predefined sizes. If width or height are specified, they override this setting. <br> **ButtonSize.LARGE**: width: 280px, height: 42px, textSize: 16px, iconSize: 20px <br> **ButtonSize.MEDIUM**: width: 280px, height: 36px, textSize: 14px, iconSize: 16px <br> **ButtonSize.SMALL**: width: 280px, height: 28px, textSize: 12px, iconSize: 12px | ButtonSize.SMALL<br> ButtonSize.MEDIUM <br> ButtonSize.LARGE	| ButtonSize.LARGE** |
| setButtonText(ButtonText text) | Set the ButtonText | ButtonText.SIGNIN_WITH<br> ButtonText.SIGNUP_WITH<br> ButtonText.SIGNIN<br>ButtonText.CONTINUE_WITH<br> | ButtonText.SIGNIN_WITH |
| setButtonShape(ButtonShape shape) | Set the ButtonShape | ButtonShape.RECTANGULAR <br> ButtonShape.PILL <br> ButtonShape.ROUNDED |ButtonShape.RECTANGULAR |
| setButtonLogoAlignment(ButtonLogoAlignment alignment) | Where the Microsoft logo should be in the button |	ButtonLogoAlignment.LEFT <br> ButtonLogoAlignment.CENTER |ButtonLogoAlignment.LEFT |

Code example:  
```java
MSQASignInButton signInButton = findViewById(R.id.sign_in_button);/>

signInButton.setButtonTheme(ButtonTheme.DARK)
        .setButtonLogoAlignment(ButtonLogoAlignment.LEFT)
        .setButtonShape(ButtonShape.RECTANGULAR)
        .setButtonSize(ButtonSize.LARGE)
        .setButtonText(ButtonText.SIGN_IN_WITH)
        .setButtonType(ButtonType.STANDARD);
```

## Setting the sign-in button callback
This method of [MSQASignInButton](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/view/MSQASignInButton.html) allows you to set a callback in your code to be invoked when the user is done with the sign-in flow.
```
public void setSignInCallback (
        @NonNull Activity activity,
        @NonNull MSQASignInClient client,
        @NonNull OnCompleteListener <AccountInfo> onCompleteListener);
```

| Parameter | Description |
|--|--|
| @NonNull  activity | Activity that is used as the parent activity for launching sign page. |
| @NoNull client | A sign-in client object, provides sign-in, sign-out etc. |
| @NoNull listener |  An [OnCompleteListener](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/callback/OnCompleteListener.html) callback to be invoked when sign-in completed, canceled or failed. |
| Returns | none |

If sign-in succeeds, `listener` will be invoked, its first parameter will return the [AccountInfo](#accountinfo) and its `error` parameter will be null. If sign-in fails, `listener` will be invoked with the `accountInfo` parameter being null and `error` will contain the error information.

Code example:  
```java
MSQASignInButton signInButton = findViewById(R.id.sign_in_button);/>

signInButton.setSignInCallback(activity, client,
        new OnCompleteListener<AccountInfo>() {
            @Override
            public void onComplete(@Nullable AccountInfo accountInfo,
                                   @Nullable MSQAException error) {
                if (accountInfo != null) {
                    // success: use account
                } else {
                    // failure: handle error
                }
            }
        });
```

## AccountInfo
`AccountInfo` defines an interface for getting user account information.

| Method | Description |
| -- | -- |
| @Nullable String getFullName() | return full name |
| @Nullable String getUsername() |  return user email or phone.
| @Nullable String getId() | CID for MSA.| 
| @Nullable String getIdToken() | MSA account id token. |
| @Nullable String getBase64Photo() | User jpeg / png, etc. as base64 encoded string. |
| @Nullable String getGivenName() | User given name. |
| @Nullable String getSurname() | User surname. |
| @Nullable String getEmail() | User email. |

## MSQASignInClient methods
The following methods of [MSQASignInClient](hhttps://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/MSQASignInClient.html) offer programatic triggering of the sign-in flow and additional functionality.

| Method | Description |
|--|--|
| signIn() | Starts the process of signing in the user with MSA. |
| signOut() | Signs the user out of this application. |
| getCurrentAccount() | Gets the current [AccountInfo](#AccountInfo) for the user. |
| acquireTokenSilent() | Perform acquire token silent call. |
| acquireToken() | Acquires an access token interactively, will pop-up web UI. |
| create() | Static method to create an [MSQASignInClient](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/MSQASignInClient.html) instance object. |

## MSQASignInClient method: signIn
This method allows to request sign-in programatically instead of or in addition to having the button do it automatically. This will trigger the same user experience workflow as the user clikcing the sign-in button.

```java
void signIn(@NonNull Activity activity
            @NonNull OnCompleteListener<AccountInfo> listener);
```
| Parameter | Description | 
| -- | -- |
| activity | The activity that will be used as the parent activity of the sign in activity. |
| @NonNull listener | An [OnCompleteListner](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/callback/OnCompleteListener.html) callback to be invoked when sign in finishes, is cancelled or fails. It will return the [AccountInfo](#accountinfo) if successful. If it fails, its `accountInfo` parameter will be null and `error` will contain error info.|
| Returns | none |

[**TODO** check with Jingjing on exact behavior]
If multiple sign-in requests are made at the same time, the sign-in page will pop up, when this sign-in finished another sign-in request page pops up.

Code example:  
```java
mSignInClient.signIn(activity, new OnCompleteListener<AccountInfo>() {
    @Override
    public void onComplete(@Nullable AccountInfo accountInfo,
                           @Nullable MSQAException error) {
        if (accountInfo != null) {
            // success: use account
        } else {
            // failure: handle the error
        }
    }
});
```

## MSQASignInClient method: signOut
This method request to sign the user out.

```java
void signOut(@NonNull OnCompleteListener<Boolean> listener);
```

| Parameters | Description |  
| -- | -- |
| @NonNull listener | A callback to be invoked when sign out finishes and returns sign-out result. |
| Returns | none |

If there is no currently existing sign-in, OnCompleteListener is invoked with its second (`error`) parameter returning an error. If sign-out succeeds, the first parameter will return true, and the second parameter will be null.

Code example:
```java
signInClient.signOut(new OnCompleteListener<Boolean>() {
    @Override
    public void onComplete(@Nullable Boolean signOutSuccess,
                           @Nullable MSQAException error) {
        if (signOutSuccess) {
            // sign out success
        } else {
            // handle error
        }
    }
});
```

## MSQASignInClient method: getCurrentAccount
This method returns the account the user is currently signed-in with, if any.

```java
void getCurrentAccount (@NonNull OnCompleteListener <AccountInfo> listener);
```

| Parameter | Description |
| -- | -- |
| @NonNull listener | An [OnCompleteListner](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/callback/OnCompleteListener.html) callback to be invoked on completion and will return the [AccountInfo](#AccountInfo) for the current account if one is retrieved. |
| Returns | none | 

If there is no current sign-in, [OnCompleteListener](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/callback/OnCompleteListener.html) will be invoked with its first and second parameters both null. If sign-out succeeds, the first parameter will return the [AccountInfo](#AccountInfo) for the current account. The second parameter will return null.

Code example:
```java
signInClient.getCurrentAccount(activity,
        new OnCompleteListener<AccountInfo>() {
            @Override
            public void onComplete(@Nullable AccountInfo accountInfo,
                                   @Nullable MSQAException error) {
                if (accountInfo != null) {
                    // use account
                } else {
                    // handle error
                }
            }
        });
```
## MSQASignInClient method: acquireToken
This method acquires an access token interactively. A UI flow will be presented to the user to consent to the request.

```java
void acquireToken (
        @NonNull Activity activity,
        @NonNull List<String> scopes,
        @NonNull OnCompleteListener<TokenResult> listener);
```
| Parameter | Description |
| -- | -- |  
| @NonNull activity | Activity that is used as the parent activity for get token. |
| @NonNull scopes | A non-null array of scopes to be requested for the access token. Some example scopes can be found in Microsoft Graph permissions reference - Microsoft Graph. |
| @NonNull listener | A [OnCompleteListener](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/callback/OnCompleteListener.html) callback to be invoked when the the token has been successfully acquired or after an error occurred. |
| Returns | none |

If the `scopes` array is empty, then `listener` will be called with a non-null error.
If there is no account in the cache, then `listener` will be called with non-null error.
If acquiring the token succeeds, [OnCompleteListener](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/callback/OnCompleteListener.html) will be invoked with its first parameter returning a [TokenResult](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/TokenResult.html), and its second parameter returning null.

See next section for a code example.

## MSQASignInClient method: acquireTokenSilent
This method attempts to acquire an access token silently, i.e., without presenting any consent UI to the user. If it fails, then acquireToken can be invoked to acquire the token with prompting the user for consent.

```
void acquireTokenSilent (
                @NonNull List <String> scopes,
                @NonNull OnCompleteListener <TokenResult> listener);
```

| Parameter | Description | 
| -- | -- |
| @NonNull scopes | A non-null and non-empty array of scopes to be requested for the access TokenResult. |
| @NonNull listener | A [OnCompleteListener](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/callback/OnCompleteListener.html) callback to be invoked when the the token has been successfully acquired or after an error occurred.
| Returns | none |

If the `scopes` array is empty, then `listener` will be called with a non-null error. 
If there is no account in the cache, then `listener` will be called with a non-null error.
If acquiring the token succeeds, [OnCompleteListener](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/callback/OnCompleteListener.html) will be invoked with its first parameter returning a [TokenResult](https://microsoft.github.io/quick-authentication/docs/android/javadocs/com/microsoft/quickauth/signin/TokenResult.html), and its second parameter returning null.
If a refresh token does not exist or fails the refresh, then an error is returned.

Code example:
```java
List<String> scopes = new ArrayList<>();
scopes.add(“Mail.Read”);
OnCompleteListener<TokenResult> tokenResultListener = new OnCompleteListener<TokenResult>() {
    @Override
    public void onComplete(@Nullable TokenResult token,
                           @Nullable MSQAException error) {
        if (token != null) {
            // success: use token
        } else {
            // failure: handle error
        }
    }
};
mSignInClient.acquireTokenSilent(scopes,
        new OnCompleteListener<TokenResult>() {
            @Override
            public void onComplete(@Nullable TokenResult token,
                                   @Nullable MSQAException error) {
                if (token != null) {
                    // success: use token
                } else if (error instanceof MSQAUiRequiredException) {
                    // If acquireTokenSilent() returns an 
                    // MSQAUiRequiredException,invoke acquireToken()
                    // to have the user resolve the interrupt interactively

                    mSignInClient.acquireToken(
                        	    activity, scopes, tokenResultListener);
                } else {
                    // failure: handle error
                }
            }
        });
```
