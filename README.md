# 따로따로 · tttaro-ttaro-tttaro-ttaro — Split Bill AI Agent

> **따로따로** (romanized: *tttaro-ttaro tttaro-ttaro*) means “separately” in Korean — the idea that everyone’s share is tracked precisely, separately, and fairly.

tttaro-ttaro-tttaro-ttaro is an AI agent that acts as a group treasurer that detects, splits, explains, reminds, and settles shared expenses between friends, especially during trips, meals, outings, and temporary group activities with human approval (human-in-the-loop).

Check out the [Live Web Prototype](https://ttaro-ttaro.vercel.app/).

![Web Preview](preview.png)

---

## Why This Problem?

During group trips, dozens of shared expenses can happen across meals, transport, accommodation, and activities. Existing solutions often require someone to manually record each expense and later remind others to settle their balances.

This creates two problems:

1. **Administrative burden**  
   Someone has to remember the expense, record it, categorize it, select participants, calculate the split, and check who has paid.

2. **Social friction**  
   Someone has to ask friends for money, send reminders, and deal with the awkwardness of delayed repayment.

Many financial activities such as payments, transfers, and bookings are already automated. However, shared expense management still depends heavily on manual entry and interpersonal follow-up.

---

## Pain Point

> People find it tedious to manually record, categorize, and track shared expenses, especially during trips where multiple transactions happen every day.
> People feel uncomfortable reminding friends to repay shared expenses, creating social friction and awkward conversations.

I believe the deeper issue is not just the calculation but also coordination around money.

When friends share expenses, one person often becomes the unofficial “expense manager.” That person has to track payments, remind others, and sometimes feel uncomfortable asking for repayment.

---

## Inspiration

The idea was inspired by small but useful automation features, such as Apple detecting verification codes in messages before the user manually copies them.

This made me ask:

> What if shared expense management could also become proactive?

Instead of waiting for users to manually enter every expense, an AI agent could detect useful financial context ahead of time and suggest the next action.

---

## Proposed Solution

ttaro-ttaro is an AI agent that acts as a group treasurer.

Instead of only helping users calculate debts, ttaro-ttaro helps with the full shared-expense process:

- detecting possible shared expenses
- understanding group context
- suggesting who should be included in a split
- calculating what each person owes
- explaining unclear balances
- drafting polite repayment reminders
- coordinating settlement through an in-app wallet
- keeping users in control through approval before important actions

The goal is to let ttaro-ttaro handle the repetitive and socially uncomfortable parts, while the user stays in control.

---

## Who This Is For (Target Audience)

ttaro-ttaro is designed for **small social groups of 3–8 people** who frequently share expenses during trips, outings, or temporary group activities.

Examples include:

- friends travelling together
- friends going to cafes or restaurants
- exchange students
- classmates on group trips
- event committees
- club members
- roommates sharing occasional costs

The focus is on groups where shared expenses happen often enough that one person usually becomes responsible for managing the money.

---

## Why Current Workarounds Fall Short

People currently use:

- group chats
- bank transfers
- payment apps
- notes apps
- spreadsheets
- Splitwise or similar bill-splitting tools
- one person paying first and collecting later

These tools can help, but they still require users to do much of the work manually.

Current solutions usually help with tracking or calculation, but users still need to:

- manually enter expenses
- remember who joined each activity
- remind friends to pay
- verify repayments
- manage delayed payments
- handle awkward conversations

ttaro-ttaro explores how AI can help with the coordination layer, not just the calculation layer.

---

## Key Features

### 1. AI Expense Detection

ttaro-ttaro detects possible shared expenses from mock wallet transactions.

Example:

Julia pays ₩50,000 at a cafe.  
A normal cafe expense might be around ₩10,000 per person.  
ttaro-ttaro detects that this may be a group expense and asks whether it should be split with friends.

---

### 2. Human-in-the-Loop Approval

ttaro-ttaro can detect, suggest, explain, and prepare actions.

However, ttaro-ttaro must ask for user approval before:

- creating a shared expense
- assigning debt to friends
- sending a repayment reminder
- moving money through the wallet
- enabling auto-settlement
- using messages, emails, or call transcripts as context

This is important because money requires trust. The app should feel automated, but not out of control.

---

### 3. In-App Wallet Settlement

The prototype includes a simulated wallet system.

Users can see:

- wallet balance
- top-up option
- withdrawal option
- wallet-to-wallet settlement
- transaction history
- pending balances

After approval, ttaro-ttaro simulates automatic wallet-based settlement.

Example:

Julia paid ₩50,000 for Cafe.  
Each of five friends owes ₩10,000.  
After approval, the app simulates transfers from each friend’s wallet to Julia’s wallet.

---

### 4. Message Understanding

The prototype includes mock group and individual chats.

ttaro-ttaro can detect messages such as:

- “I’ll pay first.”
- “Let’s split later.”
- “Only Sarah and I joined.”
- “John wasn’t there.”

This helps ttaro-ttaro suggest more accurate splits.

---

### 5. Voice / Video Call Transcript Detection

The prototype does not record real calls. It uses mock call transcripts.

Example transcript from voice call:

> “Sarah and Julia joined the cafe, but John and Alex did not.”

ttaro-ttaro uses this context to suggest that John and Alex should be excluded from the cafe split.

---

### 6. Email Booking Detection

The prototype simulates booking email detection.

Example email booking summary:

> Hotel booking confirmed — ₩240,000 — 4 guests

ttaro-ttaro can suggest adding the booking to the trip wallet and splitting it among the correct members.

---

### 7. Debt Visibility

The app shows who has settled and who is still pending.

Example statuses:

- settled
- pending
- overdue
- extension requested

This creates gentle accountability without directly shaming users.

---

### 8. Settlement Score

ttaro-ttaro can show mock repayment reliability indicators such as:

- 98% on-time payments
- reliable payer
- usually settles within 1 day
- extension requested

The purpose is to encourage repayment through soft accountability.

---

### 9. Flexible Repayment

Not every unpaid balance is caused by bad intention.

If someone cannot pay immediately, ttaro-ttaro can suggest:

- pay later
- partial payment
- installments
- request extension

This helps reduce awkwardness while keeping the debt visible.

---

### 10. AI Explanation

Users can ask ttaro-ttaro:

- “Why do I owe ₩17,500?”
- “Who still owes me?”
- “How was this split?”

ttaro-ttaro explains the calculation clearly.

Example:

> You owe ₩17,500 from dinner, taxi, and hotel.  
> Dinner: ₩5,000  
> Taxi: ₩8,000  
> Hotel: ₩4,500

---

## What I Would Test First

The first thing I would test is whether the pain point is real.

The key validation question is:

> Are manual expense tracking and repayment reminders frustrating enough that people would actually want an AI assistant involved?

I would test this by showing the prototype to people who recently travelled, ate out, or shared costs with friends.

I would ask:

- How did you track shared expenses?
- Who managed the finances?
- Did anyone forget to pay?
- Was asking for repayment uncomfortable?
- Which part of the process felt most annoying?
- Which part would you most want automated?
- Would you trust an AI agent to suggest or prepare settlements?
- What would make you uncomfortable about this idea?

The success signal would be:

> Users consistently say that manual tracking and repayment reminders are frustrating enough that they would want everything automated.

If users only say the prototype looks nice but do not feel the pain point, then the idea needs to be changed.

---

## Prototype Scope

This is a **front-end prototype only**.

It uses mock data for:

- wallet transactions
- wallet balances
- group members
- messages
- emails
- call transcripts
- AI suggestions
- repayment reminders
- settlements

It does not use:

- real payments
- real bank accounts
- real emails
- real messages
- real call recordings
- real AI APIs
- real authentication

The purpose is to make the idea tangible quickly and test whether the problem and workflow make sense.

---

## Project Structure

```text
tttaro-ttaro-tttaro-ttaro/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run Locally

Clone the repository:

```text
git clone https://github.com/juliairsalina/ttaro-ttaro.git
cd ttaro-ttaro
```

Then
```text
open index.html
```
