import { TrendingUp, Users, Zap, Target, Layers, ChevronRight } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const characteristics = [
    {
      icon: Users,
      title: 'Many Sellers',
      description: 'Hundreds of app developers compete in each category, from social media to productivity.',
    },
    {
      icon: Layers,
      title: 'Product Differentiation',
      description: 'Apps distinguish themselves through unique features, design, pricing models, and user experience.',
    },
    {
      icon: Target,
      title: 'Low Entry Barriers',
      description: 'New developers can enter the market relatively easily through app stores, though success requires innovation.',
    },
    {
      icon: TrendingUp,
      title: 'Market Power',
      description: 'Popular apps have some pricing power due to brand loyalty, network effects, and unique features.',
    },
    {
      icon: Zap,
      title: 'Non-Price Competition',
      description: 'Companies compete through features, user interface, privacy, performance, and ecosystem integration.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Monopolistic Competition in
            <span className="text-blue-600"> Mobile App Ecosystems</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            An interactive analysis of how mobile applications compete in markets characterized by
            product differentiation, multiple competitors, and varying degrees of market power.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            What is Monopolistic Competition?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Monopolistic competition is a market structure where many firms sell products that are
            similar but not identical. In the mobile app ecosystem, this manifests through thousands
            of apps competing within categories like messaging, streaming, or productivity, each
            offering unique features to attract users.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Unlike perfect competition where products are identical, or monopolies where one firm
            dominates, monopolistic competition allows firms to have some control over pricing through
            differentiation, while still facing significant competition from alternatives.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Key Characteristics in App Markets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characteristics.map((char, index) => {
              const Icon = char.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 ml-4">{char.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{char.description}</p>
                </div>
              );
            })}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-3">Ready to Explore?</h3>
              <p className="mb-4 text-blue-100">
                Dive deeper into economic theory and real-world examples of monopolistic competition
                in app markets.
              </p>
              <button
                onClick={() => onNavigate('theory')}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                Learn the Theory
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('theory')}
            className="bg-white rounded-xl shadow-lg p-8 text-left hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Economic Theory</h3>
            <p className="text-gray-600 mb-4">
              Explore the theoretical framework behind monopolistic competition with app market examples.
            </p>
            <span className="text-blue-600 font-medium flex items-center">
              Explore Theory <ChevronRight className="ml-2 w-5 h-5" />
            </span>
          </button>

          <button
            onClick={() => onNavigate('comparison')}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-left hover:shadow-xl transition-all text-white"
          >
            <h3 className="text-2xl font-bold mb-3">Comparison Tool</h3>
            <p className="text-blue-100 mb-4">
              Compare apps across categories, regions, and your personal requirements.
            </p>
            <span className="text-white font-medium flex items-center">
              Start Comparing <ChevronRight className="ml-2 w-5 h-5" />
            </span>
          </button>

          <button
            onClick={() => onNavigate('case-studies')}
            className="bg-white rounded-xl shadow-lg p-8 text-left hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Case Studies</h3>
            <p className="text-gray-600 mb-4">
              Analyze real competition dynamics and differentiation strategies in various app categories.
            </p>
            <span className="text-blue-600 font-medium flex items-center">
              View Cases <ChevronRight className="ml-2 w-5 h-5" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
