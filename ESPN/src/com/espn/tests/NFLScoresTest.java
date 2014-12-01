package com.espn.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.espn.common.Common;





public class NFLScoresTest extends Common {

	@BeforeMethod
	public void setUp(){
		openBrowser();
		openURL("http://espn.go.com/");
	}
	
	@Test
	public void test01(){
		
		
		Actions action = new Actions(driver);
		WebElement list= driver.findElement(By.name("&lpos=sitenavdefault&lid=sitenav_nfl"));
        action.moveToElement(list).perform();
        action.moveToElement(driver.findElement(By.name("&lpos=sitenavdefault&lid=nfl_scores"))).click().build().perform();
		
        Assert.assertTrue(IsTextPresent("NFL Scoreboard"));
	}
	


@AfterMethod

public void tearDown(){
	closeBrowser();
}
}