declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
  export  function registComponent(name:string ,com:any);
}

declare module '*.scss' {
  const content: any;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}


