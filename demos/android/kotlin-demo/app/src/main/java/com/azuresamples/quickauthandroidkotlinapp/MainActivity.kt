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
package com.azuresamples.quickauthandroidkotlinapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import com.azuresamples.quickauthandroidkotlinapp.util.ByteCodeUtil
import com.azuresamples.quickauthandroidkotlinapp.view.SignInButtonSettingPop
import com.microsoft.quickauth.signin.*
import com.microsoft.quickauth.signin.error.MSQAException
import com.microsoft.quickauth.signin.error.MSQAUiRequiredException
import com.microsoft.quickauth.signin.logger.LogLevel
import com.microsoft.quickauth.signin.view.MSQASignInButton
import java.lang.Exception

class MainActivity : AppCompatActivity() {
    private lateinit var mSignInButton: MSQASignInButton
    private lateinit var mStatus: TextView
    private lateinit var mUserInfoResult: TextView
    private lateinit var mUserPhoto: ImageView
    private lateinit var mSignButtonSetting: View
    private lateinit var mGetCurrentAccountButton: View
    private lateinit var mTokenResult: TextView
    private lateinit var mSignOutButton: View
    private lateinit var mAcquireTokenButton: View
    private lateinit var mAcquireTokenSilentButton: View
    private lateinit var mFirstSignInContainerView: View
    private lateinit var mSecondSignInContainerView: View
    private lateinit var mRootView: ViewGroup

    private var mSignInClient: MSQASignInClient? = null
    private lateinit var mPop: SignInButtonSettingPop
    private val mScopes: Array<String> = arrayOf("User.Read")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        initView()
        initClient()
        mPop = SignInButtonSettingPop(this, mSignInButton)
    }

    private fun initView() {
        mSignInButton = findViewById(R.id.ms_sign_button)
        mRootView = findViewById(R.id.root_view)
        mStatus = findViewById(R.id.status)
        mUserInfoResult = findViewById(R.id.userInfoResult)
        mUserPhoto = findViewById(R.id.userPhoto)
        mSignButtonSetting = findViewById(R.id.ms_sign_button_setting)
        mSignOutButton = findViewById(R.id.ms_sign_out_button)
        mTokenResult = findViewById(R.id.tv_token_result)
        mAcquireTokenButton = findViewById(R.id.ms_acquire_token_button)
        mGetCurrentAccountButton = findViewById(R.id.ms_get_current_account_button)
        mAcquireTokenSilentButton = findViewById(R.id.ms_acquire_token_silent_button)
        mFirstSignInContainerView = findViewById(R.id.sign_in_container_view1)
        mSecondSignInContainerView = findViewById(R.id.sign_in_container_view2)
        initListeners()
    }

    private fun initListeners() {
        mGetCurrentAccountButton.setOnClickListener { getCurrentAccount() }
        mSignOutButton.setOnClickListener { v: View? ->
            mSignInClient?.signOut { aBoolean: Boolean?, error: MSQAException? ->
                uploadSignInfo(null, error)
            }
            updateTokenResult(null, null)
        }
        mSignButtonSetting.setOnClickListener { v: View? ->
            if (mPop.isShowing) return@setOnClickListener
            mPop.showAtLocation(mRootView, Gravity.BOTTOM, 0, 0)
        }
        mAcquireTokenButton.setOnClickListener { v: View? ->
            mTokenResult.text = ""
            acquireToken()
        }
        mAcquireTokenSilentButton.setOnClickListener { v: View? ->
            if (mSignInClient == null) return@setOnClickListener
            mTokenResult.text = ""
            mSignInClient?.acquireTokenSilent(
                mScopes
            ) { iTokenResult: MSQATokenResult?, error: MSQAException? ->
                /**
                 * If acquireTokenSilent() returns an error that requires an interaction
                 * (MsalUiRequiredException), invoke acquireToken() to have the user resolve the
                 * interrupt interactively.
                 *
                 *
                 * Some example scenarios are - password change - the resource you're acquiring a
                 * token for has a stricter set of requirement than your Single Sign-On refresh
                 * token. - you're introducing a new scope which the user has never consented for.
                 */
                if (error is MSQAUiRequiredException) {
                    acquireToken()
                } else {
                    updateTokenResult(iTokenResult, error)
                }
            }
        }
    }

    private fun initClient() {
        MSQASignInClient.create(
            this,
            MSQASignInOptions.Builder()
                .setConfigResourceId(R.raw.auth_config)
                .setEnableLogcatLog(true)
                .setLogLevel(LogLevel.VERBOSE)
                .setExternalLogger { logLevel: Int, message: String? -> }
                .build(),
            object : ClientCreatedListener {
                override fun onCreated(client: MSQASignInClient) {
                    mSignInClient = client
                    getCurrentAccount()
                    mSignInButton.setSignInCallback(
                        this@MainActivity,
                        client
                    ) { accountInfo: MSQAAccountInfo?, error: MSQAException? ->
                        uploadSignInfo(
                            accountInfo,
                            error
                        )
                    }
                }

                override fun onError(error: MSQAException) {
                    mUserInfoResult.text = "create sign in client error:${error.message}"
                }
            })
    }

    private fun acquireToken() {
        mSignInClient?.acquireToken(
            this, mScopes
        ) { tokenResult: MSQATokenResult?, error: MSQAException? ->
            updateTokenResult(
                tokenResult,
                error
            )
        }
    }

    private fun uploadSignInfo(accountInfo: MSQAAccountInfo?, error: Exception?) {
        if (accountInfo != null) {
            mUserPhoto.setImageBitmap(ByteCodeUtil.base64ToBitmap(accountInfo.base64Photo))
            val userInfo = ("MicrosoftAccountInfo{"
                    + ", fullName="
                    + accountInfo.fullName
                    + ", userName="
                    + accountInfo.userName
                    + ", givenName="
                    + accountInfo.givenName
                    + ", surname="
                    + accountInfo.surname
                    + ", email="
                    + accountInfo.email
                    + ", id="
                    + accountInfo.id
                    + '}')
            mUserInfoResult.text = userInfo
            mTokenResult.text = accountInfo.idToken
        } else {
            mUserPhoto.setImageBitmap(null)
            mTokenResult.text = null
            mUserInfoResult.text = if (error != null) "login error: ${error.message}" else ""
        }
        val signIn = accountInfo != null
        mStatus.text = if (signIn) "signed in" else "signed out"
        mSignInButton.visibility = if (signIn) View.GONE else View.VISIBLE
        mSignOutButton.visibility = if (signIn) View.VISIBLE else View.GONE
        mSignButtonSetting.visibility = if (signIn) View.GONE else View.VISIBLE
        mFirstSignInContainerView.visibility = if (signIn) View.VISIBLE else View.GONE
        mSecondSignInContainerView.visibility = if (signIn) View.VISIBLE else View.GONE
    }

    private fun getCurrentAccount() {
        if (mSignInClient == null) return
        mTokenResult.text = null
        mUserInfoResult.text = null
        mUserPhoto.setImageBitmap(null)
        mSignInClient?.getCurrentAccount { accountInfo: MSQAAccountInfo?, error: MSQAException? ->
            uploadSignInfo(
                accountInfo,
                error
            )
        }
    }

    private fun updateTokenResult(tokenResult: MSQATokenResult?, error: Exception?) {
        mTokenResult.text = tokenResult?.accessToken ?: error?.message
    }
}