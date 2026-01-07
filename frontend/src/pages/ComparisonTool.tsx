import { useEffect, useState } from 'react';
import {
  Globe,
  Tag,
  TrendingUp,
  Sliders,
  Star,
  CheckCircle,
  AlertCircle,
  Layers,
  Link as LinkIcon,
  Plus,
  X,
} from 'lucide-react';

// ---------- TYPES DERIVED FROM BACKEND CSV & ANALYTICS ----------

interface CategoryOption {
  id: string;
  name: string;
}

interface CountryOption {
  // Used conceptually as "region / platform" selector
  id: string;
  name: string;
}

interface DatasetApp {
  app_name: string;
  developer: string;
  rating: number;
  price_inr: number;
  price_type: string;
  ai_reason?: string;
  ai_rank?: number;
  selection_method?: string;
}

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

interface SelectedApp {
  id: string;
  name: string;
  mode: 'FULL' | 'PARTIAL';
}

interface AppScore {
  appName: string;
  mode: 'FULL' | 'PARTIAL';
  totalScore: number;
  breakdown: { [key: string]: number };
  attributesUsed: string[];
  attributesExcluded: string[];
  recommendation: string;
}

interface AnalyticsScenarioRanking {
  scenario: string;
  ranked: {
    app: string;
    score: number;
    breakdown: {
      feature: string;
      value: number;
      weight: number;
      contribution: number;
      normalized_share: number;
    }[];
  }[];
}

interface AnalyticsExplainability {
  app: string;
  score: number;
  breakdown: {
    feature: string;
    value: number;
    weight: number;
    contribution: number;
    normalized_share: number;
  }[];
}

interface AnalyticsFDIEntry {
  app_name: string;
  dominance_index: number;
}

interface AnalyticsRegionalEntry {
  region: string;
  count: number;
  dominance: AnalyticsFDIEntry[];
}

interface GraphOutputs {
  feature_contributions: { [appName: string]: { [feature: string]: number } };
  dominance_vs_popularity: Array<{
    app_name: string;
    dominance_index: number;
    popularity_score: number;
  }>;
  confusion_by_category: { [category: string]: number };
}

