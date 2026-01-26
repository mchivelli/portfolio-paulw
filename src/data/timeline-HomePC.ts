import React from 'react';

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const timelineData: TimelineEntry[] = [
  {
    title: "2022 – Present",
    content: React.createElement('div', {}, [
      React.createElement('div', {
        key: 'cards',
        className: "grid grid-cols-1 gap-4 md:gap-6"
      }, [
        React.createElement('div', {
          key: 'card-edu-2022',
          className: "rounded-xl border border-terminal-yellow/60 ring-1 ring-terminal-yellow/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(250,204,21,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-yellow font-semibold" }, "🎓 Education"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-yellow/40 bg-terminal-yellow/10 text-terminal-yellow" }, "2022 – Present")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-yellow" }, "HTL Wien West (Evening School)"),
          React.createElement('div', { key: 'focus', className: "text-terminal-green/80 text-sm mt-1" }, "Focus: Computer Science"),
          React.createElement('div', { key: 'loc', className: "text-[12px] md:text-xs text-terminal-green/70 mt-2" }, "Location: Vienna")
        ])
      ])
    ])
  },
  // Year-specific work entries extracted from ranges/Present
  {
    title: "2023",
    content: React.createElement('div', {}, [
      React.createElement('div', {
        key: 'cards-2023',
        className: "grid grid-cols-1 gap-4 md:gap-6"
      }, [
        React.createElement('div', {
          key: 'card-job-hodlmayr-2023',
          className: "rounded-xl border border-terminal-green/60 ring-1 ring-terminal-green/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-green font-semibold" }, "💼 Work"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-green/40 bg-terminal-green/10 text-terminal-green" }, "2023")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-green" }, "Administrative Assistant — Hödlmayr Urban Logistics GmbH"),
          React.createElement('div', { key: 'd', className: "text-terminal-green/80 text-sm mt-1 italic" }, "(Implemented automation; handled authority inquiries and insurance documents; supported purchasing; optimized workflows; coordinated organizational tasks)")
        ]),
        React.createElement('div', {
          key: 'card-job-xxxlutz-2023',
          className: "rounded-xl border border-terminal-green/60 ring-1 ring-terminal-green/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-green font-semibold" }, "💼 Work"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-green/40 bg-terminal-green/10 text-terminal-green" }, "2023")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-green" }, "Cashier Assistant (fixed-term) — XXXLutz KG"),
          React.createElement('div', { key: 'd', className: "text-terminal-green/80 text-sm mt-1 italic" }, "(Checkout, customer service, returns and complaints, sales floor support)")
        ]),
        React.createElement('div', {
          key: 'card-edu-htl-2023',
          className: "rounded-xl border border-terminal-yellow/60 ring-1 ring-terminal-yellow/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(250,204,21,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-yellow font-semibold" }, "🎓 Education"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-yellow/40 bg-terminal-yellow/10 text-terminal-yellow" }, "2022 – Present")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-yellow" }, "HTL Wien West (Evening School)"),
          React.createElement('div', { key: 'focus', className: "text-terminal-green/80 text-sm mt-1" }, "Focus: Computer Science"),
          React.createElement('div', { key: 'loc', className: "text-[12px] md:text-xs text-terminal-green/70 mt-2" }, "Location: Vienna")
        ])
      ])
    ])
  },
  {
    title: "2022 – 2023",
    content: React.createElement('div', {}, [
      React.createElement('div', {
        key: 'cards-2022-2023',
        className: "grid grid-cols-1 gap-4 md:gap-6"
      }, [
        React.createElement('div', {
          key: 'card-job-eventiv-2022-2023',
          className: "rounded-xl border border-terminal-green/60 ring-1 ring-terminal-green/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-green font-semibold" }, "💼 Work"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-green/40 bg-terminal-green/10 text-terminal-green" }, "2022 – 2023")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-green" }, "Event Staff — Eventiv GmbH"),
          React.createElement('div', { key: 'd', className: "text-terminal-green/80 text-sm mt-1 italic" }, "(Service, cashier operations, cloakroom, stage setup, front desk)")
        ])
      ])
    ])
  },
  {
    title: "2021 – 2022",
    content: React.createElement('div', {}, [
      React.createElement('div', {
        key: 'cards-2021-2022',
        className: "grid grid-cols-1 gap-4 md:gap-6"
      }, [
        React.createElement('div', {
          key: 'card-job-stadt-2021-2022',
          className: "rounded-xl border border-terminal-green/60 ring-1 ring-terminal-green/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-green font-semibold" }, "💼 Work"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-green/40 bg-terminal-green/10 text-terminal-green" }, "2021 – 2022")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-green" }, "Contact Tracing Associate — Stadtservice Wien"),
          React.createElement('div', { key: 'd', className: "text-terminal-green/80 text-sm mt-1 italic" }, "(Recorded and analyzed customer/patient data; managed calls; handled complaints)")
        ])
      ])
    ])
  },
  {
    title: "2021",
    content: React.createElement('div', {}, [
      React.createElement('div', { key: 'cards-2021-pp', className: "grid grid-cols-1 gap-4 md:gap-6" }, [
        React.createElement('div', {
          key: 'card-job-realestate-2021',
          className: "rounded-xl border border-terminal-green/60 ring-1 ring-terminal-green/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-green font-semibold" }, "💼 Work"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-green/40 bg-terminal-green/10 text-terminal-green" }, "2021")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-green" }, "Apprentice Real Estate Agent — Paul & Partner Immobilien Investment"),
          React.createElement('div', { key: 'd', className: "text-terminal-green/80 text-sm mt-1 italic" }, "(Email handling, mail in/out, client acquisition, administrative tasks)")
        ])
      ])
    ])
  },
  {
    title: "2021",
    content: React.createElement('div', {}, [
      React.createElement('div', { key: 'cards-2021-labors', className: "grid grid-cols-1 gap-4 md:gap-6" }, [
        React.createElement('div', {
          key: 'card-job-labors-2021',
          className: "rounded-xl border border-terminal-green/60 ring-1 ring-terminal-green/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-green font-semibold" }, "💼 Work"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-green/40 bg-terminal-green/10 text-terminal-green" }, "2021")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-green" }, "Order & Sample Intake — Gruppenpraxis Labors.at"),
          React.createElement('div', { key: 'd', className: "text-terminal-green/80 text-sm mt-1 italic" }, "(Data entry, order registration, sample processing, administrative support)")
        ])
      ])
    ])
  },
  {
    title: "2020",
    content: React.createElement('div', {}, [
      React.createElement('div', { key: 'cards-2020-efs', className: "grid grid-cols-1 gap-4 md:gap-6" }, [
        React.createElement('div', {
          key: 'card-job-efs-2020',
          className: "rounded-xl border border-terminal-green/60 ring-1 ring-terminal-green/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-green font-semibold" }, "💼 Work"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-green/40 bg-terminal-green/10 text-terminal-green" }, "2020")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-green" }, "Trainee Financial/Wealth Consultant — Euro Finanz Service AG"),
          React.createElement('div', { key: 'd', className: "text-terminal-green/80 text-sm mt-1 italic" }, "(Client acquisition, sales of insurance products, asset management, customer advisory)")
        ])
      ])
    ])
  },
  {
    title: "2019 – 2020",
    content: React.createElement('div', {}, [
      React.createElement('div', { key: 'cards-2019-2020', className: "grid grid-cols-1 gap-4 md:gap-6" }, [
        React.createElement('div', {
          key: 'card-edu-2019-2020',
          className: "rounded-xl border border-terminal-yellow/60 ring-1 ring-terminal-yellow/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(250,204,21,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-yellow font-semibold" }, "🎓 Education"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-yellow/40 bg-terminal-yellow/10 text-terminal-yellow" }, "2019 – 2020")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-yellow" }, "Vocational School for Construction"),
          React.createElement('div', { key: 'focus', className: "text-terminal-green/80 text-sm mt-1" }, "Focus: Construction basics"),
          React.createElement('div', { key: 'loc', className: "text-[12px] md:text-xs text-terminal-green/70 mt-2" }, "Location: Vienna")
        ]),
        React.createElement('div', {
          key: 'card-job-strabag-2019-2020',
          className: "rounded-xl border border-terminal-green/60 ring-1 ring-terminal-green/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-green font-semibold" }, "💼 Work"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-green/40 bg-terminal-green/10 text-terminal-green" }, "2019 – 2020")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-green" }, "Apprentice Drywall Installer/Plasterer — STRABAG AG"),
          React.createElement('div', { key: 'd', className: "text-terminal-green/80 text-sm mt-1 italic" }, "(Construction assistance, drywall work, foundations of plastering)")
        ])
      ])
    ])
  },
  {
    title: "2019",
    content: React.createElement('div', {}, [
      React.createElement('div', { key: 'cards-2019-intern', className: "grid grid-cols-1 gap-4 md:gap-6" }, [
        React.createElement('div', {
          key: 'card-job-intern-2019',
          className: "rounded-xl border border-terminal-green/60 ring-1 ring-terminal-green/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-green font-semibold" }, "💼 Work"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-green/40 bg-terminal-green/10 text-terminal-green" }, "02/2019 – 04/2019")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-green" }, "Intern — OVB Allfinanzvermittlung GmbH / Euro Finanz Service AG"),
          React.createElement('div', { key: 'd', className: "text-terminal-green/80 text-sm mt-1 italic" }, "(Administrative support, lead acquisition, data entry/maintenance)")
        ])
      ])
    ])
  },
  {
    title: "2018 – 2019",
    content: React.createElement('div', {}, [
      React.createElement('div', { key: 'cards-2018-2019', className: "grid grid-cols-1 gap-4 md:gap-6" }, [
        React.createElement('div', {
          key: 'card-edu-office-2018-2019',
          className: "rounded-xl border border-terminal-yellow/60 ring-1 ring-terminal-yellow/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(250,204,21,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-yellow font-semibold" }, "🎓 Education"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-yellow/40 bg-terminal-yellow/10 text-terminal-yellow" }, "2018 – 2019")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-yellow" }, "Vocational School for Office Clerks"),
          React.createElement('div', { key: 'focus', className: "text-terminal-green/80 text-sm mt-1" }, "Focus: Office Clerk / Sports Administration (Dual Apprenticeship) — ibis acam Bildungs GmbH"),
          React.createElement('div', { key: 'loc', className: "text-[12px] md:text-xs text-terminal-green/70 mt-2" }, "Location: Vienna")
        ])
      ])
    ])
  },
  {
    title: "2018",
    content: React.createElement('div', {}, [
      React.createElement('div', { key: 'cards-2018-bfi', className: "grid grid-cols-1 gap-4 md:gap-6" }, [
        React.createElement('div', {
          key: 'card-edu-bfi-2018',
          className: "rounded-xl border border-terminal-yellow/60 ring-1 ring-terminal-yellow/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(250,204,21,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-yellow font-semibold" }, "🎓 Education"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-yellow/40 bg-terminal-yellow/10 text-terminal-yellow" }, "06/2018 – 08/2018")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-yellow" }, "Youth Workshop — BFI Vienna"),
          React.createElement('div', { key: 'loc', className: "text-[12px] md:text-xs text-terminal-green/70 mt-2" }, "Location: Vienna")
        ])
      ])
    ])
  },
  {
    title: "2017 – 2018",
    content: React.createElement('div', {}, [
      React.createElement('div', { key: 'cards-2017-2018', className: "grid grid-cols-1 gap-4 md:gap-6" }, [
        React.createElement('div', {
          key: 'card-edu-vhs-2017-2018',
          className: "rounded-xl border border-terminal-yellow/60 ring-1 ring-terminal-yellow/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(250,204,21,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-yellow font-semibold" }, "🎓 Education"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-yellow/40 bg-terminal-yellow/10 text-terminal-yellow" }, "2017 – 2018")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-yellow" }, "Compulsory School Completion Course — VHS Meidling"),
          React.createElement('div', { key: 'focus', className: "text-terminal-green/80 text-sm mt-1" }, "Recognition: Austrian 9th grade equivalent for Philippine 10th grade"),
          React.createElement('div', { key: 'loc', className: "text-[12px] md:text-xs text-terminal-green/70 mt-2" }, "Location: Vienna")
        ])
      ])
    ])
  },
  {
    title: "2013 – 2017",
    content: React.createElement('div', {}, [
      React.createElement('div', { key: 'cards-2013-2017', className: "grid grid-cols-1 gap-4 md:gap-6" }, [
        React.createElement('div', {
          key: 'card-edu-highschool-2013-2017',
          className: "rounded-xl border border-terminal-yellow/60 ring-1 ring-terminal-yellow/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(250,204,21,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-yellow font-semibold" }, "🎓 Education"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-yellow/40 bg-terminal-yellow/10 text-terminal-yellow" }, "2013 – 2017")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-yellow" }, "High School"),
          React.createElement('div', { key: 'loc', className: "text-[12px] md:text-xs text-terminal-green/70 mt-2" }, "Location: Palawan, Philippines")
        ])
      ])
    ])
  },
  {
    title: "2011 – 2013",
    content: React.createElement('div', {}, [
      React.createElement('div', { key: 'cards-2011-2013', className: "grid grid-cols-1 gap-4 md:gap-6" }, [
        React.createElement('div', {
          key: 'card-edu-bernoulli-2011-2013',
          className: "rounded-xl border border-terminal-yellow/60 ring-1 ring-terminal-yellow/20 bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_rgba(250,204,21,0.18)]"
        }, [
          React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
            React.createElement('span', { key: 'icon', className: "text-terminal-yellow font-semibold" }, "🎓 Education"),
            React.createElement('span', { key: 'date', className: "text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-terminal-yellow/40 bg-terminal-yellow/10 text-terminal-yellow" }, "2011 – 2013")
          ]),
          React.createElement('div', { key: 't', className: "font-semibold text-terminal-yellow" }, "Bernoulligymnasium"),
          React.createElement('div', { key: 'loc', className: "text-[12px] md:text-xs text-terminal-green/70 mt-2" }, "Location: Vienna")
        ])
      ])
    ])
  },
];