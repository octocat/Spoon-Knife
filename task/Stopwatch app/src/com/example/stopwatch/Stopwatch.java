package com.example.stopwatch;

import java.sql.Date;
import java.text.SimpleDateFormat;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;

public class Stopwatch extends Activity implements OnClickListener {

	Button bstart, bpause, reset;
	TextView t1, t2, t3, t4, laps, lap1, lap2, lap3, lap4, rectime;
	long start = 0, pause, result = 0, interval, mid = 0;
	int i = 0;
	boolean isCounting = false;
	Date d;
	SimpleDateFormat f = new SimpleDateFormat("HH:mm:ss.S");

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		setContentView(R.layout.watch);
		references();

	}

	private void references() {
		// setting references to views

		bstart = (Button) findViewById(R.id.bStart);
		bpause = (Button) findViewById(R.id.bPause);
		reset = (Button) findViewById(R.id.bReset);
		t1 = (TextView) findViewById(R.id.text1);
		t2 = (TextView) findViewById(R.id.text2);
		t3 = (TextView) findViewById(R.id.text3);
		t4 = (TextView) findViewById(R.id.text4);
		laps = (TextView) findViewById(R.id.tLaps);
		lap1 = (TextView) findViewById(R.id.lap1);
		lap2 = (TextView) findViewById(R.id.lap2);
		lap3 = (TextView) findViewById(R.id.lap3);
		lap4 = (TextView) findViewById(R.id.lap4);
		rectime = (TextView) findViewById(R.id.rectime);

		bstart.setOnClickListener(this);
		bpause.setOnClickListener(this);
		reset.setOnClickListener(this);

	}

	// creating thread to continuously update display time
	
	private Handler h = new Handler();

	private Runnable r = new Runnable() {
		public void run() {
			if (isCounting == true) {
				interval = System.currentTimeMillis() - start + mid;
				d = new Date(interval);

				rectime.setText(f.format(d));
				h.postDelayed(r, 100);
			}
		}
	};

	@Override
	public void onClick(View v) {

		switch (v.getId()) {
		case R.id.bStart:

			// resuming the thread

			if (isCounting == false) {
				isCounting = true;

				h.removeCallbacks(r);
				h.postDelayed(r, 100);

				start = System.currentTimeMillis();
			}

			break;

		case R.id.bPause:

			// pausing the thread

			if (isCounting == true)
				isCounting = false;

			mid = interval;

			break;

		case R.id.bReset:

			// setting laps

			i++;

			if (i > 4)
				i = 1;

			lap1.setTextColor(Color.BLACK);
			lap2.setTextColor(Color.BLACK);
			lap3.setTextColor(Color.BLACK);
			lap4.setTextColor(Color.BLACK);

			if (i == 1) {

				lap1.setText(f.format(d));
				lap1.setTextColor(Color.RED);

			}

			if (i == 2) {

				lap2.setText(f.format(d));
				lap2.setTextColor(Color.RED);

			}

			if (i == 3) {

				lap3.setText(f.format(d));
				lap3.setTextColor(Color.RED);

			}

			if (i == 4) {

				lap4.setText(f.format(d));
				lap4.setTextColor(Color.RED);

			}
            
			//resetting everything from start
			if (isCounting == true)
				isCounting = false;
			
			rectime.setText("00:00:00");
			
			interval = mid = 0;
			

			break;

		}
	}

}
