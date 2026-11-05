/* Hilde Tax Services - tax reminders content.
   This file is the only thing to edit (by hand now, by automation later) to update the Tax Reminders page
   and the "Next deadline" line in the utility bar. Dates are YYYY-MM-DD. Past dates hide themselves.
   Every item carries a source so clients (and we) can check it. Researched 2026-10-30. */
window.TAX_REMINDERS = {
  updated: '2026-10-30',

  // Upcoming due dates. `who` values: everyone, self-employed, employers, businesses, texas
  dates: [
    { date: '2026-11-02', title: 'Q3 payroll returns (Form 941)', who: ['employers'],
      detail: 'Employers file the third-quarter payroll return. Oct. 31 falls on a Saturday, so the due date moves to Monday.',
      source: { label: 'IRS Publication 509', url: 'https://www.irs.gov/publications/p509' } },
    { date: '2026-12-31', title: 'Last day for 2026 tax moves', who: ['everyone'],
      detail: 'Charitable gifts, 401(k) contributions, required minimum distributions (age 73+) and other year-end moves must happen by Dec. 31 to count for 2026. New this year: even if you take the standard deduction, cash gifts to charity can be deducted (up to $1,000, or $2,000 for joint filers).',
      source: { label: 'IRS: Working Families Tax Cuts', url: 'https://www.irs.gov/newsroom/working-families-tax-cuts-individuals-and-workers' } },
    { date: '2027-01-15', title: 'Q4 2026 estimated tax payment', who: ['self-employed'],
      detail: 'Last estimated payment for 2026 if you are self-employed, do gig work or have income without withholding.',
      source: { label: 'IRS: Estimated taxes', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes' } },
    { date: '2027-01-25', title: '2027 filing season expected to open', who: ['everyone'], approximate: true,
      detail: 'The IRS announces the exact opening day in early January. Every season since 2022 has opened on a Monday in late January. You can gather documents and book your appointment now.',
      source: { label: 'IRS: Get ready to file', url: 'https://www.irs.gov/individuals/get-ready-to-file-your-taxes' } },
    { date: '2027-02-01', title: 'W-2s and 1099-NECs due to workers', who: ['employers', 'everyone'],
      detail: 'Employers send W-2s, and businesses send 1099-NECs to contractors. Jan. 31 falls on a Sunday, so the due date moves to Monday. Watch your mailbox and online accounts for your forms.',
      source: { label: 'IRS Publication 509', url: 'https://www.irs.gov/publications/p509' } },
    { date: '2027-02-01', title: 'Texas storm relief deadline (62 counties)', who: ['texas'],
      detail: 'Taxpayers in the 62 Texas counties covered by the July 2026 storm relief have until Feb. 1, 2027 for many filings and payments. Tarrant and Dallas counties are not on the list.',
      source: { label: 'IRS TX-2026-05', url: 'https://www.irs.gov/node/166831' } },
    { date: '2027-03-15', title: 'Partnership and S corporation returns', who: ['businesses'],
      detail: 'Calendar-year partnerships (Form 1065) and S corporations (Form 1120-S) file, or request an extension.',
      source: { label: 'IRS Publication 509', url: 'https://www.irs.gov/publications/p509' } },
    { date: '2027-04-15', title: 'Tax Day: 2026 individual returns due', who: ['everyone'],
      detail: 'File your 2026 return and pay any tax owed, or file Form 4868 for an extension (an extension gives more time to file, not to pay). Also the deadline for 2026 IRA and HSA contributions and the Q1 2027 estimated payment.',
      source: { label: 'IRS: Extension of time to file', url: 'https://www.irs.gov/filing/get-an-extension-to-file-your-tax-return' } },
    { date: '2027-06-15', title: 'Q2 2027 estimated tax payment', who: ['self-employed'],
      detail: 'Second estimated payment for 2027.',
      source: { label: 'IRS: Estimated taxes', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes' } },
    { date: '2027-09-15', title: 'Q3 2027 estimated tax payment', who: ['self-employed', 'businesses'],
      detail: 'Third estimated payment for 2027. Also the deadline for extended partnership and S corporation returns.',
      source: { label: 'IRS Publication 509', url: 'https://www.irs.gov/publications/p509' } },
    { date: '2027-10-15', title: 'Extended 2026 returns due', who: ['everyone'],
      detail: 'Last day to file a 2026 individual return if you requested an extension by April 15.',
      source: { label: 'IRS: Extension of time to file', url: 'https://www.irs.gov/filing/get-an-extension-to-file-your-tax-return' } }
  ],

  // Recent news worth passing on. Newest first.
  news: [
    { date: '2026-10-27', tag: 'Deadline relief',
      title: 'IRS extends deadlines to Feb. 1, 2027 for 62 Texas counties',
      summary: 'Individuals and businesses in counties hit by the storms that began July 14, 2026 (including Bexar, Harris, Travis and Williamson) get until Feb. 1, 2027 for many returns and payments, including fall estimated payments. Tarrant and Dallas are not covered; if you were affected but live elsewhere, the IRS asks you to call 866-562-5227.',
      source: { label: 'IRS TX-2026-05', url: 'https://www.irs.gov/node/166831' } },
    { date: '2026-10-22', tag: 'Identity protection',
      title: 'Get an Identity Protection PIN before tax season',
      summary: 'The IRS is urging taxpayers to secure their IRS online account and get an Identity Protection PIN, a six-digit number that stops anyone else from filing a return with your Social Security number.',
      source: { label: 'IRS: Get an IP PIN', url: 'https://www.irs.gov/identity-theft-fraud-scams/get-an-identity-protection-pin' } },
    { date: '2026-10-01', tag: 'Families',
      title: 'Trump Accounts: request the $1,000 for children born 2025 to 2028',
      summary: 'Treasury has started opening Trump Accounts for eligible children, but the one-time $1,000 government contribution still has to be requested on Form 4547 (online, in the Trump Accounts app, or with your return). The child needs a Social Security number.',
      source: { label: 'IRS: Trump Accounts', url: 'https://www.irs.gov/trumpaccounts' } },
    { date: '2026-09-30', tag: 'Refunds',
      title: 'Paper refund checks are being phased out: use direct deposit',
      summary: 'The IRS is moving refunds to direct deposit and other electronic payments. Have your bank routing and account numbers ready when you file so your refund is not delayed.',
      source: { label: 'IRS: Phase-out of paper refund checks', url: 'https://www.irs.gov/newsroom/irs-to-phase-out-paper-tax-refund-checks-starting-with-individual-taxpayers' } },
    { date: '2026-10-30', tag: 'Coming soon',
      title: '2027 standard deduction and tax brackets',
      summary: 'The IRS usually announces next year’s inflation-adjusted amounts in late October or early November. We will post them here as soon as they are official.',
      source: { label: 'IRS newsroom', url: 'https://www.irs.gov/newsroom/news-releases-for-current-month' } }
  ],

  // Law changes that affect the 2026 returns filed in 2027
  changes: [
    { figure: '$16,100', title: 'Higher standard deduction',
      detail: 'For 2026: $16,100 single, $24,150 head of household, $32,200 married filing jointly.',
      source: { label: 'IRS: Working Families Tax Cuts', url: 'https://www.irs.gov/newsroom/working-families-tax-cuts-individuals-and-workers' } },
    { figure: '$6,000', title: 'Extra deduction for seniors',
      detail: 'Age 65 or older: an extra $6,000 per person ($12,000 if both spouses qualify) on top of the usual senior amount, 2025 through 2028. Phases out above $75,000 income ($150,000 joint).',
      source: { label: 'IRS: Working Families Tax Cuts', url: 'https://www.irs.gov/newsroom/working-families-tax-cuts-individuals-and-workers' } },
    { figure: '$25,000', title: 'No tax on tips',
      detail: 'Deduct up to $25,000 of qualified tips, 2025 through 2028. Phases out above $150,000 income ($300,000 joint). Social Security and Medicare tax still apply.',
      source: { label: 'IRS: Working Families Tax Cuts', url: 'https://www.irs.gov/newsroom/working-families-tax-cuts-individuals-and-workers' } },
    { figure: '$12,500', title: 'No tax on overtime',
      detail: 'Deduct the extra "half" of time-and-a-half pay, up to $12,500 ($25,000 joint), 2025 through 2028. Same income phase-out as tips.',
      source: { label: 'IRS: Working Families Tax Cuts', url: 'https://www.irs.gov/newsroom/working-families-tax-cuts-individuals-and-workers' } },
    { figure: '$10,000', title: 'Car loan interest deduction',
      detail: 'Interest on a loan for a new, U.S.-assembled personal vehicle bought after 2024, up to $10,000 a year (2025 through 2028). Leases don’t qualify; bring your VIN. Phases out above $100,000 income ($200,000 joint).',
      source: { label: 'IRS: Working Families Tax Cuts', url: 'https://www.irs.gov/newsroom/working-families-tax-cuts-individuals-and-workers' } },
    { figure: '$1,000', title: 'Charity deduction without itemizing',
      detail: 'New for 2026: cash gifts to qualifying charities are deductible up to $1,000 ($2,000 joint) even if you take the standard deduction.',
      source: { label: 'TaxAct: 2026 tax changes', url: 'https://blog.taxact.com/changes-for-2026-tax-year/' } },
    { figure: '$2,200', title: 'Child Tax Credit',
      detail: '$2,200 per qualifying child for 2026, with up to $1,700 refundable.',
      source: { label: 'TaxAct: 2026 tax changes', url: 'https://blog.taxact.com/changes-for-2026-tax-year/' } },
    { figure: '$40,400', title: 'Bigger state and local tax (SALT) cap',
      detail: 'Itemizers can deduct up to $40,400 of state and local taxes for 2026 (up from $10,000 before 2025), with a phase-down at higher incomes. In Texas this mostly means property and sales tax.',
      source: { label: 'TaxAct: 2026 tax changes', url: 'https://blog.taxact.com/changes-for-2026-tax-year/' } },
    { figure: '$17,670', title: 'Adoption credit',
      detail: 'Up to $17,670 per child for 2026, with up to $5,120 refundable.',
      source: { label: 'IRS: Working Families Tax Cuts', url: 'https://www.irs.gov/newsroom/working-families-tax-cuts-individuals-and-workers' } }
  ]
};
