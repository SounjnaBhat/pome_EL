import { CheckCircle, TrendingUp, Users, Lightbulb, BookOpen, Target } from 'lucide-react';

interface ConclusionProps {
  onNavigate: (page: string) => void;
}

export default function Conclusion({ onNavigate }: ConclusionProps) {
  const keyFindings = [
    {
      title: 'Market Structure Confirmed',
      description: 'Mobile app ecosystems clearly demonstrate monopolistic competition with many sellers, differentiated products, relatively free entry, and some pricing power.',
      icon: Target,
    },
    {
      title: 'Differentiation is Key',
      description: 'Apps compete primarily on features, user experience, privacy, and ecosystem integration rather than price, creating sustainable competitive advantages.',
      icon: Lightbulb,
    },
    {
      title: 'Network Effects Matter',
      description: 'Social apps benefit from network effects that create temporary monopolistic positions, but differentiation allows multiple platforms to coexist.',
      icon: Users,
    },
    {
      title: 'Innovation Drives Competition',
      description: 'Constant innovation is necessary to maintain market share as competitors quickly replicate successful features, driving economic profits toward zero.',
      icon: TrendingUp,
    },
  ];

  const practicalTakeaways = [
    {
      audience: 'For Consumers',
      insights: [
        'Enjoy product variety and choice across categories',
        'Benefit from competitive innovation and feature improvements',
        'Can switch between alternatives with varying degrees of friction',
        'Should evaluate apps based on personal priorities (privacy vs features)',
        'Recognize that free apps monetize through data or future upgrades',
      ],
    },
    {
      audience: 'For Developers',
      insights: [
        'Differentiation is essential for success in crowded markets',
        'Network effects and ecosystem integration create defensible positions',
        'Free tiers or freemium models are necessary for user acquisition',
        'Long-run profitability requires continuous innovation',
        'Niche targeting can be more effective than broad competition',
      ],
    },
    {
      audience: 'For Economists',
      insights: [
        'App markets validate monopolistic competition theory predictions',
        'Digital goods economics (low marginal costs) enables free tiers',
        'Platform effects create unique competitive dynamics',
        'Excess capacity exists as apps operate below optimal scale',
        'Consumer surplus is high due to free access and variety',
      ],
    },
  ];

  const economicImplications = [
    {
      concept: 'Allocative Efficiency',
      analysis: 'App markets are not allocatively efficient as prices exceed marginal costs. However, consumer welfare remains high due to free tiers and product variety.',
    },
    {
      concept: 'Productive Efficiency',
      analysis: 'Apps operate with excess capacity below their minimum efficient scale. This inefficiency is offset by increased product diversity serving specialized needs.',
    },
    {
      concept: 'Dynamic Efficiency',
      analysis: 'Strong dynamic efficiency through continuous innovation. Competition drives rapid feature development and technological advancement.',
    },
    {
      concept: 'Consumer Welfare',
      analysis: 'High consumer welfare due to variety, innovation, and predominantly free or low-cost access. Choice allows consumers to match apps to preferences.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Conclusion</h1>
          <p className="text-xl text-teal-100 max-w-3xl">
            Synthesizing findings, economic insights, and practical implications
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Summary of Analysis
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            This analysis has demonstrated that mobile app ecosystems represent a textbook example of
            monopolistic competition. Through examination of multiple app categories, we observed the
            defining characteristics: numerous competitors, differentiated products, relatively free
            market entry, and firms with some degree of pricing power.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            The comparison tool revealed how apps differentiate across multiple dimensions including
            privacy, performance, features, and user experience. These differences create imperfect
            substitutes that allow multiple successful competitors to coexist within each category.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Case studies of messaging, streaming, music, and cloud storage apps illustrated how
            differentiation strategies vary by category but consistently enable firms to avoid direct
            price competition while maintaining market share through unique value propositions.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Findings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {keyFindings.map((finding, index) => {
              const Icon = finding.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start mb-4">
                    <div className="bg-teal-100 p-3 rounded-lg mr-4">
                      <Icon className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{finding.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{finding.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Economic Implications
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {economicImplications.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.concept}</h3>
                <p className="text-gray-700 leading-relaxed">{item.analysis}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Practical Takeaways
          </h2>
          <div className="space-y-6">
            {practicalTakeaways.map((section, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-teal-600">
                  {section.audience}
                </h3>
                <ul className="space-y-3">
                  {section.insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl shadow-lg p-8 md:p-12 text-white mb-12">
          <h2 className="text-3xl font-bold mb-6">Why This Matters</h2>
          <div className="space-y-4 text-lg text-teal-50 leading-relaxed">
            <p>
              Understanding monopolistic competition in app markets helps explain why we see such
              incredible variety in applications, why innovation happens so rapidly, and why most
              consumers enjoy free or low-cost access to sophisticated software.
            </p>
            <p>
              The competitive dynamics we've analyzed drive continuous improvement. As soon as one app
              introduces a successful feature, competitors must innovate further to differentiate.
              This cycle benefits consumers through constant innovation while challenging developers
              to maintain relevance.
            </p>
            <p>
              From a policy perspective, these markets generally function well without intervention.
              Low barriers to entry, intense competition, and high consumer welfare suggest that
              monopolistic competition in app ecosystems achieves socially beneficial outcomes despite
              theoretical inefficiencies.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Future Considerations
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Platform Power and Market Dynamics
              </h3>
              <p className="text-gray-700 leading-relaxed">
                While individual app categories exhibit monopolistic competition, the platform layer
                (Apple App Store, Google Play Store) represents an oligopoly. These platforms control
                distribution and take significant revenue shares, affecting competitive dynamics within
                app markets.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Privacy and Data Regulation
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Emerging privacy regulations (GDPR, CCPA) are changing competitive dynamics by limiting
                data collection and targeted advertising. This shift may increase differentiation based
                on privacy features and alter the viability of ad-supported business models.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Artificial Intelligence Integration
              </h3>
              <p className="text-gray-700 leading-relaxed">
                AI integration is becoming a major differentiation factor. Apps leveraging AI for
                personalization, automation, and enhanced functionality may gain competitive advantages,
                potentially creating new barriers to entry for resource-constrained developers.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('home')}
            className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-all border-2 border-transparent hover:border-teal-500"
          >
            <BookOpen className="w-10 h-10 text-teal-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Over</h3>
            <p className="text-gray-600">Return to the home page and explore from the beginning</p>
          </button>

          <button
            onClick={() => onNavigate('comparison')}
            className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-all text-white"
          >
            <Target className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Try the Tool</h3>
            <p className="text-teal-100">Use the comparison tool to analyze apps yourself</p>
          </button>

          <button
            onClick={() => onNavigate('theory')}
            className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-all border-2 border-transparent hover:border-teal-500"
          >
            <TrendingUp className="w-10 h-10 text-teal-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Review Theory</h3>
            <p className="text-gray-600">Revisit the economic theory and concepts</p>
          </button>
        </div>
      </div>
    </div>
  );
}
