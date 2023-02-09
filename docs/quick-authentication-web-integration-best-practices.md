# Best practices for integrating quick authentication on web

### Using prompt

Use [ms.auth.prompt](./quick-authentication-reference.md#method-msauthprompt) instead of [auto_prompt](./quick-authentication-reference.md#data-type-initconfiguration) option.

This is because [ms.auth.prompt](./quick-authentication-reference.md#method-msauthprompt) can be configured with [PromptMomentNotification](./quick-authentication-reference.md#data-type-promptmomentnotification) callback.

This allows developer to understand the result of calling the API. Some examples below:
* If prompt was shown, the callback will be called with `{type: 'display', displayed: true}`.
* If the user closed the prompt, the callback will be called with `{type: 'skipped', reason: 'user_cancelled'}`.
* If sign-in succeeded, the callback will be called with `{type: 'dismissed', reason: 'credential_returned'}`.
* If sign-in failed, the callback will be called with `{type: 'dismissed', reason: 'credential_obtain_failed'}`.

The default value of [cancel_on_tap_outside](./quick-authentication-reference.md#data-type-initconfiguration) is `true`, which means the prompt will close when tapped outside. You can consider changing this to `false` to ensure that user acts on it.

### Detect sign-in failure

The [Javascript callback for authentication](https://github.com/microsoft/quick-authentication/blob/main/docs/quick-authentication-how-to.md#responding-to-authentication-events) has two parameters. 

If sign-in fails, then the first parameter is null. And the second parameter `signInErrorInfo` will contain the error information. Developer can use the second parameter to detect sign-in failures. A common example is when user cancels out of the sign-in flow. In this case, they will get the following error info object:
```javascript
{
  errorCode: 'user_cancelled',
  errorMessage: 'User cancelled the flow'
}
```

### Passing callback to ms.auth.startSignIn

If [ms.auth.startSignIn](./quick-authentication-reference.md#method-msauthstartsignin) API is used for sign-in, then you can consider using the parameter [startSignOptions](./quick-authentication-reference.md#data-type-startsigninoptions) to pass a Javascript `callback` function.

This will ensure that sign-in events originating from [ms.auth.startSignIn](./quick-authentication-reference.md#method-msauthstartsignin) will be routed to that callback.

If there are multiple sign-in options on a page, e.g., prompt, sign-in button, etc., then this allows developer to detect that the sign-in attempt was started using [ms.auth.startSignIn](./quick-authentication-reference.md#method-msauthstartsignin).

### Use ms.auth.hasMSAAccount to optimize for MSA

[ms.auth.hasMSAAccount](https://github.com/microsoft/quick-authentication/blob/main/docs/quick-authentication-reference.md#method-msauthhasmsaaccount) can be used to determine whether the website is opened in MSA profile in Edge. This is the scenario for which Quick Auth is most optimized. So, if this returns `true` then consider prioritizing Microsoft sign-in in your UX.
```javascript
ms.auth.hasMSAAccount(function(hasMSAAccount) {
  if (hasMSAAccount) {
    // There is a MSA account in the profile.
    // Make MSA button more prominent.
    // Stop showing prompts for other providers.
  } else {
    // No MSA account in the profile.
    // Show prompts from other providers.
  }
});
```
