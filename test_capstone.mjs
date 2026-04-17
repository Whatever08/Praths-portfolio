import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.capstonebox.com', { waitUntil: 'networkidle2' });
  
  // get all text on the page to verify
  const texts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h2, h3, .heading')).map(el => el.innerText);
  });
  console.log("Headings:", texts);

  await browser.close();
})();
