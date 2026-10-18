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

  return (
    <div className="app">
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

        {screen === "profile" && (
          <ProfileScreen
            profile={profile}
            completion={completion}
            onNext={() => go("country")}
          />
        )}
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

function SectionTitle({ icon, title, subtitle, action }) {
  return (
    <div className="sectionTitle">
      <div className="sectionIcon">{icon}</div>
      <div className="sectionTitleText"><h3>{title}</h3><p>{subtitle}</p></div>
      {action && <button className="textAction">{action}</button>}
    </div>
  );
}

function ProfileScreen({ profile, completion, onNext }) {
  return (
    <>
      <PageIntro
        eyebrow="YOUR PROFILE"
        title="Professional Profile"
        text="Build one trusted master profile. Rantau uses it to create country-ready and job-specific CV versions without inventing facts."
        side={<NextStep>Complete your professional profile, then prepare it for your target country.</NextStep>}
      />

      <div className="gridLayout">
        <div className="stack">
          <Card>
            <SectionTitle icon="👤" title="Personal information" subtitle="Basic details used across your profile." action="Edit" />
            <div className="infoGrid">
              <Info label="Full name" value={profile.fullName} />
              <Info label="Nationality" value={profile.nationality} />
              <Info label="Date of birth" value="12 March 1995" />
              <Info label="Current location" value={profile.location} />
              <Info label="Contact email" value={profile.email} />
              <Info label="Phone number" value={profile.phone} />
            </div>
          </Card>

          <Card>
            <SectionTitle icon="💼" title="Work experience" subtitle="Most recent experience first." action="+ Add" />
            {profile.experience.map((exp) => (
              <div className="listRow" key={exp.id}>
                <div>
                  <strong>{exp.role}</strong>
                  <span>{exp.company} · {exp.place}</span>
                </div>
                <small>{exp.period}</small>
              </div>
            ))}
          </Card>

          <Card>
            <SectionTitle icon="🎓" title="Education" subtitle="Your education history." action="+ Add" />
            {profile.education.map((e, i) => (
              <div className="listRow" key={i}>
                <div><strong>{e.degree}</strong><span>{e.school}</span></div>
                <small>{e.period}</small>
              </div>
            ))}
          </Card>

          <Card>
            <SectionTitle icon="⚙" title="Skills" subtitle="Relevant skills that employers can search." action="+ Add" />
            <div className="chips">{profile.skills.map((s) => <span className="chip" key={s}>{s} ×</span>)}</div>
          </Card>

          <Card>
            <SectionTitle icon="🌐" title="Languages" subtitle="Languages and proficiency levels." action="+ Add" />
            <div className="chips">{profile.languages.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
          </Card>

          <Card>
            <SectionTitle icon="📄" title="Certificates" subtitle="Only certificates you confirm are stored." action="+ Add" />
            {profile.certificates.map((c) => <div className="listRow" key={c}><div><strong>{c}</strong></div></div>)}
          </Card>
        </div>

        <div className="stack sideStack">
          <Card>
            <h3>Profile completion</h3>
            <div className="completion">
              <div className="circle"><strong>{completion}%</strong></div>
              <div className="checklist">
                {["Personal information","Work experience","Education","Skills","Languages","Certificates"].map((x, i) =>
                  <div key={x}><span className={i < 5 ? "ok" : "empty"}>{i < 5 ? "✓" : ""}</span>{x}</div>
                )}
              </div>
            </div>
          </Card>

          <Card className="softCard">
            <h3>A complete profile helps you</h3>
            <ul className="benefits">
              <li>Create a stronger CV</li>
              <li>Find relevant opportunities</li>
              <li>Receive better guidance</li>
              <li>Save time in your job search</li>
            </ul>
          </Card>

          <Card>
            <h3>Need help?</h3>
            <p>Use guided questions if you are not sure what to include.</p>
            <button className="secondaryBtn">View guide</button>
          </Card>

          <button className="primaryBtn" onClick={onNext}>Save and continue →</button>
        </div>
      </div>
    </>
  );
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