interface AnalyticsResponse {
  fdi: AnalyticsFDIEntry[];
  consumerConfusion: number;
  scenarios: AnalyticsScenarioRanking[];
  explainability: AnalyticsExplainability[];
  regionalAsymmetry: AnalyticsRegionalEntry[];
  aiOverview?: string;
  graphOutputs?: GraphOutputs;
}

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function ComparisonTool() {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [apps, setApps] = useState<DatasetApp[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedApps, setSelectedApps] = useState<SelectedApp[]>([]);
  const [appInput, setAppInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [validatingLink, setValidatingLink] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scoredApps, setScoredApps] = useState<AppScore[]>([]);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);

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
      // All metadata now comes from the CSV-backed Python backend
      const response = await fetch(`${BACKEND_URL}/api/metadata`);
      const metadata = await response.json();

      const categoryOptions: CategoryOption[] = (metadata.categories || []).map(
        (name: string) => ({ id: name, name })
      );
      const countryOptions: CountryOption[] = (metadata.regions || []).map(
        (name: string) => ({ id: name, name })
      );

      setCategories(categoryOptions);
      setCountries(countryOptions);

      if (countryOptions.length > 0) {
        setSelectedCountry(countryOptions[0].id);
      }
      if (categoryOptions.length > 0) {
        setSelectedCategory(categoryOptions[0].id);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Failed to load countries and categories');
    } finally {
      setLoading(false);
    }
  };

  const loadApps = async () => {
    if (!selectedCountry || !selectedCategory) return;

    try {
      // Browse apps using Gemini-powered intelligent selection
      const params = new URLSearchParams();
      params.set('query', '');
      params.set('category', selectedCategory);
      params.set('use_intelligent_selection', 'true'); // Explicitly enable Gemini selection

      console.log('Loading apps with Gemini intelligent selection for category:', selectedCategory);
      const response = await fetch(`${BACKEND_URL}/api/apps/search?${params.toString()}`);
      const appsData: DatasetApp[] = await response.json();
      
      // Log selection method for verification
      const geminiApps = appsData.filter(app => app.selection_method === 'gemini');
      const traditionalApps = appsData.filter(app => app.selection_method === 'traditional');
      console.log(`Apps loaded: ${appsData.length} total | ${geminiApps.length} Gemini-selected | ${traditionalApps.length} Traditional`);
      
      if (geminiApps.length > 0) {
        console.log('Gemini-selected apps:', geminiApps.map(a => a.app_name));
      }
      
      setApps(appsData);
    } catch (error) {
      console.error('Error loading apps:', error);
      setError('Failed to load apps');
    }
  };

  const validateAndAddApp = async () => {
    if (!appInput.trim()) return;

    setValidatingLink(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/apps/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appName: appInput.trim(),
        }),
      });

      const validationResult: { existsInDataset: boolean; comparisonMode: 'FULL' | 'PARTIAL' } =
        await response.json();

      const newApp: SelectedApp = {
        id: `${validationResult.existsInDataset ? 'dataset' : 'external'}-${appInput.trim()}`,
        name: appInput.trim(),
        mode: validationResult.comparisonMode,
      };

      if (selectedApps.length < 5) {
        setSelectedApps([...selectedApps, newApp]);
        setAppInput('');
      } else {
        setError('Maximum 5 apps can be compared');
      }
    } catch (err) {
      setError('Failed to validate app. Please try again.');
      console.error('Validation error:', err);
    } finally {
      setValidatingLink(false);
    }
  };

  const togglePresetApp = async (app: DatasetApp) => {
    const isSelected = selectedApps.some((a) => a.name === app.app_name);

    if (isSelected) {
      setSelectedApps(selectedApps.filter((a) => a.name !== app.app_name));
    } else {
      if (selectedApps.length < 5) {
        const newApp: SelectedApp = {
          id: `dataset-${app.app_name}`,
          name: app.app_name,
          mode: 'FULL',
        };
        setSelectedApps([...selectedApps, newApp]);
      } else {
        setError('Maximum 5 apps can be compared');
      }
    }
  };

  const removeApp = (appId: string) => {
    setSelectedApps(selectedApps.filter((a) => a.id !== appId));
  };

  const calculateScores = async () => {
    try {
      setError('');

      const appsPayload = selectedApps.map((a) => ({
        appName: a.name,
        comparisonMode: a.mode,
      }));

      const apiPreferences = {
        rating: 5,
        price: preferences.priceSensitivity,
        featureRichness: preferences.featureRichness,
        easeOfUse: preferences.easeOfUse,
        performance: preferences.performance,
        serviceIntegration: preferences.serviceIntegration,
        customization: preferences.customization,
        supportQuality: preferences.supportQuality,
        privacy: preferences.privacy,
      };

      // 1) Core comparison (keeps existing ranking logic on backend)
      const compareResponse = await fetch(`${BACKEND_URL}/api/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apps: appsPayload,
          preferences: apiPreferences,
        }),
      });

      const compareData: {
        winner: { app: string; mode: 'FULL' | 'PARTIAL'; score: number; popularity?: number };
        results: { app: string; mode: 'FULL' | 'PARTIAL'; score: number; popularity?: number }[];
      } = await compareResponse.json();

      // 2) Advanced analytics (FDI, CCS, scenarios, explainability, regional)
      const analyticsResponse = await fetch(`${BACKEND_URL}/api/analytics/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apps: appsPayload,
          preferences: apiPreferences,
          category: selectedCategory,
          scenarios: [
            {
              name: 'Price Sensitive',
              preferences: { ...apiPreferences, price: apiPreferences.price * 1.5 },
            },
            {
              name: 'Privacy Focused',
              preferences: { ...apiPreferences, privacy: apiPreferences.privacy * 1.5 },
            },
            {
              name: 'Convenience (Integration) Driven',
              preferences: {
                ...apiPreferences,
                serviceIntegration: apiPreferences.serviceIntegration * 1.5,
              },
            },
          ],
        }),
      });

      const analyticsData: AnalyticsResponse = await analyticsResponse.json();
      setAnalytics(analyticsData);

      // Merge explainability into the base comparison results
      const explainMap = new Map(
        (analyticsData.explainability || []).map((e) => [e.app.toLowerCase(), e])
      );

      // Apply popularity-aware ordering: sort by score first, then by popularity for ties
      const sortedResults = [...compareData.results].sort((a, b) => {
        if (Math.abs(a.score - b.score) < 0.1) {
          // If scores are very close (within 0.1), use popularity as tiebreaker
          const popA = a.popularity || 0;
          const popB = b.popularity || 0;
          return popB - popA;
        }
        return b.score - a.score;
      });

      const scores: AppScore[] = sortedResults.map((r) => {
        const explain = explainMap.get(r.app.toLowerCase());
        const breakdown: { [key: string]: number } = {};
        const attributesUsed: string[] = [];

        if (explain) {
          explain.breakdown.forEach((b) => {
            breakdown[b.feature] = Math.round(b.normalized_share * 1000) / 100; // % contribution
            attributesUsed.push(b.feature);
          });
        }

        const recommendation =
          r.mode === 'FULL'
            ? 'Full comparison using all available feature scores from the dataset.'
            : 'Partial comparison based on public attributes (rating and price only).';

        return {
          appName: r.app,
          mode: r.mode,
          totalScore: r.score,
          breakdown,
          attributesUsed,
          attributesExcluded: [],
          recommendation,
        };
      });

      setScoredApps(scores);
      setShowResults(true);
    } catch (err) {
      setError('Failed to compute scores');
      console.error('Score computation error:', err);
    }
  };

  const getRecommendationText = () => {
    if (scoredApps.length === 0) return '';

    const winner = scoredApps[0];
    let text = `<strong>${winner.appName}</strong> scores highest at <strong>${winner.totalScore.toFixed(1)}/10</strong>. `;

    if (winner.mode === 'PARTIAL') {
      text += `This app uses <strong>limited comparison mode</strong> because full feature data is not available in our database. `;
      text += `Comparison is based on publicly available attributes: ${winner.attributesUsed.join(', ')}. `;
      text += `For a complete analysis, consider one of our database apps.`;
    } else {
      text += `Evaluated using ${winner.attributesUsed.length} attributes: ${winner.attributesUsed.join(', ')}. `;
      if (winner.attributesExcluded.length > 0) {
        text += `Excluded from scoring: ${winner.attributesExcluded.join(', ')}.`;
      }
    }

    if (scoredApps.length > 1) {
      const runnerUp = scoredApps[1];
      text += ` ${runnerUp.appName} is a close alternative (${runnerUp.totalScore.toFixed(1)}/10).`;
    }

    return text;
  };

  const getConfusionInterpretation = (value: number) => {
    if (value < 0.5) return 'Low consumer confusion – apps are clearly differentiated.';
    if (value < 1.0) return 'Moderate consumer confusion – some apps offer very similar bundles.';
    return 'High consumer confusion – many apps look similar on features, consistent with intense non-price competition.';
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
            Compare preset apps or add your own. Full comparison for database apps, partial for others.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Select Region & Category</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Region / Platform
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
                Step 2: Select or Add Apps to Compare ({selectedApps.length}/5)
              </h2>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <LinkIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Custom App (paste Play Store / App Store link or app name)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={appInput}
                        onChange={(e) => setAppInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && validateAndAddApp()}
                        placeholder="e.g., https://play.google.com/store/apps/details?id=app.name or Just app name"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={validateAndAddApp}
                        disabled={validatingLink || !appInput.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                      >
                        {validatingLink ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Validating...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Selected Apps:</h3>
                {selectedApps.length > 0 ? (
                  <div className="space-y-2">
                    {selectedApps.map((app) => (
                      <div
                        key={app.id}
                        className={`p-3 rounded-lg border-2 flex items-center justify-between ${
                          app.mode === 'FULL' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {app.mode === 'FULL' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{app.name}</p>
                            <p className="text-xs text-gray-600">
                              {app.mode === 'FULL' ? 'Full comparison' : 'Limited data (partial comparison)'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeApp(app.id)}
                          className="p-1 hover:bg-gray-300 rounded"
                        >
                          <X className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No apps selected yet</p>
                )}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Browse Available Apps:</h3>
                  {apps.length > 0 && apps[0].selection_method === 'gemini' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      AI-Selected
                    </span>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {apps.map((app) => (
                    <button
                      key={app.app_name}
                      onClick={() => togglePresetApp(app)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedApps.some((a) => a.name === app.app_name)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{app.app_name}</h3>
                            {app.ai_rank && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">
                                #{app.ai_rank}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{app.developer}</p>
                          {app.ai_reason && (
                            <p className="text-xs text-blue-600 mb-2 italic">{app.ai_reason}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center text-yellow-600">
                              <Star className="w-4 h-4 mr-1 fill-current" />
                              {app.rating}
                            </span>
                            <span className="text-gray-600">
                              {app.price_inr === 0 ? 'Free' : `${app.price_type} / ₹${app.price_inr}`}
                            </span>
                          </div>
                        </div>
                        {selectedApps.some((a) => a.name === app.app_name) && (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
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
                  <span>Select region and category</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    2
                  </span>
                  <span>Choose from database or add custom apps</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    3
                  </span>
                  <span>Set preferences (full mode apps only)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    4
                  </span>
                  <span>Get detailed comparison with transparency</span>
                </li>
              </ol>
              <div className="mt-6 pt-6 border-t border-green-500 text-sm text-green-50">
                <p className="mb-2 font-semibold">Comparison Modes:</p>
                <p className="mb-2">
                  <span className="text-green-200 font-medium">Full:</span> All metrics available
                </p>
                <p>
                  <span className="text-yellow-200 font-medium">Partial:</span> Price & rating only
                </p>
              </div>
            </div>
          </div>
        </div>

        {showPreferences && selectedApps.length >= 2 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Customize Your Preferences</h2>
            <p className="text-gray-600 mb-6">
              Adjust sliders (1 = not important, 10 = very important). Metrics unavailable in partial comparison mode will be grayed out.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(preferences).map(([key, value]) => {
                const isAvailableInAnyApp =
                  key === 'priceSensitivity' ||
                  selectedApps.some((a) => a.mode === 'FULL');

                return (
                  <div key={key} className={isAvailableInAnyApp ? '' : 'opacity-50'}>
                    <div className="flex justify-between items-center mb-2">
                      <label
                        className={`text-sm font-medium ${
                          isAvailableInAnyApp ? 'text-gray-700' : 'text-gray-500'
                        }`}
                      >
                        {key === 'serviceIntegration'
                          ? 'Multi-Service Integration'
                          : key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <span
                        className={`text-lg font-bold ${
                          isAvailableInAnyApp ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={value}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          [key]: parseInt(e.target.value),
                        })
                      }
                      disabled={!isAvailableInAnyApp}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 disabled:opacity-50"
                    />
                    {!isAvailableInAnyApp && (
                      <p className="text-xs text-gray-400 mt-1">Only available in full comparison</p>
                    )}
                  </div>
                );
              })}
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
              {analytics?.aiOverview && (
                <div className="mt-6 pt-6 border-t border-green-500">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-semibold">AI-Powered Analysis</h3>
                    <span className="text-xs bg-blue-500/30 text-blue-100 px-2 py-1 rounded-full font-medium">
                      Gemini AI
                    </span>
                  </div>
                  <p className="text-base text-green-50 leading-relaxed">{analytics.aiOverview}</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Detailed Comparison</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {scoredApps.map((scored, index) => (
                  <div key={scored.appName} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div
                      className={`p-6 ${
                        index === 0
                          ? 'bg-gradient-to-r from-green-600 to-green-700'
                          : 'bg-gray-800'
                      } text-white`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{scored.appName}</h3>
                          <p className="text-sm opacity-90">
                            {scored.mode === 'FULL'
                              ? 'Full Comparison'
                              : 'Limited Data Available'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">
                            {scored.totalScore.toFixed(1)}
                          </div>
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
                      {scored.mode === 'PARTIAL' && (
                        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-yellow-900">Limited Data</p>
                              <p className="text-sm text-yellow-700">
                                Only price and rating available. Full feature comparison not possible.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4 mb-6">
                        {Object.entries(scored.breakdown).map(([key, score]) => {
                          const isExcluded = scored.attributesExcluded.includes(key);
                          return (
                            <div key={key} className={isExcluded ? 'opacity-40' : ''}>
                              <div className="flex justify-between text-sm mb-1">
                                <span
                                  className={
                                    isExcluded ? 'text-gray-400' : 'text-gray-700 capitalize'
                                  }
                                >
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                  {isExcluded && ' (not evaluated)'}
                                </span>
                                <span
                                  className={`font-semibold ${
                                    isExcluded ? 'text-gray-400' : 'text-gray-900'
                                  }`}
                                >
                                  {score.toFixed(1)}/10
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    isExcluded
                                      ? 'bg-gray-300'
                                      : index === 0
                                        ? 'bg-green-600'
                                        : 'bg-gray-600'
                                  }`}
                                  style={{ width: `${(score / 10) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-xs text-gray-600 mb-2">
                          <strong>Attributes Used:</strong> {scored.attributesUsed.join(', ')}
                        </p>
                        {scored.attributesExcluded.length > 0 && (
                          <p className="text-xs text-gray-500">
                            <strong>Not Evaluated:</strong> {scored.attributesExcluded.join(', ')}
                          </p>
                        )}
                      </div>

                      {/* Gemini-powered detailed comparison */}
                      {analytics?.detailedComparisons?.[scored.appName] && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <h4 className="text-sm font-semibold text-gray-900">AI-Powered Insights</h4>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                              Gemini AI
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {analytics.detailedComparisons[scored.appName]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {analytics && (
              <>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Layers className="w-6 h-6 mr-2 text-green-600" />
                    Feature Dominance Index (FDI)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    The Feature Dominance Index normalizes feature scores across the selected apps and
                    weights them by your preferences. Higher values indicate that an app is more
                    dominant on the differentiated features within this competitive set.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-semibold text-gray-700">Rank</th>
                          <th className="text-left py-2 pr-4 font-semibold text-gray-700">App</th>
                          <th className="text-left py-2 pr-4 font-semibold text-gray-700">
                            Dominance Index
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.fdi
                          .slice()
                          .sort((a, b) => b.dominance_index - a.dominance_index)
                          .map((entry, idx) => (
                            <tr key={entry.app_name} className="border-b last:border-0">
                              <td className="py-2 pr-4 text-gray-800">{idx + 1}</td>
                              <td className="py-2 pr-4 text-gray-900">{entry.app_name}</td>
                              <td className="py-2 pr-4 text-gray-800">
                                {entry.dominance_index.toFixed(3)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Consumer Confusion Score</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Based on the number of competing apps and the variance of their feature scores.
                    Higher values indicate more similarity across apps and thus greater potential for
                    consumer confusion.
                  </p>
                  <p className="text-lg font-semibold text-green-700">
                    CCS = {analytics.consumerConfusion.toFixed(3)}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {getConfusionInterpretation(analytics.consumerConfusion)}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Scenario-Based Rankings (Preference Profiles)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Each scenario adjusts the preference weights (e.g., stronger emphasis on price or
                    privacy) while keeping the underlying feature scores fixed. This illustrates how
                    monopolistic competition allows different apps to lead under different consumer
                    segments.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {analytics.scenarios.map((scenario) => (
                      <div key={scenario.scenario} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{scenario.scenario}</h4>
                        {scenario.ranked.slice(0, 3).map((entry, idx) => (
                          <p key={entry.app} className="text-sm text-gray-700">
                            <span className="font-semibold">
                              {idx + 1}. {entry.app}
                            </span>{' '}
                            ({entry.score.toFixed(1)}/10)
                          </p>
                        ))}
                        {scenario.ranked.length === 0 && (
                          <p className="text-sm text-gray-500">No apps available in this scenario.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Feature Contributions to the Winning App
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This breakdown shows how much each feature contributes to the final score of the
                    current winner, expressed as a percentage of the total weighted score. It can be
                    used directly in tables or charts in an academic paper.
                  </p>
                  {(() => {
                    const winner = scoredApps[0];
                    const explain =
                      analytics.explainability.find(
                        (e) => e.app.toLowerCase() === winner.appName.toLowerCase()
                      ) || null;
                    if (!explain) {
                      return (
                        <p className="text-sm text-gray-500">
                          No explainability data available for the winning app.
                        </p>
                      );
                    }
                    return (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 pr-4 font-semibold text-gray-700">
                                Feature
                              </th>
                              <th className="text-left py-2 pr-4 font-semibold text-gray-700">
                                Value
                              </th>
                              <th className="text-left py-2 pr-4 font-semibold text-gray-700">
                                Weight
                              </th>
                              <th className="text-left py-2 pr-4 font-semibold text-gray-700">
                                Contribution (% of score)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {explain.breakdown.map((b) => (
                              <tr key={b.feature} className="border-b last:border-0">
                                <td className="py-2 pr-4 text-gray-900">
                                  {b.feature.replace(/([A-Z])/g, ' $1').trim()}
                                </td>
                                <td className="py-2 pr-4 text-gray-800">{b.value.toFixed(2)}</td>
                                <td className="py-2 pr-4 text-gray-800">{b.weight.toFixed(2)}</td>
                                <td className="py-2 pr-4 text-gray-800">
                                  {(b.normalized_share * 100).toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

                {analytics?.graphOutputs && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                        Graph-Ready Outputs (Academic Figures)
                      </h3>
                      <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                        Publication Ready
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Structured data suitable for generating charts and figures in academic papers.
                    </p>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Feature Contribution Breakdown</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 pr-4 font-semibold text-gray-700">App</th>
                                {Object.keys(analytics.graphOutputs.feature_contributions[Object.keys(analytics.graphOutputs.feature_contributions)[0]] || {}).map((feat) => (
                                  <th key={feat} className="text-left py-2 pr-4 font-semibold text-gray-700">
                                    {feat.replace(/([A-Z])/g, ' $1').trim()} (%)
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(analytics.graphOutputs.feature_contributions).map(([appName, contributions]) => (
                                <tr key={appName} className="border-b last:border-0">
                                  <td className="py-2 pr-4 text-gray-900 font-medium">{appName}</td>
                                  {Object.entries(contributions).map(([feat, pct]) => (
                                    <td key={feat} className="py-2 pr-4 text-gray-800">{pct.toFixed(1)}%</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Dominance vs Popularity</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 pr-4 font-semibold text-gray-700">App</th>
                                <th className="text-left py-2 pr-4 font-semibold text-gray-700">Dominance Index</th>
                                <th className="text-left py-2 pr-4 font-semibold text-gray-700">Popularity Score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analytics.graphOutputs.dominance_vs_popularity.map((entry) => (
                                <tr key={entry.app_name} className="border-b last:border-0">
                                  <td className="py-2 pr-4 text-gray-900 font-medium">{entry.app_name}</td>
                                  <td className="py-2 pr-4 text-gray-800">{entry.dominance_index.toFixed(4)}</td>
                                  <td className="py-2 pr-4 text-gray-800">{entry.popularity_score.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Confusion Score by Category</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 pr-4 font-semibold text-gray-700">Category</th>
                                <th className="text-left py-2 pr-4 font-semibold text-gray-700">Confusion Score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(analytics.graphOutputs.confusion_by_category).map(([category, score]) => (
                                <tr key={category} className="border-b last:border-0">
                                  <td className="py-2 pr-4 text-gray-900 font-medium">{category}</td>
                                  <td className="py-2 pr-4 text-gray-800">{score.toFixed(4)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Regional / Platform Asymmetry
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This section compares which apps are dominant across regions or platforms within
                    the same category, highlighting geographic or platform-based asymmetries in
                    monopolistic competition.
                  </p>
                  {analytics.regionalAsymmetry.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No regional or platform information available in the dataset.
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {analytics.regionalAsymmetry.map((region) => (
                        <div key={region.region} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">{region.region}</h4>
                          <p className="text-xs text-gray-500 mb-2">
                            {region.count} apps in this region / platform.
                          </p>
                          {region.dominance.slice(0, 3).map((entry, idx) => (
                            <p key={entry.app_name} className="text-sm text-gray-700">
                              <span className="font-semibold">
                                {idx + 1}. {entry.app_name}
                              </span>{' '}
                              (FDI {entry.dominance_index.toFixed(3)})
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}