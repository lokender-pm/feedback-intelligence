# Feedback Intelligence

Turns raw customer feedback (support tickets, surveys, reviews, sales-call notes) into a ranked list of problems with the quotes behind them, and a short readout for Product, Marketing, Support, Engineering or Leadership.

**How it works**
- **Upload a CSV or paste.** Columns are detected and can be corrected. Rows without feedback are skipped (and listed), likely duplicates are kept and marked, and every comment keeps its source row number.
- **The AI tags; the page does the maths.** Each comment gets one theme, sentiment, severity and risk signal. Counts, scores and confidence are calculated in the page, so they're consistent and checkable.
- **Ranked problems with their working shown.** Score = each mention's severity × risk weight, added up. Open a problem to see its quotes and the sum. It's a way to sort, not a revenue estimate.
- **One readout per team.** The summary and next steps change by team; the ranking and the deal/churn risk list don't, so a team view can't hide a risk.
- **Next steps you can act on.** Each says what to check first and what to measure.
- **Export.** Copy a summary for Slack/Notion, or download a CSV of every comment with its tags.
- **Honest about what's not done.** Accuracy testing against a hand-labelled set hasn't been run, and no accuracy is claimed.

## Status

| | |
|---|---|
| Showcase mode (default) | Pre-run analysis of the 72-item sample with all five briefings. Upload and paste run the full validation and preview, but data is not analyzed or sent anywhere. |
| Live mode | Built and wired to Google Gemini, but not yet tested against the real API. |
| Evaluation | Not yet run. Plan: ~40 hand-labelled items kept separate from the demo data; theme and sentiment agreement, quote fidelity, repeat-run consistency. |

## Files

| File | What it does |
|---|---|
| `index.html` | Page layout and styles |
| `app.js` | CSV/paste parsing, column mapping, data checks, counting, quote verification, scoring, rendering, export. Edit `CONFIG` at the top to set your name, LinkedIn URL and showcase/live mode |
| `data.js` | Sample feedback and the pre-run analysis |
| `api/analyze.js` | Serverless function that calls Google Gemini. Holds rate limiting and redaction |
| `vercel.json` | Gives the function up to 60 seconds |
| `dev-server.mjs` | Optional local preview (needs Node.js) |

---

## Deploy for free (about 10 minutes, no coding, no API key)

The app ships in **showcase mode** (`liveEnabled: false` in `app.js`): it shows the pre-run analysis of the sample data with all five audience briefings. No AI key is needed and nothing costs money. You need two free accounts: GitHub (stores the code) and Vercel (hosts the site).

### 1. Put the code on GitHub
1. Sign up at **https://github.com** (free).
2. Click **+** (top right), then **New repository**. Name it `feedback-intelligence`, choose **Public**, and click **Create repository**.
3. On the next page, click **uploading an existing file**.
4. Open the `feedback-intelligence` folder in File Explorer, select **everything inside it** (including the `api` folder), and drag it onto the GitHub page.
5. Check that `api/analyze.js` appears in the list, then click **Commit changes**.

### 2. Deploy on Vercel
1. Go to **https://vercel.com**, click **Sign Up**, choose **Hobby** (free) and **Continue with GitHub**.
2. Click **Add New…**, then **Project**, and **Import** the `feedback-intelligence` repository.
3. Leave **Framework Preset** as **Other**. Don't change the build settings or add environment variables.
4. Click **Deploy**. After about a minute you get a live URL like `feedback-intelligence-abc123.vercel.app`.

### 3. Test it
1. Open the URL. The pre-run analysis should appear straight away.
2. Click each audience (Product, Marketing, Support / CX, Engineering, Leadership). The briefing should change; the **Critical risks** panel should stay the same.
3. Open a theme and a prioritised problem to check the quotes appear.
4. Open it on your phone too.

### 4. Tidy the URL and add your LinkedIn link
- **Nicer URL:** Project → **Settings → Domains** → edit the `.vercel.app` name, e.g. `feedback-intelligence-lokender.vercel.app`. This is free.
- **Your LinkedIn link:** on GitHub, open `app.js`, click the pencil icon, paste your profile URL into `linkedin: ''`, and click **Commit changes**. Vercel redeploys automatically.

### 5. Add it to your LinkedIn profile
1. On your profile, click **Add profile section → Recommended → Add featured**.
2. Click **+ → Add a link** and paste your Vercel URL.
3. Title: `Feedback Intelligence: AI triage for customer feedback`
4. Description: `Turns raw feedback from support, sales, surveys and reviews into prioritised themes with verified quotes, transparent scoring and briefings for Product, Marketing, Support, Engineering and Leadership. A guardrail keeps deal blockers and churn risks visible whatever the audience asks for.`
5. Upload a screenshot of the results page as the thumbnail if the preview is blank.

Optionally, also add it under **Projects** and link the GitHub repository to show the code.

---

## Later: turn on live analysis (optional, still free)

1. Get a free key at **https://aistudio.google.com** → **Get API key**. Don't add billing, so Google can't charge you.
2. In Vercel: project **Settings → Environment Variables**, add `GEMINI_API_KEY` with your key.
3. On GitHub, edit `app.js` and change `liveEnabled: false` to `liveEnabled: true`. Commit, and Vercel redeploys.

Visitors can then paste their own feedback and use custom instructions. The free tier may use submitted text to improve Google's models, so the page asks visitors not to paste confidential data.

## Settings (optional)

Set these in Vercel under **Settings → Environment Variables**:

| Variable | Default | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | none | Required for live analysis |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Change if Google retires this model or you want another one |
| `RUNS_PER_HOUR` | `5` | Live runs allowed per visitor per hour (best effort) |

## Limits and honest caveats
- Up to 200 items or 20,000 characters per run; CSV files up to 2 MB; single comments up to 1,000 characters.
- The rate limit is per server instance, so it slows down abuse but isn't a hard cap. Not adding billing on Google is the real cost protection.
- Emails and phone numbers are redacted. Names inside free text are not.
- Theme names can differ between runs. Within a run, counts are consistent.
- Severity and signals are model judgements, not calibrated probabilities.
