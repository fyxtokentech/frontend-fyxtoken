import { isNullish, nullish, findFirstTruthy } from "../start.js";
import { driverParams, subscribeParam } from "../themes/router/params.js";

import { firstUppercase } from "./tools.js";

import { started } from "../events/events.base.js";
import { Delayer } from "../tools/index.js";

const allDrivers = { noId: [] };

export function inferStringData(val) {
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

export function DriverComponent(modelProps) {
  const { idDriver, ...modelRest } = modelProps;
  const RETURN = new (class {
    constructor() {
      const listSetups = [];
      const extra_context_global = {};
      const listBurnParams = [];
      this.burnParams = () => {
        listBurnParams.forEach((burnParam) => {
          burnParam();
        });
      };
      Object.entries(modelRest).forEach(([key, props]) => {
        const saneoKey = firstUppercase(key);
        let links = [];
        const extra_context = {};
        let {
          value,
          isString,
          isNumber,
          digits,
          isArray,
          isInteger,
          isBoolean,
          isObject,
          noSet,
          min,
          max,
          nameParam,
          nameStorage,
          update,
          mapCase,
          _willSet_,
          _setup_,
          _validate_,
          _setValidate_,
          _getValidate_,
          ...rest
        } = props;
        [
          "_willSet_",
          "_setup_",
          "_validate_",
          "_setValidate_",
          "_getValidate_",
        ].forEach((key) => {
          eval(`if(${key}){
              ${key} = ${key}.bind(this);
            }`);
        });
        const KEY = Object.entries({
          FROM_FORM: "setFromIdForm",
          CHECK_EMAIL_RULE: "checkEmailRule",
          INIT: "init",
          GET: "get",
          _SET: "_set",
          SET: "set",
          SET_NULLISH: "setNullish",
          UPDATE: "update",
          EXISTS: "exists",
          ADD_LINK: "addLink",
          REMOVE_LINK: "removeLink",
          BURN_PARAM: "burnParam",
          ARRAY_ADD: "add",
          DELETE: "delete",
          ARRAY_PUSH: "push",
          ARRAY_POP: "pop",
          ARRAY_REMOVEALL: "removeAll",
          MAPCASE: "mapCase",
          IS_EMPTY: "isEmpty",
          IS_BOOLEAN: "is",
          ASSING: "assign",
          GET_KEYS: "getKeys",
          GET_VALUES: "getValues",
          STRINGIFY: "stringify",
          ENTRIES: "entries",
          MIN: "getMin2",
          MAX: "getMax2",
          DIGITS: "getDigits2",
          CLAMP: "clamp2",
        }).reduce((acc, [key, value]) => {
          acc[key] = `${value}${saneoKey}`;
          return acc;
        }, {});
        const get = () => this[KEY.GET]();
        const set = (value, config) => this[KEY.SET](value, config);
        const CONTEXT_GENERAL = ((softSet = false) => {
          return {
            idDriver,
            driverId,
            init: this[KEY.INIT],
            getValue: get,
            setValue: [set, this[KEY._SET]][+softSet],
            _setValue: this[KEY._SET],
            setNullish: this[KEY.SET_NULLISH],
            exists: this[KEY.EXISTS],
            burnParam: this[KEY.BURN_PARAM],
            mapCase: this[KEY.MAPCASE],
            //--- Array methods
            add: this[KEY.ARRAY_ADD],
            delete: this[KEY.DELETE],
            push: this[KEY.ARRAY_PUSH],
            pop: this[KEY.ARRAY_POP],
            removeAll: this[KEY.ARRAY_REMOVEALL],
            stringify: this[KEY.STRINGIFY],
            ...(() => {
              const r = {};
              if (isArray || isObject) {
                if (isArray) {
                  Object.assign(r, {
                    some: (cb) => get().some(cb),
                    every: (cb) => get().every(cb),
                    find: (cb) => get().find(cb),
                    filter: (cb) => get().filter(cb),
                    map: (cb) => get().map(cb),
                  });
                }
                if (isObject) {
                  Object.assign(r, {
                    assign: this[KEY.ASSING],
                    getKeys: this[KEY.GET_KEYS],
                    getValues: this[KEY.GET_VALUES],
                    entries: this[KEY.ENTRIES],
                  });
                }
              }
              return r;
            })(),
            //--- Component methods
            notifyLinks,
            update: this[KEY.UPDATE],
            addLink: this[KEY.ADD_LINK],
            removeLink: this[KEY.REMOVE_LINK],
            //--- Component props
            nameParam,
            nameStorage,
            isNumber,
            isString,
            isInteger,
            digits: this[KEY.DIGITS],
            min: this[KEY.MIN],
            max: this[KEY.MAX],
            clamp: this[KEY.CLAMP],
            ...extra_context_global,
            ...extra_context,
          };
        }).bind(this);

        {
          const isFunction = typeof props == "function";
          const isObjectComplex_ = notIsObjectAnonimus(props);

          const isVar = isFunction || isObjectComplex_;

          if (isVar) {
            if (isFunction) {
              const binder = props.bind(this);
              const isAsync = props.constructor.name === "AsyncFunction";
              const invoker = function (val) {
                const CONTEXT = CONTEXT_GENERAL();
                if (isNullish(val)) {
                  return binder(CONTEXT);
                }
                return binder(val, CONTEXT);
              };
              if (isAsync) {
                this[key] = async function (val) {
                  return await invoker(val);
                };
              } else {
                this[key] = function (val) {
                  return invoker(val);
                };
              }
            } else {
              this[key] = props;
            }
            extra_context_global[key] = this[key];
            return;
          }
        }

        initValue();

        // burning keys
        this[KEY.GET] = GET.bind(this)();
        processStringType.bind(this)();
        processNumberType.bind(this)();
        processBooleanType.bind(this)();
        this[KEY.INIT] = INIT.bind(this)();
        this[KEY.EXISTS] = EXISTS.bind(this)();
        this[KEY.UPDATE] = UPDATE.bind(this)();
        this[KEY.BURN_PARAM] = BURN_PARAM.bind(this)();
        this[KEY.SET] = SET.bind(this)();
        this[KEY._SET] = (newValue, config = {}) => {
          set(newValue, { burnParam: false, ...config });
        };
        this[KEY.SET_NULLISH] = SET_NULLISH.bind(this)();
        this[KEY.ADD_LINK] = ADDLINK.bind(this)();
        this[KEY.REMOVE_LINK] = REMOVELINK.bind(this)();
        this[KEY.MAPCASE] = MAPCASE.bind(this)();
        this[KEY.STRINGIFY] = () => JSON.stringify(get());
        processArrayType.bind(this)();
        processObjectType.bind(this)();
        EXTRA_CONTEXT.bind(this)();
        // end burning keys

        prepareSetup.bind(this)();

        if (nameParam) {
          listBurnParams.push(this[KEY.BURN_PARAM]);
          const { addParamListener } = subscribeParam({
            [nameParam]: ({ new_value }) => {
              set(new_value);
            },
          });
          addParamListener();
        }

        const getValueDefault = (newValue) => {
          if (isNullish(newValue)) {
            newValue = get();
          }
          return newValue;
        };

        const getStringifyRequired = (newValue) => {
          if (isArray || isObject) {
            return JSON.stringify(newValue);
          }
          return newValue;
        };

        function processObjectType() {
          if (isObject) {
            if (notIsObjectAnonimus(value)) {
              value = {};
            }
            this[KEY.ARRAY_ADD] = ADDOBJECT.bind(this)();
            this[KEY.DELETE] = DELETEOBJECT.bind(this)();
            this[KEY.ASSING] = ASSING.bind(this)();
            this[KEY.GET_KEYS] = () => Object.keys(get());
            this[KEY.GET_VALUES] = () => Object.values(get());
            this[KEY.ENTRIES] = () => Object.entries(get());
            this[KEY.IS_EMPTY] = () => Object.keys(get()).length == 0;
            this[KEY.FROM_FORM] = FROMFORM.bind(this)();
          }
        }

        function processArrayType() {
          if (isArray) {
            if (!Array.isArray(value)) {
              value = [];
            }
            this[KEY.ARRAY_ADD] = ADDARRAY.bind(this)();
            this[KEY.DELETE] = DELETEARRAY.bind(this)();
            this[KEY.ARRAY_PUSH] = PUSHARRAY.bind(this)();
            this[KEY.ARRAY_POP] = POPARRAY.bind(this)();
            this[KEY.ARRAY_REMOVEALL] = () => set([]);
            this[KEY.IS_EMPTY] = () => get().length == 0;
          }
        }

        function processStringType() {
          if (isString) {
            this[KEY.CHECK_EMAIL_RULE] = () => {
              return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                get()
              );
            };
          }
        }

        function processBooleanType() {
          if (isBoolean) {
            if (typeof value != "boolean") {
              value = false;
            }
            this[KEY.IS_BOOLEAN] = get;
          }
        }

        function processNumberType() {
          if (isNumber) {
            if (typeof value != "number") {
              value = 0;
            }
            if (min || max) {
              if (min) {
                this[KEY.MIN] = () => smartVar.bind(this)(min);
              }
              if (max) {
                this[KEY.MAX] = () => smartVar.bind(this)(max);
              }
              this[KEY.CLAMP] = (v) => {
                if (isNullish(v)) {
                  return v;
                }
                v = +v;
                if (min) {
                  v = Math.max(v, this[KEY.MIN]());
                }
                if (max) {
                  v = Math.min(v, this[KEY.MAX]());
                }
                return v;
              };
            }
            if (digits) {
              this[KEY.DIGITS] = () => smartVar.bind(this)(digits);
            }
          }
        }

        function prepareSetup() {
          if (_setup_) {
            listSetups.push({
              fn: _setup_,
              context: CONTEXT_GENERAL,
            });
          }
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

        function FROMFORM() {
          return (idForm) => {
            const form = document.getElementById(idForm);
            if (!form) {
              return "Formulario no encontrado";
            }
            const formData = new FormData(form);

            const newData = JSON.parse(JSON.stringify(get()));

            for (let [key, value] of formData.entries()) {
              if (value == "on") {
                value = true;
              }
              if (key.includes(".")) {
                const [parent, child, child2] = key.split(".");
                if (!newData[parent]) {
                  newData[parent] = {};
                }
                if (!child2) {
                  newData[parent][child] = inferStringData(value);
                } else {
                  if (!newData[parent][child]) {
                    newData[parent][child] = {};
                  }
                  newData[parent][child][child2] = inferStringData(value);
                }
              } else {
                newData[key] = inferStringData(value);
              }
            }

            set(newData);
          };
        }

        function ASSING() {
          return (newProps) => {
            const value = { ...get() };
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

            return case_functional.bind(this)() || case_keys.bind(this)();

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
              return smartVar.bind(this)(RETURN); // Siempre retorna
            }

            function case_functional() {
              if (typeof mapCase[key] == "function") {
                let RETURN = mapCase[key](value, CONTEXT_GENERAL());
                return smartVar.bind(this)(RETURN); // Sólo retorna si es función
              }
            }
          };
        }

        // Array methods

        function POPARRAY() {
          return () => {
            const arr = [...get()];
            arr.pop();
            set(arr);
          };
        }

        function PUSHARRAY() {
          return (item) => {
            const arr = [...get()];
            arr.push(item);
            set(arr);
          };
        }

        function ADDOBJECT() {
          return (key, item) => {
            const obj = { ...get() };
            obj[key] = item;
            set(obj);
          };
        }

        function ADDARRAY() {
          return (key, item) => {
            const arr = [...get()];
            if (!arr) {
              return;
            }
            arr[key] = item;
            set(arr);
          };
        }

        function DELETEOBJECT() {
          return (key) => {
            const obj = { ...get() };
            delete obj[key];
            set(obj);
          };
        }

        function DELETEARRAY() {
          return (key) => {
            const arr = [...get()];
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
                case_function.bind(this)();
              } else {
                case_variable.bind(this)();
              }

              function case_variable() {
                value = prop;
                if (conserve_name) {
                  this[name] = value;
                  extra_context[name] = value;
                  extra_context_global[name] = value;
                } else {
                  const saneoOriginalKey = firstUppercase(originalKey);
                  const saneoName = firstUppercase(name);
                  const getName = `get${saneoName}`;
                  const setName = `set${saneoName}`;
                  this[getName] = () => value;
                  this[setName] = (newValue) => {
                    value = newValue;
                  };
                  extra_context[`get${saneoOriginalKey}`] = this[getName];
                  extra_context[`set${saneoOriginalKey}`] = this[setName];
                }
              }

              function case_function() {
                value = (props) => {
                  const CONTEXT = CONTEXT_GENERAL();
                  if (isNullish(props)) {
                    return prop.bind(this)(CONTEXT);
                  }
                  return prop.bind(this)(props, CONTEXT);
                };
                this[name] = value;
                extra_context[originalKey] = value;
              }
            });

          function conserveName(key) {
            return (
              key == key.toUpperCase() ||
              ["$", "_"].some((s) => key.startsWith(s))
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

        function findNotNullish(newValue) {
          return newValue.find((x) => !isNullish(smartVar.bind(this)(x)));
        }

        function smartVar(value) {
          if (typeof value == "function") {
            return value.bind(this)(CONTEXT_GENERAL());
          }
          return value;
        }

        function INIT() {
          return (...inits) => {
            if (this[KEY.EXISTS]()) {
              return;
            }
            set(findNotNullish.bind(this)(inits), {
              burnParam: false,
              notifyLinks: false,
              force: true,
            });
          };
        }

        function GET() {
          return (param) => {
            let RETURN = findFirstTruthy(value, getParam, getStorage);
            RETURN = filterFromType.bind(this)(RETURN, {
              validateType: _getValidate_,
              applyFilters: true,
            });
            if (RETURN && param && (isArray || isObject)) {
              RETURN = RETURN[param];
            }
            return RETURN;
          };

          function getStorage() {
            if (!nameStorage) {
              return;
            }
            return processPersistantString(localStorage.getItem(nameStorage));
          }

          function getParam() {
            if (!nameParam) {
              return;
            }
            return processPersistantString(driverParams.getOne(nameParam));
          }
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

        function SET_NULLISH() {
          return (...newValue) => {
            const notNullish = findNotNullish(newValue);
            if (isNullish(notNullish)) {
              return;
            }
            set(notNullish);
          };
        }

        function SET() {
          return (
            newValue,
            { burnParam = true, notifyLinks: notify = true, force = false } = {}
          ) => {
            if (noSet && !force) {
              return;
            }
            let getValue = get();
            if (typeof newValue == "function") {
              newValue = newValue(getValue);
            }
            const wasChange = () => {
              try {
                const str1 = JSON.stringify(newValue);
                const str2 = JSON.stringify(getValue);
                const was = str1 != str2;
                return was;
              } catch (error) {
                return newValue != getValue;
              }
            };
            if (!wasChange()) {
              return;
            }
            newValue = filterFromType.bind(this)(newValue, {
              validateType: _setValidate_,
              applyFilters: false,
            });
            if (wasChange()) {
              BURN_STORAGE.bind(this)(newValue);
              burnParam && this[KEY.BURN_PARAM](newValue);
              notify && notifyLinks({ oldValue: getValue, newValue });
              _willSet_ &&
                _willSet_(newValue, {
                  ...CONTEXT_GENERAL(),
                  oldValue: getValue,
                });
              value = newValue;
            }
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
                  component.delayerUpdate.isReady(() =>
                    component.forceUpdate()
                  );
                } else {
                  component.forceUpdate();
                }
              }
            },
            () => {
              update.bind(this)(CONTEXT_GENERAL());
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

        function filterFromType(
          newValue,
          {
            validateType, // get or set validation
            applyFilters = true,
          }
        ) {
          newValue = processPersistantString(newValue);
          newValue = filterNumber.bind(this)(newValue);
          newValue = filterArray.bind(this)(newValue);
          newValue = filterObject.bind(this)(newValue);
          newValue = filterBoolean.bind(this)(newValue);
          newValue = filterString.bind(this)(newValue);
          newValue = validateValue.bind(this)(newValue);
          return newValue;

          function validateValue(value) {
            if (_validate_ || validateType) {
              const CONTEXT = CONTEXT_GENERAL();
              if (_validate_) {
                value = _validate_.bind(this)(value, CONTEXT);
              }
              if (validateType) {
                value = validateType.bind(this)(value, CONTEXT);
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
                  newValue = +newValue.toFixed(smartVar.bind(this)(digits));
                }
              }
              try {
                if (min && applyFilters) {
                  const _min_ = smartVar.bind(this)(min);
                  if (newValue < _min_) {
                    newValue = _min_;
                  }
                }
                if (max && applyFilters) {
                  const _max_ = smartVar.bind(this)(max);
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
      });

      listSetups.forEach((setup) => {
        try {
          setup.fn(setup.context(true));
        } catch (error) {
          console.error(error);
        }
      });
    }
  })();
  if (idDriver) {
    allDrivers[idDriver] = RETURN;
  } else {
    allDrivers.noId.push(RETURN);
  }
  return RETURN;
}

export function driverId(id) {
  return allDrivers[id];
}

export function getAllDrivers() {
  const { noId, ...rest } = allDrivers;
  return [...noId, ...Object.values(rest)];
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
