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

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, MSQASignInButtonType) {
  kMSQASignInButtonTypeStandard = 0,
  kMSQASignInButtonTypeIcon = 1
};

typedef NS_ENUM(NSInteger, MSQASignInButtonTheme) {
  kMSQASignInButtonThemeLight = 0,
  kMSQASignInButtonThemeDark = 1
};

typedef NS_ENUM(NSInteger, MSQASignInButtonSize) {
  kMSQASignInButtonSizeLarge = 0,
  kMSQASignInButtonSizeMedium = 1,
  kMSQASignInButtonSizeSmall = 2
};

typedef NS_ENUM(NSInteger, MSQASignInButtonText) {
  kMSQASignInButtonTextSignInWith = 0,
  kMSQASignInButtonTextSignUpWith = 1,
  kMSQASignInButtonTextContimueWith = 2,
  kMSQASignInButtonTextSignIn = 3
};

typedef NS_ENUM(NSInteger, MSQASignInButtonShape) {
  kMSQASignInButtonShapeRectangular = 0,
  kMSQASignInButtonShapeRounded = 1,
  kMSQASignInButtonShapePill = 2
};

typedef NS_ENUM(NSInteger, MSQASignInButtonLogo) {
  kMSQASignInButtonLogoLeft = 0,
  kMSQASignInButtonLogoLeftTextCenter = 1,
  kMSQASignInButtonLogoCenter = 2
};

/// This class provides the "Sign in with Microsoft" button.
@interface MSQASignInButton : UIControl

/// The layout style for the sign-in button.
@property(nonatomic, assign) MSQASignInButtonType type;

/// The theme for the sign-in button.
@property(nonatomic, assign) MSQASignInButtonTheme theme;

/// The size for the sign-in button.
@property(nonatomic, assign) MSQASignInButtonSize size;

/// The text for the sign-in button.
@property(nonatomic, assign) MSQASignInButtonText text;

/// The shape for the sign-in button.
@property(nonatomic, assign) MSQASignInButtonShape shape;

/// The logo alignment for the sign-in button.
@property(nonatomic, assign) MSQASignInButtonLogo logo;

@end

NS_ASSUME_NONNULL_END
