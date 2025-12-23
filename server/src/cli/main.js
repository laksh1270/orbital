#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import { Command } from "commander";

import { login, logout, whoami } from "./commands/auth/login.js";
import { wakeUp } from "./commands/ai/wakeUp.js";

async function main() {
  console.log(
    chalk.cyan(
      figlet.textSync("Orbit CLI", {
        font: "Standard",
        horizontalLayout: "default",
      })
    )
  );

  console.log(chalk.gray("A CLI based AI tool\n"));

  const program = new Command("orbit");

  program
    .name("orbit")
    .version("0.0.1")
    .description("Orbit CLI");

  program.addCommand(login);
  program.addCommand(logout);
  program.addCommand(whoami);
  program.addCommand(wakeUp);

  program.parse(process.argv);
}

main();
