# 따로따로 · Taro — AI-first Shared Expense Coordination

> **따로따로** (romanized: *Taro*) means "separately" in Korean — the idea that everyone's share is tracked precisely, separately, and fairly.

---

## What is Taro?

Taro is an AI-first shared expense coordination app for friend groups, travel trips, and shared households. It automatically detects shared expenses from transactions, emails, and chat messages, then helps the group settle up with minimal friction.

This repository is a **GitHub Pages prototype** — a fully interactive React frontend demo. No backend, no real payments, all mock data.

---

## Tech Stack

| Layer      | Technology                                               |
|------------|----------------------------------------------------------|
| UI         | React 18 (CDN) + Babel Standalone (no build step)        |
| Styles     | Vanilla CSS — B&W Notion + sketch aesthetic              |
| Fonts      | Google Fonts — Inter · Lora · JetBrains Mono             |
| Logic      | JSX transpiled in-browser by Babel                       |
| Hosting    | GitHub Pages (static)                                    |
| Backend    | None                                                     |
| Payments   | None (prototype only)                                    |

---

## Running Locally

Open `index.html` in any modern browser. No build step, no server, no installs.

```
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

You need an internet connection for CDN resources (React, Babel, Google Fonts).

---

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch, **/ (root)** folder
5. Click **Save**

Live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

---

## File Structure

```
index.html   — minimal shell: CDN scripts, <div id="root">
style.css    — B&W Notion + sketch design system
app.js       — entire React app in JSX (Babel transpiles in browser)
README.md    — this file
```

---

## Screens

| Screen       | Description                                                      |
|--------------|------------------------------------------------------------------|
| **Home**     | AI suggestion feed, quick commands, recent activity              |
| **Wallet**   | Balance, top-up/withdraw/transfer, auto-settle settings, history |
| **Groups**   | Group list + detail view with members, categories, settle health |
| **Chat**     | Group chat with inline Taro expense detection                    |
| **Detect**   | Detection sources (wallet, email, chat, calls) + manual entry    |
| **Settle**   | Friend list balances, settlement scores, individual settle flows |
| **Ask Taro** | Conversational AI Q&A about expenses and balances                |

---

## Design System

**B&W Notion + Doodle Minimalism**

- Background: `#FAFAF8` (warm off-white)
- Text: `#1A1A1A`
- Borders: `2px solid #1A1A1A` (strong, sketch-feel)
- Cards: `box-shadow: 3px 3px 0 #1A1A1A` (hard shadow = doodle aesthetic)
- Status colors: muted green / orange / red (for meaning only)
- No purple palette — full B&W

Fonts:
- **Lora** (serif) — headings and screen titles
- **Inter** (sans-serif) — UI elements and body text
- **JetBrains Mono** (monospace) — amounts and codes

---

## AI Flows Demonstrated

1. **Transaction Detection** — Wallet charges surfaced as suggestions with confidence scores
2. **Email Detection** — Hotel/flight booking confirmations parsed into expense records
3. **Chat Insight Extraction** — "Only Julia and Sarah joined" → split adjustment proposed
4. **Call Transcript Analysis** — Opt-in, on-device only (shown as locked/coming soon)
5. **Natural Language Q&A** — Pre-scripted responses for 8 demo questions
6. **Flexible Settlement** — Pay later / installments / partial amount options
7. **One-tap Group Settlement** — Approve all pending balances simultaneously

---

## Interactive Features

- Wallet balance updates live when approving settlements, topping up, or withdrawing
- Expense participants are togglable (click to include/exclude from split)
- Auto-settle limit is configurable with preset buttons
- Group detail view shows members, category bars, and settlement health bar
- Chat sends new messages; expense keywords trigger a Taro insight card
- All modals close on overlay click or Cancel
- Toast notifications confirm every action

---

## Prototype Disclaimer

This is a **demonstration prototype** only.

- All data is mock/fictional — no real transactions, balances, or users
- No real payments are processed or initiated
- No real email, wallet, or phone integrations exist
- Taro AI responses are pre-written strings, not a live model
- Wallet balances update locally in memory and reset on page reload

---

*따로따로 · Taro · v0.2 prototype*
