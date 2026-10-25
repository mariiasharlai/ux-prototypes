import { useEffect, useMemo, useRef, useState } from "react";
import progressReference from "./assets/progress-88-reference.png";
import "./App.css";

const jobs = [
  {
    id: "warehouse",
    title: "Warehouse Worker",
    company: "Nordic Logistics Oy",
    location: "Tampere, Finland",
    salary: "€2,350–€2,650 / month",
    match: 84,
    type: "Full-time",
    requirements: [
      ["Warehouse experience", "met"],
      ["English A2+", "met"],
      ["Forklift licence", "met"],
      ["Night shift availability", "unclear"],
      ["Inventory system experience", "unclear"],
    ],
  },
  {
    id: "production",
    title: "Production Operator",
    company: "Suomi Manufacturing",
    location: "Pirkanmaa, Finland",
    salary: "€2,450–€2,800 / month",
    match: 76,
    type: "Full-time",
    requirements: [
      ["Production experience", "met"],
      ["Technical drawing", "missing"],
      ["English A2+", "met"],
      ["Shift work", "unclear"],
    ],
  },
  {
    id: "logistics",
    title: "Logistics Assistant",
    company: "NorthRoute Services",
    location: "Helsinki, Finland",
    salary: "€2,300–€2,550 / month",
    match: 71,
    type: "Full-time",
    requirements: [
      ["Logistics background", "met"],
      ["English B1", "unclear"],
      ["Driving licence B", "missing"],
      ["Inventory systems", "unclear"],
    ],
  },
];

const initialProfile = {
  fullName: "Sari Dewi",
  nationality: "Indonesian",
  birthDate: "1995-03-12",
  location: "Jakarta, Indonesia",
  email: "sari.dewi@email.com",
  phone: "+62 812 3456 7890",
  summary: "Warehouse & Logistics Worker with experience in warehouse operations, production, packing and inventory handling.",
  experience: [
    {
      id: 1,
      role: "Warehouse Worker",
      company: "PT Logistik Indonesia",
      place: "Jakarta, Indonesia",
      period: "Jan 2020 – Dec 2023",
      bullets: [
        "Picked and packed customer orders",
        "Performed daily stock checks",
        "Operated warehouse equipment safely",
      ],
    },
    {
      id: 2,
      role: "Production Operator",
      company: "PT Maju Bersama",
      place: "Tangerang, Indonesia",
      period: "Jun 2017 – Dec 2019",
      bullets: ["Supported daily production tasks", "Checked product quality before packing"],
    },
  ],
  education: [
    { school: "SMA Negeri 1 Jakarta", degree: "Senior High School", place: "Jakarta, Indonesia", period: "2014 – 2017", level: "Secondary education", faculty: "", specialisation: "", graduationYear: "2017" },
    { school: "Jakarta Training Centre", degree: "Vocational Training — Logistics & Warehouse Operations", place: "Jakarta, Indonesia", period: "2018", level: "Vocational training", faculty: "Logistics", specialisation: "Warehouse Operations", graduationYear: "2018" },
    { school: "Indonesian Logistics Academy", degree: "Forklift & Workplace Safety Training", place: "Jakarta, Indonesia", period: "2021", level: "Professional training", faculty: "Logistics", specialisation: "Forklift & Workplace Safety", graduationYear: "2021" },
    { school: "University of Indonesia", degree: "Bachelor’s Degree — Graphic Design", place: "Jakarta, Indonesia", period: "2017 – 2021", level: "Bachelor’s degree", faculty: "Faculty of Art and Design", specialisation: "Graphic Design", graduationYear: "2021" },
  ],
  skills: ["Warehouse Operations", "Packing", "Inventory Management", "Teamwork"],
  languages: ["Indonesian — Native", "English — Basic (A2)"],
  certificates: ["Forklift Licence — issued Mar 2021"],
  targetCountry: "Finland",
};

const mockAiSuggestions = [
  "Add your English proficiency level.",
  "Add a short description to your most recent work experience.",
  "Add relevant certificates if you have them.",
  "Add your availability or start date.",
];

const suggestedSkills = [
  "Warehouse Operations",
  "Inventory Management",
  "Packing",
  "Forklift Operation",
  "Order Picking",
  "Stock Control",
  "Logistics",
  "Quality Control",
  "Shift Work",
  "Workplace Safety",
  "Teamwork",
  "Production Operations",
];

const monthNumbers = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

function companyDuration(positions) {
  const monthCount = positions.reduce((total, { period }) => {
    const matches = [...period.matchAll(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})/g)];
    if (matches.length !== 2) return total;

    const start = Number(matches[0][2]) * 12 + monthNumbers[matches[0][1]];
    const end = Number(matches[1][2]) * 12 + monthNumbers[matches[1][1]];
    return total + Math.max(0, end - start + 1);
  }, 0);

  const years = Math.floor(monthCount / 12);
  const months = monthCount % 12;
  return [years && `${years} ${years === 1 ? "year" : "years"}`, months && `${months} ${months === 1 ? "month" : "months"}`].filter(Boolean).join(" ");
}

const countrySuggestionsSeed = [
  {
    id: "personal",
    title: "Keep personal details minimal",
    detail:
      "For this Finland-ready CV, use name, email, phone and city. Keep date of birth and nationality out of the CV unless you choose otherwise.",
    status: "pending",
    type: "structure",
  },
  {
    id: "summary",
    title: "Make the professional summary more specific",
    detail:
      "Use your existing warehouse and production experience to make the opening summary clearer for Finnish employers.",
    status: "pending",
    type: "wording",
    suggested:
      "Warehouse & Logistics Worker with experience in warehouse operations, production, packing and inventory handling.",
  },
  {
    id: "language",
    title: "Make language level explicit",
    detail:
      "Your profile already says English Basic (A2). Showing the level clearly helps employers understand your readiness.",
    status: "pending",
    type: "emphasis",
  },
];

const matchQuestions = [
  {
    id: "night",
    question: "Have you worked night or rotating shifts before?",
    helper: "This job mentions rotating shifts. Your current CV does not say whether you have done this.",
  },
  {
    id: "system",
    question: "Have you used SAP, WMS or another inventory system?",
    helper: "The vacancy mentions inventory software, but your CV only says inventory management.",
  },
];

const steps = [
  ["profile", "Profile"],
  ["country", "Country"],
  ["review", "CV review"],
  ["jobs", "Jobs"],
  ["vacancy", "Vacancy"],
  ["match", "Questions"],
  ["tailored", "Tailored CV"],
];

