/**
 * Lesson body content uses a small Markdown subset rendered by <Markdown />:
 * ## headings, paragraphs, - lists, 1. lists, ``` code fences, > callouts, **bold** and `code`.
 */
const HANDWRITTEN = {
  'What is React and why it matters': `## Why React exists
Interfaces change constantly: data arrives, people click, forms validate. Updating the page by hand quickly becomes fragile. **React lets you describe what the UI should look like for a given state**, and it works out the minimal changes needed to update the screen.

## Key ideas
- **Components** are reusable functions that return UI.
- **Props** pass data into a component, like function arguments.
- **State** is data a component remembers between renders.
- React re-renders a component when its state or props change.

## A first component
\`\`\`jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>
}
\`\`\`

> Think of a React app as a tree of components. Data flows down through props; events flow up through callbacks.

## Check your understanding
1. What is the difference between props and state?
2. Why is describing UI declaratively easier to maintain than manual DOM updates?`,

  'JSX in depth': `## JSX is JavaScript
JSX looks like HTML, but it compiles to function calls that create React elements. That means you can use any JavaScript expression inside curly braces.

\`\`\`jsx
const items = ['Plan', 'Build', 'Ship']
return (
  <ul className="steps">
    {items.map((item) => <li key={item}>{item}</li>)}
  </ul>
)
\`\`\`

## Rules worth remembering
- Return a **single root** element (or a fragment \`<>...</>\`).
- Use \`className\` instead of \`class\`, and \`htmlFor\` instead of \`for\`.
- Close every tag, including \`<img />\` and \`<input />\`.
- Attribute names are camelCase: \`onClick\`, \`tabIndex\`.

> Tip: Conditional rendering is just JavaScript — use \`&&\`, the ternary operator, or an early return.`,

  'Components and props': `## Composing interfaces
Components let you split the UI into independent pieces. A \`CourseCard\` doesn't need to know where its data came from — it simply renders the props it receives.

\`\`\`jsx
function CourseCard({ title, instructor, rating }) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{instructor} · {rating} ★</p>
    </article>
  )
}
\`\`\`

## Good component habits
- Keep components **small and focused** on one job.
- Name props after what they mean, not how they look.
- Treat props as **read-only** — never mutate them.
- Use the \`children\` prop to build flexible wrappers such as cards and modals.`,

  'State with useState': `## Remembering information
\`useState\` gives a component memory. It returns the current value and a setter function that schedules a re-render.

\`\`\`jsx
const [count, setCount] = useState(0)
return <button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</button>
\`\`\`

## Rules of state
- Call hooks at the **top level** of your component, never in loops or conditions.
- Use the **updater function** form when the next value depends on the previous one.
- Never mutate state directly — create new arrays and objects instead.

> State updates are asynchronous snapshots. Reading \`count\` right after \`setCount\` still gives you the old value for that render.`,

  'Why Python for data work': `## A language built for exploration
Python reads almost like plain English, has a huge ecosystem of data libraries, and runs everywhere — from laptops to cloud notebooks.

## The data toolkit
- **pandas** for tables (DataFrames), cleaning and aggregation.
- **NumPy** for fast numerical arrays.
- **Matplotlib / seaborn** for charts.
- **Jupyter** notebooks for mixing code, results and narrative.

\`\`\`python
import pandas as pd
sales = pd.read_csv("sales.csv")
sales.groupby("region")["revenue"].sum().sort_values(ascending=False)
\`\`\`

> By the end of this course you will be able to read a line like the one above and explain exactly what it does.`,

  'Series and DataFrames': `## Two core structures
A **Series** is a labelled one-dimensional array. A **DataFrame** is a table made of Series that share an index.

\`\`\`python
import pandas as pd
df = pd.DataFrame({
    "city": ["Lisbon", "Nairobi", "Osaka"],
    "orders": [128, 94, 151],
})
df["orders"].mean()   # 124.33
\`\`\`

## Everyday operations
- \`df.head()\` and \`df.info()\` to inspect structure.
- \`df[["city", "orders"]]\` to select columns.
- \`df[df["orders"] > 100]\` to filter rows.
- \`df.sort_values("orders")\` to sort.`,

  'The CIA triad': `## Three goals of security
- **Confidentiality** — only authorised people can read information.
- **Integrity** — information is accurate and has not been tampered with.
- **Availability** — systems and data are there when people need them.

## Applying the triad
Every control you implement supports one or more of these goals. Encryption protects confidentiality, hashing and signatures protect integrity, and redundancy protects availability.

> When assessing any security decision, ask: which part of the triad does this protect, and what does it cost the others?`,

  'What UX design is': `## Designing for people
User experience design is the practice of shaping how a product **works and feels** for the people using it. It spans research, structure, interaction, visual design and testing.

## UX vs. UI
- **UX** asks: does this solve the right problem in a way people understand?
- **UI** asks: is each screen clear, consistent and attractive?

## The UX process
1. Empathise — learn about users and their context.
2. Define — frame the problem worth solving.
3. Ideate — explore many possible solutions.
4. Prototype — make ideas tangible quickly.
5. Test — learn from real people and iterate.`,

  'What makes a project': `## Projects vs. operations
A **project** is a temporary effort to create a unique result. Operations are ongoing and repetitive. Recognising the difference helps you choose the right management approach.

## The triple constraint
Every project balances **scope**, **time** and **cost** — with **quality** at the centre. Changing one affects the others.

## Signs a project is well defined
- A clear objective and success criteria
- A named sponsor and project manager
- Agreed boundaries: what is in and out of scope
- A realistic timeline with milestones`,
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
Imagine a small team at a fictional company, Northstar Outfitters, tackling this topic for the first time. They start with the simplest version that works, review it together, and improve it in short iterations rather than aiming for perfection on day one.

## Try it yourself
Spend ten minutes applying today's idea to a small example from your own work or studies. Write down one question to bring to the course discussion.

> Tip: Use the Notes tab to capture what you learn — notes are saved in this browser.`
}
