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
package com.azuresamples.quickauthandroidkotlinapp.view

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.PopupWindow
import android.widget.RadioGroup
import android.widget.SeekBar
import android.widget.SeekBar.OnSeekBarChangeListener
import com.azuresamples.quickauthandroidkotlinapp.R
import com.microsoft.quickauth.signin.view.*

class SignInButtonSettingPop(
    mContext: Context,
    private val mSignInButton: MSQASignInButton
) : PopupWindow(mContext) {

    private lateinit var mTypeRadioGroup: RadioGroup
    private lateinit var mThemeRadioGroup: RadioGroup
    private lateinit var mSizeRadioGroup: RadioGroup
    private lateinit var mTextRadioGroup: RadioGroup
    private lateinit var mShapeRadioGroup: RadioGroup
    private lateinit var mAlignmentRadioGroup: RadioGroup
    private lateinit var mSeekBar: SeekBar

    init {
        val view: View =
            LayoutInflater.from(mContext).inflate(R.layout.pop_sign_in_button_setting, null)
        init(view)
        contentView = view
        width = ViewGroup.LayoutParams.MATCH_PARENT
        height = ViewGroup.LayoutParams.MATCH_PARENT
        isFocusable = true
        setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        animationStyle = R.style.pw_bottom_anim_style
    }

    private fun init(rootView: View) {
        initRadioGroup(rootView)
        initSeekBar(rootView)
        rootView.setOnClickListener { v: View? -> dismiss() }
        rootView.findViewById<View>(R.id.setting_container).setOnClickListener { v: View? -> }
    }

    private fun initSeekBar(rootView: View) {
        mSeekBar = rootView.findViewById(R.id.sign_button_width_progress)
        mSeekBar.post {
            mSeekBar.max = mSeekBar.measuredWidth
            mSeekBar.progress = mSignInButton.measuredWidth
            mSeekBar.setOnSeekBarChangeListener(
                object : OnSeekBarChangeListener {
                    override fun onProgressChanged(
                        seekBar: SeekBar,
                        progress: Int,
                        fromUser: Boolean
                    ) {
                        val layoutParams = mSignInButton.layoutParams
                        layoutParams.width = progress
                        mSignInButton.layoutParams = layoutParams
                    }

                    override fun onStartTrackingTouch(seekBar: SeekBar) {}
                    override fun onStopTrackingTouch(seekBar: SeekBar) {}
                })
        }
    }

    private fun initRadioGroup(rootView: View) {
        mTypeRadioGroup = rootView.findViewById(R.id.sign_button_type_radio_group)
        mThemeRadioGroup = rootView.findViewById(R.id.sign_button_theme_radio_group)
        mSizeRadioGroup = rootView.findViewById(R.id.sign_button_size_radio_group)
        mTextRadioGroup = rootView.findViewById(R.id.sign_button_text_radio_group)
        mShapeRadioGroup = rootView.findViewById(R.id.sign_button_shape_radio_group)
        mAlignmentRadioGroup = rootView.findViewById(R.id.sign_button_logo_alignment_radio_group)
        mTypeRadioGroup.setOnCheckedChangeListener { group: RadioGroup?, checkedId: Int ->
            mSignInButton.setButtonType(
                if (checkedId == R.id.standard) ButtonType.STANDARD else ButtonType.ICON
            )
        }
        mThemeRadioGroup.setOnCheckedChangeListener { group: RadioGroup?, checkedId: Int ->
            mSignInButton.setButtonTheme(
                if (checkedId == R.id.filled_light) ButtonTheme.LIGHT else ButtonTheme.DARK
            )
        }
        mSizeRadioGroup.setOnCheckedChangeListener { group: RadioGroup?, checkedId: Int ->
            when (checkedId) {
                R.id.size_small -> mSignInButton.setButtonSize(ButtonSize.SMALL)
                R.id.size_medium -> mSignInButton.setButtonSize(ButtonSize.MEDIUM)
                else -> mSignInButton.setButtonSize(ButtonSize.LARGE)
            }
        }
        mTextRadioGroup.setOnCheckedChangeListener { group: RadioGroup?, checkedId: Int ->
            var text = ButtonText.SIGN_IN_WITH
            when (checkedId) {
                R.id.signup_with -> text = ButtonText.SIGNUP_WITH
                R.id.signin -> text = ButtonText.SIGNIN
                R.id.continue_with -> text = ButtonText.CONTINUE_WITH
            }
            mSignInButton.setButtonText(text)
        }
        mShapeRadioGroup.setOnCheckedChangeListener { group: RadioGroup?, checkedId: Int ->
            when (checkedId) {
                R.id.rounded -> mSignInButton.setButtonShape(ButtonShape.ROUNDED)
                R.id.pill -> mSignInButton.setButtonShape(ButtonShape.PILL)
                else -> mSignInButton.setButtonShape(ButtonShape.RECTANGULAR)
            }
        }
        mAlignmentRadioGroup.setOnCheckedChangeListener { group: RadioGroup?, checkedId: Int ->
            when (checkedId) {
                R.id.center -> mSignInButton.setButtonLogoAlignment(ButtonLogoAlignment.CENTER)
                else -> mSignInButton.setButtonLogoAlignment(ButtonLogoAlignment.LEFT)
            }
        }
    }
}
