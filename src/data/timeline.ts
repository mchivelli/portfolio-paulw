import React from 'react';

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

// Helper function to create a card element with translation support
const createCard = (type: 'work' | 'education', entryKey: string, dateRange: string, t: any) => {
  const isWork = type === 'work';
  const entry = t(`timeline.entries.${entryKey}`, { returnObjects: true });
  
  return React.createElement('div', {
    key: `card-${type}-${entryKey}`,
    className: `rounded-xl border ${isWork ? 'border-primary-purple/60 ring-1 ring-primary-purple/20' : 'border-primary-yellow/60 ring-1 ring-primary-yellow/20'} bg-black/40 p-4 md:p-6 hover:bg-black/60 transition-all hover:shadow-[0_0_24px_${isWork ? 'rgba(139,92,246,0.18)' : 'rgba(234,179,8,0.18)'}]`
  }, [
    React.createElement('div', { key: 'hdr', className: "flex items-center justify-between mb-2" }, [
      React.createElement('span', { 
        key: 'icon', 
        className: `${isWork ? 'text-primary-purple' : 'text-primary-yellow'} font-semibold` 
      }, `${isWork ? '💼' : '🎓'} ${t(`timeline.${type}`)}`),
      React.createElement('span', { 
        key: 'date', 
        className: `text-[11px] md:text-xs px-2 py-0.5 rounded-full border ${isWork ? 'border-primary-purple/40 bg-primary-purple/10 text-primary-purple' : 'border-primary-yellow/40 bg-primary-yellow/10 text-primary-yellow'}` 
      }, dateRange)
    ]),
    React.createElement('div', { 
      key: 't', 
      className: `font-semibold ${isWork ? 'text-primary-purple' : 'text-primary-yellow'}` 
    }, entry.title),
    entry.company && React.createElement('div', { 
      key: 'company', 
      className: `${isWork ? 'text-primary-purple/90' : 'text-primary-yellow/90'} text-sm mt-0.5 font-medium` 
    }, entry.company),
    entry.focus && React.createElement('div', { 
      key: 'focus', 
      className: `${isWork ? 'text-primary-purple/80' : 'text-primary-yellow/80'} text-sm mt-1` 
    }, entry.focus),
    entry.description && React.createElement('div', { 
      key: 'd', 
      className: `${isWork ? 'text-primary-purple/80' : 'text-primary-yellow/80'} text-sm mt-1 italic` 
    }, `(${entry.description})`),
    entry.location && React.createElement('div', { 
      key: 'loc', 
      className: `text-[12px] md:text-xs ${isWork ? 'text-primary-purple/70' : 'text-primary-yellow/70'} mt-2` 
    }, entry.location)
  ]);
};

// Timeline data factory function that takes translation function
export const createTimelineData = (t: any): TimelineEntry[] => [
  {
    title: "2025 – Present",
    content: React.createElement('div', {}, [
      React.createElement('div', {
        key: 'cards-present',
        className: "grid grid-cols-1 gap-4 md:gap-6"
      }, [
        createCard('work', 'civilServices', '2025 – Present', t)
      ])
    ])
  },
  {
    title: "2022 – Present",
    content: React.createElement('div', {}, [
      React.createElement('div', {
        key: 'cards',
        className: "grid grid-cols-1 gap-4 md:gap-6"
      }, [
        createCard('education', 'htlWienWest', '2022 – Present', t)
      ])
    ])
  },
  {
    title: "2024",
    content: React.createElement('div', {}, [
      React.createElement('div', {
        key: 'cards-2024',
        className: "grid grid-cols-1 gap-4 md:gap-6"
      }, [
        createCard('education', 'htlWienWest', '2024', t),
        createCard('work', 'cashierXXXLutz2024', '2024', t)
      ])
    ])
  },
  {
    title: "2023",
    content: React.createElement('div', {}, [
      React.createElement('div', {
        key: 'cards-2023',
        className: "grid grid-cols-1 gap-4 md:gap-6"
      }, [
        createCard('education', 'htlWienWest', '2023', t),
        createCard('work', 'adminAssistantHodlmayr', '2023', t),
        createCard('work', 'cashierXXXLutz2023', '2023', t)
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
        createCard('education', 'htlWienWest', '2022 – 2023', t),
        createCard('work', 'eventStaff', '2022 – 2023', t)
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
        createCard('work', 'contactTracing', '2021 – 2022', t)
      ])
    ])
  },
  {
    title: "2021",
    content: React.createElement('div', {}, [
      React.createElement('div', { 
        key: 'cards-2021', 
        className: "grid grid-cols-1 gap-4 md:gap-6" 
      }, [
        createCard('work', 'realEstateAgent', '2021', t),
        createCard('work', 'laborsIntake', '2021', t)
      ])
    ])
  },
  {
    title: "2020",
    content: React.createElement('div', {}, [
      React.createElement('div', { 
        key: 'cards-2020', 
        className: "grid grid-cols-1 gap-4 md:gap-6" 
      }, [
        createCard('work', 'financialConsultant', '2020', t)
      ])
    ])
  },
  {
    title: "2019 – 2020",
    content: React.createElement('div', {}, [
      React.createElement('div', { 
        key: 'cards-2019-2020', 
        className: "grid grid-cols-1 gap-4 md:gap-6" 
      }, [
        createCard('education', 'vocationalConstruction', '2019 – 2020', t),
        createCard('work', 'apprenticeDrywall', '2019 – 2020', t)
      ])
    ])
  },
  {
    title: "2019",
    content: React.createElement('div', {}, [
      React.createElement('div', { 
        key: 'cards-2019', 
        className: "grid grid-cols-1 gap-4 md:gap-6" 
      }, [
        createCard('work', 'internOVB', '02/2019 – 04/2019', t)
      ])
    ])
  },
  {
    title: "2018 – 2019",
    content: React.createElement('div', {}, [
      React.createElement('div', { 
        key: 'cards-2018-2019', 
        className: "grid grid-cols-1 gap-4 md:gap-6" 
      }, [
        createCard('education', 'vocationalOffice', '2018 – 2019', t)
      ])
    ])
  },
  {
    title: "2018",
    content: React.createElement('div', {}, [
      React.createElement('div', { 
        key: 'cards-2018', 
        className: "grid grid-cols-1 gap-4 md:gap-6" 
      }, [
        createCard('education', 'youthWorkshop', '06/2018 – 08/2018', t)
      ])
    ])
  },
  {
    title: "2017 – 2018",
    content: React.createElement('div', {}, [
      React.createElement('div', { 
        key: 'cards-2017-2018', 
        className: "grid grid-cols-1 gap-4 md:gap-6" 
      }, [
        createCard('education', 'compulsorySchool', '2017 – 2018', t)
      ])
    ])
  },
  {
    title: "2013 – 2017",
    content: React.createElement('div', {}, [
      React.createElement('div', { 
        key: 'cards-2013-2017', 
        className: "grid grid-cols-1 gap-4 md:gap-6" 
      }, [
        createCard('education', 'highSchool', '2013 – 2017', t)
      ])
    ])
  },
  {
    title: "2011 – 2013",
    content: React.createElement('div', {}, [
      React.createElement('div', { 
        key: 'cards-2011-2013', 
        className: "grid grid-cols-1 gap-4 md:gap-6" 
      }, [
        createCard('education', 'bernoulligymnasium', '2011 – 2013', t)
      ])
    ])
  }
];

// Export the timeline data - this will be used by the Timeline component
export const timelineData: TimelineEntry[] = [];