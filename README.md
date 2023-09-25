# JLPT Audio SRS

Learn and review JLPT vocab by just listening.

An audio-based JLPT SRS web app built with [React](https://react.dev), [TypeScript](https://www.typescriptlang.org), [Next.js](https://nextjs.org), [TailwindCSS](https://tailwindcss.com), and [Zustand](https://github.com/pmndrs/zustand). Intialized with [create-t3-app](https://create.t3.gg).

The goal of this web app is to make reviewing JLPT vocab effortless - just listen while having this web app play in the background while you're doing other things like exercising.

## Features

- Autoplaying audio-based SRS (spaced-repetition system) categorized by JLPT levels
- Mark words as known to never see them again
- Reset words that are difficult to remember so you hear them more often
- View word review history
- Show or hide pitch accent for each word
- Configure SRS wait times
- View JLPT 1-5 word lists
- Works entirely offline (all HTTP responses are cached with service workers)
