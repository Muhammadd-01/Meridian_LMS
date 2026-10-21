import { unsplash, DEMO_VIDEO_URL } from './images'
import { getLessonContent } from './lessonContent'
import { hashString } from '../utils/ids'

/**
 * Course catalogue seed. All courses, providers, ratings and enrolment numbers are
 * fictional and illustrative. Curricula are written as compact specs and expanded
 * into full module/lesson records by buildCourse() below.
 */
const COURSE_SPECS = [
  {
    id: 'crs-react', slug: 'complete-react-developer-program', title: 'Complete React.js Developer Program',
    shortDescription: 'Build production-ready React applications with hooks, routing, data fetching and testing.',
    description: 'This programme takes you from your first component to shipping a well-structured, accessible React application. You will learn how React thinks about UI as a function of state, how to compose components that stay readable as an app grows, and how to fetch, cache and share data without tangling your code. Every module ends with a small build that adds to a portfolio project you can show employers.',
    image: unsplash('photo-1633356122544-f134324a6cee'), categoryId: 'cat-development', instructorId: 'ins-elena',
    providerName: 'Larkspur Institute of Technology', difficulty: 'Intermediate', language: 'English', subtitles: ['English', 'Spanish', 'Arabic'],
    durationHours: 48, courseType: 'Professional Certificate', access: 'paid', priceLabel: '$49 · demo price',
    rating: 4.8, reviewCount: 12840, enrollmentCount: 186400, featured: true, trending: true, status: 'published',
    createdDaysAgo: 410, updatedDaysAgo: 9, quizId: 'quiz-react', assignmentId: 'asg-react',
    skills: ['React', 'JSX', 'Hooks', 'React Router', 'State Management', 'Testing'],
    learningOutcomes: ['Build reusable, composable React components', 'Manage local and shared state with hooks and context', 'Fetch and synchronise data with effects and custom hooks', 'Structure, test and deploy a production React application'],
    prerequisites: ['Comfort with modern JavaScript (ES6+)', 'Basic HTML and CSS'],
    tags: ['frontend', 'javascript', 'web development'],
    curriculum: [
      ['React Foundations', 'Understand what React is, set up a project and write your first components.', ['What is React and why it matters', 'Setting up a modern React project with Vite', 'JSX in depth', 'Components and props']],
      ['State and Interactivity', 'Make interfaces respond to people with state, events and forms.', ['State with useState', 'Handling events and forms', 'Lifting state up', 'Rendering lists and keys']],
      ['Effects and Data', 'Synchronise with the outside world and share data across your app.', ['Synchronising with useEffect', 'Fetching data the right way', 'Custom hooks', 'Context for shared state']],
      ['Routing and Architecture', 'Organise multi-page applications that stay maintainable.', ['Client-side routing with React Router', 'Structuring a scalable React app', 'Performance and memoisation']],
      ['Shipping to Production', 'Test, audit and deploy your application with confidence.', ['Testing React components', 'Accessibility checklist for React apps', 'Deploying your application']],
    ],
  },
  {
    id: 'crs-javascript', slug: 'javascript-fundamentals', title: 'JavaScript Fundamentals: From Zero to Confident',
    shortDescription: 'Learn the language of the web — variables, functions, arrays, objects, the DOM and async code.',
    description: 'A friendly, thorough introduction to JavaScript for complete beginners. You will write code from the very first lesson, understand how the language actually behaves, and finish by building an interactive browser app that fetches live data.',
    image: unsplash('photo-1517694712202-14dd9538aa97'), categoryId: 'cat-development', instructorId: 'ins-elena',
    providerName: 'Meridian Academy', difficulty: 'Beginner', language: 'English', subtitles: ['English', 'French'],
    durationHours: 24, courseType: 'Course', access: 'free', priceLabel: 'Free',
    rating: 4.7, reviewCount: 9420, enrollmentCount: 142800, featured: false, trending: true, status: 'published',
    createdDaysAgo: 520, updatedDaysAgo: 34, quizId: 'quiz-javascript', assignmentId: null,
    skills: ['JavaScript', 'DOM', 'Async Programming', 'Debugging'],
    learningOutcomes: ['Write clear JavaScript using modern syntax', 'Work confidently with arrays, objects and JSON', 'Manipulate the DOM and respond to events', 'Use promises and async/await to fetch data'],
    prerequisites: ['No prior programming experience required'],
    tags: ['javascript', 'programming', 'beginner'],
    curriculum: [
      ['Getting Started', 'How JavaScript runs and how to store values.', ['How JavaScript runs in the browser', 'Variables, types and values', 'Operators and expressions']],
      ['Control Flow and Functions', 'Make decisions, repeat work and package logic.', ['Conditionals and loops', 'Functions and scope', 'Arrow functions and closures']],
      ['Working with Data', 'Model real information with arrays and objects.', ['Arrays and array methods', 'Objects and destructuring', 'Working with JSON']],
      ['The Browser and Async', 'Build interactive pages that talk to the network.', ['The DOM and events', 'Promises and async/await', 'Error handling and debugging']],
    ],
  },
  {
    id: 'crs-fullstack', slug: 'full-stack-web-development', title: 'Full-Stack Web Development',
    shortDescription: 'Design, build and deploy complete web applications — from semantic HTML to Node.js APIs.',
    description: 'Learn how every layer of a modern web application fits together. You will build responsive interfaces, a React frontend, a Node.js API and a relational data model, then wire them up with authentication concepts and continuous integration before deploying a working project.',
    image: unsplash('photo-1498050108023-c5249f4df085'), categoryId: 'cat-development', instructorId: 'ins-elena',
    providerName: 'Larkspur Institute of Technology', difficulty: 'Intermediate', language: 'English', subtitles: ['English', 'Spanish'],
    durationHours: 60, courseType: 'Professional Certificate', access: 'paid', priceLabel: '$59 · demo price',
    rating: 4.7, reviewCount: 8710, enrollmentCount: 121300, featured: true, trending: false, status: 'published',
    createdDaysAgo: 365, updatedDaysAgo: 21, quizId: 'quiz-javascript', assignmentId: 'asg-fullstack',
    skills: ['HTML', 'CSS', 'React', 'Node.js', 'Express', 'SQL', 'REST APIs'],
    learningOutcomes: ['Build responsive, accessible page layouts', 'Create a React frontend that consumes a REST API', 'Design and implement a Node.js/Express backend', 'Model relational data and deploy a full-stack app'],
    prerequisites: ['Basic JavaScript knowledge', 'Familiarity with the command line is helpful'],
    tags: ['full stack', 'node', 'react', 'web development'],
    curriculum: [
      ['Web Foundations', 'The building blocks every web developer relies on.', ['How the web works', 'Semantic HTML and modern CSS', 'Responsive layouts']],
      ['Frontend with React', 'Component-driven interfaces that consume data.', ['Component-driven UIs', 'State management patterns', 'Consuming REST APIs']],
      ['Backend with Node.js', 'Serve data reliably with Express.', ['Building servers with Express', 'Designing RESTful endpoints', 'Validation and error handling']],
      ['Data and Auth', 'Persist information and understand identity.', ['Relational data modelling', 'Working with an ORM', 'Authentication concepts and sessions']],
      ['Deployment', 'Take your application live.', ['Environment configuration', 'Continuous integration basics', 'Shipping a full-stack app']],
    ],
  },
  {
    id: 'crs-node', slug: 'nodejs-rest-api-engineering', title: 'Node.js & REST API Engineering',
    shortDescription: 'Engineer fast, well-documented and observable REST APIs with Node.js.',
    description: 'Go beyond tutorials and learn how professional teams design, document and operate APIs. Covers the event loop, streams, API design conventions, OpenAPI documentation, caching, rate limiting and end-to-end testing.',
    image: unsplash('photo-1555066931-4365d14bab8c'), categoryId: 'cat-development', instructorId: 'ins-amara',
    providerName: 'Stratus Cloud Collective', difficulty: 'Advanced', language: 'English', subtitles: ['English'],
    durationHours: 30, courseType: 'Specialization', access: 'paid', priceLabel: '$39 · demo price',
    rating: 4.6, reviewCount: 3120, enrollmentCount: 54600, featured: false, trending: false, status: 'published',
    createdDaysAgo: 240, updatedDaysAgo: 40, quizId: 'quiz-javascript', assignmentId: null,
    skills: ['Node.js', 'API Design', 'OpenAPI', 'Observability', 'Testing'],
    learningOutcomes: ['Explain how the Node.js event loop schedules work', 'Design consistent, versioned REST APIs', 'Document APIs with OpenAPI', 'Add logging, caching and rate limiting to services'],
    prerequisites: ['Solid JavaScript skills', 'Some experience building web applications'],
    tags: ['backend', 'api', 'node'],
    curriculum: [
      ['Node.js Internals', 'Understand the runtime you build on.', ['The event loop explained', 'Modules and packages', 'Streams and buffers']],
      ['API Design', 'Conventions that make APIs a pleasure to use.', ['Resource modelling and REST conventions', 'Versioning and pagination', 'Documenting APIs with OpenAPI']],
      ['Reliability', 'Operate services with confidence.', ['Logging and observability', 'Rate limiting and caching', 'Testing APIs end to end']],
    ],
  },
  {
    id: 'crs-react-native', slug: 'mobile-apps-with-react-native', title: 'Mobile Apps with React Native',
    shortDescription: 'Use your React skills to build cross-platform mobile apps.',
    description: 'A work-in-progress course on building iOS and Android apps with React Native: navigation, device storage, media and publishing.',
    image: unsplash('photo-1512941937669-90a1b58e7e9c'), categoryId: 'cat-development', instructorId: 'ins-elena',
    providerName: 'Larkspur Institute of Technology', difficulty: 'Intermediate', language: 'English', subtitles: ['English'],
    durationHours: 32, courseType: 'Specialization', access: 'paid', priceLabel: '$45 · demo price',
    rating: 0, reviewCount: 0, enrollmentCount: 0, featured: false, trending: false, status: 'draft',
    createdDaysAgo: 18, updatedDaysAgo: 2, quizId: 'quiz-react', assignmentId: null,
    skills: ['React Native', 'Mobile Development', 'Navigation'],
    learningOutcomes: ['Build native mobile screens with React Native', 'Navigate between screens and persist data', 'Prepare an app for store submission'],
    prerequisites: ['Completion of a React course or equivalent experience'],
    tags: ['mobile', 'react'],
    curriculum: [
      ['Mobile Foundations', 'How React Native renders native views.', ['How React Native renders native views', 'Project setup and tooling', 'Core components']],
      ['Navigation and State', 'Multi-screen apps with persistent data.', ['Stack and tab navigation', 'Managing app state', 'Persisting data on device']],
      ['Native Features', 'Device capabilities and publishing.', ['Camera and media', 'Push notification concepts', 'Publishing to app stores']],
    ],
  },
  {
    id: 'crs-python', slug: 'python-for-data-analysis', title: 'Python for Data Analysis',
    shortDescription: 'Clean, explore and visualise data with Python, pandas and Jupyter notebooks.',
    description: 'Start from Python basics and progress to a complete exploratory analysis. You will clean messy real-world style datasets, summarise them with pandas, visualise patterns and write up findings that a manager can act on.',
    image: unsplash('photo-1526379095098-d400fd0bf935'), categoryId: 'cat-data-science', instructorId: 'ins-marcus',
    providerName: 'Harborline Data Lab', difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Spanish', 'Portuguese'],
    durationHours: 36, courseType: 'Professional Certificate', access: 'free', priceLabel: 'Free',
    rating: 4.8, reviewCount: 15230, enrollmentCount: 214500, featured: true, trending: true, status: 'published',
    createdDaysAgo: 480, updatedDaysAgo: 14, quizId: 'quiz-python', assignmentId: 'asg-python',
    skills: ['Python', 'pandas', 'Jupyter', 'Data Cleaning', 'Data Visualisation'],
    learningOutcomes: ['Write Python to load and transform tabular data', 'Clean missing, duplicated and inconsistent values', 'Summarise data with grouping and aggregation', 'Communicate findings with clear charts'],
    prerequisites: ['No prior programming experience required', 'Basic spreadsheet familiarity is helpful'],
    tags: ['python', 'data analysis', 'pandas'],
    curriculum: [
      ['Python Essentials', 'The Python you need for data work.', ['Why Python for data work', 'Variables, types and collections', 'Control flow and functions', 'Working in Jupyter notebooks']],
      ['Data Wrangling with pandas', 'Load, clean and reshape tabular data.', ['Series and DataFrames', 'Loading data from CSV and Excel', 'Cleaning messy data', 'Grouping and aggregation']],
      ['Exploratory Analysis', 'Find the story in your data.', ['Descriptive statistics', 'Visualising distributions', 'Finding relationships']],
      ['Communicating Results', 'Turn analysis into decisions.', ['Building clear charts', 'Writing an analysis summary', 'Capstone walkthrough']],
    ],
  },
  {
    id: 'crs-sql', slug: 'sql-for-data-analysts', title: 'SQL for Data Analysts',
    shortDescription: 'Query, join and aggregate relational data to answer real business questions.',
    description: 'SQL is the most-used language in analytics. This course teaches you to read and write queries confidently — from simple filters to joins, CTEs and window functions — using a fictional retail database.',
    image: unsplash('photo-1551288049-bebda4e38f71'), categoryId: 'cat-data-science', instructorId: 'ins-marcus',
    providerName: 'Harborline Data Lab', difficulty: 'Beginner', language: 'English', subtitles: ['English'],
    durationHours: 18, courseType: 'Course', access: 'free', priceLabel: 'Free',
    rating: 4.7, reviewCount: 6810, enrollmentCount: 98700, featured: false, trending: false, status: 'published',
    createdDaysAgo: 300, updatedDaysAgo: 60, quizId: 'quiz-data', assignmentId: null,
    skills: ['SQL', 'Joins', 'Window Functions', 'Reporting'],
    learningOutcomes: ['Write SELECT queries with filters and sorting', 'Combine tables with joins', 'Aggregate data with GROUP BY', 'Use CTEs and window functions for analysis'],
    prerequisites: ['None'],
    tags: ['sql', 'databases', 'analytics'],
    curriculum: [
      ['Querying Basics', 'Read data from a relational database.', ['Relational databases in plain language', 'SELECT, WHERE and ORDER BY', 'Filtering with conditions']],
      ['Combining Data', 'Bring tables together.', ['Joins explained visually', 'Aggregations with GROUP BY', 'Subqueries and CTEs']],
      ['Analytical SQL', 'Answer deeper questions.', ['Window functions', 'Date and time analysis', 'Building a reporting query']],
    ],
  },
  {
    id: 'crs-dataviz', slug: 'data-visualization-storytelling', title: 'Data Visualization & Storytelling',
    shortDescription: 'Design honest, persuasive charts and dashboards that drive decisions.',
    description: 'Learn the perceptual principles behind effective charts, how to choose the right visual for a question, and how to structure a data story for stakeholders.',
    image: unsplash('photo-1460925895917-afdab827c52f'), categoryId: 'cat-data-science', instructorId: 'ins-marcus',
    providerName: 'Harborline Data Lab', difficulty: 'Intermediate', language: 'English', subtitles: ['English', 'German'],
    durationHours: 16, courseType: 'Course', access: 'paid', priceLabel: '$29 · demo price',
    rating: 4.6, reviewCount: 2940, enrollmentCount: 41200, featured: false, trending: false, status: 'published',
    createdDaysAgo: 210, updatedDaysAgo: 45, quizId: 'quiz-data', assignmentId: null,
    skills: ['Data Visualisation', 'Dashboard Design', 'Storytelling', 'Accessibility'],
    learningOutcomes: ['Choose chart types that match analytical questions', 'Use colour accessibly and purposefully', 'Design dashboards that answer questions', 'Present a data story to stakeholders'],
    prerequisites: ['Basic experience working with data in spreadsheets or code'],
    tags: ['visualisation', 'dashboards', 'communication'],
    curriculum: [
      ['Principles', 'How people read visual information.', ['How people read charts', 'Choosing the right chart', 'Colour and accessibility']],
      ['Building Visuals', 'From chart to dashboard.', ['Dashboards that answer questions', 'Annotating insights', 'Avoiding misleading charts']],
      ['Storytelling', 'Make your insights land.', ['Structuring a data story', 'Presenting to stakeholders', 'Portfolio project']],
    ],
  },
  {
    id: 'crs-ml', slug: 'introduction-to-machine-learning', title: 'Introduction to Machine Learning',
    shortDescription: 'Understand, build and evaluate machine-learning models — responsibly.',
    description: 'A rigorous but approachable introduction to machine learning. You will learn the core supervised and unsupervised techniques, how to evaluate models honestly, and how to think about fairness and explainability before deploying anything.',
    image: unsplash('photo-1555949963-aa79dcee981c'), categoryId: 'cat-ai', instructorId: 'ins-priya',
    providerName: 'Larkspur Institute of Technology', difficulty: 'Intermediate', language: 'English', subtitles: ['English', 'Spanish', 'Hindi'],
    durationHours: 40, courseType: 'Specialization', access: 'paid', priceLabel: '$49 · demo price',
    rating: 4.9, reviewCount: 18960, enrollmentCount: 256300, featured: true, trending: true, status: 'published',
    createdDaysAgo: 450, updatedDaysAgo: 7, quizId: 'quiz-ml', assignmentId: 'asg-ml',
    skills: ['Machine Learning', 'scikit-learn', 'Model Evaluation', 'Feature Engineering', 'Responsible AI'],
    learningOutcomes: ['Frame business problems as ML problems', 'Train regression, classification and clustering models', 'Evaluate models with appropriate metrics', 'Identify and mitigate bias in ML systems'],
    prerequisites: ['Python basics', 'High-school level algebra and statistics'],
    tags: ['machine learning', 'ai', 'python'],
    curriculum: [
      ['Foundations of ML', 'What ML is and how projects are run.', ['What machine learning is (and isn\'t)', 'Types of learning problems', 'The ML workflow']],
      ['Supervised Learning', 'Predict outcomes from labelled data.', ['Linear and logistic regression', 'Decision trees and ensembles', 'Feature engineering']],
      ['Model Evaluation', 'Know when a model is actually good.', ['Train, validation and test splits', 'Metrics that matter', 'Overfitting and regularisation']],
      ['Unsupervised Learning', 'Discover structure without labels.', ['Clustering with k-means', 'Dimensionality reduction', 'Anomaly detection']],
      ['Responsible ML', 'Build systems people can trust.', ['Bias and fairness', 'Explaining model decisions', 'Deploying models responsibly']],
    ],
  },
  {
    id: 'crs-deep-learning', slug: 'deep-learning-foundations', title: 'Deep Learning Foundations',
    shortDescription: 'Neural networks, CNNs, sequence models and transformers from first principles.',
    description: 'Build intuition for how neural networks learn and how modern architectures work. Finish by fine-tuning a pre-trained model for an image classification task.',
    image: unsplash('photo-1620712943543-bcc4688e7485'), categoryId: 'cat-ai', instructorId: 'ins-priya',
    providerName: 'Larkspur Institute of Technology', difficulty: 'Advanced', language: 'English', subtitles: ['English'],
    durationHours: 44, courseType: 'Specialization', access: 'paid', priceLabel: '$59 · demo price',
    rating: 4.8, reviewCount: 7420, enrollmentCount: 88100, featured: false, trending: false, status: 'published',
    createdDaysAgo: 330, updatedDaysAgo: 28, quizId: 'quiz-ml', assignmentId: null,
    skills: ['Neural Networks', 'PyTorch', 'CNNs', 'Transformers', 'Transfer Learning'],
    learningOutcomes: ['Explain backpropagation and gradient descent', 'Build and train convolutional networks', 'Understand attention and transformer models', 'Apply transfer learning to new problems'],
    prerequisites: ['Introduction to Machine Learning or equivalent', 'Comfortable Python programming'],
    tags: ['deep learning', 'neural networks', 'ai'],
    curriculum: [
      ['Neural Networks', 'How networks learn.', ['Neurons, layers and activations', 'Backpropagation intuition', 'Training dynamics']],
      ['Architectures', 'The models behind modern AI.', ['Convolutional networks', 'Sequence models', 'Attention and transformers']],
      ['Practice', 'Apply deep learning to real tasks.', ['Transfer learning', 'Tuning and regularisation', 'Project: image classifier']],
    ],
  },
  {
    id: 'crs-genai', slug: 'generative-ai-for-professionals', title: 'Generative AI for Professionals',
    shortDescription: 'Use generative AI tools effectively, critically and responsibly at work.',
    description: 'A practical, non-technical course for professionals. Learn how large language models work at a high level, write prompts that get useful results, verify outputs, and draft a responsible-use policy for your team.',
    image: unsplash('photo-1677442136019-21780ecad995'), categoryId: 'cat-ai', instructorId: 'ins-priya',
    providerName: 'Meridian Academy', difficulty: 'Beginner', language: 'English', subtitles: ['English', 'French', 'Arabic'],
    durationHours: 10, courseType: 'Course', access: 'free', priceLabel: 'Free',
    rating: 4.7, reviewCount: 5680, enrollmentCount: 133900, featured: false, trending: true, status: 'published',
    createdDaysAgo: 12, updatedDaysAgo: 3, quizId: 'quiz-ml', assignmentId: null,
    skills: ['Prompt Writing', 'Generative AI', 'Critical Evaluation', 'AI Policy'],
    learningOutcomes: ['Describe how language models generate text', 'Write clear, context-rich prompts', 'Evaluate AI output for accuracy and bias', 'Draft a responsible AI usage guideline'],
    prerequisites: ['None'],
    tags: ['ai', 'productivity', 'llm'],
    curriculum: [
      ['Understanding Generative AI', 'What these tools are and are not.', ['How large language models work', 'Capabilities and limitations', 'Responsible use at work']],
      ['Prompting Well', 'Get useful, reliable results.', ['Writing clear instructions', 'Giving context and examples', 'Reviewing AI output critically']],
      ['Applying AI', 'Put AI to work on real tasks.', ['Drafting and summarising documents', 'Analysing information', 'Building an AI usage policy']],
    ],
  },
  {
    id: 'crs-pm', slug: 'project-management-fundamentals', title: 'Project Management Fundamentals',
    shortDescription: 'Plan, deliver and close projects on time with practical, people-centred methods.',
    description: 'Learn a complete, practical project management toolkit: defining scope, building schedules, managing risk, communicating status and closing projects well. Templates and examples are drawn from real delivery situations (with fictional organisations).',
    image: unsplash('photo-1454165804606-c3d57bc86b40'), categoryId: 'cat-business', instructorId: 'ins-sofia',
    providerName: 'Meridian Quality Management Professionals', difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Spanish', 'Arabic'],
    durationHours: 28, courseType: 'Professional Certificate', access: 'free', priceLabel: 'Free',
    rating: 4.8, reviewCount: 11240, enrollmentCount: 167200, featured: true, trending: false, status: 'published',
    createdDaysAgo: 600, updatedDaysAgo: 30, quizId: 'quiz-pm', assignmentId: 'asg-pm',
    skills: ['Project Planning', 'Risk Management', 'Stakeholder Management', 'Scheduling'],
    learningOutcomes: ['Define project scope and success criteria', 'Build a work breakdown structure and schedule', 'Identify, assess and respond to risks', 'Report status and close projects effectively'],
    prerequisites: ['None'],
    tags: ['project management', 'business', 'leadership'],
    curriculum: [
      ['Project Foundations', 'What a project is and who is involved.', ['What makes a project', 'The project lifecycle', 'Roles and stakeholders']],
      ['Planning', 'Turn goals into a realistic plan.', ['Defining scope', 'Work breakdown structures', 'Scheduling and estimating']],
      ['Execution and Control', 'Keep delivery on track.', ['Managing risk', 'Tracking progress', 'Communicating status']],
      ['Closing', 'Finish well and learn.', ['Quality reviews', 'Lessons learned', 'Project closure checklist']],
    ],
  },
  {
    id: 'crs-agile', slug: 'agile-and-scrum-in-practice', title: 'Agile & Scrum in Practice',
    shortDescription: 'Run effective sprints, refine backlogs and improve team flow.',
    description: 'Move past buzzwords to the day-to-day practice of agile delivery. Learn Scrum roles and events, backlog refinement, Kanban flow metrics and how to coordinate several teams.',
    image: unsplash('photo-1522071820081-009f0129c71c'), categoryId: 'cat-business', instructorId: 'ins-sofia',
    providerName: 'Meridian Quality Management Professionals', difficulty: 'Intermediate', language: 'English', subtitles: ['English'],
    durationHours: 14, courseType: 'Course', access: 'paid', priceLabel: '$29 · demo price',
    rating: 4.6, reviewCount: 3870, enrollmentCount: 62400, featured: false, trending: false, status: 'published',
    createdDaysAgo: 280, updatedDaysAgo: 50, quizId: 'quiz-pm', assignmentId: null,
    skills: ['Scrum', 'Kanban', 'Backlog Management', 'Facilitation'],
    learningOutcomes: ['Apply agile values to real decisions', 'Facilitate Scrum events effectively', 'Refine and prioritise a product backlog', 'Use flow metrics to improve delivery'],
    prerequisites: ['Some experience working in a team delivering projects'],
    tags: ['agile', 'scrum', 'delivery'],
    curriculum: [
      ['Agile Mindset', 'Values, principles and fit.', ['Agile values and principles', 'When agile fits (and when it doesn\'t)', 'Agile vs. predictive delivery']],
      ['Scrum Framework', 'Roles, events and artefacts in practice.', ['Roles, events and artefacts', 'Backlog refinement', 'Sprint planning and reviews']],
      ['Scaling Up', 'Flow and multi-team coordination.', ['Kanban and flow metrics', 'Coordinating multiple teams', 'Continuous improvement']],
    ],
  },
  {
    id: 'crs-qms', slug: 'quality-management-iso-9001-essentials', title: 'Quality Management Systems: ISO 9001 Essentials',
    shortDescription: 'Understand, implement and audit a quality management system aligned to ISO 9001.',
    description: 'A practical guide to quality management systems. Learn the process approach, risk-based thinking and the clauses of the standard, then practise internal auditing, corrective action and management review using fictional case-study organisations.',
    image: unsplash('photo-1504868584819-f8e8b4b6d7e3'), categoryId: 'cat-business', instructorId: 'ins-sofia',
    providerName: 'Meridian Quality Management Professionals', difficulty: 'Intermediate', language: 'English', subtitles: ['English', 'Arabic'],
    durationHours: 20, courseType: 'Professional Certificate', access: 'paid', priceLabel: '$69 · demo price',
    rating: 4.9, reviewCount: 4310, enrollmentCount: 58900, featured: true, trending: false, status: 'published',
    createdDaysAgo: 390, updatedDaysAgo: 16, quizId: 'quiz-pm', assignmentId: 'asg-qms',
    skills: ['ISO 9001', 'Internal Auditing', 'Process Improvement', 'Root Cause Analysis'],
    learningOutcomes: ['Explain the structure and intent of ISO 9001', 'Map processes and their interactions', 'Plan and conduct an internal audit', 'Lead corrective action using root cause analysis'],
    prerequisites: ['Some workplace experience with processes or operations'],
    tags: ['quality', 'iso 9001', 'auditing'],
    curriculum: [
      ['Quality Foundations', 'Core ideas behind quality management.', ['What quality really means', 'The process approach', 'Plan-Do-Check-Act']],
      ['The Standard', 'Key clauses and their intent.', ['Context of the organisation', 'Leadership and quality policy', 'Risk-based thinking']],
      ['Operations and Evaluation', 'Evidence, audits and reviews.', ['Documented information', 'Internal audits', 'Management review']],
      ['Improvement', 'Fix problems so they stay fixed.', ['Nonconformity and corrective action', 'Root cause analysis', 'Preparing for certification']],
    ],
  },
  {
    id: 'crs-it-support', slug: 'it-support-foundations', title: 'IT Support Foundations',
    shortDescription: 'Troubleshoot hardware, operating systems and networks like a help desk pro.',
    description: 'Prepare for an entry-level IT role. Learn how computers and networks work, follow a reliable troubleshooting method and communicate clearly with the people you support.',
    image: unsplash('photo-1531297484001-80022131f5a1'), categoryId: 'cat-it', instructorId: 'ins-amara',
    providerName: 'Stratus Cloud Collective', difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Spanish'],
    durationHours: 26, courseType: 'Professional Certificate', access: 'free', priceLabel: 'Free',
    rating: 4.7, reviewCount: 7650, enrollmentCount: 119400, featured: false, trending: false, status: 'published',
    createdDaysAgo: 540, updatedDaysAgo: 75, quizId: 'quiz-it', assignmentId: null,
    skills: ['Troubleshooting', 'Networking', 'Operating Systems', 'Customer Service'],
    learningOutcomes: ['Apply a structured troubleshooting process', 'Explain IP addressing and DNS', 'Run an effective help desk ticket workflow', 'Communicate technical issues clearly'],
    prerequisites: ['None'],
    tags: ['it', 'help desk', 'networking'],
    curriculum: [
      ['Computing Basics', 'Hardware, software and troubleshooting.', ['Inside a computer', 'Operating systems overview', 'Troubleshooting methodology']],
      ['Networking', 'How devices talk to each other.', ['How networks connect', 'IP addressing and DNS', 'Wi-Fi and connectivity issues']],
      ['Support Operations', 'Run a professional help desk.', ['Help desk best practices', 'Ticketing and documentation', 'Customer communication']],
    ],
  },
  {
    id: 'crs-linux', slug: 'linux-command-line-essentials', title: 'Linux Command Line Essentials',
    shortDescription: 'Navigate, automate and administer Linux systems from the terminal.',
    description: 'A hands-on guided project covering the shell, files and permissions, pipes, searching, scripting and basic administration.',
    image: unsplash('photo-1629654297299-c8506221ca97'), categoryId: 'cat-it', instructorId: 'ins-amara',
    providerName: 'Stratus Cloud Collective', difficulty: 'Beginner', language: 'English', subtitles: ['English'],
    durationHours: 12, courseType: 'Guided Project', access: 'free', priceLabel: 'Free',
    rating: 4.6, reviewCount: 3020, enrollmentCount: 47800, featured: false, trending: false, status: 'archived',
    createdDaysAgo: 700, updatedDaysAgo: 120, quizId: 'quiz-it', assignmentId: null,
    skills: ['Linux', 'Bash', 'Shell Scripting'],
    learningOutcomes: ['Navigate the Linux file system', 'Combine commands with pipes', 'Write simple shell scripts'],
    prerequisites: ['None'],
    tags: ['linux', 'command line'],
    curriculum: [
      ['The Shell', 'Find your way around.', ['Navigating the file system', 'Working with files', 'Permissions and ownership']],
      ['Productivity', 'Compose powerful commands.', ['Pipes and redirection', 'Searching with grep and find', 'Shell scripting basics']],
      ['Administration', 'Keep systems healthy.', ['Processes and services', 'Package management', 'Monitoring system resources']],
    ],
  },
  {
    id: 'crs-uiux', slug: 'ui-ux-design-fundamentals', title: 'UI/UX Design Fundamentals',
    shortDescription: 'Research, wireframe, design and test digital products people love to use.',
    description: 'Learn the full UX process — from empathy and research to information architecture, visual design and usability testing. You will redesign a fictional product end to end and build a case study for your portfolio.',
    image: unsplash('photo-1561070791-2526d30994b5'), categoryId: 'cat-design', instructorId: 'ins-jonas',
    providerName: 'Atelier Nine Design School', difficulty: 'Beginner', language: 'English', subtitles: ['English', 'French', 'Japanese'],
    durationHours: 30, courseType: 'Professional Certificate', access: 'free', priceLabel: 'Free',
    rating: 4.8, reviewCount: 10370, enrollmentCount: 158600, featured: true, trending: true, status: 'published',
    createdDaysAgo: 430, updatedDaysAgo: 11, quizId: 'quiz-uiux', assignmentId: 'asg-uiux',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Usability Testing'],
    learningOutcomes: ['Plan and run lightweight user research', 'Structure information and user flows', 'Apply typography, colour and layout principles', 'Test designs with users and iterate'],
    prerequisites: ['None — curiosity about how people use products'],
    tags: ['ux', 'ui', 'design'],
    curriculum: [
      ['Design Thinking', 'Start with people, not pixels.', ['What UX design is', 'Empathy and user research', 'Defining the problem']],
      ['Information Architecture', 'Organise content and flows.', ['User flows', 'Card sorting and navigation', 'Wireframing']],
      ['Visual Design', 'Make interfaces clear and attractive.', ['Typography and hierarchy', 'Colour, contrast and accessibility', 'Layout and spacing systems']],
      ['Testing and Iteration', 'Validate and improve.', ['Prototyping interactions', 'Usability testing', 'Iterating on feedback']],
    ],
  },
  {
    id: 'crs-design-systems', slug: 'building-scalable-design-systems', title: 'Building Scalable Design Systems',
    shortDescription: 'Create tokens, components and governance that scale across teams.',
    description: 'For designers and engineers who want consistency at scale. Learn design tokens, component anatomy, documentation and contribution models — and how to measure whether your system is working.',
    image: unsplash('photo-1586717791821-3f44a563fa4c'), categoryId: 'cat-design', instructorId: 'ins-jonas',
    providerName: 'Atelier Nine Design School', difficulty: 'Advanced', language: 'English', subtitles: ['English'],
    durationHours: 18, courseType: 'Specialization', access: 'paid', priceLabel: '$39 · demo price',
    rating: 4.7, reviewCount: 2160, enrollmentCount: 29800, featured: false, trending: false, status: 'published',
    createdDaysAgo: 160, updatedDaysAgo: 24, quizId: 'quiz-uiux', assignmentId: null,
    skills: ['Design Tokens', 'Component Design', 'Documentation', 'Governance'],
    learningOutcomes: ['Define a token architecture', 'Specify components with states and variants', 'Write documentation teams actually use', 'Govern and evolve a design system'],
    prerequisites: ['Experience designing or building user interfaces'],
    tags: ['design systems', 'ui', 'components'],
    curriculum: [
      ['Foundations', 'The why and the building blocks.', ['Why design systems', 'Design tokens', 'Component inventories']],
      ['Building Components', 'From anatomy to documentation.', ['Anatomy of a component', 'States and variants', 'Documentation that people read']],
      ['Governance', 'Keep the system alive.', ['Contribution models', 'Versioning and adoption', 'Measuring system health']],
    ],
  },
  {
    id: 'crs-digital-marketing', slug: 'digital-marketing-strategy', title: 'Digital Marketing Strategy',
    shortDescription: 'Plan multi-channel campaigns and measure what actually works.',
    description: 'Build a complete digital marketing strategy: audience research, positioning, channel selection, budgeting and measurement. You will finish with a 90-day campaign plan for a fictional brand.',
    image: unsplash('photo-1432888498266-38ffec3eaf0a'), categoryId: 'cat-marketing', instructorId: 'ins-ravi',
    providerName: 'Meridian Academy', difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Spanish'],
    durationHours: 22, courseType: 'Professional Certificate', access: 'free', priceLabel: 'Free',
    rating: 4.6, reviewCount: 5940, enrollmentCount: 102300, featured: false, trending: true, status: 'published',
    createdDaysAgo: 260, updatedDaysAgo: 19, quizId: null, assignmentId: 'asg-marketing',
    skills: ['Marketing Strategy', 'Audience Research', 'Analytics', 'Email Marketing'],
    learningOutcomes: ['Define target audiences and positioning', 'Select and plan marketing channels', 'Set measurable goals and KPIs', 'Design and evaluate marketing experiments'],
    prerequisites: ['None'],
    tags: ['marketing', 'strategy', 'analytics'],
    curriculum: [
      ['Strategy', 'Who you serve and why they should care.', ['Marketing fundamentals', 'Understanding your audience', 'Positioning and messaging']],
      ['Channels', 'Reach people where they are.', ['Search and social', 'Email marketing', 'Paid media basics']],
      ['Measurement', 'Know what is working.', ['Setting goals and KPIs', 'Analytics and attribution', 'Running experiments']],
    ],
  },
  {
    id: 'crs-seo', slug: 'seo-and-content-marketing', title: 'SEO & Content Marketing',
    shortDescription: 'Grow organic traffic with search-friendly content and solid technical foundations.',
    description: 'Understand how search engines discover and rank content, research keywords by intent, plan a content calendar and fix the technical issues that hold sites back.',
    image: unsplash('photo-1533750349088-cd871a92f312'), categoryId: 'cat-marketing', instructorId: 'ins-ravi',
    providerName: 'Meridian Academy', difficulty: 'Intermediate', language: 'English', subtitles: ['English'],
    durationHours: 14, courseType: 'Course', access: 'paid', priceLabel: '$25 · demo price',
    rating: 4.5, reviewCount: 1870, enrollmentCount: 33600, featured: false, trending: false, status: 'published',
    createdDaysAgo: 20, updatedDaysAgo: 4, quizId: null, assignmentId: null,
    skills: ['SEO', 'Keyword Research', 'Content Strategy', 'Technical SEO'],
    learningOutcomes: ['Research keywords by search intent', 'Plan and write search-friendly content', 'Diagnose common technical SEO issues'],
    prerequisites: ['Basic marketing knowledge'],
    tags: ['seo', 'content', 'marketing'],
    curriculum: [
      ['Search Fundamentals', 'How search works.', ['How search engines work', 'Keyword research', 'Search intent']],
      ['Content', 'Plan and create content that ranks.', ['Planning a content calendar', 'Writing for people and search', 'Measuring content performance']],
      ['Technical SEO', 'Remove technical barriers.', ['Site structure', 'Page speed and core web vitals', 'Structured data basics']],
    ],
  },
  {
    id: 'crs-communication', slug: 'effective-communication-at-work', title: 'Effective Communication at Work',
    shortDescription: 'Write, speak and listen with clarity and confidence.',
    description: 'Practical techniques for clearer writing, better meetings, constructive feedback and confident presentations — in the office and on remote teams.',
    image: unsplash('photo-1600880292203-757bb62b4baf'), categoryId: 'cat-personal', instructorId: 'ins-ravi',
    providerName: 'Meridian Academy', difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Spanish', 'French', 'Arabic'],
    durationHours: 8, courseType: 'Course', access: 'free', priceLabel: 'Free',
    rating: 4.7, reviewCount: 4410, enrollmentCount: 87200, featured: false, trending: false, status: 'published',
    createdDaysAgo: 190, updatedDaysAgo: 33, quizId: null, assignmentId: null,
    skills: ['Communication', 'Feedback', 'Presenting', 'Active Listening'],
    learningOutcomes: ['Write concise, actionable messages', 'Give and receive feedback constructively', 'Run focused meetings', 'Present ideas with confidence'],
    prerequisites: ['None'],
    tags: ['soft skills', 'communication', 'leadership'],
    curriculum: [
      ['Foundations', 'Listening and writing well.', ['Listening actively', 'Clear and concise writing', 'Choosing the right channel']],
      ['Conversations', 'Navigate everyday and difficult conversations.', ['Giving and receiving feedback', 'Difficult conversations', 'Running effective meetings']],
      ['Presence', 'Influence with confidence.', ['Presenting with confidence', 'Storytelling for influence', 'Building trust remotely']],
    ],
  },
  {
    id: 'crs-cyber', slug: 'cybersecurity-foundations', title: 'Cybersecurity Foundations',
    shortDescription: 'Learn to protect systems, detect threats and respond to incidents.',
    description: 'Start a career in security with a strong foundation: core principles, network defence, monitoring and incident response. Labs use simulated environments and fictional organisations.',
    image: unsplash('photo-1550751827-4bd374c3f58b'), categoryId: 'cat-cyber', instructorId: 'ins-daniel',
    providerName: 'Bastion Security Academy', difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Spanish', 'Arabic'],
    durationHours: 32, courseType: 'Professional Certificate', access: 'free', priceLabel: 'Free',
    rating: 4.7, reviewCount: 9860, enrollmentCount: 149700, featured: true, trending: true, status: 'published',
    createdDaysAgo: 470, updatedDaysAgo: 13, quizId: 'quiz-security', assignmentId: 'asg-cyber',
    skills: ['Security Fundamentals', 'Network Security', 'SIEM', 'Incident Response'],
    learningOutcomes: ['Explain confidentiality, integrity and availability', 'Secure networks and system configurations', 'Monitor logs to detect common attacks', 'Follow an incident response lifecycle'],
    prerequisites: ['Basic computer literacy'],
    tags: ['security', 'cyber', 'networking'],
    curriculum: [
      ['Security Principles', 'How security professionals think.', ['The CIA triad', 'Threats, vulnerabilities and risk', 'Security frameworks overview']],
      ['Defending Networks', 'Reduce the attack surface.', ['Network security basics', 'Firewalls and segmentation', 'Secure configuration']],
      ['Security Operations', 'Detect and manage threats.', ['Logs and monitoring', 'Detecting common attacks', 'Vulnerability management']],
      ['Incident Response', 'Respond calmly and effectively.', ['The incident response lifecycle', 'Communication during incidents', 'Post-incident reviews']],
    ],
  },
  {
    id: 'crs-incident-response', slug: 'security-operations-incident-response', title: 'Security Operations & Incident Response',
    shortDescription: 'Triage alerts, investigate intrusions and lead response like a SOC analyst.',
    description: 'An advanced, scenario-driven course on working in a security operations centre: triage, threat intelligence, investigation, containment and executive reporting.',
    image: unsplash('photo-1563986768609-322da13575f3'), categoryId: 'cat-cyber', instructorId: 'ins-daniel',
    providerName: 'Bastion Security Academy', difficulty: 'Advanced', language: 'English', subtitles: ['English'],
    durationHours: 24, courseType: 'Specialization', access: 'paid', priceLabel: '$55 · demo price',
    rating: 4.6, reviewCount: 1640, enrollmentCount: 21900, featured: false, trending: false, status: 'published',
    createdDaysAgo: 140, updatedDaysAgo: 22, quizId: 'quiz-security', assignmentId: null,
    skills: ['Alert Triage', 'Threat Intelligence', 'Digital Forensics', 'Incident Management'],
    learningOutcomes: ['Prioritise and triage security alerts', 'Collect and analyse evidence', 'Contain and recover from incidents', 'Report incidents to leadership'],
    prerequisites: ['Cybersecurity Foundations or equivalent experience'],
    tags: ['soc', 'incident response', 'security'],
    curriculum: [
      ['SOC Fundamentals', 'Inside the security operations centre.', ['Inside a security operations centre', 'Alert triage', 'Threat intelligence']],
      ['Investigation', 'Build the timeline of an incident.', ['Evidence collection', 'Analysing malware behaviour', 'Timeline reconstruction']],
      ['Response', 'Contain, recover and report.', ['Containment strategies', 'Eradication and recovery', 'Reporting to leadership']],
    ],
  },
  {
    id: 'crs-cloud', slug: 'cloud-computing-essentials', title: 'Cloud Computing Essentials',
    shortDescription: 'Understand cloud services, architecture and costs — vendor-neutral and practical.',
    description: 'A vendor-neutral introduction to cloud computing. Learn service and deployment models, core compute, storage and networking services, identity, cost management and how to design for reliability.',
    image: unsplash('photo-1451187580459-43490279c0fa'), categoryId: 'cat-cloud', instructorId: 'ins-amara',
    providerName: 'Stratus Cloud Collective', difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Spanish', 'Portuguese'],
    durationHours: 20, courseType: 'Course', access: 'free', priceLabel: 'Free',
    rating: 4.7, reviewCount: 8230, enrollmentCount: 131500, featured: true, trending: false, status: 'published',
    createdDaysAgo: 400, updatedDaysAgo: 26, quizId: 'quiz-it', assignmentId: 'asg-cloud',
    skills: ['Cloud Architecture', 'IAM', 'Cost Management', 'Reliability'],
    learningOutcomes: ['Compare IaaS, PaaS and SaaS', 'Choose compute, storage and database services', 'Apply identity and access best practices', 'Design for availability and cost'],
    prerequisites: ['Basic IT knowledge'],
    tags: ['cloud', 'architecture', 'infrastructure'],
    curriculum: [
      ['Cloud Concepts', 'Models and responsibilities.', ['What the cloud is', 'Service and deployment models', 'Shared responsibility']],
      ['Core Services', 'The building blocks of cloud solutions.', ['Compute options', 'Storage and databases', 'Networking in the cloud']],
      ['Operating in the Cloud', 'Secure, efficient and reliable.', ['Identity and access management', 'Cost management', 'Designing for reliability']],
    ],
  },
  {
    id: 'crs-devops', slug: 'devops-with-docker-and-kubernetes', title: 'DevOps with Docker & Kubernetes',
    shortDescription: 'Containerise applications and run them reliably with Kubernetes and CI/CD.',
    description: 'Learn modern delivery practices end to end: build container images, orchestrate them with Kubernetes, automate pipelines and roll out releases safely with good observability.',
    image: unsplash('photo-1558494949-ef010cbdcc31'), categoryId: 'cat-cloud', instructorId: 'ins-amara',
    providerName: 'Stratus Cloud Collective', difficulty: 'Intermediate', language: 'English', subtitles: ['English'],
    durationHours: 34, courseType: 'Specialization', access: 'paid', priceLabel: '$49 · demo price',
    rating: 4.8, reviewCount: 3980, enrollmentCount: 57300, featured: false, trending: true, status: 'published',
    createdDaysAgo: 5, updatedDaysAgo: 1, quizId: 'quiz-it', assignmentId: null,
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Observability'],
    learningOutcomes: ['Build and optimise Docker images', 'Deploy workloads to Kubernetes', 'Automate builds with CI/CD pipelines', 'Release safely with progressive strategies'],
    prerequisites: ['Linux command line basics', 'Some application development experience'],
    tags: ['devops', 'containers', 'kubernetes'],
    curriculum: [
      ['Containers', 'Package applications consistently.', ['Why containers', 'Building Docker images', 'Docker Compose for local development']],
      ['Kubernetes', 'Orchestrate containers at scale.', ['Kubernetes architecture', 'Deployments and services', 'Configuration and secrets']],
      ['Delivery', 'Ship continuously and safely.', ['CI/CD pipelines', 'Observability', 'Release strategies']],
    ],
  },
]

