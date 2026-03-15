// src/plugin/index.ts
import plugin         from "tailwindcss/plugin";
import { lightTheme } from "./themes/light";
import { darkTheme }  from "./themes/dark";
import { baseStyles } from "./base";
import { buttonStyles }  from "./components/button";
import { badgeStyles }   from "./components/badge";
import { inputStyles }   from "./components/input";
import { cardStyles }    from "./components/card";
import { tableStyles }   from "./components/table";
import { sidebarStyles } from "./components/sidebar";
import { topbarStyles }  from "./components/topbar";

export const ronPlugin = plugin(function({ addBase, addComponents }) {
  addBase(lightTheme as any);
  addBase(darkTheme  as any);
  addBase(baseStyles as any);

  addComponents(buttonStyles  as any);
  addComponents(badgeStyles   as any);
  addComponents(inputStyles   as any);
  addComponents(cardStyles    as any);
  addComponents(tableStyles   as any);
  addComponents(sidebarStyles as any);
  addComponents(topbarStyles  as any);
});