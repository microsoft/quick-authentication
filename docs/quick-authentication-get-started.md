# Get Started Guide for Microsoft QuickAuth


This document uses *Contoso.com* as an example to show a step-by-step process for onboarding the
Microsoft Quick Authentication library.
## Step 1: Register an application on Azure
To use the Quick Authentication library for *Contoso.com*, the first step is to complete the registration of
a single-page application (SPA) on Azure for *Contoso.com*. [Link](https://github.com/microsoft/quick-authentication/blob/main/docs/quick-authentication-how-to.md#register-your-application)

## Step 2: Import QuickAuth JavaScript library
The sign-in/sign-up process on  m* must include importing the Quick Authentication library
from the web page where users start the process. Typically, it is the location where you can find other
“Sign in with” buttons.
Add the following code snippet to the HTML page to load the script asynchronously.

```html
<script async defer
src="https://edge-auth.microsoft.com/js/ms_auth_client.min.js"
></script>
```

## Step 3: Configure the library
After the library is imported, *Contoso.com* needs to configure it. Configuration can be done in either
HTML or Javascript.

### 3.1 Configure using pure HTML
Configure the library by adding the following code snippet.

```html
<div id="ms-auth-initialize"
  data-client_id="YOUR_CLIENT_ID"
  data-callback="contosoAuthenticated”
  data-login_uri="https://www.*Contoso.com*/blank.html">
</div>
```
The `data-client_id` can be found under the Overview section of the registered application in Azure
portal, and *Contoso.com* needs to write a JavaScript callback function: **constosoAuthenticated**, to
receive the authentication event.

```Javascript
function contosoAuthenticated(accountInfo, errorInfo) {
  if (!response) {
  console.log("Error happened: ", errorInfo);
  return;
}
// *Contoso.com* can then use user name and email etc in accountIfo to
// complete the sign in/up process and trust user has successfully
// authenticated against Microsoft Identity service
console.log("User account received: ", accountInfo);
// Use the accountInfo...
};
```

### 3.2 Configure in JavaScript
It’s possible to use JavaScript to configure the library programmatically, window.onload callback is the
preferred place to initialize the library, such as:

```Javascript
window.onload = function () {
  const result = ms.auth.initialize({
  client_id: 'YOUR_CLIENT_ID',
  callback: contosoAuthenticated
  login_uri: 'https://www.*Contoso.com*/blank.html '
});

  if (result.result == 'success') {
  // Proceed.
  } else {
  // Initialization failed.
  console.error('ms.auth.initialize failed: ', result);
  }
};
```

## Step 4: Add the button of Sign in with Microsoft to the web page
After the library is initialized successfully, *Contoso.com* can add the sign-in button into its login page.
```html
<div class="ms-auth-button"></div>
```
After this, users of *Contoso.com* should be able to see one of the two buttons.

  ![Standard sign-in button showing the Sign in with Microsoft text label](./media/large.png)
  
  sign-in button

  ![Enhanced sign-in button showing personalized text label](./media/large-known.png)
  
  sign-in button when account information is available


## Step 5: Integrate One-tap prompt (the enhanced sign-in experience in Microsoft Edge)
To increase sign-up and sign-in rates, *Contoso.com* wants to provide the One-tap prompt, the enhanced
sign-in experience when visiting *Contoso.com* in Microsoft Edge with a signed in Microsoft account
(MSA).
![Enhanced sign-in prompt](./media/signin-prompt.png)

The One-tap prompt is enabled by default after initializing the library. *Contoso.com* can use JavaScript to
control the display of one-tap prompt programmatically.

*Contoso.com* wants to show One-tap prompt only to unsigned in users. *Contoso.com* decides to rely on
users’ session status (implemented as cookies) to control the appearance of One-tap prompt.
*Contoso.com* has static HTML pages in addition to pages generated dynamically.

For dynamically generates web pages, based on session status, if current user is not considered signed
in, including One-tap (with auto-prompt enabled) in the generated web page so that users will be able
to sign into *Contoso.com* smoothly with one click. Otherwise, one-tap prompt HTML should **NOT** be
included in the generated page to avoid showing one-tap prompt for signed-in users.

For static HTML pages (such as a single page application), *Contoso.com* leverages JavaScript API
programmatically to present One-tap prompt only if user is deemed not signed in [Link](https://github.com/microsoft/quick-authentication/blob/main/docs/quick-authentication-reference.md#method-msauthprompt). One-tap auto-
prompt is disabled by resetting auto_prompt [Link](https://github.com/microsoft/quick-authentication/blob/main/docs/quick-authentication-reference.md#data-type-initconfiguration) in this case to prevent showing it repeatedly on each
load. *Contoso.com* uses the code snippet below to show the one-tap prompt programmatically.

```Javascript
//you should only call this if static web page find user is not signed in
ms.auth.prompt('left', function(notification) {
  const reason = notification.reason;
  if (notification.type === 'skipped') {
    if (reason === 'user_cancel') {
      console.log('user cancelled');
  }
  } else if (notification.type === 'dismissed') {
    if (reason === 'credential_returned') {
      console.log('Got sign-in credentials');
    }
  }
});
```
One-tap auto-prompt is disabled for **static** web pages to prevent showing it repeatedly on each load. To
disable the automatic display of one-tap prompt: using JavaScript -
```HTML
// data-auto_prompt=false will disable the one-tap prompt on each load
<div id="ms-auth-initialize"
  data-client_id="YOUR_CLIENT_ID"
  data-callback="contosoAuthenticated”
  data-login_uri=https://www.*Contoso.com*/blank.html
  data-auto_prompt=false>
</div>
```
or HTML
```Javascript
// auto_prompt: false will disable the one-tap prompt on each load
const result = ms.auth.initialize({
  client_id: 'YOUR_CLIENT_ID',
  callback: contosoAuthenticated,
  login_uri: 'https://www.*Contoso.com*/blank.html'
  ,
  auto_prompt: false
})
```

### Reference
- [Sign in Microsoft account users to single-page apps with Microsoft Quick Authentication](https://github.com/microsoft/quick-authentication/blob/main/docs/quick-authentication-how-to.md)
- [Microsoft Quick Authentication configuration and JavaScript API reference](https://github.com/microsoft/quick-authentication/blob/main/docs/quick-authentication-reference.md)
- [Microsoft Quick Authentication API examples](https://quickauth.azurewebsites.net/)