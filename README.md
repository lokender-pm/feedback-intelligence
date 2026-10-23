# Feedback Intelligence

Turns raw customer feedback into a ranked list of problems, with the customer quotes behind each one and a short readout for each team.

**Live demo:** https://feedback-intelligence-gamma.vercel.app

**Case study:** https://lokendersingh.vercel.app/feedback-intelligence

## Why
Feedback comes in from support tickets, surveys, app reviews and sales calls, and nobody has time to read it all. So priorities get set by whoever complained loudest or most recently, not by what most customers struggle with.

## How it works
- **Upload a CSV or paste text.** Columns are detected and can be corrected. Empty rows are skipped and listed, likely duplicates are marked, and every comment keeps its source row number.
- **The AI tags; fixed rules count.** Gemini gives each comment a theme, sentiment, issue type, severity and risk signal. Counting, scoring and ranking happen in the page, so the same tags always give the same ranking.
- **Ranked problems, working shown.** A problem's score adds up severity × risk weight across its mentions; deal blockers and churn risks weigh more. Open a problem to see its quotes and the sum.
- **Quotes are checked.** Every quote is matched word for word against the source comment.
- **One readout per team.** Product, Marketing, Support, Engineering and Leadership each get their own summary and next steps. The ranking and the deal/churn risk list stay the same, so no team view can hide a risk.
- **Export.** Copy a summary for Slack or Notion, or download a CSV of every comment with its tags.

## Does it work? (test on 19 Oct 2026)
30 new fictional comments, kept separate from the demo data. Reference labels drafted with AI and reviewed by me.

| Check | Result |
|---|---|
| Sentiment matched | 26 / 30 |
| Issue type matched | 27 / 30 |
| Quotes found word for word | 30 / 30 |
| Time for 30 comments | about 40 seconds |

Same 30 comments, three runs:

| Same answer in all 3 runs | Result |
|---|---|
| Issue type | 27 / 30 |
| Severity | 27 / 30 |
| Risk flag | 27 / 30 |
| Sentiment | 22 / 30 |
| Theme name | 6 / 30 |

Tags are fairly stable; theme names are not, so groupings can shift between runs. The main miss: polite feature requests ("Would love a dark mode") read as positive instead of neutral. It's a small test that shows patterns, not an accuracy rate. Themes, severity and risk flags haven't been checked against labels yet.

## Next (not built yet)
- A prompt rule: feature requests are neutral unless they express frustration.
- A fixed theme list per product, instead of themes the model invents each run.
- Test risk flags against labels first: an unflagged churn risk or deal blocker is the costliest miss.
- A bigger test set (50 to 100 comments) and a second labeller.

## Built with
Google Gemini (gemini-3.8-flash) via API · plain JavaScript, HTML and CSS · a Vercel serverless function (`api/analyze.js`) · built in about a week with Claude Code.

## Safety and limits
- The API key stays on the server as a Vercel environment variable, never in the page.
- Up to 5 live runs per visitor per hour (best effort, per server instance).
- Emails and phone numbers are removed before text is sent; names inside comments are not.
- Up to 200 comments or 20,000 characters per run, 1,000 characters per comment, CSV files up to 2 MB.
- The free Gemini tier may use submitted text to improve Google's models, so don't paste confidential data.
- Severity and risk signals are model judgements, not calibrated probabilities.

## Files
| File | What it does |
|---|---|
| `index.html` | Page layout and styles |
| `app.js` | Parsing, column mapping, data checks, counting, quote checks, scoring, rendering, export |
| `data.js` | Sample feedback (72 fictional comments) and its pre-run analysis |
| `api/analyze.js` | Serverless function that calls Gemini, with rate limiting and redaction |
| `vercel.json` | Gives the function up to 60 seconds |
| `dev-server.mjs` | Optional local preview (needs Node.js) |

## Run your own copy
Import the repo into Vercel, add `GEMINI_API_KEY` under Settings → Environment Variables, and deploy. Optional settings: `GEMINI_MODEL` (default `gemini-3.8-flash`) and `RUNS_PER_HOUR` (default 5). Set `liveEnabled: false` in `app.js` for a demo-only page.

---
Built by [Lokender Singh](https://lokendersingh.vercel.app) · [LinkedIn](https://www.linkedin.com/in/lokender-singh-product)
