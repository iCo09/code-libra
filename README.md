# 🏆 CodeLibra

A comprehensive web application for tracking, analyzing, and comparing LeetCode profiles and contest performance. Built with Next.js 16, TypeScript, and modern UI components.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)

## ✨ Features

### 🧑‍💻 User Profile Page
- **Comprehensive Profile Overview**
  - User avatar, name, username, and social links (GitHub, Twitter, LinkedIn, Website)
  - Country flag display
  - Active LeetCode badges with expandable view
  - Profile statistics at a glance

- **Performance Metrics**
  - Contest rating with badge level (Knight, Guardian)
  - Global ranking position
  - Total problems solved (Easy/Medium/Hard breakdown)
  - Contest participation count and top percentage
  - **Problem of the Day (POTD)** - Daily LeetCode question with difficulty-based color coding

- **Visual Analytics**
  - Circular progress chart showing difficulty distribution
  - Activity heatmap with year/month view and color themes (green, blue, purple, orange)
  - Contest rating history graph
  - Language statistics radar/bar chart
  - Active days and streak tracking

- **Interactive Elements**
  - Difficulty-coded problem links (Green: Easy, Yellow: Medium, Red: Hard)
  - Custom tooltips showing problem titles on hover
  - Expandable badge gallery (4 visible, expandable to all)
  - Compare and Share buttons

### 🎯 Profile Score System (0-1000 Points)

A comprehensive scoring algorithm that evaluates user performance across multiple dimensions:

#### Score Components

| Component | Max Points | Description |
|-----------|------------|-------------|
| **Problem Solving** | 400 | Difficulty-weighted problem count with logarithmic scaling |
| **Topic Coverage** | 200 | Breadth and balance across skill topics |
| **Contest Performance** | 200 | Contest rating and percentile rank |
| **Consistency & Activity** | 100 | Active days and streaks (last 90 days) |
| **Advanced Topics Mastery** | 100 | Depth in complex topics (DP, Graph, Trie, etc.) |

#### Rank Tiers

| Score Range | Rank Badge | Color |
|-------------|-----------|-------|
| 801-1000 | **Execute** | Gold |
| 601-800 | **Compile** | Orange |
| 401-600 | **Optimize** | Purple |
| 201-400 | **Loop** | Blue |
| 0-200 | **Init** | Gray |

#### Scoring Formulas

1. **Problem Solving (0-400)**
   ```
   rawScore = easy×1 + medium×3 + hard×7
   score = min(400, 400 × log(1 + rawScore) / log(1 + 10000))
   ```
   *Logarithmic scaling prevents gaming through spam solving*

2. **Topic Coverage (0-200)**
   ```
   coverageRatio = topicsWithAtLeast5Problems / totalTopics
   balanceFactor = clamp(1 - stdDeviation/maxDeviation, 0.6, 1)
   score = 200 × coverageRatio × balanceFactor
   ```
   *Balance factor penalizes excessive specialization*

3. **Contest Performance (0-200)**
   ```
   percentileRank = (totalParticipants - globalRanking) / totalParticipants
   normalizedRating = rating / 3500
   score = (0.6 × percentileRank + 0.4 × normalizedRating) × 200
   ```
   *Users without contests receive 60 points baseline*

4. **Consistency & Activity (0-100)**
   ```
   activeDaysScore = (activeDaysLast90 / 90) × 60
   streakScore = min((currentStreakDays / 7) × 5, 40)
   score = activeDaysScore + streakScore
   ```
   *Rewards regular coding practice*

5. **Advanced Topics Mastery (0-100)**
   ```
   qualifiedTopics = advancedTopicsWithAtLeast5Problems
   score = (qualifiedTopics / totalAdvancedTopics) × 100
   ```
   *Measures depth in complex algorithmic topics*

#### Example Score Breakdown
```
User Profile:
- 200 Easy, 150 Medium, 50 Hard problems
- 40/80 topics covered (≥5 problems each)
- Contest: 1800 rating, rank 5000/25000
- Activity: 60/90 days active, 8-week streak
- Advanced: 15/25 qualified topics

Score Calculation:
✓ Problem Solving: 305/400
✓ Topic Coverage: 90/200
✓ Contest Performance: 137/200
✓ Consistency: 80/100
✓ Advanced Topics: 60/100
━━━━━━━━━━━━━━━━━━━━━━━
Total Score: 672/1000 (Compile Rank)
```

#### Key Design Principles
- **Rewards Depth**: Logarithmic scaling favors quality over quantity
- **Encourages Balance**: Penalties for over-specialization
- **Fair Comparison**: Percentile-based contest scoring
- **Hard to Game**: Multiple independent metrics
- **Motivating**: Clear progression through rank tiers

### 🔄 Profile Comparison
- **Head-to-Head Analysis**
  - Side-by-side profile comparison
  - Dual username input with auto-submission
  - Compact profile cards with avatar, username, and rank

