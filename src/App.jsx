import { useEffect, useMemo, useState } from "react";
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
  summary: "Warehouse and production worker with experience in logistics, packing and inventory handling.",
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
  education: [{ school: "SMA Negeri 1 Jakarta", degree: "Senior High School", period: "2014 – 2017" }],
  skills: ["Warehouse Operations", "Packing", "Inventory Management", "Teamwork"],
  languages: ["Indonesian — Native", "English — Basic (A2)"],
  certificates: ["Forklift Licence — issued Mar 2021"],
  targetCountry: "Finland",
};

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
      "Warehouse and production worker with 6+ years of experience in packing, inventory handling and quality checks.",
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
        <ProfileScreen profile={profile} completion={completion} onNavigate={go} />
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

function ProfileScreen({ profile, completion, onNavigate }) {
  const [activeTab, setActiveTab] = useState("professional");
  const [profileHelpOpen, setProfileHelpOpen] = useState(false);
  const [nextStepOpen, setNextStepOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoManagementOpen, setPhotoManagementOpen] = useState(false);
  const [personalInformationOpen, setPersonalInformationOpen] = useState(false);
  const [activeSheet, setActiveSheet] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [photoVisibility, setPhotoVisibility] = useState("community");
  const [jobStatus, setJobStatus] = useState("I am not looking for a job");
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

  if (personalInformationOpen) {
    return (
      <PersonalInformationScreen
        details={personalDetails}
        onBack={() => setPersonalInformationOpen(false)}
        onSave={(details) => { setPersonalDetails(details); setPersonalInformationOpen(false); }}
      />
    );
  }

  if (photoManagementOpen) {
    return (
      <PhotoManagementScreen
        photoRemoved={photoRemoved}
        photoVisibility={photoVisibility}
        activeSheet={activeSheet}
        onBack={() => { setPhotoManagementOpen(false); setActiveSheet(null); }}
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
          <button className="photoEditButton" aria-label="Manage profile photo" onClick={() => setPhotoManagementOpen(true)}>
            <ProtoIcon name="pencil" />
          </button>
        </div>
        <h1 id="profile-name">{personalDetails.name} {personalDetails.surname}</h1>

        <button
          className="profileDisclosureRow"
          aria-haspopup="dialog"
          onClick={() => setPersonalInformationOpen(true)}
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

          <button
            className="progressNextStep"
            aria-expanded={nextStepOpen}
            onClick={() => setNextStepOpen((open) => !open)}
          >
            <span className="progressSummary">
              <span><strong>{completion}%</strong><small>Profile complete</small></span>
              <span className="progressTrack"><span style={{ width: `${completion}%` }} /></span>
            </span>
            <span className="nextStepSummary">
              <small>Next step</small>
              <strong>Add details about your English proficiency</strong>
            </span>
            <span className="accordionChevron" aria-hidden="true">{nextStepOpen ? "−" : "+"}</span>
          </button>
          {nextStepOpen && (
            <div className="nextStepExplanation">Specific examples of how you use English at work help employers understand your communication readiness beyond a level label. This is a prototype recommendation only.</div>
          )}

          <div className="profileAccordions">
            <ProfileAccordion title="Work Experience" defaultOpen>
              {profile.experience.map((exp) => (
                <article className="profileRecord" key={exp.id}>
                  <strong>{exp.role}</strong>
                  <span>{exp.company} · {exp.place}</span>
                  <small>{exp.period}</small>
                  <ul>{exp.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                </article>
              ))}
            </ProfileAccordion>

            <ProfileAccordion title="Education">
              {profile.education.map((item) => (
                <article className="profileRecord" key={`${item.school}-${item.period}`}>
                  <strong>{item.degree}</strong>
                  <span>{item.school}</span>
                  <small>{item.period}</small>
                </article>
              ))}
            </ProfileAccordion>

            <ProfileAccordion title="Skills">
              <div className="neutralChips">{profile.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
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

function BottomSheet({ title, children, onClose }) {
  return (
    <div className="bottomSheetOverlay" role="presentation">
      <button className="bottomSheetBackdrop" aria-label="Close sheet" onClick={onClose} />
      <section className="bottomSheet" role="dialog" aria-modal="true" aria-label={title || "Options"}>
        <div className="sheetHandle" />
        {title && <h2>{title}</h2>}
        {children}
      </section>
    </div>
  );
}

function ProfileAccordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `profile-section-${title.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <section className="profileAccordion">
      <button aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
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
  if (name === "chevron-down") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg>;
  if (name === "pencil") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16.5-.8 4.3 4.3-.8L19 8.5 15.5 5zM13.8 6.7l3.5 3.5" /></svg>;
  if (name === "plus") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
  if (name === "calendar") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="1.5" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>;
  if (name === "download") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" /></svg>;
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
