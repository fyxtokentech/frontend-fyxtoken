import {} from "./colors";

import Main from "./main";
import scrollbar from "./scrollsbar";

import { packLoadPalette, load_scrollbar, init } from "@jeff-aporta/theme-manager";

const main = new Main(packLoadPalette);
packLoadPalette.color_register["main"] = main;
load_scrollbar(scrollbar);

init()

export default {status:"runned"};
