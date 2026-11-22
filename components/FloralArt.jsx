export default function FloralArt({ variant = 'rose', className = '' }) {
  const colors = {
    rose: ['#D6A1A2', '#8D576B', '#F6D5C1'],
    dawn: ['#D7BCA4', '#D5A09D', '#FAEBD6'],
    garden: ['#9FA58D', '#B7878E', '#E3D5B8'],
  };
  const [petal, shade, center] = colors[variant] || colors.rose;
  const suffix = variant;
  return (
    <svg className={`floral-art ${className}`} viewBox="0 0 460 520" fill="none" role="img" aria-label="A handcrafted illustration of a blooming flower">
      <defs>
        <linearGradient id={`floral-petal-${suffix}`} x1="120" y1="25" x2="340" y2="330" gradientUnits="userSpaceOnUse">
          <stop stopColor={center} />
          <stop offset="0.55" stopColor={petal} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
        <radialGradient id={`floral-core-${suffix}`}><stop stopColor="#FBE9CA"/><stop offset="1" stopColor="#B47C67"/></radialGradient>
      </defs>
      <path d="M245 494 C229 389 254 323 230 247" stroke="#6F8069" strokeWidth="3" strokeLinecap="round" />
      <path d="M237 425 C151 429 138 375 125 355 C169 348 212 361 237 425Z" fill="#929B79" opacity=".74" />
      <path d="M247 366 C315 353 338 311 340 292 C290 297 258 325 247 366Z" fill="#657F69" opacity=".7" />
      <g transform="translate(230 205)">
        {Array.from({ length: 10 }, (_, i) => (
          <path
            key={i}
            d="M0 18 C-88 -12 -75 -112 -26 -144 C18 -168 59 -107 0 18Z"
            fill={`url(#floral-petal-${suffix})`}
            opacity={0.72 + (i % 3) * 0.07}
            transform={`rotate(${i * 36 + 9})`}
          />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d="M0 9 C-46 -14 -47 -71 -12 -93 C16 -106 36 -56 0 9Z"
            fill={i % 2 ? center : petal}
            opacity=".9"
            transform={`rotate(${i * (360 / 7) + 8})`}
          />
        ))}
        <circle r="25" fill={`url(#floral-core-${suffix})`} />
        <circle r="13" stroke="#E9CDA8" strokeWidth="1" strokeDasharray="2 5" />
      </g>
      <g fill="#CAB396" opacity=".65">
        <circle cx="58" cy="157" r="2.4"/><circle cx="382" cy="115" r="1.7"/>
        <circle cx="100" cy="295" r="1.6"/><circle cx="367" cy="341" r="2.1"/>
        <path d="M78 95v12m-6-6h12M380 246v12m-6-6h12" stroke="#C7AC91" strokeWidth="1" />
      </g>
    </svg>
  );
}
