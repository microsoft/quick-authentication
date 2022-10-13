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

#import "SampleAppDelegate.h"

#import <MSQASignIn/MSQAConfiguration.h>
#import <MSQASignIn/MSQASignIn.h>

#import "SampleLoginViewController.h"
#import "SampleMainViewController.h"

@interface SampleAppDelegate () {
  UIViewController *_rootController;
  UIViewController *_currentController;
  MSQASignIn *_msSignIn;
}

@end

@implementation SampleAppDelegate

- (instancetype)init {
  self = [super init];
  if (self) {
    MSQAConfiguration *config = [[MSQAConfiguration alloc]
        initWithClientID:@"c4e50099-e6cd-43e4-a7c6-ffb3cebce505"];
    _msSignIn = [[MSQASignIn alloc] initWithConfiguration:config error:nil];
  }
  return self;
}

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  UIWindow *window =
      [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  self.window = window;

  _rootController = [UIViewController new];

  if (_msSignIn) {
    [[SampleLoginViewController sharedViewController] setMSQASignIn:_msSignIn];
    [_msSignIn
        getCurrentAccountWithCompletionBlock:^(
            MSQAAccountData *_Nullable account, NSError *_Nullable error) {
          if (account && !error) {
            SampleMainViewController *controller =
                [SampleMainViewController sharedViewController];
            [controller setAccountInfo:account msSignIn:_msSignIn];
            [self setCurrentViewController:controller];
            return;
          }
          [self setCurrentViewController:[SampleLoginViewController
                                             sharedViewController]];
        }];
  }
  [window setRootViewController:_rootController];
  [window setBackgroundColor:[UIColor whiteColor]];
  [window makeKeyAndVisible];

  return YES;
}

- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:
                (NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {
  if (_msSignIn) {
    return [_msSignIn handleURL:url
              sourceApplication:
                  options[UIApplicationOpenURLOptionsSourceApplicationKey]];
  }
  return NO;
}

+ (void)setCurrentViewController:(UIViewController *)viewController {
  [(SampleAppDelegate *)[[UIApplication sharedApplication] delegate]
      setCurrentViewController:viewController];
}

- (void)setCurrentViewController:(UIViewController *)viewController {
  [_currentController willMoveToParentViewController:nil];
  [_rootController addChildViewController:viewController];

  if (!_currentController) {
    viewController.view.frame = _rootController.view.frame;
    [_rootController.view addSubview:viewController.view];
    _currentController = viewController;
    [_currentController didMoveToParentViewController:_rootController];
  } else {
    CGRect newInitialFrame = _rootController.view.frame;
    CGRect newEndFrame = _rootController.view.frame;

    float startYp = 1.0f;
    float endY = startYp * newInitialFrame.size.height;
    float dY = newEndFrame.origin.y - endY;
    newInitialFrame.origin.y = endY;

    viewController.view.frame = newInitialFrame;

    CGRect oldEndFrame = _rootController.view.frame;
    oldEndFrame.origin.y += dY;

    UIViewController *oldController = _currentController;
    _currentController = viewController;
    [_rootController transitionFromViewController:oldController
        toViewController:viewController
        duration:0.5
        options:UIViewAnimationOptionCurveEaseIn
        animations:^{
          viewController.view.frame = newEndFrame;
          oldController.view.frame = oldEndFrame;
        }
        completion:^(BOOL finished) {
          [oldController removeFromParentViewController];
          [viewController didMoveToParentViewController:_rootController];
        }];
  }
}

@end
