import { MessageCircle, Video, Music, Cloud, TrendingUp, Users, Target, Zap, Layers } from 'lucide-react';

export default function CaseStudies() {
  const caseStudies = [
    {
      category: 'Food Delivery & Multi-Service Platforms',
      icon: Layers,
      color: 'green',
      competitors: ['Swiggy', 'Zomato', 'Uber Eats', 'DoorDash'],
      marketOverview: 'The food delivery market exemplifies monopolistic competition with an interesting twist: multi-service integration as a differentiation strategy. Swiggy and Zomato compete not just on delivery speed and restaurant variety, but on service breadth—with Swiggy offering integrated grocery delivery, dine-out booking, and parcel services alongside food delivery.',
      differentiationStrategies: [
        {
          app: 'Swiggy',
          strategy: 'Multi-Service Integration & Convenience',
          description: 'Differentiates through a diversified service platform combining food delivery, grocery delivery (Instamart), dine-out restaurant bookings, and parcel delivery. This integrated approach creates a one-stop solution, reducing user switching costs and increasing daily engagement. Service breadth serves as a competitive moat.',
          strengths: ['Multiple integrated services', 'Reduced need for alternative apps', 'Swiggy One membership creates loyalty', 'Cross-service convenience', 'Higher switching costs due to ecosystem'],
          weaknesses: ['Lower focus on core food delivery quality', 'Service availability varies by city', 'Diluted brand focus'],
        },
        {
          app: 'Zomato',
          strategy: 'Food Delivery Excellence + Targeted Expansion',
          description: 'Focuses on food delivery mastery with additional features like restaurant discovery, ratings, and dine-out bookings. Recently expanded into Zomato Instantly (quick commerce) but maintains narrower service focus than Swiggy. Emphasizes deep expertise in food discovery and logistics.',
          strengths: ['Strong restaurant discovery engine', 'Excellent user ratings system', 'Focused on food delivery quality', 'Growing quick commerce presence', 'Better user experience for food-focused customers'],
          weaknesses: ['Limited service integration', 'Multiple apps needed for full utility', 'Less ecosystem lock-in', 'Competing against multi-service platforms'],
        },
        {
          app: 'Uber Eats',
          strategy: 'Global Scale + Partial Service Integration',
          description: 'Leverages Uber ecosystem (rides) while offering food delivery and limited grocery shopping through Uber Shop. International presence provides competitive advantage. Service integration is lighter than Swiggy but stronger than pure food delivery competitors.',
          strengths: ['Uber brand and ecosystem leverage', 'International scale', 'Grocery integration through Uber Shop', 'Network effects from ride-sharing', 'Unified payment system'],
          weaknesses: ['Service integration not as deep as Swiggy', 'Competition from local food delivery apps', 'Not available in all regions'],
        },
        {
          app: 'DoorDash',
          strategy: 'Pure Food Delivery Specialization',
          description: 'Maintains focused strategy on food delivery excellence without significant service integration. Competes on speed, restaurant selection, and delivery reliability rather than ecosystem breadth. Represents the single-purpose app approach.',
          strengths: ['Specialized expertise in food delivery', 'Fast, reliable service', 'Strong U.S. market position', 'Lower operational complexity'],
          weaknesses: ['No service integration advantage', 'Users must use other apps for other services', 'Smaller switching costs due to narrow utility', 'Vulnerable to multi-service competition'],
        },
      ],
      competitiveDynamics: 'This category demonstrates how service integration becomes a competitive weapon in monopolistic competition. Swiggy\'s multi-service approach creates convenience advantages (users satisfy multiple needs in one app) and higher switching costs. However, Zomato\'s specialization in food discovery appeals to users who prioritize food-delivery quality over breadth. DoorDash shows that specialization remains viable in niche markets or high-density areas. The market supports multiple strategies because user preferences vary—some value convenience (multi-service), others value specialization and quality (single-service).',
      economicInsights: [
        'Service integration creates differentiation without price competition',
        'Multi-service platforms increase switching costs through ecosystem lock-in',
        'Convenience-based differentiation commands premium pricing or loyalty',
        'Specialization remains competitive against integration through quality focus',
        'Network effects strengthen both focused and integrated platforms',
        'Marginal cost reduction from service bundling enables profitability',
      ],
    },
    {
      category: 'Messaging Apps',
      icon: MessageCircle,
      color: 'blue',
      competitors: ['WhatsApp', 'Telegram', 'Signal', 'Discord', 'Slack'],
      marketOverview: 'The messaging app market demonstrates classic monopolistic competition with numerous players offering similar core functionality (text, voice, video) but differentiated through features, privacy, and target audiences.',
      differentiationStrategies: [
        {
          app: 'WhatsApp',
          strategy: 'Mass Market Appeal',
          description: 'Focuses on simplicity, broad adoption, and network effects. Free for all users with minimal features but maximum reach. Differentiates through ease of use and Meta ecosystem integration.',
          strengths: ['Largest user base', 'Simple interface', 'Cross-platform'],
          weaknesses: ['Privacy concerns', 'Limited features', 'Meta ownership'],
        },
        {
          app: 'Telegram',
          strategy: 'Feature-Rich Alternative',
          description: 'Competes on advanced features like channels, bots, large file transfers, and cloud storage. Targets power users who need more than basic messaging.',
          strengths: ['Rich features', 'Cloud-based', 'No storage limits'],
          weaknesses: ['Not E2E encrypted by default', 'Smaller network'],
        },
        {
          app: 'Signal',
          strategy: 'Privacy-First Positioning',
          description: 'Differentiates entirely on privacy and security. Open-source, non-profit, with end-to-end encryption by default. Appeals to privacy-conscious users.',
          strengths: ['Maximum privacy', 'Open source', 'No ads'],
          weaknesses: ['Fewer features', 'Smaller user base', 'Phone number required'],
        },
      ],
      competitiveDynamics: 'Network effects create high switching costs, but privacy scandals and feature gaps allow competitors to gain market share. Users often maintain multiple messaging apps simultaneously, reducing the winner-take-all effect.',
      economicInsights: [
        'Free pricing model shifts competition to features and privacy',
        'Network effects create temporary monopolistic advantages',
        'Low marginal costs allow sustainable free tier operations',
        'Differentiation prevents price-based competition',
      ],
    },
    {
      category: 'Video Streaming',
      icon: Video,
      color: 'red',
      competitors: ['Netflix', 'Disney+', 'Amazon Prime Video', 'YouTube Premium'],
      marketOverview: 'Streaming services exhibit monopolistic competition with high content differentiation. Each platform offers unique original content, creating imperfect substitutes that justify subscription fees.',
      differentiationStrategies: [
        {
          app: 'Netflix',
          strategy: 'Original Content Leadership',
          description: 'Heavy investment in original series and films creates exclusive content library. Pioneered binge-watching culture and personalized recommendations.',
          strengths: ['Largest original content library', 'Strong recommendations', 'Global presence'],
          weaknesses: ['Rising prices', 'Content rotation', 'Password sharing crackdown'],
        },
        {
          app: 'Disney+',
          strategy: 'Premium Brand Portfolio',
          description: 'Leverages Disney, Pixar, Marvel, and Star Wars franchises. Family-friendly positioning with irreplaceable content.',
          strengths: ['Exclusive franchises', 'Family appeal', '4K quality'],
          weaknesses: ['Smaller catalog', 'Limited mature content', 'Regional variations'],
        },
        {
          app: 'YouTube Premium',
          strategy: 'User-Generated + Professional',
          description: 'Combines free user-generated content with premium ad-free experience. Leverages massive creator ecosystem.',
          strengths: ['Largest video library', 'Creator diversity', 'Music included'],
          weaknesses: ['Content quality varies', 'Ad-heavy free tier', 'UI complexity'],
        },
      ],
      competitiveDynamics: 'Content exclusivity creates differentiation. Consumers subscribe to multiple services simultaneously, with average households having 3-4 subscriptions. Competition focuses on content quality rather than price.',
      economicInsights: [
        'High fixed costs in content production create barriers',
        'Exclusive content generates pricing power',
        'Multiple subscriptions reflect strong product differentiation',
        'Bundling strategies (Amazon Prime) increase value perception',
      ],
    },
    {
      category: 'Music Streaming',
      icon: Music,
      color: 'green',
      competitors: ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music'],
      marketOverview: 'Music streaming shows intense monopolistic competition with similar content libraries but differentiated through features, pricing, and ecosystem integration.',
      differentiationStrategies: [
        {
          app: 'Spotify',
          strategy: 'Discovery & Personalization',
          description: 'Leads in algorithmic playlists (Discover Weekly) and social features. Freemium model maximizes user base while converting to premium.',
          strengths: ['Best discovery algorithms', 'Social features', 'Podcast integration'],
          weaknesses: ['Artist payout controversies', 'Ads on free tier', 'Limited lossless audio'],
        },
        {
          app: 'Apple Music',
          strategy: 'Quality & Ecosystem',
          description: 'Differentiates on audio quality (lossless, spatial audio) and deep Apple ecosystem integration. No free tier forces subscription commitment.',
          strengths: ['Lossless audio', 'Apple integration', 'Offline listening'],
          weaknesses: ['No free tier', 'Best on Apple devices', 'Weaker discovery'],
        },
        {
          app: 'YouTube Music',
          strategy: 'Video Integration',
          description: 'Unique advantage of music videos and live performances. Bundles with YouTube Premium for comprehensive video and music access.',
          strengths: ['Music videos', 'Huge library', 'YouTube integration'],
          weaknesses: ['Confusing UI', 'Requires premium for background play', 'Less polished'],
        },
      ],
      competitiveDynamics: 'Similar content libraries reduce differentiation, forcing competition on UX, discovery algorithms, and ecosystem lock-in. Free tiers acquire users while premium subscriptions generate revenue.',
      economicInsights: [
        'Licensing costs standardize content availability',
        'Differentiation shifts to software and algorithms',
        'Freemium models balance market share and profitability',
        'Platform lock-in creates switching costs',
      ],
    },
    {
      category: 'Cloud Storage',
      icon: Cloud,
      color: 'purple',
      competitors: ['Google Drive', 'Dropbox', 'OneDrive', 'iCloud'],
      marketOverview: 'Cloud storage exhibits monopolistic competition with differentiation through ecosystem integration, collaboration features, and pricing tiers rather than core storage functionality.',
      differentiationStrategies: [
        {
          app: 'Google Drive',
          strategy: 'Integration & Collaboration',
          description: 'Tight integration with Google Workspace (Docs, Sheets, Gmail). Emphasizes real-time collaboration and search capabilities.',
          strengths: ['Google Workspace integration', 'Generous free tier', 'Search functionality'],
          weaknesses: ['Privacy concerns', 'Account dependency', 'Complex pricing'],
        },
        {
          app: 'Dropbox',
          strategy: 'Simplicity & Reliability',
          description: 'Pioneered simple file syncing. Focuses on reliability, ease of use, and universal compatibility across platforms.',
          strengths: ['Reliable syncing', 'Universal compatibility', 'Smart Sync'],
          weaknesses: ['Expensive', 'Smaller free tier', 'Fewer features'],
        },
        {
          app: 'iCloud',
          strategy: 'Apple Ecosystem Lock-in',
          description: 'Seamlessly integrated with Apple devices. Automatic backups and device syncing create ecosystem stickiness.',
          strengths: ['Apple integration', 'Automatic backups', 'Privacy focused'],
          weaknesses: ['Apple devices only', 'Limited free storage', 'Windows app quality'],
        },
      ],
      competitiveDynamics: 'Ecosystem integration creates strong differentiation. Users often locked into their existing platform ecosystem (Google, Microsoft, Apple), reducing direct competition.',
      economicInsights: [
        'Ecosystem lock-in reduces price elasticity',
        'Free tiers acquire users, paid tiers monetize',
        'Commoditized storage differentiated by features',
        'Enterprise and consumer markets have different dynamics',
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; border: string; gradient: string } } = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500', gradient: 'from-blue-600 to-blue-700' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-500', gradient: 'from-red-600 to-red-700' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500', gradient: 'from-green-600 to-green-700' },
      purple: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-500', gradient: 'from-gray-600 to-gray-700' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Case Studies</h1>
          <p className="text-xl text-orange-100 max-w-3xl">
            In-depth analysis of competition dynamics and differentiation strategies across mobile app categories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Analyzing Real-World Competition
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            These case studies examine how apps within specific categories demonstrate monopolistic
            competition principles. Each category shows different competitive dynamics, differentiation
            strategies, and market outcomes.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Understanding these patterns helps explain why certain apps succeed, how they maintain market
            share despite competition, and what drives innovation in mature markets.
          </p>
        </div>

        <div className="space-y-12">
          {caseStudies.map((study, index) => {
            const Icon = study.icon;
            const colors = getColorClasses(study.color);

            return (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className={`bg-gradient-to-r ${colors.gradient} text-white p-8`}>
                  <div className="flex items-center mb-4">
                    <div className="bg-white/20 p-3 rounded-lg mr-4">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{study.category}</h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {study.competitors.map((comp, idx) => (
                          <span
                            key={idx}
                            className="bg-white/20 px-3 py-1 rounded-full text-sm"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-orange-600" />
                      Market Overview
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{study.marketOverview}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-orange-600" />
                      Differentiation Strategies
                    </h3>
                    <div className="space-y-6">
                      {study.differentiationStrategies.map((strategy, idx) => (
                        <div
                          key={idx}
                          className="border-l-4 border-orange-500 pl-6 py-2"
                        >
                          <div className="mb-3">
                            <h4 className="text-lg font-bold text-gray-900">{strategy.app}</h4>
                            <p className="text-sm font-semibold text-orange-600">
                              {strategy.strategy}
                            </p>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {strategy.description}
                          </p>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-2">
                                Strengths:
                              </p>
                              <ul className="space-y-1">
                                {strategy.strengths.map((strength, sIdx) => (
                                  <li
                                    key={sIdx}
                                    className="text-sm text-gray-700 flex items-start"
                                  >
                                    <span className="text-green-600 mr-2">✓</span>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-2">
                                Weaknesses:
                              </p>
                              <ul className="space-y-1">
                                {strategy.weaknesses.map((weakness, wIdx) => (
                                  <li
                                    key={wIdx}
                                    className="text-sm text-gray-700 flex items-start"
                                  >
                                    <span className="text-red-600 mr-2">✗</span>
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8 bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-orange-600" />
                      Competitive Dynamics
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {study.competitiveDynamics}
                    </p>
                  </div>

                  <div className={`bg-gradient-to-br ${colors.gradient} rounded-xl p-6 text-white`}>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Economic Insights
                    </h3>
                    <ul className="space-y-2">
                      {study.economicInsights.map((insight, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-3 font-bold">•</span>
                          <span className="flex-1">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl shadow-lg p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Key Takeaways Across Categories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-100">
                Common Patterns
              </h3>
              <ul className="space-y-3 text-orange-50">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Product differentiation reduces direct price competition</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Network effects and ecosystem lock-in create switching costs</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Free tiers acquire users while premium tiers generate revenue</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Innovation focuses on features rather than price</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-100">
                Market Outcomes
              </h3>
              <ul className="space-y-3 text-orange-50">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Multiple successful competitors coexist in each category</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Consumers benefit from variety and specialized solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Entry remains possible but requires significant differentiation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Long-run profits approach zero despite short-term success</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
