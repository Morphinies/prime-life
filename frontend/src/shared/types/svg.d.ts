declare module '*.svg' {
  import React from 'react';

  const url: string;
  export default url;

  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module '*.svg?react' {
  import React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
