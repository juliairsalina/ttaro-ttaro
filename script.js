/* ==============================================
   따로따로 · Taro — AI Expense Coordination
   script.js — Complete application logic
   ============================================== */

'use strict';

// ── AppState ──────────────────────────────────
const AppState = {
  wallet: {
    balance: 120000,
    autoSettle: true,
    autoSettleLimit: 30000,
    monthlyLimit: 200000
  },
  currentUser: { id: 'julia', name: 'Julia' },
  members: [
    {
      id: 'julia', name: 'Julia', avatar: 'J', color: '#7C5CBF',
      owes: 0, status: 'settled', score: 98,
      scoreLabel: 'Excellent payer', paidTotal: 308000
    },
    {
      id: 'sarah', name: 'Sarah', avatar: 'S', color: '#52B788',
      owes: 0, status: 'settled', score: 95,
      scoreLabel: 'Reliable payer', paidTotal: 75000
    },
    {
      id: 'alex', name: 'Alex', avatar: 'A', color: '#5B8DD9',
      owes: 10000, status: 'pending', score: 88,
      scoreLabel: 'Usually pays within 3 days', paidTotal: 80000
    },
    {
      id: 'john', name: 'John', avatar: 'J', color: '#D46060',
      owes: 100000, status: 'overdue', score: 72,
      scoreLabel: 'Extension requested 2 times', paidTotal: 18000
    },
    {
      id: 'minho', name: 'Minho', avatar: 'M', color: '#E09060',
      owes: 17500, status: 'extension', score: 85,
      scoreLabel: 'Usually settles within 1 week', paidTotal: 100000
    }
  ],
  expenses: [
    {
      id: 'cafe', merchant: 'Cafe Bloom', amount: 50000, category: 'Food & Drinks',
      payer: 'julia', participants: ['julia','sarah','alex','minho','john'],
      perPerson: 10000, date: 'Today 2:34 PM', status: 'pending', icon: '☕'
    },
    {
      id: 'taxi', merchant: 'KakaoTaxi', amount: 18000, category: 'Transportation',
      payer: 'minho', participants: ['julia','sarah','minho'],
      perPerson: 6000, date: 'Today 1:20 PM', status: 'pending', icon: '🚕'
    },
    {
      id: 'hotel', merchant: 'Jeju Shilla Hotel', amount: 240000, category: 'Accommodation',
      payer: 'julia', participants: ['julia','sarah','alex','minho'],
      perPerson: 60000, date: 'Jun 15', status: 'pending', icon: '🏨'
    },
    {
      id: 'dinner', merchant: 'Jeju Black Pork', amount: 75000, category: 'Food & Drinks',
      payer: 'sarah', participants: ['julia','sarah','alex','minho','john'],
      perPerson: 15000, date: 'Jun 15', status: 'settled', icon: '🍖'
    },
    {
      id: 'tickets', merchant: 'Jeju Stone Park', amount: 80000, category: 'Activities',
      payer: 'julia', participants: ['julia','sarah','alex','minho'],
      perPerson: 20000, date: 'Jun 16', status: 'pending', icon: '🎡'
    },
    {
      id: 'flight', merchant: 'Jeju Air KE121', amount: 375000, category: 'Transportation',
      payer: 'julia', participants: ['julia','sarah','alex','minho','john'],
      perPerson: 75000, date: 'Jun 15', status: 'settled', icon: '✈️'
    }
  ],
  transactions: [
    { desc: 'Sarah → Julia · Dinner settlement', amount: +25000, type: 'in', date: '2 min ago', icon: '↓' },
    { desc: 'Cafe Bloom payment', amount: -50000, type: 'out', date: 'Today 2:34 PM', icon: '☕' },
    { desc: 'Hotel · Jeju Shilla', amount: -240000, type: 'out', date: 'Today 1:00 PM', icon: '🏨' },
    { desc: 'Wallet top-up', amount: +100000, type: 'in', date: 'Yesterday', icon: '↓' },
    { desc: 'KakaoTaxi payment', amount: -18000, type: 'out', date: 'Today 1:20 PM', icon: '🚕' },
    { desc: 'Alex → Julia · Taxi settle', amount: +6000, type: 'in', date: '3 days ago', icon: '↓' }
  ],
  chatMessages: [
    { sender: 'sarah', name: 'Sarah', text: 'Hey everyone! So excited for Jeju! 🎉', time: '9:00 AM' },
    { sender: 'julia', name: 'Julia', text: 'Me too! I booked the hotel — ₩240,000 for 4 people', time: '9:05 AM' },
    { sender: 'alex', name: 'Alex', text: "Thanks Julia! I'll transfer my share soon", time: '9:07 AM' },
    { sender: 'john', name: 'John', text: 'Can I pay later? A bit tight this week 😅', time: '9:10 AM' },
    { sender: 'minho', name: 'Minho', text: 'Same here, can we settle after the trip?', time: '9:12 AM' },
    { sender: 'julia', name: 'Julia', text: 'Sure! Taro will track everything for us 😊', time: '9:15 AM' },
    {
      sender: 'julia', name: 'Julia',
      text: 'We went to Cafe Bloom earlier. Only Sarah and I joined btw',
      time: '2:40 PM',
      taroDetect: true,
      taroMessage: "I detected that only Julia and Sarah joined the cafe visit. Should I exclude John, Alex, and Minho from the Cafe Bloom expense? New split: ₩25,000 each."
    },
    { sender: 'sarah', name: 'Sarah', text: 'It was amazing 😍 Their lavender latte is perfect', time: '2:42 PM' },
    { sender: 'julia', name: 'Julia', text: 'Dinner tonight at Jeju Black Pork? Everyone come!', time: '6:00 PM' },
    { sender: 'alex', name: 'Alex', text: "100%! I'll be there", time: '6:02 PM' },
    { sender: 'john', name: 'John', text: 'Joining too', time: '6:03 PM' },
    { sender: 'minho', name: 'Minho', text: '👍', time: '6:04 PM' },
    { sender: 'sarah', name: 'Sarah', text: "I'll pay first and we split later. Taro will handle it 😎", time: '6:05 PM' }
  ],
  dismissedSuggestions: new Set(),
  categories: {
    'Food & Drinks':  { amount: 125000, icon: '🍽', color: '#7C5CBF' },
    'Accommodation':  { amount: 240000, icon: '🏨', color: '#5B8DD9' },
    'Transportation': { amount: 393000, icon: '🚌', color: '#52B788' },
    'Activities':     { amount: 80000,  icon: '🎡', color: '#E09060' }
  }
};

