//  Copyright (c) Microsoft Corporation.
//  All rights reserved.
//
//  This code is licensed under the MIT License.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files(the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions :
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
package com.azuresamples.quickauthandroidapp.view;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.PopupWindow;
import android.widget.RadioGroup;
import android.widget.SeekBar;
import androidx.annotation.NonNull;
import com.azuresamples.quickauthandroidapp.R;
import com.microsoft.quickauth.signin.view.ButtonLogoAlignment;
import com.microsoft.quickauth.signin.view.ButtonShape;
import com.microsoft.quickauth.signin.view.ButtonSize;
import com.microsoft.quickauth.signin.view.ButtonText;
import com.microsoft.quickauth.signin.view.ButtonTheme;
import com.microsoft.quickauth.signin.view.ButtonType;
import com.microsoft.quickauth.signin.view.MSQASignInButton;

public class SignInButtonSettingPop extends PopupWindow {

  private final @NonNull Context mContext;
  private final @NonNull MSQASignInButton mSignInButton;
  private RadioGroup mTypeRadioGroup;
  private RadioGroup mThemeRadioGroup;
  private RadioGroup mSizeRadioGroup;
  private RadioGroup mTextRadioGroup;
  private RadioGroup mShapeRadioGroup;
  private RadioGroup mAlignmentRadioGroup;
  private SeekBar mSeekBar;

  public SignInButtonSettingPop(@NonNull Context context, @NonNull MSQASignInButton signInButton) {
    super(context);
    mContext = context;
    mSignInButton = signInButton;
    View view = LayoutInflater.from(context).inflate(R.layout.pop_sign_in_button_setting, null);
    init(view);

    setContentView(view);
    setWidth(ViewGroup.LayoutParams.MATCH_PARENT);
    setHeight(ViewGroup.LayoutParams.MATCH_PARENT);
    setFocusable(true);
    setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
    setAnimationStyle(R.style.pw_bottom_anim_style);
  }

  private void init(View rootView) {
    initRadioGroup(rootView);
    initSeekBar(rootView);
    rootView.setOnClickListener(v -> dismiss());
    rootView.findViewById(R.id.setting_container).setOnClickListener(v -> {});
  }

  private void initSeekBar(View rootView) {
    mSeekBar = rootView.findViewById(R.id.sign_button_width_progress);
    mSeekBar.post(
        () -> {
          mSeekBar.setMax(mSeekBar.getMeasuredWidth());
          mSeekBar.setProgress(mSignInButton.getMeasuredWidth());
        });
    mSeekBar.setOnSeekBarChangeListener(
        new SeekBar.OnSeekBarChangeListener() {
          @Override
          public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
            ViewGroup.LayoutParams layoutParams = mSignInButton.getLayoutParams();
            layoutParams.width = progress;
            mSignInButton.setLayoutParams(layoutParams);
          }

          @Override
          public void onStartTrackingTouch(SeekBar seekBar) {}

          @Override
          public void onStopTrackingTouch(SeekBar seekBar) {}
        });
  }

  private void initRadioGroup(View rootView) {
    mTypeRadioGroup = rootView.findViewById(R.id.sign_button_type_radio_group);
    mThemeRadioGroup = rootView.findViewById(R.id.sign_button_theme_radio_group);
    mSizeRadioGroup = rootView.findViewById(R.id.sign_button_size_radio_group);
    mTextRadioGroup = rootView.findViewById(R.id.sign_button_text_radio_group);
    mShapeRadioGroup = rootView.findViewById(R.id.sign_button_shape_radio_group);
    mAlignmentRadioGroup = rootView.findViewById(R.id.sign_button_logo_alignment_radio_group);
    mTypeRadioGroup.setOnCheckedChangeListener(
        (group, checkedId) -> {
          mSignInButton.setButtonType(
              checkedId == R.id.standard ? ButtonType.STANDARD : ButtonType.ICON);
        });
    mThemeRadioGroup.setOnCheckedChangeListener(
        (group, checkedId) -> {
          mSignInButton.setButtonTheme(
              checkedId == R.id.filled_light ? ButtonTheme.LIGHT : ButtonTheme.DARK);
        });
    mSizeRadioGroup.setOnCheckedChangeListener(
        (group, checkedId) -> {
          switch (checkedId) {
            case R.id.size_small:
              mSignInButton.setButtonSize(ButtonSize.SMALL);
              break;
            case R.id.size_medium:
              mSignInButton.setButtonSize(ButtonSize.MEDIUM);
              break;
            default:
              mSignInButton.setButtonSize(ButtonSize.LARGE);
              break;
          }
        });
    mTextRadioGroup.setOnCheckedChangeListener(
        (group, checkedId) -> {
          int text = ButtonText.SIGN_IN_WITH;
          switch (checkedId) {
            case R.id.signup_with:
              text = ButtonText.SIGNUP_WITH;
              break;
            case R.id.signin:
              text = ButtonText.SIGNIN;
              break;
            case R.id.continue_with:
              text = ButtonText.CONTINUE_WITH;
              break;
          }
          mSignInButton.setButtonText(text);
        });
    mShapeRadioGroup.setOnCheckedChangeListener(
        (group, checkedId) -> {
          switch (checkedId) {
            case R.id.rounded:
              mSignInButton.setButtonShape(ButtonShape.ROUNDED);
              break;
            case R.id.pill:
              mSignInButton.setButtonShape(ButtonShape.PILL);
              break;
            default:
              mSignInButton.setButtonShape(ButtonShape.RECTANGULAR);
              break;
          }
        });
    mAlignmentRadioGroup.setOnCheckedChangeListener(
        (group, checkedId) -> {
          switch (checkedId) {
            case R.id.center:
              mSignInButton.setButtonLogoAlignment(ButtonLogoAlignment.CENTER);
              break;
            default:
              mSignInButton.setButtonLogoAlignment(ButtonLogoAlignment.LEFT);
              break;
          }
        });
  }
}
