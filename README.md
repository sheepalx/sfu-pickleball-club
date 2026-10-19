# SFU Pickleball Club — Interest Signup

A lightweight mobile-first website for Vercel, with six questions, a rally animation, your SFU logo, and Google Sheets collection.

## Deploy

1. Upload this folder to a GitHub repository (including `public`, `api`, `package.json`, and `vercel.json`).
2. In Vercel, **Add New → Project**, import the GitHub repository. Framework preset: **Other**. Root directory: repository root. No build command needed.
3. Create a Google Sheet. Open **Extensions → Apps Script**. Replace the script with the contents of `google-apps-script.gs`.
4. In Apps Script, open **Project Settings → Script Properties**, create `WEBHOOK_SECRET` with a long random secret (e.g. a securely generated 32+ character string).
5. **Deploy → New deployment → Web app**. Execute as **Me**; Who has access: **Anyone**. Authorize the script and copy the resulting `/exec` URL. This URL is not the spreadsheet sharing link.
6. In Vercel project **Settings → Environment Variables**, set `SHEETS_WEBHOOK_URL` to the Apps Script `/exec` URL, and `SHEETS_WEBHOOK_SECRET` to the same secret. Select Production (and Preview if needed).
7. Redeploy from Vercel. Submit a test response and verify it appears in the `Responses` tab of your sheet. Delete the test response before launch.
8. Put your Vercel deployment URL in the Instagram bio.

**Important:** The HTML file alone can preview the layout, but submissions require Vercel's `/api/submit` function and the Google Sheets setup. The frontend never receives your webhook secret.

## Form

1. Name — required
2. SFU email — required (standard email format)
3. Experience — required
4. Interests — required (multi-select)
5. Availability — optional (multi-select)
6. Organizing — optional

Privacy note and pending SFSS approval notice are included. This is an interest list, not official membership enrollment.

## Privacy & abuse

The Google Sheet should be shared only with authorized club organizers. The endpoint validates submitted values and uses a honeypot field, but **does not implement rate limiting or CAPTCHA**. Add rate limiting / bot protection before promoting widely if abuse becomes a concern. The form currently accepts any valid email address (it asks for an SFU email but does not enforce `@sfu.ca`), avoiding accidentally rejecting SFU-affiliated addresses that use another domain. Add explicit consent / retention details if required by club or university policies.
