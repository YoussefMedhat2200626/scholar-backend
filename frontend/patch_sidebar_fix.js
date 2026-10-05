const fs = require('fs');
const path = 'src/app/jobs/JobsClient.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `        {/* Job Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10">
          {filteredJobs.map((job: JobData) => {`;

const replacementUI = `        {/* Sidebar + Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar - Brands/Companies Filter */}
          <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
            <div className="bg-[#1a2332]/80 backdrop-blur-md rounded-2xl border border-white/5 p-4 shadow-lg sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white tracking-wide uppercase">Brand</h3>
                <ChevronUp className="w-4 h-4 text-neutral-400" />
              </div>
              
              {/* Search Companies */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                  <Search className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  className="w-full bg-[#111827]/50 border border-white/5 text-neutral-200 text-sm rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:border-white/20 placeholder-neutral-500"
                  placeholder="Search"
                  value={companySearchQuery}
                  onChange={(e) => setCompanySearchQuery(e.target.value)}
                />
              </div>

              {/* Company Checkboxes */}
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                {filteredMainCompanies.map(company => (
                  <label key={company} className="flex items-center gap-3 cursor-pointer group">
                    <div className={\`w-5 h-5 rounded flex items-center justify-center border transition-all \${selectedCompaniesFilter.includes(company) ? 'bg-[#70B5DF] border-[#70B5DF]' : 'bg-[#111827]/50 border-white/10 group-hover:border-white/30'}\`}>
                      {selectedCompaniesFilter.includes(company) && <Check className="w-3.5 h-3.5 text-[#0a0f18] font-bold" />}
                    </div>
                    <span className="text-sm text-neutral-300 group-hover:text-white transition-colors truncate">{company}</span>
                  </label>
                ))}

                {showAllCompanies && filteredOtherCompanies.map(company => (
                  <label key={company} className="flex items-center gap-3 cursor-pointer group">
                    <div className={\`w-5 h-5 rounded flex items-center justify-center border transition-all \${selectedCompaniesFilter.includes(company) ? 'bg-[#70B5DF] border-[#70B5DF]' : 'bg-[#111827]/50 border-white/10 group-hover:border-white/30'}\`}>
                      {selectedCompaniesFilter.includes(company) && <Check className="w-3.5 h-3.5 text-[#0a0f18] font-bold" />}
                    </div>
                    <span className="text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors truncate">{company}</span>
                  </label>
                ))}
              </div>

              {/* Show All Toggle */}
              {(otherCompaniesList.length > 0 || (companySearchQuery && filteredOtherCompanies.length > 0)) && (
                <button
                  onClick={() => setShowAllCompanies(!showAllCompanies)}
                  className="mt-4 text-sm font-semibold text-[#70B5DF] hover:text-[#5da0c9] transition-colors w-full text-left"
                >
                  {showAllCompanies ? "See Less" : "See All"}
                </button>
              )}
            </div>
          </aside>

          {/* Main Content - Jobs Grid */}
          <div className="flex-1">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-[#1a2332]/50 rounded-2xl border border-white/5">
                <AlertCircle className="w-12 h-12 text-neutral-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
                <p className="text-neutral-400">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 relative z-10">
                {filteredJobs.map((job: JobData) => {`;
                
if (!content.includes("Sidebar + Main Content Layout")) {
    content = content.replace(targetStr, replacementUI);
}

// Now close the divs
const targetClose = `                  </button>
                </div>
              </div>
            );
          })}
        </div>
        </>
        )}
      </div>`;
      
const replacementClose = `                  </button>
                </div>
              </div>
            );
          })}
        </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>`;

content = content.replace(targetClose, replacementClose);

fs.writeFileSync(path, content, 'utf8');
console.log('Sidebar injected successfully.');
