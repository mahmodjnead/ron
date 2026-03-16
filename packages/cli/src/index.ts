// src/index.ts
import { program } from "commander";
import pc from "picocolors";
import { initCommand } from "./commands/init";
import { syncCommand } from "./commands/sync";

const RON_ASCII = `
${pc.blue("  ██████╗  ██████╗ ███╗   ██╗")}
${pc.blue("  ██╔══██╗██╔═══██╗████╗  ██║")}
${pc.blue("  ██████╔╝██║   ██║██╔██╗ ██║")}
${pc.blue("  ██╔══██╗██║   ██║██║╚██╗██║")}
${pc.blue("  ██║  ██║╚██████╔╝██║ ╚████║")}
${pc.blue("  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝")}
  ${pc.dim("The Modern Headless Admin Framework")}
`;

program
  .name("ron")
  .description("Ron CLI — scaffold and manage your admin panel")
  .version("0.1.0")
  .hook("preAction", () => {
    console.log(RON_ASCII);
  });

// Register commands
program.addCommand(initCommand);
program.addCommand(syncCommand);

program.parse(process.argv);
