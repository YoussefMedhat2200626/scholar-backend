const fs = require('fs');
const path = 'src/app/jobs/JobsClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Imports
if (!content.includes("import JobModal")) {
  content = content.replace(
    "import React, { useState, useMemo, useRef, useEffect } from 'react';",
    `import React, { useState, useMemo, useRef, useEffect } from 'react';\nimport JobModal from './components/JobModal';\nimport CompanyModal from './components/CompanyModal';\nimport CompaniesGrid from './components/CompaniesGrid';\nimport { CompanyMeta } from '@/src/data/companies';`
  );
}

// 2. State
const stateInsertionPoint = "const [selectedCompany, setSelectedCompany] = useState('');";
const stateCode = `const [selectedCompany, setSelectedCompany] = useState('');
  const [activeTab, setActiveTab] = useState<'jobs' | 'companies'>('jobs');
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<CompanyMeta | null>(null);`;
content = content.replace(stateInsertionPoint, stateCode);

// 3. Tab UI & Conditional Rendering
// Let's find where the search filters start:
const filtersStart = `<div className="flex flex-col lg:flex-row gap-4 mb-8">`;
const newFiltersStart = `
        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto custom-scrollbar">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={\`pb-4 px-6 font-bold text-lg whitespace-nowrap transition-all border-b-2 \${activeTab === 'jobs' ? 'border-[#70B5DF] text-[#70B5DF]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}\`}
          >
            Career Map
          </button>
          <button 
            onClick={() => setActiveTab('companies')}
            className={\`pb-4 px-6 font-bold text-lg whitespace-nowrap transition-all border-b-2 \${activeTab === 'companies' ? 'border-[#70B5DF] text-[#70B5DF]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}\`}
          >
            Companies
          </button>
        </div>

        {activeTab === 'companies' ? (
          <CompaniesGrid onCompanyClick={setSelectedCompanyModal} />
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-4 mb-8">`;
content = content.replace(filtersStart, newFiltersStart);

// 4. Job Date and onClick
const extractTagsCode = `const locationShort = (job.location?.includes('Egypt') || job.location?.includes('Cairo')) ? 'EG' : 'Remote';`;
const newExtractTagsCode = `const locationShort = (job.location?.includes('Egypt') || job.location?.includes('Cairo')) ? 'EG' : 'Remote';
            const dateFormatted = job.first_seen_at ? new Date(job.first_seen_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';`;
content = content.replace(extractTagsCode, newExtractTagsCode);

// Replace onClick and add date to Top Row
const cardTopRow = `<div 
                key={job.id} 
                onClick={() => window.open(job.url, '_blank')}
                className="bg-[#151c2c]/80 backdrop-blur-sm border border-white/5 hover:border-[#70B5DF] hover:[box-shadow:0px_0px_15px_rgba(112,181,223,0.3)] hover:bg-[#1a2336] transition-all duration-300 cursor-pointer rounded-2xl p-6 flex flex-col relative group"
              >
                {/* Top Row: Logo and EG Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className={\`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm \${getCompanyColor(job.company || '')}\`}>
                    {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 text-xs font-bold tracking-wider">
                      EG
                    </div>
                  </div>
                </div>`;

const newCardTopRow = `<div 
                key={job.id} 
                onClick={() => setSelectedJob(job)}
                className="bg-[#151c2c]/80 backdrop-blur-sm border border-white/5 hover:border-[#70B5DF] hover:[box-shadow:0px_0px_15px_rgba(112,181,223,0.3)] hover:bg-[#1a2336] transition-all duration-300 cursor-pointer rounded-2xl p-6 flex flex-col relative group"
              >
                {/* Top Row: Logo and EG Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className={\`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm \${getCompanyColor(job.company || '')}\`}>
                    {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <div className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 text-xs font-bold tracking-wider">
                      EG
                    </div>
                    <span className="text-[10px] text-neutral-500 font-bold">{dateFormatted}</span>
                  </div>
                </div>`;

content = content.replace(cardTopRow, newCardTopRow);

// 5. Modals and close fragment
const renderEnd = `        </div>
        
      </div>
    </div>
  );
}`;

const newRenderEnd = `        </div>
          </>
        )}
        
      </div>
      
      <JobModal 
        job={selectedJob} 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
        getCompanyColor={getCompanyColor}
      />
      
      <CompanyModal
        company={selectedCompanyModal}
        isOpen={!!selectedCompanyModal}
        onClose={() => setSelectedCompanyModal(null)}
        jobs={initialJobs}
      />
    </div>
  );
}`;
content = content.replace(renderEnd, newRenderEnd);

fs.writeFileSync(path, content, 'utf8');
console.log('JobsClient.tsx successfully patched.');
