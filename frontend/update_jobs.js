const fs = require('fs');

const path = 'src/app/jobs/JobsClient.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldFilterLogic = `
    if (selectedDiscipline) {
      const lowerDiscipline = selectedDiscipline.toLowerCase();
      result = result.filter(job => {
        let tags: string[] = [];
        try {
          tags = typeof job.tags_json === 'string' ? JSON.parse(job.tags_json) : (job.tags_json || []);
        } catch {}
        
        return tags.some(t => t.toLowerCase() === lowerDiscipline);
      });
    }
`;

const newFilterLogic = `
    if (selectedDiscipline) {
      const lowerDiscipline = selectedDiscipline.toLowerCase();
      result = result.filter(job => {
        const inTitle = job.title?.toLowerCase().includes(lowerDiscipline);
        
        let tags: string[] = [];
        try {
          tags = typeof job.tags_json === 'string' ? JSON.parse(job.tags_json) : (job.tags_json || []);
        } catch {}
        const inTags = tags.some(t => t.toLowerCase().includes(lowerDiscipline));
        
        return inTitle || inTags;
      });
    }
`;

content = content.replace(oldFilterLogic.trim(), newFilterLogic.trim());

const oldDisciplinesLogic = `
  const uniqueDisciplines = useMemo(() => {
    const dSet = new Set<string>();
    (initialJobs || []).forEach(job => {
      let parsedTags: string[] = [];
      try {
        parsedTags = typeof job.tags_json === 'string' ? JSON.parse(job.tags_json) : (job.tags_json || []);
      } catch {}
      parsedTags.forEach(t => {
        const lower = t.toLowerCase();
        // Ignore generic tags to only keep disciplines/majors
        if (!lower.includes('senior') && !lower.includes('junior') && !lower.includes('mid') &&
            !lower.includes('remote') && !lower.includes('hybrid') && !lower.includes('on-site') &&
            !lower.includes('full-time') && !lower.includes('part-time') && !lower.includes('contract') &&
            !lower.includes('internship') && !lower.includes('temporary') && !lower.includes('volunteer')) {
          dSet.add(t);
        }
      });
    });

    const targetEngineering = [
        "engineering", "software", "digital design", "digital verification", 
        "embedded", "testing", "devops", "cloud", "ai", "machine learning", 
        "data", "frontend", "backend", "full stack"
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
  }, [initialJobs]);
`;

const newDisciplinesLogic = `
  const uniqueDisciplines = useMemo(() => {
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

    (initialJobs || []).forEach(job => {
      let parsedTags: string[] = [];
      try {
        parsedTags = typeof job.tags_json === 'string' ? JSON.parse(job.tags_json) : (job.tags_json || []);
      } catch {}
      parsedTags.forEach(t => {
        const lower = t.toLowerCase();
        // Ignore generic tags to only keep disciplines/majors
        if (!lower.includes('senior') && !lower.includes('junior') && !lower.includes('mid') &&
            !lower.includes('remote') && !lower.includes('hybrid') && !lower.includes('on-site') &&
            !lower.includes('full-time') && !lower.includes('part-time') && !lower.includes('contract') &&
            !lower.includes('internship') && !lower.includes('temporary') && !lower.includes('volunteer')) {
          dSet.add(t);
        }
      });
    });

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
  }, [initialJobs]);
`;

content = content.replace(oldDisciplinesLogic.trim(), newDisciplinesLogic.trim());
fs.writeFileSync(path, content, 'utf8');
console.log('Done replacing logic.');
