const DAY = 24 * 60 * 60 * 1000

const SPECS = [
  { id: 'asg-react', courseId: 'crs-react', title: 'Build a reusable component library', dueInDays: 6,
    instructions: `## Brief
Create three reusable React components — **Button**, **Card** and **Modal** — and use them in a small demo page.

## Requirements
- Components accept props for variants and content.
- The Modal traps focus and closes with the Escape key.
- Include a short README explaining each component's API.

## Submission
Paste a link to your repository or describe your implementation in the text box. Attach screenshots if helpful.`,
    rubric: ['Component API design', 'Accessibility', 'Code readability', 'Documentation'] },
  { id: 'asg-python', courseId: 'crs-python', title: 'Analyse a retail sales dataset', dueInDays: 3,
    instructions: `## Brief
Using the sample sales dataset from the resources lesson, answer three business questions with pandas.

## Questions
1. Which region generated the most revenue last quarter?
2. Which product category is growing fastest month over month?
3. Are there any data quality issues a manager should know about?

## Submission
Summarise your findings in plain language and include the key code you used.`,
    rubric: ['Correct analysis', 'Data cleaning', 'Clear communication'] },
  { id: 'asg-ml', courseId: 'crs-ml', title: 'Train and evaluate a classifier', dueInDays: 10,
    instructions: `## Brief
Train two classification models on the provided churn dataset and compare them.

## Requirements
- Use a proper train/validation/test split.
- Report precision, recall and F1 for each model.
- Discuss one fairness consideration for deploying the model.`,
    rubric: ['Methodology', 'Evaluation', 'Responsible AI reflection'] },
  { id: 'asg-uiux', courseId: 'crs-uiux', title: 'Redesign a checkout flow', dueInDays: 8,
    instructions: `## Brief
Redesign the checkout flow for the fictional store "Northstar Outfitters".

## Deliverables
- Problem statement and two user insights
- Wireframes of the redesigned flow
- A short plan for a five-person usability test`,
    rubric: ['Research insight', 'Flow clarity', 'Visual hierarchy', 'Test plan'] },
  { id: 'asg-fullstack', courseId: 'crs-fullstack', title: 'Design a REST API for a bookstore', dueInDays: 12,
    instructions: `## Brief
Design the REST API for a small online bookstore.

## Requirements
- Resources for books, authors, carts and orders
- Endpoints with methods, request and response examples
- Pagination and error format conventions`,
    rubric: ['Resource modelling', 'Consistency', 'Error handling'] },
  { id: 'asg-cloud', courseId: 'crs-cloud', title: 'Architect a highly available web application', dueInDays: 9,
    instructions: `## Brief
Propose a vendor-neutral cloud architecture for a web application that must stay online if one zone fails.

## Include
- A diagram or written description of components
- Identity and access approach
- Estimated monthly cost drivers`,
    rubric: ['Availability design', 'Security', 'Cost awareness'] },
  { id: 'asg-cyber', courseId: 'crs-cyber', title: 'Write an incident response playbook', dueInDays: 7,
    instructions: `## Brief
Write a one-page playbook for responding to a suspected phishing compromise.

## Include
- Detection signals
- Containment steps
- Communication plan and post-incident review`,
    rubric: ['Completeness', 'Clarity', 'Practicality'] },
  { id: 'asg-pm', courseId: 'crs-pm', title: 'Create a project charter', dueInDays: -2,
    instructions: `## Brief
Write a project charter for launching an internal learning portal at a fictional company.

## Include
- Objectives and success criteria
- Scope (in and out)
- Key stakeholders, milestones and risks`,
    rubric: ['Clear objectives', 'Scope definition', 'Risk identification'] },
  { id: 'asg-qms', courseId: 'crs-qms', title: 'Draft a quality policy and process map', dueInDays: 14,
    instructions: `## Brief
For the fictional manufacturer "Corvid Components", draft a quality policy and map one core process.

## Include
- A quality policy of no more than 150 words
- Process inputs, outputs, owners and KPIs
- Two risks and how they will be addressed`,
    rubric: ['Alignment with ISO 9001 intent', 'Process clarity', 'Risk-based thinking'] },
  { id: 'asg-marketing', courseId: 'crs-digital-marketing', title: 'Build a 90-day campaign plan', dueInDays: 11,
    instructions: `## Brief
Plan a 90-day digital campaign for a fictional eco-friendly coffee brand.

## Include
- Target audience and positioning
- Channel mix and budget split
- KPIs and one experiment you will run`,
    rubric: ['Audience insight', 'Channel strategy', 'Measurement plan'] },
]

export function buildAssignments(now) {
  return SPECS.map(({ dueInDays, ...a }) => ({
    ...a,
    maxPoints: 100,
    allowResubmission: true,
    dueDate: new Date(now + dueInDays * DAY).toISOString(),
  }))
}
