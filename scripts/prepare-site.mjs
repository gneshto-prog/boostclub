#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { buildSite } from "./build-site.mjs";

buildSite();
execFileSync(process.execPath, ["scripts/compare-parity.mjs"], { cwd: process.cwd(), stdio: "inherit" });
execFileSync(process.execPath, ["scripts/validate-site.mjs"], { cwd: process.cwd(), stdio: "inherit" });
