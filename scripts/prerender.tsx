import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function prerender() {
  const distDir = path.resolve(__dirname, '../dist');
  const indexPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.error("❌ Error: index.html not found in dist. Make sure to run 'vite build' first!");
    process.exit(1);
  }

  console.log("🚀 Starting static pre-rendering process...");

  let htmlTemplate = fs.readFileSync(indexPath, 'utf-8');

  try {
    // Render the App to static HTML string
    console.log("📦 Rendering App component to static HTML...");
    const appHtml = renderToString(<App />);

    // Inject the pre-rendered shell into the <div id="root"></div> template
    const placeholder = '<div id="root"></div>';
    if (!htmlTemplate.includes(placeholder)) {
      throw new Error("Could not find '<div id=\"root\"></div>' placeholder in index.html");
    }

    const outputHtml = htmlTemplate.replace(
      placeholder,
      `<div id="root">${appHtml}</div>`
    );

    // Save the pre-rendered index.html
    fs.writeFileSync(indexPath, outputHtml, 'utf-8');
    console.log("✨ Successfully pre-rendered application into 'dist/index.html'!");
  } catch (error) {
    console.error("❌ Pre-rendering failed with error:", error);
    process.exit(1);
  }
}

prerender();
