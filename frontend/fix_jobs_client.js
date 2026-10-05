const fs = require('fs');
const path = 'src/app/jobs/JobsClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// Revert the bad end replacement
content = content.replace(`        </div>
          </>
        )}
        
      </div>
      
      <JobModal `, `        </div>
      </div>
      
      <JobModal `);

// Now inject the tabs right before {/* Filter Bar */}
const oldHeader = `        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 tracking-wide uppercase">
          Global Career Map
        </h1>

        {/* Filter Bar */}`;

const newHeader = `        {/* Tabs */}
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
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 tracking-wide uppercase">
              Global Career Map
            </h1>
            {/* Filter Bar */}`;

content = content.replace(oldHeader, newHeader);

// And close the fragment at the end of Job Grid
const oldJobGridEnd = `            );
          })}
        </div>
      </div>
      
      <JobModal `;

const newJobGridEnd = `            );
          })}
        </div>
        </>
        )}
      </div>
      
      <JobModal `;

content = content.replace(oldJobGridEnd, newJobGridEnd);

fs.writeFileSync(path, content, 'utf8');
console.log('JobsClient.tsx syntax fixed.');
