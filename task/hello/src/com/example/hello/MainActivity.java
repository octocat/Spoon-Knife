package com.example.hello;



import java.util.Random;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;


public class MainActivity extends Activity implements View.OnClickListener{

	TextView display;
	Button jumble;
	int p,length;
	char temp;
    char str[]=new char[1000];
    Random r=new Random();
 

	
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		references();
		
		

		}

	private void references() {
		// TODO Auto-generated method stub
		display=(TextView) findViewById(R.id.textView1) ;
		jumble=(Button)	findViewById(R.id.button1) ;	
		jumble.setOnClickListener(this);
		
		
	}

	@Override
	public void onClick(View v) {
		// TODO Auto-generated method stub
		
		length=display.getText().length();
				
		for(int i=0;i<length;i++)
		{
			str[i]=display.getText().toString().charAt(i);
			
		}
		
			
		
		
		
		for(int i = length-1; i > 0; i--)
		{
	        p = r.nextInt(i);
	         temp = str[i];
	       str[i] =str[p];
	        str[p] = temp;
	        
	        
	    }
		
	   
		 
		display.setText(str, 0, 13);
		
		
		
		
	}
	}

	