// ── Taro AI Responses ────────────────────────
const TARO_RESPONSES = {
  "Why do I owe 17,500 KRW?": `Here's how Minho's ₩17,500 balance was calculated:

**KakaoTaxi** (Jun 15): ₩18,000 ÷ 3 people = ₩6,000 per person. Minho paid, so he's owed back ₩6,000 from Julia and Sarah.

**Jeju Shilla Hotel** (Jun 15): ₩240,000 ÷ 4 people = ₩60,000 per person. Julia paid, so Minho owes Julia ₩60,000.

**Net balance**: Minho owes Julia ₩60,000 − ₩6,000 credit = **₩54,000**... but he has a Flexible Repayment extension active, and has already paid ₩36,500.

**Remaining: ₩17,500** · Status: Extension until next Friday.`,

  "Who still owes me money?": `Here's everyone who owes **Julia** money right now:

• **Alex** — ₩10,000 · *Pending* (3 days)
  Hotel share: ₩60,000 already settled. Outstanding: taxi ₩6,000 + cafe ₩10,000 adjustment.

• **Minho** — ₩17,500 · *Extension granted*
  Net after KakaoTaxi credit. Repayment plan active.

• **John** — ₩100,000 · *Overdue ⚠*
  Hotel ₩60,000 + cafe ₩10,000 + previous balance. 7 days past due.

**Total owed to you: ₩127,500**
Would you like me to send reminders or set up a flexible plan?`,

  "How was the hotel split calculated?": `**Jeju Shilla Hotel — Split breakdown:**

Total charged: **₩240,000**
Participants: Julia, Sarah, Alex, Minho (4 people)
Note: John was excluded from the hotel booking.

**₩240,000 ÷ 4 = ₩60,000 per person**

Julia paid the full amount upfront.

Current status:
• Sarah ✓ — settled ₩60,000
• Julia — paid (no charge to herself)
• Alex — ₩60,000 pending (3 days)
• Minho — ₩60,000 on extension plan

Would you like to send a reminder to Alex?`,

  "Show unpaid balances": `**Unpaid balances in Jeju Trip:**

| Member | Owes | Status | Days |
|--------|------|--------|------|
| Alex   | ₩10,000  | Pending   | 3 days |
| Minho  | ₩17,500  | Extension | 7 days |
| John   | ₩100,000 | Overdue ⚠ | 14 days |

**Total unsettled: ₩127,500**

I recommend sending a reminder to John first as he is the most overdue. Want me to draft messages?`,

  "Settle the Jeju trip": `I'll prepare a summary to settle all outstanding Jeju Trip balances.

**Pending settlements:**
• Alex → Julia: ₩10,000
• Minho → Julia: ₩17,500
• John → Julia: ₩100,000 (overdue)

**Total to collect: ₩127,500**

Note: John's settlement may require a flexible plan given his history.

Opening the Settle All modal now — please review and confirm each balance before proceeding.`,

  "Create a payment reminder for Alex": `I've drafted a reminder for **Alex**:

---
*"Hey Alex! 👋 Just a friendly reminder about the Jeju Trip expenses. You have ₩10,000 outstanding (Cafe Bloom share). Happy to set up a quick transfer whenever works for you! — Julia via Taro"*

---

Opening the reminder modal so you can review and send it. You can adjust the tone between friendly, neutral, or formal.`,

  "Let Alex pay later": `Flexible repayment plan created for **Alex**:

• **Option selected:** Pay later (7 days)
• **Due date:** June 6, 2025
• **Amount:** ₩10,000
• **Reminder:** Auto-scheduled for June 4

Alex will receive a notification about the grace period. His settlement score won't be affected if he pays by the new due date.

Status updated to "Extension" ✓`,

  "Split dinner among everyone except John": `**Recalculating Jeju Black Pork split:**

Original: ₩75,000 ÷ 5 people = ₩15,000 each (John included)

New split (excluding John):
**₩75,000 ÷ 4 = ₩18,750 each**

Participants: Julia, Sarah, Alex, Minho

Difference from original:
• Each person owes ₩3,750 more (+25%)
• John's ₩15,000 share redistributed

Shall I update the expense record and notify the group?`,

  default: `I'm Taro, your AI expense coordinator ✦

I can help you with:
• **Explain** — why balances are what they are
• **Track** — who owes what to whom
• **Settle** — one-tap settlement for the group
• **Remind** — draft messages for overdue payments
• **Detect** — spot shared expenses automatically
• **Plan** — flexible repayment options

Try one of the quick questions above, or ask me anything about your Jeju Trip expenses!`
};

// ── Helpers ──────────────────────────────────

function formatKRW(amount) {
  return '₩' + Math.abs(amount).toLocaleString('ko-KR');
}

function getMemberById(id) {
  return AppState.members.find(m => m.id === id);
}

function getAvatarClass(id) {
  const map = { julia: 'av-julia', sarah: 'av-sarah', alex: 'av-alex', john: 'av-john', minho: 'av-minho' };
  return map[id] || 'av-julia';
}

function getStatusHTML(status) {
  const map = {
    settled:   '<span class="status-badge badge-settled">Settled ✓</span>',
    pending:   '<span class="status-badge badge-pending">Pending</span>',
    overdue:   '<span class="status-badge badge-overdue">Overdue ⚠</span>',
    extension: '<span class="status-badge badge-extension">Extension</span>'
  };
  return map[status] || '';
}

function getScoreClass(score) {
  if (score >= 90) return 'score-high';
  if (score >= 80) return 'score-mid';
  return 'score-low';
}

function getScoreColor(score) {
  if (score >= 90) return 'var(--green)';
  if (score >= 80) return 'var(--orange)';
  return 'var(--red)';
}

function updateBalanceDisplays() {
  const b = formatKRW(AppState.wallet.balance);
  const wbd = document.getElementById('wallet-balance-display');
  const sb = document.getElementById('sidebar-balance');
  if (wbd) wbd.textContent = b;
  if (sb) sb.textContent = b;
}

function scrollToBottom(el) {
  if (el) el.scrollTop = el.scrollHeight;
}

// ── Navigation ────────────────────────────────

function navigateTo(screenId) {
  // Screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + screenId);
  if (target) target.classList.add('active');

  // Sidebar nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.screen === screenId);
  });

  // Bottom nav items
  document.querySelectorAll('.bnav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.screen === screenId);
  });

  // Scroll chat to bottom when opening chat
  if (screenId === 'chat') {
    setTimeout(() => scrollChatToBottom(), 50);
  }
}

// ── Greeting ──────────────────────────────────

function setGreeting() {
  const hour = new Date().getHours();
  let greeting;
  if (hour < 12) greeting = 'Good morning, Julia ✦';
  else if (hour < 18) greeting = 'Good afternoon, Julia ✦';
  else greeting = 'Good evening, Julia ✦';

  const el = document.getElementById('taro-greeting');
  if (el) el.textContent = greeting;
}

// ── Render: Transactions ─────────────────────

function renderTransactions() {
  const el = document.getElementById('transaction-list');
  if (!el) return;

  const html = AppState.transactions.map(tx => {
    const isIn = tx.type === 'in';
    return `
      <div class="tx-row">
        <div class="tx-icon ${isIn ? 'tx-icon-in' : 'tx-icon-out'}">${tx.icon}</div>
        <div class="tx-body">
          <div class="tx-desc">${tx.desc}</div>
          <div class="tx-date">${tx.date}</div>
        </div>
        <div class="tx-amount ${isIn ? 'positive' : 'negative'}">
          ${isIn ? '+' : '−'}${formatKRW(tx.amount)}
        </div>
      </div>`;
  }).join('');

  el.innerHTML = `<div class="card" style="padding: 8px 20px;">${html}</div>`;
}