const TYPE_PATTERN = ['video', 'article', 'video', 'reading']
const DAY = 24 * 60 * 60 * 1000

function lessonDuration(type, seed) {
  const h = hashString(seed)
  switch (type) {
    case 'video': return 6 + (h % 13)
    case 'article': return 8 + (h % 7)
    case 'reading': return 12 + (h % 9)
    case 'quiz': return 20
    case 'assignment': return 60
    default: return 5
  }
}

function lessonDescription(type, title) {
  const map = {
    video: `Video walkthrough: ${title}.`,
    article: `Short article explaining ${title.toLowerCase()} with examples.`,
    reading: `Guided reading on ${title.toLowerCase()} with key takeaways.`,
    quiz: 'Check your understanding with a short graded quiz.',
    assignment: 'Apply what you have learned in a practical assignment.',
    resource: 'Downloadable references and templates for this course.',
  }
  return map[type] || title
}

/** Expands a compact course spec into a full course record with modules and lessons. */
export function buildCourse(spec, now) {
  const { curriculum, createdDaysAgo, updatedDaysAgo, image, ...rest } = spec
  const modules = curriculum.map(([title, description, lessonTitles], mi) => {
    const moduleId = `${spec.id}-m${mi + 1}`
    const lessons = lessonTitles.map((lessonTitle, li) => {
      const type = TYPE_PATTERN[li % TYPE_PATTERN.length]
      const id = `${moduleId}-l${li + 1}`
      return {
        id,
        title: lessonTitle,
        type,
        description: lessonDescription(type, lessonTitle),
        durationMinutes: lessonDuration(type, id),
        content: getLessonContent(lessonTitle, spec),
        videoUrl: type === 'video' ? DEMO_VIDEO_URL : '',
        isPreview: li === 0 && mi < 2,
        required: true,
        order: li + 1,
      }
    })
    return { id: moduleId, title, description, order: mi + 1, lessons }
  })

  const last = modules[modules.length - 1]
  const extras = []
  if (spec.quizId) extras.push({ type: 'quiz', title: 'Course knowledge check', quizId: spec.quizId })
  if (spec.assignmentId) extras.push({ type: 'assignment', title: 'Applied assignment', assignmentId: spec.assignmentId })
  extras.push({ type: 'resource', title: 'Course resources and templates', required: false })
  extras.forEach((extra) => {
    const order = last.lessons.length + 1
    const id = `${last.id}-l${order}`
    last.lessons.push({
      id,
      title: extra.title,
      type: extra.type,
      description: lessonDescription(extra.type, extra.title),
      durationMinutes: lessonDuration(extra.type, id),
      content: extra.type === 'resource'
        ? 'Download the course syllabus generated from this curriculum, or browse the sample templates listed below. Items marked “Demo resource” are illustrative and are not included in this frontend demo.'
        : '',
      videoUrl: '',
      quizId: extra.quizId || null,
      assignmentId: extra.assignmentId || null,
      isPreview: false,
      required: extra.required ?? true,
      order,
    })
  })

  return {
    ...rest,
    thumbnail: image,
    createdAt: new Date(now - createdDaysAgo * DAY).toISOString(),
    updatedAt: new Date(now - updatedDaysAgo * DAY).toISOString(),
    modules,
  }
}

export function buildCourses(now) {
  return COURSE_SPECS.map((spec) => buildCourse(spec, now))
}

export const COURSE_TYPES = ['Course', 'Specialization', 'Professional Certificate', 'Guided Project']
export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']
export const LESSON_TYPES = ['video', 'article', 'reading', 'quiz', 'assignment', 'resource']
