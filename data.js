// Sample dataset and a pre-run analysis of it.
// The pre-run analysis lets visitors explore results instantly, even when live AI is
// unavailable. It is clearly labelled as a pre-run example in the UI.

window.SAMPLE_FEEDBACK = [
  ['2026-08-03', 'survey', "The online booking page is brilliant. Clients book themselves in and I've barely touched the phone this month."],
  ['2026-08-03', 'support', 'The mobile app crashes every time I try to open the calendar view on my iPhone. Happens 3-4 times a day.'],
  ['2026-08-04', 'review', "Setup was so easy. I had my whole week's schedule in there within an hour of signing up."],
  ['2026-08-04', 'survey', "Reminders are confusing to set up. I thought I'd turned them on but clients weren't getting texts, so we had 4 no-shows last week."],
  ['2026-08-05', 'sales call', 'They asked if we do multi-location reporting. Currently they export each site separately and merge in Excel, which they hate.'],
  ['2026-08-05', 'support', "Google Calendar sync stopped working again. Appointments made in the app aren't showing in my Google Calendar."],
  ['2026-08-06', 'review', 'Support got back to me in under 10 minutes on a Sunday. Genuinely impressed.'],
  ['2026-08-06', 'survey', 'Too expensive once you add more staff. The per-user pricing punishes us for growing.'],
  ['2026-08-07', 'support', 'App is really slow to load the client list, sometimes 20+ seconds. We have about 900 clients.'],
  ['2026-08-07', 'survey', 'I love that clients can rebook from the confirmation email. Little thing, saves loads of time.'],
  ['2026-08-08', 'review', "The reporting is basically useless. I can't see revenue per practitioner without exporting to a spreadsheet."],
  ['2026-08-08', 'support', 'Outlook sync duplicates every appointment. I now have three copies of everything this week.'],
  ['2026-08-10', 'survey', 'Would be great if the SMS reminders could go out in Spanish for some of our clients.'],
  ['2026-08-10', 'review', 'Onboarding videos were clear and short. Our receptionist picked it up in a day with no training from me.'],
  ['2026-08-11', 'support', 'Crashed mid-booking and the appointment disappeared. Client turned up and we had no record of them.'],
  ['2026-08-11', 'survey', 'The reminder settings page makes no sense. Why are email and SMS reminders configured in two different places?'],
  ['2026-08-12', 'sales call', "Main objection was price. They're comparing against a competitor that charges flat rate instead of per user."],
  ['2026-08-12', 'review', 'Best decision we made this year. The booking page alone paid for itself.'],
  ['2026-08-13', 'support', 'Why does the Android app log me out every day? Typing my password on a phone every morning is a pain.'],
  ['2026-08-13', 'survey', 'Mostly happy but the app freezes when I switch between week and day view.'],
  ['2026-08-14', 'support', "Calendar sync with Google is showing appointments an hour off since the clocks weren't even changed. Timezone bug?"],
  ['2026-08-14', 'review', 'Their support team actually reads your message instead of sending canned replies. Rare these days.'],
  ['2026-08-15', 'survey', 'We want a waitlist feature. When someone cancels we ring around manually, would love it automated.'],
  ['2026-08-15', 'support', 'The app takes forever to start. I count 15 seconds on a new Samsung, my client is standing there waiting.'],
  ['2026-08-17', 'review', "Pricing crept up on us. Started affordable, but with 6 staff it's now our biggest software bill."],
  ['2026-08-17', 'survey', 'Clients keep saying how easy the booking page is. Even our older clients manage it fine.'],
  ['2026-08-18', 'support', 'No-show rate went up because reminders silently stopped sending when our card expired. No warning email, nothing.'],
  ['2026-08-18', 'survey', "Reports don't show cancellations separately from no-shows. I need that split for staff reviews."],
  ['2026-08-19', 'sales call', 'Loved the demo of the booking page, asked twice whether it works embedded in their own website.'],
  ['2026-08-19', 'support', "iPhone app crashed 6 times today. I've reinstalled twice. It's becoming unusable."],
  ['2026-08-20', 'review', "Signed up on a Tuesday, taking online bookings by Wednesday. Couldn't have been easier."],
  ['2026-08-20', 'survey', 'Honestly the reminder setup nearly made me cancel. Took me three tries and a support chat to get texts working.'],
  ['2026-08-21', 'support', 'Sync to Outlook only goes one way. If I block time in Outlook the app still lets clients book that slot. Double bookings!'],
  ['2026-08-21', 'survey', 'Fine overall. Nothing special but does the job.'],
  ['2026-08-22', 'review', 'The price for solo practitioners is fair, but the jump to the team plan is steep.'],
  ['2026-08-24', 'support', 'Client list search on mobile is painfully slow, and sometimes the search just returns nothing until I restart the app.'],
  ['2026-08-24', 'survey', "More positive than negative, but please sort the mobile app out. It's the weakest part by far."],
  ['2026-08-25', 'review', 'Had a billing question, sorted in one email. Support is the reason we stay.'],
  ['2026-08-25', 'support', 'Reminder emails going to spam for loads of our clients. Anything you can do on your end?'],
  ['2026-08-26', 'survey', 'Would love to export my monthly numbers as a proper report I can send to my accountant, not a raw CSV.'],
  ['2026-08-26', 'support', "Google sync disconnects itself about once a week and I don't notice until appointments are missing."],
  ['2026-08-27', 'review', "The booking page converted 40% more enquiries into appointments for us. That's real money."],
  ['2026-08-27', 'survey', 'App crashed while a client was paying their deposit. Embarrassing.'],
  ['2026-08-28', 'sales call', "Asked about API access for their internal dashboard. We don't have a good answer for reporting integrations."],
  ['2026-08-28', 'survey', 'Wish I could set different reminder timings for different appointment types. Surgery consults need more notice than checkups.'],
  ['2026-08-31', 'review', 'Really intuitive from day one. I never opened the help docs.'],
  ['2026-08-31', 'support', 'The app on my iPad shows a blank white screen since the last update.'],
  ['2026-09-01', 'survey', "Per-user pricing means we don't give our part-time Saturday staff logins. They share one account, which is messy."],
  ['2026-09-01', 'support', 'Two-way sync with Google please. One-way is causing us double bookings every week.'],
  ['2026-09-02', 'review', 'Reminders cut our no-shows in half once we finally got them configured. The configuring was the hard part.'],
  ['2026-09-02', 'survey', 'Neutral. It works. The mobile app could be faster.'],
  ['2026-09-03', 'support', 'Cannot generate a report for a custom date range. Why only calendar months?'],
  ['2026-09-03', 'review', 'Moved from a competitor and the import tool brought everything across cleanly. Painless switch.'],
  ['2026-09-04', 'survey', 'The confirmation and reminder texts read a bit robotic. Would like to customize the wording.'],
  ['2026-09-04', 'support', 'App keeps crashing on the payments screen specifically. Android, Pixel 7.'],
  ['2026-09-07', 'review', "Support helped me build a workaround for reporting in 20 minutes on chat. Great service, but I shouldn't need a workaround."],
  ['2026-09-07', 'survey', 'Love it. Booking page is doing the job of a part-time receptionist.'],
  ['2026-09-08', 'support', "Since Friday the Google Calendar connection shows 'reauthorise' every morning."],
  ['2026-09-08', 'survey', "Price rise email gave us 2 weeks notice. Not okay when we're locked into client bookings months ahead."],
  ['2026-09-09', 'review', 'The dashboard tells me today\'s appointments but nothing about trends. I run my business on gut feel because the reports are so thin.'],
  ['2026-09-09', 'support', 'Reminder went out for the wrong day after I rescheduled a client. She showed up on the original date.'],
  ['2026-09-10', 'survey', 'Getting started was genuinely fun. The setup wizard is great.'],
  ['2026-09-10', 'support', "Mobile app drains my battery like crazy. It's the top app in battery settings every day."],
  ['2026-09-11', 'sales call', "They want no-show and revenue reports per practitioner before they'll commit. Current reporting was the blocker."],
  ['2026-09-11', 'review', 'Solid product, shame about the app. I just use the website on my phone now, which says it all.'],
  ['2026-09-14', 'survey', "Can we get reminders via WhatsApp? Half our clients don't read SMS."],
  ['2026-09-14', 'support', 'Outlook sync created 200 duplicate events and I had to delete them by hand. Please fix this properly.'],
  ['2026-09-15', 'review', 'Five stars for support, four for the product, two for the mobile app.'],
  ['2026-09-15', 'survey', 'The new booking page templates look great. Client compliments weekly.'],
  ['2026-09-16', 'support', 'App version 4.2 crashes on launch on older iPhones. My whole front desk uses hand-me-down phones.'],
  ['2026-09-16', 'survey', "I'd pay MORE for proper reporting. That's how much I need it. Please build it."],
  ['2026-09-17', 'review', 'Every renewal I wince at the price, and every renewal I pay it because the booking page keeps my diary full.']
];