// ── Render: Members Grid ─────────────────────

function renderMembersGrid() {
  const el = document.getElementById('members-grid');
  if (!el) return;

  el.innerHTML = AppState.members.map(m => {
    const owesText = m.owes > 0
      ? `<div class="member-owe" style="color:${m.status === 'overdue' ? 'var(--red)' : m.status === 'extension' ? 'var(--purple)' : 'var(--orange)'}">Owes ${formatKRW(m.owes)}</div>`
      : `<div class="member-owe" style="color:var(--green)">All settled ✓</div>`;

    return `
      <div class="member-card">
        <div class="avatar avatar-lg ${getAvatarClass(m.id)} member-avatar">${m.avatar}</div>
        <div class="member-name">${m.name}</div>
        <div class="member-paid">Paid ${formatKRW(m.paidTotal)}</div>
        ${owesText}
        <div style="margin-top:6px">${getStatusHTML(m.status)}</div>
      </div>`;
  }).join('');
}

// ── Render: Category Breakdown ───────────────

function renderCategoryBreakdown() {
  const el = document.getElementById('category-breakdown');
  if (!el) return;

  const maxAmount = Math.max(...Object.values(AppState.categories).map(c => c.amount));

  el.innerHTML = Object.entries(AppState.categories).map(([name, cat]) => {
    const pct = Math.round((cat.amount / maxAmount) * 100);
    return `
      <div class="category-row">
        <div class="cat-icon">${cat.icon}</div>
        <div class="cat-info">
          <div class="cat-name">${name}</div>
          <div class="cat-bar-wrap">
            <div class="cat-bar" style="width:${pct}%;background:${cat.color}"></div>
          </div>
        </div>
        <div class="cat-amount">${formatKRW(cat.amount)}</div>
      </div>`;
  }).join('');
}

// ── Render: Balance Summary ──────────────────

function renderBalanceSummary() {
  const el = document.getElementById('balance-summary');
  if (!el) return;

  const pendingMembers = AppState.members.filter(m => m.owes > 0);
  const totalOwed = pendingMembers.reduce((sum, m) => sum + m.owes, 0);

  const rows = pendingMembers.map(m => `
    <div class="balance-row">
      <div class="balance-member">
        <div class="avatar ${getAvatarClass(m.id)}">${m.avatar}</div>
        <div>
          <div class="balance-name">${m.name}</div>
          <div class="balance-status">${m.status.charAt(0).toUpperCase() + m.status.slice(1)}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        ${getStatusHTML(m.status)}
        <div class="balance-amount" style="color:${m.status === 'overdue' ? 'var(--red)' : 'var(--text)'}">
          ${formatKRW(m.owes)}
        </div>
      </div>
    </div>`).join('');

  el.innerHTML = `
    <div class="balance-summary-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div class="card-label">Who owes Julia</div>
        <div style="font-size:18px;font-weight:800;color:var(--orange)">Total: ${formatKRW(totalOwed)}</div>
      </div>
      ${rows}
    </div>`;
}

// ── Render: Score Cards ──────────────────────

function renderScoreCards() {
  const el = document.getElementById('score-cards');
  if (!el) return;

  el.innerHTML = `<div class="score-grid">
    ${AppState.members.map(m => `
      <div class="score-card">
        <div class="avatar avatar-lg ${getAvatarClass(m.id)} score-avatar">${m.avatar}</div>
        <div class="score-name">${m.name}</div>
        <div class="score-number ${getScoreClass(m.score)}">${m.score}</div>
        <div class="score-label">${m.scoreLabel}</div>
        <div class="score-bar-wrap" style="margin-top:8px">
          <div class="score-bar" style="width:${m.score}%;background:${getScoreColor(m.score)}"></div>
        </div>
      </div>`).join('')}
  </div>`;
}

// ── Render: Individual Balances ──────────────

function renderIndividualBalances() {
  const el = document.getElementById('individual-balances');
  if (!el) return;

  el.innerHTML = AppState.members.map(m => {
    const actionBtns = m.owes > 0 ? `
      <button class="btn btn-approve" onclick="openReminderModal('${m.id}')">✉ Remind</button>
      <button class="btn btn-edit" onclick="showFlexibleRepayment('${m.id}')">⟳ Flexible</button>
    ` : '';

    const detailText = buildBalanceDetail(m);

    return `
      <div class="individual-balance-card">
        <div class="ibc-header">
          <div class="ibc-left">
            <div class="avatar ${getAvatarClass(m.id)}">${m.avatar}</div>
            <div>
              <div class="ibc-name">${m.name}</div>
              <div class="ibc-status">${m.owes > 0 ? 'Owes Julia' : 'All settled'}</div>
            </div>
          </div>
          <div style="text-align:right">
            <div class="ibc-amount" style="color:${m.owes > 0 ? (m.status === 'overdue' ? 'var(--red)' : 'var(--orange)') : 'var(--green)'}">
              ${m.owes > 0 ? formatKRW(m.owes) : '✓ Clear'}
            </div>
            ${getStatusHTML(m.status)}
          </div>
        </div>
        <div class="ibc-details">${detailText}</div>
        ${actionBtns ? `<div class="ibc-actions">${actionBtns}</div>` : ''}
      </div>`;
  }).join('');
}

function buildBalanceDetail(member) {
  const details = {
    julia:  'Paid ₩308,000 total · Lead payer for the trip. No outstanding debts.',
    sarah:  'Paid ₩75,000 total · Settled hotel share ₩60,000 + covered dinner ₩75,000.',
    alex:   'Paid ₩80,000 total · Hotel share pending ₩60,000 settled. Remaining: cafe ₩10,000.',
    john:   'Paid ₩18,000 total · Hotel ₩60,000 + Cafe ₩10,000 + prior balance. 14 days overdue.',
    minho:  'Paid ₩100,000 total · KakaoTaxi credit applied. Net ₩17,500 on extension.'
  };
  return details[member.id] || `Paid ${formatKRW(member.paidTotal)} total.`;
}

// ── Render: Chat Messages ────────────────────

function renderChatMessages() {
  const el = document.getElementById('chat-messages');
  if (!el) return;

  let html = '';
  AppState.chatMessages.forEach(msg => {
    const isJulia = msg.sender === 'julia';
    const cls = isJulia ? 'msg-julia' : `msg-${msg.sender}`;
    html += `
      <div class="chat-msg ${cls}">
        ${!isJulia ? `<div class="chat-sender">${msg.name}</div>` : ''}
        <div class="chat-bubble">${escapeHtml(msg.text)}</div>
        <div class="chat-time">${msg.time}</div>
      </div>`;

    if (msg.taroDetect) {
      html += `
        <div class="taro-suggestion-inline">
          <div class="taro-inline-header">✦ Taro detected</div>
          <div class="taro-inline-text">${msg.taroMessage}</div>
          <div class="taro-inline-actions">
            <button class="btn btn-approve" style="font-size:12px;padding:5px 12px" onclick="approveChatInsight()">✓ Update Split</button>
            <button class="btn btn-dismiss" style="font-size:12px" onclick="this.closest('.taro-suggestion-inline').remove()">Keep original</button>
          </div>
        </div>`;
    }
  });

  el.innerHTML = html;
  setTimeout(() => scrollChatToBottom(), 50);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ── Modal System ──────────────────────────────

function openModal(htmlContent) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  content.innerHTML = htmlContent;
  overlay.classList.remove('hidden');
}