- **Comparison Metrics**
  - Contest rating comparison graphs
  - Activity heatmap comparison (side-by-side or overlay)
  - Problem-solving statistics comparison
  - Language proficiency comparison (radar/bar charts)
  - Skill-based bubble chart showing dominance in different topics
  - Badge comparison
  - Win/loss verdict cards

- **Visual Comparisons**
  - Synchronized color themes across charts
  - Interactive D3.js bubble charts for skill analysis
  - Recharts-based rating graphs
  - Side-by-side heatmap visualization

### 📊 Contest Questions
- **Contest Explorer**
  - Browse LeetCode contest questions
  - Searchable and filterable question table
  - Difficulty indicators
  - Direct links to LeetCode problems

### 🎯 Weekly Goals
- Set and track weekly problem-solving goals
- Monitor progress and maintain consistency

### 🌓 Dark/Light Mode
- Seamless theme switching
- Persistent theme preference
- Fully themed UI components

### 📱 Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React, Flag Icons
- **Charts**: Recharts, D3.js
- **Animations**: Framer Motion
- **Toast Notifications**: Sonner

### Key Libraries
- `next-themes` - Dark mode support
- `recharts` - Rating and statistics charts
- `d3` - Advanced visualizations (skill bubble charts)
- `flag-icons` - Country flags
- `class-variance-authority` - Component variants
- `tailwind-merge` - Utility class merging

## 📁 Project Structure

```
leetcode-contest-tracker/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── forgot-password/
│   ├── compare-profile/     # Profile comparison page
│   ├── contest-questions/   # Contest questions explorer
│   ├── user/[username]/     # Dynamic user profile pages
│   ├── weekly-goals/        # Weekly goal tracking
│   └── page.tsx            # Landing page
├── components/
│   ├── comparison/         # Comparison page components
│   │   ├── ActivityHeatmap.tsx
│   │   ├── BadgeComparison.tsx
│   │   ├── ContestGraph.tsx
│   │   ├── HeroComparison.tsx
│   │   ├── LanguageStats.tsx
│   │   ├── ProblemStats.tsx
│   │   ├── SkillComparison.tsx
│   │   └── VerdictCard.tsx
│   ├── profile/           # Profile page components
│   │   ├── ActivityFeed.tsx
│   │   ├── BadgesSection.tsx
│   │   ├── ProfileHeatmap.tsx
│   │   ├── ProfileSidebar.tsx
│   │   ├── RatingMiniGraph.tsx
│   │   └── SummaryCard.tsx
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   ├── ContestQuestionsTable.tsx
│   ├── Hero.tsx
│   ├── HeroHeader.tsx
│   ├── HeroVisual.tsx
│   └── Navbar.tsx
├── actions/               # Server actions for data fetching
│   ├── get-contest-questions.ts
│   ├── get-daily-question.ts
│   ├── get-user-badges.ts
│   ├── get-user-calendar.ts
│   ├── get-user-contest.ts
│   ├── get-user-language.ts
│   ├── get-user-profile.ts
│   ├── get-user-skills.ts
│   └── get-user-stats.ts
├── lib/                  # Utility functions
└── hooks/               # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/devlpr-nitish/code-libra.git
cd leetcode-contest-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_BACKEND_API_ENV=development
NEXT_PUBLIC_BACKEND_API_URL=your_api_url
NEXT_PUBLIC_BACKEND_CONTEST_QUESTIONS=your_contest_api_url
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## 🎨 UI Components

This project uses **shadcn/ui** components built on top of Radix UI:
- Avatar
- Badge
- Button
- Dialog
- Dropdown Menu
- Label
- Navigation Menu
- Popover
- Separator
- Switch
- Tabs
- Tooltip

## 📊 Key Features Breakdown

### Activity Heatmap
- GitHub-style contribution calendar
- Multiple color themes (green, blue, purple, orange)
- Yearly and monthly views
- Hover tooltips showing daily submissions
- Streak tracking

### Contest Rating Graph
- Historical rating progression
- Interactive hover labels
- Comparison mode for two users
- Responsive design

### Skill Bubble Chart
- D3.js force-directed layout
- Bubble size represents problem count
- Split-colored bubbles showing user dominance
- Organic packing algorithm

### Badge Gallery
- Expandable view (4 visible by default)
- Hover tooltips with badge name and date
- Smooth animations
- LeetCode badge integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Repository**: [github.com/devlpr-nitish/code-libra](https://github.com/devlpr-nitish/code-libra)
- **Live Demo**: [Coming Soon]

## 👨‍💻 Developer

Built by [Nitish Kumar](https://github.com/devlpr-nitish)

---

**Note**: This project requires a backend API to fetch LeetCode user data. Make sure to configure the API endpoints in your environment variables.
