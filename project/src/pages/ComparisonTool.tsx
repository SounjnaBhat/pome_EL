import { useEffect, useState } from 'react';
import { Globe, Tag, TrendingUp, Shield, Zap, Sliders, Star, CheckCircle, AlertCircle, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Category = Database['public']['Tables']['categories']['Row'];
type Country = Database['public']['Tables']['countries']['Row'];
type App = Database['public']['Tables']['apps']['Row'];
type AppFeatures = Database['public']['Tables']['app_features']['Row'];

interface UserPreferences {
  privacy: number;
  performance: number;
  easeOfUse: number;
  featureRichness: number;
  customization: number;
  supportQuality: number;
  priceSensitivity: number;
  serviceIntegration: number;
}

interface AppScore {
  app: App;
  features: AppFeatures;
  servicesCount: number;
  totalScore: number;
  integrationScore: number;
  breakdown: { [key: string]: number };
  recommendation: string;
}

export default function ComparisonTool() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [appDetails, setAppDetails] = useState<Map<string, { app: App; features: AppFeatures; servicesCount: number }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scoredApps, setScoredApps] = useState<AppScore[]>([]);

  const [preferences, setPreferences] = useState<UserPreferences>({
    privacy: 5,
    performance: 5,
    easeOfUse: 5,
    featureRichness: 5,
    customization: 5,
    supportQuality: 5,
    priceSensitivity: 5,
    serviceIntegration: 6,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCountry && selectedCategory) {
      loadApps();
    }
  }, [selectedCountry, selectedCategory]);

  const loadInitialData = async () => {
    try {
      const [countriesRes, categoriesRes] = await Promise.all([
        supabase.from('countries').select('*').order('name'),
        supabase.from('categories').select('*').order('name'),
      ]);

      if (countriesRes.data) setCountries(countriesRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);

      if (countriesRes.data && countriesRes.data.length > 0) {
        setSelectedCountry(countriesRes.data[0].id);
      }
      if (categoriesRes.data && categoriesRes.data.length > 0) {
        setSelectedCategory(categoriesRes.data[0].id);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApps = async () => {
    if (!selectedCountry || !selectedCategory) return;

    try {
      const { data: availableApps } = await supabase
        .from('app_availability')
        .select('app_id')
        .eq('country_id', selectedCountry)
        .eq('available', true);

      if (!availableApps) return;

      const appIds = availableApps.map((a) => a.app_id);

      const { data: appsData } = await supabase
        .from('apps')
        .select('*')
        .eq('category_id', selectedCategory)
        .in('id', appIds)
        .order('rating', { ascending: false });

      if (appsData) {
        setApps(appsData);
      }
    } catch (error) {
      console.error('Error loading apps:', error);
    }
  };

  const loadAppDetails = async (appId: string) => {
    if (appDetails.has(appId)) return;

    try {
      const [appRes, featuresRes, servicesRes] = await Promise.all([
        supabase.from('apps').select('*').eq('id', appId).maybeSingle(),
        supabase.from('app_features').select('*').eq('app_id', appId).maybeSingle(),
        supabase.from('app_services').select('*').eq('app_id', appId),
      ]);

      if (appRes.data && featuresRes.data) {
        const servicesCount = servicesRes.data ? servicesRes.data.length : 0;
        setAppDetails(new Map(appDetails.set(appId, { app: appRes.data, features: featuresRes.data, servicesCount })));
      }
    } catch (error) {
      console.error('Error loading app details:', error);
    }
  };

  const toggleAppSelection = async (appId: string) => {
    if (selectedApps.includes(appId)) {
      setSelectedApps(selectedApps.filter((id) => id !== appId));
    } else {
      if (selectedApps.length < 5) {
        setSelectedApps([...selectedApps, appId]);
        await loadAppDetails(appId);
      }
    }
  };

  const calculateIntegrationAdvantage = (servicesCount: number, maxServices: number): number => {
    if (servicesCount === 1) return 5;
    if (servicesCount === 2) return 7;
    if (servicesCount === 3) return 8.5;
    if (servicesCount >= 4) return 10;
    return 5;
  };

  const calculateScores = () => {
    const scored: AppScore[] = [];
    let maxServices = 1;

    selectedApps.forEach((appId) => {
      const detail = appDetails.get(appId);
      if (detail && detail.servicesCount > maxServices) {
        maxServices = detail.servicesCount;
      }
    });

    selectedApps.forEach((appId) => {
      const detail = appDetails.get(appId);
      if (!detail) return;

      const { app, features, servicesCount } = detail;

      const priceScore = preferences.priceSensitivity * (app.price === 0 ? 10 : Math.max(0, 10 - app.price));
      const privacyScore = preferences.privacy * features.privacy_score;
      const performanceScore = preferences.performance * features.performance_score;
      const easeOfUseScore = preferences.easeOfUse * features.ease_of_use_score;
      const featureRichnessScore = preferences.featureRichness * features.feature_richness_score;
      const customizationScore = preferences.customization * features.customization_score;
      const supportScore = preferences.supportQuality * features.support_quality_score;

      const integrationAdvantage = calculateIntegrationAdvantage(servicesCount, maxServices);
      const integrationScore = preferences.serviceIntegration * integrationAdvantage;

      const totalWeight =
        preferences.priceSensitivity +
        preferences.privacy +
        preferences.performance +
        preferences.easeOfUse +
        preferences.featureRichness +
        preferences.customization +
        preferences.supportQuality +
        preferences.serviceIntegration;

      const totalScore =
        (priceScore + privacyScore + performanceScore + easeOfUseScore + featureRichnessScore + customizationScore + supportScore + integrationScore) /
        totalWeight;

      const breakdown = {
        price: priceScore / (preferences.priceSensitivity || 1),
        privacy: privacyScore / (preferences.privacy || 1),
        performance: performanceScore / (preferences.performance || 1),
        easeOfUse: easeOfUseScore / (preferences.easeOfUse || 1),
        featureRichness: featureRichnessScore / (preferences.featureRichness || 1),
        customization: customizationScore / (preferences.customization || 1),
        support: supportScore / (preferences.supportQuality || 1),
        serviceIntegration: integrationAdvantage,
      };

      let recommendation = '';
      if (servicesCount > 1) {
        recommendation = `Multi-service platform advantage: Offers ${servicesCount} integrated services, reducing the need for multiple apps and improving convenience.`;
      } else {
        recommendation = `Specialized single-purpose app: Focused on food delivery with deep expertise in that domain.`;
      }

      scored.push({
        app,
        features,
        servicesCount,
        totalScore,
        integrationScore: integrationAdvantage,
        breakdown,
        recommendation,
      });
    });

    scored.sort((a, b) => b.totalScore - a.totalScore);
    setScoredApps(scored);
    setShowResults(true);
  };

  const getRecommendationText = () => {
    if (scoredApps.length === 0) return '';

    const winner = scoredApps[0];
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const featureAdvantages: string[] = [];

    Object.entries(winner.breakdown).forEach(([key, score]) => {
      if (score >= 8) strengths.push(key);
      if (score <= 4) weaknesses.push(key);
    });

    if (winner.servicesCount > 1) {
      featureAdvantages.push(`integrated multi-service platform with ${winner.servicesCount} services`);
    }
    if (winner.features.cross_platform) {
      featureAdvantages.push('seamless cross-platform experience');
    }
    if (winner.features.unique_features && winner.features.unique_features.length > 0) {
      featureAdvantages.push(`unique features including ${winner.features.unique_features.slice(0, 2).join(' and ')}`);
    }

    let text = `Based on your preferences, <strong>${winner.app.name}</strong> is the best match with a score of <strong>${winner.totalScore.toFixed(1)}/10</strong>. `;

    if (winner.servicesCount > 1) {
      text += `As a multi-service platform, ${winner.app.name} demonstrates product differentiation through service integration—a key characteristic of monopolistic competition. Instead of competing solely on price, it offers convenience through multiple integrated services (${winner.servicesCount} services), reducing user switching costs and creating a competitive advantage. `;
    }

    if (featureAdvantages.length > 0) {
      text += `Key advantages include ${featureAdvantages.join(', ')}. `;
    }

    if (strengths.length > 0) {
      text += `It excels in ${strengths.join(', ')}. `;
    }

    if (weaknesses.length > 0 && weaknesses.length < 3) {
      text += `Areas that could be improved include ${weaknesses.join(', ')}. `;
    }

    if (scoredApps.length > 1) {
      const runnerUp = scoredApps[1];
      text += `${runnerUp.app.name} is a close alternative (${runnerUp.totalScore.toFixed(1)}/10)`;
      if (runnerUp.servicesCount === 1 && winner.servicesCount > 1) {
        text += ` but focuses primarily on food delivery without the multi-service convenience that ${winner.app.name} offers`;
      }
      text += '.';
    }

    return text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comparison tool...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">App Comparison Tool</h1>
          <p className="text-xl text-green-100 max-w-3xl">
            Advanced comparison based on features, service integration, and your personal requirements
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Select Region & Category</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Country/Region
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-2" />
                    App Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Step 2: Select Apps to Compare ({selectedApps.length}/5)
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => toggleAppSelection(app.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedApps.includes(app.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{app.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{app.developer}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center text-yellow-600">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            {app.rating}
                          </span>
                          <span className="text-gray-600">{app.pricing_model}</span>
                        </div>
                      </div>
                      {selectedApps.includes(app.id) && (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedApps.length >= 2 && (
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Sliders className="w-5 h-5 mr-2" />
                {showPreferences ? 'Hide' : 'Set'} Your Preferences
              </button>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white sticky top-24">
              <h3 className="text-xl font-bold mb-4">How It Works</h3>
              <ol className="space-y-3 text-green-50">
                <li className="flex items-start">
                  <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    1
                  </span>
                  <span>Select your country and app category</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    2
                  </span>
                  <span>Choose 2-5 apps to compare</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    3
                  </span>
                  <span>Set preferences including service integration value</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    4
                  </span>
                  <span>Get detailed analysis of feature advantages and integration benefits</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {showPreferences && selectedApps.length >= 2 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Step 3: Customize Your Preferences
            </h2>
            <p className="text-gray-600 mb-6">
              Adjust the sliders to indicate how important each factor is to you (1 = not important, 10 = very important)
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(preferences).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 capitalize">
                      {key === 'serviceIntegration' ? 'Multi-Service Integration' : key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <span className="text-lg font-bold text-green-600">{value}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) =>
                      setPreferences({ ...preferences, [key]: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  {key === 'serviceIntegration' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Higher values favor apps that combine multiple services (e.g., food delivery + grocery)
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={calculateScores}
              className="mt-6 w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Calculate & Compare
            </button>
          </div>
        )}

        {showResults && scoredApps.length > 0 && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Personalized Recommendation</h2>
              <p
                className="text-lg text-green-50 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: getRecommendationText() }}
              />
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Layers className="w-6 h-6 mr-2" />
                Understanding Service Integration
              </h3>
              <p className="text-blue-100 mb-4 leading-relaxed">
                In monopolistic competition, apps differentiate not just on price but through service integration.
                Apps offering multiple services (food delivery + grocery + dine-out booking) create convenience-based advantages
                over single-purpose competitors. This reduces the need for multiple apps and increases user switching costs—a key form of non-price competition.
              </p>
              <p className="text-blue-100 leading-relaxed">
                For example, Swiggy's multi-service platform offers greater utility than Zomato's food-delivery focus,
                allowing it to maintain customer loyalty despite similar base services.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Detailed Comparison</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {scoredApps.map((scored, index) => (
                  <div key={scored.app.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className={`p-6 ${index === 0 ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gray-800'} text-white`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{scored.app.name}</h3>
                          <p className="text-sm opacity-90">{scored.app.developer}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">{scored.totalScore.toFixed(1)}</div>
                          <div className="text-sm opacity-90">/ 10</div>
                        </div>
                      </div>
                      {index === 0 && (
                        <div className="mt-3 inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                          Best Match
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      {scored.servicesCount > 1 && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-start">
                            <Layers className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-green-900">Multi-Service Platform</p>
                              <p className="text-sm text-green-700">{scored.servicesCount} integrated services</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4 mb-6">
                        {Object.entries(scored.breakdown).map(([key, score]) => (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700 capitalize">
                                {key === 'serviceIntegration' ? 'Service Integration' : key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="font-semibold text-gray-900">{score.toFixed(1)}/10</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${index === 0 ? 'bg-green-600' : 'bg-gray-600'}`}
                                style={{ width: `${(score / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          Key Strengths
                        </h4>
                        <div className="space-y-2">
                          {scored.features.unique_features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-start text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {scored.features.limitations.length > 0 && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                            Limitations
                          </h4>
                          <div className="space-y-2">
                            {scored.features.limitations.slice(0, 2).map((limitation, idx) => (
                              <div key={idx} className="flex items-start text-sm">
                                <AlertCircle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{limitation}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                        <span className="text-gray-600">Pricing: {scored.app.pricing_model}</span>
                        <span className="text-gray-600">Rating: {scored.app.rating}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