function closeModal(event) {
  if (event && event.target.id !== 'modal-overlay') return;
  closeModalDirect();
}

function closeModalDirect() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('hidden');
  document.getElementById('modal-content').innerHTML = '';
}

// ── Approval Modal ────────────────────────────

function openApprovalModal(expenseId, editMode) {
  const expense = AppState.expenses.find(e => e.id === expenseId);
  if (!expense) return;

  const payer = getMemberById(expense.payer);
  const participantChips = expense.participants.map(pid => {
    const m = getMemberById(pid);
    return m ? `<span class="chip removable" onclick="removeParticipant('${expenseId}','${pid}',this)">${m.avatar} · ${m.name} ✕</span>` : '';
  }).join('');

  const editNote = editMode
    ? `<div style="background:var(--lilac-faint);border-radius:10px;padding:10px;margin-bottom:12px;font-size:12px;color:var(--purple-dark)">
         ✎ Edit mode — click ✕ on a participant chip to remove them. Split recalculates automatically.
       </div>`
    : '';

  openModal(`
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <div class="modal-header">
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="32" rx="15" ry="11" fill="#C9B8E8" stroke="#7C5CBF" stroke-width="1.5"/>
        <circle cx="24" cy="21" r="13" fill="#EDE8F8" stroke="#7C5CBF" stroke-width="1.5"/>
        <circle cx="19.5" cy="20" r="2.5" fill="#5B3FAF"/>
        <circle cx="28.5" cy="20" r="2.5" fill="#5B3FAF"/>
        <circle cx="20.3" cy="19.2" r="0.8" fill="white"/>
        <circle cx="29.3" cy="19.2" r="0.8" fill="white"/>
        <path d="M 19 25.5 Q 24 29 29 25.5" stroke="#7C5CBF" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M 24 8 C 17 4 11 11 17 16 C 19.5 11 24 8 24 8 Z" fill="#B8A0E0"/>
        <path d="M 24 8 C 31 4 37 11 31 16 C 28.5 11 24 8 24 8 Z" fill="#9B7DD4"/>
        <line x1="24" y1="8" x2="24" y2="16" stroke="#7C5CBF" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <div>
        <div class="modal-title">Taro detected this expense</div>
        <div class="modal-subtitle">Review details before recording</div>
      </div>
    </div>

    ${editNote}

    <div class="modal-section">
      <div class="modal-section-title">Expense details</div>
      <div style="background:var(--lilac-faint);border-radius:12px;padding:14px;margin-bottom:12px;">
        <div style="font-size:22px;margin-bottom:6px;">${expense.icon}</div>
        <div style="font-size:18px;font-weight:800;color:var(--text)">${expense.merchant}</div>
        <div style="font-size:24px;font-weight:800;color:var(--purple-dark);margin:4px 0">${formatKRW(expense.amount)}</div>
        <div style="font-size:12px;color:var(--text-muted)">${expense.category} · ${expense.date}</div>
      </div>

      <div class="modal-detail-row">
        <span class="modal-detail-label">Paid by</span>
        <span class="modal-detail-value">${payer ? payer.name : expense.payer}</span>
      </div>
      <div class="modal-detail-row">
        <span class="modal-detail-label">Split</span>
        <span class="modal-detail-value" id="modal-split-text">${formatKRW(expense.perPerson)} × ${expense.participants.length} people</span>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Participants</div>
      <div class="participants-chips" id="modal-participants-${expenseId}">
        ${participantChips}
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">What will happen</div>
      <div class="modal-what-happens">
        ✓ Expense will be recorded in the Jeju Trip group<br/>
        ✓ Each participant will be notified of their share<br/>
        ✓ Balances will update automatically<br/>
        ✓ Julia's wallet reflects the payment
      </div>
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" onclick="confirmExpense('${expenseId}')">✓ Confirm &amp; Record</button>
      <button class="btn btn-edit" onclick="openApprovalModal('${expenseId}', true)">✎ Edit participants</button>
      <button class="btn btn-dismiss" onclick="closeModalDirect()">✗ Cancel</button>
    </div>
  `);
}

function removeParticipant(expenseId, memberId, chipEl) {
  const expense = AppState.expenses.find(e => e.id === expenseId);
  if (!expense || expense.participants.length <= 2) {
    showToast('Need at least 2 participants', 'warning');
    return;
  }
  expense.participants = expense.participants.filter(p => p !== memberId);
  expense.perPerson = Math.round(expense.amount / expense.participants.length);

  chipEl.remove();

  const splitText = document.getElementById('modal-split-text');
  if (splitText) {
    splitText.textContent = `${formatKRW(expense.perPerson)} × ${expense.participants.length} people`;
  }
}

function confirmExpense(expenseId) {
  const expense = AppState.expenses.find(e => e.id === expenseId);
  if (expense) expense.status = 'confirmed';
  closeModalDirect();
  showToast(`✓ ${expense ? expense.merchant : 'Expense'} recorded!`, 'success');
  dismissSuggestion(expenseId);
}

// ── Top-up Modal ──────────────────────────────

function openTopUpModal() {
  openModal(`
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <div class="modal-header">
      <div>
        <div class="modal-title">Top Up Wallet</div>
        <div class="modal-subtitle">Current balance: ${formatKRW(AppState.wallet.balance)}</div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Quick amounts</div>
      <div class="amount-presets" id="topup-presets">
        <button class="preset-btn" onclick="selectPreset(this, 10000, 'topup-amount')">₩10,000</button>
        <button class="preset-btn" onclick="selectPreset(this, 50000, 'topup-amount')">₩50,000</button>
        <button class="preset-btn selected" onclick="selectPreset(this, 100000, 'topup-amount')">₩100,000</button>
        <button class="preset-btn" onclick="selectPreset(this, 0, 'topup-amount')">Custom</button>
      </div>
      <input type="number" id="topup-amount" class="modal-input" value="100000" placeholder="Enter amount" />
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Payment method</div>
      <select class="modal-select">
        <option>Kakao Pay · ****1234</option>
        <option>Toss · ****5678</option>
        <option>Bank transfer · KB ****9012</option>
      </select>
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" onclick="confirmTopUp()">+ Confirm Top Up</button>
      <button class="btn btn-dismiss" onclick="closeModalDirect()">Cancel</button>
    </div>
  `);
}

function selectPreset(btn, amount, inputId) {
  document.querySelectorAll('#topup-presets .preset-btn, #withdraw-presets .preset-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  if (amount > 0) {
    const input = document.getElementById(inputId);
    if (input) input.value = amount;
  }
}

