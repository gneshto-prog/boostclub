#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { buildSite } from "./build-site.mjs";
import { checkBookingConfig } from "./check-booking-config.mjs";

if (process.env.CONTEXT === 'production') checkBookingConfig(process.env);

buildSite();
execFileSync(process.execPath, ["scripts/compare-parity.mjs"], { cwd: process.cwd(), stdio: "inherit" });
execFileSync(process.execPath, ["scripts/validate-site.mjs"], { cwd: process.cwd(), stdio: "inherit" });
execFileSync(process.execPath, ["scripts/validate-concepts.mjs"], { cwd: process.cwd(), stdio: "inherit" });
execFileSync(process.execPath, ["scripts/validate-soft-current.mjs"], { cwd: process.cwd(), stdio: "inherit" });
