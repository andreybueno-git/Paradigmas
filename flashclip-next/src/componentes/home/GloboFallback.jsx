// Globo de neve desenhado em SVG (index.html:196-240): aparece enquanto o 3D carrega e quando ele
// não está disponível. Os ids (fc-glass, fc-aura, fc-metal, fc-glow, fc-soft, fc-sphere) existem uma
// vez só no documento. Componente de servidor, sem estado.
import { asset } from '@/lib/caminho';

export default function GloboFallback() {
  return (
    <div className="fc-globe-fallback" aria-hidden="true">
      <svg viewBox="0 0 540 540" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="fc-glass" cx=".3" cy=".2" r=".85">
            <stop stopColor="#d6dde4" stopOpacity=".16" />
            <stop offset=".35" stopColor="#3a4652" stopOpacity=".06" />
            <stop offset=".75" stopColor="#030508" stopOpacity=".04" />
            <stop offset="1" stopColor="#c9d2dc" stopOpacity=".22" />
          </radialGradient>
          <radialGradient id="fc-aura"><stop stopColor="#f5bd3d" stopOpacity=".38" /><stop offset="1" stopColor="#f5bd3d" stopOpacity="0" /></radialGradient>
          <linearGradient id="fc-metal" x1="0" x2="1"><stop stopColor="#7e5c2f" /><stop offset=".45" stopColor="#f8dfa8" /><stop offset="1" stopColor="#927448" /></linearGradient>
          <filter id="fc-glow" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="fc-soft"><feGaussianBlur stdDeviation="14" /></filter>
          <clipPath id="fc-sphere"><circle cx="270" cy="286" r="178" /></clipPath>
        </defs>
        <ellipse cx="275" cy="495" rx="157" ry="13" fill="#000" opacity=".2" filter="url(#fc-soft)" />
        <circle className="fc-halo" cx="270" cy="285" r="230" fill="url(#fc-aura)" />
        <path d="M270-30V65" stroke="#d6a84f" strokeWidth="1" />
        <ellipse cx="270" cy="78" rx="14" ry="18" fill="none" stroke="url(#fc-metal)" strokeWidth="4" />
        <path d="M245 101 250 85H290L296 101V113H245Z" fill="url(#fc-metal)" />
        <path d="M253 89V106M261 89V106M270 89V106M279 89V106M287 89V106" stroke="#705327" opacity=".6" />
        <circle className="fc-glass" cx="270" cy="286" r="179" />
        <g clipPath="url(#fc-sphere)">
          <path d="M85 349Q268 440 458 321" stroke="#d6b974" strokeWidth=".8" fill="none" opacity=".55" />
          <path d="M111 214Q265 145 428 218" stroke="#c9d2dc" strokeWidth=".5" fill="none" opacity=".2" />
          <image className="fc-emblem" href={asset('/imagens/logo.webp')} x="172" y="164" width="196" height="239" preserveAspectRatio="xMidYMid meet" />
          <path d="M149 204Q114 281 144 342" stroke="#f2f2f2" strokeWidth="11" strokeLinecap="round" fill="none" opacity=".09" />
          <path d="M399 336Q417 294 406 249" stroke="#f2f2f2" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".19" />
          <ellipse cx="212" cy="164" rx="43" ry="15" fill="#f3e6c8" opacity=".08" transform="rotate(-31 212 164)" />
          <g className="fc-bulb" fill="#ffe4a3">
            <circle cx="133" cy="367" r="2.7" /><circle cx="175" cy="385" r="3" /><circle cx="224" cy="394" r="2.5" />
            <circle cx="274" cy="393" r="3" /><circle cx="325" cy="380" r="2.5" /><circle cx="373" cy="360" r="3" /><circle cx="414" cy="340" r="2.6" />
            <circle cx="195" cy="187" r="1.6" /><circle cx="354" cy="221" r="1.8" /><circle cx="203" cy="334" r="1.5" />
          </g>
        </g>
        <path d="M167 148A179 179 0 0 1 371 139" fill="none" stroke="#fff0c4" opacity=".5" strokeWidth="1.2" />
        <path d="M245 103C199 80 211 47 245 67L270 99C296 43 338 56 321 83L275 107" fill="#9c2c35" stroke="#cf7470" strokeWidth=".7" />
        <path d="M263 102C250 128 230 134 210 143L229 147 230 166C254 145 269 126 274 106" fill="#ac3740" />
        <path d="M270 103C287 121 310 124 326 143L307 142 303 157C282 142 269 124 265 107" fill="#7b242d" />
        <ellipse cx="269" cy="102" rx="10" ry="7" fill="#bd4a4c" />
        <g className="fc-spark" fill="#f5bd3d"><path d="M92 143 95 155 107 158 95 161 92 173 89 161 77 158 89 155Z" /></g>
        <g className="fc-spark" fill="#f5bd3d"><path d="M430 90 433 103 446 106 433 109 430 122 427 109 414 106 427 103Z" /></g>
        <g className="fc-spark" fill="#f5bd3d"><path d="M447 425 449 432 456 434 449 436 447 443 445 436 438 434 445 432Z" /></g>
        <g fill="#f5bd3d" opacity=".6"><circle cx="116" cy="440" r="1.8" /><circle cx="456" cy="224" r="1.7" /><circle cx="395" cy="55" r="1.3" /><circle cx="99" cy="254" r="1.2" /></g>
        <path d="M50 309H80M65 294V324" stroke="#9da1a5" strokeWidth=".5" opacity=".5" />
      </svg>
    </div>
  );
}
