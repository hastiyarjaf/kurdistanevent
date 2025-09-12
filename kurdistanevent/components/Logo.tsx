import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 85"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M50 0L0 85H100L50 0ZM70 85C60 70 40 70 30 85H70Z"
      fill="currentColor"
    />
  </svg>
);

export default Logo;
