
import React from 'react';
import { TimelineCard } from '../components/ui/timeline-card';
import htlBg from '../assets/htlwienwest_bg.jpg';
import bmiBg from '../assets/bmi_bg.jpg';

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

// Helper function to create a card element with translation support
const createCard = (type: 'work' | 'education', entryKey: string, dateRange: string, t: any, images: string[] = []) => {
  const entry = t(`timeline.entries.${entryKey}`, { returnObjects: true });

  // Create props object for TimelineCard
  const props = {
    key: `card-${type}-${entryKey}`,
    type,
    title: entry.title, // Title from translation
    company: entry.company, // Company from translation
    description: entry.description, // Description from translation
    date: dateRange,
    location: entry.location, // Location from translation
    focus: entry.focus, // Focus from translation
    images: images
  };

  return React.createElement(TimelineCard, props);
};

// Timeline data factory function that takes translation function
export const createTimelineData = (t: any): TimelineEntry[] => [
  {
    title: "2025 – Present",
    content: React.createElement('div', {}, [
      React.createElement('div', {
        key: 'cards-present',
        className: "grid grid-cols-1 gap-6 md:gap-8"
      }, [
        createCard('work', 'civilServices', '2025 – Present', t, [bmiBg])
      ])
    ])
  },
  {
    title: "2022 – Present",
    content: React.createElement('div', {}, [
      React.createElement('div', {
        key: 'cards',
        className: "grid grid-cols-1 gap-6 md:gap-8"
      }, [
        createCard('education', 'htlWienWest', '2022 – Present', t, [htlBg])
      ])
    ])
  },
  {
    title: "2024",
    content: React.createElement('div', {}, [
      React.createElement('div', {
        key: 'cards-2024',
        className: "grid grid-cols-1 gap-6 md:gap-8"
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
        className: "grid grid-cols-1 gap-6 md:gap-8"
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
        className: "grid grid-cols-1 gap-6 md:gap-8"
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
        className: "grid grid-cols-1 gap-6 md:gap-8"
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
        className: "grid grid-cols-1 gap-6 md:gap-8"
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
        className: "grid grid-cols-1 gap-6 md:gap-8"
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
        className: "grid grid-cols-1 gap-6 md:gap-8"
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
        className: "grid grid-cols-1 gap-6 md:gap-8"
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
        className: "grid grid-cols-1 gap-6 md:gap-8"
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
        className: "grid grid-cols-1 gap-6 md:gap-8"
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
        className: "grid grid-cols-1 gap-6 md:gap-8"
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
        className: "grid grid-cols-1 gap-6 md:gap-8"
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
        className: "grid grid-cols-1 gap-6 md:gap-8"
      }, [
        createCard('education', 'bernoulligymnasium', '2011 – 2013', t)
      ])
    ])
  }
];

export const timelineData: TimelineEntry[] = [];