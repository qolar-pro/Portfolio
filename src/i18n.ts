export type LanguageCode = 'en' | 'el' | 'de' | 'fr' | 'mk' | 'it';

export const languageNames: Record<LanguageCode, string> = {
  en: 'English',
  el: 'Ελληνικά',
  de: 'Deutsch',
  fr: 'Français',
  mk: 'Македонски',
  it: 'Italiano'
};

export const translations = {
  en: {
    nav: { available: "Available for work", brandKit: "Brand Kit" },
    hero: { desc: "Transforming complex requirements into elegant, high-performance systems. Specialized in full-stack architecture, data flows, and pixel-perfect interfaces." },
    marquee: ['FULL-STACK ENGINEERING', 'UI/UX DESIGN', 'E-COMMERCE', 'SCALABLE DATABASES', 'SECURE BACKENDS', 'PERFORMANCE OPTIMIZATION'],
    about: {
      title: "ABOUT", heading: "Building digital foundations.",
      p1: "I am a versatile creative technologist with a deep focus on crafting sustainable, high-performance applications.",
      p2: "My approach bridges the gap between rigid engineering and fluid design. From architecting secure backend APIs to fine-tuning layout animations, I believe that quality is a product of holistic understanding."
    },
    services: {
      title: "SERVICES", heading: "What I can do for you.",
      items: [
        { title: "Full-Stack Web Apps", desc: "End-to-end engineering for robust web applications. From pixel-perfect frontends to scalable backend architectures." },
        { title: "E-Commerce Solutions", desc: "Custom, high-conversion online storefronts with secure payment pipelines, product databases, and seamless user experiences." },
        { title: "Internal Systems & Panels", desc: "Bespoke administrative dashboards and business systems designed to streamline operations and securely manage complex data." },
        { title: "Databases & Privacy", desc: "Robust database architecture focused on scalability, performance, strict security protocols, and data privacy compliance." },
        { title: "UI/UX System Design", desc: "Bridging aesthetic vision and functional engineering to create intuitive, accessible, and delightful digital experiences." }
      ]
    },
    experience: {
      title: "EXPERIENCE", heading: "My professional journey.",
      jobs: [
        { role: "Founder & Lead Engineer", company: "APEX Solutions", period: "2021 — Present", desc: "Directing technical strategy, architecting full-stack systems, and delivering production-ready applications for diverse businesses." },
        { role: "Senior Full-Stack Developer", company: "Freelance", period: "2018 — 2021", desc: "Designed and implemented robust e-commerce platforms, payment gateways, and custom administrative dashboards." },
        { role: "Frontend Engineer", company: "Digital Agency", period: "2015 — 2018", desc: "Built highly interactive, accessible, and responsive user interfaces using modern JavaScript frameworks." }
      ]
    },
    work: {
      title: "SELECTED WORK", heading: "Things I've shipped.",
      projects: [
        { title: "APEX SHIFT", tagline: "An intelligent scheduling and shift management platform.", desc: "A comprehensive shift tracking application built for individuals and teams to manage working hours, calculate earnings, and orchestrate complex schedules. Designed for deep personalization — every field, rule, and view can be tailored to the user." },
        { title: "SURVIVING OF SOULS - SOS", tagline: "A 2D top-down survival and expedition game.", desc: "A pixel-driven top-down survival game where players manage resources, embark on procedurally generated expeditions, and navigate hostile environments through crafting, scavenging, and shelter systems." },
        { title: "DRESSCODE E-COMMERCE STORE", tagline: "A complete fashion e-commerce platform for dresses.", desc: "A full-stack e-commerce solution built end-to-end — from a polished storefront and dynamic hero banners to a complete order pipeline, admin tooling, and a custom database layer powering it all." }
      ]
    },
    stack: { title: "STACK", heading: "My technical ecosystem." },
    contact: { title: "CONTACT", heading: "Let's build something.", desc: "Ready to transform your ideas into reality? My inbox is always open for new opportunities.", resume: "View Resume", email: "Send Email" }
  },
  el: {
    nav: { available: "Διαθεσιμος", brandKit: "Brand Kit" },
    hero: { desc: "Μετατρέπω πολύπλοκες απαιτήσεις σε κομψά, υψηλής απόδοσης συστήματα. Εξειδικεύομαι σε full-stack αρχιτεκτονική, ροές δεδομένων και άψογες διεπαφές." },
    marquee: ['FULL-STACK ENGINEERING', 'ΣΧΕΔΙΑΣΜΟΣ UI/UX', 'E-COMMERCE', 'ΚΛΙΜΑΚΩΣΙΜΕΣ ΒΑΣΕΙΣ ΔΕΔΟΜΕΝΩΝ', 'ΑΣΦΑΛΗ BACKENDS', 'ΒΕΛΤΙΣΤΟΠΟΙΗΣΗ ΑΠΟΔΟΣΗΣ'],
    about: {
      title: "ΣΧΕΤΙΚΑ", heading: "Χτίζοντας ψηφιακά θεμέλια.",
      p1: "Είμαι ένας ευέλικτος δημιουργικός τεχνολόγος με βαθιά εστίαση στη δημιουργία βιώσιμων εφαρμογών.",
      p2: "Η προσέγγισή μου γεφυρώνει το χάσμα μεταξύ αυστηρής μηχανικής και ρευστού σχεδιασμού. Από την κατασκευή ασφαλών backend API μέχρι τη βελτιστοποίηση των διεπαφών."
    },
    services: {
      title: "ΥΠΗΡΕΣΙΕΣ", heading: "Τι προσφέρω.",
      items: [
        { title: "Full-Stack Web Apps", desc: "Ολοκληρωμένη κατασκευή για ισχυρές διαδικτυακές εφαρμογές." },
        { title: "Λύσεις Ηλεκτρονικού Εμπορίου", desc: "Προσαρμοσμένα ηλεκτρονικά καταστήματα με ασφαλείς πληρωμές." },
        { title: "Εσωτερικά Συστήματα & Πίνακες", desc: "Προσαρμοσμένοι πίνακες διαχείρισης και επιχειρηματικά συστήματα." },
        { title: "Βάσεις Δεδομένων & Απόρρητο", desc: "Ισχυρή αρχιτεκτονική βάσεων δεδομένων με έμφαση στην ασφάλεια." },
        { title: "Σχεδιασμός Συστήματος UI/UX", desc: "Γεφυρώνοντας το αισθητικό όραμα και τη λειτουργική μηχανική." }
      ]
    },
    experience: {
      title: "ΕΜΠΕΙΡΙΑ", heading: "Η επαγγελματική μου πορεία.",
      jobs: [
        { role: "Founder & Lead Engineer", company: "APEX Solutions", period: "2021 — Σήμερα", desc: "Διεύθυνση τεχνικής στρατηγικής και αρχιτεκτονικής συστημάτων full-stack." },
        { role: "Senior Full-Stack Developer", company: "Ελεύθερος Επαγγελματίας", period: "2018 — 2021", desc: "Σχεδιασμός και υλοποίηση πλατφορμών ηλεκτρονικού εμπορίου και διαχειριστικών συστημάτων." },
        { role: "Frontend Engineer", company: "Digital Agency", period: "2015 — 2018", desc: "Ανάπτυξη διαδραστικών διεπαφών χρήστη με σύγχρονα framework." }
      ]
    },
    work: {
      title: "ΕΠΙΛΕΓΜΕΝΑ ΕΡΓΑ", heading: "Projects που έχω παραδώσει.",
      projects: [
        { title: "APEX SHIFT", tagline: "Μια έξυπνη πλατφόρμα διαχείρισης βαρδιών.", desc: "Μια ολοκληρωμένη εφαρμογή για άτομα και ομάδες, για διαχείριση ωρών εργασίας, υπολογισμό εσόδων και οργάνωση χρονοδιαγραμμάτων. Πλήρως προσαρμόσιμη." },
        { title: "SURVIVING OF SOULS - SOS", tagline: "Ένα 2D παιχνίδι επιβίωσης και εξερεύνησης.", desc: "Ένα top-down παιχνίδι επιβίωσης όπου διαχειρίζεστε πόρους, εξερευνάτε διαδικαστικά δημιουργημένους κόσμους και επιβιώνετε." },
        { title: "DRESSCODE E-COMMERCE STORE", tagline: "Μια ολοκληρωμένη πλατφόρμα e-commerce.", desc: "Μια full-stack λύση e-commerce — από τη βιτρίνα καταστήματος έως τον πίνακα διαχείρισης και τη βάση δεδομένων." }
      ]
    },
    stack: { title: "ΤΕΧΝΟΛΟΓΙΕΣ", heading: "Το τεχνικό μου οικοσύστημα." },
    contact: { title: "ΕΠΙΚΟΙΝΩΝΙΑ", heading: "Ας χτίσουμε κάτι.", desc: "Είστε έτοιμοι να κάνετε τις ιδέες σας πραγματικότητα; Το inbox μου είναι πάντα ανοιχτό.", resume: "Βιογραφικό", email: "Αποστολή Email" }
  },
  de: {
    nav: { available: "Verfügbar", brandKit: "Brand Kit" },
    hero: { desc: "Verwandle komplexe Anforderungen in elegante, leistungsstarke Systeme. Spezialisiert auf Full-Stack," },
    marquee: ['FULL-STACK ENGINEERING', 'UI/UX DESIGN', 'E-COMMERCE', 'DATENBANKEN', 'BACKENDS', 'OPTIMIERUNG'],
    about: { title: "ÜBER", heading: "Digitale Fundamente bauen.", p1: "Ich bin ein vielseitiger kreativer Technologe.", p2: "Mein Ansatz überbrückt die Lücke zwischen starrem Engineering und fließendem Design." },
    services: {
      title: "LEISTUNGEN", heading: "Was ich für Sie tun kann.",
      items: [
        { title: "Full-Stack-Web-Apps", desc: "End-to-End-Engineering." },
        { title: "E-Commerce-Lösungen", desc: "Benutzerdefinierte Online-Shops." },
        { title: "Interne Systeme", desc: "Administrative Dashboards." },
        { title: "Datenbanken", desc: "Robuste Datenbankarchitektur." },
        { title: "UI/UX Design", desc: "Überbrückung von Ästhetik und Design." }
      ]
    },
    experience: {
      title: "ERFAHRUNG", heading: "Meine berufliche Reise.",
      jobs: [
        { role: "Founder & Lead Engineer", company: "APEX Solutions", period: "2021 — Heute", desc: "Leitung der technischen Strategie und Architektur von Full-Stack-Systemen." },
        { role: "Senior Full-Stack Developer", company: "Freelance", period: "2018 — 2021", desc: "Entwurf und Implementierung robuster E-Commerce-Plattformen." },
        { role: "Frontend Engineer", company: "Digital Agency", period: "2015 — 2018", desc: "Entwicklung interaktiver Benutzeroberflächen." }
      ]
    },
    work: { title: "ARBEITEN", heading: "Veröffentlichte Projekte.", projects: [ { title: "APEX SHIFT", tagline: "Intelligente Planung.", desc: "Umfassende Zeiterfassung." }, { title: "SURVIVING OF SOULS", tagline: "2D-Survival-Spiel.", desc: "Ressourcen-Management." }, { title: "DRESSCODE", tagline: "E-Commerce Lösung.", desc: "Full-Stack Shop." } ] },
    stack: { title: "STACK", heading: "Mein technisches Ökosystem." },
    contact: { title: "KONTAKT", heading: "Lass uns etwas bauen.", desc: "Bereit für Ihre Ideen?", resume: "Lebenslauf ansehen", email: "E-Mail senden" }
  },
  fr: {
    nav: { available: "Disponible", brandKit: "Brand Kit" },
    hero: { desc: "Transformer des exigences complexes en systèmes élégants et performants." },
    marquee: ['INGÉNIERIE FULL-STACK', 'DESIGN UI/UX', 'E-COMMERCE', 'BASES DE DONNÉES', 'BACKENDS', 'PERFORMANCE'],
    about: { title: "À PROPOS", heading: "Bâtir des fondations numériques.", p1: "Je suis un technologue créatif.", p2: "Mon approche comble le fossé entre l'ingénierie et le design." },
    services: {
      title: "SERVICES", heading: "Ce que je peux faire pour vous.",
      items: [
        { title: "Applications Full-Stack", desc: "Ingénierie de bout en bout." }, { title: "E-Commerce", desc: "Boutiques en ligne performantes." }, { title: "Systèmes Internes", desc: "Tableaux de bord administratifs." }, { title: "Bases de données", desc: "Architecture de base de données robuste." }, { title: "Design UI/UX", desc: "Créer des expériences intuitives." }
      ]
    },
    experience: {
      title: "EXPÉRIENCE", heading: "Mon parcours professionnel.",
      jobs: [
        { role: "Fondateur & Lead Engineer", company: "APEX Solutions", period: "2021 — Présent", desc: "Direction de la stratégie technique globale." },
        { role: "Développeur Full-Stack", company: "Freelance", period: "2018 — 2021", desc: "Conception de plateformes e-commerce." },
        { role: "Développeur Frontend", company: "Digital Agency", period: "2015 — 2018", desc: "Développement d'interfaces utilisateur interactives." }
      ]
    },
    work: { title: "TRAVAUX", heading: "Mes réalisations.", projects: [ { title: "APEX SHIFT", tagline: "Planification.", desc: "Application de suivi des quarts." }, { title: "SURVIVING OF SOULS", tagline: "Jeu de survie 2D.", desc: "Jeu de survie avec gestion des ressources." }, { title: "DRESSCODE", tagline: "Boutique en ligne.", desc: "Solution e-commerce full-stack." } ] },
    stack: { title: "TECHNOLOGIES", heading: "Mon écosystème technique." },
    contact: { title: "CONTACT", heading: "Construisons ensemble.", desc: "Prêt à transformer vos idées ?", resume: "Voir le CV", email: "Envoyer un e-mail" }
  },
  mk: {
    nav: { available: "Достапен", brandKit: "Бренд Кит" },
    hero: { desc: "Трансформирање сложени барања во елегантни системи." },
    marquee: ['FULL-STACK ENGINEERING', 'UI/UX ДИЗАЈН', 'Е-ТРГОВИЈА', 'БАЗИ НА ПОДАТОЦИ', 'BACKENDS', 'ОПТИМИЗАЦИЈА'],
    about: { title: "ЗА МЕНЕ", heading: "Градење дигитални темели.", p1: "Јас сум разновиден креативен технолог.", p2: "Мојот пристап го премостува јазот помеѓу инженерство и дизајн." },
    services: {
      title: "УСЛУГИ", heading: "Што можам да направам за вас.",
      items: [
        { title: "Full-Stack Апликации", desc: "Инженерство од крај до крај." }, { title: "Е-трговија", desc: "Приспособени онлајн продавници." }, { title: "Внатрешни Системи", desc: "Прилагодени контролни табли." }, { title: "Бази на Податоци", desc: "Робустна архитектура." }, { title: "UI/UX Дизајн", desc: "Естетска визија и функционалност." }
      ]
    },
    experience: {
      title: "ИСКУСТВО", heading: "Моето професионално патување.",
      jobs: [
        { role: "Основач и Главен Инженер", company: "APEX Solutions", period: "2021 — Денес", desc: "Насочување на техничката стратегија." },
        { role: "Full-Stack Програмер", company: "Freelance", period: "2018 — 2021", desc: "Дизајн и имплементација на е-трговија платформи." },
        { role: "Frontend Програмер", company: "Digital Agency", period: "2015 — 2018", desc: "Изградба на интерактивни кориснички интерфејси." }
      ]
    },
    work: { title: "РАБОТА", heading: "Мои проекти.", projects: [ { title: "APEX SHIFT", tagline: "Платформа за смени.", desc: "Апликација за следење смени." }, { title: "SURVIVING OF SOULS", tagline: "2D игра.", desc: "Игра со преживување." }, { title: "DRESSCODE", tagline: "Е-трговија.", desc: "Full-stack решение." } ] },
    stack: { title: "ТЕХНОЛОГИИ", heading: "Мојот технички екосистем." },
    contact: { title: "КОНТАКТ", heading: "Ајде да градиме.", desc: "Подготвени сте?", resume: "Биографија", email: "Испрати Емаил" }
  },
  it: {
    nav: { available: "Disponibile", brandKit: "Brand Kit" },
    hero: { desc: "Trasformare requisiti complessi in sistemi eleganti." },
    marquee: ['FULL-STACK ENGINEERING', 'DESIGN UI/UX', 'E-COMMERCE', 'DATABASE SCALABILI', 'BACKENDS SICURI', 'OTTIMIZZAZIONE'],
    about: { title: "CHI SONO", heading: "Costruire fondamenta digitali.", p1: "Sono un tecnologo creativo.", p2: "Il mio approccio colma il divario tra ingegneria e design." },
    services: {
      title: "SERVIZI", heading: "Cosa posso fare per te.",
      items: [
        { title: "App Web Full-Stack", desc: "Sviluppo end-to-end." }, { title: "E-Commerce", desc: "Vetrine online personalizzate." }, { title: "Sistemi Interni", desc: "Dashboard amministrativi." }, { title: "Database", desc: "Architettura del database robusta." }, { title: "UI/UX", desc: "Unire visione estetica e funzionalità." }
      ]
    },
    experience: {
      title: "ESPERIENZA", heading: "Il mio percorso professionale.",
      jobs: [
        { role: "Fondatore e Lead Engineer", company: "APEX Solutions", period: "2021 — Presente", desc: "Direzione della strategia tecnica." },
        { role: "Sviluppatore Full-Stack", company: "Freelance", period: "2018 — 2021", desc: "Progettazione di piattaforme e-commerce." },
        { role: "Sviluppatore Frontend", company: "Digital Agency", period: "2015 — 2018", desc: "Sviluppo di interfacce utente interattive." }
      ]
    },
    work: { title: "PROGETTI", heading: "Cose che ho completato.", projects: [ { title: "APEX SHIFT", tagline: "Piattaforma turni.", desc: "App per il monitoraggio dei turni." }, { title: "SURVIVING OF SOULS", tagline: "Gioco 2D.", desc: "Sopravvivenza in un mondo pixelato." }, { title: "DRESSCODE", tagline: "E-commerce completa.", desc: "Soluzione e-commerce full-stack." } ] },
    stack: { title: "TECNOLOGIE", heading: "Ecosistema tecnico." },
    contact: { title: "CONTATTO", heading: "Costruiamo qualcosa.", desc: "Pronto a trasformare le tue idee?", resume: "Visualizza CV", email: "Invia Email" }
  }
};
