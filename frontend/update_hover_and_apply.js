const fs = require('fs');
const path = 'src/app/jobs/JobsClient.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldCardClass = `"bg-[#151c2c]/80 backdrop-blur-sm border border-white/5 hover:border-white/10 hover:bg-[#1a2336] transition-all cursor-pointer rounded-2xl p-6 flex flex-col relative group"`;
const newCardClass = `"bg-[#151c2c]/80 backdrop-blur-sm border border-white/5 hover:border-[#70B5DF] hover:[box-shadow:0px_0px_15px_rgba(112,181,223,0.3)] hover:bg-[#1a2336] transition-all duration-300 cursor-pointer rounded-2xl p-6 flex flex-col relative group"`;

content = content.replace(oldCardClass, newCardClass);

const oldTagsDiv = `
                {/* Tags (Bottom) */}
                <div className="mt-auto flex flex-wrap gap-2">
`;
const newTagsDiv = `
                {/* Bottom Section: Tags and Apply Button */}
                <div className="mt-auto flex items-end justify-between gap-4 pt-4">
                  <div className="flex flex-wrap gap-2">
`;

// Now close the new wrapper around the tags
const oldTagsEnd = `
                  </div>
                  
                </div>
              </div>
`;
const newTagsEnd = `
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); window.open(job.url, '_blank'); }}
                    className="shrink-0 bg-[#70B5DF]/10 hover:bg-[#70B5DF]/20 border border-[#70B5DF]/30 text-[#70B5DF] px-4 py-1.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
`;

// Since oldTagsEnd might not match exactly due to spacing, I'll use regex for the end replacement
content = content.replace(oldTagsDiv, newTagsDiv);

const regexTagsEnd = /<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}\)/;
const replacementEnd = `  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); window.open(job.url, '_blank'); }}
                    className="shrink-0 bg-[#70B5DF]/10 hover:bg-[#70B5DF]/20 hover:[box-shadow:0px_0px_10px_#70B5DF] border border-[#70B5DF]/50 text-[#70B5DF] px-5 py-2 rounded-xl font-bold text-sm transition-all duration-300"
                  >
                    Apply
                  </button>
                </div>
              </div>
            );
          })`;
content = content.replace(regexTagsEnd, replacementEnd);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated job cards with glow and apply button');
