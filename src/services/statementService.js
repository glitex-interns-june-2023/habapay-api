const fs = require("fs");
const os = require("os");
const path = require("path");
const ejs = require("ejs");
const uuid = require("uuid");
const puppeteer = require("puppeteer");

// Precompile the EJS template and load the CSS outside of the generateStatement function
const template = ejs.compile(
  fs.readFileSync(path.resolve(__dirname, "../../public/statement.ejs"), "utf8")
);

const css = fs.readFileSync(
  path.resolve(__dirname, "../../public/tailwind.css"),
  "utf8"
);

let logo = fs.readFileSync(
  path.resolve(__dirname, "../../public/logo.png"),
  "base64"
);
logo = `data:image/png;base64,${logo}`;

// Start the Puppeteer browser outside of the generateStatement function
let browser;
let page;
let timeoutId;

const startBrowser = async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.emulateMediaType("screen");
};

const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
  }
};

// Reset the timeout whenever a new statement is generated
const resetTimeout = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(closeBrowser, 2 * 60 * 1000); // 2 minutes
};



// get statements by a certain user id
const generateStatement = async (data) => {
  if (!browser) {
    await startBrowser();
  }

  resetTimeout();
  const htmlContent = template({ data, css, logo });

  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

  const pdfPath = path.join(os.tmpdir(), `${uuid.v4()}.pdf`);
  const pdf = await page.pdf({
    path: pdfPath,
    printBackground: true,
    format: "A4",
  });

  console.log("PDF generated:", pdfPath);

  return pdfPath;
};

module.exports = {
  generateStatement,
  closeBrowser,
};