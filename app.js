/* ===================================================
   따로따로 · Taro — React 18 + Babel Standalone App
   No build step. CDN globals only.
   =================================================== */

const { useState, useEffect, useRef, useCallback } = React;

// ─── Mock Data ───────────────────────────────────────

const MOCK_MEMBERS = [
  { id: 'julia',  name: 'Julia',  initials: 'JU', wallet: 120000, owes: 0,      status: 'settled',   score: 98, paidTotal: 308000 },
  { id: 'sarah',  name: 'Sarah',  initials: 'SA', wallet: 85000,  owes: 0,      status: 'settled',   score: 95, paidTotal: 75000 },
  { id: 'alex',   name: 'Alex',   initials: 'AL', wallet: 60000,  owes: 10000,  status: 'pending',   score: 88, paidTotal: 80000 },
  { id: 'john',   name: 'John',   initials: 'JO', wallet: 45000,  owes: 100000, status: 'overdue',   score: 72, paidTotal: 18000 },
  { id: 'minho',  name: 'Minho',  initials: 'MI', wallet: 70000,  owes: 17500,  status: 'extension', score: 85, paidTotal: 100000 },
];

const MOCK_EXPENSES = [
  { id: 'cafe',    merchant: 'Cafe Bloom',       amount: 50000,  category: 'Food',          payer: 'julia', participants: ['julia','sarah','alex','john','minho'], perPerson: 10000, date: 'Today 2:34 PM',  status: 'pending',  icon: '☕' },
  { id: 'taxi',    merchant: 'KakaoTaxi',         amount: 18000,  category: 'Transport',     payer: 'minho', participants: ['julia','sarah','minho'],              perPerson: 6000,  date: 'Today 1:20 PM',  status: 'pending',  icon: '🚕' },
  { id: 'hotel',   merchant: 'Jeju Shilla Hotel', amount: 240000, category: 'Accommodation', payer: 'julia', participants: ['julia','sarah','alex','minho'],       perPerson: 60000, date: 'Jun 15',         status: 'pending',  icon: '🏨' },
  { id: 'dinner',  merchant: 'Jeju Black Pork',   amount: 75000,  category: 'Food',          payer: 'sarah', participants: ['julia','sarah','alex','john','minho'], perPerson: 15000, date: 'Jun 15',         status: 'settled',  icon: '🍖' },
  { id: 'tickets', merchant: 'Jeju Stone Park',   amount: 80000,  category: 'Activities',    payer: 'julia', participants: ['julia','sarah','alex','minho'],       perPerson: 20000, date: 'Jun 16',         status: 'pending',  icon: '🎡' },
  { id: 'flight',  merchant: 'Jeju Air KE121',    amount: 375000, category: 'Transport',     payer: 'julia', participants: ['julia','sarah','alex','john','minho'], perPerson: 75000, date: 'Jun 15',         status: 'settled',  icon: '✈' },
];

const MOCK_TRANSACTIONS = [
  { id: 1, desc: 'Sarah settled Dinner',     amount: +25000,  type: 'in',  date: '2 min ago',  icon: '↓' },
  { id: 2, desc: 'Cafe Bloom payment',       amount: -50000,  type: 'out', date: 'Today 2:34', icon: '☕' },
  { id: 3, desc: 'Hotel · Jeju Shilla',      amount: -240000, type: 'out', date: 'Today 1:00', icon: '🏨' },
  { id: 4, desc: 'Wallet top-up',            amount: +100000, type: 'in',  date: 'Yesterday',  icon: '↓' },
  { id: 5, desc: 'KakaoTaxi',                amount: -18000,  type: 'out', date: 'Today 1:20', icon: '🚕' },
  { id: 6, desc: 'Alex settled Taxi',        amount: +6000,   type: 'in',  date: '3 days ago', icon: '↓' },
];

const MOCK_CHAT = [
  { id: 1, sender: 'sarah', name: 'Sarah', text: 'Hey everyone! So excited for Jeju!', time: '9:00 AM' },
  { id: 2, sender: 'julia', name: 'Julia', text: 'I booked the hotel — ₩240,000 for 4 people', time: '9:05 AM' },
  { id: 3, sender: 'alex',  name: 'Alex',  text: "Thanks Julia! I'll transfer my share soon", time: '9:07 AM' },
  { id: 4, sender: 'john',  name: 'John',  text: 'Can I pay later? A bit tight this week', time: '9:10 AM' },
  { id: 5, sender: 'julia', name: 'Julia', text: 'We went to Cafe Bloom. Only Sarah and I joined btw', time: '2:40 PM', taroDetect: true },
  { id: 6, sender: 'sarah', name: 'Sarah', text: 'Their lavender latte was amazing', time: '2:42 PM' },
  { id: 7, sender: 'julia', name: 'Julia', text: 'Dinner tonight at Jeju Black Pork? Everyone come!', time: '6:00 PM' },
  { id: 8, sender: 'sarah', name: 'Sarah', text: "I'll pay first and we split — Taro will sort it", time: '6:05 PM' },
];

const CHAT_ROOMS = [
  {
    id: 'jeju-group',
    type: 'group',
    name: 'Jeju Trip',
    subtitle: '5 members',
    members: ['julia','sarah','alex','john','minho'],
    lastMessage: "I'll pay first and we split — Taro will sort it",
    lastTime: '6:05 PM',
    unread: 2,
    messages: [
      { id: 1, sender: 'sarah', name: 'Sarah', text: 'Hey everyone! So excited for Jeju!', time: '9:00 AM' },
      { id: 2, sender: 'julia', name: 'Julia', text: 'I booked the hotel — ₩240,000 for 4 people', time: '9:05 AM' },
      { id: 3, sender: 'alex',  name: 'Alex',  text: "Thanks Julia! I'll transfer my share soon", time: '9:07 AM' },
      { id: 4, sender: 'john',  name: 'John',  text: 'Can I pay later? A bit tight this week', time: '9:10 AM' },
      { id: 5, sender: 'julia', name: 'Julia', text: 'We went to Cafe Bloom. Only Sarah and I joined btw', time: '2:40 PM', taroDetect: true, taroInsight: { text: '"Only Julia and Sarah joined" → Split Cafe Bloom with 2 people instead of 5. ₩25,000 each.', actionLabel: 'Update split' } },
      { id: 6, sender: 'sarah', name: 'Sarah', text: 'Their lavender latte was amazing', time: '2:42 PM' },
      { id: 7, sender: 'julia', name: 'Julia', text: 'Dinner tonight at Jeju Black Pork? Everyone come!', time: '6:00 PM' },
      { id: 8, sender: 'sarah', name: 'Sarah', text: "I'll pay first and we split — Taro will sort it", time: '6:05 PM', taroDetect: true, taroInsight: { text: 'Sarah said she will pay first and split later. Should I create a dinner expense draft?', actionLabel: 'Create expense draft' } },
    ],
  },
  {
    id: 'cafe-group',
    type: 'group',
    name: 'Cafe Outing',
    subtitle: '3 members',
    members: ['julia','sarah','alex'],
    lastMessage: 'Split 3-ways works for me',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, sender: 'sarah', name: 'Sarah', text: 'Anyone up for coffee this afternoon?', time: '1:00 PM' },
      { id: 2, sender: 'alex',  name: 'Alex',  text: "I'm in! Where?", time: '1:05 PM' },
      { id: 3, sender: 'julia', name: 'Julia', text: 'Cafe Bloom sounds good. I can cover and we split', time: '1:10 PM', taroDetect: true, taroInsight: { text: 'Julia offered to pay for the group. Should I create a Cafe Bloom expense draft split 3 ways?', actionLabel: 'Create expense' } },
      { id: 4, sender: 'alex',  name: 'Alex',  text: 'Split the bill between us?', time: '1:15 PM' },
      { id: 5, sender: 'sarah', name: 'Sarah', text: 'Split 3-ways works for me', time: '1:16 PM' },
    ],
  },
  {
    id: 'sarah-dm',
    type: 'dm',
    memberId: 'sarah',
    name: 'Sarah',
    subtitle: 'All settled',
    status: 'settled',
    balance: 0,
    lastMessage: 'I already paid my share!',
    lastTime: '2 min ago',
    unread: 1,
    messages: [
      { id: 1, sender: 'sarah', name: 'Sarah', text: 'Hey Julia! Did you get the transfer for the hotel?', time: '10:00 AM' },
      { id: 2, sender: 'julia', name: 'Julia', text: "Yes I got it! Thanks Sarah, you're always so reliable", time: '10:05 AM' },
      { id: 3, sender: 'sarah', name: 'Sarah', text: 'I already paid my share!', time: '10:06 AM' },
      { id: 4, sender: 'sarah', name: 'Sarah', text: 'Are we splitting dinner tonight too?', time: '10:08 AM' },
    ],
  },
  {
    id: 'alex-dm',
    type: 'dm',
    memberId: 'alex',
    name: 'Alex',
    subtitle: 'Pending · ₩10,000',
    status: 'pending',
    balance: 10000,
    lastMessage: "I'll transfer tonight",
    lastTime: 'Today',
    unread: 0,
    messages: [
      { id: 1, sender: 'alex',  name: 'Alex',  text: "Hey Julia! About the cafe — I'll pay you back soon, promise!", time: '3:00 PM' },
      { id: 2, sender: 'julia', name: 'Julia', text: 'No rush! Just ₩10,000 for the cafe split', time: '3:05 PM' },
      { id: 3, sender: 'alex',  name: 'Alex',  text: "Got it, I'll transfer tonight", time: '3:10 PM' },
    ],
    taroProactiveInsight: { text: 'Alex has a pending balance of ₩10,000. Would you like me to send a friendly reminder?', actionLabel: 'Send reminder', type: 'reminder' },
  },
  {
    id: 'john-dm',
    type: 'dm',
    memberId: 'john',
    name: 'John',
    subtitle: 'Overdue · ₩100,000',
    status: 'overdue',
    balance: 100000,
    lastMessage: 'Can I pay next week?',
    lastTime: '2 days ago',
    unread: 0,
    messages: [
      { id: 1, sender: 'john',  name: 'John',  text: "Hey, about the Jeju trip balance... can I pay next week?", time: '2 days ago' },
      { id: 2, sender: 'julia', name: 'Julia', text: "That's okay John, let me know when you can settle", time: '2 days ago' },
      { id: 3, sender: 'john',  name: 'John',  text: 'Thanks for understanding. Things have been tough lately', time: '2 days ago' },
    ],
    taroProactiveInsight: { text: "John's ₩100,000 balance is 7 days overdue. Taro suggests offering flexible repayment to avoid awkwardness.", actionLabel: 'Offer flex plan', type: 'flexible' },
  },
];

