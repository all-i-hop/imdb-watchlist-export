# 🎬 IMDb Watchlist Export → JSON, CSV

This Node.js application lets you **scrape any public IMDb Watchlist** and export the data in multiple formats:

- ✅ Structured JSON (for APIs, databases, or complex logic)
- ✅ Flattened JSON (easy to push to Google Sheets or convert to CSV)
- ✅ CSV format (compatible with Excel, Airtable, Google Sheets, etc.)

---

## ✨ Why Use This?

You may want to:

- Archive or analyze your IMDb Watchlist
- Track ratings, genres, release dates, or runtime
- Generate charts, reports, or dashboards from your list
- Share your curated movie list in a professional format

---

## 🧱 Project Structure

| File | Purpose |
| --- | --- |
| `index.js` | ⭐ Main scraper: pulls data from IMDb and exports full + flat JSON |
| `export-to-csv.js` | Converts flattened JSON into a clean CSV file |
| `upload-to-sheets.js` (opt) | Pushes data to Google Sheets (via API) |
| `watchlist_full_<userId>.json` | All movie metadata, nested JSON |
| `watchlist_flat_<userId>.json` | Flattened metadata for tables, sheets |
| `watchlist_<userId>.csv` | Final spreadsheet-friendly version |
| `README.md` | You're reading it 🙂 |

---

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/all-i-hop/imdb-watchlist-export.git
cd imdb-watchlist-export
npm install
```


## 🚀 How to Use

### ▶ Scrape the Watchlist

```bash
# pass a specific IMDb user ID
node index.js ur123456789
```

This creates:

- `watchlist_full_ur123456789.json`
- `watchlist_flat_ur123456789.json`

> 🧠 Tip: IMDb user ID looks like `ur123456789` and is visible in the URL of your Watchlist.

---

### 📤 Export to CSV

```bash
node export-to-csv.js ur123456789
```

This reads the flattened JSON and generates:

- `watchlist_ur123456789.csv`


## 🧩 Data Fields Collected

Each movie/TV show includes:

- `title`, `originalTitle`, `year`, `type`, `imdbId`, `link`
- `poster`, `genres`, `rating`, `runtimeMinutes`
- `plot`, `imdbRating`, `voteCount`, `releaseDate`, `status`
- `directors`, `cast`


---

## 🧠 Future Ideas

- Support for IMDb **Ratings**, **Reviews**, or **Custom Lists**
- Filters by **genre**, **year**, or **IMDb rating**
- Web dashboard to browse or search your scraped list