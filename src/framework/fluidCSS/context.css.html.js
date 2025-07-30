import { base } from "./context.base.js";
import { diccionario, estructuras } from "./vars.js";

class layer_html extends base {
  constructor() {
    super();
    const _this_ = this;

    this.childs = {
      in(entity, props) {
        const operador = " " + entity.trim();
        const name = "childs";
        return _this_.serie(operador, name, props);
      },
      id(id, props) {
        const operador = "#" + id;
        const name = "childsid";
        return _this_.serie(operador, name, props);
      },
      firstLvl(entity, props) {
        const operador = " > " + entity.trim();
        const name = "childsfistlvl";
        return _this_.serie(operador, name, props);
      },
    };

    this.bros = {
      adjacent(entity, props) {
        const operador = " + " + entity.trim();
        const name = "childsadjacent";
        return _this_.serie(operador, name, props);
      },
      general(entity, props) {
        const operador = " ~ " + entity.trim();
        const name = "childsgeneral";
        return _this_.serie(operador, name, props);
      },
      checked(entity, props) {
        const operador = ":checked ~ " + entity.trim();
        const name = "childsgeneral";
        return _this_.serie(operador, name, props);
      },
    };
  }

  withTouchscreen(props) {
    return this.cursor(
      "(hover: none) and (pointer: coarse)",
      "touchscreen",
      props
    );
  }
  inDesktop(props) {
    return this.cursor(
      "(hover: hover) and (pointer: fine)",
      "desktop-cursor",
      props
    );
  }
  attr(...args) {
    if (args.length === 2) {
      const [exp, props] = args;
      return this.serie(`[${exp}]`, "hasattr", props);
    }
    if (args.length === 3) {
      const [attr, value, prop] = args;
      return this.serie(`[${attr}="${value}"]`, "hasattr", {
        [prop]: value,
      });
    }
    const [attr, op, value, prop] = args;
    return this.serie(`${attr}${op}="${value}"`, "hasattr", {
      [prop]: value,
    });
  }

  cursor(operador, name, props) {
    const struct = this.props2string(props, 0);
    const key = [struct, operador].join("-");
    const existe = diccionario[key];
    const mascara_cursor = Math.random()
      .toString(36)
      .replace("0.", name + "-");

    if (!existe) {
      diccionario[key] = mascara_cursor;
    }
    this.retorno.push(diccionario[key]);

    if (existe) {
      return this; // Ya existe la propiedad
    }

    estructuras[mascara_cursor] = `@media ${operador}{
       .${mascara_cursor} { 
         ${struct}
       }
    }`;

    return this;
  }
}

class layer_css extends layer_html {


  indeterminate(props) {
    return this.serie(":indeterminate", "indeterminate", props);
  }
  checked(props) {
    return this.serie(":checked", "checked", props);
  }
  hasChecked(props) {
    return this.serie(":has(:checked)", "haschecked", props);
  }
  main(props) {
    return this.serie("", "main", props);
  }
  hover(props) {
    return this.serie(":hover", "hover", props);
  }
  disabled(props, name = "disabled") {
    return this.serie(":disabled", name, props);
  }
  visited(props) {
    return this.serie(":visited", "visited", props);
  }
  link(props, name = "link") {
    return this.serie(":link", name, props);
  }
  empty(props, name = "empty") {
    return this.serie(":empty", name, props);
  }
  active(props, name = "active") {
    return this.serie(":active", name, props);
  }
  focusWithin(props, name = "focuswithin") {
    return this.serie(":focus-within", name, props);
  }
  focusVisible(props, name = "focusvisible") {
    return this.serie(":focus-visible", name, props);
  }
  inRange(props) {
    return this.serie(":in-range", "inrange", props);
  }
  outOfRange(props) {
    return this.serie(":out-of-range", "outofrange", props);
  }
  valid(props, name = "valid") {
    return this.serie(":valid", name, props);
  }
  invalid(props, name = "invalid") {
    return this.serie(":invalid", name, props);
  }
  focus(props) {
    return this.serie(":focus", "focus", props);
  }
  where(props) {
    return this.serie(":where", "where", props);
  }
  firstLine(props) {
    return this.serie("::first-line", "firstline", props);
  }
  firstLetter(props) {
    return this.serie("::first-letter", "firstletter", props);
  }
  textSelected(props) {
    // Alias
    return this.serie("::selection", "textselected", props);
  }
  selection(props, name = "selection") {
    return this.serie("::selection", name, props);
  }
  before(props) {
    return this.serie("::before", "before", props);
  }
  after(props) {
    return this.serie("::after", "after", props);
  }
  backdrop(props, name = "backdrop") {
    return this.serie("::backdrop", name, props);
  }
  marker(props) {
    return this.serie("::marker", "marker", props);
  }
  fileSelectorButton(props, name = "fileSelectorButton") {
    return this.serie("::file-selector-button", name, props);
  }
  placeholder(props) {
    return this.serie("::placeholder", "placeholder", props);
  }
  withnoText(props) {
    return this.serie(":placeholder-shown", "withnoText", props);
  }
  withText(props) {
    return this.serie(":not(:placeholder-shown)", "withText", props);
  }
  target(props, name = "target") {
    return this.serie(":target", name, props);
  }
  whenIsInFullscreen(props) {
    return this.serie(":fullscreen", "whenIsInFullscreen", props);
  }
  isReadOnly(props) {
    return this.serie(":read-only", "isReadOnly", props);
  }
  isEditable(props) {
    return this.serie(":read-write", "isEditable", props);
  }
  userInvalid(props, name = "userinvalid") {
    return this.serie(":user-invalid", name, props);
  }
  is(entity, props) {
    return this.serie(`:is(${entity})`, "is", props);
  }
  notIs(entity, props) {
    return this.serie(`:not(:is(${entity})`, "notis", props);
  }
  has(entity, props) {
    return this.serie(`:has(${entity})`, "has", props);
  }
  nthChild(index, props) {
    return this.serie(`:nth-child(${index})`, "nthchild", props);
  }
  nthLastChild(index, props) {
    return this.serie(`:nth-last-child(${index})`, "nthlastchild", props);
  }
  nthOfType(index, props) {
    return this.serie(`:nth-of-type(${index})`, "nthoftype", props);
  }
  nthLastOfType(index, props) {
    return this.serie(`:nth-last-of-type(${index})`, "nthlastoftype", props);
  }
}

export class layer_aliases extends layer_css {


  clickPressed(props) {
    // Alias
    return this.active(props, "clickpressed");
  }
  isDisabled(props) {
    // Alias
    return this.disabled(props, "isDisabled");
  }
  isEmpty(props) {
    // Alias
    return this.empty(props, "isEmpty");
  }
  unvisited(props) {
    // Alias
    return this.link(props, "unvisited");
  }
  somefocus(props) {
    // Alias
    return this.focusWithin(props, "somefocus");
  }
  drawfocus(props) {
    // Alias
    return this.focusVisible(props, "drawfocus");
  }
  whenIsvalid(props) {
    // Alias
    return this.valid(props, "whenIsValid");
  }
  whenIsInvalid(props) {
    // Alias
    return this.invalid(props, "whenIsInvalid");
  }
  isInputFile(props) {
    return this.fileSelectorButton(props, "inputFile");
  }
  whenConsultedInURL(props) {
    // Alias
    return this.target(props, "whenConsultedInURL");
  }
  incorrectlyLeave(props) {
    // Alias
    return this.userInvalid(props, "incorrectlyLeave");
  }
}
