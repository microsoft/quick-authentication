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
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/// This class represents the result for acquiring a token.
@interface MSQATokenResult : NSObject

/// The access token.
@property(nonatomic, readonly, nonnull) NSString *accessToken;

/// The authorization header for the specific authentication scheme. For
/// instance “Bearer …” or “Pop …”.
@property(nonatomic, readonly, nonnull) NSString *authorizationHeader;

/// The authentication scheme for the tokens issued. For instance “Bearer ” or
/// “Pop”.
@property(nonatomic, readonly, nonnull) NSString *authorizationScheme;

/// The time that the access token returned in the Token property ceases to be
/// valid.
@property(nonatomic, readonly, nonnull) NSDate *expiresOn;

/// An identifier for the tenant that the token was acquired from. This property
/// will be nil if tenant information is not returned by the service.
@property(nonatomic, readonly, nullable) NSString *tenantId;

/// The scope values returned from the service.
@property(nonatomic, readonly, nonnull) NSArray<NSString *> *scopes;

/// The correlation ID of the request.
@property(nonatomic, readonly, nullable) NSUUID *correlationId;

@end

NS_ASSUME_NONNULL_END
