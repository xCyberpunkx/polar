# Contributing to Polar

Thank you for considering contributing to Polar. This is an open-source mental health tool built for people with bipolar disorder. Every contribution — code, documentation, medical content review, translation, or bug report — matters.

## Before you start

Please read the [Code of Conduct](CODE_OF_CONDUCT.md). Mental health is a sensitive domain. We hold contributors to a high standard of empathy and care.

## What we need most

### 🩺 Medical content review
We are not clinicians. If you are a psychiatrist, psychologist, or mental health researcher, reviewing the `/src/lib/medical/knowledge-base.ts` content for accuracy is the highest-value contribution you can make.

### 🌍 Translations
Polar should be accessible in Arabic, French, Spanish, and other languages. The content in `/src/lib/medical/knowledge-base.ts` and all UI strings need translation.

### 🐛 Bug reports
Use the GitHub Issues tab. Include your OS, browser, and steps to reproduce.

### ✨ Features
Check the Issues tab for features marked `good first issue` or `help wanted`. Open an issue before starting work on a large feature.

## Development setup

```bash
# 1. Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/polar.git
cd polar

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in the required values (see README.md)

# 4. Set up database
npx prisma generate
npx prisma db push

# 5. Start dev server
npm run dev
```

## Pull Request process

1. Create a branch: `git checkout -b feat/your-feature-name`
2. Make your changes
3. Run `npx tsc --noEmit` to ensure no TypeScript errors
4. Run `npm run lint` to ensure no lint errors
5. Open a PR with a clear description of what you changed and why
6. Reference any related issues

## Medical content guidelines

When contributing to the medical knowledge base:
- Every claim must be traceable to a primary source (DSM-5, CANMAT, NICE, BAP, peer-reviewed publication)
- Include the source in the `sources` array of the article
- Do not make diagnostic claims or treatment recommendations directed at individual users
- Use language that is warm, direct, and destigmatizing
- Flag anything uncertain with a note for clinical review

## Code style

- TypeScript strict mode
- No `any` types without justification
- Components use inline styles with CSS variables (not Tailwind classes) for consistency with the design system
- Server components by default; client components only when necessary
- API routes must validate auth before any data access

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
