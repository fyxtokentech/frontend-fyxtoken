import { layer_aliases } from "./context.css.html.js";
import { diccionario, estructuras, determinarAliasDeTamaño } from "./vars.js";

class operator_btw extends layer_aliases {
 btwX(...args) {
   return this.btw("btwX", "width", ...args);
 }
 btwY(...args) {
   return this.btw("btwY", "height", ...args);
 }
 btw(name, side, ...args) {
   let [limitsInside, props] = (() => {
     if (args.length == 2) {
       return args;
     }
     if (args.length == 3) {
       return [[args[0], args[1]], args[2]];
     }
   })();
   limitsInside = determinarAliasDeTamaño(limitsInside);
   let [cota_inferior, cota_superior] = limitsInside;
   cota_inferior = determinarAliasDeTamaño(cota_inferior);
   cota_superior = determinarAliasDeTamaño(cota_superior);
   props = (() => {
     const reprop = {};
     Object.entries(props).forEach(([k, valores]) => {
       const DENTRO = valores[0];
       if (valores.length == 1) {
         valores = [DENTRO, null];
       }
       if (valores.length == 2) {
         const FUERA = valores[1];
         valores = [FUERA, DENTRO, FUERA];
       }
       if (valores.length == 3) {
         reprop[k] = valores;
       }
     });
     return reprop;
   })();
   const key = [
     name,
     cota_inferior,
     cota_superior,
     JSON.stringify(props),
   ].join("-");
   const existe = diccionario[key];
   const mascara_btw = Math.random()
     .toString(36)
     .replace("0.", name + "-");
     if (!existe) {
       diccionario[key] = mascara_btw;
     }
   this.retorno.push(diccionario[key]);
   if (existe) {
     return this; // Ya existe la propiedad
   }
   estructuras[mascara_btw] = `
     ${(() => {
       const calcular_estados_clases = Object.entries(props).map(
         ([nombre_propcss, estados]) => {
           const [DEBAJO, DENTRO, ENCIMA] = estados;
           return Object.entries({
             DEBAJO,
             DENTRO,
             ENCIMA,
           })
             .map(([nombre_estado, valor_estado]) => {
               if (valor_estado) {
                 return [
                   nombre_estado,
                   `${nombre_propcss}: ${valor_estado} !important;`,
                 ];
               }
             })
             .filter(Boolean);
         }
       );
       return Object.entries({
         DEBAJO: `(${side} < ${cota_inferior}px)`,
         ENCIMA: `(${side} > ${cota_superior}px)`,
         DENTRO: `(${cota_inferior}px <= ${side}) and (${side} <= ${cota_superior}px)`,
       })
         .map(([nombre_estado_generar, regla_media_css]) => {
           const INDEX_NOMBRE_ESTADO = 0;
           const INDEX_VALOR_ESTADO = 1;
           const cuerpo = calcular_estados_clases
             .map((estados) =>
               // Buscar los estados coincidentes
               estados.find(
                 (estado) =>
                   estado[INDEX_NOMBRE_ESTADO] == nombre_estado_generar
               )
             )
             .filter(Boolean) // eliminar propiedades sin estado
             .map((estado) => estado[INDEX_VALOR_ESTADO]) //extrae los valores
             .join("");
           return `
             @media ${regla_media_css} {
               .${mascara_btw}{
                 ${cuerpo}
               }
             }
           `;
         })
         .join("\n")
         .replace(/\s+/g, " ");
     })()}
   `;

   return this;
 }
}

class operator_if extends operator_btw {
 if({ limitBreak, op_true, op_false, side, props, name }) {
   const _THIS_ = this;
   limitBreak = determinarAliasDeTamaño(limitBreak);
   const key = [name, limitBreak, JSON.stringify(props)].join("-");
   const existe = diccionario[key];
   const mascara_if = Math.random()
     .toString(36)
     .replace("0.", name + "-");
   if (!existe) {
     diccionario[key] = mascara_if;
   }
   this.retorno.push(diccionario[key]);
   if (existe) {
     return this; // Ya existe la propiedad
   }
   diccionario[key] = mascara_if;
   estructuras[mascara_if] = [
     val({ operador: op_true, indice: 0 }),
     val({ operador: op_false, indice: 1 }),
   ]
     .join(" ")
     .replace(/\s+/g, " ")
     .trim();

   return this;

   function val({ operador, indice }) {
     return `
         @media (${side} ${operador} ${limitBreak}px) {
           .${mascara_if}{ 
             ${_THIS_.props2string(props, indice)}
           }
         }
     `;
   }
 }
 ltX(limitBreak, props) {
   return this.if({
     limitBreak,
     props,
     name: "ltX",
     side: "width",
     op_true: "<=",
     op_false: ">",
   });
 }
 ltY(limitBreak, props) {
   return this.if({
     limitBreak,
     props,
     name: "ltY",
     side: "height",
     op_true: "<=",
     op_false: ">",
   });
 }
 gtX(limitBreak, props) {
   return this.if({
     limitBreak,
     props,
     name: "gtX",
     side: "width",
     op_true: ">",
     op_false: "<=",
   });
 }
 gtY(limitBreak, props) {
   return this.if({
     limitBreak,
     props,
     name: "gtY",
     side: "height",
     op_true: ">",
     op_false: "<",
   });
 }
}

