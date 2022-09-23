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



## Logging
To facilitate debugging you have the following options to configure logging using the following methods of `MSQASignInOptionsBuilder`

### Method: setLogLevel
```java
public static void setLogLevel(@LogLevel int logLevel);
```
Sets the log level for diagnostic purpose. By default, the sdk sets the logging level to 'verbose'.
| Parameters | Description | 
|--|--|
| logLevel| Log level int enum |

Code example:
```java
MSQASignInOptionsBuilder.setLogLevel(LogLevel.VERBOSE);
```
### Method: setEnableLogcatLog
```java
public static void setEnableLogcatLog(boolean enableLogcatLog);
```
Enables or disables Android logcat logging. By default, the sdk disables it.
Parameters | Description |
|--|--|
|enableLogcatLog | If true, enables Android logcat logging.

Code example:  
```java
MSQASignInOptionsBuilder.setEnableLogcatLog(true);
```
### Method: setExternalLogger
Configures external logging by providing a callback that the sdk will use to pass each log message.
```java
public static void setExternalLogger(@NonNull ILogger externalLogger);
```
|Parameters| Description|
|--|--|
| externalLogger| The reference to the ILogger that can output the logs to the designated places.

Code example:  
```java
MSQASignInOptionsBuilder.setExternalLogger(new ILogger() {
    @Override
    public void log(@NonNull int logLevel, @Nullable String message) {
	  // handle log message
    }
});
```
