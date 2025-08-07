import { isNullish, nullish, findFirstTruthy } from "../start.js";

import { driverParams, subscribeParam } from "../themes/router/params.js";

import { started } from "../events/events.base.js";
import { Delayer } from "../tools/index.js";

import { firstUppercase } from "./tools.js";

export default function ({
  isArray,
  isNumber,
  isInteger,
  digits,
  min,
  max,
  isObject,
  isBoolean,
  isString,
  CONTEXT_GENERAL,
  mapCase,
  rest,
  get,
  update,
  set,
  saneoKey,
  extra_context,
  extra_context_global,
  links,
  value,
  _getValidate_,
  nameStorage,
  nameParam,
  noSet,
  _setValidate_,
  KEY,
  _willSet_,
  getValueDefault,
  getStringifyRequired,
  _validate_,
  THIS,
}) {
  const RETURN = {
    FROMFORM,
    ASSING,
    MAPCASE,
    POPARRAY,
    PUSHARRAY,
    ADDOBJECT,
    ADDARRAY,
    DELETEOBJECT,
    DELETEARRAY,
    EXTRA_CONTEXT,
    ADDLINK,
    REMOVELINK,
    SET_NULLISH,
    BURN_STORAGE,
    BURN_PARAM,
    UPDATE,
    EXISTS,
    INIT,
    filterFromType,
    smartVar,
    processPersistantString,
    notifyLinks,
    initValue,
    processObjectType,
    processArrayType,
    processStringType,
    processBooleanType,
    processNumberType,
    notIsObjectAnonimus,
  };

  return RETURN;

  function getValueDefault(newValue) {
    if (isNullish(newValue)) {
      newValue = get();
    }
    return newValue;
  }

  function getStringifyRequired(newValue) {
    if (isArray || isObject) {
      return JSON.stringify(newValue);
    }
    return newValue;
  }

  function findNotNullish(newValue) {
    return newValue.find((x) => !isNullish(smartVar(x)));
  }

  function inferStringData(val) {
    // Boolean
    if (val.toString() === "true") {
      return true;
    }
    if (val.toString() === "false") {
      return false;
    }

    // Number
    if (
      (!val.startsWith("0") || val.startsWith("0.")) &&
      val !== "" &&
      !isNaN(+val)
    ) {
      return +val;
    }

    // String (default)
    return val;
  }

  function FROMFORM() {
    return (idForm) => {
      const form = document.getElementById(idForm);
      if (!form) {
        return "Formulario no encontrado";
      }
      const formData = new FormData(form);

      const newData = structuredClone(get());

      function setDeep(obj, keys, val) {
        let cur = obj;
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          if (i === keys.length - 1) {
            cur[k] = inferStringData(val);
          } else {
            if (cur[k] == null || typeof cur[k] !== "object") {
              cur[k] = {};
            }
            cur = cur[k];
          }
        }
      }

      for (const [key, value] of formData.entries()) {
        let val = value;
        if (val == "on") {
          val = true;
        }
        const keys = key.split(".");
        setDeep(newData, keys, val);
      }

      set(newData);
    };
  }

  function ASSING() {
    return (newProps) => {
      const value = structuredClone(get());
      Object.assign(value, newProps);
      set(value);
    };
  }

  function MAPCASE() {
    return (key, value) => {
      if (!mapCase) {
        return "Define el mapCase";
      }
      if (!key) {
        return "Define el key";
      }
      if (!mapCase[key]) {
        return "El key no existe";
      }
      if (isNullish(value)) {
        value = get();
      }

      return case_functional() || case_keys();

      function findInKeysJoined(keyFind) {
        return Object.keys(mapCase[key]).find((x) =>
          x
            .split(",")
            .map((x) => x.trim())
            .includes(keyFind)
        );
      }

      function case_keys() {
        if (typeof mapCase[key] != "object") {
          return `mapCase[key] no es un objeto, key:${key}`;
        }
        const valueStr = String(value);
        let RETURN = mapCase[key][valueStr];
        if (isNullish(RETURN)) {
          RETURN =
            mapCase[key][
              findInKeysJoined(valueStr) || findInKeysJoined("default")
            ];
        }
        return smartVar(RETURN); // Siempre retorna
      }

      function case_functional() {
        if (typeof mapCase[key] == "function") {
          let RETURN = mapCase[key](value, CONTEXT_GENERAL());
          return smartVar(RETURN); // Sólo retorna si es función
        }
      }
    };
  }

  // Array methods

  function POPARRAY() {
    return () => {
      const arr = structuredClone(get());
      arr.pop();
      set(arr);
    };
  }

  function PUSHARRAY() {
    return (item) => {
      const arr = structuredClone(get());
      arr.push(item);
      set(arr);
    };
  }

  function ADDOBJECT() {
    return (key, item) => {
      const obj = structuredClone(get());
      obj[key] = item;
      set(obj);
    };
  }

  function ADDARRAY() {
    return (key, item) => {
      const arr = structuredClone(get());
      if (!arr) {
        return;
      }
      arr[key] = item;
      set(arr);
    };
  }

  function DELETEOBJECT() {
    return (key) => {
      const obj = structuredClone(get());
      delete obj[key];
      set(obj);
    };
  }

  function DELETEARRAY() {
    return (key) => {
      const arr = structuredClone(get());
      delete arr[key];
      set(arr);
    };
  }

  function EXTRA_CONTEXT() {
    const originalKeys = Object.keys(rest);
    originalKeys
      .map((x) => (x.endsWith(saneoKey) ? x : `${x}${saneoKey}`))
      .forEach((maskKey, i) => {
        const originalKey = originalKeys[i];
        const prop = rest[originalKey];
        const conserve_name = conserveName(originalKey);
        let name;
        let value;
        name = [maskKey, originalKey][+conserve_name];
        if (typeof prop == "function") {
          case_function();
        } else {
          case_variable();
        }

        function case_variable() {
          value = prop;
          if (conserve_name) {
            THIS[name] = value;
            extra_context[name] = value;
            extra_context_global[name] = value;
          } else {
            const saneoOriginalKey = firstUppercase(originalKey);
            const saneoName = firstUppercase(name);
            const getName = `get${saneoName}`;
            const setName = `set${saneoName}`;
            THIS[getName] = () => value;
            THIS[setName] = (newValue) => {
              value = newValue;
            };
            extra_context[`get${saneoOriginalKey}`] = THIS[getName];
            extra_context[`set${saneoOriginalKey}`] = THIS[setName];
          }
        }

        function case_function() {
          value = (props) => {
            const CONTEXT = CONTEXT_GENERAL();
            if (isNullish(props)) {
              return prop(CONTEXT);
            }
            return prop(props, CONTEXT);
          };
          THIS[name] = value;
          extra_context[originalKey] = value;
        }
      });

    function conserveName(key) {
      return (
        key == key.toUpperCase() || ["$", "_"].some((s) => key.startsWith(s))
      );
    }
  }

  function ADDLINK() {
    return (component) => {
      links.push(component);
      if (component.forceUpdate) {
        component.delayerUpdate = Delayer(1000 / 20);
      }
    };
  }

  function REMOVELINK() {
    return (component) => {
      links = links.filter((c) => c !== component);
    };
  }

  function SET_NULLISH() {
    return (...newValue) => {
      const notNullish = findNotNullish(newValue);
      if (isNullish(notNullish)) {
        return;
      }
      set(notNullish);
    };
  }

  function BURN_STORAGE() {
    return (newValue) => {
      if (!nameStorage) {
        return;
      }
      newValue = getValueDefault(newValue);
      newValue = getStringifyRequired(newValue);
      localStorage.setItem(nameStorage, newValue);
    };
  }

  function BURN_PARAM() {
    return (newValue) => {
      if (!nameParam) {
        return;
      }
      newValue = getValueDefault(newValue);
      newValue = getStringifyRequired(newValue);
      driverParams.set({ [nameParam]: newValue });
    };
  }

  function UPDATE() {
    const RETURN = [
      async () => {
        const component = get();
        if (component && component.forceUpdate) {
          if (component.delayerUpdate) {
            component.delayerUpdate.isReady(() => component.forceUpdate());
          } else {
            component.forceUpdate();
          }
        }
      },
      () => {
        update(CONTEXT_GENERAL());
      },
    ][+!!update];
    return RETURN;
  }

  function EXISTS() {
    return () => {
      let value = get();
      if (isNullish(value)) {
        return false;
      }
      return true;
    };
  }

  function INIT() {
    return (...inits) => {
      if (THIS[KEY.EXISTS]()) {
        return;
      }
      set(findNotNullish(inits), {
        burnParam: false,
        notifyLinks: false,
        force: true,
      });
    };
  }

  function filterFromType(
    newValue,
    {
      validateType, // get or set validation
      applyFilters = true,
    }
  ) {
    newValue = processPersistantString(newValue);
    newValue = filterNumber(newValue);
    newValue = filterArray(newValue);
    newValue = filterObject(newValue);
    newValue = filterBoolean(newValue);
    newValue = filterString(newValue);
    newValue = validateValue(newValue);
    return newValue;

    function validateValue(value) {
      if (_validate_ || validateType) {
        const CONTEXT = CONTEXT_GENERAL();
        if (_validate_) {
          value = _validate_(value, CONTEXT);
        }
        if (validateType) {
          value = validateType(value, CONTEXT);
        }
        value = value;
      }
      return value;
    }

    function filterString(newValue) {
      if (isString) {
        newValue = String(newValue);
      }
      return newValue;
    }

    function filterBoolean(newValue) {
      if (isBoolean) {
        newValue = Boolean(newValue);
      }
      return newValue;
    }

    function filterObject(newValue) {
      if (isObject) {
        if (!newValue || typeof newValue != "object") {
          return {};
        }
      }
      return newValue;
    }

    function filterArray(newValue) {
      if (isArray) {
        if (!Array.isArray(newValue)) {
          newValue = [newValue];
        }
        if (!newValue) {
          newValue = [];
        }
      }
      return newValue;
    }

    function filterNumber(newValue) {
      if (isNumber || isInteger) {
        if (!newValue) {
          newValue = 0;
        }
        if (isInteger) {
          newValue = parseInt(newValue);
        } else {
          newValue = +newValue;
          if (digits && applyFilters) {
            newValue = +newValue.toFixed(smartVar(digits));
          }
        }
        try {
          if (min && applyFilters) {
            const _min_ = smartVar(min);
            if (newValue < _min_) {
              newValue = _min_;
            }
          }
          if (max && applyFilters) {
            const _max_ = smartVar(max);
            if (newValue > _max_) {
              newValue = _max_;
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
      return newValue;
    }
  }

  function smartVar(value) {
    if (typeof value == "function") {
      return value(CONTEXT_GENERAL());
    }
    return value;
  }

  function processPersistantString(RETURN) {
    if (typeof RETURN == "string") {
      if (isNumber) {
        return +RETURN;
      }
      if (isBoolean) {
        return ["true", "1"].includes(RETURN.toLowerCase());
      }
      if (isArray || isObject) {
        try {
          return JSON.parse(RETURN);
        } catch (error) {
          console.error("Error al parsear el objeto", RETURN, error);
        }
      }
    }
    return RETURN;
  }

  async function notifyLinks({ oldValue, newValue } = {}) {
    links.forEach((component) => {
      if (!started()) {
        return;
      }
      if (component.forceUpdate) {
        if (component.delayerUpdate) {
          component.delayerUpdate.isReady(() => component.forceUpdate());
        } else {
          component.forceUpdate();
        }
      } else if (typeof component == "function") {
        component({ ...CONTEXT_GENERAL(), oldValue, newValue });
      } else {
        console.error("El enlace no es valido " + saneoKey, component);
      }
    });
  }

  function initValue() {
    if (nameStorage) {
      if (!value) {
        value = localStorage.getItem(nameStorage);
      }
    }
    if (nameParam) {
      if (!value) {
        value = driverParams.getOne(nameParam);
        if (nameStorage && value) {
          localStorage.setItem(nameStorage, value);
        }
      }
    }
  }

  function processObjectType() {
    if (isObject) {
      if (notIsObjectAnonimus(value)) {
        value = {};
      }
      THIS[KEY.ARRAY_ADD] = ADDOBJECT();
      THIS[KEY.DELETE] = DELETEOBJECT();
      THIS[KEY.ASSING] = ASSING();
      THIS[KEY.GET_KEYS] = () => Object.keys(get());
      THIS[KEY.GET_VALUES] = () => Object.values(get());
      THIS[KEY.ENTRIES] = () => Object.entries(get());
      THIS[KEY.IS_EMPTY] = () => Object.keys(get()).length == 0;
      THIS[KEY.FROM_FORM] = FROMFORM();
    }
  }

  function processArrayType() {
    if (isArray) {
      if (!Array.isArray(value)) {
        value = [];
      }
      THIS[KEY.ARRAY_ADD] = ADDARRAY();
      THIS[KEY.DELETE] = DELETEARRAY();
      THIS[KEY.ARRAY_PUSH] = PUSHARRAY();
      THIS[KEY.ARRAY_POP] = POPARRAY();
      THIS[KEY.ARRAY_REMOVEALL] = () => set([]);
      THIS[KEY.IS_EMPTY] = () => get().length == 0;
    }
  }

  function processStringType() {
    if (isString) {
      THIS[KEY.CHECK_EMAIL_RULE] = () => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(get());
      };
    }
  }

  function processBooleanType() {
    if (isBoolean) {
      if (typeof value != "boolean") {
        value = false;
      }
      THIS[KEY.IS_BOOLEAN] = get;
    }
  }

  function processNumberType() {
    if (isNumber) {
      if (typeof value != "number") {
        value = 0;
      }
      if (min || max) {
        if (min) {
          THIS[KEY.MIN] = () => smartVar(min);
        }
        if (max) {
          THIS[KEY.MAX] = () => smartVar(max);
        }
        THIS[KEY.CLAMP] = (v) => {
          if (isNullish(v)) {
            return v;
          }
          v = +v;
          if (min) {
            v = Math.max(v, THIS[KEY.MIN]());
          }
          if (max) {
            v = Math.min(v, THIS[KEY.MAX]());
          }
          return v;
        };
      }
      if (digits) {
        THIS[KEY.DIGITS] = () => smartVar(digits);
      }
    }
  }

  function notIsObjectAnonimus(obj) {
    if (!obj) {
      return true;
    }
    if (typeof obj != "object") {
      return true;
    }
    if (obj.constructor && obj.constructor.name != "Object") {
      return true;
    }
    return false;
  }
}
