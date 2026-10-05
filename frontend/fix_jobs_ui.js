const fs = require('fs');
const path = 'src/app/jobs/JobsClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. CustomSelect Rewrite
const oldSelect = `
      <div 
        className={\`w-full bg-[#111827]/50 border border-white/5 text-neutral-300 text-sm rounded-xl py-3.5 \${Icon ? 'pl-11' : 'pl-5'} pr-10 cursor-pointer flex items-center justify-between transition-all hover:bg-white/10 select-none\`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={\`absolute right-4 h-4 w-4 text-neutral-400 transition-transform \${isOpen ? 'rotate-180' : ''}\`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#1a2332]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-white/10">
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Search..." 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-cyan-500/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
`;

const newSelect = `
      <div 
        className={\`w-full bg-[#111827]/50 border border-white/5 text-neutral-300 text-sm rounded-xl py-3.5 \${Icon ? 'pl-11' : 'pl-5'} pr-10 cursor-pointer flex items-center justify-between transition-all hover:bg-white/10 select-none\`}
        onClick={() => { if (!isOpen) setIsOpen(true); }}
      >
        {searchable && isOpen ? (
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search..." 
            className="w-full bg-transparent border-none text-neutral-200 focus:outline-none focus:ring-0 p-0 m-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        )}
        <ChevronDown 
          className={\`absolute right-4 h-4 w-4 text-neutral-400 transition-transform \${isOpen ? 'rotate-180' : ''}\`} 
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} 
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#1a2332]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden">
`;
content = content.replace(oldSelect.trim(), newSelect.trim());

// 2. Filter logic for "digital", "computer engineering", "electronics engineering", "ai"
const oldFilter = `
      let searchTerms = [lowerDiscipline];
      if (lowerDiscipline === 'backend development') {
        searchTerms = ['backend', 'back-end', 'back end'];
      } else if (lowerDiscipline === 'frontend development') {
        searchTerms = ['frontend', 'front-end', 'front end'];
      } else if (lowerDiscipline === 'full stack development') {
        searchTerms = ['full stack', 'full-stack', 'fullstack'];
      } else if (lowerDiscipline === 'software engineering') {
        searchTerms = ['software', 'swe'];
      } else if (lowerDiscipline === 'hardware engineering') {
        searchTerms = ['hardware'];
      } else if (lowerDiscipline === 'systems engineering') {
        searchTerms = ['systems engineer', 'system engineer'];
      } else if (lowerDiscipline === 'quality assurance') {
        searchTerms = ['quality assurance', 'qa'];
      } else if (lowerDiscipline === 'embedded systems') {
        searchTerms = ['embedded'];
      } else {
`;

const newFilter = `
      let searchTerms = [lowerDiscipline];
      if (lowerDiscipline === 'backend development') {
        searchTerms = ['backend', 'back-end', 'back end'];
      } else if (lowerDiscipline === 'frontend development') {
        searchTerms = ['frontend', 'front-end', 'front end'];
      } else if (lowerDiscipline === 'full stack development') {
        searchTerms = ['full stack', 'full-stack', 'fullstack'];
      } else if (lowerDiscipline === 'software engineering') {
        searchTerms = ['software', 'swe'];
      } else if (lowerDiscipline === 'hardware engineering') {
        searchTerms = ['hardware'];
      } else if (lowerDiscipline === 'systems engineering') {
        searchTerms = ['systems engineer', 'system engineer'];
      } else if (lowerDiscipline === 'quality assurance') {
        searchTerms = ['quality assurance', 'qa'];
      } else if (lowerDiscipline === 'embedded systems') {
        searchTerms = ['embedded'];
      } else if (lowerDiscipline === 'digital') {
        searchTerms = ['digital'];
      } else if (lowerDiscipline === 'computer engineering') {
        searchTerms = ['computer'];
      } else if (lowerDiscipline === 'electronics engineering') {
        searchTerms = ['electronic'];
      } else {
`;
content = content.replace(oldFilter.trim(), newFilter.trim());

// 3. Disciplines List and Priority Sorting
const oldList = `
    const dSet = new Set<string>([
      "Software Engineering",
      "Digital Design",
      "Digital Verification",
      "Embedded Systems",
      "Physical Design",
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
      "Quality Assurance",
      "Testing",
      "DevOps",
      "Cloud",
      "Data Science",
      "Machine Learning",
      "AI",
      "Hardware Engineering",
      "Systems Engineering",
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Architecture",
      "IT",
      "UI/UX Design",
      "Product Management",
      "Project Management"
    ]);
`;
const newList = `
    const dSet = new Set<string>([
      "AI",
      "Digital",
      "Testing",
      "Computer Engineering",
      "Electronics Engineering",
      "Software Engineering",
      "Embedded Systems",
      "Physical Design",
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
      "Quality Assurance",
      "DevOps",
      "Cloud",
      "Data Science",
      "Machine Learning",
      "Hardware Engineering",
      "Systems Engineering",
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Architecture",
      "IT",
      "UI/UX Design",
      "Product Management",
      "Project Management"
    ]);
`;
content = content.replace(oldList.trim(), newList.trim());

const oldSort = `
    const targetEngineering = [
        "engineering", "software", "digital design", "digital verification", 
        "embedded", "testing", "devops", "cloud", "ai", "machine learning", 
        "data", "frontend", "backend", "full stack", "quality", "physical design"
    ];

    return Array.from(dSet).sort((a, b) => {
      const aName = a.toLowerCase();
      const bName = b.toLowerCase();
      const aIsEng = aName.includes('engineer') || targetEngineering.some(t => aName.includes(t));
      const bIsEng = bName.includes('engineer') || targetEngineering.some(t => bName.includes(t));
      
      if (aIsEng && !bIsEng) return -1;
      if (!aIsEng && bIsEng) return 1;
      return aName.localeCompare(bName);
    });
`;
const newSort = `
    const targetEngineering = [
        "engineering", "software", "embedded", "devops", "cloud", "machine learning", 
        "data", "frontend", "backend", "full stack", "quality", "physical design"
    ];

    // Priority Order: AI, Digital, Testing, Computer, Electronics
    const priorityOrder = ["ai", "digital", "testing", "computer engineering", "electronics engineering"];

    return Array.from(dSet).sort((a, b) => {
      const aName = a.toLowerCase();
      const bName = b.toLowerCase();

      // Check explicit priority
      const aPriorityIdx = priorityOrder.indexOf(aName);
      const bPriorityIdx = priorityOrder.indexOf(bName);

      if (aPriorityIdx !== -1 && bPriorityIdx !== -1) return aPriorityIdx - bPriorityIdx;
      if (aPriorityIdx !== -1) return -1;
      if (bPriorityIdx !== -1) return 1;

      // Then check engineering
      const aIsEng = aName.includes('engineer') || targetEngineering.some(t => aName.includes(t));
      const bIsEng = bName.includes('engineer') || targetEngineering.some(t => bName.includes(t));
      
      if (aIsEng && !bIsEng) return -1;
      if (!aIsEng && bIsEng) return 1;

      // Fallback to alphabetical
      return aName.localeCompare(bName);
    });
`;
content = content.replace(oldSort.trim(), newSort.trim());

fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
