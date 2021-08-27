package myEspn;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;

public class espnPage {

	public static void main(String[] args) {

		WebDriver driver = new FirefoxDriver();
		String expectedTitle = "NFL Scoreboard";
		String actualTitle = "";

		try{

			driver.navigate().to("http://espn.go.com/");
			driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
			WebElement nflLink = driver.findElement(By.xpath("//div[@id='nav-wrapper']//li[@id='menu-nfl']/a[text()='NFL']"));
			
			if(nflLink.isDisplayed()){
				Actions actions = new Actions(driver);
				actions.moveToElement(nflLink);  // mouse hover to open the menu
				WebElement scoresLink = driver.findElement(By.xpath("//li[@id='menu-nfl']//div[@class='mod-container mod-md-menu']//a[text()='Scores']"));
				
				if(scoresLink.isDisplayed()){
					actions.moveToElement(scoresLink);
					actions.click().build().perform();

					WebElement scoreBoard = driver.findElement(By.xpath("//div[@class='espn-logo']//h1//a[@class='section-title']"));
					actualTitle = scoreBoard.getText();

					if(expectedTitle.contentEquals(actualTitle)){
						System.out.println("Passed : The Expected Title: "+expectedTitle+"  mactched "+ " Actual title");
					}
					else{
						System.out.println("Failed : The Expected Title: "+expectedTitle+"  does not match "+ " Actual title: "+ actualTitle);
					}
				}
				else{
					System.out.println("Failed : The Scores Link is not available in the menu");
				}					
			}
			else{
				System.out.println("Failed: The NFL link is not appearing in the main menu");
			}

		}catch(Exception e){
			System.out.println(e.getMessage());
		}
		driver.quit();
	}


}
