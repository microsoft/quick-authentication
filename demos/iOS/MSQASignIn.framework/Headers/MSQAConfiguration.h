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

NS_ASSUME_NONNULL_END
