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

#import <MSQASignIn/MSQAConfiguration.h>
#import <MSQASignIn/MSQASignIn.h>
#import <MSQASignIn/MSQASignInButton.h>

#import "SampleAppDelegate.h"
#import "SampleLoginViewController.h"
#import "SampleMainViewController.h"

@interface SampleLoginViewController () <
    UITableViewDelegate, UITableViewDataSource, UIPickerViewDelegate,
    UIPickerViewDataSource>

@property(nonatomic, weak) IBOutlet MSQASignInButton *signInButton;

@property(nonatomic, strong) UITableView *configurationTableView;

@property(nonatomic, strong) NSArray *configurationTableCellLabel;

@property(nonatomic, strong) NSArray<NSArray *> *configrationPickerLabel;

@property(nonatomic, strong)
    NSMutableArray<NSNumber *> *currentConfigurationState;

@property(nonatomic, assign) NSUInteger selectedConfigurationIndex;

@end

@implementation SampleLoginViewController {
  MSQASignIn *_msSignIn;
}

+ (instancetype)sharedViewController {
  static SampleLoginViewController *s_controller = nil;
  static dispatch_once_t once;

  dispatch_once(&once, ^{
    s_controller =
        [[SampleLoginViewController alloc] initWithNibName:@"SampleLoginView"
                                                    bundle:nil];
  });

  return s_controller;
}

- (instancetype)initWithNibName:(NSString *)nibNameOrNil
                         bundle:(NSBundle *)nibBundleOrNil {
  self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
  if (self) {
    [MSQASignInButton class];
    _configurationTableView = [[UITableView alloc] init];
    _configurationTableView.delegate = self;
    _configurationTableView.dataSource = self;

    _configurationTableCellLabel = @[
      @"Type",
      @"Theme",
      @"Size",
      @"Text",
      @"Shape",
      @"Logo",
    ];
    _currentConfigurationState = [@[ @0, @0, @0, @0, @0, @0 ] mutableCopy];
    _configrationPickerLabel = @[
      @[ @"Standard", @"Icon" ], @[ @"Light", @"Dark" ],
      @[ @"Large", @"Medium", @"Small" ],
      @[
        @"Sign in with Microsoft", @"Sign up with Microsoft",
        @"Continue with Microsoft", @"Sign in"
      ],
      @[ @"Rectangular", @"Rounded", @"Pill" ],
      @[ @"Both left", @"Brand left text center", @"Both center" ]
    ];
  }
  return self;
}

- (void)setMSQASignIn:(MSQASignIn *)msSignIn {
  _msSignIn = msSignIn;
}

- (void)viewDidLoad {
  [super viewDidLoad];

  // Switch to main view if already logged in.
  [_msSignIn getCurrentAccountWithCompletionBlock:^(
                 MSQAAccountData *_Nullable account, NSError *_Nullable error) {
    if (account && !error) {
      SampleMainViewController *controller =
          [SampleMainViewController sharedViewController];
      [controller setAccountInfo:account msSignIn:_msSignIn];
      [SampleAppDelegate setCurrentViewController:controller];
    }
  }];

  // Padding View
  UIView *paddingView = [[UIView alloc] init];
  paddingView.translatesAutoresizingMaskIntoConstraints = NO;
  [self.view addSubview:paddingView];
  [NSLayoutConstraint activateConstraints:@[
    [paddingView.widthAnchor
        constraintEqualToAnchor:self.view.safeAreaLayoutGuide.widthAnchor],
    [paddingView.heightAnchor
        constraintEqualToAnchor:self.view.safeAreaLayoutGuide.heightAnchor
                     multiplier:0.25],
    [paddingView.centerXAnchor
        constraintEqualToAnchor:self.view.safeAreaLayoutGuide.centerXAnchor],
    [paddingView.bottomAnchor
        constraintEqualToAnchor:self.view.safeAreaLayoutGuide.centerYAnchor]
  ]];

  // Setup Button
  self.signInButton.translatesAutoresizingMaskIntoConstraints = NO;
  [NSLayoutConstraint activateConstraints:@[
    [self.signInButton.widthAnchor constraintEqualToConstant:300],
    [self.signInButton.heightAnchor constraintEqualToConstant:300],
    [self.signInButton.bottomAnchor
        constraintEqualToAnchor:paddingView.topAnchor],
    [self.signInButton.centerXAnchor
        constraintEqualToAnchor:self.view.safeAreaLayoutGuide.centerXAnchor]
  ]];

  // Setup Table View Configuration
  [self.view addSubview:self.configurationTableView];
  self.configurationTableView.translatesAutoresizingMaskIntoConstraints = NO;
  self.configurationTableView.backgroundColor = [UIColor clearColor];
  [NSLayoutConstraint activateConstraints:@[
    [self.configurationTableView.widthAnchor
        constraintEqualToAnchor:self.view.safeAreaLayoutGuide.widthAnchor],
    [self.configurationTableView.heightAnchor
        constraintEqualToAnchor:self.view.safeAreaLayoutGuide.heightAnchor
                     multiplier:0.5],
    [self.configurationTableView.topAnchor
        constraintEqualToAnchor:self.view.safeAreaLayoutGuide.centerYAnchor],
    [self.configurationTableView.centerXAnchor
        constraintEqualToAnchor:self.view.safeAreaLayoutGuide.centerXAnchor]
  ]];
}