(function () {
  // [id, theme, subtheme, sentiment, type, area, severity, signal, evidence]
  const T = [
    [1, 'Online booking', 'Self-service booking', 'positive', 'Praise', 'Booking page', 0, 'advocacy', "Clients book themselves in and I've barely touched the phone this month"],
    [2, 'Mobile app', 'Crashes', 'negative', 'Reliability', 'Mobile app (iOS)', 3, 'churn_risk', 'crashes every time I try to open the calendar view on my iPhone'],
    [3, 'Onboarding & setup', 'Fast setup', 'positive', 'Praise', 'Onboarding', 0, 'advocacy', "I had my whole week's schedule in there within an hour of signing up"],
    [4, 'Reminders', 'Confusing setup', 'negative', 'Usability', 'Reminders', 3, 'churn_risk', "clients weren't getting texts, so we had 4 no-shows last week"],
    [5, 'Reporting & analytics', 'Multi-location reporting', 'neutral', 'Missing feature', 'Reporting', 2, 'none', 'they export each site separately and merge in Excel, which they hate'],
    [6, 'Calendar sync', 'Google sync breaks', 'negative', 'Reliability', 'Integrations (Google)', 2, 'none', "Appointments made in the app aren't showing in my Google Calendar"],
    [7, 'Customer support', 'Fast, personal replies', 'positive', 'Praise', 'Support', 0, 'advocacy', 'Support got back to me in under 10 minutes on a Sunday'],
    [8, 'Pricing', 'Per-user pricing', 'negative', 'Pricing', 'Pricing & plans', 2, 'none', 'The per-user pricing punishes us for growing'],
    [9, 'Mobile app', 'Slow loading', 'negative', 'Performance', 'Client list', 2, 'none', 'slow to load the client list, sometimes 20+ seconds'],
    [10, 'Online booking', 'Self-service booking', 'positive', 'Praise', 'Confirmation emails', 0, 'advocacy', 'clients can rebook from the confirmation email'],
    [11, 'Reporting & analytics', 'Per-practitioner reports', 'negative', 'Missing feature', 'Reporting', 2, 'none', "I can't see revenue per practitioner without exporting to a spreadsheet"],
    [12, 'Calendar sync', 'Outlook duplicates', 'negative', 'Reliability', 'Integrations (Outlook)', 2, 'none', 'Outlook sync duplicates every appointment'],
    [13, 'Reminders', 'More channels and languages', 'neutral', 'Missing feature', 'Reminders', 1, 'none', 'SMS reminders could go out in Spanish'],
    [14, 'Onboarding & setup', 'Fast setup', 'positive', 'Praise', 'Onboarding', 0, 'advocacy', 'Our receptionist picked it up in a day with no training from me'],
    [15, 'Mobile app', 'Crashes', 'negative', 'Reliability', 'Mobile app (booking)', 3, 'churn_risk', 'Crashed mid-booking and the appointment disappeared'],
    [16, 'Reminders', 'Confusing setup', 'negative', 'Usability', 'Reminders', 1, 'none', 'Why are email and SMS reminders configured in two different places?'],
    [17, 'Pricing', 'Per-user pricing', 'negative', 'Pricing', 'Pricing & plans', 2, 'deal_blocker', "They're comparing against a competitor that charges flat rate instead of per user"],
    [18, 'Online booking', 'More bookings, fewer calls', 'positive', 'Praise', 'Booking page', 0, 'advocacy', 'The booking page alone paid for itself'],
    [19, 'Mobile app', 'Login & sessions', 'negative', 'Usability', 'Mobile app (Android)', 1, 'none', 'Why does the Android app log me out every day?'],
    [20, 'Mobile app', 'Crashes', 'mixed', 'Reliability', 'Mobile app (calendar)', 2, 'none', 'the app freezes when I switch between week and day view'],
    [21, 'Calendar sync', 'Google sync breaks', 'negative', 'Reliability', 'Integrations (Google)', 2, 'none', 'showing appointments an hour off'],
    [22, 'Customer support', 'Fast, personal replies', 'positive', 'Praise', 'Support', 0, 'advocacy', 'Their support team actually reads your message instead of sending canned replies'],
    [23, 'Feature requests', 'Waitlist', 'neutral', 'Missing feature', 'Scheduling', 1, 'none', 'We want a waitlist feature'],
    [24, 'Mobile app', 'Slow loading', 'negative', 'Performance', 'Mobile app (Android)', 2, 'none', 'I count 15 seconds on a new Samsung'],
    [25, 'Pricing', 'Per-user pricing', 'negative', 'Pricing', 'Pricing & plans', 2, 'none', "with 6 staff it's now our biggest software bill"],
    [26, 'Online booking', 'Easy for clients', 'positive', 'Praise', 'Booking page', 0, 'advocacy', 'Even our older clients manage it fine'],
    [27, 'Reminders', 'Stop without warning', 'negative', 'Reliability', 'Reminders & billing', 3, 'churn_risk', 'reminders silently stopped sending when our card expired'],
    [28, 'Reporting & analytics', 'Missing report breakdowns', 'negative', 'Missing feature', 'Reporting', 2, 'none', "Reports don't show cancellations separately from no-shows"],
    [29, 'Online booking', 'Website embed', 'positive', 'Other', 'Booking page', 1, 'none', 'asked twice whether it works embedded in their own website'],
    [30, 'Mobile app', 'Crashes', 'negative', 'Reliability', 'Mobile app (iOS)', 3, 'churn_risk', "It's becoming unusable"],
    [31, 'Onboarding & setup', 'Fast setup', 'positive', 'Praise', 'Onboarding', 0, 'advocacy', 'Signed up on a Tuesday, taking online bookings by Wednesday'],
    [32, 'Reminders', 'Confusing setup', 'negative', 'Usability', 'Reminders', 2, 'churn_risk', 'the reminder setup nearly made me cancel'],
    [33, 'Calendar sync', 'One-way sync', 'negative', 'Missing feature', 'Integrations (Outlook)', 3, 'none', 'the app still lets clients book that slot. Double bookings!'],
    [34, 'General', 'No strong view', 'neutral', 'Other', 'General', 0, 'none', 'Nothing special but does the job'],
    [35, 'Pricing', 'Team plan jump', 'mixed', 'Pricing', 'Pricing & plans', 1, 'none', 'the jump to the team plan is steep'],
    [36, 'Mobile app', 'Slow loading', 'negative', 'Performance', 'Mobile app (search)', 2, 'none', 'Client list search on mobile is painfully slow'],
    [37, 'Mobile app', 'General app quality', 'mixed', 'Other', 'Mobile app', 1, 'none', "please sort the mobile app out. It's the weakest part by far"],
    [38, 'Customer support', 'Reason to stay', 'positive', 'Praise', 'Support', 0, 'advocacy', 'Support is the reason we stay'],
    [39, 'Reminders', 'Stop without warning', 'negative', 'Reliability', 'Reminders (email)', 2, 'none', 'Reminder emails going to spam for loads of our clients'],
    [40, 'Reporting & analytics', 'Export & sharing', 'neutral', 'Missing feature', 'Reporting', 1, 'none', 'a proper report I can send to my accountant'],
    [41, 'Calendar sync', 'Google sync breaks', 'negative', 'Reliability', 'Integrations (Google)', 2, 'none', 'Google sync disconnects itself about once a week'],
    [42, 'Online booking', 'More bookings, fewer calls', 'positive', 'Praise', 'Booking page', 0, 'advocacy', 'The booking page converted 40% more enquiries into appointments for us'],
    [43, 'Mobile app', 'Crashes', 'negative', 'Reliability', 'Mobile app (payments)', 3, 'none', 'App crashed while a client was paying their deposit'],
    [44, 'Reporting & analytics', 'API & integrations', 'neutral', 'Missing feature', 'Reporting API', 2, 'none', "We don't have a good answer for reporting integrations"],
    [45, 'Reminders', 'Customisation', 'neutral', 'Missing feature', 'Reminders', 1, 'none', 'set different reminder timings for different appointment types'],
    [46, 'Onboarding & setup', 'Ease of use', 'positive', 'Praise', 'Onboarding', 0, 'advocacy', 'Really intuitive from day one'],
    [47, 'Mobile app', 'Crashes', 'negative', 'Reliability', 'Mobile app (iPad)', 3, 'none', 'shows a blank white screen since the last update'],
    [48, 'Pricing', 'Per-user pricing', 'negative', 'Pricing', 'Pricing & plans', 2, 'none', 'They share one account, which is messy'],
    [49, 'Calendar sync', 'One-way sync', 'negative', 'Missing feature', 'Integrations (Google)', 3, 'none', 'One-way is causing us double bookings every week'],
    [50, 'Reminders', 'Confusing setup', 'mixed', 'Usability', 'Reminders', 1, 'none', 'The configuring was the hard part'],
    [51, 'Mobile app', 'Slow loading', 'neutral', 'Performance', 'Mobile app', 1, 'none', 'The mobile app could be faster'],
    [52, 'Reporting & analytics', 'Missing report breakdowns', 'negative', 'Missing feature', 'Reporting', 1, 'none', 'Cannot generate a report for a custom date range'],
    [53, 'Onboarding & setup', 'Migration & import', 'positive', 'Praise', 'Import tool', 0, 'advocacy', 'the import tool brought everything across cleanly'],
    [54, 'Reminders', 'Customisation', 'neutral', 'Missing feature', 'Reminders', 1, 'none', 'Would like to customize the wording'],
    [55, 'Mobile app', 'Crashes', 'negative', 'Reliability', 'Mobile app (payments)', 3, 'none', 'App keeps crashing on the payments screen specifically'],
    [56, 'Reporting & analytics', 'Per-practitioner reports', 'mixed', 'Missing feature', 'Reporting', 2, 'none', "I shouldn't need a workaround"],
    [57, 'Online booking', 'More bookings, fewer calls', 'positive', 'Praise', 'Booking page', 0, 'advocacy', 'Booking page is doing the job of a part-time receptionist'],
    [58, 'Calendar sync', 'Google sync breaks', 'negative', 'Reliability', 'Integrations (Google)', 2, 'none', "shows 'reauthorise' every morning"],
    [59, 'Pricing', 'Short notice on price rise', 'negative', 'Pricing', 'Billing', 2, 'none', 'Price rise email gave us 2 weeks notice'],
    [60, 'Reporting & analytics', 'No trends view', 'negative', 'Missing feature', 'Dashboard', 2, 'none', 'I run my business on gut feel because the reports are so thin'],
    [61, 'Reminders', 'Stop without warning', 'negative', 'Reliability', 'Reminders', 3, 'none', 'Reminder went out for the wrong day after I rescheduled a client'],
    [62, 'Onboarding & setup', 'Fast setup', 'positive', 'Praise', 'Setup wizard', 0, 'advocacy', 'The setup wizard is great'],
    [63, 'Mobile app', 'Battery drain', 'negative', 'Performance', 'Mobile app', 2, 'none', "It's the top app in battery settings every day"],
    [64, 'Reporting & analytics', 'Per-practitioner reports', 'neutral', 'Missing feature', 'Reporting', 3, 'deal_blocker', 'Current reporting was the blocker'],
    [65, 'Mobile app', 'General app quality', 'mixed', 'Other', 'Mobile app', 2, 'none', 'I just use the website on my phone now'],
    [66, 'Reminders', 'More channels and languages', 'neutral', 'Missing feature', 'Reminders', 1, 'none', 'Can we get reminders via WhatsApp?'],
    [67, 'Calendar sync', 'Outlook duplicates', 'negative', 'Reliability', 'Integrations (Outlook)', 3, 'none', 'Outlook sync created 200 duplicate events'],
    [68, 'Mobile app', 'General app quality', 'mixed', 'Other', 'Mobile app', 1, 'none', 'two for the mobile app'],
    [69, 'Online booking', 'Templates & design', 'positive', 'Praise', 'Booking page', 0, 'advocacy', 'Client compliments weekly'],
    [70, 'Mobile app', 'Crashes', 'negative', 'Reliability', 'Mobile app (iOS)', 3, 'churn_risk', 'App version 4.2 crashes on launch on older iPhones'],
    [71, 'Reporting & analytics', 'Per-practitioner reports', 'neutral', 'Missing feature', 'Reporting', 2, 'expansion', "I'd pay MORE for proper reporting"],
    [72, 'Pricing', 'Value for money', 'mixed', 'Pricing', 'Pricing & plans', 1, 'none', 'every renewal I pay it because the booking page keeps my diary full']
  ];

  window.DEMO_ANALYSIS = {
    themes: [
      { name: 'Mobile app', summary: 'Crashes, slow loading and battery drain on iPhone, Android and iPad. Some customers have stopped using the app.' },
      { name: 'Online booking', summary: 'Customers love the booking page. It saves them phone time and brings in more bookings.' },
      { name: 'Reminders', summary: 'Reminders cut no-shows once they work, but setup is confusing and they sometimes stop without warning.' },
      { name: 'Reporting & analytics', summary: 'Reports are too basic: no per-practitioner, cancellation or trend views. Prospects ask for this too.' },
      { name: 'Calendar sync', summary: 'Google and Outlook sync disconnects, duplicates events, shifts times and only works one way, which causes double bookings.' },
      { name: 'Onboarding & setup', summary: 'Setup is quick and easy. Several customers were live within a day.' },
      { name: 'Pricing', summary: 'Per-user pricing gets expensive as teams grow, and competitors charge a flat rate.' },
      { name: 'Customer support', summary: 'Support is fast and personal. Some customers say it is why they stay.' },
      { name: 'Feature requests', summary: 'One-off requests that don\'t fit another theme.' },
      { name: 'General', summary: 'General comments with no specific topic.' }
    ],
    items: T.map(r => ({ id: r[0], theme: r[1], subtheme: r[2], sentiment: r[3], type: r[4], area: r[5], severity: r[6], signal: r[7], evidence: r[8] })),
    lenses: {
      product: {
        headline: 'Mobile crashes are the biggest problem right now. Better reporting is the biggest opportunity.',
        insights: [
          { title: 'App crashes are losing bookings and payments', detail: 'Crash reports come from iPhone, Android and iPad. In one, a booking disappeared; in another, a deposit payment failed.', ids: [2, 15, 30, 43, 47, 55, 70] },
          { title: 'Weak reporting is costing us deals', detail: 'One prospect won\'t sign without per-practitioner reports. One customer says they\'d pay more for better reporting.', ids: [64, 71, 11, 28, 60, 5] },
          { title: 'Reminder setup is causing no-shows', detail: 'Customers think reminders are on when they aren\'t. One nearly cancelled over it.', ids: [4, 16, 32, 50] },
          { title: 'Calendar sync problems lead to double bookings', detail: 'Sync disconnects, duplicates events, shifts times by an hour, and only works one way.', ids: [33, 49, 67, 41, 21] }
        ],
        actions: [
          { action: 'Fix the top mobile crashes: v4.2 launch on older iPhones, and the payments screen', why: 'Biggest problem on the list, and customers are talking about leaving.', assumption: 'Most crashes come from a few screens and versions.', measure: 'Crash-free sessions and crash tickets per week.', ids: [70, 55, 30, 2] },
          { action: 'Show a per-practitioner report mockup to the prospects who asked for it', why: 'It\'s blocking at least one deal, and one customer would pay more for it.', assumption: 'This is what\'s actually stopping them from buying.', measure: 'How many of those prospects move to a trial.', ids: [64, 71, 11] },
          { action: 'Make reminder setup one simple flow, with a test message and an alert if sending stops', why: 'Confusing setup and silent failures both lead to no-shows.', assumption: 'Most reminder-related no-shows come from setup or silent failures.', measure: 'Share of new accounts with reminders working in week one.', ids: [16, 32, 27, 61] },
          { action: 'Size the work for two-way Google and Outlook sync', why: 'One-way sync is behind the worst sync complaints.', assumption: 'Double bookings happen often enough to justify the work.', measure: 'Double-booking reports per month.', ids: [33, 49] }
        ]
      },
      marketing: {
        headline: 'Lead with the booking page. Customers give us strong, specific proof. Avoid mobile and reporting claims for now.',
        insights: [
          { title: 'The booking page gets real results', detail: 'Customers mention 40% more bookings, fewer phone calls, and that it does the job of a part-time receptionist.', ids: [42, 18, 57, 1] },
          { title: 'Customers are up and running in a day', detail: 'Several were taking bookings within a day, with no training.', ids: [31, 3, 62, 14] },
          { title: 'Customers bring up our support without being asked', detail: 'Fast, human replies. One customer says it\'s why they stay.', ids: [38, 7, 22] },
          { title: 'Price is the objection we\'ll hear', detail: 'Per-user pricing gets compared with competitors who charge a flat rate, especially for teams of five or more.', ids: [17, 8, 25, 48] }
        ],
        actions: [
          { action: 'Build the next campaign around the booking page, using the "40% more bookings" quote', why: 'It\'s our strongest positive theme and it has real numbers.', assumption: 'The 40% result is typical, and the customer is happy to be quoted.', measure: 'Click-through and trial sign-ups vs the last campaign.', ids: [42, 57] },
          { action: 'Use "sign up Tuesday, take bookings Wednesday" in trial and onboarding emails', why: 'It\'s specific, and several customers say the same thing.', assumption: 'Most customers get set up this fast, not just these ones.', measure: 'Median time from sign-up to first online booking.', ids: [31, 62] },
          { action: 'Don\'t make claims about the mobile app or reporting yet', why: 'These get the most complaints, so claims would clash with reviews.', assumption: 'The complaints reflect the product today.', measure: 'Share of negative reviews about mobile and reporting after fixes ship.', ids: [37, 65, 11, 60] },
          { action: 'Give sales a short answer to the per-user pricing objection', why: 'Price was the main objection in a sales call.', assumption: 'The objection is about team size, not overall value.', measure: 'Win rate on deals where price comes up.', ids: [17, 35] }
        ]
      },
      support: {
        headline: 'Most of our tickets are mobile crashes and calendar sync. Reminder setup is an easy win.',
        insights: [
          { title: 'Crash tickets are missing device and version details', detail: 'Reports mention iPhone, iPad, Pixel 7 and Samsung, but often not the app version or screen.', ids: [2, 30, 47, 55, 70] },
          { title: 'Google sync keeps disconnecting', detail: 'Customers often only notice when appointments go missing.', ids: [6, 41, 58, 21] },
          { title: 'Reminders stop without warning', detail: 'An expired card, spam filters and rescheduling all stopped or broke reminders, with no alert.', ids: [27, 39, 61] },
          { title: 'Support is a reason customers stay', detail: 'Even customers working around product gaps praise the team.', ids: [38, 22, 7, 56] }
        ],
        actions: [
          { action: 'Write a reminder setup checklist (SMS and email, plus a test message)', why: 'Setup confusion is the most common reminder issue.', assumption: 'Most reminder tickets are setup mistakes a checklist can fix.', measure: 'Reminder setup tickets per week and time to resolve.', ids: [4, 16, 32] },
          { action: 'Ask product for an alert when reminders stop because of a billing problem', why: 'A silent stop led straight to no-shows.', assumption: 'Billing failures often stop reminders.', measure: 'Accounts whose reminders restart within 24 hours.', ids: [27] },
          { action: 'Escalate Outlook duplicate events as a bug, not a how-to', why: 'One customer deleted 200 duplicates by hand.', assumption: 'It\'s a sync bug, not a setup mistake.', measure: 'Repeat Outlook duplicate tickets after the fix.', ids: [12, 67] },
          { action: 'Log app version and device on every crash ticket', why: 'Several crashes started after an update.', assumption: 'Version data will show whether v4.2 caused the jump.', measure: 'Share of crash tickets with version and device logged.', ids: [70, 47] }
        ]
      },
      engineering: {
        headline: 'Three areas to dig into: mobile crashes, calendar sync and reminder delivery.',
        insights: [
          { title: 'Where the app crashes', detail: 'Calendar view on iPhone; launch on older iPhones (v4.2); payments screen on Android (Pixel 7); blank screen on iPad after the update; mid-booking, losing the appointment.', ids: [2, 70, 55, 47, 15] },
          { title: 'Where the app is slow', detail: 'Client list takes 20+ seconds with about 900 clients; 15-second start on a new Samsung; search returns nothing until restart; heavy battery use.', ids: [9, 24, 36, 63] },
          { title: 'What breaks in calendar sync', detail: 'Google asks to reauthorise every morning, times are off by an hour, Outlook creates duplicates (up to 200), and sync only goes one way.', ids: [58, 41, 21, 67, 12, 33] },
          { title: 'What breaks in reminders', detail: 'Rescheduling doesn\'t update the reminder date, sending stops silently when billing fails, and emails land in spam.', ids: [61, 27, 39] }
        ],
        actions: [
          { action: 'Fix the v4.2 launch crash on older iPhones first', why: 'A whole front desk can\'t use the app.', assumption: 'It\'s a regression from v4.2.', measure: 'Crash rate on affected iPhones after the fix.', ids: [70] },
          { action: 'Stop Outlook sync from creating the same event twice', why: 'Duplicates are the worst sync bug.', assumption: 'Retries are creating the duplicates.', measure: 'Duplicate events per 1,000 synced appointments.', ids: [12, 67] },
          { action: 'Look into Google token refresh and timezone handling', why: 'Daily reauthorise prompts and one-hour shifts point there.', assumption: 'These are the causes, not Google outages.', measure: 'Reauthorise prompts and time-shift tickets per week.', ids: [58, 21] },
          { action: 'Paginate and index the client list', why: 'Load time grows with the number of clients.', assumption: 'Slowness comes from client count, not the network.', measure: 'Client list load time for accounts with 900+ clients.', ids: [9, 36] }
        ]
      },
      leadership: {
        headline: 'The booking page is winning customers. Mobile quality and reporting are costing us deals and renewals.',
        insights: [
          { title: 'The booking page is our strength', detail: 'Customers get more bookings and renew because of it, even when they think we\'re expensive.', ids: [42, 18, 72] },
          { title: 'We\'re losing deals', detail: 'Reporting blocked one deal; price was the main objection in another.', ids: [64, 17] },
          { title: 'Mobile quality puts renewals at risk', detail: 'Customers call the app unusable or have stopped using it.', ids: [30, 65, 37] },
          { title: 'Customers will pay for better reporting', detail: 'One customer said so directly.', ids: [71] }
        ],
        actions: [
          { action: 'Put a mobile stability sprint ahead of new features', why: 'It\'s the biggest group of serious problems linked to churn.', assumption: 'Mobile quality is driving churn, not just complaints.', measure: 'Churn and app usage for accounts that rely on mobile.', ids: [2, 15, 30, 70] },
          { action: 'Test reporting as a paid add-on', why: 'Both prospects and customers are asking for it.', assumption: 'Enough customers would pay for it.', measure: 'Sign-ups or pre-commitments in a pricing test.', ids: [71, 64, 40] },
          { action: 'Review per-user pricing for teams of five or more', why: 'Pricing complaints grow with team size.', assumption: 'Per-user pricing is costing us deals and seats.', measure: 'Win rate and seats per account for teams of 5+.', ids: [8, 25, 48, 17] }
        ]
      }
    },
    // Discovery notes for the top problems, keyed "Theme|Subtheme".
    // effort is the PM's own first estimate (S/M/L); visitors can change it on the page.
    discovery: {
      'Mobile app|Crashes': {
        statement: 'Front-desk staff can\'t rely on the mobile app: it crashes on launch, in the calendar and at payment, so bookings and deposits get lost.',
        unknowns: ['How many accounts are on v4.2, and is it only older iPhones?', 'Did crashes jump after the last release, or have they been building up?'],
        next: 'Pull crash data by app version and device, and call three affected customers this week.',
        effort: 'M'
      },
      'Reporting & analytics|Per-practitioner reports': {
        statement: 'Clinic owners can\'t see revenue and no-shows per practitioner without a spreadsheet, so they can\'t run staff reviews, and prospects won\'t sign.',
        unknowns: ['Is per-practitioner reporting the must-have, or part of a wider reporting gap?', 'Would customers pay extra for it, or expect it in their current plan?'],
        next: 'Show a rough report mockup to the prospects and three current customers who asked for it.',
        effort: 'L'
      },
      'Pricing|Per-user pricing': {
        statement: 'Growing teams feel punished by per-user pricing, so they share logins or compare us with flat-rate competitors.',
        unknowns: ['At what team size does price become the main complaint?', 'How many deals have we lost on price this quarter?'],
        next: 'Ask sales for this quarter\'s lost-deal notes, and compare team size with downgrades.',
        effort: 'L'
      },
      'Reminders|Stop without warning': {
        statement: 'Reminders stop, or go out for the wrong date, without anyone noticing, so clients miss appointments and owners lose money.',
        unknowns: ['How often do reminders fail silently across all accounts?', 'Which cause is most common: billing, spam or rescheduling?'],
        next: 'Check reminder send logs for failures in the last 30 days.',
        effort: 'S'
      },
      'Reminders|Confusing setup': {
        statement: 'New customers think reminders are on when they aren\'t, because email and SMS are set up in two different places.',
        unknowns: ['What share of new accounts have SMS reminders actually sending in week one?', 'Where in setup do people get stuck?'],
        next: 'Watch three new customers set up reminders and note where they get stuck.',
        effort: 'S'
      },
      'Calendar sync|Google sync breaks': {
        statement: 'Google Calendar sync disconnects or shifts times, so appointments go missing and staff stop trusting the calendar.',
        unknowns: ['Is this one bug or several (login expiry, time zones)?', 'How many accounts use Google sync?'],
        next: 'Ask engineering to check sync error logs and count affected accounts per week.',
        effort: 'M'
      },
      'Mobile app|Slow loading': {
        statement: 'The app is slow to start and to load clients, so staff keep customers waiting at the desk.',
        unknowns: ['Is it slow for everyone, or only accounts with large client lists?', 'Which devices are affected?'],
        next: 'Get load times by account size from analytics.',
        effort: 'M'
      },
      'Calendar sync|One-way sync': {
        statement: 'Sync only goes from our app to the calendar, so time blocked elsewhere still gets booked and causes double bookings.',
        unknowns: ['How many double bookings happen per month?', 'Do customers mostly connect Google or Outlook?'],
        next: 'Count double-booking tickets and check which calendars customers connect.',
        effort: 'L'
      }
    },
    caveats: [
      '72 comments over six weeks: enough to spot patterns, not to size them.',
      'Only a few sales calls, and those are second-hand notes.',
      'Counts are comments, not customers.'
    ]
  };
})();
