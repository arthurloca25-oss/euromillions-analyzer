import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as euromillionService from "./euromillion-service.tsx";
import { scrapeJackpots } from "./scraper.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c84ef972/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all draws
app.get("/make-server-c84ef972/draws", async (c) => {
  try {
    const draws = await euromillionService.getDraws();
    return c.json({ draws, count: draws.length });
  } catch (error) {
    console.error("Error fetching draws:", error);
    return c.json({ error: "Failed to fetch draws" }, 500);
  }
});

// Get all jackpots
app.get("/make-server-c84ef972/jackpots", async (c) => {
  try {
    const jackpots = await euromillionService.getJackpots();
    return c.json({ jackpots, count: Object.keys(jackpots).length });
  } catch (error) {
    console.error("Error fetching jackpots:", error);
    return c.json({ error: "Failed to fetch jackpots" }, 500);
  }
});

// Get last update timestamp
app.get("/make-server-c84ef972/last-update", async (c) => {
  try {
    const lastUpdate = await euromillionService.getLastUpdate();
    return c.json({ lastUpdate });
  } catch (error) {
    console.error("Error fetching last update:", error);
    return c.json({ error: "Failed to fetch last update" }, 500);
  }
});

// Update jackpots (scrape new data)
app.post("/make-server-c84ef972/update-jackpots", async (c) => {
  try {
    console.log("Starting jackpots update...");
    const jackpots = await scrapeJackpots();
    await euromillionService.saveJackpots(jackpots);

    return c.json({
      success: true,
      message: "Jackpots updated successfully",
      count: Object.keys(jackpots).length
    });
  } catch (error) {
    console.error("Error updating jackpots:", error);
    return c.json({ error: `Failed to update jackpots: ${error}` }, 500);
  }
});

// Initialize data from existing files (one-time migration)
app.post("/make-server-c84ef972/initialize-data", async (c) => {
  try {
    const body = await c.req.json();
    const { draws, jackpots } = body;

    if (draws) {
      await euromillionService.saveDraws(draws);
      console.log(`Saved ${draws.length} draws`);
    }

    if (jackpots) {
      await euromillionService.saveJackpots(jackpots);
      console.log(`Saved ${Object.keys(jackpots).length} jackpots`);
    }

    return c.json({
      success: true,
      message: "Data initialized successfully",
      drawsCount: draws?.length || 0,
      jackpotsCount: Object.keys(jackpots || {}).length
    });
  } catch (error) {
    console.error("Error initializing data:", error);
    return c.json({ error: `Failed to initialize data: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);