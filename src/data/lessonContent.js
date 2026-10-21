/**
 * Lesson body content uses a small Markdown subset rendered by <Markdown />:
 * ## headings, paragraphs, - lists, 1. lists, ``` code fences, > callouts, **bold** and `code`.
 */
const HANDWRITTEN = {
  'Principles of auditing and auditor competence': `## Why principles matter
An audit is only useful if people trust its conclusions. ISO 19011 sets out seven principles that make audit results reliable and comparable.

## The seven principles
- **Integrity** — the foundation of professionalism.
- **Fair presentation** — report truthfully and accurately.
- **Due professional care** — apply diligence and judgement.
- **Confidentiality** — protect information gained during the audit.
- **Independence** — stay impartial and objective.
- **Evidence-based approach** — base conclusions on verifiable evidence.
- **Risk-based approach** — focus on what matters most to the auditee and the audit objectives.

## Auditor competence
Competence combines **knowledge** of the standard and the sector, **skills** in questioning and note-taking, and **personal behaviour** such as being ethical, open-minded and diplomatic.

> Tip: before every audit, ask yourself which of your relationships or past roles could affect your independence.`,

  'Writing nonconformities and observations': `## What a good finding looks like
A nonconformity is the non-fulfilment of a requirement. Every finding should let a reader understand the problem without being in the room.

## The three parts
1. **Requirement** — the clause, procedure or legal obligation.
2. **Evidence** — what you saw, read or heard (records, observations, interviews).
3. **Statement** — how the evidence fails to meet the requirement.

## Example
\`\`\`
Requirement: ISO 9001:2015 clause 7.5.3 requires documented information to be controlled.
Evidence: Work instruction WI-07 at the packing line was revision B; the controlled master list shows revision D.
Nonconformity: Obsolete documented information was available at the point of use.
\`\`\`

## Observations and opportunities for improvement
Observations highlight risks or good practice without a requirement being broken. Keep them specific and avoid prescribing solutions — corrective action belongs to the auditee.`,

  'Opening meetings and gathering audit evidence': `## The opening meeting
Keep it short and structured: confirm the scope and objectives, introduce the team, agree the timetable, explain how findings will be graded and reported, and confirm confidentiality and safety arrangements.

## Sources of evidence
- **Documents and records** — procedures, plans, logs and reports
- **Observation** — watching activities as they happen
- **Interviews** — with process owners and the people doing the work

## Sampling
You can’t check everything. Choose samples that reflect risk, volume and time period, and record exactly what you sampled so the audit trail is clear.`,

  'Fall hazards and fall protection': `## Why falls matter
Falls from height are a leading cause of serious injuries and fatalities in construction and maintenance work.

## Controlling the risk
1. **Avoid** work at height where possible.
2. **Prevent** falls with guardrails, covers and properly erected scaffolds.
3. **Arrest** falls with personal fall-arrest systems where prevention isn’t possible.

## Before work starts
- Inspect ladders, scaffolds and harnesses
- Check anchor points and rescue arrangements
- Confirm everyone has been trained for the equipment they’ll use`,

  'The fire triangle and fire tetrahedron': `## What a fire needs
A fire needs **heat**, **fuel** and **oxygen** — the fire triangle. Remove any one side and the fire goes out. The fire tetrahedron adds a fourth element: the **chemical chain reaction** that keeps burning going.

## Putting it to work
- **Cooling** removes heat (water)
- **Smothering** removes oxygen (foam, CO₂, fire blankets)
- **Starving** removes fuel (isolating gas or moving combustibles)
- **Interrupting the reaction** (dry powder, wet chemical agents)

> Knowing which side of the triangle an extinguisher attacks helps you choose the right one safely.`,

  'What Lean Six Sigma is and why it matters': `## Two ideas, one method
**Lean** removes waste so work flows; **Six Sigma** reduces variation so results are predictable. Together they improve quality, speed and cost at the same time.

## The eight wastes (DOWNTIME)
- Defects, Overproduction, Waiting, Non-utilised talent
- Transportation, Inventory, Motion, Extra-processing

## How projects run
Improvement projects follow **DMAIC** — Define, Measure, Analyze, Improve, Control — so decisions are driven by data rather than opinion.`,
}

function lower(text) {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

/** Returns hand-written content when available, otherwise a structured lesson template. */
export function getLessonContent(title, course) {
  if (HANDWRITTEN[title]) return HANDWRITTEN[title]
  const skills = course.skills || []
  const outcomes = course.learningOutcomes || []
  const outcome = outcomes.length ? lower(outcomes[title.length % outcomes.length]) : 'apply new skills at work'
  const skillA = skills[title.length % Math.max(skills.length, 1)] || 'core skills'
  const skillB = skills[(title.length + 1) % Math.max(skills.length, 1)] || 'practice'
  return `## Why this matters
**${title}** is a building block of *${course.title}*. Professionals rely on it to ${outcome}.

## Key ideas
- **Core concept:** what ${lower(title)} is and the problem it solves.
- **In practice:** how teams apply it alongside ${skillA} and ${skillB}.
- **Common pitfalls:** the mistakes newcomers make — and how to avoid them.
- **Quality check:** simple questions to confirm your work is sound.

## Worked example
Imagine the quality and HSE team at a fictional manufacturer, Corvid Components, tackling this topic for the first time. They start with the simplest version that works, review it together, and improve it in short iterations rather than aiming for perfection on day one.

## Try it yourself
Spend ten minutes applying today's idea to a small example from your own work or studies. Write down one question to bring to the course discussion.

> Tip: Use the Notes tab to capture what you learn — notes are saved in this browser.`
}
