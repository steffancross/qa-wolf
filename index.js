// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

async function saveHackerNewsArticles(numArticles = 10) {
  try {
    // launch browser
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // go to Hacker News
    await page.goto("https://news.ycombinator.com");

    const articles = [];
    let collectedArticles = 0;

    while (collectedArticles < numArticles) {
      // locate all elements by 'titleline', had to be specific
      const articleLocators = page.locator("span.titleline");
      const articlesOnPage = await articleLocators.count();

      // determine number of articles to fetch on this page
      const articlesToFetch = Math.min(
        numArticles - collectedArticles,
        articlesOnPage
      );

      // get specified number of articles, default is 10
      for (let i = 0; i < articlesToFetch; i++) {
        const linkElement = articleLocators.nth(i).getByRole("link").first();
        const title = await linkElement.innerText();
        const link = await linkElement.getAttribute("href");
        articles.push({ title, link });
        collectedArticles++;
      }

      // check if we need more articles, navigate to next page if we do
      if (collectedArticles < numArticles) {
        const moreLink = page.getByRole("link", { name: "More", exact: true });
        const moreLinkExists = await moreLink.isVisible();

        if (moreLinkExists) {
          await moreLink.click();
        } else {
          break;
        }
      }
    }

    await browser.close();
    writeToCsv(articles);
  } catch (error) {
    console.error("Error with saveHackerNews:", error);
  }
}

async function writeToCsv(data) {
  try {
    // setup format for CSV
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
