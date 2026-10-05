const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(({oldStr, newStr}) => {
        content = content.split(oldStr).join(newStr);
    });
    fs.writeFileSync(filePath, content, 'utf8');
}

// db.py
replaceInFile('scripts/bot/db.py', [
    { oldStr: 'max_age_days: int = 14', newStr: 'max_age_days: int = 30' },
    { oldStr: '14 days', newStr: '30 days' },
    { oldStr: 'cutoff_14d', newStr: 'cutoff_30d' }
]);

// linkedin_expiry_checker.py
replaceInFile('scripts/bot/linkedin_expiry_checker.py', [
    { oldStr: 'max_age_days: int = 14', newStr: 'max_age_days: int = 30' },
    { oldStr: '14 days', newStr: '30 days' },
    { oldStr: 'max-age-days 14', newStr: 'max-age-days 30' }
]);

// main.py
replaceInFile('scripts/bot/main.py', [
    { oldStr: 'max_age_days=14', newStr: 'max_age_days=30' },
    { oldStr: '2-Week', newStr: '30-Day' },
    { oldStr: '14 days', newStr: '30 days' },
    { oldStr: '2 weeks', newStr: '30 days' }
]);

// test_purge_live.py
replaceInFile('scripts/bot/test_purge_live.py', [
    { oldStr: '14)', newStr: '30)' },
    { oldStr: 'two_weeks', newStr: '30_days' } // Also update the function name if called, but wait, purge_jobs_older_than_two_weeks is exported.
]);

console.log("Replaced 14 with 30 in python bot files.");
