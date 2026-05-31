# 따로따로 · Taro — AI-first Shared Expense Coordination

> **따로따로** (romanized: *Taro*) means "separately" in Korean — the idea that everyone's share is tracked precisely, separately, and fairly.

---

## What is Taro?

Taro is an AI-first shared expense coordination app built for friend groups, travel trips, and shared households. It automatically detects shared expenses from transactions, emails, and chat messages, then helps the group settle up with minimal friction.

This repository contains a **GitHub Pages prototype** — a fully interactive frontend demo built with vanilla HTML, CSS, and JavaScript. No backend, no real payments, all mock data.

---

## The problem it solves

Managing shared expenses in friend groups is painful:
- Forgetting to log who paid for what
- Chasing people for payment weeks after the fact
- Awkward conversations about money
- Manual spreadsheet tracking that nobody keeps up to date

Taro makes shared expenses effortless by detecting them automatically and coordinating settlement for you.

---

## How the Taro AI Agent works

Taro has 7 core capabilities:

1. **Transaction Detection** — Monitors your linked wallet for payments and suggests when they look shared (e.g. a restaurant charge for 5 people). Confidence scores show how certain Taro is.

2. **Email / Booking Detection** — Reads Gmail confirmations (hotels, flights, tickets) and pre-fills expense details without any manual entry.

3. **Chat Insight Extraction** — Reads group chat messages to detect expense-relevant mentions like "I'll pay first" or "only Sarah and I joined" and proposes split adjustments accordingly.

4. **Call Transcript Analysis** (opt-in, on-device only) — With explicit consent, Taro listens locally for expense mentions during calls and extracts insights without uploading any audio.

5. **Natural Language Q&A** — Ask Taro anything: "Why do I owe ₩17,500?", "Who still owes me?", "Split dinner without John" — and get plain-English answers with full calculation breakdowns.

6. **Flexible Settlement Planning** — For people who can't pay right away, Taro offers structured options: pay later (grace period), installment plans, or partial settlements, all tracked automatically.

7. **One-tap Group Settlement** — When everyone's ready, Taro settles all outstanding balances in a single confirmation, handles the notifications, and generates a trip summary.

---

## Screens

| Screen | Description |
|--------|-------------|
| **AI Command Center** | Taro's main feed — pending suggestions, quick actions, recent activity |
| **Wallet** | Balance, top-up/withdraw/transfer, auto-settlement settings, transaction history |
| **Groups** | Jeju Trip overview — members, spending breakdown, settlement health bar |
| **Chat** | Group chat with inline Taro expense detection |
| **Detect** | All detection sources (wallet, email, chat, calls) + manual entry |
| **Settle** | Balance summary, settlement scores, individual balance cards |
| **Ask Taro** | Conversational AI Q&A about any expense or balance |

---

## Running locally

Just open `index.html` in any modern browser:

```
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

No build step, no server, no dependencies to install. Google Fonts (Inter) loads from CDN — you need an internet connection for the font to render correctly. Everything else is self-contained.

---

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch, **/ (root)** folder
5. Click **Save**

Your app will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS (custom properties, grid, flexbox, animations) |
| Logic | Vanilla JavaScript (ES6+, no frameworks, no bundler) |
| Font | Google Fonts — Inter (300, 400, 500, 600, 700, 800) |
| Icons | Unicode emoji + inline SVG (Taro mascot) |
| Hosting | GitHub Pages (static) |
| Backend | None |
| Payments | None (prototype only) |

---

## Prototype disclaimer

This is a **demonstration prototype** only.

- All data is mock/fictional — no real transactions, balances, or users
- No real payments are processed or initiated
- No real email, wallet, or phone integrations exist
- The Taro AI responses are pre-written strings, not a live model
- Wallet balances update locally in memory and reset on page reload
- This app does not connect to any external APIs or services

The prototype is intended to demonstrate UX flows, design language, and the core product concept of 따로따로.

---

## Design system

The app uses a lavender/purple palette defined as CSS custom properties in `style.css`. Primary color is `#7C5CBF` (purple). The Taro mascot is an inline SVG character that appears throughout the UI.

Font: **Inter** from Google Fonts at weights 300–800.

Card style: `border-radius: 16px`, white background, subtle purple-tinted drop shadow.

---

*따로따로 · Taro · v0.1 prototype*
