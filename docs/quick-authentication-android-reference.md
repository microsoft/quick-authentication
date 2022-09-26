# Microsoft Quick Authentication for Android configuration and Java API reference

These settings and APIs allow you to customize the appearance and behavior of the UI provided by Microsoft Quick Authentication and to invoke functionality provided by MSAL for Android, such as signing out or requesting access token for user information in the Microsoft Graph.

For information about how to use Quick Authentication for Android, see [Sign-in users with a Microsoft Account to Android apps using Microsoft Quick Authentication](./quick-authentication-android-how-to.md).

> Microsoft Quick Authentication is in public preview. This preview is provided without a service-level agreement and isn't recommended for production workloads. Some features might be unsupported or have constrained capabilities. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/).

## Creating and configuring MSQASignInClient
To create and configure [MSQASignInClient](https://stunning-meme-25a77e8c.pages.github.io/com/microsoft/quickauth/signin/MSQASignInClient.html), pass an instance of  [MSQASignInOptions](https://stunning-meme-25a77e8c.pages.github.io/com/microsoft/quickauth/signin/MSQASignInOptions.html) to the static `create` method. This function will read the configurations from MSQASignInOptions to create the MSQASignInClient.

```
public static void create​(@NonNull android.content.Context context, @NonNull MSQASignInOptions signInOptions, @NonNull ClientCreatedListener listener)
```

|Parameter|Description|
|--|--|
context | The sdk requires the application context to be passed in MSQASignInClient. Cannot be null. [**TODO** expand on context]
signInOptions | A configuration object for client initialization.
listener | A callback to be invoked when the object is successfully created. Cannot be null.

The [MSQASignInOptions](https://stunning-meme-25a77e8c.pages.github.io/com/microsoft/quickauth/signin/MSQASignInOptions.html) instance can be created by calling the build method on an instance of [MSQASignInOptions.Builder](https://stunning-meme-25a77e8c.pages.github.io/com/microsoft/quickauth/signin/MSQASignInOptions.Builder.html):
```java
public MSQASignInOptions build()
```
And a set of "setter" methods can be used to set configuration option on [MSQASignInOptions.Builder](https://stunning-meme-25a77e8c.pages.github.io/com/microsoft/quickauth/signin/MSQASignInOptions.Builder.html)

Code example:
```
        MSQASignInClient.create(context,
        new MQASignInOptions.Builder()
                .setConfigResourceId(R.raw.auth_config_single_account)
                .build(),
        new ClientCreatedListener() {
            @Override
            public void onCreated(@NonNull MSQASignInClient client) {
                // use client
            }
 
            @Override
            public void onError(@NonNull MSQAException error) {
                // handle error
            }
        });
```

## Logging
To facilitate debugging you have the following options to configure logging using the following methods of [MSQASignInOptions.Builder](https://stunning-meme-25a77e8c.pages.github.io/com/microsoft/quickauth/signin/MSQASignInOptions.Builder.html). 

### Method: setLogLevel
```java
public static void setLogLevel(@LogLevel int logLevel);
```
Sets the log level for diagnostic purpose. By default, the sdk sets the logging level to 'verbose'.
| Parameter | Description | 
|--|--|
| logLevel| Log level int enum |

### Method: setEnableLogcatLog
```java
public static void setEnableLogcatLog(boolean enableLogcatLog);
```
Enables or disables Android logcat logging. By default, the sdk disables it.
Parameter | Description |
|--|--|
|enableLogcatLog | If true, enables Android logcat logging.

### Method: setExternalLogger
Configures external logging by providing a callback that the sdk will use to pass each log message.
```java
public static void setExternalLogger(@NonNull ILogger externalLogger);
```
|Parameter | Description|
|--|--|
| externalLogger| The reference to the ILogger that can output the logs to the designated places.

Code example:  
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
[**TODO**] consider moving somewhere else



## Sign-in button customization
`MSQASignInButton` provides attributes and APIs to customize the button style. 

### Customizing the button stype using parameters in the layout xml
To customize the style in your application's layout xml, use the following parameters on the `com.microsoft.quick.auth.signin.view.MSQASignInButton` element


| XML Parameter | Description | Values | Default Value |          
|--|--|--|--|
| msqa_button_type |The button type |	icon <br> standard | standard |
| msqa_ button_theme | The button visual theme | light <br> dark |dark |
| msqa_ button_size	| Predefined sizes. If width or height are specified, they override this setting. <br> large: width: 280px, height: 42px,textSize: 16px, iconSize: 20px<br> medium: width: 280px, height: 36px, textSize: 14px, iconSize: 16px <br> small: width: 280px, height: 28px, textSize: 12px, iconSize: 12px	| small <br>medium<br>large | large 
| msqa_button_text | The button shown text.	| signin_with<br>signup_with<br>signin<br>continue_with |	signin_with<br> |
| msqa_button_shape	| Shape of button corners. | rectangular<br>pill<br>rounded | rectangular |
| msqa_button_logo_alignment| Where the Microsoft logo should be in the button |	left<br>center | left

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
| Method | Description | Parameter Values | Default Value
| -- | -- | -- | -- |
| setButtonType(ButtonType type) | Set the ButtonType | ButtonTyle.ICON <br> ButtonTyle.STANDARD | ButtonTyle.STANDARD |
| setButtonTheme (ButtonTheme theme) | Set the ButtonTheme | ButtonTheme.LIGHT<br> ButtonTheme.DARK | ButtonTheme.DARK
| setButtonSize(ButtonSize size) | Set the ButtonSize. Predefined sizes. If width or height are specified, they override this setting. <br> ButtonSize.LARGE: width: 280px, height: 42px, textSize: 16px, iconSize: 20px <br> ButtonSize.MEDIUM: width: 280px, height: 36px, textSize: 14px, iconSize: 16px <br> ButtonSize.SMALL: width: 280px, height: 28px, textSize: 12px, iconSize: 12px	|ButtonSize.SMALL<br> ButtonSize.MEDIUM <br> ButtonSize.LARGE	| ButtonSize.LARGE |
| setButtonText(ButtonText text) | Set the ButtonText | ButtonText.SIGNIN_WITH<br> ButtonText.SIGNUP_WITH<br> ButtonText.SIGNIN<br>ButtonText.CONTINUE_WITH<br> | ButtonText.SIGNIN_WITH |
| setButtonShape(ButtonShape shape) | Set the ButtonShape | ButtonShape.RECTANGULAR <br> ButtonShape.PILL <br> ButtonShape.ROUNDED |ButtonShape.RECTANGULAR |
| setButtonLogoAlignment(ButtonLogoAlignment alignment) | Where the Microsoft logo should be in the button |	ButtonLogoAlignment.LEFT <br> ButtonLogoAlignment.CENTER |ButtonLogoAlignment.LEFT |

Code example:  
```java
signInButton.setButtonTheme(ButtonTheme.DARK)
        .setButtonLogoAlignment(ButtonLogoAlignment.LEFT)
        .setButtonShape(ButtonShape.RECTANGULAR)
        .setButtonSize(ButtonSize.LARGE)
        .setButtonText(ButtonText.SIGN_IN_WITH)
        .setButtonType(ButtonType.STANDARD);
```

## Setting the sign-in button callback
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
| @NoNull listener |  A callback to be invoked when sign-in completed, canceled or failed. |
| Returns | none |

If sign-in success, listener will be invoked, and first parameter will return account info and error parameter will be null. If is failed, listener will be invoked, accountInfo will be null and error will contain error information.

Code example:  
```java
signInButton.setSignInCallback(activity, client,
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

## AccountInfo
AccountInfo provides APIS for getting user account information, this is an interface, specific api's are this:

| Method | Description |
| -- | -- |
| @Nullable String getFullName() | return full name |
| @Nullable String getUsername() |  return user email or phone.
| @Nullable String getId() | CID for MSA.| 
| @Nullable String getIdToken() | MSA account id token. |
| @Nullable String getBase64Photo() | User jpeg / png, etc. as base64 encoded string. |
| [**TODO** sync with web]

## MSQASignInClient methods
We expose the following APIs of [MSQASignInClient](https://stunning-meme-25a77e8c.pages.github.io/com/microsoft/quickauth/signin/MSQASignInClient.html)  that offered to the developers. Refer to 
| Method | Description |
|--|--|
| signIn() | Starts the process of signing in the user with MSA. |
| signOut() | Signs the user out of this mobile. |
| getCurrentAccount() | gets the current account info for the user. It will return [AccountInfo](). |
| acquireTokenSilent() | Perform acquire token silent call. |
| acquireToken() | Perform acquire token interactively, will pop-up web UI. |
| create() | Static method to create an [MSQASignInClient](https://stunning-meme-25a77e8c.pages.github.io/com/microsoft/quickauth/signin/MSQASignInClient.html) instance object. |

## MSQASignInClient method: signIn
Using the MSQASignInClient you have created and configured, you can request sign in programatically. This will trigger the same user experience workflow as the user clikcing the sign-in button.
```java
void signIn(@NonNull Activity activity
            @NonNull OnCompleteListener<AccountInfo> listener);
```
| Parameter | Description | 
| -- | -- |
| activity | Activity that is used as the parent activity of the sign in activity. |
| @NonNull listener | A callback to be invoked when sign in finishes, is cancelled or fails. It will return sign-in account info if successful. It is fails, its `accountInfo` parameter will be null and `error` will contain error info.|
| Returns | none |

If multiple sign-in requests are sent at the same time, the sign-in page will pop up, when this sign-in finished another sign-in request page pops up.

Code example:  
```java
mSignInClient.signIn(activity, new OnCompleteListener<AccountInfo>() {
    @Override
    public void onComplete(@Nullable AccountInfo accountInfo,
                           @Nullable MSQAException error) {
        if (accountInfo != null) {
            // Use account
        } else {
            // Handle the error
        }
    }
});
```

## MSQASignInClient method: signOut
Using the MSQASignInClient you have configured, you can request sign out.
```java
void signOut(@NonNull OnCompleteListener<Boolean> listener);
```

| Parameters | Description |  
| -- | -- |
| @NonNull listener | A callback to be invoked when sign out finishes and will return sign-out result. |
| Returns | none |

If there is no currently existing sign-in, OnCompleteListener is invoked with the second parameter returning an error. If sign-out succeeds, the first parameter will return true, and the second parameter will be null.

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

Using the MSQASignInClient you have configured, you can request the current signed-in account.

```java
void getCurrentAccount (
                @NonNull Activity activity,
                @NonNull OnCompleteListener <AccountInfo> listener);
```

| Parameter | Description |
| -- | -- |
| @NonNull activity | Activity that is used as the parent activity for get sign account |
| @NonNull listener | A callback to be invoked when complete and will return sign in account info if success. |
| Returns | none | 

If there is no sign-in currently existing, OnCompleteListener will be invoked and first and second parameters both return null.
If sign-out success, OnCompleteListener will be invoked and first parameter will return account info, second parameter will return null.

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

Use the MSQASignInClient you have configured, you can get account token interactively, will pop-up webUI.
```java
void acquireToken (
        @NonNull Activity activity,
        @NonNull List<String> scopes,
        @NonNull OnCompleteListener<TokenResult> listener);
```
| Parameter | Description |
| -- | -- |  
| @NonNull activity | Activity that is used as the parent activity for get token. |
| @NonNull scopes | The non-null array of scopes to be requested for the access token. Some example scopes can be found in Microsoft Graph permissions reference - Microsoft Graph. |
| @NonNull listener | A callback to be invoked when token get finished. |
| Returns | none |

If scopes array is empty, then listener will be called with non-null error.
If there is no account in cache, then listener will be called with non-null error.
If get token succeeds, OnCompleteListener will be invoked and first parameter will return TokenResult, second parameter will return null.

Code example:
```java
List<String> scopes = new ArrayList<>();
scopes.add(“Mail.Read”);
OnCompleteListener<TokenResult> tokenResultListener = new OnCompleteListener<TokenResult>() {
    @Override
    public void onComplete(@Nullable TokenResult token,
                           @Nullable MSQAException error) {
        if (token != null) {
            // use token
        } else {
            // handle error
        }
    }
};
mSignInClient.acquireTokenSilent(scopes,
        new OnCompleteListener<TokenResult>() {
            @Override
            public void onComplete(@Nullable TokenResult token,
                                   @Nullable MSQAException error) {
                if (token != null) {
                    // use token
                } else if (error instanceof MSQAUiRequiredException) {
                    // If acquireTokenSilent() returns an 
                    // MSQAUiRequiredException,invoke acquireToken()
                    // to have the user resolve the interrupt interactively

                    mSignInClient.acquireToken(
                        	    activity, scopes, tokenResultListener);
                } else {
                    // handle error
                }
            }
        });
```

## MSQASignInClient method: acquireTokenSilent
Use the MSQASignInClient you have configured, you can get TokenResult info silently.
void acquireTokenSilent (
                @NonNull List <String> scopes,
                @NonNull OnCompleteListener <TokenResult> listener);

| arameter | Description | 
| -- | -- |
| @NonNull scopes | The non-null and non-empty array of scopes to be requested for the access TokenResult. |
| @NonNull listener | A callback to be invoked when token get finished.|
| Returns | none |

This is a wrapper on the MSAL function, and it will behave exactly as the MSAL.
If scopes array is empty, then listener will be called with non-null error. 
If there is no account in cache, then listener will be called with non-null error.
If refresh token does not exist or it fails the refresh, then return error.

Code example:
```java
List<String> scopes = new ArrayList<>();
scopes.add(“Mail.Read”);
client.acquireTokenSilent(scopes, new OnCompleteListener<TokenResult>() {
    @Override
    public void onComplete(@Nullable TokenResult token,
                           @Nullable MSQAException error) {
        if (token != null) {
            // use token
        } else {
            // handle error
        }
    }
});
```
