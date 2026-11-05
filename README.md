# Dinar Ledger — setup

An offline expense, lent and borrowed tracker that installs on your phone with its own icon.
Your entries are stored only on your phone. Nothing is sent anywhere.

## 1. Put it online (one time, free, about 5 minutes)

The app has to be opened once from a web address so your phone can install it. GitHub Pages hosts it for free.

1. Unzip `dinar-ledger-app.zip`.
2. On github.com, tap **+** then **New repository**. Name it `dinar-ledger`, set it to **Public**, and tap **Create repository**.
3. Tap **uploading an existing file**, then drag in all the files from the unzipped folder (`index.html`, `manifest.json`, `sw.js` and the four `.png` icons). Tap **Commit changes**.
4. Go to **Settings > Pages**. Under *Branch*, choose **main** and **/ (root)**, then **Save**.
5. After a minute, your app is at `https://<your-github-username>.github.io/dinar-ledger/`.

## 2. Install it on your phone

**Android (Chrome):** open the address above, tap **⋮**, then **Install app** (or **Add to Home screen**).

**iPhone (Safari):** open the address above, tap **Share**, then **Add to Home Screen**.

Open it once while online. After that it works with no internet.

## 3. Adding SMS

- **Android:** in Messages, long-press the bank SMS, tap **Share**, and pick **Dinar Ledger**. The popup opens ready to sort.
- **iPhone:** iOS doesn't allow web apps in the Share menu. Long-press the SMS, tap **Copy**, open Dinar Ledger, and tap **Paste SMS**.

## 4. Backups

Data lives only on that phone. Deleting the app or clearing browser data deletes it.
Go to **Settings & backup** on the dashboard and tap **Export backup** every week or two.
Use **Import backup** to restore, or to move to a new phone.

## Updating the app later

Replace the changed files in the GitHub repository, and change `VERSION` at the top of `sw.js`
(for example to `dinar-ledger-v2`) so phones pick up the new version. Your entries are kept.
