import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
    root: "./src",  // Source folder
    build: {
        outDir: "../dist",  // Output folder
        rollupOptions: {
            input: {
                popup: __dirname + "/src/popup/popup.html",
                // dev: __dirname + "./dev/dev.html"
            }
        }
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: "../icons/*", // Path to your icons folder
                    dest: "icons" // Folder name in the dist directory
                },
                {
                    src: "model/*",
                    dest: "model"
                },
                {
                   src: "../manifest.json",
                   dest: ""
                }
            ]
        })
    ],
    server: {
        // open: "/dev/dev.html", // Default entry for dev server
        open: "/popup/popup.html", // Default entry for dev server
        port: 3000
    }
});
