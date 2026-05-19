// PersianArch — arche persane décorative en SVG (style mihrab polylobé).
// Encadre un contenu central ; les enfants sont rendus à l'intérieur de l'arche.

/**
 * @param {object} props
 * @param {React.ReactNode} props.children - contenu placé dans l'arche.
 * @param {string} [props.className] - classes du conteneur.
 */
const PersianArch = ({ children, className = '' }) => (
  <div className={`relative ${className}`}>
    {/* Tracé de l'arche : contour polylobé façon mihrab */}
    <svg
      viewBox="0 0 400 480"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <path
        d="M20 470 V210
           Q20 150 60 110
           Q90 80 110 50
           Q130 20 160 18
           Q180 4 200 4
           Q220 4 240 18
           Q270 20 290 50
           Q310 80 340 110
           Q380 150 380 210
           V470"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Liseré intérieur, plus fin */}
      <path
        d="M34 470 V214
           Q34 160 70 122
           Q98 94 118 64
           Q136 36 164 32
           Q182 18 200 18
           Q218 18 236 32
           Q264 36 282 64
           Q302 94 330 122
           Q366 160 366 214
           V470"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.5"
        strokeLinejoin="round"
      />
    </svg>
    <div className="relative">{children}</div>
  </div>
);

export default PersianArch;
