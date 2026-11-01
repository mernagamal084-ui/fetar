// Illustrated ingredient art (vector). These are supporting illustrations, NOT photographs of the product.
// Gradients live in one shared <Defs/> so every icon can reference them by id.
const stops = (arr) => arr.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />);
const R = (id, s, cx = 0.38, cy = 0.32, r = 0.85) => (
  <radialGradient id={id} cx={cx} cy={cy} r={r}>{stops(s)}</radialGradient>
);
const L = (id, s, x2 = 0, y2 = 1) => (
  <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>{stops(s)}</linearGradient>
);

export function Defs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        {R('g-bean', [[0, '#D79A5E'], [0.55, '#9A5E2B'], [1, '#5A3216']])}
        {R('g-lemon', [[0, '#FFF3A0'], [0.6, '#F6CB2E'], [1, '#D49A05']])}
        {R('g-lemonin', [[0, '#FFF8C8'], [1, '#F8DB5A']], 0.5, 0.5, 0.7)}
        {R('g-yolk', [[0, '#FFD866'], [0.6, '#F29A1C'], [1, '#D2620A']], 0.4, 0.32, 0.8)}
        {R('g-eggw', [[0, '#FFFFFF'], [1, '#F1EADB']], 0.5, 0.4, 0.8)}
        {R('g-tomato', [[0, '#FF8466'], [0.55, '#DC3B22'], [1, '#98200F']])}
        {L('g-pepper', [[0, '#A9CC52'], [0.5, '#62912A'], [1, '#3C6612']], 1, 1)}
        {R('g-potato', [[0, '#FFE69B'], [0.6, '#EDB045'], [1, '#B4701A']], 0.35, 0.3, 0.9)}
        {R('g-eggp', [[0, '#7A417F'], [1, '#2A112F']])}
        {R('g-eggpin', [[0, '#EDBB74'], [0.6, '#B97B31'], [1, '#7C4B19']], 0.4, 0.35, 0.8)}
        {R('g-falafel', [[0, '#EDA655'], [0.6, '#B9651F'], [1, '#6A3010']], 0.4, 0.3, 0.85)}
        {R('g-bread', [[0, '#FCEBC4'], [0.7, '#EDC57C'], [1, '#C58A38']], 0.45, 0.4, 0.8)}
        {L('g-oil', [[0, '#F6E888'], [1, '#C79F14']])}
        {R('g-garlic', [[0, '#FFFFFF'], [0.7, '#F0E4CA'], [1, '#CDB88F']], 0.4, 0.3, 0.9)}
        {R('g-sauce', [[0, '#FF7050'], [0.6, '#C82A14'], [1, '#8B1507']], 0.35, 0.3, 0.9)}
        {L('g-bowl', [[0, '#C0805A'], [1, '#74412A']])}
        {L('g-herb', [[0, '#86B23F'], [1, '#356618']], 1, 1)}
        {R('g-mash', [[0, '#D6D098'], [1, '#98975A']], 0.4, 0.3, 0.9)}
        {R('g-cumin', [[0, '#C09A4E'], [1, '#76561C']])}
        {R('g-paprika', [[0, '#EE6A38'], [1, '#A12C0C']])}
        {R('g-sesame', [[0, '#FFF7DE'], [1, '#E3CB90']])}
        {R('g-salt', [[0, '#FFFFFF'], [1, '#D6DCE4']])}
        {R('g-sun', [[0, '#FFF1B0'], [1, '#FFC93C']], 0.5, 0.5, 0.7)}
      </defs>
    </svg>
  );
}

const sh = <ellipse cx="100" cy="176" rx="58" ry="8" fill="rgba(40,20,5,.22)" />;

