import { Chip, Tooltip } from "@mui/material";

function rendersTemplate(columns_config) {
 columns_config.map((column) => {
   const { renderInfo } = column;
   if (renderInfo) {
     let {
       "date-format": date_format,
       "number-format": number_format,
       label,
       iconized,
       local,
       sufix,
       hide_seconds,
       join_date,
     } = renderInfo;

     if (label) {
      
       return Object.assign(column, LabelFormat());
     }
     if (number_format) {
       Object.assign(column, NumberFormat());
     }
     if (date_format) {
       Object.assign(column, DateFormat());
     }

     if (iconized) {
       const { renderCell } = LabelFormat();
       return Object.assign(column, { renderCell });
     }

     function DateFormat() {
       return {
         renderString(params) {
           const { value } = params;
           let texto = "---";
           let tooltip = "Fecha no disponible";

           if (value) {
             ({ texto } = extractInfoDate());
             tooltip = texto;
           }

           return { texto, tooltip };

           function extractInfoDate() {
             const date = new Date(value);
             const formattedDate = date.toLocaleString(
               local ?? "es-ES",
               date_format
             );
             const [datePart, timePart] = formattedDate.split(", ");
             let [hour, minute, seconds] = timePart.split(":");
             if (hide_seconds) {
               seconds = null;
             } else {
               seconds = seconds.split(" ")[0];
             }
             const time = [hour, minute, seconds].filter(Boolean).join(":");
             const sufix_time = date_format["hour12"]
               ? ["AM", "PM"][+(date.getHours() >= 12)]
               : "";
             const formattedTime = [time, sufix_time]
               .filter(Boolean)
               .join(" ");
             let texto = [datePart, formattedTime].join(", ");
             if (join_date) {
               texto = texto.split(" de ").join(join_date);
             }
             return {
               texto,
               formattedTime,
               sufix_time,
               datePart,
               timePart,
               hour,
               minute,
               seconds,
               time,
             };
           }
         },
         renderCell: renderGeneral(column),
       };
     }

     function NumberFormat() {
       return {
         renderString(params) {
           const { value, row } = params;
           let retorno;

           let texto = "---";
           let tooltip = "Valor no disponible";

           if (value == null) {
             return { texto, tooltip };
           }

           const number_format_ =
             typeof number_format == "function"
               ? number_format(params)
               : number_format;

           ({ retorno } = processNumberFormat(
             number_format_,
             value,
             local,
             retorno
           ));

           ({ retorno: texto } = processSufix(row, sufix, retorno));

           tooltip = texto;

           return { texto, tooltip };
         },
         renderCell: renderGeneral(column),
       };
     }

     function LabelFormat() {
       return {
         renderString(params) {
           let { value } = params;
           const { text, color, icon } = label[value];
           return { texto: text, tooltip: text, color, icon };
         },
         renderCell(params) {
           let renderString;
           if(column.renderString){
             renderString = column.renderString(params);
           }else{
             ({value: renderString} = params);
           }
           const { texto, tooltip, color, icon } = iconized
             ? iconized(params, renderString.texto)
             : renderString;
           return (
             <Tooltip title={tooltip}>
               <Chip
                 label={
                   <div className="d-flex ai-center gap-10px">
                     {icon}
                     {texto}
                   </div>
                 }
                 color={color}
                 variant="outlined"
               />
             </Tooltip>
           );
         },
       };
     }
   }
 });

 function renderGeneral(column) {
   return (params) => {
     const { texto, tooltip } = column["renderString"](params);
     return (
       <Tooltip title={tooltip}>
         <div>{texto}</div>
       </Tooltip>
     );
   };
 }

 function processNumberFormat(number_format, value, local, retorno) {
   if (number_format) {
     const number = Number(value);
     const numeroFormateado = new Intl.NumberFormat(
       local ?? "es-ES",
       number_format
     ).format(number);
     retorno = numeroFormateado;
   }
   return { retorno };
 }

 function processSufix(row, sufix, retorno) {
   if (sufix) {
     const row_sufix = row[sufix];
     if (row_sufix) {
       sufix = row_sufix;
     }
     retorno = [retorno, sufix].filter(Boolean).join(" ");
   }
   return { sufix, retorno };
 }
}

export { rendersTemplate };
