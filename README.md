# Jay Bhavani Furniture (JBF) Official Website

Welcome to the official repository for the Jay Bhavani Furniture website, hosted at [jaybhavanifurniture.github.io](https://jaybhavanifurniture.github.io).

## Tech Stack

This project is built using a modern, lightweight, and extremely fast web stack:
- **[Astro](https://astro.build/)** - Static Site Generator
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **TypeScript** - For type-safe development
- **[Astro Icon](https://github.com/natemoo-re/astro-icon)** - For SVG icons (using Tabler icons)
- **GitHub Actions** - For automated CI/CD deployment

## Local Development

To run this project locally, make sure you have Node.js installed, then follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/jaybhavanifurniture/jaybhavanifurniture.github.io.git
cd jaybhavanifurniture.github.io

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The site will now be running locally at `http://localhost:4321`.

## Project Structure

Inside the project, you'll see the following key folders and files:

```text
/
├── public/                 # Static assets (images, favicons, robots.txt)
├── src/
│   ├── components/         # Reusable Astro UI components (Hero, Footer, CTA)
│   ├── data/               # JSON files (showroom data, hours, contact info)
│   ├── layouts/            # Base HTML layout wrapping pages
│   ├── pages/              # Routing: every .astro file here becomes a page
│   └── styles/             # Global CSS and Tailwind v4 theme configuration
├── .github/workflows/      # Contains deploy.yml for GitHub Pages automation
├── astro.config.mjs        # Astro configuration file
└── package.json            # Project dependencies and scripts
```

## Updating Business Data

If business hours, phone numbers, or social media links change, you do not need to hunt through the code. Simply edit the `src/data/showroom.json` file. All components and SEO metadata pull directly from this single source of truth.

## Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions. 

Any time a commit is pushed to the `main` branch, the `.github/workflows/deploy.yml` action will trigger, build the static Astro files, and publish them to the live website within 1-2 minutes.
