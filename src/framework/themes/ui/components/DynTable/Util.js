export function genAllColumns(content) {
 return Object.keys(
   content.reduce((acc, value) => {
     Object.assign(acc, value);
     return acc;
   }, {})
 ).map((k) => ({
   field: k,
   headerName: k,
   description: "",
 }));
}