const MOCK_GROUPS = [
  { id: 'jeju',   name: 'Jeju Trip',          dates: 'Jun 15–17, 2025',    members: ['julia','sarah','alex','john','minho'], total: 463000, unsettled: 127500, icon: '✈', status: 'active' },
  { id: 'seoul',  name: 'Seoul Weekend',       dates: 'May 3–4, 2025',      members: ['julia','sarah','alex'],                total: 185000, unsettled: 0,       icon: '🏙', status: 'settled' },
  { id: 'dinner', name: 'Monthly Dinner Club', dates: 'Ongoing · May 2025', members: ['julia','sarah','minho'],               total: 45000,  unsettled: 15000,   icon: '🍽', status: 'ongoing' },
];

const TARO_RESPONSES = {
  'Why do I owe 17,500 KRW?': `Here's the breakdown:\n\n• KakaoTaxi: ₩6,000 (₩18,000 ÷ 3)\n• Jeju Shilla Hotel: ₩4,000 (shortfall from partial payment)\n• Jeju Stone Park ticket: ₩7,500 (late adjustment)\n\nTotal: ₩17,500 owed to Minho (taxi) and Julia (hotel remainder).`,
  'Who still owes me money?': `Three people owe you money:\n\n• Alex — ₩10,000 (pending, usually pays within 3 days)\n• Minho — ₩17,500 (extension requested)\n• John — ₩100,000 (overdue, 7 days past due)\n\nTotal owed to you: ₩127,500`,
  'How was the hotel split calculated?': `Jeju Shilla Hotel: ₩240,000 total\n\nSplit equally among 4 participants:\nJulia, Sarah, Alex, Minho\n\n₩240,000 ÷ 4 = ₩60,000 each\n\nJulia paid upfront. Others owe Julia ₩60,000 each.`,
  'Show unpaid balances': `Current unpaid balances for Jeju Trip:\n\n• Alex → Julia: ₩10,000 (pending)\n• Minho → Julia: ₩17,500 (extension)\n• John → Julia: ₩100,000 (overdue)\n\nTotal unsettled: ₩127,500`,
  'Settle the Jeju trip': `I can prepare a one-tap settlement for all 3 pending balances:\n\n• Alex: ₩10,000\n• Minho: ₩17,500\n• John: ₩100,000 (restricted — overdue)\n\nGo to Settle tab to review and approve.`,
  'Create a payment reminder for Alex': `I've drafted a reminder for Alex:\n\n"Hi Alex! Just a friendly note — your share for Jeju Trip is ₩10,000 (Cafe Bloom). Let me know when you can settle! No rush 😊"\n\nGo to Settle → Alex to send it.`,
  'Let Alex pay later': `Noted. I'll set Alex's balance as deferred. No reminder will be sent until you re-enable it.\n\nAlex currently owes ₩10,000 for Cafe Bloom.`,
  'Split dinner among everyone except John': `Updated: Jeju Black Pork ₩75,000\n\nParticipants: Julia, Sarah, Alex, Minho (4 people)\n₩75,000 ÷ 4 = ₩18,750 each\n\nJohn is excluded from this expense.`,
};

// ─── Helpers ─────────────────────────────────────────

const fmt = (n) => '₩' + Math.abs(n).toLocaleString('ko-KR');

const getHour = () => new Date().getHours();