function confirmTopUp() {
  const input = document.getElementById('topup-amount');
  const amount = parseInt(input ? input.value : 0, 10);
  if (!amount || amount <= 0) {
    showToast('Please enter a valid amount', 'warning');
    return;
  }
  AppState.wallet.balance += amount;
  AppState.transactions.unshift({
    desc: 'Wallet top-up',
    amount: amount,
    type: 'in',
    date: 'Just now',
    icon: '↓'
  });
  updateBalanceDisplays();
  renderTransactions();
  closeModalDirect();
  showToast(`✓ Wallet topped up ${formatKRW(amount)}`, 'success');
}

// ── Withdraw Modal ────────────────────────────

function openWithdrawModal() {
  openModal(`
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <div class="modal-header">
      <div>
        <div class="modal-title">Withdraw</div>
        <div class="modal-subtitle">Available: ${formatKRW(AppState.wallet.balance)}</div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Quick amounts</div>
      <div class="amount-presets" id="withdraw-presets">
        <button class="preset-btn" onclick="selectPreset(this, 10000, 'withdraw-amount')">₩10,000</button>
        <button class="preset-btn selected" onclick="selectPreset(this, 50000, 'withdraw-amount')">₩50,000</button>
        <button class="preset-btn" onclick="selectPreset(this, 100000, 'withdraw-amount')">₩100,000</button>
        <button class="preset-btn" onclick="selectPreset(this, 0, 'withdraw-amount')">Custom</button>
      </div>
      <input type="number" id="withdraw-amount" class="modal-input" value="50000" placeholder="Enter amount" />
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Withdraw to</div>
      <select class="modal-select">
        <option>KB Bank · ****9012</option>
        <option>Shinhan Bank · ****3456</option>
        <option>KakaoBank · ****7890</option>
      </select>
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" onclick="confirmWithdraw()">↑ Confirm Withdraw</button>
      <button class="btn btn-dismiss" onclick="closeModalDirect()">Cancel</button>
    </div>
  `);
}

function confirmWithdraw() {
  const input = document.getElementById('withdraw-amount');
  const amount = parseInt(input ? input.value : 0, 10);
  if (!amount || amount <= 0) {
    showToast('Please enter a valid amount', 'warning');
    return;
  }
  if (amount > AppState.wallet.balance) {
    showToast('Insufficient balance', 'error');
    return;
  }
  AppState.wallet.balance -= amount;
  AppState.transactions.unshift({
    desc: 'Wallet withdrawal',
    amount: -amount,
    type: 'out',
    date: 'Just now',
    icon: '↑'
  });
  updateBalanceDisplays();
  renderTransactions();
  closeModalDirect();
  showToast(`✓ ${formatKRW(amount)} withdrawn`, 'success');
}

// ── Transfer Modal ────────────────────────────

function openTransferModal() {
  const memberOptions = AppState.members
    .filter(m => m.id !== 'julia')
    .map(m => `<option value="${m.id}">${m.name}</option>`)
    .join('');

  openModal(`
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <div class="modal-header">
      <div>
        <div class="modal-title">Transfer</div>
        <div class="modal-subtitle">Send money to a group member</div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Recipient</div>
      <select id="transfer-recipient" class="modal-select">
        ${memberOptions}
      </select>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Amount</div>
      <input type="number" id="transfer-amount" class="modal-input" placeholder="Enter amount (₩)" />
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Note (optional)</div>
      <input type="text" id="transfer-note" class="modal-input" placeholder="e.g. Cafe Bloom split" />
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" onclick="confirmTransfer()">→ Send Transfer</button>
      <button class="btn btn-dismiss" onclick="closeModalDirect()">Cancel</button>
    </div>
  `);
}

function confirmTransfer() {
  const recipientId = document.getElementById('transfer-recipient').value;
  const amount = parseInt(document.getElementById('transfer-amount').value || '0', 10);
  const note = document.getElementById('transfer-note').value;

  if (!amount || amount <= 0) { showToast('Please enter a valid amount', 'warning'); return; }
  if (amount > AppState.wallet.balance) { showToast('Insufficient balance', 'error'); return; }

  const recipient = getMemberById(recipientId);
  AppState.wallet.balance -= amount;
  AppState.transactions.unshift({
    desc: `Julia → ${recipient ? recipient.name : recipientId}${note ? ' · ' + note : ''}`,
    amount: -amount,
    type: 'out',
    date: 'Just now',
    icon: '→'
  });
  updateBalanceDisplays();
  renderTransactions();
  closeModalDirect();
  showToast(`✓ ${formatKRW(amount)} sent to ${recipient ? recipient.name : recipientId}`, 'success');
}

// ── Reminder Modal ────────────────────────────

function openReminderModal(memberId) {
  const member = getMemberById(memberId);
  if (!member) return;

  const defaultMessage = `Hey ${member.name}! 👋 Just a friendly reminder about the Jeju Trip expenses. You have ${formatKRW(member.owes)} outstanding. Happy to sort this out whenever works for you! — Julia via Taro ✦`;

  openModal(`
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <div class="modal-header">
      <div class="avatar ${getAvatarClass(memberId)}" style="width:40px;height:40px;font-size:16px">${member.avatar}</div>
      <div>
        <div class="modal-title">Draft Reminder for ${member.name}</div>
        <div class="modal-subtitle">Balance: ${formatKRW(member.owes)} · ${member.status}</div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Tone</div>
      <div class="tone-options" id="tone-options">
        <button class="tone-btn active" onclick="changeTone(this,'friendly','${memberId}')">😊 Close friend</button>
        <button class="tone-btn" onclick="changeTone(this,'neutral','${memberId}')">🤝 Neutral</button>
        <button class="tone-btn" onclick="changeTone(this,'formal','${memberId}')">💼 Formal</button>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Message</div>
      <textarea id="reminder-text" class="modal-textarea">${defaultMessage}</textarea>
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" onclick="sendReminder('${memberId}')">✓ Send Reminder</button>
      <button class="btn btn-edit" onclick="scheduleReminder('${memberId}')">🕐 Schedule for later</button>
      <button class="btn btn-dismiss" onclick="closeModalDirect()">Cancel</button>
    </div>
  `);
}

