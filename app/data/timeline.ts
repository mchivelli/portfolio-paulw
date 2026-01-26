export interface TimelineItem {
    year: string;
    role: { [key: string]: string };
    company: string; // Company names usually don't change
    description: { [key: string]: string };
    tech: string[];
}

export const timeline: TimelineItem[] = [
    {
        year: "2026",
        role: { en: "Developer/IT Support", de: "Entwickler/IT Support" },
        company: "G&W Steuerberatung",
        description: {
            en: "Onboarding Process with E-Signature, Admin Page, multiple Endpoints and External Services Integration.",
            de: "Onboarding Prozess mit E-Signatur, Admin Page, multiple Endpoints and External Services Integration."
        },
        tech: ["Full Stack", "E-Signature", "API Integration"]
    },
    {
        year: "2024",
        role: { en: "Civil Service (Zivildiener)", de: "Zivildiener" },
        company: "Bundesministerium für Inneres (BMI)",
        description: {
            en: "Served as Zivildiener, supporting administrative and operational tasks.",
            de: "Tätig als Zivildiener, Unterstützung bei administrativen und operativen Aufgaben."
        },
        tech: ["Administration", "Public Service"]
    },
    {
        year: "2023",
        role: { en: "Administrative Assistant", de: "Administrative Assistenz" },
        company: "Hödlmayr Urban Logistics",
        description: {
            en: "Implemented automation; handled authority inquiries and insurance documents; supported purchasing; optimized workflows.",
            de: "Automatisierung implementiert; Behördenanfragen und Versicherungsdokumente bearbeitet; Einkauf unterstützt; Workflows optimiert."
        },
        tech: ["Automation", "Workflow Optimization"]
    },
    {
        year: "2023",
        role: { en: "Cashier Assistant", de: "Kassierassistent" },
        company: "XXXLutz KG",
        description: {
            en: "Checkout, customer service, returns and complaints, sales floor support.",
            de: "Kasse, Kundenservice, Retouren und Reklamationen, Verkaufsunterstützung."
        },
        tech: ["Customer Service", "Sales"]
    },
    {
        year: "2022",
        role: { en: "Evening Student", de: "Abendschüler" },
        company: "HTL Wien West",
        description: {
            en: "Focusing on Computer Science and Software Engineering in evening school.",
            de: "Fokus auf Informatik und Software Engineering in der Abendschule."
        },
        tech: ["Java", "C#", "Network Engineering", "Database Systems"]
    },
    {
        year: "2022",
        role: { en: "Event Staff", de: "Event Mitarbeiter" },
        company: "Eventiv GmbH",
        description: {
            en: "Service, cashier operations, cloakroom, stage setup, front desk.",
            de: "Service, Kasse, Garderobe, Bühnenaufbau, Empfang."
        },
        tech: ["Logistics", "Customer Relations"]
    },
    {
        year: "2021",
        role: { en: "Apprentice Real Estate Agent", de: "Immobilienkaufmann Lehre" },
        company: "Paul & Partner Immobilien",
        description: {
            en: "Email handling, mail in/out, client acquisition, administrative tasks.",
            de: "E-Mail-Bearbeitung, Postein-/-ausgang, Kundenakquise, administrative Aufgaben."
        },
        tech: ["Administration", "Client Relations"]
    },
    {
        year: "2021",
        role: { en: "Order & Sample Intake", de: "Auftrags- & Probenannahme" },
        company: "Gruppenpraxis Labors.at",
        description: {
            en: "Data entry, order registration, sample processing, administrative support.",
            de: "Dateneingabe, Auftragserfassung, Probenbearbeitung, administrative Unterstützung."
        },
        tech: ["Data Entry", "Process Management"]
    },
    {
        year: "2020",
        role: { en: "Trainee Financial Consultant", de: "Trainee Finanzberater" },
        company: "Euro Finanz Service AG",
        description: {
            en: "Client acquisition, sales of insurance products, asset management, customer advisory.",
            de: "Kundenakquise, Verkauf von Versicherungsprodukten, Vermögensverwaltung, Kundenberatung."
        },
        tech: ["Finance", "Sales"]
    },
    {
        year: "2019",
        role: { en: "Apprentice Drywall Installer", de: "Trockenbauer Lehre" },
        company: "STRABAG AG",
        description: {
            en: "Construction assistance, drywall work, foundations of plastering.",
            de: "Bauhilfe, Trockenbauarbeiten, Grundlagen des Verputzens."
        },
        tech: ["Construction"]
    }
];