function App() {
  const [screen, setScreen] = useState("profile");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [suggestions, setSuggestions] = useState(countrySuggestionsSeed);
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [answers, setAnswers] = useState({ night: null, system: null });
  const [saved, setSaved] = useState(false);

  const completion = useMemo(() => {
    const checks = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.experience.length,
      profile.education.length,
      profile.skills.length,
      profile.languages.length,
      profile.certificates.length,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  const activeIndex = steps.findIndex(([key]) => key === screen);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const go = (target) => {
    setSaved(false);
    setScreen(target);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (screen === "profile") {
    return (
      <div className="app profileMode">
        <ProfileScreen profile={profile} setProfile={setProfile} completion={completion} onNavigate={go} />
      </div>
    );
  }

  return (
    <div className="app hasBottomNav">
      <button
        className={`navBackdrop ${mobileNavOpen ? "visible" : ""}`}
        aria-label="Close navigation"
        onClick={() => setMobileNavOpen(false)}
      />
      <aside className={`sidebar ${mobileNavOpen ? "open" : ""}`} aria-label="Main navigation">
        <Brand />
        <nav>
          <NavItem label="Home" />
          <NavItem label="Professional Profile" active={screen === "profile"} onClick={() => go("profile")} />
          <NavItem label="Tailored CV" active={screen === "tailored"} onClick={() => go("tailored")} />
          <NavItem label="Jobs" active={["jobs", "vacancy", "match"].includes(screen)} onClick={() => go("jobs")} />
          <NavItem label="Community" />
          <NavItem label="Country Information" />
        </nav>
        <div className="sidebarBottom">
          <NavItem label="Help & Support" />
          <NavItem label="Settings" />
          <div className="brandNote">A clearer path<br/>for working abroad</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="menuButton"
            aria-label="Open navigation"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(true)}
          >
            <span /><span /><span />
          </button>
          <div className="mobileBrand"><Brand compact /></div>
          <div className="journeyTitle">Candidate journey</div>
          <div className="user">Sari Dewi · EN</div>
        </header>

        <div className="stepper" aria-label="Candidate journey progress">
          {steps.map(([key, label], i) => (
            <button
              key={key}
              className={`step ${screen === key ? "active" : ""} ${i < activeIndex ? "done" : ""}`}
              onClick={() => go(key)}
            >
              <span>{i + 1}</span>{label}
            </button>
          ))}
        </div>

        {screen === "country" && <CountryScreen profile={profile} setProfile={setProfile} onNext={() => go("review")} />}
        {screen === "review" && (
          <ReviewScreen
            profile={profile}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            onNext={() => go("jobs")}
          />
        )}
        {screen === "jobs" && <JobsScreen jobs={jobs} onOpen={(job) => { setSelectedJob(job); go("vacancy"); }} />}
        {screen === "vacancy" && <VacancyScreen job={selectedJob} onNext={() => go("match")} />}
        {screen === "match" && (
          <MatchScreen
            job={selectedJob}
            answers={answers}
            setAnswers={setAnswers}
            onNext={() => go("tailored")}
          />
        )}
        {screen === "tailored" && (
          <TailoredScreen
            profile={profile}
            job={selectedJob}
            answers={answers}
            saved={saved}
            setSaved={setSaved}
            onBack={() => go("jobs")}
          />
        )}
      </main>
      <MobileBottomNav
        active={screen === "country" ? "country" : ["jobs", "vacancy", "match"].includes(screen) ? "jobs" : ""}
        onNavigate={go}
        onMore={() => setMobileNavOpen(true)}
      />
    </div>
  );
}

function Brand({ compact = false }) {
  if (compact) {
    return <div className="brand compact"><BrandMark /></div>;
  }

  return (
    <div className="brand">
      <BrandLogo />
      <small>Talent & community</small>
    </div>
  );
}

function BrandLogo() {
  return (
    <svg className="brandLogo" viewBox="0 0 949.32 195" role="img" aria-label="Rantau">
      <polygon points="79,21 77.5,85.5 10,127.5 49,73.5" />
      <polygon points="85,21 86.5,85.5 154,127.5 115,73.5" />
      <polygon points="77.5,88.5 38.5,130.5 73,168" />
      <polygon points="86.5,88.5 125.5,130.5 91,168" />
      <g transform="translate(180 0)">
        <path d="M735 831Q856 831 908.5 876Q961 921 961 1024Q961 1126 908.5 1170Q856 1214 735 1214H573V831ZM573 565V0H188V1493H776Q1071 1493 1208.5 1394Q1346 1295 1346 1081Q1346 933 1274.5 838Q1203 743 1059 698Q1138 680 1200.5 616.5Q1263 553 1327 424L1536 0H1126L944 371Q889 483 832.5 524Q776 565 682 565Z" transform="translate(0 151) scale(.075 -.075)" />
        <path d="M184.27 39 243.27 151H219.27L184.27 80 149.27 151H125.27Z" />
        <path d="M188 1493H618L1161 469V1493H1526V0H1096L553 1024V0H188Z" transform="translate(250.27 151) scale(.075 -.075)" />
        <path d="M10 1493H1386V1202H891V0H506V1202H10Z" transform="translate(385.82 151) scale(.075 -.075)" />
        <path d="M556.6 39 615.6 151H591.6L556.6 80 521.6 151H497.6Z" />
        <path d="M188 1493H573V598Q573 413 633.5 333.5Q694 254 831 254Q969 254 1029.5 333.5Q1090 413 1090 598V1493H1475V598Q1475 281 1316 126Q1157-29 831-29Q506-29 347 126Q188 281 188 598Z" transform="translate(622.6 151) scale(.075 -.075)" />
      </g>
    </svg>
  );
}

function BrandMark() {
  return (
    <svg className="brandMark" viewBox="0 0 64 72" aria-hidden="true">
      <path d="M31 2 2 49l28-18 1-29Z" />
      <path d="M33 2v29l29 18L33 2Z" />
      <path d="m30 35-18 18 17 17 1-35Z" />
      <path d="m34 35 1 35 17-17-18-18Z" />
    </svg>
  );
}

function NavItem({ label, active, onClick }) {
  return (
    <button className={`navItem ${active ? "active" : ""}`} onClick={onClick} aria-current={active ? "page" : undefined}>
      <span className="navDot" />{label}
    </button>
  );
}

function PageIntro({ eyebrow, title, text, side }) {
  return (
    <div className="pageIntro">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {side}
    </div>
  );
}

function NextStep({ children }) {
  return (
    <div className="nextStep">
      <div className="compass">✦</div>
      <div><strong>Your next step</strong><p>{children}</p></div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function ProfileScreen({ profile, setProfile, completion, onNavigate }) {
  const [activeTab, setActiveTab] = useState("professional");
  const [profileHelpOpen, setProfileHelpOpen] = useState(false);
  const [nextStepOpen, setNextStepOpen] = useState(false);
  const [activeAdviceIndex, setActiveAdviceIndex] = useState(0);
  const [adviceStatuses, setAdviceStatuses] = useState({});
  const [allAdviceOpen, setAllAdviceOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoManagementOpen, setPhotoManagementOpen] = useState(false);
  const [personalInformationOpen, setPersonalInformationOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [allEducationOpen, setAllEducationOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState({ workExperience: false, education: false, skills: false });
  const profileScrollPosition = useRef(0);
  const [activeSheet, setActiveSheet] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [photoVisibility, setPhotoVisibility] = useState("community");
  const [jobStatus, setJobStatus] = useState("I am not looking for a job");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [manualSkill, setManualSkill] = useState("");
  const experienceCompanies = Object.values(profile.experience.reduce((groups, experience) => {
    const key = `${experience.company}-${experience.place}`;
    if (!groups[key]) groups[key] = { company: experience.company, place: experience.place, positions: [] };
    groups[key].positions.push(experience);
    return groups;
  }, {}));
  const [personalDetails, setPersonalDetails] = useState(() => {
    const [name, ...surname] = profile.fullName.split(" ");
    return {
      name,
      surname: surname.join(" "),
      dateOfBirth: "1995-03-12",
      citizenship: profile.nationality,
      location: profile.location,
      email: profile.email,
      phone: profile.phone,
    };
  });

  const statusOptions = [
    "Actively searching for a job",
    "I'm considering offers",
    "I am not looking for a job",
    "I have been offered a job, still thinking",
    "I am already starting my new job",
  ];

  const rememberProfileScroll = () => {
    profileScrollPosition.current = window.scrollY;
  };
  const restoreProfileScroll = () => {
    requestAnimationFrame(() => window.scrollTo(0, profileScrollPosition.current));
  };
  const toggleAccordion = (section) => {
    setAccordionOpen((current) => ({ ...current, [section]: !current[section] }));
  };
  const openPersonalInformation = () => {
    rememberProfileScroll();
    setPersonalInformationOpen(true);
  };
  const closePersonalInformation = () => {
    setPersonalInformationOpen(false);
    restoreProfileScroll();
  };
  const openExperienceEditor = (experience) => {
    rememberProfileScroll();
    setEditingExperience(experience);
  };
  const closeExperienceEditor = () => {
    setEditingExperience(null);
    restoreProfileScroll();
  };
  const openEducationEditor = (education) => {
    rememberProfileScroll();
    setEditingEducation(education);
  };
  const closeEducationEditor = () => {
    setEditingEducation(null);
    if (!allEducationOpen) restoreProfileScroll();
  };
  const openAllEducation = () => {
    rememberProfileScroll();
    setAllEducationOpen(true);
  };
  const closeAllEducation = () => {
    setAllEducationOpen(false);
    restoreProfileScroll();
  };
  const openPhotoManagement = () => {
    rememberProfileScroll();
    setPhotoManagementOpen(true);
  };
  const closePhotoManagement = () => {
    setPhotoManagementOpen(false);
    setActiveSheet(null);
    restoreProfileScroll();
  };
  const openAddSkillSheet = () => {
    setSelectedSkills([]);
    setManualSkill("");
    setActiveSheet("add-skill");
  };
  const toggleSuggestedSkill = (skill) => {
    setSelectedSkills((current) => current.includes(skill)
      ? current.filter((item) => item !== skill)
      : [...current, skill]);
  };
  const normalizeSkill = (skill) => skill.trim().toLocaleLowerCase();
  const pendingSkills = [...selectedSkills, manualSkill.trim()]
    .filter(Boolean)
    .filter((skill, index, skills) => skills.findIndex((item) => normalizeSkill(item) === normalizeSkill(skill)) === index);
  const skillsToAdd = pendingSkills.filter((skill) => !profile.skills.some((existing) => normalizeSkill(existing) === normalizeSkill(skill)));
  const addSelectedSkills = () => {
    if (skillsToAdd.length === 0) return;
    setProfile((current) => ({ ...current, skills: [...current.skills, ...skillsToAdd] }));
    setActiveSheet(null);
  };
  const removeSelectedSkill = (skill) => {
    setSelectedSkills((current) => current.filter((item) => item !== skill));
  };
  const removeProfileSkill = (skill) => {
    setProfile((current) => ({
      ...current,
      skills: current.skills.filter((existing) => normalizeSkill(existing) !== normalizeSkill(skill)),
    }));
  };

  if (personalInformationOpen) {
    return (
      <PersonalInformationScreen
        details={personalDetails}
        onBack={closePersonalInformation}
        onSave={(details) => { setPersonalDetails(details); closePersonalInformation(); }}
      />
    );
  }

  if (editingExperience) {
    return <ExperienceDetailScreen experience={editingExperience} onBack={closeExperienceEditor} />;
  }

  if (editingEducation) {
    return <EducationDetailScreen education={editingEducation} onBack={closeEducationEditor} />;
  }

  if (allEducationOpen) {
    return (
      <EducationListScreen
        education={profile.education}
        onBack={closeAllEducation}
        onEdit={setEditingEducation}
      />
    );
  }

  if (photoManagementOpen) {
    return (
      <PhotoManagementScreen
        photoRemoved={photoRemoved}
        photoVisibility={photoVisibility}
        activeSheet={activeSheet}
        onBack={closePhotoManagement}
        onVisibilityChange={setPhotoVisibility}
        onOpenSheet={setActiveSheet}
        onCloseSheet={() => setActiveSheet(null)}
        onDelete={() => { setPhotoRemoved(true); setActiveSheet(null); }}
        onAddPhoto={() => { setPhotoRemoved(false); setActiveSheet(null); }}
      />
    );
  }

  return (
    <div className="profileMobileScreen">
      <header className="profileAppBar">
        <span>Profile</span>
        <button
          className="profileIconButton"
          aria-label="Open profile menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <ProtoIcon name="menu" />
        </button>
        {menuOpen && (
          <div className="profileMenu" role="menu">
            <button role="menuitem">Help and support</button>
            <button role="menuitem">Settings</button>
          </div>
        )}
      </header>

      <section className="profileHeaderBlock" aria-labelledby="profile-name">
        <div className="profilePhotoWrap">
          <div className={`profilePhoto ${photoRemoved ? "removed" : ""}`} aria-label={photoRemoved ? "No profile photo" : "Profile photo"}>
            {photoRemoved ? <ProtoIcon name="profile" /> : "SD"}
          </div>
          <button className="photoEditButton" aria-label="Manage profile photo" onClick={openPhotoManagement}>
            <ProtoIcon name="pencil" />
          </button>
        </div>
        <h1 id="profile-name">{personalDetails.name} {personalDetails.surname}</h1>

        <button
          className="profileDisclosureRow"
          aria-haspopup="dialog"
          onClick={openPersonalInformation}
        >
          <span>Personal information</span>
          <ProtoIcon name="chevron-down" />
        </button>

        <div className="jobStatusControl">
          <button aria-haspopup="dialog" aria-expanded={activeSheet === "status"} onClick={() => setActiveSheet("status")}>
            <span>{jobStatus}</span>
            <ProtoIcon name="chevron-down" />
          </button>
        </div>
      </section>

      <div className="profileTabs" role="tablist" aria-label="Profile content">
        <button
          role="tab"
          aria-selected={activeTab === "professional"}
          className={activeTab === "professional" ? "active" : ""}
          onClick={() => setActiveTab("professional")}
        >
          Professional Profile
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "cv"}
          className={activeTab === "cv" ? "active" : ""}
          onClick={() => setActiveTab("cv")}
        >
          CV Library
        </button>
      </div>

      {activeTab === "professional" ? (
        <main className="profileTabContent" role="tabpanel">
          <div className="professionalTitleRow">
            <h2>Professional Profile</h2>
            <button
              className="profileHelpButton"
              aria-label="About the professional profile"
              aria-expanded={profileHelpOpen}
              onClick={() => setProfileHelpOpen((open) => !open)}
            ><span>?</span></button>
          </div>
          {profileHelpOpen && (
            <p className="profileHelpText">Your professional profile is the reusable source for your experience, education and skills. You control what is included in each CV.</p>
          )}

          <div className="profileActionCards">
            <div className="profileActionCard profileCompletionCard">
              <CompletionIndicator completion={completion} />
              <small>Profile complete</small>
            </div>
            <button
              className="profileActionCard profileAiCard"
              aria-expanded={nextStepOpen}
              onClick={() => setNextStepOpen((open) => !open)}
            >
              <small>Next step</small>
              <strong>AI hint</strong>
              <span className="aiHintChevron" aria-hidden="true"><ProtoIcon name="chevron-down" /></span>
            </button>
            <button
              className="profileActionCard profileResumeCard"
              aria-expanded={resumeOpen}
              onClick={() => setResumeOpen((open) => !open)}
            >
              <strong>Create a resume</strong>
              <span className="resumePlus" aria-hidden="true">+</span>
            </button>
          </div>
          {nextStepOpen && (
            <div className="nextStepExplanation" aria-live="polite">
              {!allAdviceOpen && (
                <>
                  <p className="aiAdviceText"><strong>{mockAiSuggestions[activeAdviceIndex]}</strong></p>
                  {adviceStatuses[activeAdviceIndex] ? (
                    <p className="aiAdviceAcknowledgement">
                      {adviceStatuses[activeAdviceIndex] === "accepted" ? "Suggestion marked as complete." : "Suggestion ignored."}
                    </p>
                  ) : (
                    <div className="aiAdviceActions">
                      <button className="aiAdviceAction aiAdviceAccept" type="button" onClick={() => setAdviceStatuses((statuses) => ({ ...statuses, [activeAdviceIndex]: "accepted" }))}>OK</button>
                      <button className="aiAdviceAction aiAdviceIgnore" type="button" onClick={() => setAdviceStatuses((statuses) => ({ ...statuses, [activeAdviceIndex]: "ignored" }))}>Ignore</button>
                    </div>
                  )}
                </>
              )}
              <button
                className="moreAdviceButton"
                type="button"
                aria-expanded={allAdviceOpen}
                onClick={() => setAllAdviceOpen((open) => !open)}
              >
                {allAdviceOpen ? "Hide all advice" : "View all advice"}
              </button>
              {allAdviceOpen && (
                <ul className="aiAdviceList">
                  {mockAiSuggestions.map((suggestion, index) => {
                    const status = adviceStatuses[index];
                    const isActive = activeAdviceIndex === index;

                    return (
                      <li className={isActive ? "active" : ""} key={suggestion}>
                        <button
                          className="aiAdviceRow"
                          type="button"
                          aria-expanded={isActive}
                          onClick={() => setActiveAdviceIndex(index)}
                        >
                          <strong>{suggestion}</strong>
                          {status && <small>{status === "accepted" ? "Accepted" : "Ignored"}</small>}
                        </button>
                        {isActive && (
                          <div className="aiAdviceExpanded">
                            <div className="aiAdviceActions">
                              <button className="aiAdviceAction aiAdviceAccept" type="button" onClick={() => setAdviceStatuses((statuses) => ({ ...statuses, [index]: "accepted" }))}>OK</button>
                              <button className="aiAdviceAction aiAdviceIgnore" type="button" onClick={() => setAdviceStatuses((statuses) => ({ ...statuses, [index]: "ignored" }))}>Ignore</button>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
          {resumeOpen && (
            <div className="resumeCreationPlaceholder">Resume creation is a mock action for this prototype.</div>
          )}

          <p className="myResumeLabel">My resume</p>
          <div className="profileAccordions">
            <ProfileAccordion title="Work Experience" open={accordionOpen.workExperience} onToggle={() => toggleAccordion("workExperience")}>
              <p className="workExperienceSummary"><span>Work experience:</span> <strong>15 years 4 months</strong></p>
              {experienceCompanies.map((company) => (
                <section className="companyExperience" key={`${company.company}-${company.place}`}>
                  <div className="companyExperienceHeader">
                    <span className="companyLogoPlaceholder" aria-label="Company logo upload placeholder">logo</span>
                    <div>
                      <strong>{company.company}</strong>
                      <small>{companyDuration(company.positions)}</small>
                    </div>
                  </div>
                  <div className="companyPositions">
                    {company.positions.map((position) => (
                      <article
                        className="profileRecord workExperienceRecord"
                        key={position.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => openExperienceEditor(position)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                          openExperienceEditor(position);
                          }
                        }}
                      >
                        <div className="workExperiencePositionHeader">
                          <div>
                            <strong>{position.role}</strong>
                            <small>{position.period}</small>
                          </div>
                          <span className="workExperienceEditChevron" aria-hidden="true"><ProtoIcon name="chevron-right" /></span>
                        </div>
                        <ul>{position.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </ProfileAccordion>

            <ProfileAccordion title="Education" open={accordionOpen.education} onToggle={() => toggleAccordion("education")}>
              {profile.education.slice(0, 3).map((item) => (
                <EducationRecord key={`${item.school}-${item.period}`} item={item} onEdit={openEducationEditor} />
              ))}
              {profile.education.length > 3 && (
                <button className="secondarySectionAction viewAllEducationButton" type="button" onClick={openAllEducation}>
                  View all
                </button>
              )}
            </ProfileAccordion>

            <ProfileAccordion title="Skills" open={accordionOpen.skills} onToggle={() => toggleAccordion("skills")}>
              <div className="neutralChips">
                {profile.skills.map((skill) => (
                  <span className="profileSkillChip" key={skill}>
                    <span>{skill}</span>
                    <button type="button" aria-label={`Remove ${skill}`} onClick={() => removeProfileSkill(skill)}><ProtoIcon name="close" /></button>
                  </span>
                ))}
              </div>
              <button className="secondarySectionAction" type="button" onClick={openAddSkillSheet}>
                Add
              </button>
            </ProfileAccordion>
          </div>
        </main>
      ) : (
        <main className="cvLibraryPlaceholder" role="tabpanel">
          <div className="placeholderIcon"><ProtoIcon name="document" /></div>
          <h2>CV Library</h2>
          <p>Your saved and tailored CV versions will appear here.</p>
        </main>
      )}

      <MobileBottomNav
        active="profile"
        onNavigate={onNavigate}
        onMore={() => setMenuOpen((open) => !open)}
      />
      {activeSheet === "status" && (
        <BottomSheet title="Your search status" onClose={() => setActiveSheet(null)}>
          <div className="sheetOptionList" role="radiogroup" aria-label="Your search status">
            {statusOptions.map((option) => (
              <button
                key={option}
                className="sheetSelectionRow"
                role="radio"
                aria-checked={jobStatus === option}
                onClick={() => { setJobStatus(option); setActiveSheet(null); }}
              >
                <span>{option}</span>
                <span className={`radioIndicator ${jobStatus === option ? "selected" : ""}`} aria-hidden="true" />
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
      {activeSheet === "add-skill" && (
        <BottomSheet title="Add a skill" onClose={() => setActiveSheet(null)} showClose large>
          <div className="skillAddMock">
            <input aria-label="Skill name" placeholder="Type a skill" value={manualSkill} onChange={(event) => setManualSkill(event.target.value)} />
            {selectedSkills.length > 0 && (
              <section className="selectedSkills" aria-label="Selected skills">
                <h3>Selected skills</h3>
                <div className="selectedSkillList">
                  {selectedSkills.map((skill) => (
                    <span className="selectedSkillChip" key={skill}>
                      <span>{skill}</span>
                      <button type="button" aria-label={`Remove ${skill}`} onClick={() => removeSelectedSkill(skill)}><ProtoIcon name="close" /></button>
                    </span>
                  ))}
                </div>
              </section>
            )}
            <section className="skillSuggestions" aria-label="Suggested skills">
              <h3>Suggested skills</h3>
              <div className="skillSuggestionList">
                {suggestedSkills
                  .filter((skill) => !profile.skills.some((existing) => normalizeSkill(existing) === normalizeSkill(skill)))
                  .filter((skill) => !selectedSkills.includes(skill))
                  .map((skill) => (
                    <button
                      key={skill}
                      className="skillSuggestionChip"
                      type="button"
                      aria-pressed="false"
                      onClick={() => toggleSuggestedSkill(skill)}
                    >
                      {skill}
                    </button>
                  ))}
              </div>
            </section>
          </div>
          <button className="skillAddButton" type="button" disabled={skillsToAdd.length === 0} onClick={addSelectedSkills}>Add</button>
        </BottomSheet>
      )}
    </div>
  );
}

function CompletionIndicator({ completion }) {
  return (
    <div className="completionIndicator" data-current-completion={completion}>
      <img src={progressReference} alt="88% profile complete" />
    </div>
  );
}

function PersonalInformationScreen({ details, onBack, onSave }) {
  const [draft, setDraft] = useState(details);
  const setField = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  return (
    <div className="personalInformationScreen">
      <header className="personalInfoScreenBar">
        <button aria-label="Back to profile" onClick={onBack}><ProtoIcon name="arrow-left" /></button>
        <h1>Personal information</h1>
        <span aria-hidden="true" />
      </header>
      <main className="personalInfoForm">
        <label className="personalField">
          <span>Name</span>
          <input value={draft.name} onChange={(event) => setField("name", event.target.value)} />
        </label>
        <label className="personalField">
          <span>Surname</span>
          <input value={draft.surname} onChange={(event) => setField("surname", event.target.value)} />
        </label>
        <label className="personalField datePersonalField">
          <span>Date of birth</span>
          <div>
            <input type="date" value={draft.dateOfBirth} onChange={(event) => setField("dateOfBirth", event.target.value)} />
            <ProtoIcon name="calendar" />
          </div>
        </label>
        <label className="personalField">
          <span>Citizenship</span>
          <input value={draft.citizenship} onChange={(event) => setField("citizenship", event.target.value)} />
        </label>
        <label className="personalField">
          <span>Current location</span>
          <input value={draft.location} onChange={(event) => setField("location", event.target.value)} />
        </label>
        <label className="personalField">
          <span>Contact email</span>
          <input type="email" value={draft.email} onChange={(event) => setField("email", event.target.value)} />
        </label>
        <label className="personalField">
          <span>Phone number</span>
          <input type="tel" value={draft.phone} onChange={(event) => setField("phone", event.target.value)} />
        </label>
        <button className="personalSaveButton" onClick={() => onSave(draft)}>Save</button>
      </main>
    </div>
  );
}

function ExperienceDetailScreen({ experience, onBack }) {
  const [startDate = "", endDate = ""] = experience.period.split(" – ");
  const [startMonth = "", startYear = ""] = startDate.split(" ");
  const [endMonth = "", endYear = ""] = endDate.split(" ");
  const [draft, setDraft] = useState({
    company: experience.company,
    position: experience.role,
    city: experience.place,
    website: "",
    activity: "",
    responsibilities: experience.bullets.join("\n"),
    startMonth,
    startYear,
    endMonth,
    endYear,
    present: false,
    resumeSelected: true,
  });
  const [activeEditor, setActiveEditor] = useState(null);
  const [recommendationOffset, setRecommendationOffset] = useState(0);
  const setField = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const editorConfig = {
    company: { title: "Company name", field: "company", label: "Company name" },
    position: { title: "Position or profession", field: "position", label: "Position or profession" },
    city: { title: "City or region", field: "city", label: "City or region" },
    website: { title: "Company website", field: "website", label: "Website URL" },
    activity: { title: "Field of activity", field: "activity", label: "Field of activity" },
    responsibilities: { title: "Responsibilities and achievements", field: "responsibilities", label: "Responsibilities and achievements", multiline: true },
  };
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const responsibilityRecommendations = [
    "Include how you maintained inventory accuracy and stock control.",
    "Mention warehouse equipment or safety procedures you used.",
    "Add a measurable result, such as orders processed per shift.",
    "Describe how you coordinated with the packing or delivery team.",
    "Highlight quality checks completed before dispatch.",
    "Mention any training or onboarding you supported.",
  ];
  const visibleRecommendations = Array.from({ length: 3 }, (_, index) => responsibilityRecommendations[(recommendationOffset + index) % responsibilityRecommendations.length]);
  const editor = editorConfig[activeEditor];

  return (
    <div className="personalInformationScreen experienceDetailScreen">
      <header className="personalInfoScreenBar">
        <button aria-label="Back to work experience" onClick={onBack}><ProtoIcon name="arrow-left" /></button>
        <h1>Edit experience</h1>
        <span aria-hidden="true" />
      </header>
      <main className="personalInfoForm experienceEditForm">
        <ExperienceEditBox label="Company" value={draft.company} onClick={() => setActiveEditor("company")} />
        <ExperienceEditBox label="Position or profession" value={draft.position} onClick={() => setActiveEditor("position")} />
        <ExperienceEditBox label="City or region" value={draft.city} onClick={() => setActiveEditor("city")} />
        <ExperienceEditBox label="Company website" value={draft.website} emptyText="" onClick={() => setActiveEditor("website")} />
        <ExperienceEditBox label="Field of activity" value={draft.activity} emptyText="" onClick={() => setActiveEditor("activity")} />
        <ExperienceEditBox label="Responsibilities and achievements" value={draft.responsibilities} onClick={() => setActiveEditor("responsibilities")} multiline />

        <section className="experienceDateSection">
          <p className="experienceDateSectionLabel">Start date</p>
          <div className="experienceDateGrid">
            <button className="experienceDateBox" type="button" onClick={() => setActiveEditor("startMonth")}>
              <span>Month</span><strong>{draft.startMonth || "Select"}</strong><ProtoIcon name="chevron-down" />
            </button>
            <label className="experienceDateBox experienceYearBox"><span>Year</span><input inputMode="numeric" value={draft.startYear} onChange={(event) => setField("startYear", event.target.value)} /></label>
          </div>
        </section>

        <section className="experienceDateSection">
          <div className="experienceEndDateHeading">
            <p className="experienceDateSectionLabel">End date</p>
            <label className="presentTimeControl"><span>Present time</span><input type="checkbox" checked={draft.present} onChange={(event) => setField("present", event.target.checked)} /></label>
          </div>
          <div className="experienceDateGrid">
            <button className="experienceDateBox" type="button" disabled={draft.present} onClick={() => setActiveEditor("endMonth")}>
              <span>Month</span><strong>{draft.endMonth || "Select"}</strong><ProtoIcon name="chevron-down" />
            </button>
            <label className="experienceDateBox experienceYearBox"><span>Year</span><input inputMode="numeric" disabled={draft.present} value={draft.endYear} onChange={(event) => setField("endYear", event.target.value)} /></label>
          </div>
        </section>

        <section className="experienceResumeSection">
          <p className="experienceDateSectionLabel">Include in resumes</p>
          <label className="experienceResumeCard">
            <span className="experienceResumeAvatar" aria-hidden="true">SD</span>
            <span className="experienceResumeDetails"><strong>Warehouse & Logistics Worker</strong><small>Professional resume</small></span>
            <input type="checkbox" checked={draft.resumeSelected} onChange={(event) => setField("resumeSelected", event.target.checked)} />
          </label>
        </section>
        <button className="personalSaveButton" onClick={onBack}>Save</button>
      </main>

      {activeEditor === "responsibilities" && (
        <BottomSheet title="Responsibilities and achievements" onClose={() => setActiveEditor(null)} showClose large>
          <div className="responsibilitySheetContent">
            <textarea
              className="responsibilityEditor"
              value={draft.responsibilities}
              onChange={(event) => setField("responsibilities", event.target.value)}
              aria-label="Responsibilities and achievements"
            />
            <section className="responsibilityRecommendations">
              <div className="responsibilityRecommendationsHeader">
                <strong>Recommendations for your profession</strong>
                <button type="button" aria-label="Refresh recommendations" onClick={() => setRecommendationOffset((offset) => (offset + 3) % responsibilityRecommendations.length)}><ProtoIcon name="refresh" /></button>
              </div>
              <div className="responsibilityRecommendationList">
                {visibleRecommendations.map((recommendation) => (
                  <div className="responsibilityRecommendation" key={recommendation}>
                    <span>{recommendation}</span>
                    <button type="button" aria-label={`Add recommendation: ${recommendation}`} onClick={() => setField("responsibilities", draft.responsibilities ? `${draft.responsibilities}\n${recommendation}` : recommendation)}><ProtoIcon name="plus" /></button>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <button className="responsibilityAddButton" type="button" onClick={() => setActiveEditor(null)}>Add</button>
        </BottomSheet>
      )}
      {editor && activeEditor !== "responsibilities" && (
        <BottomSheet title={editor.title} onClose={() => setActiveEditor(null)} showClose large>
          <label className="experienceSheetField">
            <span>{editor.label}</span>
            {editor.multiline ? (
              <textarea value={draft[editor.field]} onChange={(event) => setField(editor.field, event.target.value)} rows={5} />
            ) : (
              <input autoFocus value={draft[editor.field]} onChange={(event) => setField(editor.field, event.target.value)} />
            )}
          </label>
          {activeEditor === "company" && (
            <button className="companyLogoUpload" type="button"><span>logo</span><strong>Upload company logo</strong><ProtoIcon name="image" /></button>
          )}
        </BottomSheet>
      )}
      {(activeEditor === "startMonth" || activeEditor === "endMonth") && (
        <BottomSheet title="Select month" onClose={() => setActiveEditor(null)} showClose large>
          <div className="experienceMonthList">
            {months.map((month) => (
              <button key={month} className="sheetSelectionRow" type="button" onClick={() => { setField(activeEditor, month.slice(0, 3)); setActiveEditor(null); }}>
                <span>{month}</span>
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

function ExperienceEditBox({ label, value, onClick, multiline = false, emptyText = "", showChevron = true }) {
  const displayValue = value || emptyText;

  return (
    <button className={`experienceEditBox ${multiline ? "multiline" : ""} ${showChevron ? "" : "noChevron"}`} type="button" onClick={onClick}>
      <span>{label}</span>
      {displayValue && <strong className={value ? "" : "empty"}>{displayValue}</strong>}
      {showChevron && <ProtoIcon name="chevron-right" />}
    </button>
  );
}

function EducationRecord({ item, onEdit }) {
  return (
    <article
      className="profileRecord educationRecord"
      role="button"
      tabIndex={0}
      onClick={() => onEdit(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onEdit(item);
        }
      }}
    >
      <div className="educationRecordDetails">
        <strong>{item.degree}</strong>
        <span>{item.school}</span>
        {item.place && <span className="educationLocation">{item.place}</span>}
        <small>{item.period}</small>
      </div>
      <span className="workExperienceEditChevron" aria-hidden="true"><ProtoIcon name="chevron-right" /></span>
    </article>
  );
}

function EducationListScreen({ education, onBack, onEdit }) {
  return (
    <div className="personalInformationScreen educationListScreen">
      <header className="personalInfoScreenBar">
        <button aria-label="Back to profile" onClick={onBack}><ProtoIcon name="arrow-left" /></button>
        <h1>Education</h1>
        <span aria-hidden="true" />
      </header>
      <main className="personalInfoForm educationListContent">
        {education.map((item) => (
          <EducationRecord key={`${item.school}-${item.period}`} item={item} onEdit={onEdit} />
        ))}
      </main>
    </div>
  );
}

function EducationDetailScreen({ education, onBack }) {
  const [draft, setDraft] = useState({
    level: education.level || "Secondary education",
    name: education.school,
    faculty: education.faculty || "",
    specialisation: education.specialisation || "",
    graduationYear: education.graduationYear || education.period.split(" – ").at(-1),
    resumeSelected: true,
  });
  const [activeEditor, setActiveEditor] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const setField = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const editorConfig = {
    name: { title: "Name", label: "Educational institution name" },
    faculty: { title: "Faculty", label: "Faculty" },
    specialisation: { title: "Specialisation", label: "Specialisation" },
    graduationYear: { title: "Graduation year", label: "Graduation year" },
  };
  const educationLevels = ["Secondary education", "Vocational training", "Bachelor’s degree", "Master’s degree", "Doctoral degree", "Professional training"];
  const editor = editorConfig[activeEditor];

  return (
    <div className="personalInformationScreen educationDetailScreen">
      <header className="personalInfoScreenBar">
        <button aria-label="Back to education" onClick={onBack}><ProtoIcon name="arrow-left" /></button>
        <h1>Educational institution</h1>
        <button className="educationDeleteButton" aria-label="Delete education entry" onClick={() => setDeleteOpen(true)}><ProtoIcon name="trash-compact" /></button>
      </header>
      <main className="personalInfoForm educationEditForm">
        <section className="educationLevelSection">
          <p className="educationSectionLabel">Education level</p>
          <button className="educationLevelBox" type="button" onClick={() => setActiveEditor("level")}>
            <strong>{draft.level}</strong><ProtoIcon name="chevron-down" />
          </button>
        </section>

        <section className="educationInstitutionSection">
          <p className="educationSectionLabel">Educational institution</p>
          <ExperienceEditBox label="Name" value={draft.name} onClick={() => setActiveEditor("name")} />
          <ExperienceEditBox label="Faculty" value={draft.faculty} onClick={() => setActiveEditor("faculty")} />
          <ExperienceEditBox label="Specialisation" value={draft.specialisation} onClick={() => setActiveEditor("specialisation")} />
          <div className="educationGraduationField">
            <ExperienceEditBox label="Graduation year" value={draft.graduationYear} onClick={() => setActiveEditor("graduationYear")} />
            <small>If you are still studying, specify your expected graduation year</small>
          </div>
        </section>

        <section className="educationResumeSection">
          <p className="educationSectionLabel">Include in resumes</p>
          <label className="experienceResumeCard">
            <span className="experienceResumeAvatar" aria-hidden="true">SD</span>
            <span className="experienceResumeDetails"><strong>Warehouse & Logistics Worker</strong><small>Professional resume</small></span>
            <input type="checkbox" checked={draft.resumeSelected} onChange={(event) => setField("resumeSelected", event.target.checked)} />
          </label>
        </section>
        <button className="personalSaveButton" onClick={onBack}>Save</button>
      </main>

      {activeEditor === "level" && (
        <BottomSheet title="Education level" onClose={() => setActiveEditor(null)} showClose large>
          <div className="educationLevelList">
            {educationLevels.map((level) => (
              <button key={level} className="sheetSelectionRow" type="button" onClick={() => { setField("level", level); setActiveEditor(null); }}>
                <span>{level}</span><span className={`radioIndicator ${draft.level === level ? "selected" : ""}`} aria-hidden="true" />
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
      {editor && (
        <BottomSheet title={editor.title} onClose={() => setActiveEditor(null)} showClose large>
          <label className="experienceSheetField">
            <span>{editor.label}</span>
            <input autoFocus inputMode={activeEditor === "graduationYear" ? "numeric" : undefined} value={draft[activeEditor]} onChange={(event) => setField(activeEditor, event.target.value)} />
          </label>
        </BottomSheet>
      )}
      {deleteOpen && (
        <BottomSheet title="Delete this education entry?" onClose={() => setDeleteOpen(false)} showClose>
          <div className="educationDeleteActions">
            <button className="educationDeleteConfirm" type="button" onClick={onBack}>Delete</button>
            <button type="button" onClick={() => setDeleteOpen(false)}>Cancel</button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

function PhotoManagementScreen({ photoRemoved, photoVisibility, activeSheet, onBack, onVisibilityChange, onOpenSheet, onCloseSheet, onDelete, onAddPhoto }) {
  return (
    <div className="photoManagementScreen">
      <header className="photoManagementBar">
        <button className="photoScreenBack" aria-label="Back to profile" onClick={onBack}><ProtoIcon name="arrow-left" /></button>
        <span>Profile photo</span>
        <div className="photoScreenActions">
          <button aria-label="Add photo" onClick={() => onOpenSheet("add-photo")}><ProtoIcon name="plus" /></button>
          <button aria-label="Photo options" onClick={() => onOpenSheet("photo-options")}><ProtoIcon name="more" /></button>
        </div>
      </header>

      <main className="photoManagementContent">
        <div className={`photoManagementPreview ${photoRemoved ? "empty" : ""}`} aria-label={photoRemoved ? "Empty photo placeholder" : "Profile photo preview"}>
          {photoRemoved ? <><ProtoIcon name="profile" /><span>No photo</span></> : "SD"}
        </div>
        <div className="photoVisibilityList" role="radiogroup" aria-label="Photo visibility">
          <button role="radio" aria-checked={photoVisibility === "community"} onClick={() => onVisibilityChange("community")}>
            <span>Visible in Community</span>
            <span className={`radioIndicator ${photoVisibility === "community" ? "selected" : ""}`} aria-hidden="true" />
          </button>
          <button role="radio" aria-checked={photoVisibility === "private"} onClick={() => onVisibilityChange("private")}>
            <span>Private — only I can see it</span>
            <span className={`radioIndicator ${photoVisibility === "private" ? "selected" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </main>

      {activeSheet === "add-photo" && (
        <BottomSheet title="Add a photo" onClose={onCloseSheet}>
          <div className="sheetActionList">
            <button onClick={onAddPhoto}>Choose from gallery<ProtoIcon name="image" /></button>
            <button onClick={onAddPhoto}>Take a photo<ProtoIcon name="camera" /></button>
          </div>
        </BottomSheet>
      )}
      {activeSheet === "photo-options" && (
        <BottomSheet onClose={onCloseSheet}>
          <div className="sheetActionList">
            <button onClick={onCloseSheet}>Download<ProtoIcon name="download" /></button>
            <button className="deleteSheetAction" onClick={onDelete}>Delete<ProtoIcon name="trash" /></button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

function BottomSheet({ title, children, onClose, showClose = false, large = false }) {
  return (
    <div className="bottomSheetOverlay" role="presentation">
      <button className="bottomSheetBackdrop" aria-label="Close sheet" onClick={onClose} />
      <section className={`bottomSheet ${large ? "large" : ""}`} role="dialog" aria-modal="true" aria-label={title || "Options"}>
        <div className="sheetHandle" />
        {showClose && <button className="sheetCloseButton" aria-label="Close sheet" onClick={onClose}><ProtoIcon name="close" /></button>}
        {title && <h2>{title}</h2>}
        {children}
      </section>
    </div>
  );
}

function ProfileAccordion({ title, open, onToggle, children }) {
  const panelId = `profile-section-${title.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <section className="profileAccordion">
      <button aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
        <span>{title}</span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="profileAccordionPanel" id={panelId}>{children}</div>}
    </section>
  );
}

function MobileBottomNav({ active, onNavigate, onMore }) {
  const items = [
    { key: "jobs", label: "Jobs", icon: "jobs", action: () => onNavigate("jobs") },
    { key: "country", label: "Country Guide", icon: "country", action: () => onNavigate("country") },
    { key: "community", label: "Community", icon: "community", action: () => {} },
    { key: "profile", label: "Profile", icon: "profile", action: () => onNavigate("profile") },
    { key: "more", label: "More", icon: "more", action: onMore },
  ];
  return (
    <nav className="mobileBottomNav" aria-label="Primary mobile navigation">
      {items.map((item) => (
        <button key={item.key} className={active === item.key ? "active" : ""} aria-current={active === item.key ? "page" : undefined} onClick={item.action}>
          <ProtoIcon name={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function ProtoIcon({ name }) {
  if (name === "menu") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  if (name === "arrow-left") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>;
  if (name === "close") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === "refresh") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.8-4M4 13a8 8 0 0 0 14.8 4M5 4v4h4m6 12v-4h4" /></svg>;
  if (name === "chevron-down") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg>;
  if (name === "chevron-right") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>;
  if (name === "pencil") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16.5-.8 4.3 4.3-.8L19 8.5 15.5 5zM13.8 6.7l3.5 3.5" /></svg>;
  if (name === "plus") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
  if (name === "calendar") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="1.5" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>;
  if (name === "download") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" /></svg>;
  if (name === "trash-compact") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h8m-6-2h4m-7 2 1 12h8l1-12M10.5 11v4.5M13.5 11v4.5" /></svg>;
  if (name === "trash") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5M14 11v5" /></svg>;
  if (name === "image") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="1" /><circle cx="9" cy="10" r="1.5" /><path d="m5 17 4.5-4 3 2.5 2.5-2 4 3.5" /></svg>;
  if (name === "camera") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l1.3-2h7.4L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>;
  if (name === "jobs") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5h16v11H4zM9 8.5V6h6v2.5M4 13h16" /></svg>;
  if (name === "country") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c3-1.2 5.7-.6 8 1.2v12c-2.3-1.8-5-2.4-8-1.2zM20 5.5c-3-1.2-5.7-.6-8 1.2v12c2.3-1.8 5-2.4 8-1.2z" /></svg>;
  if (name === "community") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.3" /><path d="M3.5 19c.4-3.3 2.3-5 5.5-5s5.1 1.7 5.5 5M14 14.5c3.5-.5 5.5 1 6 4.5" /></svg>;
  if (name === "profile") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.5-4.2 2.8-6.3 7-6.3s6.5 2.1 7 6.3" /></svg>;
  if (name === "document") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></svg>;
}

function CountryScreen({ profile, setProfile, onNext }) {
  return (
    <>
      <PageIntro
        eyebrow="TARGET COUNTRY"
        title="Where would you like to work?"
        text="Country selection changes CV guidance and recommended fields. For this prototype, Finland is fully available."
        side={<NextStep>Select the country you want to prepare your CV for.</NextStep>}
      />
      <div className="contentNarrow">
        <Card>
          <div className="countryOption selected">
            <div className="flag">🇫🇮</div>
            <div><strong>Finland</strong><p>Country CV review available</p></div>
            <span>Selected</span>
          </div>
          <div className="countryOption disabled">
            <div className="flag">🇩🇪</div>
            <div><strong>Germany</strong><p>Coming later</p></div>
          </div>
          <div className="countryOption disabled">
            <div className="flag">🇳🇱</div>
            <div><strong>Netherlands</strong><p>Coming later</p></div>
          </div>
          <button className="primaryBtn full" onClick={() => { setProfile({ ...profile, targetCountry: "Finland" }); onNext(); }}>
            Continue with Finland →
          </button>
        </Card>
      </div>
    </>
  );
}

function ReviewScreen({ profile, suggestions, setSuggestions, onNext }) {
  const update = (id, status) => setSuggestions(suggestions.map((s) => s.id === id ? { ...s, status } : s));
  return (
    <>
      <PageIntro
        eyebrow="FINLAND · CV REVIEW"
        title="Review suggested changes"
        text="Rantau suggests changes based on your existing profile. You decide what to accept, edit or reject."
        side={<NextStep>Review each suggestion before creating your Finland-ready CV.</NextStep>}
      />
      <div className="reviewGrid">
        <div className="stack">
          {suggestions.map((s) => (
            <Card key={s.id}>
              <div className="suggestionHeader">
                <div><h3>{s.title}</h3><p>{s.detail}</p></div>
                <Status status={s.status} />
              </div>
              {s.suggested && <div className="suggestedText">{s.suggested}</div>}
              <div className="actions">
                <button className="acceptBtn" onClick={() => update(s.id, "accepted")}>Accept</button>
                <button className="secondaryBtn" onClick={() => update(s.id, "edited")}>Edit</button>
                <button className="ghostBtn" onClick={() => update(s.id, "rejected")}>Reject</button>
              </div>
            </Card>
          ))}
          <button className="primaryBtn" onClick={onNext}>Continue to opportunities →</button>
        </div>
        <CvPreview profile={profile} suggestions={suggestions} />
      </div>
    </>
  );
}

function Status({ status }) {
  return <span className={`status ${status}`}>{status[0].toUpperCase() + status.slice(1)}</span>;
}

function CvPreview({ profile, suggestions, job }) {
  const summarySuggestion = suggestions?.find((s) => s.id === "summary");
  const summary = summarySuggestion && ["accepted", "edited"].includes(summarySuggestion.status)
    ? summarySuggestion.suggested
    : profile.summary;
  return (
    <Card className="cvCard">
      <div className="cvTop"><strong>RANTAU</strong><span>{job ? "TAILORED CV" : "FINLAND CV"}</span></div>
      <h2>{profile.fullName}</h2>
      <p className="muted">{profile.email} · {profile.phone} · {profile.location}</p>
      <CvSection title="Profile">{summary}</CvSection>
      <CvSection title="Experience">
        {profile.experience.map((e) => (
          <div className="cvEntry" key={e.id}>
            <strong>{e.role}</strong><span>{e.company} · {e.period}</span>
            <ul>{e.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
        ))}
      </CvSection>
      <CvSection title="Skills">{profile.skills.join(" · ")}</CvSection>
      <CvSection title="Languages">{profile.languages.join(" · ")}</CvSection>
      <CvSection title="Certificates">{profile.certificates.join(" · ")}</CvSection>
    </Card>
  );
}

function CvSection({ title, children }) {
  return <div className="cvSection"><h4>{title}</h4><div>{children}</div></div>;
}

function JobsScreen({ jobs, onOpen }) {
  return (
    <>
      <PageIntro
        eyebrow="WORK OPPORTUNITIES"
        title="Jobs matched to your profile"
        text="Match percentages are prototype-only hints based on the information already in your profile."
        side={<NextStep>Open a vacancy to see what already matches and what still needs clarification.</NextStep>}
      />
      <div className="jobsGrid">
        {jobs.map((job) => (
          <Card key={job.id} className="jobCard">
            <div className="jobTop"><span className="match">{job.match}% match</span><span>{job.type}</span></div>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <div className="jobMeta">{job.location}<br/>{job.salary}</div>
            <button className="primaryBtn full" onClick={() => onOpen(job)}>View opportunity</button>
          </Card>
        ))}
      </div>
    </>
  );
}

function VacancyScreen({ job, onNext }) {
  return (
    <>
      <PageIntro
        eyebrow="VACANCY"
        title={job.title}
        text={`${job.company} · ${job.location}`}
        side={<NextStep>Check the requirements, then answer only the questions that are still unclear.</NextStep>}
      />
      <div className="reviewGrid">
        <Card>
          <h3>Role details</h3>
          <div className="infoGrid">
            <Info label="Salary" value={job.salary} />
            <Info label="Contract" value={job.type} />
            <Info label="Location" value={job.location} />
            <Info label="Employer" value={job.company} />
          </div>
          <h3 className="subHead">Requirements vs your profile</h3>
          {job.requirements.map(([label, state]) => (
            <div className="requirement" key={label}>
              <span className={`reqDot ${state}`}>{state === "met" ? "✓" : state === "unclear" ? "?" : "!"}</span>
              <strong>{label}</strong>
              <span>{state}</span>
            </div>
          ))}
          <button className="primaryBtn" onClick={onNext}>Review questions →</button>
        </Card>
        <Card className="softCard">
          <h3>Why this matters</h3>
          <p>Rantau does not add missing qualifications. It asks you to confirm what you actually have before suggesting CV changes.</p>
        </Card>
      </div>
    </>
  );
}

function MatchScreen({ job, answers, setAnswers, onNext }) {
  const set = (id, value) => setAnswers({ ...answers, [id]: value });
  return (
    <>
      <PageIntro
        eyebrow="APPLICATION ASSISTANT"
        title="We have 2 questions for you"
        text={`These questions are based on ${job.company}'s vacancy. Your answers are only added if you confirm them.`}
        side={<NextStep>Confirm only experience that is true for you. Skip anything that does not apply.</NextStep>}
      />
      <div className="contentNarrow">
        {matchQuestions.map((q) => (
          <Card key={q.id}>
            <h3>{q.question}</h3>
            <p>{q.helper}</p>
            <div className="answerButtons">
              <button className={answers[q.id] === "yes" ? "selectedAnswer" : ""} onClick={() => set(q.id, "yes")}>Yes</button>
              <button className={answers[q.id] === "no" ? "selectedAnswer" : ""} onClick={() => set(q.id, "no")}>No</button>
              <button className={answers[q.id] === "skip" ? "selectedAnswer" : ""} onClick={() => set(q.id, "skip")}>Skip</button>
            </div>
          </Card>
        ))}
        <button className="primaryBtn full" onClick={onNext}>Prepare tailored CV →</button>
      </div>
    </>
  );
}

function TailoredScreen({ profile, job, answers, saved, setSaved, onBack }) {
  const extras = [];
  if (answers.night === "yes") extras.push("Available for rotating / night shifts");
  if (answers.system === "yes") extras.push("Inventory system experience confirmed");
  return (
    <>
      <PageIntro
        eyebrow="JOB-SPECIFIC CV"
        title={`Tailored for ${job.title}`}
        text="This version only emphasizes information you already confirmed. Nothing new is invented."
        side={<NextStep>Approve the final CV version before applying.</NextStep>}
      />
      <div className="reviewGrid">
        <div className="stack">
          <Card>
            <h3>Suggested emphasis</h3>
            <p>For this vacancy, Rantau would move your warehouse experience higher and highlight inventory handling.</p>
            {extras.length > 0 ? (
              <ul className="benefits">{extras.map((e) => <li key={e}>{e}</li>)}</ul>
            ) : <p className="muted">No extra confirmed facts were added.</p>}
          </Card>
          <Card>
            <h3>Final approval</h3>
            <p>You remain in control. Approve this CV version or go back to opportunities.</p>
            <div className="actions">
              <button className="primaryBtn" onClick={() => setSaved(true)}>{saved ? "Approved ✓" : "Approve CV"}</button>
              <button className="secondaryBtn" onClick={onBack}>Back to jobs</button>
            </div>
            {saved && <div className="successBox">Prototype complete: your tailored CV is ready for the mock application step.</div>}
          </Card>
        </div>
        <CvPreview profile={profile} job={job} />
      </div>
    </>
  );
}

function Info({ label, value }) {
  return <div className="info"><span>{label}</span><strong>{value}</strong></div>;
}

export default App;