function changeTone(btn, tone, memberId) {
  document.querySelectorAll('.tone-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const member = getMemberById(memberId);
  const name = member ? member.name : memberId;
  const owes = member ? formatKRW(member.owes) : '';

  const messages = {
    friendly: `Hey ${name}! 👋 Just a friendly reminder about the Jeju Trip expenses. You have ${owes} outstanding. Happy to sort this out whenever works for you! — Julia via Taro ✦`,
    neutral:  `Hi ${name}, this is a reminder that you have an outstanding balance of ${owes} in the Jeju Trip group. Please settle when convenient. — Julia`,
    formal:   `Dear ${name}, I am writing to inform you that your outstanding balance of ${owes} in the Jeju Trip shared expense group remains unpaid. Please arrange payment at your earliest convenience. Regards, Julia`
  };

  const textarea = document.getElementById('reminder-text');
  if (textarea) textarea.value = messages[tone] || messages.friendly;
}

function sendReminder(memberId) {
  const member = getMemberById(memberId);
  closeModalDirect();
  showToast(`✓ Reminder sent to ${member ? member.name : memberId}`, 'success');
}

function scheduleReminder(memberId) {
  const member = getMemberById(memberId);
  closeModalDirect();
  showToast(`🕐 Reminder scheduled for ${member ? member.name : memberId} (tomorrow 9 AM)`, 'info');
}

// ── Flexible Repayment Modal ──────────────────

function showFlexibleRepayment(memberId) {
  const member = getMemberById(memberId);
  if (!member) return;

  openModal(`
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <div class="modal-header">
      <div>
        <div class="modal-title">Flexible Repayment</div>
        <div class="modal-subtitle">${member.name} · ${formatKRW(member.owes)} outstanding</div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Choose a plan</div>

      <div class="flexible-option selected" id="flex-opt-later" onclick="selectFlexOpt('later')">
        <div class="flexible-option-radio"></div>
        <div class="flexible-option-text">
          <div class="flexible-option-title">Pay later</div>
          <div class="flexible-option-sub">Grant a 7-day extension · No penalty</div>
        </div>
      </div>

      <div class="flexible-option" id="flex-opt-installment" onclick="selectFlexOpt('installment')">
        <div class="flexible-option-radio"></div>
        <div class="flexible-option-text">
          <div class="flexible-option-title">Installments</div>
          <div class="flexible-option-sub">50% now (${formatKRW(member.owes / 2)}) + 50% next week</div>
        </div>
      </div>

      <div class="flexible-option" id="flex-opt-partial" onclick="selectFlexOpt('partial')">
        <div class="flexible-option-radio"></div>
        <div class="flexible-option-text">
          <div class="flexible-option-title">Partial settlement</div>
          <div class="flexible-option-sub">Pay what's available now, rest later</div>
        </div>
      </div>
    </div>

    <div class="modal-what-happens" style="margin-top:0">
      ✓ ${member.name} will be notified of the new plan<br/>
      ✓ Settlement score minimally impacted if honoured<br/>
      ✓ Auto-reminder set for due date
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" onclick="confirmFlexible('${memberId}')">✓ Confirm Plan</button>
      <button class="btn btn-dismiss" onclick="closeModalDirect()">Cancel</button>
    </div>
  `);
}

let selectedFlexOpt = 'later';
function selectFlexOpt(opt) {
  selectedFlexOpt = opt;
  ['later', 'installment', 'partial'].forEach(o => {
    const el = document.getElementById('flex-opt-' + o);
    if (el) el.classList.toggle('selected', o === opt);
  });
}

function confirmFlexible(memberId) {
  const member = getMemberById(memberId);
  if (member) {
    member.status = 'extension';
    renderMembersGrid();
    renderIndividualBalances();
    renderBalanceSummary();
  }
  closeModalDirect();
  const planName = selectedFlexOpt === 'later' ? 'Pay later (7 days)' : selectedFlexOpt === 'installment' ? 'Installment plan' : 'Partial settlement';
  showToast(`✓ ${planName} set for ${member ? member.name : memberId}`, 'success');
}

// ── Settle All Modal ──────────────────────────

function openSettleAllModal() {
  const pending = AppState.members.filter(m => m.owes > 0);
  const total = pending.reduce((sum, m) => sum + m.owes, 0);

  const rows = pending.map(m => `
    <div class="settle-all-row">
      <div style="display:flex;align-items:center;gap:8px;">
        <div class="avatar ${getAvatarClass(m.id)}">${m.avatar}</div>
        <div>
          <div style="font-size:13px;font-weight:600">${m.name} → Julia</div>
          <div style="font-size:11px;color:var(--text-muted)">${getStatusLabel(m.status)}</div>
        </div>
      </div>
      <div style="font-size:14px;font-weight:700;color:${m.status === 'overdue' ? 'var(--red)' : 'var(--text)'}">
        ${formatKRW(m.owes)}
      </div>
    </div>`).join('');

  openModal(`
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <div class="modal-header">
      <div>
        <div class="modal-title">✦ Settle All Balances</div>
        <div class="modal-subtitle">Jeju Trip · ${pending.length} outstanding</div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Pending settlements</div>
      <div class="settle-all-list">${rows}</div>
      <div class="settle-total-row">
        <span>Total to collect</span>
        <span style="color:var(--purple)">${formatKRW(total)}</span>
      </div>
    </div>

    <div class="modal-what-happens">
      ✓ Alex (₩10,000) and Minho (₩17,500) — auto-settled from their Taro wallets<br/>
      ⚠ John (₩100,000) — flagged as restricted. Manual follow-up recommended.<br/>
      ✓ All settled members receive confirmation notifications
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" style="flex:1;justify-content:center;padding:12px" onclick="confirmSettleAll()">✓ Settle All</button>
      <button class="btn btn-dismiss" onclick="closeModalDirect()">Cancel</button>
    </div>
  `);
}

function getStatusLabel(status) {
  const map = { pending: 'Pending · 3 days', overdue: 'Overdue · 7 days', extension: 'Extension active', settled: 'Settled' };
  return map[status] || status;
}

function confirmSettleAll() {
  // Settle Alex and Minho, flag John
  AppState.members.forEach(m => {
    if (m.id === 'alex' || m.id === 'minho') {
      AppState.wallet.balance += m.owes;
      AppState.transactions.unshift({
        desc: `${m.name} → Julia · Jeju Trip settlement`,
        amount: m.owes,
        type: 'in',
        date: 'Just now',
        icon: '↓'
      });
      m.owes = 0;
      m.status = 'settled';
    }
  });

  updateBalanceDisplays();
  renderTransactions();
  renderMembersGrid();
  renderBalanceSummary();
  renderScoreCards();
  renderIndividualBalances();
  closeModalDirect();

  showToast('✓ Alex and Minho settled! John flagged for follow-up.', 'success', 4000);

  setTimeout(() => showTripEndSummary(), 600);
}

// ── Trip End Summary ──────────────────────────

function showTripEndSummary() {
  openModal(`
    <button class="modal-close" onclick="closeModalDirect()">✕</button>

    <div class="trip-end-celebration">
      <div class="celebration-emoji">🎉</div>
      <div class="celebration-title">Jeju Trip — Almost done!</div>
      <div class="celebration-sub">Most balances settled. One follow-up remaining.</div>
    </div>

    <div class="trip-end-stats">
      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted);margin-bottom:10px">Trip summary</div>
      <div class="trip-end-stat-row">
        <span>Total expenses</span>
        <span>₩838,000</span>
      </div>
      <div class="trip-end-stat-row">
        <span>Food &amp; Drinks</span>
        <span>₩125,000</span>
      </div>
      <div class="trip-end-stat-row">
        <span>Accommodation</span>
        <span>₩240,000</span>
      </div>
      <div class="trip-end-stat-row">
        <span>Transportation</span>
        <span>₩393,000</span>
      </div>
      <div class="trip-end-stat-row">
        <span>Activities</span>
        <span>₩80,000</span>
      </div>
      <div class="trip-end-stat-row" style="margin-top:8px;padding-top:8px;border-top:2px solid var(--lavender)">
        <span>Julia paid the most</span>
        <span>₩308,000 ✦</span>
      </div>
      <div class="trip-end-stat-row">
        <span>Outstanding (John)</span>
        <span style="color:var(--red)">₩100,000 ⚠</span>
      </div>
    </div>

    <div style="text-align:center;margin-bottom:16px">
      <div style="font-size:15px;font-weight:700;color:var(--green)">✓ Jeju Trip almost complete!</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:4px">Follow up with John to fully close out.</div>
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="closeModalDirect()">Done ✓</button>
    </div>
  `);
}

// ── Chat Functions ────────────────────────────

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');

  AppState.chatMessages.push({ sender: 'julia', name: 'Julia', text, time });

  const messagesEl = document.getElementById('chat-messages');
  if (messagesEl) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg msg-julia';
    msgDiv.innerHTML = `
      <div class="chat-bubble">${escapeHtml(text)}</div>
      <div class="chat-time">${time}</div>`;
    messagesEl.appendChild(msgDiv);

    const detection = analyzeChatForExpenses(text);
    if (detection) {
      const suggDiv = document.createElement('div');
      suggDiv.innerHTML = detection;
      messagesEl.appendChild(suggDiv.firstElementChild);
    }

    scrollChatToBottom();
  }

  input.value = '';
}

