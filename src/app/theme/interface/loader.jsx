import {} from "./colors";

import palette_main from "./main";
import scrollbar from "./scrollsbar";

import { load_palette, load_scrollbar, init } from "@jeff-aporta/theme-manager";

load_palette(palette_main);
load_scrollbar(scrollbar);

init()

export default {status:"runned"};
