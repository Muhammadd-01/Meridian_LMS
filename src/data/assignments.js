const DAY = 24 * 60 * 60 * 1000

/** Practical assignments attached to MEQMP training courses. Case-study organisations are fictional. */
const SPECS = [
  { id: 'asg-audit-report', courseId: 'crs-iso9001-la', title: 'Write audit findings from a case study', dueInDays: 9,
    instructions: `## Brief
You audited the purchasing process of the fictional manufacturer "Corvid Components". Using the case-study notes in the course resources, write the audit findings.

## Requirements
- At least two nonconformities, each stating the requirement, the objective evidence and the gap
- One observation or opportunity for improvement
- A short audit conclusion for the closing meeting`,
    rubric: ['Clear requirement references', 'Objective evidence', 'Professional wording', 'Sound conclusion'] },
  { id: 'asg-qms-policy', courseId: 'crs-iso9001-ia', title: 'Draft a quality policy and process map', dueInDays: 5,
    instructions: `## Brief
For "Corvid Components", draft a quality policy and map one core process ready for an internal audit.

## Include
- A quality policy of no more than 150 words
- Process inputs, outputs, owners and KPIs
- Three audit questions you would ask the process owner`,
    rubric: ['Alignment with ISO 9001 intent', 'Process clarity', 'Audit questions'] },
  { id: 'asg-ems-aspects', courseId: 'crs-iso14001-ia', title: 'Build an environmental aspects register', dueInDays: 7,
    instructions: `## Brief
Identify the environmental aspects and impacts of a small warehouse operation.

## Include
- At least six aspects with their impacts
- A simple significance rating
- Controls and the compliance obligations that apply`,
    rubric: ['Aspect identification', 'Significance method', 'Controls and obligations'] },
  { id: 'asg-ohs-hira', courseId: 'crs-iso45001-ia', title: 'Complete a hazard identification and risk assessment', dueInDays: 4,
    instructions: `## Brief
Carry out a hazard identification and risk assessment (HIRA) for a maintenance workshop.

## Include
- Hazards, who might be harmed and how
- Risk rating before and after controls
- Controls following the hierarchy of controls`,
    rubric: ['Hazard identification', 'Risk rating', 'Hierarchy of controls'] },
  { id: 'asg-isms-procedure', courseId: 'crs-iso27001-la', title: 'Audit an information security incident procedure', dueInDays: 10,
    instructions: `## Brief
Review the sample incident management procedure in the course resources against ISO/IEC 27001 requirements and Annex A controls.

## Include
- An audit checklist of at least eight questions
- Two findings with objective evidence
- Recommendations for the auditee’s corrective action plan`,
    rubric: ['Checklist quality', 'Evidence-based findings', 'Control coverage'] },
  { id: 'asg-lss-charter', courseId: 'crs-lss-gb', title: 'Draft a Lean Six Sigma project charter', dueInDays: 8,
    instructions: `## Brief
Choose a process at work (or the fictional warehouse case) with a measurable problem and draft a DMAIC project charter.

## Include
- Problem and goal statements (SMART)
- Scope, SIPOC and key metrics
- Team, stakeholders and a high-level timeline`,
    rubric: ['Problem definition', 'Measurable goal', 'Scope and SIPOC', 'Stakeholders'] },
  { id: 'asg-hse-jsa', courseId: 'crs-osha', title: 'Complete a job safety analysis', dueInDays: 6,
    instructions: `## Brief
Prepare a job safety analysis for "working at height to replace a warehouse light fitting".

## Include
- Task broken into sequential steps
- Hazards for each step
- Controls following the hierarchy of controls, including PPE`,
    rubric: ['Task breakdown', 'Hazard identification', 'Hierarchy of controls'] },
  { id: 'asg-fire-plan', courseId: 'crs-fire', title: 'Prepare a fire evacuation plan', dueInDays: -2,
    instructions: `## Brief
Prepare a fire evacuation plan for a two-storey office.

## Include
- Alarm and escape routes
- Roles of fire wardens and assembly points
- How visitors and people with disabilities are supported`,
    rubric: ['Escape routes', 'Roles and responsibilities', 'Inclusive evacuation'] },
  { id: 'asg-pmp-charter', courseId: 'crs-pmp', title: 'Create a project charter', dueInDays: 12,
    instructions: `## Brief
Write a project charter for rolling out an ISO 9001 quality management system at a fictional company.

## Include
- Objectives and success criteria
- Scope (in and out), key stakeholders and milestones
- Top five risks with owners`,
    rubric: ['Clear objectives', 'Scope definition', 'Risk identification'] },
  { id: 'asg-bcm-bia', courseId: 'crs-bcm', title: 'Run a business impact analysis', dueInDays: 11,
    instructions: `## Brief
Run a simplified business impact analysis for a training centre that must keep delivering courses.

## Include
- Three critical activities with their dependencies
- Impact over time and maximum tolerable disruption
- Recovery time objectives and a proposed continuity strategy`,
    rubric: ['Critical activities', 'Impact analysis', 'Recovery objectives'] },
]

export function buildAssignments(now) {
  return SPECS.map(({ dueInDays, ...a }) => ({
    ...a,
    maxPoints: 100,
    allowResubmission: true,
    dueDate: new Date(now + dueInDays * DAY).toISOString(),
  }))
}