const Bean = ({ x, y, r, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-34 0C-34-22-10-28 10-26C30-24 38-10 36 4C34 20 14 28-8 26C-26 24-34 14-34 0Z" fill="url(#g-bean)" />
    <path d="M-26-3C-8-13 14-13 30-3" stroke="#40200c" strokeWidth="3" fill="none" opacity=".65" strokeLinecap="round" />
    <ellipse cx="-8" cy="-15" rx="14" ry="4.5" fill="#fff" opacity=".28" />
  </g>
);

const seeds = [[70, 96], [86, 86], [104, 80], [122, 88], [136, 98], [96, 98], [114, 100], [78, 106], [128, 108], [100, 90], [90, 108], [110, 110], [60, 108], [140, 108]];
const Bowl = ({ mound, dot, dotRot = 20, big = false, sparkle = false }) => (
  <g>
    <ellipse cx="100" cy="168" rx="64" ry="8" fill="rgba(40,20,5,.22)" />
    <ellipse cx="100" cy="112" rx="62" ry="16" fill="#4d2a14" />
    <path d="M44 112 Q100 28 156 112 Q100 132 44 112Z" fill={mound} />
    {seeds.map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y - 8 + (i % 3) * 3} rx={big ? 5 : 3.6} ry={big ? 2.8 : 1.8} fill={dot} transform={`rotate(${dotRot + i * 37} ${x} ${y})`} />
    ))}
    {sparkle && [[92, 70], [116, 80], [78, 90], [130, 96]].map(([x, y], i) => <path key={i} d={`M${x} ${y - 6}L${x + 2} ${y - 2}L${x + 6} ${y}L${x + 2} ${y + 2}L${x} ${y + 6}L${x - 2} ${y + 2}L${x - 6} ${y}L${x - 2} ${y - 2}Z`} fill="#fff" opacity=".95" />)}
    <path d="M38 112 Q42 170 100 172 Q158 170 162 112 Q100 134 38 112Z" fill="url(#g-bowl)" />
    <path d="M40 114 Q100 136 160 114" stroke="#E0A276" strokeWidth="3" fill="none" opacity=".7" />
  </g>
);

const Leaf = ({ x, y, r, s = 1, c = 'url(#g-herb)' }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M0 0C-16-6-24-22-18-34C-12-30-8-36 0-46C8-36 12-30 18-34C24-22 16-6 0 0Z" fill={c} />
    <path d="M0 0V-38" stroke="#264d10" strokeWidth="1.8" opacity=".5" />
  </g>
);