function analyzeChatForExpenses(text) {
  const keywords = ['pay', 'paid', 'split', 'owe', "i'll pay", 'my share', 'bought', 'dinner', 'lunch', 'coffee', 'taxi', 'hotel', '₩', 'won', 'cost', 'expense', 'treat'];
  const lower = text.toLowerCase();
  const found = keywords.some(kw => lower.includes(kw));

  if (!found) return null;

  return `
    <div class="taro-suggestion-inline">
      <div class="taro-inline-header">✦ Taro detected a possible expense</div>
      <div class="taro-inline-text">I noticed a potential shared expense in your message. Want me to track it?</div>
      <div class="taro-inline-actions">
        <button class="btn btn-approve" style="font-size:12px;padding:5px 12px" onclick="openManualExpense()">+ Add expense</button>
        <button class="btn btn-dismiss" style="font-size:12px" onclick="this.closest('.taro-suggestion-inline').remove()">Ignore</button>
      </div>
    </div>`;
}

function scrollChatToBottom() {
  const el = document.getElementById('chat-messages');
  if (el) el.scrollTop = el.scrollHeight;
}

// ── Detect Functions ──────────────────────────

function simulateReceiptCapture(type) {
  const typeLabels = { photo: '📷 Photo captured', screenshot: '🖼 Screenshot processed', voice: '🎤 Voice noted' };
  showToast(`${typeLabels[type] || 'Processing'}…`, 'info', 1500);

  setTimeout(() => {
    openModal(`
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
      <div class="modal-header">
        <div>
          <div class="modal-title">Expense Extracted</div>
          <div class="modal-subtitle">Taro read your ${type}</div>
        </div>
      </div>

      <div style="background:var(--lilac-faint);border-radius:12px;padding:16px;margin-bottom:16px">
        <div style="font-size:20px;margin-bottom:6px">☕</div>
        <div style="font-size:18px;font-weight:800;color:var(--text)">The Coffee Bean</div>
        <div style="font-size:24px;font-weight:800;color:var(--purple-dark);margin:4px 0">₩15,000</div>
        <div style="font-size:12px;color:var(--text-muted)">Food & Drinks · Just now</div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Extracted details</div>
        <div class="modal-detail-row">
          <span class="modal-detail-label">Merchant</span>
          <span class="modal-detail-value">The Coffee Bean</span>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-label">Amount</span>
          <span class="modal-detail-value">₩15,000</span>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-label">Category</span>
          <span class="modal-detail-value">Food &amp; Drinks</span>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-label">Date</span>
          <span class="modal-detail-value">Today</span>
        </div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Split with</div>
        <div class="participants-chips">
          <span class="chip">J · Julia</span>
          <span class="chip">S · Sarah</span>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:6px">₩7,500 each</div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-primary" onclick="closeModalDirect();showToast('✓ Coffee Bean ₩15,000 recorded', 'success')">✓ Record Expense</button>
        <button class="btn btn-dismiss" onclick="closeModalDirect()">Discard</button>
      </div>
    `);
  }, 1200);
}

function openManualExpense() {
  const memberCheckboxes = AppState.members.map(m => `
    <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
      <input type="checkbox" value="${m.id}" ${m.id !== 'john' ? 'checked' : ''} style="accent-color:var(--purple)" />
      <div class="avatar" style="width:28px;height:28px;font-size:12px;background:${m.color};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700">${m.avatar}</div>
      <span style="font-size:13px;font-weight:500">${m.name}</span>
    </label>`).join('');

  openModal(`
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <div class="modal-header">
      <div>
        <div class="modal-title">Add Expense Manually</div>
        <div class="modal-subtitle">Enter expense details</div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Merchant</div>
      <input type="text" id="manual-merchant" class="modal-input" placeholder="e.g. Lotte Mart" />
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Amount (₩)</div>
      <input type="number" id="manual-amount" class="modal-input" placeholder="e.g. 35000" />
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Category</div>
      <select id="manual-category" class="modal-select">
        <option>Food &amp; Drinks</option>
        <option>Transportation</option>
        <option>Accommodation</option>
        <option>Activities</option>
        <option>Shopping</option>
        <option>Other</option>
      </select>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Split with</div>
      <div style="border:1.5px solid var(--lilac);border-radius:10px;padding:6px 12px;margin-top:6px">
        ${memberCheckboxes}
      </div>
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" onclick="saveManualExpense()">+ Record Expense</button>
      <button class="btn btn-dismiss" onclick="closeModalDirect()">Cancel</button>
    </div>
  `);
}

function saveManualExpense() {
  const merchant = document.getElementById('manual-merchant').value.trim();
  const amount = parseInt(document.getElementById('manual-amount').value || '0', 10);

  if (!merchant) { showToast('Please enter a merchant name', 'warning'); return; }
  if (!amount || amount <= 0) { showToast('Please enter a valid amount', 'warning'); return; }

  const checkedParticipants = Array.from(
    document.querySelectorAll('#modal-content input[type="checkbox"]:checked')
  ).map(cb => cb.value);

  if (checkedParticipants.length < 1) { showToast('Select at least one participant', 'warning'); return; }

  const perPerson = Math.round(amount / checkedParticipants.length);
  const newExpense = {
    id: 'manual-' + Date.now(),
    merchant,
    amount,
    category: document.getElementById('manual-category').value,
    payer: 'julia',
    participants: checkedParticipants,
    perPerson,
    date: 'Just now',
    status: 'confirmed',
    icon: '📋'
  };

  AppState.expenses.push(newExpense);
  AppState.transactions.unshift({
    desc: merchant,
    amount: -amount,
    type: 'out',
    date: 'Just now',
    icon: '📋'
  });

  renderTransactions();
  closeModalDirect();
  showToast(`✓ ${merchant} ${formatKRW(amount)} recorded!`, 'success');
}

