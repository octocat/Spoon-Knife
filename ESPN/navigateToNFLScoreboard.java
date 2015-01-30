import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.testng.Assert;


public class navigateToNFLScoreboard  {

	public static void main(String[] args) throws Exception {

		System.out.println("Test Execution Started");
		// Invoke the browser
		WebDriver driver = new FirefoxDriver();
		
		//Navigate to ESPN URL
		driver.navigate().to("http://www.espn.go.com");
		
		//Maximize the window
		driver.manage().window().maximize();
		

		titleContains("ESPN: The Worldwide Leader In Sports");

		// Mouse hover on NFL 
		Actions action = new Actions(driver);
		WebElement we = driver.findElement(By.id("menu-nfl"));
		action.moveToElement(we).build().perform();

		Thread.sleep(1000);

		//Click on Scores Link
		driver.findElement(By.xpath("//a[text()='Scores']")).click();
		titleContains("NFL Scoreboard");		

		// Assert for the title contains NFL Scoreboard
		Assert.assertTrue(driver.getTitle().contains("NFL Scoreboard"));
		System.out.println("Test Execution Done");


	}

	/**
	 * An expectation for checking that the title contains a case-sensitive
	 * substring
	 *
	 * @param title the fragment of title expected
	 * @return true when the title matches, false otherwise
	 */
	public static ExpectedCondition<Boolean> titleContains(final String title)
	{
		return new ExpectedCondition<Boolean>() 
		{
			public Boolean apply(WebDriver driver) 
			{
				String currentTitle = driver.getTitle();
				return currentTitle == null ? false : currentTitle.contains(title);
			}
		};
	}
	

}



