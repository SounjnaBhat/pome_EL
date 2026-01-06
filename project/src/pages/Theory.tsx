import { TrendingUp, DollarSign, Users, Target, CheckCircle, XCircle } from 'lucide-react';

export default function Theory() {
  const marketStructures = [
    {
      name: 'Perfect Competition',
      examples: 'Agricultural commodities',
      firms: 'Many',
      product: 'Identical',
      entry: 'Free',
      pricing: 'Price takers',
      profitLongRun: 'Zero economic profit',
    },
    {
      name: 'Monopolistic Competition',
      examples: 'Mobile apps, restaurants',
      firms: 'Many',
      product: 'Differentiated',
      entry: 'Relatively free',
      pricing: 'Some control',
      profitLongRun: 'Zero economic profit',
      highlight: true,
    },
    {
      name: 'Oligopoly',
      examples: 'Smartphones, airlines',
      firms: 'Few',
      product: 'Identical or differentiated',
      entry: 'Barriers exist',
      pricing: 'Strategic pricing',
      profitLongRun: 'Positive profit possible',
    },
    {
      name: 'Monopoly',
      examples: 'Utilities, patents',
      firms: 'One',
      product: 'Unique',
      entry: 'Blocked',
      pricing: 'Price maker',
      profitLongRun: 'Positive profit',
    },
  ];

  const appExamples = [
    {
      category: 'Social Media',
      apps: ['Facebook', 'Instagram', 'TikTok', 'Twitter/X', 'Snapchat'],
      differentiation: [
        'Content format (short video, photos, text)',
        'Target demographic and age groups',
        'Privacy and data policies',
        'Algorithm and content discovery',
        'Monetization models',
      ],
      competition: 'High - users often use multiple platforms simultaneously',
    },
    {
      category: 'Messaging',
      apps: ['WhatsApp', 'Telegram', 'Signal', 'Discord', 'Slack'],
      differentiation: [
        'Privacy and encryption levels',
        'Feature richness (bots, channels, groups)',
        'Target audience (personal vs. professional)',
        'Platform integration',
        'File sharing capabilities',
      ],
      competition: 'Very High - network effects create strong differentiation',
    },
    {
      category: 'Streaming',
      apps: ['Netflix', 'Disney+', 'Amazon Prime Video', 'YouTube'],
      differentiation: [
        'Content library and exclusives',
        'Pricing models and tiers',
        'Video quality and features',
        'Original productions',
        'Bundle offerings',
      ],
      competition: 'Medium-High - users subscribe to multiple services',
    },
  ];

  const characteristics = [
    {
      title: 'Short-Run Market Power',
      description:
        'In the short run, app developers with unique features or strong brands can charge premium prices or adopt profitable freemium models. Network effects and user lock-in provide temporary monopolistic advantages.',
      icon: DollarSign,
    },
    {
      title: 'Long-Run Competition',
      description:
        'As successful apps demonstrate profitability, new competitors enter the market with similar features. This competition drives economic profits toward zero, though strong brands maintain user bases through differentiation.',
      icon: TrendingUp,
    },
    {
      title: 'Product Differentiation',
      description:
        'Apps differentiate through user interface design, unique features, privacy policies, performance optimization, platform exclusivity, and ecosystem integration. This allows them to avoid direct price competition.',
      icon: Target,
    },
    {
      title: 'Excess Capacity',
      description:
        'Apps typically operate below their optimal scale in the long run. Most apps have fewer users than their profit-maximizing quantity, but product variety benefits consumers through choice and specialized solutions.',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Economic Theory</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Understanding monopolistic competition through the lens of mobile app markets
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Monopolistic Competition Defined
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Monopolistic competition describes a market structure with the following characteristics:
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Many Sellers and Buyers</h3>
                <p className="text-gray-600">
                  Thousands of app developers and millions of users participate in each category,
                  ensuring no single firm can dominate the entire market.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Differentiated Products</h3>
                <p className="text-gray-600">
                  Each app offers a unique combination of features, design, performance, and user
                  experience, making them imperfect substitutes.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Free Entry and Exit</h3>
                <p className="text-gray-600">
                  App stores provide relatively low barriers to entry. Developers can publish apps
                  with minimal upfront costs, though achieving success requires significant effort.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Some Pricing Power</h3>
                <p className="text-gray-600">
                  Due to differentiation and brand loyalty, successful apps can charge premium prices
                  or adopt profitable subscription models without losing all users.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Comparing Market Structures
          </h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Structure
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Examples
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Number of Firms
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Product Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Market Entry
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Pricing Power
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {marketStructures.map((structure, index) => (
                    <tr
                      key={index}
                      className={structure.highlight ? 'bg-blue-50' : 'hover:bg-gray-50'}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{structure.name}</td>
                      <td className="px-6 py-4 text-gray-600">{structure.examples}</td>
                      <td className="px-6 py-4 text-gray-600">{structure.firms}</td>
                      <td className="px-6 py-4 text-gray-600">{structure.product}</td>
                      <td className="px-6 py-4 text-gray-600">{structure.entry}</td>
                      <td className="px-6 py-4 text-gray-600">{structure.pricing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Key Economic Characteristics
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {characteristics.map((char, index) => {
              const Icon = char.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 ml-4">{char.title}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{char.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Real-World Examples: App Market Differentiation
          </h2>
          <div className="space-y-6">
            {appExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{example.category}</h3>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Major Competitors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {example.apps.map((app, appIndex) => (
                      <span
                        key={appIndex}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Differentiation Strategies:
                  </h4>
                  <ul className="space-y-2">
                    {example.differentiation.map((diff, diffIndex) => (
                      <li key={diffIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Competition Level:</h4>
                  <p className="text-gray-700">{example.competition}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Why Does This Matter?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-100">For Consumers</h3>
              <ul className="space-y-2 text-blue-50">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Greater product variety and choice</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Innovation driven by competition</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Apps tailored to specific needs</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Higher prices than perfect competition</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-100">For Developers</h3>
              <ul className="space-y-2 text-blue-50">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Opportunity to differentiate and succeed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Some pricing power through unique features</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Constant pressure to innovate</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Zero economic profit in the long run</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
