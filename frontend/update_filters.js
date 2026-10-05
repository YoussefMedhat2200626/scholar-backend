const fs = require('fs');
const path = 'src/app/jobs/JobsClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Insert normalizeCompany function at the top of the component
if (!content.includes('const normalizeCompany')) {
    const hookStart = "export default function JobsClient({ initialJobs, serverError }: { initialJobs: JobData[], serverError?: string }) {\n";
    const normalizeFunc = `
  const normalizeCompany = (c: string) => {
      if (!c) return '';
      const lower = c.toLowerCase();
      if (lower.includes("siemens energy")) return "Siemens Energy";
      if (lower.includes("siemens gamesa")) return "Siemens Gamesa";
      if (lower.includes("siemens digital industries software") || lower.includes("siemens dis") || lower.includes("siemens eda")) return "Siemens Digital Industries Software";
      if (lower.includes("siemens")) return "Siemens";
      if (lower.includes("mixel")) return "Mixel-Egypt";
      if (lower.includes("capgemini")) return "Capgemini";
      if (lower.includes("stmicroelectronics")) return "STMicroelectronics";
      if (lower.includes("analog devices")) return "Analog Devices";
      if (lower.includes("infinilink")) return "InfiniLink";
      if (lower.includes("valeo")) return "Valeo";
      if (lower.includes("iss international spa")) return "ISS INTERNATIONAL SpA";
      return c;
  };
`;
    content = content.replace(hookStart, hookStart + normalizeFunc);
}

// 2. Update company filtering logic
const oldCompanyFilter = `
    if (selectedCompany) {
      result = result.filter(job => job.company?.toLowerCase() === selectedCompany.toLowerCase());
    }
`;
const newCompanyFilter = `
    if (selectedCompany) {
      result = result.filter(job => {
        return normalizeCompany(job.company || '').toLowerCase() === selectedCompany.toLowerCase();
      });
    }
`;
content = content.replace(oldCompanyFilter.trim(), newCompanyFilter.trim());

// 3. Update uniqueDisciplines
const oldDisciplines = `
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
const newDisciplines = `
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
      "Project Management",
      "Automation Machinery Manufacturing",
      "Engineering",
      "Software Development",
      "Appliance, Electrical, and Electronics Manufacturing",
      "Semiconductor Manufacturing",
      "Computer Hardware Manufacturing, Semiconductor Manufacturing, and Wireless Services",
      "Information Technology & Services",
      "Software Development and Engineering Services",
      "Computer Science & AI",
      "Motor Vehicle Parts Manufacturing",
      "Oil and gas",
      "Uncategorized"
    ]);
`;
content = content.replace(oldDisciplines.trim(), newDisciplines.trim());

// 4. Update uniqueCompanies logic
const oldUniqueCompanies = `
  const uniqueCompanies = useMemo(() => {
    const comps = new Set((initialJobs || []).map(j => j.company).filter(Boolean));
    const targetCompanies = [
      "siemens", "capgemini", "cisco", "siemens energy", "stmicroelectronics", 
      "mediatek", "brightskies", "hcltech", "nawy", "analog devices", 
      "infinilink", "valeo", "siemens gamesa", "iss international spa", 
      "siemens digital industries software", "mixel-egypt", "si vision", "global foundaries", "si bits"
    ];

    return Array.from(comps).sort((a, b) => {
      const aName = (a as string).toLowerCase();
      const bName = (b as string).toLowerCase();
      const aIsTarget = targetCompanies.some(tc => aName.includes(tc));
      const bIsTarget = targetCompanies.some(tc => bName.includes(tc));
      
      if (aIsTarget && !bIsTarget) return -1;
      if (!aIsTarget && bIsTarget) return 1;
      return aName.localeCompare(bName);
    }) as string[];
  }, [initialJobs]);
`;
const newUniqueCompanies = `
  const uniqueCompanies = useMemo(() => {
    const targetOrder = [
      "Siemens", "Capgemini", "Cisco", "Siemens Energy", "STMicroelectronics", 
      "MediaTek", "Brightskies", "HCLTech", "Nawy", "Analog Devices", 
      "InfiniLink", "Valeo", "Siemens Gamesa", "ISS INTERNATIONAL SpA", 
      "Siemens Digital Industries Software", "Mixel-Egypt"
    ];

    const comps = new Set<string>();
    (initialJobs || []).forEach(j => {
      if (j.company) {
        comps.add(normalizeCompany(j.company));
      }
    });

    return Array.from(comps).sort((a, b) => {
      const aIdx = targetOrder.indexOf(a);
      const bIdx = targetOrder.indexOf(b);

      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [initialJobs]);
`;
content = content.replace(oldUniqueCompanies.trim(), newUniqueCompanies.trim());

fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
