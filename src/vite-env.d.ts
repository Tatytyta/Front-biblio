/// <reference types="vite/client" />

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.sass' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.styl' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.stylus' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.pcss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.sss' {
  const content: { [className: string]: string };
  export default content;
}
