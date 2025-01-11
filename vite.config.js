import { defineConfig } from "vite";

export default defineConfig({
    root: "./src",
    build: {
        outDir: "../dist", // Output directory for the built files
        rollupOptions: {
            input: {
                popup: "./popup/popup.html", // Entry point for the user-facing UI
                dev: "./dev/dev.html"        // Entry point for the development UI
            }
        }
    },
    server: {
        open: "/dev/dev.html",
        port: 3000
    }
});
