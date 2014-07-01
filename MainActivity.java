package com.harlan.demo.activity;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;

@SuppressLint("SetJavaScriptEnabled")
public class MainActivity extends Activity {

	private static final String TAG = MainActivity.class.getSimpleName();
	private final String JSON_STR = "{\"Developer\":\"Harlan\",\"Place\":\"Nanjing\"}";

	private WebView mWebView;
	private Handler mHandler = new Handler();
	private Button mBtn;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		mWebView = (WebView) findViewById(R.id.myweb);
		mBtn = (Button) findViewById(R.id.mybtn);

		initWebView();
	}

	// ===================================================================================================================
	//
	// ===================================================================================================================
	private void initWebView() {
		/*
		 * webSettings 保存着WebView中的状态信息。 当WebView第一次被创建时，webSetting中存储的都为默认值。
		 * WebSetting和WebView一一绑定的。 如果webView被销毁了，那么我们再次调用webSetting中的方法时，会抛出异常。
		 */
		WebSettings webSettings = mWebView.getSettings();

		// 允许在webview中执行JavaScript代码
		webSettings.setJavaScriptEnabled(true);

		// 设置webview是否支持缩放
		webSettings.setSupportZoom(false);

		// 加载本地html代码，此代码位于assets目录下，通过file:///android_asset/jsdroid.html访问。
		// mWebView.loadUrl("file:///android_asset/jsdroid.html");
		// mWebView.loadUrl("http://www.sina.com");
		mWebView.loadUrl("http://112.65.235.26/passport/register?phone=13795289631");

		// ===========================
		//
		// ===========================
		Log.v(TAG, "设置js访问android的方法，使用addJavascriptInterface，在线程："
				+ Thread.currentThread().getName());
		mWebView.addJavascriptInterface(new WebAppInterface(this), "Android");

		// ===========================
		//
		// ===========================
		Log.v(TAG, "设置WebView是否跳转到其他的页面");
		mWebView.setWebViewClient(new HarlanWebViewClient(this));

		// ===========================
		// 拦截
		// ===========================
		/**
		 * 这两个方法也不能让js点击之后显示对话框
		 * */
		// webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
		// webSettings.setSupportMultipleWindows(true);

		mWebView.setWebChromeClient(new HarlanWebChromeClient(this));

		// ===========================
		// 从Java代码调用js的方法
		// ===========================
		mBtn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				Log.d(TAG, "Android调用了js方法");
				/*
				 * 通过webView.loadUrl("javascript:xxx")方式就可以调用当前网页中的名称
				 * 为xxx的javascript方法
				 */
				mWebView.loadUrl("javascript:info(" + JSON_STR + ")");
			}
		});
	}

	// ===================================================================================================================
	//
	// ===================================================================================================================
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		// Check if the key event was the Back button and if there's history
		if ((keyCode == KeyEvent.KEYCODE_BACK) && mWebView.canGoBack()) {
			mWebView.goBack();
			return true;
		}
		// If it wasn't the Back key or there's no web page history, bubble up
		// to the default
		// system behavior (probably exit the activity)
		return super.onKeyDown(keyCode, event);
	}

	// ===================================================================================================================
	//
	// ===================================================================================================================

}
