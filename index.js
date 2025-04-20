const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// 📝 pass your IMDG user ID here
const userId = process.argv[2]
const url = `https://www.imdb.com/user/${userId}/watchlist`;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
  await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

  console.log(`🔗 Navigating to IMDb Watchlist for user: ${userId}`);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  console.log("⏳ Extracting embedded data...");
  await page.waitForSelector('script#__NEXT_DATA__');
  const scriptTag = await page.$('script#__NEXT_DATA__');
  const scriptContent = await page.evaluate(el => el.textContent, scriptTag);
  const jsonData = JSON.parse(scriptContent);

  const edges = jsonData.props?.pageProps?.mainColumnData?.predefinedList?.titleListItemSearch?.edges || [];

  const fullData = edges.map(edge => {
    const item = edge.listItem;

    const getGenreList = () =>
      item.titleGenres?.genres?.map(g => g.genre?.text).filter(Boolean) || [];

    const getCredits = (categoryId) =>
      item.principalCredits
        ?.find(c => c.category?.id === categoryId)
        ?.credits?.map(c => c.name?.nameText?.text).filter(Boolean) || [];

    const formatReleaseDate = () => {
      const date = item.releaseDate;
      return date ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}` : "";
    };

    return {
      title: item.titleText?.text || "",
      originalTitle: item.originalTitleText?.text || "",
      year: item.releaseYear?.year || "",
      type: item.titleType?.text || "",
      imdbId: item.id,
      link: `https://www.imdb.com/title/${item.id}/`,
      poster: item.primaryImage?.url || "",
      genres: getGenreList(),
      rating: item.certificate?.rating || "",
      runtimeMinutes: item.runtime?.seconds ? Math.round(item.runtime.seconds / 60) : "",
      plot: item.plot?.plotText?.plainText || "",
      imdbRating: item.ratingsSummary?.aggregateRating || "",
      voteCount: item.ratingsSummary?.voteCount || "",
      releaseDate: formatReleaseDate(),
      status: item.productionStatus?.currentProductionStage?.text || "",
      directors: getCredits("director"),
      cast: getCredits("cast")
    };
  });

  const flattened = fullData.map(item => ({
    ...item,
    genres: item.genres.join(", "),
    directors: item.directors.join(", "),
    cast: item.cast.join(", ")
  }));

  // Output file naming based on user ID
  fs.writeFileSync(`watchlist_full_${userId}.json`, JSON.stringify(fullData, null, 2));
  fs.writeFileSync(`watchlist_flat_${userId}.json`, JSON.stringify(flattened, null, 2));

  console.log(`✅ Extracted ${fullData.length} items from user: ${userId}`);
  console.log(`📁 Saved full data to: watchlist_full_${userId}.json`);
  console.log(`📁 Saved flat data to: watchlist_flat_${userId}.json`);

  await browser.close();
})();
