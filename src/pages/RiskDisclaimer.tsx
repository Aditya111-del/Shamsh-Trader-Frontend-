

export default function RiskDisclaimer() {
  return (
    <div className="min-h-screen text-white pt-[150px] pb-24 px-6 max-w-4xl mx-auto" style={{ background: '#050705' }}>
      <h1 className="text-4xl md:text-5xl font-bold mb-10" style={{ letterSpacing: '-0.03em' }}>
        Risk Disclaimer
      </h1>
      <div className="space-y-8 text-white/60 leading-relaxed font-light">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">High Risk Warning</h2>
          <p>
            Trading foreign exchange, cryptocurrencies, stocks, commodities, and other financial instruments on margin carries a high level of risk, and may not be suitable for all investors. The high degree of leverage can work against you as well as for you.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">No Investment Advice</h2>
          <p>
            Before deciding to trade in the financial markets you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Educational Content Only</h2>
          <p>
            Any opinions, news, research, analyses, prices, or other information contained on this website is provided as general market commentary, and does not constitute investment advice. Shamsh Trader will not accept liability for any loss or damage, including without limitation to, any loss of profit, which may arise directly or indirectly from use of or reliance on such information.
          </p>
        </section>
      </div>
    </div>
  );
}
