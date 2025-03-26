import {} from "@identity/colors";
import Skygreen from "@identity/palettes/skygreen";
import Lemongreen from "@identity/palettes/lemongreen";
import Springgreen from "@identity/palettes/springgreen";

import Main from "@identity/palettes/main";
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
