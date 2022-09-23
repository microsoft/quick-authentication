# Sign-in users with a Microsoft Account to Android apps using Microsoft Quick Authentication


On Anrdoid, Microsoft Quick Authentication offers a library that makes it easier to add **Sign in with Microsoft** support to native apps. Quick Authentication uses the  Microsoft Authentication Library for JavaScript (MSAL for Android) to handle authentication and authorization for users with personal Microsoft accounts from Outlook, OneDrive, Xbox Live, and Microsoft 365.

> Microsoft Quick Authentication is in public preview. This preview is provided without a service-level agreement and isn't recommended for production workloads. Some features might be unsupported or have constrained capabilities. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/).

## How it works
[**TODO**]

## API summary

[**TODO**] consider moving somewhere else

We expose the following APIs of [MSQASignInClient](https://stunning-meme-25a77e8c.pages.github.io/com/microsoft/quickauth/signin/MSQASignInClient.html)  that offered to the developers. Refer to 
- signIn() - Starts the process of signing in the user with MSA.
- signOut() - Signs the user out of this mobile.
- getCurrentAccount() - gets the current account info for the user. It will return [AccountInfo]().
- acquireTokenSilent() - Perform acquire token silent call.
- acquireToken() - Perform acquire token interactively, will pop-up web UI.
- create() - Create [MSQASignInClient](https://stunning-meme-25a77e8c.pages.github.io/com/microsoft/quickauth/signin/MSQASignInClient.html) instance object.
- setLogLevel() - Set the log level for diagnostic purpose.
- setEnableLogcatLog() - Set whether to allow android logcat logging, by default, the sdk disables it.
setExternalLogger() - Set the custom logger.

## Registering your application
If you have already registered an application for a single-page application, you can reuse the same application registration. To find that registration go to [Microsoft | App registrations](https://ms.portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps) and select your existing application registration on the list. This will open a page describing your application registration.

 If you have not yet registered an application or wish to use a new registration, complete the steps in [Register an application with the Microsoft identity platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) to register your application.

Now that you have already created a application registration, you extend it to Android as follow. On the Azure page describing your app registration:
1. Click on the "Authentication" tab on the left of that page
3. Click on "Add Platform"
4. Select "Android"
5. Enter the package name. Your app's Package Name can be found in the Android Manifest.
6. Using the command line indicated under the "Signature hash" section, generate a signature hash
7. Click "Configure"

**TODO:** [Screen shot]

## Declaring a dependency on Quick Authentication
Add the following to your app's `build.gradle`
```
dependencies {
    implementation 'com.microsoft.quickauth:signin:1.0.0'
}
```
And add the following to the *repositories* section in your `build.gradle`
```
mavenCentral()
maven { 
    url 'https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1'
}
```
## Creating a configuration file 
The configuration file is necessary to initialize the Quick Authentication SDK and underlying MSAL library. Details on this file can be found here: [MSAL Configuration](https://docs.microsoft.com/azure/active-directory/develop/msal-configuration)

It is a JSON file which can be obtained from the Azure Portal. Go to [Microsoft | App registrations](https://ms.portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps) and select your existing application registration on the list. This opens the page for your application registration. Click on *"Authentication"* on the left bar".

 ![msal configuration page](./media/msal-configuration.png)


In the Authentication page, click the View button on the row of your redirect URL to open this page:

 ![Android configuration page](./media/android-configuration.png)

Copy the MSAL Configuration JSON script and make the following edits:

- Enter the redirect URI. You can get your app's redirect URI from the Azure Application registration page. For more information on common redirect uri issues please refer to [this FAQ](https://github.com/AzureAD/microsoft-authentication-library-for-android/wiki/MSAL-FAQ#redirect-uri-issues).

 - Below the redirect URI please paste:
 ```
 "account_mode" : "SINGLE",
 ```

Your configuration JSON script should resemble this example:
```
{
  "client_id": "<YOUR_CLIENT_ID>",
  "authorization_user_agent": "DEFAULT",
  "redirect_uri": "msauth://<YOUR_PACKAGE_NAME>/<YOUR_BASE64_URL_ENCODED_PACKAGE_SIGNATURE>",
  "account_mode": "SINGLE",
  "broker_redirect_uri_registered": true,
  "authorities": [
    {
      "type": "AAD",
      "audience": {
        "type": "PersonalMicrosoftAccount",
        "tenant_id": "consumers"
      }
    }
  ]
}
```

Then, save this JSON as a "raw" resource file in your project resources. You will be able to refer to this using the generated resource identifier. You will need it to initialize [MSQASignInClient](https://stunning-meme-25a77e8c.pages.github.io/com/microsoft/quickauth/signin/MSQASignInClient.html)

## Configuring an intent filter
Next, configure an intent filder in the Android Manifest for your application, using the same redirect URI you used in the Configuration JSON script:
```
<activity android:name="com.microsoft.identity.client.BrowserTabActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:host="<YOUR_PACKAGE_NAME>"
            android:path="/<YOUR_BASE64_ENCODED_PACKAGE_SIGNATURE>"
            android:scheme="msauth" />
    </intent-filter>
</activity>
```
## Creating MSQASignInClient

`MSQASignInClient` is the main object in the Quick Authentication SDK. It gives you access to all functionality. To create it, you must first create a instance of `MSQASignInOptions`, which holds the specific options you want to use for `MSQASignInClient`. The options are described below and set by "setter" methods that can chained in the manner showed in the example below:
```
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

| Option setter | Description |
|---|---|
| setConfigResourceId(int configResourceId) |	The resource id is the configuration file which you have created in section [Create a configuration file](). |
| setEnableLogcatLog(boolean enableLogcatLog)	| True: enable the Android logcat logging. <br>False: disable the Android logcat logging. |
| setExternalLogger(@NonNull  ILogger externalLogger)	| Configures external logging to configure a callback that the sdk will use to pass each log message. |
setLogLevel(@LogLevel int logLevel) | Sets the log level for diagnostic purpose. By default, the sdk enables the verbose level logging. |
|build() |	Returns an newly created instance of MSQASignInOptions |


Then to create `MSQASignClient`, use its static `Create` method:
```
public static void create(@NonNull Context context,
                          @NonNull MQASignInOptions options,
                          @NonNull ClientCreatedListener listener);
```
| Parameters | Description
|---|---|
| @NonNull context | Application's context. Cannot be null. [TODO] more details.
| @NonNull signInOptions | The option object you created above.
| @NonNull listener | `ClientCreatedListener` is a callback to be invoked when the client object is successfully created. Cannot be null.
| Returned value | none

Note that if the "raw" resource file does not exist, listener’s onError will get called.
If the creation completes successfully, `listener.onCreated` will get called and return the newly created instance of `MSQASignInClient`.

Here is an example of calling the `create` method:
```
MSQASignInClient.create(context,
        new MQASignInOptions.Builder()
                .setConfigResourceId(R.raw.auth_config_single_account)
                .setEnableLogcatLog(true)
                .setLogLevel(LogLevel.VERBOSE)
                .setExternalLogger((logLevel, message) -> {
                    // get log message in this
                })
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
## Configuring logging
**[TODO]** consider moving to reference

To facilitate debugging you have the following options to configure logging using the following methods of `MSQASignInClient`

### Method: setLogLevel
```
public static void setLogLevel(@LogLevel int logLevel);
```
Sets the log level for diagnostic purpose. By default, the sdk sets the logging level to 'verbose'.
| Parameters | Description | 
|--|--|
| logLevel| Log level int enum |

Code example:
```
MSQASignInClient.setLogLevel(LogLevel.VERBOSE);
```
### Method: setEnableLogcatLog
```
public static void setEnableLogcatLog(boolean enableLogcatLog);
```
Enables or disables Android logcat logging. By default, the sdk disables it.
Parameters | Description |
|--|--|
|enableLogcatLog | If true, enables Android logcat logging.

Code example:  
```
MSQASignInClient.setEnableLogcatLog(true);
```
### Method: setExternalLogger
Configures external logging by providing a callback that the sdk will use to pass each log message.
```
public static void setExternalLogger(@NonNull ILogger externalLogger);
```
|Parameters| Description|
|--|--|
| externalLogger| The reference to the ILogger that can output the logs to the designated places.

Code example:  
```
MSQASignInClient.setExternalLogger(new ILogger() {
    @Override
    public void log(@NonNull int logLevel, @Nullable String message) {
	  // handle log message
    }
});
```

## Using a Sign-in Button
The easiest way to implement the sign-in flow with Quick Authentication is to use a pre-build Sign-in Button. Simply insert the following in your application's layout xml in the desired place: 

```
<com.microsoft.quick.auth.signin.view.MSQASignInButton
  android:id="@+id/sign_in_button"
```
This will create a fully functional button looking like this:

![Large Sign-in button](./media/large.png)

The look and feel of this button can be modified in a variety of ways by either specifying attributes in the xml above or programmatically. Look at the [reference documentation](./quick-authentication-android-reference.md) for a more detailed description.

To programmatically set specific attributes on the button or to set the callback to be called when sign-in completes (see next section), you will need to retrieve the `MSQASignInButton` view object. The easiest is to assign an id to your button in the layout xml and find its view by id as follows:

```
MSQASignInButton signInButton = findViewById(R.id.sign_in_button);/>
```

## Handling the authentication events
As described above, the Sign-in Button is functional and clicking it will run the sign-in user experience. However, in your application you need a way to know that sign-in completed successfully and to retreive properties of the account, such as username, email address, full name, and photo. The following method of [MSQASignInButton](https://stunning-meme-25a77e8c.pages.github.io/com/microsoft/quickauth/signin/view/MSQASignInButton.html) allows to set that callback:

```
public void setSignInCallback (
        @NonNull Activity activity,
        @NonNull MSQASignInClient client,
        @NonNull OnCompleteListener <AccountInfo> onCompleteListener);
```
| Parameters | Description |
|--|--|
| @NonNull  activity | Activity that is used as the parent activity for launching sign page.
| @NoNull client | A sign-in client object, provides sign-in, sign-out etc.
| @NoNull listener |  A callback to be invoked when sign-in completed, canceled or failed.
| Returns | none

If sign-in succeeds, `listener` will be invoked, and first parameter will return the account info and the `error` parameter will be null. If it fails, `accountInfo` will be null and `error` will contain the error.

Code example:
```
signInButton.setSignInCallback(activity, client,
        new OnCompleteListener<AccountInfo>() {
            @Override
            public void onComplete(@Nullable AccountInfo accountInfo,
                                   @Nullable MSQAException error) {
                if (accountInfo != null) {
                    // successful sign-in: use account
                } else {
                    // unsuccessful sign-in: handle error
                }
            }
        });
```
The returned `AccountInfo` interface, returned by the listener, provides the following methods for getting at the returned user account information:

| Method | Description
|--|--|
| @Nullable String getFullName() | full name |
| @Nullable String getUsername() | user email or phone |
| @Nullable String getId() | Unique account/user id |
| @Nullable String getIdToken() | [ID token](https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens) received during sign-in process|
| @Nullable String getBase64Photo() | User account picture (jpeg, png, etc.) as a base64 encoded string.


## Signing out
You can request to sign the user out using the following mehtod of MSQASignInClient

```
void signOut(@NonNull OnCompleteListener<Boolean> listener);
```

| Parameters | Description |
|--|--|
| @NonNull listener | A callback to be invoked when sign out finishes and will return sign-out result.|
| Returns | none |

If sign-out succeeds, `listener` will be invoked and the first parameter will return true, the second parameter will return null. If it fails, the first parameter will be false and `error` will contain the error.

Code example:
```
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