const icons = {
  fava: () => (
    <g>{sh}<Bean x={70} y={118} r={-20} /><Bean x={128} y={110} r={25} /><Bean x={100} y={78} r={-5} s={1.05} /><Bean x={92} y={140} r={12} s={.95} /><Bean x={138} y={146} r={-30} s={.9} /></g>
  ),
  oil: () => (
    <g>
      <ellipse cx="100" cy="178" rx="46" ry="7" fill="rgba(40,20,5,.22)" />
      <path d="M84 26h32v8l-3 6v28c0 6 4 10 12 20 12 14 20 30 20 54 0 20-8 34-45 34s-45-14-45-34c0-24 8-40 20-54 8-10 12-14 12-20V40l-3-6z" fill="url(#g-oil)" opacity=".95" stroke="#8d7410" strokeWidth="2" />
      <rect x="82" y="14" width="36" height="16" rx="4" fill="#5b3a1d" />
      <path d="M76 120c0-8 6-14 14-14" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".55" />
      <path d="M62 128c4 22 14 36 38 36s34-14 38-36c-30 8-46 8-76 0z" fill="#FFF3A6" opacity=".35" />
      <path d="M170 48c8 14 12 20 12 28a12 12 0 0 1-24 0c0-8 4-14 12-28z" fill="url(#g-oil)" stroke="#8d7410" strokeWidth="1.5" />
    </g>
  ),
  cumin: () => <Bowl mound="url(#g-cumin)" dot="#5b4012" big />,
  spice: () => <Bowl mound="url(#g-paprika)" dot="#7d2008" />,
  sesame: () => <Bowl mound="url(#g-sesame)" dot="#fffbe9" big />,
  salt: () => <Bowl mound="url(#g-salt)" dot="#c3cad4" sparkle />,
  lemon: () => (
    <g>{sh}
      <ellipse cx="72" cy="92" rx="50" ry="38" fill="url(#g-lemon)" transform="rotate(-24 72 92)" />
      <path d="M26 100c-8-6-8-14-2-18" stroke="#D49A05" strokeWidth="6" strokeLinecap="round" fill="none" />
      <g transform="translate(116 112)">
        <circle r="50" fill="#F6D043" /><circle r="44" fill="#FFF3B0" />
        <circle r="38" fill="url(#g-lemonin)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d="M0 0L0-37" stroke="#fff" strokeWidth="3" transform={`rotate(${a})`} />)}
        {[22, 67, 112, 157, 202, 247, 292, 337].map((a) => <ellipse key={a} cx="0" cy="-18" rx="3" ry="6" fill="#F3D45A" transform={`rotate(${a})`} />)}
      </g>
    </g>
  ),
  tomato: () => (
    <g>{sh}
      <circle cx="100" cy="106" r="58" fill="url(#g-tomato)" />
      <ellipse cx="78" cy="80" rx="18" ry="9" fill="#fff" opacity=".35" transform="rotate(-30 78 80)" />
      <path d="M100 50l-8 14-16-4 10 12-14 10 18 0 4 14 8-12 12 10-2-16 16-4-14-8 6-14-12 6z" fill="#4f7d1f" />
    </g>
  ),
  pepper: () => (
    <g>{sh}
      <path d="M40 60C60 40 120 56 150 100c14 22 16 44 8 58-6-10-14-14-26-16-40-6-78-20-92-52z" fill="url(#g-pepper)" transform="translate(0 4)" />
      <path d="M46 64C76 60 120 74 146 118" stroke="#d6efA0" strokeWidth="5" fill="none" opacity=".5" strokeLinecap="round" />
      <path d="M40 64c-8-14-8-24 4-30l6 10c-6 4-6 10-2 16z" fill="#3a6a14" />
    </g>
  ),
  veg: () => (
    <g>{sh}
      <g transform="translate(-6 8) scale(.95)">
        <path d="M60 40C80 24 130 38 160 82c14 20 16 40 8 54-6-10-14-14-26-16-40-6-78-30-82-80z" fill="url(#g-pepper)" />
        <path d="M60 40c-8-14-6-22 6-26l5 10c-6 3-6 9-3 16z" fill="#3a6a14" />
      </g>
      <g transform="translate(-4 24) scale(.82)">
        <circle cx="86" cy="108" r="54" fill="url(#g-tomato)" />
        <ellipse cx="66" cy="84" rx="16" ry="8" fill="#fff" opacity=".35" transform="rotate(-30 66 84)" />
        <path d="M86 56l-8 13-15-3 9 11-13 9 17 0 4 13 8-11 11 9-2-15 15-4-13-7 6-13-11 6z" fill="#4f7d1f" />
      </g>
    </g>
  ),
  herb: () => (
    <g>{sh}
      <path d="M100 168C98 130 100 100 100 70" stroke="#3b6a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <Leaf x={100} y={120} r={-52} s={1.1} /><Leaf x={100} y={120} r={52} s={1.1} /><Leaf x={100} y={92} r={-34} s={1} />
      <Leaf x={100} y={92} r={34} s={1} /><Leaf x={100} y={74} r={0} s={1.15} c="#5f9a2a" /><Leaf x={100} y={150} r={-76} s={.9} c="#4c8420" /><Leaf x={100} y={150} r={76} s={.9} c="#4c8420" />
    </g>
  ),
  falafel: () => (
    <g>{sh}
      <ellipse cx="100" cy="104" rx="66" ry="56" fill="url(#g-falafel)" />
      {[[70, 80], [96, 70], [124, 84], [136, 108], [118, 132], [86, 138], [64, 116], [100, 104], [80, 100], [112, 112]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4 + (i % 3)} fill="#5a2a0c" opacity=".5" />)}
      {[[84, 90], [110, 78], [128, 96], [100, 124], [70, 108], [120, 122]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="4" ry="2.2" fill="#6f9a2f" transform={`rotate(${i * 50} ${x} ${y})`} />)}
      {[[92, 74], [118, 98], [76, 126], [104, 138], [132, 120], [66, 92]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="3.4" ry="1.8" fill="#FFF4D8" transform={`rotate(${i * 60} ${x} ${y})`} />)}
      <ellipse cx="78" cy="78" rx="26" ry="10" fill="#fff" opacity=".2" transform="rotate(-20 78 78)" />
    </g>
  ),
  mash: () => (
    <g>
      <ellipse cx="100" cy="168" rx="64" ry="8" fill="rgba(40,20,5,.22)" />
      <ellipse cx="100" cy="116" rx="62" ry="16" fill="#4d2a14" />
      <path d="M46 114 Q70 60 100 56 Q132 60 154 114 Q100 128 46 114Z" fill="url(#g-mash)" />
      {[[80, 90], [104, 78], [124, 96], [92, 106], [114, 108], [70, 108], [136, 108]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#5f8c2a" />)}
      <path d="M38 114 Q42 172 100 174 Q158 172 162 114 Q100 136 38 114Z" fill="url(#g-bowl)" />
    </g>
  ),
  bread: () => (
    <g>
      <ellipse cx="100" cy="170" rx="70" ry="9" fill="rgba(40,20,5,.22)" />
      <ellipse cx="108" cy="116" rx="72" ry="50" fill="#D4A04F" />
      <ellipse cx="100" cy="102" rx="74" ry="52" fill="url(#g-bread)" />
      <path d="M40 98c20-24 90-26 118 0" stroke="#B9812F" strokeWidth="3" fill="none" opacity=".6" />
      {[[70, 90, 12], [120, 80, 10], [96, 116, 14], [134, 112, 8], [58, 118, 8]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#C98A35" opacity=".35" />)}
    </g>
  ),
  egg: () => (
    <g>{sh}
      <path d="M40 98c-4-34 26-52 56-48 30-8 62 10 64 44 2 28-18 36-30 44-14 12-30 18-48 12-20-4-40-12-42-52z" fill="url(#g-eggw)" stroke="#E5DCC6" strokeWidth="2" />
      <circle cx="98" cy="96" r="28" fill="url(#g-yolk)" />
      <ellipse cx="88" cy="85" rx="9" ry="5" fill="#fff" opacity=".6" transform="rotate(-30 88 85)" />
    </g>
  ),
  potato: () => (
    <g>{sh}
      {[[64, 108, -14, 1], [132, 100, 18, 1.05], [100, 66, 6, .95], [96, 134, -8, 1], [150, 142, 24, .85], [48, 148, 20, .8]].map(([x, y, r, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <rect x="-30" y="-28" width="60" height="56" rx="10" fill="url(#g-potato)" stroke="#A8651A" strokeWidth="3" />
          <rect x="-20" y="-20" width="40" height="36" rx="6" fill="#FFE9A8" opacity=".5" />
          <path d="M-24 -22l16 6" stroke="#fff" strokeWidth="3" opacity=".5" strokeLinecap="round" />
        </g>
      ))}
    </g>
  ),
  garlic: () => (
    <g>{sh}
      <path d="M100 30c6 14 8 20 6 30 40 6 62 34 60 66-2 30-30 46-66 46s-64-16-66-46c-2-32 20-60 60-66-2-10 0-16 6-30z" fill="url(#g-garlic)" stroke="#CDB88F" strokeWidth="2" />
      {[-34, -14, 8, 30].map((x, i) => <path key={i} d={`M100 64C${100 + x * 1.2} 100 ${100 + x * 1.5} 140 ${100 + x * .7} 168`} stroke="#CDB88F" strokeWidth="2.5" fill="none" opacity=".8" />)}
      <path d="M92 168h16v8H92z" fill="#B49A6C" />
    </g>
  ),
  eggplant: () => (
    <g>{sh}
      <g transform="translate(66 96) rotate(-16)">
        <ellipse rx="52" ry="42" fill="url(#g-eggp)" /><ellipse rx="44" ry="34" fill="url(#g-eggpin)" />
        {[[-12, -8], [10, 4], [-4, 14], [18, -12], [-20, 10]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill="#5a3410" opacity=".6" />)}
        <ellipse cx="-14" cy="-16" rx="16" ry="5" fill="#fff" opacity=".28" />
      </g>
      <g transform="translate(128 118) rotate(20)">
        <ellipse rx="48" ry="40" fill="url(#g-eggp)" /><ellipse rx="40" ry="32" fill="url(#g-eggpin)" />
        {[[-10, -6], [12, 6], [0, 14], [16, -10]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill="#5a3410" opacity=".6" />)}
        <ellipse cx="-12" cy="-14" rx="14" ry="4.5" fill="#fff" opacity=".28" />
      </g>
    </g>
  ),
  sauce: () => (
    <g>
      <path d="M100 34c18-6 30 6 42 14 18 2 34 16 30 36 8 12 8 30-6 40 2 22-18 38-38 32-16 14-44 10-52-8-22 0-34-22-26-40-12-14-8-38 14-44 4-18 20-30 36-30z" fill="url(#g-sauce)" />
      <ellipse cx="82" cy="70" rx="22" ry="9" fill="#fff" opacity=".3" transform="rotate(-24 82 70)" />
      <circle cx="170" cy="40" r="7" fill="#C82A14" /><circle cx="28" cy="150" r="9" fill="#C82A14" /><circle cx="176" cy="150" r="5" fill="#C82A14" />
    </g>
  ),
};

export function Ingredient({ type, className = '', style }) {
  const I = icons[type] || icons.herb;
  return (
    <svg className={`ing ${className}`} viewBox="0 0 200 200" style={style} aria-hidden="true">
      <I />
    </svg>
  );
}
