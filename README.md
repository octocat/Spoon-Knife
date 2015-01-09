import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.thoughtworks.selenium.SeleneseTestNgHelper;


public class Espn 
{
	FirefoxDriver driver;
	SeleneseTestNgHelper st;
	@BeforeClass
	public void setup()
	{
		driver=new FirefoxDriver();
		driver.get("http://espn.go.com");
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
	}
	@Test
	public void Navigation()
	{
		WebElement nfl=driver.findElement(By.xpath("//*[@id='menu-nfl']/a"));
		new Actions(driver).moveToElement(nfl).perform();
		driver.findElement(By.linkText("Scores")).click();
		st.assertEquals(driver.findElement(By.xpath("//*[@class='section-title']")).getText(), "NFL Scoreboard");
		
		}
	
	@AfterClass
	public void teardown()
	{
		driver.close();
	}



}