- (IBAction)signIn:(id)sender {
  [_msSignIn signInWithViewController:self
                      completionBlock:^(MSQAAccountData *_Nonnull account,
                                        NSError *_Nonnull error) {
                        SampleMainViewController *controller =
                            [SampleMainViewController sharedViewController];
                        [controller setAccountInfo:account msSignIn:_msSignIn];
                        [SampleAppDelegate setCurrentViewController:controller];
                      }];
}

- (IBAction)getCurrentButton:(id)sender {
  [_msSignIn getCurrentAccountWithCompletionBlock:^(
                 MSQAAccountData *_Nullable account, NSError *_Nullable error) {
    SampleMainViewController *controller =
        [SampleMainViewController sharedViewController];
    [controller setAccountInfo:account msSignIn:_msSignIn];
    [SampleAppDelegate setCurrentViewController:controller];
  }];
}

- (void)applyUserPreferences {
  self.signInButton.type = self.currentConfigurationState[0].intValue;
  self.signInButton.theme = self.currentConfigurationState[1].intValue;
  self.signInButton.size = self.currentConfigurationState[2].intValue;
  self.signInButton.text = self.currentConfigurationState[3].intValue;
  self.signInButton.shape = self.currentConfigurationState[4].intValue;
  self.signInButton.logo = self.currentConfigurationState[5].intValue;
}

#pragma mark - UITableViewDataSource

- (NSInteger)tableView:(UITableView *)tableView
    numberOfRowsInSection:(NSInteger)section {
  return self.configurationTableCellLabel.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView
         cellForRowAtIndexPath:(NSIndexPath *)indexPath {
  NSString *label = self.configurationTableCellLabel[indexPath.row];
  UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:label];
  if (!cell) {
    cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleValue1
                                  reuseIdentifier:label];
  }
  cell.textLabel.text = label;
  cell.detailTextLabel.text =
      self.configrationPickerLabel[indexPath.row]
                                  [self.currentConfigurationState[indexPath.row]
                                       .intValue];
  return cell;
}

#pragma mark - UITableViewDelegate

- (void)tableView:(UITableView *)tableView
    didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
  [tableView deselectRowAtIndexPath:indexPath animated:YES];
  self.selectedConfigurationIndex = indexPath.row;
  UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];

  UIPickerView *pickerView = [[UIPickerView alloc] init];
  pickerView.dataSource = self;
  pickerView.delegate = self;

  UIViewController *viewController = [[UIViewController alloc] init];
  viewController.view = pickerView;

  NSString *title =
      [NSString stringWithFormat:@"Select %@", cell.textLabel.text];

  UIAlertController *alertController = [UIAlertController
      alertControllerWithTitle:title
                       message:nil
                preferredStyle:UIAlertControllerStyleAlert];
  [alertController setValue:viewController forKey:@"contentViewController"];
  [alertController
      addAction:[UIAlertAction actionWithTitle:@"Done"
                                         style:UIAlertActionStyleDefault
                                       handler:nil]];
  [self presentViewController:alertController animated:YES completion:nil];
}

#pragma mark - UIPickerViewDataSource

- (NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView {
  return 1;
}

- (NSInteger)pickerView:(UIPickerView *)pickerView
    numberOfRowsInComponent:(NSInteger)component {
  return self.configrationPickerLabel[self.selectedConfigurationIndex].count;
}

#pragma mark - UIPickerViewDelegate

- (NSString *)pickerView:(UIPickerView *)pickerView
             titleForRow:(NSInteger)row
            forComponent:(NSInteger)component {
  return self.configrationPickerLabel[self.selectedConfigurationIndex][row];
}

- (void)pickerView:(UIPickerView *)pickerView
      didSelectRow:(NSInteger)row
       inComponent:(NSInteger)component {
  UITableViewCell *cell = [self.configurationTableView
      cellForRowAtIndexPath:[NSIndexPath
                                indexPathForRow:self.selectedConfigurationIndex
                                      inSection:0]];
  cell.detailTextLabel.text =
      self.configrationPickerLabel[self.selectedConfigurationIndex][row];
  self.currentConfigurationState[self.selectedConfigurationIndex] =
      [NSNumber numberWithLong:row];
  [self applyUserPreferences];
}

@end
