# Kova — Smart Endurance Coach

<p align="center">
  <img src="./assets/images/iconAppWhite.png" width="120" alt="Kova Logo" />
</p>

<p align="center">
  <strong>AI-inspired endurance training app focused on consistency, performance, and adaptive coaching.</strong>
</p>

<p align="center">
  React Native • Expo • TypeScript • Zustand • AsyncStorage
</p>

---

# Overview

Kova is a mobile fitness application designed to act as a modern endurance coach for runners and hybrid athletes.

The app generates personalized weekly training plans based on:

* user goals
* fitness level
* available training days
* session duration
* training type
* current fitness state

Kova focuses on:

* consistency
* progressive overload
* realistic endurance planning
* recovery-aware training
* execution tracking
* habit building

Unlike traditional static training apps, Kova is evolving toward an adaptive coaching system capable of learning from athlete feedback and workout execution.

---

# Current Status

> MVP Functional — Pre-Beta Stage

Current implemented features:

* Personalized onboarding flow
* Dynamic weekly training plan generation
* Running-focused endurance logic
* Weekly goal tracking
* Workout execution system
* Workout status management
* Training streak tracking
* Workout detail screens
* Activity history
* Dynamic motivational insights
* Plan regeneration/editing
* Premium dark UI system
* Floating tab navigation
* Persistent local state

---

# Tech Stack

| Technology   | Purpose                    |
| ------------ | -------------------------- |
| React Native | Mobile framework           |
| Expo Router  | Navigation                 |
| TypeScript   | Type safety                |
| Zustand      | State management           |
| AsyncStorage | Local persistence          |
| Expo         | Native runtime             |
| Stitch MCP   | UI/Design reference system |

---

# Project Structure

```bash
app/
├── (tabs)/
├── login.tsx
├── register.tsx
├── workout-detail.tsx
├── edit-plan.tsx
└── _layout.tsx

src/
├── components/
│   ├── home/
│   ├── ui/
│   ├── workout/
│   └── profile/
│
├── constants/
│   └── theme.ts
│
├── services/
│   └── generatePlan.ts
│
├── store/
│   ├── onboarding-store.ts
│   └── home-store.ts
│
├── types/
│   └── training.ts
│
└── utils/
```

---

# Features

## Personalized Onboarding

Users configure:

* training goal
* experience level
* available days
* session duration
* training type
* target distance
* current fitness
* injury status

---

## Smart Weekly Plan Generation

Kova generates structured weekly sessions including:

* Easy Runs
* Tempo Runs
* Intervals / Series
* Fartlek
* Long Runs
* Mobility
* Recovery
* Functional Strength

The system considers:

* athlete level
* weekly load
* progression safety
* recovery balance
* session distribution

---

## Workout Execution System

Each workout now supports:

* pending
* completed
* skipped
* rescheduled (planned)

Athletes can:

* complete workouts
* skip sessions
* revert status
* review details
* track execution history

---

## Workout Feedback System

The foundation for adaptive coaching already exists.

Workouts support:

* RPE (Rate of Perceived Exertion)
* energy level
* pain reporting
* workout notes

This system will later power:

* adaptive recommendations
* fatigue management
* AI coaching
* training adjustments

---

## Dynamic Insights

Kova generates contextual motivational insights based on:

* completed workouts
* streaks
* skipped sessions
* progress state
* workout feedback

---

## Modern UI System

Current design system includes:

* premium dark theme
* floating navigation bar
* reusable UI components
* adaptive cards
* visual workout states
* metric-focused hierarchy

Inspired by:

* endurance apps
* modern fitness platforms
* performance dashboards

---

# Core Philosophy

Kova is not intended to be just a workout tracker.

The long-term vision is:

> an adaptive endurance coach that learns from athlete behavior and helps build sustainable consistency.

The app prioritizes:

* adherence
* recovery
* progression
* athlete awareness
* simplicity

---

# Running The Project

## Prerequisites

* Node.js >= 18
* npm or yarn
* Expo CLI
* iOS Simulator or Android Emulator

---

## Installation

```bash
git clone https://github.com/yourusername/kova.git

cd kova

npm install
```

---

## Start Development Server

```bash
npx expo start
```

---

## Run Type Checking

```bash
./node_modules/.bin/tsc --noEmit
```

---

## Run Lint

```bash
npm run lint
```

---

# Environment Variables

Example:

```env
STITCH_API_KEY=your_key_here
```

---

# Design System

Kova uses:

* centralized theme tokens
* reusable components
* dark-first UI strategy

Main theme configuration:

```bash
src/constants/theme.ts
```

---

# Future Roadmap

## Short Term

* Post-workout feedback UI
* Weekly rollover
* Historical weeks
* Workout rescheduling
* Better onboarding polish
* Beta testing

## Mid Term

* Adaptive workload logic
* AI-assisted recommendations
* Performance projections
* Recovery scoring
* Analytics & crash reporting

## Long Term

* AI endurance coach
* Strava/Garmin integration
* Cloud sync
* Premium subscription
* Team/coaching features

---

# Product Vision

Kova aims to become:

> a premium AI-powered endurance coaching platform focused on consistency and athlete progression.

---

# Contributing

This project is currently under active private development.

Future contribution guidelines will include:

* branching strategy
* coding standards
* testing conventions
* component architecture

---

# License

This project is currently proprietary.

All rights reserved.

---

# Author

**Isaias Castillo**

Frontend Developer & Product Builder

* Portfolio: TBD
* GitHub: [https://github.com/isaicastillo13](https://github.com/isaicastillo13)

---

# Final Notes

Kova is currently transitioning from:

> “visual training planner”

to:

> “adaptive endurance coaching platform”.

The next major milestone is transforming workout execution + athlete feedback into intelligent adaptive coaching.