const getGreeting = () => {
  const h = getHour();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

// ─── Sidebar ─────────────────────────────────────────

function Sidebar({ screen, onNavigate, walletBalance }) {
  const nav = [
    { id: 'home',    label: 'Home',     sym: '◉' },
    { id: 'wallet',  label: 'Wallet',   sym: '◈' },
    { id: 'groups',  label: 'Groups',   sym: '△' },
    { id: 'chat',    label: 'Chat',     sym: '◻', dot: true },
    { id: 'detect',  label: 'Detect',   sym: '◎', dot: true },
    { id: 'settle',  label: 'Settle',   sym: '✦' },
    { id: 'explain', label: 'Ask Taro', sym: '?' },
  ];

  return (
    <div id="sidebar">
      <div className="sidebar-logo">
        <div>
          <div className="logo-kr">따로따로</div>
          <div className="logo-en">TARO · AI EXPENSE</div>
        </div>
      </div>
      <div className="sidebar-user">
        <div className="avatar">JU</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>Julia</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{fmt(walletBalance)}</div>
        </div>
      </div>
      <ul className="nav-list">
        {nav.map(item => (
          <li
            key={item.id}
            className={`nav-item${screen === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{item.sym}</span>
            {item.label}
            {item.dot && screen !== item.id && <span className="nav-dot" />}
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <div style={{ fontSize: 10, color: 'var(--text-light)', textAlign: 'center' }}>따로따로 · prototype v0.2</div>
      </div>
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────

function BottomNav({ screen, onNavigate }) {
  const items = [
    { id: 'home',    label: 'Home',   sym: '◉' },
    { id: 'wallet',  label: 'Wallet', sym: '◈' },
    { id: 'groups',  label: 'Groups', sym: '△' },
    { id: 'settle',  label: 'Settle', sym: '✦' },
    { id: 'explain', label: 'Ask',    sym: '?' },
  ];
  return (
    <nav id="bottom-nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`bnav-item${screen === item.id ? ' active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span style={{ fontSize: 16, fontFamily: 'var(--font-mono)' }}>{item.sym}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── Proto Banner ─────────────────────────────────────

function ProtoBanner({ onClose }) {
  return (
    <div id="proto-banner">
      <span>Prototype · Demo data only · No real payments</span>
      <button onClick={onClose} title="Close">✕</button>
    </div>
  );
}

// ─── Home Screen ─────────────────────────────────────

function HomeScreen({ expenses, members, dismissedCards, onDismiss, onOpenModal, walletBalance, onNavigate, showToast }) {
  const suggestions = [
    {
      id: 'cafe-detect',
      type: 'type-wallet',
      icon: '☕',
      title: 'Cafe Bloom · ₩50,000',
      meta: 'Taro detected this from your wallet · Today 2:34 PM',
      primary: { label: 'Review & split', action: () => onOpenModal('approval', expenses.find(e => e.id === 'cafe')) },
      secondary: { label: 'Dismiss', action: () => onDismiss('cafe-detect') },
    },
    {
      id: 'hotel-email',
      type: 'type-email',
      icon: '🏨',
      title: 'Jeju Shilla Hotel · ₩240,000',
      meta: 'Detected from booking confirmation email · Jun 15',
      primary: { label: 'Add to Jeju Trip', action: () => onOpenModal('approval', expenses.find(e => e.id === 'hotel')) },
      secondary: { label: 'Dismiss', action: () => onDismiss('hotel-email') },
    },
    {
      id: 'john-overdue',
      type: 'type-warning',
      icon: '⚠',
      title: 'John owes ₩100,000 — overdue',
      meta: '7 days past due · Jeju Trip expenses',
      primary: { label: 'Send reminder', action: () => onOpenModal('reminder', members.find(m => m.id === 'john')) },
      secondary: { label: 'Ignore', action: () => onDismiss('john-overdue') },
    },
    {
      id: 'chat-cafe',
      type: 'type-chat',
      icon: '💬',
      title: 'Chat: "Only Sarah and I joined"',
      meta: 'Taro suggests splitting Cafe Bloom 2-ways → ₩25,000 each',
      primary: { label: 'Update split', action: () => { showToast('Split updated: Cafe Bloom → 2 people'); onDismiss('chat-cafe'); } },
      secondary: { label: 'Ignore', action: () => onDismiss('chat-cafe') },
    },
    {
      id: 'wallet-low',
      type: 'type-wallet',
      icon: '◈',
      title: 'Wallet balance · ₩120,000',
      meta: 'Auto-settle limit is ₩30,000 · 4 pending settlements queued',
      primary: { label: 'Top up wallet', action: () => onOpenModal('topup', {}) },
      secondary: { label: 'Dismiss', action: () => onDismiss('wallet-low') },
    },
  ].filter(s => !dismissedCards.has(s.id));

  const activity = [
    { id: 1, dot: 'dot-green',  text: 'Sarah settled Dinner · ₩25,000', time: '2 min ago' },
    { id: 2, dot: 'dot-muted',  text: 'Cafe Bloom · ₩50,000 detected', time: 'Today 2:34' },
    { id: 3, dot: 'dot-orange', text: 'John balance overdue · ₩100,000', time: 'Yesterday' },
    { id: 4, dot: 'dot-green',  text: 'Alex settled Taxi · ₩6,000', time: '3 days ago' },
  ];

  const quickCmds = [
    'Who still owes me money?',
    'Show unpaid balances',
    'Create a payment reminder for Alex',
    'Settle the Jeju trip',
    'Split dinner among everyone except John',
  ];

  return (
    <div className="screen">
      <h1 className="screen-title">{getGreeting()}, Julia</h1>
      <p className="screen-sub">Jeju Trip · 3 unsettled balances · ₩127,500 outstanding</p>

      {suggestions.length > 0 && (
        <>
          <div className="section-heading">Taro Suggestions</div>
          {suggestions.map(s => (
            <div key={s.id} className={`card card-sm suggestion-card ${s.type}`} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.meta}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn btn-primary" style={{ fontSize: 12, padding: '5px 14px' }} onClick={s.primary.action}>{s.primary.label}</button>
                <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 14px' }} onClick={s.secondary.action}>{s.secondary.label}</button>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="section-heading">Quick Commands</div>
      <div className="quick-cmds" style={{ marginBottom: 24 }}>
        {quickCmds.map(cmd => (
          <button key={cmd} className="quick-cmd" onClick={() => onNavigate('explain')}>{cmd}</button>
        ))}
      </div>

      <div className="section-heading">Recent Activity</div>
      <div className="activity-list">
        {activity.map(item => (
          <div key={item.id} className="activity-item">
            <div className={`activity-dot ${item.dot}`} />
            <div style={{ flex: 1, fontSize: 13 }}>{item.text}</div>
            <div style={{ fontSize: 11, color: 'var(--text-light)', whiteSpace: 'nowrap' }}>{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Wallet Screen ────────────────────────────────────

function WalletScreen({ walletBalance, setWalletBalance, transactions, autoSettle, setAutoSettle, autoSettleLimit, setAutoSettleLimit, onOpenModal, showToast }) {
  return (
    <div className="screen">
      <h1 className="screen-title">Wallet</h1>
      <p className="screen-sub">Your Taro balance · Auto-settle enabled</p>

      <div className="wallet-card">
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 6 }}>Available Balance</div>
        <div className="amount-lg">{fmt(walletBalance)}</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 20 }}>Taro Wallet · Julia · KRW</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.35)', color: 'white', boxShadow: 'none', fontSize: 13 }} onClick={() => onOpenModal('topup', {})}>↑ Top Up</button>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.35)', color: 'white', boxShadow: 'none', fontSize: 13 }} onClick={() => onOpenModal('withdraw', {})}>↓ Withdraw</button>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.35)', color: 'white', boxShadow: 'none', fontSize: 13 }} onClick={() => onOpenModal('transfer', {})}>→ Transfer</button>
        </div>
      </div>

      <div className="card card-sm">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Auto-Settle</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Automatically pay shared expenses under limit</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={autoSettle} onChange={e => setAutoSettle(e.target.checked)} />
            <span className="toggle-track" />
          </label>
        </div>
        {autoSettle && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--border-light)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Auto-settle limit per transaction</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[10000, 20000, 30000, 50000].map(amt => (
                <button
                  key={amt}
                  className={`preset-btn${autoSettleLimit === amt ? ' selected' : ''}`}
                  onClick={() => { setAutoSettleLimit(amt); showToast(`Limit set to ${fmt(amt)}`); }}
                >
                  {fmt(amt)}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
              Current limit: <span className="amount" style={{ fontWeight: 600, color: 'var(--text)' }}>{fmt(autoSettleLimit)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="section-heading">Transaction History</div>
      <div className="activity-list">
        {transactions.map(tx => (
          <div key={tx.id} className="activity-item">
            <div style={{ fontSize: 18, width: 28, textAlign: 'center', flexShrink: 0 }}>{tx.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{tx.desc}</div>
              <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{tx.date}</div>
            </div>
            <div className="amount" style={{ fontWeight: 600, color: tx.type === 'in' ? 'var(--green)' : 'var(--text)', whiteSpace: 'nowrap', fontSize: 13 }}>
              {tx.type === 'in' ? '+' : '-'}{fmt(tx.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Groups Screen ────────────────────────────────────

function GroupsScreen({ selectedGroup, setSelectedGroup, members, expenses, onOpenModal, showToast }) {
  const groups = MOCK_GROUPS;
  const getMember = (id) => members.find(m => m.id === id);

  if (selectedGroup) {
    const g = selectedGroup;
    const grpMembers = g.members.map(getMember).filter(Boolean);
    const grpExpenses = expenses.filter(e => e.participants.some(p => g.members.includes(p)));
    const total = g.total;
    const perPerson = Math.round(total / grpMembers.length);
    const settledPct = Math.round(((total - g.unsettled) / total) * 100);

    const catTotals = {};
    grpExpenses.forEach(e => {
      catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
    });
    const maxCat = Math.max(...Object.values(catTotals), 1);

    return (
      <div className="screen">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button className="btn btn-ghost" style={{ padding: '5px 10px' }} onClick={() => setSelectedGroup(null)}>← Back</button>
          <div>
            <h1 className="screen-title" style={{ marginBottom: 0 }}>{g.icon} {g.name}</h1>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{g.dates}</div>
          </div>
          {g.id === 'jeju' && (
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Trip Code</div>
              <div className="amount" style={{ fontSize: 13, fontWeight: 700, border: '1.5px solid var(--border-light)', borderRadius: 4, padding: '3px 10px', marginTop: 2 }}>JEJU-25</div>
            </div>
          )}
        </div>

        <div className="card card-sm" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {[
              { label: 'Total Spent', value: fmt(total) },
              { label: 'Per Person', value: fmt(perPerson) },
              { label: 'Unsettled', value: fmt(g.unsettled) },
              { label: 'Members', value: grpMembers.length },
            ].map((stat, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0 8px', borderRight: i < 3 ? '1px dashed var(--border-light)' : 'none' }}>
                <div className="amount" style={{ fontSize: 16, fontWeight: 600 }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-sm" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Settlement Health</div>
            <div style={{ fontSize: 12, color: settledPct === 100 ? 'var(--green)' : 'var(--orange)' }}>{settledPct}% settled</div>
          </div>
          <div className="progress-wrap">
            <div className="progress-fill" style={{ width: `${settledPct}%` }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
            {fmt(total - g.unsettled)} settled · {fmt(g.unsettled)} remaining
          </div>
        </div>

        <div className="section-heading">Members</div>
        <div className="members-grid" style={{ marginBottom: 14 }}>
          {grpMembers.map(m => (
            <div key={m.id} className="member-card">
              <div className="avatar" style={{ flexShrink: 0 }}>{m.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Paid {fmt(m.paidTotal)}</div>
                <div style={{ marginTop: 4 }}>
                  {m.owes > 0
                    ? <span className="amount" style={{ fontSize: 12, color: m.status === 'overdue' ? 'var(--red)' : m.status === 'extension' ? 'var(--orange)' : 'var(--text-muted)' }}>owes {fmt(m.owes)}</span>
                    : <span style={{ fontSize: 11, color: 'var(--green)' }}>✓ settled</span>
                  }
                </div>
              </div>
              <span className={`label-tag tag-${m.status === 'extension' ? 'ext' : m.status}`}>{m.status}</span>
            </div>
          ))}
        </div>

        <div className="section-heading">Spending by Category</div>
        <div className="card card-sm" style={{ marginBottom: 14 }}>
          {Object.entries(catTotals).map(([cat, amt]) => (
            <div key={cat} className="cat-row">
              <div style={{ fontSize: 12, width: 110, flexShrink: 0 }}>{cat}</div>
              <div className="cat-bar-wrap">
                <div className="cat-bar" style={{ width: `${(amt / maxCat) * 100}%` }} />
              </div>
              <div className="amount" style={{ fontSize: 12, width: 70, textAlign: 'right', flexShrink: 0 }}>{fmt(amt)}</div>
            </div>
          ))}
        </div>

        {g.unsettled > 0 && (
          <div className="card card-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Ready to settle up?</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{fmt(g.unsettled)} across 3 members</div>
            </div>
            <button className="btn btn-primary" onClick={() => onOpenModal('settle-all', { group: g })}>
              One-tap Settle All
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="screen">
      <h1 className="screen-title">Groups</h1>
      <p className="screen-sub">Your shared expense groups</p>

      {groups.map(g => (
        <div
          key={g.id}
          className="card group-card"
          onClick={() => setSelectedGroup(g)}
          style={{ marginBottom: 12 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1 }}>
              <span style={{ fontSize: 24 }}>{g.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 17 }}>{g.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{g.dates} · {g.members.length} members</div>
              </div>
            </div>
            <span className={`label-tag tag-${g.status === 'active' ? 'pending' : g.status === 'settled' ? 'settled' : 'ext'}`}>{g.status}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--border-light)' }}>
            <div>
              <div className="amount" style={{ fontSize: 16, fontWeight: 600 }}>{fmt(g.total)}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>total spent</div>
            </div>
            {g.unsettled > 0 ? (
              <div style={{ textAlign: 'right' }}>
                <div className="amount" style={{ fontSize: 14, fontWeight: 600, color: 'var(--orange)' }}>{fmt(g.unsettled)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>unsettled</div>
              </div>
            ) : (
              <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>✓ All settled</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Chat Screen ──────────────────────────────────────

function ChatScreen({ members, showToast, onOpenModal }) {
  const [rooms, setRooms] = useState(CHAT_ROOMS);
  const [activeId, setActiveId] = useState('jeju-group');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [dismissedInsights, setDismissedInsights] = useState(new Set());
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'
  const messagesEndRef = useRef(null);

  const activeRoom = rooms.find(r => r.id === activeId);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeId, rooms]);

  const expenseKeywords = ['pay', 'split', 'owe', 'cover', 'bill', 'receipt', '₩', 'won', 'transfer', 'debt', 'reimburse'];

  const sendMessage = () => {
    if (!input.trim()) return;
    const text = input.trim();
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newMsg = { id: Date.now(), sender: 'julia', name: 'Julia', text, time: now };
    const hasKeyword = expenseKeywords.some(kw => text.toLowerCase().includes(kw));
    const newMsgs = [...(activeRoom?.messages || []), newMsg];

    if (hasKeyword) {
      const isGroup = activeRoom?.type === 'group';
      let insight;
      if (isGroup) {
        insight = 'Taro detected an expense mention. Should I create an expense draft from this message?';
      } else if (activeRoom?.status === 'overdue') {
        insight = `You mentioned money with ${activeRoom.name} (${fmt(activeRoom.balance)} overdue). Would you like Taro to draft a reminder or offer flexible repayment?`;
      } else {
        insight = `You mentioned money with ${activeRoom.name}. Would you like Taro to create a reminder or log this as an expense?`;
      }
      newMsgs.push({ id: Date.now() + 1, sender: '_taro', taroInsightNew: true, insight, time: now });
    }

    setRooms(prev => prev.map(r =>
      r.id === activeId ? { ...r, messages: newMsgs, lastMessage: text, lastTime: 'now', unread: 0 } : r
    ));
    setInput('');
  };

  const getMember = (id) => members.find(m => m.id === id) || { initials: (id || 'XX').substring(0, 2).toUpperCase(), name: id };
  const dismissInsight = (key) => setDismissedInsights(prev => new Set([...prev, key]));
  const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const statusColor = { settled: 'var(--green)', pending: 'var(--orange)', overdue: 'var(--red)' };

  const openChat = (id) => { setActiveId(id); setInput(''); setMobileView('chat'); };

  // ── Chat list panel ──
  const ListPanel = (
    <div className="chat-list-panel">
      <div className="chat-list-top">
        <div className="chat-list-title">Messages</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-primary" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => showToast('Add Friend — coming soon')}>+ Friend</button>
          <button className="btn" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => showToast('Create Group — coming soon')}>+ Group</button>
        </div>
      </div>
      <div className="chat-search-wrap">
        <input className="chat-search-input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="chat-list-items">
        {filteredRooms.map(room => (
          <div key={room.id} className={`chat-list-item${activeId === room.id ? ' active' : ''}`} onClick={() => openChat(room.id)}>
            <div className="chat-list-avatar">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>
                {room.type === 'group' ? room.name.charAt(0) : getMember(room.memberId).initials}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{room.name}</span>
                <span style={{ fontSize: 10, color: 'var(--text-light)', flexShrink: 0, marginLeft: 6 }}>{room.lastTime}</span>
              </div>
              <div style={{ fontSize: 11, color: room.status ? statusColor[room.status] || 'var(--text-muted)' : 'var(--text-muted)', marginTop: 1 }}>{room.subtitle}</div>
              <div style={{ fontSize: 11, color: 'var(--text-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{room.lastMessage}</div>
            </div>
            {room.unread > 0 && (
              <div style={{ width: 18, height: 18, background: 'var(--text)', color: 'white', borderRadius: '50%', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 6 }}>{room.unread}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Active chat window ──
  const ChatWindow = activeRoom ? (
    <div className="chat-main-panel">
      {/* Header */}
      <div className="chat-header">
        <button className="chat-back-btn btn btn-ghost" onClick={() => setMobileView('list')}>←</button>
        <div className="chat-list-avatar" style={{ width: 34, height: 34 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>
            {activeRoom.type === 'group' ? activeRoom.name.charAt(0) : getMember(activeRoom.memberId).initials}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-serif)' }}>{activeRoom.name}</div>
          <div style={{ fontSize: 11, color: activeRoom.status ? statusColor[activeRoom.status] || 'var(--text-muted)' : 'var(--text-muted)' }}>
            {activeRoom.type === 'group'
              ? `${activeRoom.members.length} members · Taro monitoring`
              : activeRoom.subtitle}
          </div>
        </div>
        {activeRoom.type === 'dm' && activeRoom.balance > 0 && (
          <button className="btn btn-primary" style={{ fontSize: 11, padding: '5px 12px', flexShrink: 0 }}
            onClick={() => onOpenModal('wallet-settle', members.find(m => m.id === activeRoom.memberId))}>
            Settle {fmt(activeRoom.balance)}
          </button>
        )}
      </div>

      {/* Proactive Taro banner for DMs */}
      {activeRoom.taroProactiveInsight && !dismissedInsights.has(`pro-${activeRoom.id}`) && (
        <div className="chat-taro-proactive">
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>✦ TARO</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{activeRoom.taroProactiveInsight.text}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" style={{ fontSize: 11, padding: '4px 12px' }} onClick={() => {
              const m = members.find(mb => mb.id === activeRoom.memberId);
              if (activeRoom.taroProactiveInsight.type === 'reminder') onOpenModal('reminder', m);
              else if (activeRoom.taroProactiveInsight.type === 'flexible') onOpenModal('flexible', m);
              dismissInsight(`pro-${activeRoom.id}`);
            }}>{activeRoom.taroProactiveInsight.actionLabel}</button>
            <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 12px' }} onClick={() => dismissInsight(`pro-${activeRoom.id}`)}>Dismiss</button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {activeRoom.messages.map(msg => {
          const isMe = msg.sender === 'julia';

          if (msg.taroInsightNew) {
            return (
              <div key={msg.id} className="chat-taro-insight" style={{ alignSelf: 'center', maxWidth: '82%' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>✦ TARO INSIGHT</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{msg.insight}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ fontSize: 11, padding: '4px 12px' }} onClick={() => showToast('Done!')}>Action</button>
                  <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 12px' }}>Ignore</button>
                </div>
              </div>
            );
          }

          if (msg.taroDetect && !dismissedInsights.has(`msg-${msg.id}`)) {
            return (
              <React.Fragment key={msg.id}>
                <div className={`chat-bubble-wrap${isMe ? ' mine' : ''}`}>
                  {!isMe && <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, flexShrink: 0 }}>{getMember(msg.sender).initials}</div>}
                  <div>
                    {!isMe && <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 3 }}>{msg.name}</div>}
                    <div className={`chat-bubble ${isMe ? 'mine' : 'theirs'}`}>{msg.text}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 3 }}>{msg.time}</div>
                  </div>
                </div>
                <div className="chat-taro-insight" style={{ alignSelf: 'center', maxWidth: '82%' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>✦ TARO DETECTED</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{msg.taroInsight.text}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" style={{ fontSize: 11, padding: '4px 12px' }}
                      onClick={() => { showToast(msg.taroInsight.actionLabel); dismissInsight(`msg-${msg.id}`); }}>
                      {msg.taroInsight.actionLabel}
                    </button>
                    <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 12px' }} onClick={() => dismissInsight(`msg-${msg.id}`)}>Ignore</button>
                  </div>
                </div>
              </React.Fragment>
            );
          }

          return (
            <div key={msg.id} className={`chat-bubble-wrap${isMe ? ' mine' : ''}`}>
              {!isMe && <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, flexShrink: 0 }}>{getMember(msg.sender).initials}</div>}
              <div>
                {!isMe && <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 3 }}>{msg.name}</div>}
                <div className={`chat-bubble ${isMe ? 'mine' : 'theirs'}`}>{msg.text}</div>
                <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 3 }}>{msg.time}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder={`Message ${activeRoom.name}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button className="chat-send" onClick={sendMessage}>Send</button>
      </div>
    </div>
  ) : (
    <div className="chat-main-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
      Select a chat to start
    </div>
  );

  return (
    <div className={`chat-screen-wrap${mobileView === 'chat' ? ' mobile-chat-open' : ''}`}>
      {ListPanel}
      {ChatWindow}
    </div>
  );
}

// ─── Detect Screen ────────────────────────────────────

function DetectScreen({ expenses, onOpenModal, showToast }) {
  const [activeSource, setActiveSource] = useState('wallet');

  const sources = [
    { id: 'wallet', name: 'Wallet',   icon: '◈', status: 'Connected' },
    { id: 'email',  name: 'Email',    icon: '✉', status: 'Connected' },
    { id: 'chat',   name: 'Chat',     icon: '💬', status: 'Active' },
    { id: 'calls',  name: 'Calls',    icon: '📞', status: 'Inactive' },
  ];

  const detected = {
    wallet: [
      { id: 'cafe',  icon: '☕', merchant: 'Cafe Bloom', meta: 'Today 2:34 PM · ₩50,000', confidence: '94% confidence', locked: false },
      { id: 'taxi',  icon: '🚕', merchant: 'KakaoTaxi',  meta: 'Today 1:20 PM · ₩18,000', confidence: '88% confidence', locked: false },
    ],
    email: [
      { id: 'hotel',   icon: '🏨', merchant: 'Jeju Shilla Hotel', meta: 'Booking confirmation · Jun 15 · ₩240,000', confidence: '99% confidence', locked: false },
      { id: 'tickets', icon: '🎡', merchant: 'Jeju Stone Park',   meta: 'Ticket email · Jun 16 · ₩80,000',         confidence: '97% confidence', locked: false },
      { id: 'flight',  icon: '✈', merchant: 'Jeju Air KE121',    meta: 'Itinerary · Jun 15 · ₩375,000',           confidence: '99% confidence', locked: false },
    ],
    chat: [
      { id: 'chat-cafe',   icon: '💬', merchant: '"Only Sarah and I joined"', meta: 'Jeju Trip chat · Today 2:40 PM', confidence: 'Split update suggested', locked: false },
    ],
    calls: [
      { id: 'call1', icon: '📞', merchant: 'Call with Minho — expense mention', meta: 'Jun 14 · On-device analysis', confidence: 'Enable to view', locked: true },
    ],
  };

  const currentItems = detected[activeSource] || [];

  return (
    <div className="screen">
      <h1 className="screen-title">Detected Expenses</h1>
      <p className="screen-sub">Taro automatically finds shared expenses from your sources</p>

      <div className="sources-grid">
        {sources.map(s => (
          <div
            key={s.id}
            className={`source-card${activeSource === s.id ? ' active' : ''}`}
            onClick={() => setActiveSource(s.id)}
          >
            <div className="source-icon">{s.icon}</div>
            <div className="source-name">{s.name}</div>
            <div className="source-status">{s.status}</div>
          </div>
        ))}
      </div>

      <div className="card card-sm" style={{ marginBottom: 14 }}>
        {currentItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>No items detected from this source</div>
        )}
        {currentItems.map((item, i) => (
          <div key={item.id} className="detect-row" style={{ opacity: item.locked ? 0.5 : 1 }}>
            <span style={{ fontSize: 22, width: 32, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{item.merchant}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.meta}</div>
              <div style={{ fontSize: 11, color: item.locked ? 'var(--text-light)' : 'var(--green)', marginTop: 2, fontWeight: 600 }}>{item.confidence}</div>
            </div>
            {!item.locked ? (
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button className="btn btn-primary" style={{ fontSize: 11, padding: '4px 12px' }} onClick={() => {
                  const exp = expenses.find(e => e.id === item.id);
                  if (exp) onOpenModal('approval', exp);
                  else showToast('Added to expenses');
                }}>Add</button>
                <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 12px' }} onClick={() => showToast('Dismissed')}>✕</button>
              </div>
            ) : (
              <button className="btn" style={{ fontSize: 11, padding: '4px 12px' }} onClick={() => showToast('Feature requires consent — coming soon')}>Enable</button>
            )}
          </div>
        ))}
      </div>

      <div className="section-heading">Add Manually</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {['Receipt photo', 'Enter amount', 'From bank', 'Import CSV'].map(label => (
          <button key={label} className="btn" style={{ flexDirection: 'column', padding: '14px 8px', gap: 6, fontSize: 12, height: 'auto', textAlign: 'center' }} onClick={() => showToast(`${label} — coming soon`)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Settle Screen ────────────────────────────────────

function SettleScreen({ members, setMembers, expenses, setExpenses, setTransactions, walletBalance, setWalletBalance, onOpenModal, showToast }) {
  const others = members.filter(m => m.id !== 'julia');
  const totalOwed = others.reduce((sum, m) => sum + m.owes, 0);

  return (
    <div className="screen">
      <h1 className="screen-title">Settle Up</h1>
      <p className="screen-sub">Track and resolve outstanding balances</p>

      <div className="card card-sm" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total owed to you</div>
            <div className="amount-lg" style={{ fontSize: 28, marginTop: 2 }}>{fmt(totalOwed)}</div>
          </div>
          <button className="btn btn-primary" onClick={() => onOpenModal('settle-all', { group: MOCK_GROUPS[0] })}>Settle All</button>
        </div>
        <div className="divider" />
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { label: 'Pending', count: others.filter(m => m.status === 'pending').length, color: 'var(--orange)' },
            { label: 'Overdue', count: others.filter(m => m.status === 'overdue').length, color: 'var(--red)' },
            { label: 'Extension', count: others.filter(m => m.status === 'extension').length, color: 'var(--text-muted)' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {others.some(m => m.status === 'overdue') && (
        <div className="card card-sm" style={{ borderColor: 'var(--red)', borderLeftWidth: 4, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18 }}>⚠</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>John's balance is overdue</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>₩100,000 · 7 days past due. Auto-settle is restricted. Consider sending a reminder.</div>
            </div>
          </div>
        </div>
      )}

      <div className="section-heading">Balances</div>
      <div style={{ border: '1px solid var(--border-light)', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
        {others.map(m => (
          <div key={m.id} className="friend-row">
            <div className="avatar">{m.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                {m.owes === 0 ? 'All settled' : `Owes you ${fmt(m.owes)}`}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className={`label-tag tag-${m.status === 'extension' ? 'ext' : m.status}`}>{m.status}</span>
              {m.owes > 0 && (
                <button
                  className="btn btn-primary"
                  style={{ fontSize: 11, padding: '4px 12px' }}
                  onClick={() => onOpenModal('wallet-settle', m)}
                >
                  Settle
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="section-heading">Settlement Scores</div>
      <div style={{ border: '1px solid var(--border-light)', borderRadius: 8, overflow: 'hidden' }}>
        {others.map(m => (
          <div key={m.id} style={{ padding: '12px 16px', borderBottom: '1px dashed var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar" style={{ width: 26, height: 26, fontSize: 10 }}>{m.initials}</div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</span>
              </div>
              <span className="amount" style={{ fontSize: 14, fontWeight: 700, color: m.score >= 90 ? 'var(--green)' : m.score >= 80 ? 'var(--orange)' : 'var(--red)' }}>{m.score}</span>
            </div>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${m.score}%`, background: m.score >= 90 ? 'var(--green)' : m.score >= 80 ? 'var(--orange)' : 'var(--red)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Ask Taro Screen ──────────────────────────────────

function ExplainScreen({ explainMessages, setExplainMessages, members, expenses, walletBalance, showToast, onNavigate }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [explainMessages]);

  const quickQuestions = [
    'Who still owes me money?',
    'Why do I owe 17,500 KRW?',
    'How was the hotel split calculated?',
    'Show unpaid balances',
    'Settle the Jeju trip',
    'Create a payment reminder for Alex',
    'Let Alex pay later',
    'Split dinner among everyone except John',
  ];

  const ask = (q) => {
    const userMsg = { role: 'user', text: q };
    const taroMsg = {
      role: 'taro',
      text: TARO_RESPONSES[q] || "I'm analyzing that for you...\n\nBased on the current trip data, let me check the balances and expense history. Everything looks to be tracked correctly. Is there a specific expense you'd like me to explain in detail?",
    };
    setExplainMessages(prev => [...prev, userMsg, taroMsg]);
    setInput('');
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    ask(input.trim());
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Ask Taro</h1>
      <p className="screen-sub">Ask anything about your expenses, balances, or splits</p>

      <div className="qq-grid">
        {quickQuestions.map(q => (
          <button key={q} className="qq-btn" onClick={() => ask(q)}>{q}</button>
        ))}
      </div>

      <div className="explain-wrap">
        <div className="explain-messages">
          {explainMessages.map((msg, idx) => (
            <div key={idx} className={`explain-bubble ${msg.role === 'taro' ? 'taro-bubble' : 'user-bubble'}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="explain-input-row">
          <input
            className="explain-input"
            placeholder="Ask Taro anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <button className="explain-send" onClick={handleSubmit}>Ask</button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Renderer ───────────────────────────────────

function ModalRenderer({ modal, onClose, members, setMembers, expenses, setExpenses, transactions, setTransactions, walletBalance, setWalletBalance, showToast }) {
  const { type, data } = modal;
  const getMember = (id) => members.find(m => m.id === id);

  const commonClose = (
    <button className="modal-close" onClick={onClose}>✕</button>
  );

  // ── Approval Modal ──
  if (type === 'approval' && data) {
    return <ApprovalModal expense={data} onClose={onClose} members={members} setMembers={setMembers} expenses={expenses} setExpenses={setExpenses} setTransactions={setTransactions} walletBalance={walletBalance} setWalletBalance={setWalletBalance} showToast={showToast} getMember={getMember} />;
  }

  // ── Reminder Modal ──
  if (type === 'reminder' && data) {
    return <ReminderModal member={data} onClose={onClose} showToast={showToast} />;
  }

  // ── Top Up Modal ──
  if (type === 'topup') {
    return <TopUpModal onClose={onClose} walletBalance={walletBalance} setWalletBalance={setWalletBalance} setTransactions={setTransactions} showToast={showToast} />;
  }

  // ── Withdraw Modal ──
  if (type === 'withdraw') {
    return <WithdrawModal onClose={onClose} walletBalance={walletBalance} setWalletBalance={setWalletBalance} setTransactions={setTransactions} showToast={showToast} />;
  }

  // ── Transfer Modal ──
  if (type === 'transfer') {
    return <TransferModal onClose={onClose} members={members} walletBalance={walletBalance} setWalletBalance={setWalletBalance} setTransactions={setTransactions} showToast={showToast} />;
  }

  // ── Wallet Settle (individual) ──
  if (type === 'wallet-settle' && data) {
    return <WalletSettleModal member={data} onClose={onClose} members={members} setMembers={setMembers} walletBalance={walletBalance} setWalletBalance={setWalletBalance} setTransactions={setTransactions} showToast={showToast} />;
  }

  // ── Settle All Modal ──
  if (type === 'settle-all') {
    return <SettleAllModal onClose={onClose} members={members} setMembers={setMembers} walletBalance={walletBalance} setWalletBalance={setWalletBalance} setTransactions={setTransactions} setExpenses={setExpenses} showToast={showToast} />;
  }

  // ── Flexible Modal ──
  if (type === 'flexible' && data) {
    return <FlexibleModal member={data} onClose={onClose} showToast={showToast} />;
  }

  return null;
}

// ── Approval Modal ──

function ApprovalModal({ expense, onClose, members, setMembers, expenses, setExpenses, setTransactions, walletBalance, setWalletBalance, showToast, getMember }) {
  const [participants, setParticipants] = useState(expense.participants);
  const count = participants.length;
  const perPerson = count > 0 ? Math.round(expense.amount / count) : 0;
  const payer = getMember(expense.payer);

  const toggleParticipant = (id) => {
    if (id === expense.payer) return;
    setParticipants(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const approve = () => {
    const nonPayers = participants.filter(p => p !== expense.payer);
    let newWallet = walletBalance;

    setMembers(prev => prev.map(m => {
      if (m.id === expense.payer) {
        return { ...m, wallet: m.wallet + perPerson * nonPayers.length };
      }
      if (nonPayers.includes(m.id)) {
        const newWal = m.wallet - perPerson;
        const newOwes = Math.max(0, m.owes - perPerson);
        return { ...m, wallet: newWal, owes: newOwes, status: newOwes === 0 ? 'settled' : m.status };
      }
      return m;
    }));

    if (expense.payer === 'julia') {
      newWallet = walletBalance + perPerson * nonPayers.length;
    } else if (participants.includes('julia')) {
      newWallet = walletBalance - perPerson;
    }
    setWalletBalance(newWallet);

    setExpenses(prev => prev.map(e => e.id === expense.id ? { ...e, status: 'settled' } : e));

    const newTx = nonPayers.map((pid, i) => ({
      id: Date.now() + i,
      desc: `${getMember(pid)?.name || pid} → ${expense.merchant}`,
      amount: perPerson,
      type: 'in',
      date: 'Just now',
      icon: expense.icon,
    }));
    setTransactions(prev => [...newTx, ...prev]);

    showToast('Settlement approved!', 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Review & Approve Settlement</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Taro detected this expense</div>

        <div style={{ background: '#F5F5F3', border: '1px solid var(--border-light)', borderRadius: 6, padding: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{expense.icon} {expense.merchant}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{expense.category} · {expense.date}</div>
            </div>
            <div className="amount" style={{ fontSize: 20, fontWeight: 700 }}>{fmt(expense.amount)}</div>
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="avatar" style={{ width: 24, height: 24, fontSize: 10 }}>{getMember(expense.payer)?.initials}</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Paid by <strong>{getMember(expense.payer)?.name}</strong></span>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>Participants (click to remove)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {members.map(m => (
              <span
                key={m.id}
                className={`chip removable${!participants.includes(m.id) ? ' removed' : ''}`}
                onClick={() => toggleParticipant(m.id)}
              >
                {m.initials} {m.name}
                {m.id === expense.payer && ' (payer)'}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
            {count} participants · <span className="amount" style={{ fontWeight: 600, color: 'var(--text)' }}>{fmt(perPerson)} each</span>
          </div>
        </div>

        <div className="divider" />
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>Transfers that will happen</div>
        {participants.filter(p => p !== expense.payer).map(pid => {
          const m = getMember(pid);
          return (
            <div key={pid} className="transfer-row">
              <div className="avatar" style={{ width: 26, height: 26, fontSize: 10 }}>{m?.initials}</div>
              <span style={{ fontSize: 13 }}>{m?.name}</span>
              <span className="transfer-arrow">→</span>
              <div className="avatar" style={{ width: 26, height: 26, fontSize: 10 }}>{payer?.initials}</div>
              <span style={{ fontSize: 13 }}>{payer?.name}</span>
              <span className="amount" style={{ marginLeft: 'auto', fontWeight: 600 }}>{fmt(perPerson)}</span>
            </div>
          );
        })}

        <div className="divider" />
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>Wallet balances after</div>
        {participants.map(pid => {
          const m = getMember(pid);
          if (!m) return null;
          const delta = pid === expense.payer ? perPerson * (participants.length - 1) : -perPerson;
          const after = (pid === 'julia' ? walletBalance : m.wallet) + delta;
          return (
            <div key={pid} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: '1px dashed var(--border-light)' }}>
              <span>{m.name}</span>
              <span className="amount" style={{ color: delta > 0 ? 'var(--green)' : 'var(--text-muted)' }}>
                {fmt(pid === 'julia' ? walletBalance : m.wallet)} → {fmt(after)}
                <span style={{ marginLeft: 6, fontSize: 11 }}>{delta > 0 ? '+' : ''}{fmt(delta)}</span>
              </span>
            </div>
          );
        })}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={approve}>Approve Settlement</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Reminder Modal ──

function ReminderModal({ member, onClose, showToast }) {
  const tones = ['Close friend', 'Neutral', 'Formal'];
  const [tone, setTone] = useState('Neutral');
  const defaultMessages = {
    'Close friend': `Hey ${member.name}! Just a quick reminder — you still owe ₩${member.owes.toLocaleString()} for Jeju Trip. No biggie, pay whenever! 😊`,
    'Neutral': `Hi ${member.name}, just a reminder that ₩${member.owes.toLocaleString()} is still outstanding for Jeju Trip. Please settle at your earliest convenience.`,
    'Formal': `Dear ${member.name}, this is a notice that ₩${member.owes.toLocaleString()} remains unsettled for the Jeju Trip shared expense group. Please arrange payment at your earliest convenience.`,
  };
  const [msg, setMsg] = useState(defaultMessages['Neutral']);

  useEffect(() => {
    setMsg(defaultMessages[tone]);
  }, [tone]);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Reminder for {member.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{fmt(member.owes)} outstanding · {member.status}</div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>Tone</div>
          <div className="tone-options">
            {tones.map(t => (
              <button key={t} className={`tone-btn${tone === t ? ' active' : ''}`} onClick={() => setTone(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>Message</div>
          <textarea
            className="input"
            style={{ minHeight: 100, resize: 'vertical', lineHeight: 1.6, fontSize: 13 }}
            value={msg}
            onChange={e => setMsg(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { showToast(`Reminder sent to ${member.name}`, 'success'); onClose(); }}>
            Send Reminder
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Top-Up Modal ──

function TopUpModal({ onClose, walletBalance, setWalletBalance, setTransactions, showToast }) {
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState('');
  const presets = [10000, 30000, 50000, 100000];

  const amount = selected || (parseInt(custom.replace(/[^0-9]/g, '')) || 0);

  const topUp = () => {
    if (!amount || amount <= 0) { showToast('Enter a valid amount'); return; }
    setWalletBalance(prev => prev + amount);
    setTransactions(prev => [{ id: Date.now(), desc: 'Wallet top-up', amount, type: 'in', date: 'Just now', icon: '↓' }, ...prev]);
    showToast(`Wallet topped up by ${fmt(amount)}`, 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Top Up Wallet</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Current balance: <span className="amount" style={{ fontWeight: 600 }}>{fmt(walletBalance)}</span></div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {presets.map(p => (
            <button key={p} className={`preset-btn${selected === p ? ' selected' : ''}`} onClick={() => { setSelected(p); setCustom(''); }}>{fmt(p)}</button>
          ))}
        </div>

        <input
          className="input"
          placeholder="Or enter custom amount..."
          value={custom}
          onChange={e => { setCustom(e.target.value); setSelected(null); }}
          style={{ marginBottom: 16 }}
        />

        {amount > 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            After top-up: <span className="amount" style={{ fontWeight: 600 }}>{fmt(walletBalance + amount)}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={topUp}>Top Up {amount > 0 ? fmt(amount) : ''}</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Withdraw Modal ──

function WithdrawModal({ onClose, walletBalance, setWalletBalance, setTransactions, showToast }) {
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState('');
  const presets = [10000, 30000, 50000, 100000];

  const amount = selected || (parseInt(custom.replace(/[^0-9]/g, '')) || 0);

  const withdraw = () => {
    if (!amount || amount <= 0) { showToast('Enter a valid amount'); return; }
    if (amount > walletBalance) { showToast('Insufficient balance'); return; }
    setWalletBalance(prev => prev - amount);
    setTransactions(prev => [{ id: Date.now(), desc: 'Wallet withdrawal', amount, type: 'out', date: 'Just now', icon: '↑' }, ...prev]);
    showToast(`Withdrawn ${fmt(amount)}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Withdraw from Wallet</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Current balance: <span className="amount" style={{ fontWeight: 600 }}>{fmt(walletBalance)}</span></div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {presets.filter(p => p <= walletBalance).map(p => (
            <button key={p} className={`preset-btn${selected === p ? ' selected' : ''}`} onClick={() => { setSelected(p); setCustom(''); }}>{fmt(p)}</button>
          ))}
        </div>

        <input
          className="input"
          placeholder="Or enter custom amount..."
          value={custom}
          onChange={e => { setCustom(e.target.value); setSelected(null); }}
          style={{ marginBottom: 16 }}
        />

        {amount > 0 && (
          <div style={{ fontSize: 12, color: amount > walletBalance ? 'var(--red)' : 'var(--text-muted)', marginBottom: 12 }}>
            {amount > walletBalance ? 'Insufficient balance' : `After withdrawal: ${fmt(walletBalance - amount)}`}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={withdraw}>Withdraw {amount > 0 ? fmt(amount) : ''}</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Transfer Modal ──

function TransferModal({ onClose, members, walletBalance, setWalletBalance, setTransactions, showToast }) {
  const others = members.filter(m => m.id !== 'julia');
  const [recipientId, setRecipientId] = useState(others[0]?.id || '');
  const [amount, setAmount] = useState('');

  const transfer = () => {
    const amt = parseInt(amount.replace(/[^0-9]/g, '') || '0');
    if (!amt || amt <= 0) { showToast('Enter a valid amount'); return; }
    if (amt > walletBalance) { showToast('Insufficient balance'); return; }
    const rec = members.find(m => m.id === recipientId);
    setWalletBalance(prev => prev - amt);
    setTransactions(prev => [{ id: Date.now(), desc: `Transfer to ${rec?.name}`, amount: amt, type: 'out', date: 'Just now', icon: '→' }, ...prev]);
    showToast(`Sent ${fmt(amt)} to ${rec?.name}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Transfer</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Balance: <span className="amount" style={{ fontWeight: 600 }}>{fmt(walletBalance)}</span></div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Recipient</div>
          <select className="input" value={recipientId} onChange={e => setRecipientId(e.target.value)}>
            {others.map(m => <option key={m.id} value={m.id}>{m.name} ({fmt(m.wallet)})</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Amount</div>
          <input className="input" placeholder="e.g. 10000" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={transfer}>Transfer</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Individual Wallet Settle Modal ──

function WalletSettleModal({ member, onClose, members, setMembers, walletBalance, setWalletBalance, setTransactions, showToast }) {
  const settle = () => {
    if (member.status === 'overdue') {
      showToast('Balance is restricted — send a reminder first');
      return;
    }
    setMembers(prev => prev.map(m => {
      if (m.id === member.id) return { ...m, owes: 0, status: 'settled', wallet: m.wallet - member.owes };
      if (m.id === 'julia') return { ...m, wallet: m.wallet + member.owes };
      return m;
    }));
    setWalletBalance(prev => prev + member.owes);
    setTransactions(prev => [{ id: Date.now(), desc: `${member.name} settled up`, amount: member.owes, type: 'in', date: 'Just now', icon: '↓' }, ...prev]);
    showToast(`${member.name} settled — ${fmt(member.owes)} received!`, 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Settle with {member.name}</div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#F5F5F3', borderRadius: 6, marginBottom: 12 }}>
            <div className="avatar">{member.initials}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{member.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{member.status}</div>
            </div>
            <div className="amount" style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 700 }}>{fmt(member.owes)}</div>
          </div>
          {member.status === 'overdue' && (
            <div style={{ padding: 12, background: 'var(--red-bg)', border: '1.5px solid var(--red)', borderRadius: 6, fontSize: 12, color: 'var(--red)' }}>
              ⚠ This balance is overdue and auto-settle is restricted. You can still manually confirm receipt of payment.
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={settle}>
            {member.status === 'overdue' ? 'Mark as Received' : 'Confirm Settlement'}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Settle All Modal ──

function SettleAllModal({ onClose, members, setMembers, walletBalance, setWalletBalance, setTransactions, setExpenses, showToast }) {
  const [settled, setSettled] = useState(false);
  const pending = members.filter(m => m.id !== 'julia' && m.owes > 0 && m.status !== 'overdue');
  const overdue = members.filter(m => m.id !== 'julia' && m.status === 'overdue');
  const totalSettleable = pending.reduce((s, m) => s + m.owes, 0);

  const settleAll = () => {
    setMembers(prev => prev.map(m => {
      if (pending.some(p => p.id === m.id)) return { ...m, owes: 0, status: 'settled' };
      if (m.id === 'julia') return { ...m, wallet: m.wallet + totalSettleable };
      return m;
    }));
    setWalletBalance(prev => prev + totalSettleable);
    const newTxs = pending.map((m, i) => ({
      id: Date.now() + i,
      desc: `${m.name} settled all balances`,
      amount: m.owes,
      type: 'in',
      date: 'Just now',
      icon: '✓',
    }));
    setTransactions(prev => [...newTxs, ...prev]);
    setSettled(true);
  };

  if (settled) {
    return (
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>✓</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{pending.length} balances settled!</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>{fmt(totalSettleable)} received from {pending.map(m => m.name).join(', ')}</div>
          <div style={{ background: '#F5F5F3', borderRadius: 8, padding: 16, marginBottom: 20, textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Trip Summary</div>
            {pending.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', borderBottom: '1px dashed var(--border-light)' }}>
                <span>{m.name}</span>
                <span className="amount" style={{ color: 'var(--green)' }}>+{fmt(m.owes)}</span>
              </div>
            ))}
            {overdue.length > 0 && overdue.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', borderBottom: '1px dashed var(--border-light)' }}>
                <span>{m.name} (restricted)</span>
                <span className="amount" style={{ color: 'var(--red)' }}>{fmt(m.owes)} pending</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-full" onClick={onClose}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Settle All Balances</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Jeju Trip · {members.filter(m => m.id !== 'julia' && m.owes > 0).length} members with balances</div>

        <div style={{ marginBottom: 16 }}>
          {pending.map(m => (
            <div key={m.id} className="settle-all-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{m.initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.status}</div>
                </div>
              </div>
              <div className="amount" style={{ fontWeight: 600, color: 'var(--green)' }}>{fmt(m.owes)}</div>
            </div>
          ))}
          {overdue.map(m => (
            <div key={m.id} className="settle-all-row" style={{ opacity: 0.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{m.initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--red)' }}>overdue · restricted</div>
                </div>
              </div>
              <div className="amount" style={{ fontWeight: 600, color: 'var(--red)' }}>{fmt(m.owes)}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid var(--border)', marginBottom: 16 }}>
          <span style={{ fontWeight: 700 }}>Settling now</span>
          <span className="amount" style={{ fontWeight: 700, fontSize: 15 }}>{fmt(totalSettleable)}</span>
        </div>

        {overdue.length > 0 && (
          <div style={{ padding: 12, background: 'var(--orange-bg)', border: '1.5px solid var(--orange)', borderRadius: 6, fontSize: 12, color: 'var(--orange)', marginBottom: 16 }}>
            Note: John's ₩100,000 is overdue and cannot be auto-settled. A reminder has been queued.
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={settleAll}>
            Approve All ({fmt(totalSettleable)})
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Flexible Modal ──

function FlexibleModal({ member, onClose, showToast }) {
  const [selected, setSelected] = useState('later');
  const options = [
    { id: 'later',    title: 'Pay later',              sub: 'Set a grace period of 7 days' },
    { id: 'partial',  title: '50% now + 50% next week', sub: 'Split into 2 installments' },
    { id: 'custom',   title: 'Partial amount',          sub: 'Enter a custom amount to settle now' },
  ];
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Flexible Settlement</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>For {member?.name} · {fmt(member?.owes || 0)} outstanding</div>
        {options.map(o => (
          <div key={o.id} className={`flexible-option${selected === o.id ? ' selected' : ''}`} onClick={() => setSelected(o.id)}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border-light)', background: selected === o.id ? 'var(--text)' : 'white', flexShrink: 0 }} />
            <div>
              <div className="flexible-option-title">{o.title}</div>
              <div className="flexible-option-sub">{o.sub}</div>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { showToast(`Flexible option set for ${member?.name}`); onClose(); }}>Apply</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────

function App() {
  const [screen, setScreen] = useState('home');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [walletBalance, setWalletBalance] = useState(120000);
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [chatMessages, setChatMessages] = useState(MOCK_CHAT);
  const [dismissedCards, setDismissedCards] = useState(new Set());
  const [modal, setModal] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [autoSettle, setAutoSettle] = useState(true);
  const [autoSettleLimit, setAutoSettleLimit] = useState(30000);
  const [showProtoBanner, setShowProtoBanner] = useState(true);
  const [explainMessages, setExplainMessages] = useState([
    { role: 'taro', text: "Hi Julia! I'm Taro, your AI expense coordinator.\n\nI'm tracking 3 groups. You have ₩120,000 in your wallet. There are 3 unsettled balances totaling ₩127,500.\n\nAsk me anything below!" }
  ]);

  const navigateTo = (s) => {
    setScreen(s);
    if (s !== 'groups') setSelectedGroup(null);
  };

  const openModal = (type, data) => setModal({ type, data });
  const closeModal = () => setModal(null);

  const showToast = useCallback((msg, type = '') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  const dismissCard = (cardId) => {
    setDismissedCards(prev => new Set([...prev, cardId]));
  };

  return (
    <>
      {showProtoBanner && <ProtoBanner onClose={() => setShowProtoBanner(false)} />}
      <div className="app-wrap">
        <Sidebar screen={screen} onNavigate={navigateTo} walletBalance={walletBalance} />
        <main id="main">
          {screen === 'home' && (
            <HomeScreen
              expenses={expenses}
              members={members}
              dismissedCards={dismissedCards}
              onDismiss={dismissCard}
              onOpenModal={openModal}
              walletBalance={walletBalance}
              onNavigate={navigateTo}
              showToast={showToast}
            />
          )}
          {screen === 'wallet' && (
            <WalletScreen
              walletBalance={walletBalance}
              setWalletBalance={setWalletBalance}
              transactions={transactions}
              autoSettle={autoSettle}
              setAutoSettle={setAutoSettle}
              autoSettleLimit={autoSettleLimit}
              setAutoSettleLimit={setAutoSettleLimit}
              onOpenModal={openModal}
              showToast={showToast}
            />
          )}
          {screen === 'groups' && (
            <GroupsScreen
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              members={members}
              expenses={expenses}
              onOpenModal={openModal}
              showToast={showToast}
            />
          )}
          {screen === 'chat' && (
            <ChatScreen
              members={members}
              showToast={showToast}
              onOpenModal={openModal}
            />
          )}
          {screen === 'detect' && (
            <DetectScreen
              expenses={expenses}
              onOpenModal={openModal}
              showToast={showToast}
            />
          )}
          {screen === 'settle' && (
            <SettleScreen
              members={members}
              setMembers={setMembers}
              expenses={expenses}
              setExpenses={setExpenses}
              setTransactions={setTransactions}
              walletBalance={walletBalance}
              setWalletBalance={setWalletBalance}
              onOpenModal={openModal}
              showToast={showToast}
            />
          )}
          {screen === 'explain' && (
            <ExplainScreen
              explainMessages={explainMessages}
              setExplainMessages={setExplainMessages}
              members={members}
              expenses={expenses}
              walletBalance={walletBalance}
              showToast={showToast}
              onNavigate={navigateTo}
            />
          )}
        </main>
        <BottomNav screen={screen} onNavigate={navigateTo} />
      </div>

      {modal && (
        <ModalRenderer
          modal={modal}
          onClose={closeModal}
          members={members}
          setMembers={setMembers}
          expenses={expenses}
          setExpenses={setExpenses}
          transactions={transactions}
          setTransactions={setTransactions}
          walletBalance={walletBalance}
          setWalletBalance={setWalletBalance}
          showToast={showToast}
        />
      )}

      <div id="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast${t.type === 'success' ? ' toast-success' : ''}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