class operator_lerp extends operator_if {
 lerpnX(...args){
   const name = "lerpnX";
   const unidad = "var(--n-windowWidth)";
   return this.lerp(name, unidad, ...args);
 }
 lerpnY(...args){
   const name = "lerpnY";
   const unidad = "var(--n-windowHeight)";
   return this.lerp(name, unidad, ...args);
 }
 lerpX(...args) {
   const name = "lerpX";
   const unidad = "100dvw";
   return this.lerp(name, unidad, ...args);
 }
 lerpY(...args) {
   const name = "lerpY";
   const unidad = "100dvh";
   return this.lerp(name, unidad, ...args);
 }
 lerp(name, unidad, ...args) {
   const abierto = "o";
   const cerrado = "e";

   let [start, end, props] = (() => {
     if (args.length == 3) {
       return args;
     }
     if (args.length == 2) {
       let [limites, props] = args;
       limites = determinarAliasDeTamaño(limites);
       let [inicio, fin] = limites;
       inicio = determinarAliasDeTamaño(inicio);
       fin = determinarAliasDeTamaño(fin);
       return [inicio, fin, props];
     }
   })();
   start = Number(start);
   end = Number(end);

   props = Object.entries(props).reduce((acc, [k, v]) => {
     const kebab = k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
     acc[kebab] = v;
     return acc;
   }, {});

   props = (() => {
     const np = {};
     Object.entries(props).forEach(([k, v]) => {
       const proyecciones = ["o", "e"];
       const auto = proyecciones[1];
       v = v.map((s) => {
         if (s == "a") {
           return abierto;
         }
         if (s == "c") {
           return cerrado;
         }
         return s;
       });
       if (v.length == 2) {
         v = [auto, v[0], v[1], auto]; // es de proyección abierta
       }
       if (v.length == 3) {
         if (proyecciones.includes(v[0])) {
           v.push(auto); // se abre la proyección al final
         } else if (proyecciones.includes(v.at(-1))) {
           v.unshift(auto); // se abre la proyección al inicio
         }
       }
       if (v.length == 4) {
         np[k] = v; // Sólo se agrega si tiene 4 argumentos
       }
     });
     return np;
   })();

   const key = name + `-${start}-${end}-${JSON.stringify(props)}`;
   const existe = diccionario[key];
   const mascara_lerp = Math.random()
     .toString(36)
     .replace("0.", name + "-");
   if (!existe) {
     diccionario[key] = mascara_lerp;
   }
   this.retorno.push(diccionario[key]);
   if (existe) {
     return this; // Ya existe la propiedad
   }
   diccionario[key] = mascara_lerp;
   estructuras[mascara_lerp] = `
    .${mascara_lerp} {
        ${Object.entries(props)
          .map(([k, v]) => {
            const vis = v[1] + "px";
            const vi = v[1];
            const vf = v[2];
            if (start == end) {
              return [k, vis]; // No es posible interpolación
            }
            if (vi == vf) {
              return [k, vis]; // No necesita interpolación
            }
            const numerador = `(${unidad} - ${start}px)`;
            const denominador = `(${end} - ${start})`;
            const t = `calc(${numerador} / ${denominador})`;
            if (v[0] == abierto && v.at(-1) == abierto) {
              // t ∈ ℝ
              return [k, recta_rectorial(t)];
            }
            if (v[0] == cerrado && v.at(-1) == cerrado) {
              // 0 <= t <= 1
              return [k, recta_rectorial(`clamp(0px, ${t}, 1px)`)];
            }
            if (v[0] == cerrado && v.at(-1) == abierto) {
              // t >= 0
              return [k, recta_rectorial(`max(0px, ${t})`)];
            }
            if (v[0] == abierto && v.at(-1) == cerrado) {
              // t <= 1
              return [k, recta_rectorial(`clamp(-999999px, ${t}, 1px)`)];
            }
            function recta_rectorial(_t_) {
              return `calc((${vf} - ${vi}) * ${_t_} + ${vis})`;
            }
          })
          .map(([k, v]) => {
            return `${k}: ${v} !important;`;
          })
          .join("")}
    }
  `
     .replace(/\s+/g, " ")
     .trim();
   return this;
 }
}

export class layer_operators extends operator_lerp {
}