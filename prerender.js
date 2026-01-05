
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');
const ROUTES = ['/', '/about', '/services', '/blog', '/careers', '/contact', '/gallery'];
const PORT = 4173; // Standard Vite preview port

async function serveDirectory(req, res) {
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

    // If no extension, assume it's a folder requesting index.html or a routed path -> serve root index.html
    if (!path.extname(filePath)) {
        // Check if it's a file request that exists (e.g. /assets/style.css)
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
            // serve file
        } else {
            // Fallback to SPA root for routes
            filePath = path.join(DIST_DIR, 'index.html');
        }
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                // Fallback to index.html for SPA routing on 404
                fs.readFile(path.join(DIST_DIR, 'index.html'), (err, fallbackContent) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(fallbackContent, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                res.end();
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

async function prerender() {
    console.log('🚀 Starting Prerender...');

    // 1. Start a local server with native http
    const server = http.createServer(serveDirectory);

    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`📡 Prerender server started on http://localhost:${PORT}`);

    try {
        // 2. Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: "new",
            // Use local Chrome on Windows to avoid download issues
            // On Linux/Docker, executablePath will be undefined, letting Puppeteer use its bundled version
            executablePath: process.platform === 'win32'
                ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                : undefined,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        for (const route of ROUTES) {
            console.log(`📄 Prerendering: ${route}`);

            const url = `http://localhost:${PORT}${route}`;
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

            // Add a small SEO marker
            await page.evaluate(() => {
                document.body.setAttribute('data-prerendered', 'true');
            });

            const content = await page.content();

            // Calculate output path
            // e.g., / -> dist/index.html
            // e.g., /about -> dist/about/index.html
            let outputPath = path.join(DIST_DIR, route === '/' ? 'index.html' : route);

            // Ensure path is a directory for index.html inside it/
            if (path.extname(outputPath) === '') {
                // It's a folder path
                if (!fs.existsSync(outputPath)) {
                    fs.mkdirSync(outputPath, { recursive: true });
                }
                outputPath = path.join(outputPath, 'index.html');
            }

            fs.writeFileSync(outputPath, content);
            console.log(`✅ Saved: ${outputPath}`);
        }

        await browser.close();
        console.log('✨ Prerendering complete!');

    } catch (error) {
        console.error('❌ Prerender failed:', error);
        process.exit(1);
    } finally {
        server.close();
        process.exit(0);
    }
}

prerender();