function enableCallMonitoring() {
  openModal(`
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <div class="modal-header">
      <div style="font-size:28px">🔒</div>
      <div>
        <div class="modal-title">Enable Call Monitoring</div>
        <div class="modal-subtitle">Privacy-first · Your calls stay on-device</div>
      </div>
    </div>

    <div style="background:var(--lilac-faint);border-radius:12px;padding:16px;margin-bottom:16px;font-size:13px;color:var(--text-muted);line-height:1.7">
      By enabling call monitoring, Taro will:<br/>
      ✓ Analyse calls <strong>locally on your device</strong> only<br/>
      ✓ Extract expense mentions (e.g. "I'll pay ₩30,000")<br/>
      ✓ Never record or upload audio<br/>
      ✓ Require explicit confirmation for each insight<br/>
      <br/>
      You can revoke access at any time in Settings.
    </div>

    <div style="font-size:12px;color:var(--text-light);margin-bottom:16px">
      This feature complies with Korean Personal Information Protection Act (PIPA) requirements.
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" onclick="acceptCallMonitoring()">✓ Enable — I consent</button>
      <button class="btn btn-dismiss" onclick="closeModalDirect()">Not now</button>
    </div>
  `);
}

function acceptCallMonitoring() {
  closeModalDirect();
  showToast('📞 Call monitoring enabled · Privacy protected', 'success', 4000);

  // Update the source card to active
  const callCard = document.querySelector('.source-inactive');
  if (callCard) {
    callCard.classList.remove('source-inactive');
    callCard.classList.add('source-active');
    const statusEl = callCard.querySelector('.source-status');
    if (statusEl) {
      statusEl.className = 'source-status source-on';
      statusEl.textContent = 'Active · 0 detected';
    }
  }
}

// ── Chat Insight Approval ─────────────────────

function approveChatInsight() {
  dismissSuggestion('chatinsight');

  const cafeExpense = AppState.expenses.find(e => e.id === 'cafe');
  if (cafeExpense) {
    cafeExpense.participants = ['julia', 'sarah'];
    cafeExpense.perPerson = 25000;
  }

  renderMembersGrid();
  renderBalanceSummary();
  renderIndividualBalances();
  showToast('✓ Split updated: Cafe Bloom ₩25,000 × 2', 'success');
}

// ── Dismiss Suggestion ────────────────────────

function dismissSuggestion(id) {
  AppState.dismissedSuggestions.add(id);
  const el = document.getElementById('sugg-' + id);
  if (el) {
    el.style.maxHeight = el.offsetHeight + 'px';
    el.style.overflow = 'hidden';
    // Force reflow
    el.offsetHeight; // eslint-disable-line no-unused-expressions
    el.classList.add('dismissing');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }
}

// ── Auto-Settle Toggle ────────────────────────

function toggleAutoSettle(checkbox) {
  AppState.wallet.autoSettle = checkbox.checked;
  const body = document.getElementById('auto-settle-body');
  if (body) body.style.display = checkbox.checked ? 'flex' : 'none';
  showToast(checkbox.checked ? '✓ Auto-settlement enabled' : 'Auto-settlement disabled', 'info');
}

function updateAutoSettleLimit(value) {
  const num = parseInt(value, 10);
  if (!isNaN(num) && num > 0) {
    AppState.wallet.autoSettleLimit = num;
    const display = document.getElementById('limit-display');
    if (display) display.textContent = formatKRW(num);
  }
}

// ── Copy Trip Code ────────────────────────────

function copyTripCode() {
  const code = 'JEJU2025';
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(code).then(() => {
      showToast('📋 Trip code copied!', 'success');
    }).catch(() => fallbackCopy(code));
  } else {
    fallbackCopy(code);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('📋 Trip code copied!', 'success');
  } catch {
    showToast('Code: JEJU2025', 'info');
  }
  document.body.removeChild(ta);
}

// ── Toast System ──────────────────────────────

function showToast(message, type, duration) {
  type = type || 'info';
  duration = duration || 3000;

  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }, duration);
}

// ── Ask Taro / Explain Screen ─────────────────

function askTaro(query) {
  navigateTo('explain');

  setTimeout(() => {
    appendExplainMessage(query, 'user');

    setTimeout(() => {
      const response = TARO_RESPONSES[query] || TARO_RESPONSES.default;
      appendExplainMessage(response, 'taro');

      if (query === 'Settle the Jeju trip') {
        setTimeout(() => openSettleAllModal(), 400);
      }
    }, 600);
  }, 150);
}

function sendExplainMessage() {
  const input = document.getElementById('explain-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  askTaro(text);
}

function appendExplainMessage(text, type) {
  const messagesEl = document.getElementById('explain-messages');
  if (!messagesEl) return;

  const div = document.createElement('div');
  div.className = 'explain-bubble ' + (type === 'taro' ? 'taro-bubble' : 'user-bubble');

  // Format markdown-lite: **bold**, newlines
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  if (type === 'taro') {
    div.innerHTML = `
      <div class="taro-avatar-small">
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="24" cy="32" rx="15" ry="11" fill="#C9B8E8" stroke="#7C5CBF" stroke-width="1.5"/>
          <circle cx="24" cy="21" r="13" fill="#EDE8F8" stroke="#7C5CBF" stroke-width="1.5"/>
          <circle cx="19.5" cy="20" r="2.5" fill="#5B3FAF"/>
          <circle cx="28.5" cy="20" r="2.5" fill="#5B3FAF"/>
          <circle cx="20.3" cy="19.2" r="0.8" fill="white"/>
          <circle cx="29.3" cy="19.2" r="0.8" fill="white"/>
          <path d="M 19 25.5 Q 24 29 29 25.5" stroke="#7C5CBF" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M 24 8 C 17 4 11 11 17 16 C 19.5 11 24 8 24 8 Z" fill="#B8A0E0"/>
          <path d="M 24 8 C 31 4 37 11 31 16 C 28.5 11 24 8 24 8 Z" fill="#9B7DD4"/>
          <line x1="24" y1="8" x2="24" y2="16" stroke="#7C5CBF" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="explain-bubble-text">${formatted}</div>`;
  } else {
    div.innerHTML = `<div class="explain-bubble-text">${escapeHtml(text)}</div>`;
  }

  messagesEl.appendChild(div);
  setTimeout(() => scrollBottom(messagesEl), 50);
}

function scrollBottom(el) {
  if (el) el.scrollTop = el.scrollHeight;
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ── App Init ──────────────────────────────────

function initApp() {
  setGreeting();
  renderTransactions();
  renderMembersGrid();
  renderCategoryBreakdown();
  renderBalanceSummary();
  renderScoreCards();
  renderIndividualBalances();
  renderChatMessages();

  // Chat send button
  const sendBtn = document.getElementById('chat-send-btn');
  if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);

  // Chat input Enter key
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') sendChatMessage();
    });
  }

  // Explain input Enter key (also set via onkeydown in HTML, this is belt-and-braces)
  const explainInput = document.getElementById('explain-input');
  if (explainInput) {
    explainInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') sendExplainMessage();
    });
  }

  // Modal overlay click to close
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === this) closeModalDirect();
    });
  }
}

// ── Bootstrap ──────────────────────────────────
document.addEventListener('DOMContentLoaded', initApp);
