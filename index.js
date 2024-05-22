// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

async function saveHackerNewsArticles() {
  try {
    // launch browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // go to Hacker News
    await page.goto("https://news.ycombinator.com");

    const articles = [];
    // Locate all elements by 'titleline' had to be specific
    const articleLocators = page.locator("span.titleline");

    // Get first 10 article titles and links
    for (let i = 0; i < 10; i++) {
      const linkElement = articleLocators.nth(i).getByRole("link").first();
      const title = await linkElement.innerText();
      const link = await linkElement.getAttribute("href");
      articles.push({ title, link });
    }

    await browser.close();
    writeToCsv(articles);
  } catch (error) {
    console.error("Error with saveHackerNews:", error);
  }
}

async function writeToCsv(data) {
  try {
    // Setup format for CSV
    const csvWriter = createCsvWriter({
      path: "./articles.csv",
      header: [
        { id: "title", title: "TITLE" },
        { id: "link", title: "LINK" },
      ],
    });

    await csvWriter.writeRecords(data);
    console.log("All articles exported :)");
  } catch (error) {
    console.error("Error with writeToCsv:", error);
  }
}

(async () => {
  await saveHackerNewsArticles();
})();
