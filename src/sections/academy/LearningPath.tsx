import { useReveal } from '../../hooks/useReveal';
import { useDrawPath } from '../../hooks/useDrawPath';

interface Step {
  number: number;
  title: string;
  description: string;
  delay: number;
  final?: boolean;
}

const STEPS: Step[] = [
  {
    number: 1,
    title: 'Foundations',
    description: 'Market structure, candles, sessions and your first clean chart.',
    delay: 0,
  },
  {
    number: 2,
    title: 'The System',
    description: 'Liquidity, risk models and the exact playbook traded live daily.',
    delay: 120,
  },
  {
    number: 3,
    title: 'Live Reps',
    description: 'Trade the plan in the live room with feedback on every rep.',
    delay: 240,
  },
  {
    number: 4,
    title: 'Scale Capital',
    description: 'Master execution protocols and scale real capital in Indian Markets & Crypto with rules.',
    delay: 360,
    final: true,
  },
];

function StepCard({ step }: { step: Step }) {
  const { ref, style } = useReveal<HTMLDivElement>({ delay: step.delay });

  return (
    <div ref={ref} className="relative text-center px-2" style={style}>
      <span
        className="relative z-[2] inline-flex items-center justify-center"
        style={{
          width: 52,
          height: 52,
          borderRadius: 999,
          background: step.final ? 'linear-gradient(135deg,#84cc16,#22c55e)' : '#0a0a0a',
          border: step.final ? 'none' : '1px solid rgba(34,197,94,0.5)',
          color: step.final ? '#000' : '#22c55e',
          fontWeight: 800,
          fontSize: 18,
          boxShadow: step.final
            ? '0 0 30px rgba(34,197,94,0.4)'
            : '0 0 24px rgba(34,197,94,0.25)',
          marginBottom: 18,
        }}
      >
        {step.number}
      </span>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
        {step.title}
      </div>
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.5)',
          fontWeight: 300,
        }}
      >
        {step.description}
      </div>
    </div>
  );
}

export default function LearningPath() {
  const pathRef = useDrawPath(2.2);

  return (
    <section className="relative mx-auto px-[18px] md:px-10" style={{ maxWidth: 1200, paddingTop: 40, paddingBottom: 90 }}>
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-5" style={{ rowGap: 40 }}>
        <svg
          viewBox="0 0 1120 8"
          preserveAspectRatio="none"
          className="hidden md:block"
          style={{
            position: 'absolute',
            top: 26,
            left: '6%',
            width: '88%',
            height: 8,
            pointerEvents: 'none',
          }}
        >
          <path
            ref={pathRef}
            d="M0,4 L1120,4"
            fill="none"
            stroke="rgba(34,197,94,0.45)"
            strokeWidth="2"
          />
        </svg>
        {STEPS.map((step) => (
          <StepCard key={step.number} step={step} />
        ))}
      </div>
    </section>
  );
}
