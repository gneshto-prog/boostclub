import fs from 'node:fs';

const findings = JSON.parse(fs.readFileSync('AUDIT-FINDINGS.json', 'utf8'));
const count = status => findings.filter(item => item.status === status).length;
const lines = ['# Boost Club Audit Implementation', '', '## Summary', '',
  `Total audit findings: ${findings.length} (consolidated; repeated page/copy recommendations are retained in AUDIT-COVERAGE.md)`,
  `Fixed: ${count('VERIFIED FIXED')}`, `Verified: ${count('VERIFIED FIXED')}`,
  `Remaining: ${findings.length - count('VERIFIED FIXED') - count('NOT APPLICABLE')} (each assigned an explicit decision/external/legal state)`,
  `Unreconciled: ${count('TODO') + count('IN PROGRESS') + count('FIXED')}`,
  `External: ${count('REQUIRES EXTERNAL ACTION')}`, `Owner decision: ${count('REQUIRES OWNER DECISION')}`,
  `Legal review: ${count('REQUIRES LEGAL/COMPLIANCE REVIEW')}`, '',
  'VERIFIED FIXED means verified in the local implementation unless production evidence is explicitly stated. Nothing has been deployed. Production booking restoration is not marked fixed. Each finding has exactly one final state; AUDIT-COVERAGE.md maps repeated source recommendations to these IDs.', ''];
for (const priority of ['P0', 'P1', 'P2', 'P3']) {
  lines.push(`## ${priority}`, '');
  for (const item of findings.filter(item => item.priority === priority)) {
    lines.push(`- [${item.status === 'VERIFIED FIXED' ? 'x' : ' '}] **${item.id} — ${item.finding}** — ${item.status}`, '',
      `  Audit reference: ${item.reference}. Area: ${item.area}.`,
      `  Current behavior: ${item.current}`, `  Change: ${item.change}`, `  Expected result: ${item.expected}`,
      `  Files changed: ${item.files.length ? item.files.join(', ') : 'None yet.'}`,
      `  Verification: ${item.verification}`, '');
  }
}
fs.writeFileSync('IMPLEMENTATION-STATUS.md', lines.join('\n'));
