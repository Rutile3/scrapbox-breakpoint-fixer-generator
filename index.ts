import { downloadTextData } from "./download";

const url = "https://scrapbox.io/assets/css/app.css";

async function main() {
  try {
    const appCssText = await downloadTextData(url);
    console.log(`Data received: ${appCssText}`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else if (typeof error === "string") {
      console.log(error);
    } else {
      console.log("unexpected error");
    }
  }
}

main();
