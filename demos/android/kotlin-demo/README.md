# How to run this sample

To run this sample, you'll need:
- Android SDK
- An internet connection
- An Azure Active Directory (Azure AD) tenant. For more information on how to get an Azure AD tenant, see [How to get an Azure AD tenant](https://docs.microsoft.com/zh-cn/azure/active-directory/develop/quickstart-create-new-tenant)
- One or more user accounts in your Azure AD tenant.

## Steps to run the app
### Step 1: Clone the code
> https://github.com/microsoft/quick-authentication.git

The following steps are for Android Studio. But you can choose and work with any editor of your choice.
Open Android Studio, and select open an existing Android Studio project. Find the cloned project and open the sample file in demos/android/kotlin-demo folder.

### Step 2: Run the sample
From menu, select Run > Run 'app'. Once the app launches.

# How to integrate into your projects
1. Add to your app's build.gradle:
```deps
dependencies {
    implementation "com.microsoft:quickauth:0.3.0"
}
```
2. Please also add the following lines to your repositories section in your build.gradle:
```repositorys
maven {
    url 'https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1'
}
mavenCentral()
```
4. Create your MSAL configuration file 
The configuration file is a JSON file which can be saved from the portal website, more configuration information please refer to  [configuration file documentation](https://docs.microsoft.com/zh-cn/azure/active-directory/develop/msal-configuration).

Create this JSON file as a "raw" resource file in your project resources. You'll be able to refer to this using the generated resource identifier when initializing.
Below the redirect URI please paste:
```single
"account_mode" : "SINGLE", 
```
Your config file should resemble this example:
```config
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