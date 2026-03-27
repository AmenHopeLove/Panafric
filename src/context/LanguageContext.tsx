"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

type Language = "en" | "am" | "fr";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    config: Record<string, any>;
}

const translations = {
    en: {
        // Navbar
        home: "Home",
        about: "About",
        practiceAreas: "Practice Areas",
        insights: "Insights",
        network: "Network",
        news: "News",
        careers: "Careers",
        consultation: "Consultation",
        bookConsultation: "Book Consultation",

        // Home
        heroSubtitle: "Africa's Premier Legal Collaboration",
        heroTitlePart1: "Expertise, Opportunity, ",
        heroTitlePart2: "& Justice Across Borders.",
        heroDesc: "Pan Afric Law Firm connects legal professionals, law firms, and investors into a powerful continental ecosystem of knowledge and growth.",
        joinNetwork: "Join the Network",
        learnMore: "Learn More",
        advancingExcellence: "Advancing legal excellence through digital connectivity and professional synergy.",

        // Stats
        verifiedPartners: "Verified Partners",
        africanMarkets: "African Markets",
        insightsPublished: "Insights Published",
        smartSupport: "Smart Support",

        // Pillars
        howWeOperate: "How We Operate",
        fourPillars: "The Four Pillars of Excellence",
        pillar1Title: "Legal Authority",
        pillar1Desc: "Expert guidance based on decades of multi-jurisdictional legal experience.",
        pillar2Title: "Pan-African Reach",
        pillar2Desc: "A singular gateway for cross-border legal cooperation across the continent.",
        pillar3Title: "Secure Exchange",
        pillar3Desc: "Enterprise-grade security for document sharing and professional collaboration.",
        pillar4Title: "Legal Intelligence",
        pillar4Desc: "Curated insights, regulatory updates, and expert analysis for stakeholders.",

        // About Page
        aboutTitle: "About Pan Afric Law Firm",
        visionTitle: "Our Vision",
        visionDesc: "To be the most trusted and respected law firm in our community, known for our legal excellence, ethical standards, and dedication to client service. Our firm aspires to be ranked among the top law firms in Ethiopia by 2035.",
        missionTitle: "Our Mission",
        missionDesc: "To provide high-quality legal services with integrity, efficiency, and a commitment to achieving the best possible outcomes for our clients.",
        leadershipTitle: "Our Leadership",
        leadershipDesc: "Guided by a pan-African vision and global legal standards.",
        ourStoryTitle: "Our Story",
        historyTitle: "Our History",
        aboutHistory: "Founded in 2000, our law firm has grown from a small practice to a respected legal institution. Over the past decades, we have helped thousands of clients navigate complex legal challenges and achieve favorable outcomes. Our journey has been marked by a commitment to excellence, integrity, and client satisfaction.",
        logoTitle: "Our Logo",
        logoDesc: "Our logo represents the core values and mission of our law firm, combining two powerful symbols into one unified identity.",
        flameTitle: "The Flame of Justice",
        flameDesc: "Represents our burning passion for justice and our commitment to illuminating the path for our clients.",
        handTitle: "The Helping Hand",
        handDesc: "Symbolizes our dedication to supporting and guiding our clients through their legal challenges.",

        // Practice Areas
        practiceAreasTitle: "Excellence in Every Field",
        practiceAreasSubtitle: "Our Practice Areas",
        practice1Title: "Corporate & Commercial Law",
        practice1Desc: "Strategic legal advice for business formation, mergers, and acquisitions.",
        practice2Title: "Investment & Trade Law",
        practice2Desc: "Navigating cross-border investment regulations and international trade protocols.",
        practice3Title: "Litigation & Dispute Resolution",
        practice3Desc: "Robust representation in court and complex civil litigation matters.",
        practice4Title: "Intellectual Property",
        practice4Desc: "Protecting innovation and creative assets in the digital age.",
        practice5Title: "Employment & Labor Law",
        practice5Desc: "Guidance on workforce management and labor regulation compliance.",
        practice6Title: "Real Estate & Infrastructure",
        practice6Desc: "Legal support for property acquisition and large-scale infrastructure projects.",
        practice7Title: "Arbitration & ADR",
        practice7Desc: "Efficient alternative dispute resolution for commercial conflicts.",
        practice8Title: "Compliance & Regulatory",
        practice8Desc: "Ensuring adherence to evolving legal frameworks and standards.",

        // Insights Page
        insightsTitle: "Legal Insights & Knowledge Hub",
        insightsSubtitle: "Intelligence for a Changing Continent",
        featuredInsight: "Featured Insight",
        recentInsights: "Recent Updates",
        categoryEthiopian: "Ethiopian Legal",
        categoryRegulatory: "Regulatory",
        categoryInvestment: "Investment",
        categoryCommentary: "Commentary",
        subscribeNewsletter: "Subscribe to Weekly Briefings",
        subscribeDesc: "Get the latest Pan-African legal updates delivered to your inbox.",
        emailPlaceholder: "Enter your email address",
        subscribeButton: "Subscribe",
        readMore: "Read More",

        // Network Page
        networkTitle: "Pan-African Member Network",
        networkSubtitle: "Connecting Legal Excellence",
        searchPlaceholder: "Search by Name, Firm, or Country...",
        filterCountry: "Country",
        filterExpertise: "Expertise",
        viewProfile: "View Profile",
        joinNetworkTitle: "Join Africa's Legal Future",
        joinNetworkDesc: "Become part of the continent's most authoritative legal ecosystem. Collaborating, growing, and scaling across borders.",

        // Consultation Page
        consultationTitle: "Schedule a Professional Consultation",
        consultationSubtitle: "Secure & Confidential",
        formName: "Full Name",
        formEmail: "Email Address",
        formSubject: "Subject",
        formMessage: "Message / Inquiry Details",
        submitInquiry: "Submit Secure Inquiry",
        addressTitle: "Headquarters",
        addressDetail: "Lideta, Wil eshet Building, 4th floor, Addis Ababa, Ethiopia",
        phoneTitle: "Direct Line",
        emailTitle: "info@panafriclawfirm.com",

        // Careers Page
        careersTitle: "Student & Career Development Hub",
        careersSubtitle: "Empowering the Next Generation",
        internshipsTitle: "Legal Internships",
        mentorshipTitle: "Mentorship Matching",
        trainingTitle: "Legal Training Resources",
        digitalSupport: "Digital Support",
        officeHours: "Office Hours",
        contactTitle: "Get in Touch",
        contactSubtitle: "Connect with Pan Afric",
        contactDesc: "Reach out for general inquiries, partnership opportunities, or to visit our headquarters in Addis Ababa.",
        visitUs: "Visit Our Headquarters",

        // News Page
        newsTitle: "Latest News & Updates",
        newsSubtitle: "Stay Informed with Pan Afric",
        latestUpdates: "Recent Announcements",
        firmNews: "Firm News",
        legalAlerts: "Legal Alerts",
        pressReleases: "Press Releases",
        viewAllNews: "View All News",
        backToNews: "Back to News List",

        // Portal & Checkout (Step 2 & 3)
        portalDashboard: "Dashboard",
        portalDirectory: "Directory",
        portalVault: "The Vault",
        portalSignOut: "Sign Out",
        portalSecureSession: "Encrypted Session",
        clientDashboard: "Client Dashboard",
        memberDashboard: "Member Dashboard",
        newConsultation: "New Consultation",
        activeCases: "Active Inquiries & Cases",
        payRetainer: "Pay Retainer",
        paymentPending: "Payment Pending",
        verifiedMember: "Verified Member",
        applicationUnderReview: "Application Under Review",
        confidentialityNotice: "Confidentiality Notice",
        vaultDesc: "Access proprietary legal frameworks, contract templates, and recordings of private executive briefings.",
        legalJourney: "Legal Journey",
        officialIntake: "Official Legal Intake Submission",
        nextStep: "Next Step",
        previousStep: "Previous Step",
        submitCase: "Submit Case File",
    },
    fr: {
        // Navbar
        home: "Accueil",
        about: "À Propos",
        practiceAreas: "Domaines de Pratique",
        insights: "Perspectives",
        network: "Réseau",
        news: "Actualités",
        careers: "Carrières",
        consultation: "Consultation",
        bookConsultation: "Réserver une Consultation",

        // Home
        heroSubtitle: "Premier Collaboration Juridique de l'Afrique",
        heroTitlePart1: "Expertise, Opportunité, ",
        heroTitlePart2: "& Justice sans Frontières.",
        heroDesc: "Pan Afric Law Firm connecte les professionnels du droit, les cabinets d'avocats et les investisseurs dans un puissant écosystème continental de connaissances et de croissance.",
        joinNetwork: "Rejoindre le Réseau",
        learnMore: "En Savoir Plus",
        advancingExcellence: "Faire progresser l'excellence juridique grâce à la connectivité numérique et à la synergie professionnelle.",

        // Stats
        verifiedPartners: "Partenaires Vérifiés",
        africanMarkets: "Marchés Africains",
        insightsPublished: "Perspectives Publiées",
        smartSupport: "Support Intelligent",

        // Pillars
        howWeOperate: "Comment Nous Opérons",
        fourPillars: "Les Quatre Piliers de l'Excellence",
        pillar1Title: "Autorité Juridique",
        pillar1Desc: "Conseils d'experts basés sur des décennies d'expérience juridique multi-juridictionnelle.",
        pillar2Title: "Portée Panafricaine",
        pillar2Desc: "Une porte d'entrée unique pour la coopération juridique transfrontalière sur le continent.",
        pillar3Title: "Échange Sécurisé",
        pillar3Desc: "Sécurité de niveau entreprise pour le partage de documents et la collaboration professionnelle.",
        pillar4Title: "Intelligence Juridique",
        pillar4Desc: "Perspectives organisées, mises à jour réglementaires et analyses d'experts pour les parties prenantes.",

        // About Page
        aboutTitle: "À Propos de Pan Afric Law Firm",
        visionTitle: "Notre Vision",
        visionDesc: "Être le cabinet d'avocats le plus fiable et le plus respecté de notre communauté, connu pour notre excellence juridique, nos normes éthiques et notre dévouement au service client.",
        missionTitle: "Notre Mission",
        missionDesc: "Fournir des services juridiques de haute qualité avec intégrité, efficacité et un engagement à obtenir les meilleurs résultats possibles pour nos clients.",
        leadershipTitle: "Notre Direction",
        leadershipDesc: "Guidée par une vision panafricaine et des normes juridiques mondiales.",

        // Portal
        portalDashboard: "Tableau de Bord",
        portalDirectory: "Annuaire",
        portalVault: "Le Coffre-fort",
        portalSignOut: "Déconnexion",
        portalSecureSession: "Session Chiffrée",
        clientDashboard: "Tableau de Bord Client",
        memberDashboard: "Tableau de Bord Membre",
        newConsultation: "Nouvelle Consultation",
        activeCases: "Enquêtes et Cas Actifs",
        payRetainer: "Payer l'Acompte",
        paymentPending: "Paiement en Attente",
        verifiedMember: "Membre Vérifié",
        applicationUnderReview: "Candidature en cours d'Examen",
        confidentialityNotice: "Avis de Confidentialité",
        vaultDesc: "Accédez aux cadres juridiques exclusifs, aux modèles de contrats et aux enregistrements de séances d'information privées.",
        legalJourney: "Parcours Juridique",
        officialIntake: "Soumission Officielle d'Admission Juridique",
        nextStep: "Étape Suivante",
        previousStep: "Étape Précédente",
        submitCase: "Soumettre le Dossier",
    },
    am: {
        // Navbar
        home: "መነሻ",
        about: "ስለ እኛ",
        practiceAreas: "የሙያ ዘርፎች",
        insights: "ግንዛቤዎች",
        network: "መረብ",
        news: "ዜና",
        careers: "ሙያ",
        consultation: "ምክክር",
        bookConsultation: "ምክክር ይያዙ",

        // Home
        heroSubtitle: "የአፍሪካ ቀዳሚ የሕግ ትብብር",
        heroTitlePart1: "ልምድ፣ ዕድል፣ ",
        heroTitlePart2: "እና ፍትህ ድንበር ተሻጋሪ።",
        heroDesc: "ፓን አፍሪካ የሕግ ድርጅት የሕግ ባለሙያዎችን፣ የሕግ ድርጅቶችን እና ኢንቨስተሮችን ወደ ኃይለኛ የዕውቀት እና የእድገት አህጉራዊ ሥነ-ምህዳር ያገናኛል።",
        joinNetwork: "መረቡን ይቀላቀሉ",
        learnMore: "ተጨማሪ ይረዱ",
        advancingExcellence: "በዲጂታል ግንኙነት እና በሙያዊ ትብብር የሕግ ልዕልናን ማሳደግ።",

        // Stats
        verifiedPartners: "የተረጋገጡ አጋሮች",
        africanMarkets: "አፍሪካ ገበያዎች",
        insightsPublished: "የታተሙ ግንዛቤዎች",
        smartSupport: "ዘመናዊ ድጋፍ",

        // Pillars
        howWeOperate: "እንዴት እንሰራለን",
        fourPillars: "አራቱ የልዕልና ምሰሶዎች",
        pillar1Title: "የሕግ ባለሥልጣን",
        pillar1Desc: "በብዙ አሥርተ ዓመታት የሕግ ልምድ ላይ የተመሠረተ ባለሙያ መመሪያ።",
        pillar2Title: "መላው አፍሪካ ተደራሽነት",
        pillar2Desc: "በአህጉሪቱ ላይ ለድንበር ተሻጋሪ የሕግ ትብብር ብቸኛ መግቢያ።",
        pillar3Title: "ደህንነቱ የተጠበቀ ልውውጥ",
        pillar3Desc: "ለሰነድ ማጋራት እና ለሙያዊ ትብብር ከፍተኛ ደረጃ ደህንነት።",
        pillar4Title: "የሕግ ብልህነት",
        pillar4Desc: "ለባለድርሻ አካላት የተመረጡ ግንዛቤዎች፣ የቁጥጥር ዝመናዎች እና የባለሙያ ትንተና።",

        // About Page
        aboutTitle: "ስለ ፓን አፍሪካ የሕግ ድርጅት",
        visionTitle: "ራዕያችን",
        visionDesc: "በሕግ ልህቀታችን፣ በሥነ-ምግባር ደረጃዎቻችን እና ለደንበኞች አገልግሎት በሚኖረን ቁርጠኝነት በማህበረሰባችን ውስጥ በጣም የታመነ እና የተከበረ የሕግ ድርጅት መሆን። ድርጅታችን እስከ 2035 ድረስ በኢትዮጵያ ውስጥ ካሉ ቀዳሚ የሕግ ድርጅቶች ተርታ ለመሰለፍ ያልማል።",
        missionTitle: "ተልኳችን",
        missionDesc: "ከፍተኛ ጥራት ያለው የሕግ አገልግሎት በታማኝነት፣ በብቃት እና ለደንበኞቻችን የተሻለ ውጤት ለማስመዝገብ ባለን ቁርጠኝነት መስጠት።",
        leadershipTitle: "አመራራችን",
        leadershipDesc: "በመላው አፍሪካዊ ራዕይ እና ዓለም አቀፍ የሕግ ደረጃዎች የሚመራ።",
        ourStoryTitle: "የእኛ ታሪክ",
        historyTitle: "የእኛ ታሪክ",
        aboutHistory: "በ1995 የተመሰረተው የእኛ ሕግ ፈርም፣ ከትንሽ ስራ ጀምሮ ወደ የተከበረ የሕግ ተቋም ተለውጧል። ባለፉት አስርት ዓመታት ውስጥ በርካታ ደንበኞችን በሕግ ተግዳሮቶች ውስጥ ለመርዳት እና አዎንታዊ ውጤቶችን ለማግኘት አግዝተናል። የእኛ ጉዞ በልህቀት፣ በአግባብ እና በደንበኛ እርካታ ላይ የተመሰረተ ነው።",
        logoTitle: "የእኛ አርማ",
        logoDesc: "የእኛ አርማ የሕግ ድርጅታችንን ዋና እሴቶች እና ተልዕኮ የሚወክል ሲሆን ሁለት ኃይለኛ ምልክቶችን ወደ አንድ የተዋሃደ ማንነት ያጣምራል።",
        flameTitle: "የፍትህ ነበልባል",
        flameDesc: "ለፍትህ ያለንን የሚቃጠል ፍላጎት እና ለደንበኞቻችን መንገዱን ለማብራት ያለንን ቁርጠኝነት ይወክላል።",
        handTitle: "የሚረዳ እጅ",
        handDesc: "ደንበኞቻችንን በሕግ ተግዳሮቶቻቸው ውስጥ ለመደገፍ እና ለመምራት ያለንን መሰጠት ያሳያል።",

        // Practice Areas
        practiceAreasTitle: "በሁሉም ዘርፎች ልዕልና",
        practiceAreasSubtitle: "የእኛ የሙያ ዘርፎች",
        practice1Title: "የኮርፖሬት እና የንግድ ሕግ",
        practice1Desc: "ለንግድ ምስረታ፣ ውህደት እና ግዥ ስልታዊ የሕግ ምክር።",
        practice2Title: "የኢንቨስትመንት እና የንግድ ሕግ",
        practice2Desc: "ድንበር ተሻጋሪ የኢንቨስትመንት ደንቦችን እና ዓለም አቀፍ የንግድ ፕሮቶኮሎችን መዳሰስ።",
        practice3Title: "ክርክር እና የግጭት አፈታት",
        practice3Desc: "በፍርድ ቤት እና ውስብስብ በሆኑ የፍትሐ ብሔር ክርክሮች ውስጥ ጠንካራ ውክልና።",
        practice4Title: "የአእምሮ ሐብት",
        practice4Desc: "በዲጂታል ዘመን ፈጠራን እና የፈጠራ ሀብቶችን መጠበቅ።",
        practice5Title: "የቅጥር እና የሠራተኛ ሕግ",
        practice5Desc: "በሰው ኃይል አስተዳደር እና የሠራተኛ ደንብ ተገዢነት ላይ መመሪያ።",
        practice6Title: "ሪል ስቴት እና መሠረተ ልማት",
        practice6Desc: "ለንብረት ግዥ እና ለከፍተኛ ደረጃ መሠረተ ልማት ፕሮጀክቶች የሕግ ድጋፍ።",
        practice7Title: "ግልግል እና አማራጭ የግጭት አፈታት",
        practice7Desc: "ለንግድ ግጭቶች ቀልጣፋ አማራጭ የግጭት አፈታት።",
        practice8Title: "ተገዢነት እና ደንብ",
        practice8Desc: "ተለዋዋጭ የሕግ ማዕቀፎችን እና ደረጃዎችን መከበራቸውን ማረጋገጥ።",

        // Insights Page
        insightsTitle: "የሕግ ግንዛቤዎች እና የእውቀት ማዕከል",
        insightsSubtitle: "ለተለዋዋጭ አህጉር ብልህነት",
        featuredInsight: "ተለይቶ የቀረበ ግንዛቤ",
        recentInsights: "የቅርብ ጊዜ ዝመናዎች",
        categoryEthiopian: "የኢትዮጵያ ሕግ",
        categoryRegulatory: "የቁጥጥር",
        categoryInvestment: "ኢንቨስትመንት",
        categoryCommentary: "ትንተና",
        subscribeNewsletter: "ለሳምንታዊ መግለጫዎች ይመዝገቡ",
        subscribeDesc: "የቅርብ ጊዜውን የመላው አፍሪካ የሕግ ዝመናዎችን በኢሜልዎ ያግኙ።",
        emailPlaceholder: "የኢሜል አድራሻዎን ያስገቡ",
        subscribeButton: "ይመዝገቡ",
        readMore: "ተጨማሪ ያንብቡ",

        // Network Page
        networkTitle: "የመላው አፍሪካ አባል መረብ",
        networkSubtitle: "የሕግ ልዕልናን ማገናኘት",
        searchPlaceholder: "በስም፣ በድርጅት ወይም በሀገር ይፈልጉ...",
        filterCountry: "ሀገር",
        filterExpertise: "ልምድ",
        viewProfile: "መገለጫውን ይመልከቱ",
        joinNetworkTitle: "የአፍሪካ የሕግ የወደፊት ዕጣ ፈንታ ይቀላቀሉ",
        joinNetworkDesc: "የአህጉሪቱ በጣም ታዋቂ የሕግ ሥነ-ምህዳር አካል ይሁኑ። በትብብር፣ በማደግ እና በድንበር በመስፋፋት ላይ።",

        // Consultation Page
        consultationTitle: "ሙያዊ ምክክር ይያዙ",
        consultationSubtitle: "ደህንነቱ የተጠበቀ እና ሚስጥራዊ",
        formName: "ሙሉ ስም",
        formEmail: "የኢሜል አድራሻ",
        formSubject: "ርዕስ",
        formMessage: "መልዕክት / የጥያቄ ዝርዝሮች",
        submitInquiry: "ደህንነቱ የተጠበቀ ጥያቄ ያስገቡ",
        addressTitle: "ዋና መሥሪያ ቤት",
        addressDetail: "ልደታ፣ ውል እሸት ህንፃ፣ 4ኛ ፎቅ፣ አዲስ አበባ፣ ኢትዮጵያ",
        phoneTitle: "ቀጥተኛ መስመር",
        emailTitle: "info@panafriclawfirm.com",

        // Careers Page
        careersTitle: "የተማሪዎች እና የሙያ ልማት ማዕከል",
        careersSubtitle: "ቀጣዩን ትውልድ ማብቃት",
        internshipsTitle: "የሕግ ልምምድ",
        mentorshipTitle: "የአማካሪነት ትስስር",
        trainingTitle: "የሕግ ሥልጠና ሀብቶች",
        digitalSupport: "ዲጂታል ድጋፍ",
        officeHours: "የሥራ ሰዓታት",
        contactTitle: "ያግኙን",
        contactSubtitle: "ከፓን አፍሪካ ጋር ይገናኙ",
        contactDesc: "ለአጠቃላይ ጥያቄዎች፣ ለአጋርነት ዕድሎች ወይም በአዲስ አበባ የሚገኘውን ዋና መሥሪያ ቤታችንን ለመጎብኘት ያነጋግሩን።",
        visitUs: "ዋና መሥሪያ ቤታችንን ይጎብኙ",

        // News Page
        newsTitle: "የቅርብ ጊዜ ዜናዎች እና ዝመናዎች",
        newsSubtitle: "ከፓን አፍሪካ ጋር ይወቁ",
        latestUpdates: "የቅርብ ጊዜ ማስታወቂያዎች",
        firmNews: "የድርጅቱ ዜና",
        legalAlerts: "የሕግ ማንቂያዎች",
        pressReleases: "ጋዜጣዊ መግለጫዎች",
        viewAllNews: "ሁሉንም ዜናዎች ተመልከት",
        backToNews: "ወደ ዜና ዝርዝር ይመለሱ",

        // Portal
        portalDashboard: "ዳሽቦርድ",
        portalDirectory: "ዳይሬክቶሪ",
        portalVault: "ቮልት (መዝገብ)",
        portalSignOut: "ውጣ",
        portalSecureSession: "ደህንነቱ የተጠበቀ ግንኙነት",
        clientDashboard: "የደንበኞች ዳሽቦርድ",
        memberDashboard: "የአባላት ዳሽቦርድ",
        newConsultation: "አዲስ ምክክር",
        activeCases: "ንቁ ጉዳዮች እና ጥያቄዎች",
        payRetainer: "ቅድመ ክፍያ ይፈጽሙ",
        paymentPending: "ክፍያ በመጠባበቅ ላይ",
        verifiedMember: "የተረጋገጠ አባል",
        applicationUnderReview: "ማመልከቻው በመታየት ላይ ነው",
        confidentialityNotice: "የሚስጥር ማስታወቂያ",
        vaultDesc: "የባለቤትነት የሕግ ማዕቀፎችን፣ የውል አብነቶችን እና የግል ስራ አስፈፃሚ መግለጫዎችን ቅጂዎች ያግኙ።",
        legalJourney: "የሕግ ጉዞ",
        officialIntake: "ኦፊሴላዊ የሕግ ቅበላ አቀራረብ",
        nextStep: "ቀጣይ እርምጃ",
        previousStep: "ቀዳሚ እርምጃ",
        submitCase: "ጉዳዩን ያስገቡ",
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");
    const [config, setConfig] = useState<Record<string, any>>({});
    const [dbTranslations, setDbTranslations] = useState<Record<string, any>>({});

    useEffect(() => {
        async function fetchConfig() {
            const { data, error } = await supabase.from('site_config').select('*');
            if (!error && data) {
                const configMap: Record<string, any> = {};
                const translationOverlay: Record<string, any> = {};

                data.forEach((item: any) => {
                    // If it's a translation overlay (has en/am keys)
                    if (item.value.en && item.value.am) {
                        translationOverlay[item.id] = item.value;
                    } else {
                        // Otherwise it's a direct setting (e.g. phone number)
                        configMap[item.id] = item.value.value || item.value;
                    }
                });

                setConfig(configMap);
                setDbTranslations(translationOverlay);
            }
        }
        fetchConfig();
    }, []);

    const t = (key: string): string => {
        // Check DB overlay first
        if (dbTranslations[key] && dbTranslations[key][language]) {
            return dbTranslations[key][language];
        }
        // Fallback to static translations
        return (translations[language] as any)[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, config }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
