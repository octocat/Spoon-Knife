package com.harlan.demo.activity;

import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

/**
 * @author gongzhen
 * @E-mail: oscar.gong@gmail.com
 * @version 创建时间：2014年6月26日 下午1:59:39 程序的简单说明
 */

/***
 * 让js调用android的方法
 * */
public class WebAppInterface {
	private static final String TAG = WebAppInterface.class.getSimpleName();

	private Context mContext;

	/** Instantiate the interface and set the context */
	WebAppInterface(Context c) {
		mContext = c;
	}

	/** Show a toast from the web page */
	@JavascriptInterface
	public void showToast(String toast) {
		Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
	}

	/**
	 * 为js提供一个方法，注意该方法一般不写在UI线程中 addJavascriptInterface(Object obj, String
	 * interfaceName) obj代表一个java对象，这里我们一般会实现一个自己的类，类里面提供我们要提供给javascript访问的方法
	 * interfaceName则是访问我们在obj中声明的方法时候所用到的js对象 ，调用方法为window.interfaceName.方法名()
	 */
	public void method() {
		// mHandler.post(new Runnable() {
		// @Override
		// public void run() {
		// Log.d(TAG, "js调用了Android方法");
		// }
		// });

		Log.e(TAG, "js调用了Android方法，在线程：" + Thread.currentThread().getName());
	}
}
