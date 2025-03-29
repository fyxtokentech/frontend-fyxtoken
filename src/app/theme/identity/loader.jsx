import {} from "@identity/colors";
import {Main, Skygreen, Lemongreen, Springgreen} from "@identity/palettes/Fyxpalettes";
import scrollbar from "@identity/scrollsbar";

import { packLoadPalette, load_scrollbar, init } from "@jeff-aporta/theme-manager";

const main = new Main(packLoadPalette);
packLoadPalette.color_register["main"] = main;

const skygreen = new Skygreen(packLoadPalette);
packLoadPalette.color_register["skygreen"] = skygreen;

const lemongreen = new Lemongreen(packLoadPalette);
packLoadPalette.color_register["lemongreen"] = lemongreen;

const springgreen = new Springgreen(packLoadPalette);
packLoadPalette.color_register["springgreen"] = springgreen;

load_scrollbar(scrollbar);

init()

export default {status:"runned"};
