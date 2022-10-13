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

#import "SampleMainViewController.h"

#import <MSQASignIn/MSQAAccountData.h>
#import <MSQASignIn/MSQASignIn.h>
#import <MSQASignIn/MSQASilentTokenParameters.h>

#import "SampleAppDelegate.h"
#import "SampleLoginViewController.h"

@implementation SampleMainViewController {
  MSQAAccountData *_accountData;
  MSQASignIn *_msSignIn;
}

+ (instancetype)sharedViewController {
  static SampleMainViewController *s_controller = nil;
  static dispatch_once_t once;

  dispatch_once(&once, ^{
    s_controller =
        [[SampleMainViewController alloc] initWithNibName:@"SampleMainView"
                                                   bundle:nil];
  });

  return s_controller;
}

- (id)initWithNibName:(NSString *)nibNameOrNil
               bundle:(NSBundle *)nibBundleOrNil {
  if (!(self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil])) {
    return nil;
  }
  return self;
}

- (void)setUserPhoto:(UIImage *)photo {
  _profileImageView.image = photo;
  _profileImageView.layer.cornerRadius = _profileImageView.frame.size.width / 2;
  _profileImageView.layer.borderWidth = 4.0f;
  _profileImageView.layer.borderColor = UIColor.whiteColor.CGColor;
  _profileImageView.clipsToBounds = YES;
}

- (void)setAccountInfo:(MSQAAccountData *)accountData
              msSignIn:(MSQASignIn *)msSignIn {
  _accountData = accountData;
  _msSignIn = msSignIn;
}

- (void)viewWillAppear:(BOOL)animated {
  _nameLabel.text =
      [NSString stringWithFormat:@"Welcome, %@ %@", _accountData.givenName,
                                 _accountData.surname];
  _fullNameLabel.text =
      [NSString stringWithFormat:@"Email: %@", _accountData.email];
  _idLabel.text = [NSString stringWithFormat:@"Id: %@", _accountData.userId];

  if (_accountData.base64Photo) {
    NSData *data = [[NSData alloc]
        initWithBase64EncodedString:_accountData.base64Photo
                            options:
                                NSDataBase64DecodingIgnoreUnknownCharacters];
    [self setUserPhoto:[UIImage imageWithData:data]];
    return;
  }
  [self setUserPhoto:[UIImage imageNamed:@"no_photo"]];
}

- (IBAction)signOut:(id)sender {
  [_msSignIn signOutWithCompletionBlock:^(NSError *_Nullable error) {
    if (error)
      NSLog(@"Error:%@", error.description);
  }];
  [SampleAppDelegate setCurrentViewController:[SampleLoginViewController
                                                  sharedViewController]];
}

- (IBAction)fetchTokenSilent:(id)sender {
  MSQASilentTokenParameters *parameters =
      [[MSQASilentTokenParameters alloc] initWithScopes:@[ @"User.Read" ]];
  [_msSignIn acquireTokenSilentWithParameters:parameters
                              completionBlock:^(MSQAAccountData *account,
                                                NSError *error) {
                                self->_tokenLabel.text =
                                    [NSString stringWithFormat:@"ID token: %@",
                                                               account.idToken];
                              }];
}

- (IBAction)fetchTokenInteractive:(id)sender {
  MSQAWebviewParameters *webParameters = [[MSQAWebviewParameters alloc]
      initWithAuthPresentationViewController:self];
  MSQAInteractiveTokenParameters *parameters =
      [[MSALInteractiveTokenParameters alloc]
             initWithScopes:@[ @"User.Read", @"Calendars.Read" ]
          webviewParameters:webParameters];

  [_msSignIn acquireTokenWithParameters:parameters
                        completionBlock:^(MSQAAccountData *_Nullable account,
                                          NSError *_Nullable error) {
                          self->_tokenLabel.text =
                              [NSString stringWithFormat:@"ID token: %@",
                                                         account.idToken];
                        }];
}

- (IBAction)getCurrentAccount:(id)sender {
  [_msSignIn getCurrentAccountWithCompletionBlock:^(
                 MSQAAccountData *_Nullable account, NSError *_Nullable error) {
    if (account) {
      NSString *message =
          [NSString stringWithFormat:@"Full name: %@\nUser name: %@",
                                     account.fullName, account.userName];
      [self showAlertWithMessage:message];
      return;
    }
    [self showAlertWithMessage:@"None available account"];
  }];
}

- (void)showAlertWithMessage:(NSString *)message {
  UIAlertController *controller =
      [UIAlertController alertControllerWithTitle:@"Current account"
                                          message:message
                                   preferredStyle:UIAlertControllerStyleAlert];
  UIAlertAction *action =
      [UIAlertAction actionWithTitle:@"OK"
                               style:UIAlertActionStyleDefault
                             handler:nil];
  [controller addAction:action];
  [self presentViewController:controller animated:YES completion:nil];
}

@end
