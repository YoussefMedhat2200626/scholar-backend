const fs = require('fs');

const path = 'src/app/jobs/JobsClient.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldLogic = `
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

const newLogic = `
    if (selectedDiscipline) {
      const lowerDiscipline = selectedDiscipline.toLowerCase();
      
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
        const shortened = lowerDiscipline
          .replace(' development', '')
          .replace(' engineering', '')
          .replace(' systems', '');
        if (shortened !== lowerDiscipline) {
          searchTerms.push(shortened);
        }
      }
      
      result = result.filter(job => {
        const lowerTitle = job.title?.toLowerCase() || '';
        let tags: string[] = [];
        try {
          tags = typeof job.tags_json === 'string' ? JSON.parse(job.tags_json) : (job.tags_json || []);
        } catch {}
        const tagsJoined = tags.join(' ').toLowerCase();

        return searchTerms.some(term => lowerTitle.includes(term) || tagsJoined.includes(term));
      });
    }
`;

if (content.includes(oldLogic.trim())) {
    content = content.replace(oldLogic.trim(), newLogic.trim());
    fs.writeFileSync(path, content, 'utf8');
    console.log('Done');
} else {
    console.log('Could not find old logic block');
}
