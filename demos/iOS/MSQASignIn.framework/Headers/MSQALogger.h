//------------------------------------------------------------------------------
//
// Copyright (c) Microsoft Corporation.
// All rights reserved.
//
// This code is licensed under the MIT License.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files(the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions :
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
//------------------------------------------------------------------------------

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

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

/// Represents the callback of the `MSQALogger`.
typedef void (^MSQALogCallback)(MSQALogLevel level,
                                NSString *_Nullable message);

/// Represents the logger used by `MSQASignIn`.
@interface MSQALogger : NSObject

+ (instancetype)new NS_UNAVAILABLE;

+ (instancetype)init NS_UNAVAILABLE;

/// The property used to access the singleton instance of `MSQALogger`.
@property(class, nonatomic, readonly) MSQALogger *sharedInstance;

/// The minimum log level for messages to be passed onto the log
/// callback, changing the level will apply to all instances of `MSQASignIn`.
/// Default value is `MSQALogLevelInfo`.
@property(atomic) MSQALogLevel logLevel;

/// Enables the logging from MSAL.
@property(atomic) BOOL enableMSALLogging;

/// Sets the callback for the logger.
/// @param callback `MSQALogCallback` callback that is called when logging.
- (void)setLogCallback:(MSQALogCallback)callback;

@end

NS_ASSUME_NONNULL_END
