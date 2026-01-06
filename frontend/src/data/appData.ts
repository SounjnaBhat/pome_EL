export interface App {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  pricing: string;
  downloads: string;
  rating: number;
  regions: string[];
  pros: string[];
  cons: string[];
  marketShare?: string;
  differentiationStrategy: string;
}

export const categories = [
  'Messaging',
  'Video Streaming',
  'Food Delivery',
  'Ride-Hailing',
  'Music Streaming',
  'Social Media',
  'E-Commerce',
  'Fitness',
  'Education',
  'Finance',
  'Gaming',
  'Productivity'
];

export const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy',
  'India', 'China', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'Argentina', 'Chile',
  'Russia', 'Netherlands', 'Belgium', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Poland', 'Turkey', 'Saudi Arabia', 'United Arab Emirates', 'Egypt', 'South Africa',
  'Nigeria', 'Kenya', 'Indonesia', 'Thailand', 'Vietnam', 'Malaysia', 'Singapore',
  'Philippines', 'New Zealand', 'Pakistan', 'Bangladesh', 'Israel', 'Greece',
  'Portugal', 'Ireland', 'Switzerland', 'Austria', 'Czech Republic', 'Hungary',
  'Romania', 'Ukraine', 'Colombia', 'Peru', 'Venezuela', 'Morocco', 'Algeria',
  'Tunisia', 'Ghana', 'Ethiopia', 'Tanzania', 'Uganda', 'Taiwan', 'Hong Kong',
  'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'Jordan', 'Lebanon', 'Iraq', 'Iran',
  'Afghanistan', 'Sri Lanka', 'Nepal', 'Cambodia', 'Myanmar', 'Laos',
  'Mongolia', 'Kazakhstan', 'Uzbekistan', 'Azerbaijan', 'Georgia', 'Armenia',
  'Bolivia', 'Paraguay', 'Uruguay', 'Ecuador', 'Costa Rica', 'Panama',
  'Guatemala', 'Honduras', 'Nicaragua', 'El Salvador', 'Dominican Republic',
  'Cuba', 'Jamaica', 'Trinidad and Tobago', 'Barbados', 'Haiti',
  'Serbia', 'Croatia', 'Bosnia', 'Slovenia', 'Macedonia', 'Albania',
  'Bulgaria', 'Slovakia', 'Lithuania', 'Latvia', 'Estonia', 'Belarus',
  'Moldova', 'Iceland', 'Luxembourg', 'Malta', 'Cyprus', 'Mauritius',
  'Seychelles', 'Madagascar', 'Mozambique', 'Zambia', 'Zimbabwe',
  'Botswana', 'Namibia', 'Angola', 'Cameroon', 'Ivory Coast', 'Senegal',
  'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Sudan', 'Somalia',
  'Eritrea', 'Djibouti', 'Rwanda', 'Burundi', 'Malawi', 'Lesotho',
  'Swaziland', 'Fiji', 'Papua New Guinea', 'Samoa', 'Tonga', 'Vanuatu',
  'Solomon Islands', 'Micronesia', 'Palau', 'Brunei', 'Maldives', 'Bhutan',
  'Timor-Leste', 'Turkmenistan', 'Tajikistan', 'Kyrgyzstan', 'Libya',
  'Yemen', 'Syria', 'Palestine', 'North Korea', 'Guyana', 'Suriname',
  'French Guiana', 'Belize', 'Bahamas', 'Antigua', 'Saint Lucia',
  'Grenada', 'Saint Vincent', 'Dominica', 'Saint Kitts', 'Andorra',
  'Monaco', 'Liechtenstein', 'San Marino', 'Vatican City', 'Montenegro',
  'Kosovo', 'Greenland', 'Faroe Islands', 'Reunion', 'Mayotte',
  'Comoros', 'Cape Verde', 'Sao Tome', 'Equatorial Guinea', 'Gabon',
  'Republic of Congo', 'Central African Republic', 'Benin', 'Togo',
  'Liberia', 'Sierra Leone', 'Guinea', 'Guinea-Bissau', 'Gambia',
  'Western Sahara', 'Mauritania'
];

export const apps: App[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Messaging',
    description: 'End-to-end encrypted messaging with voice and video calls',
    features: ['End-to-end encryption', 'Voice/video calls', 'Group chats', 'Status updates', 'File sharing'],
    pricing: 'Free',
    downloads: '5B+',
    rating: 4.3,
    regions: ['Global', 'India', 'Brazil', 'Europe', 'Middle East', 'Africa'],
    pros: ['Widely adopted', 'Strong encryption', 'Cross-platform', 'No ads'],
    cons: ['Requires phone number', 'Limited cloud storage', 'Facebook ownership concerns'],
    marketShare: '~29% global',
    differentiationStrategy: 'Privacy-first with simple, reliable messaging'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'Messaging',
    description: 'Cloud-based messaging with channels and bots',
    features: ['Cloud storage', 'Large groups', 'Channels', 'Bots', 'Secret chats'],
    pricing: 'Free, Premium $4.99/mo',
    downloads: '1B+',
    rating: 4.4,
    regions: ['Global', 'Russia', 'Iran', 'Ukraine'],
    pros: ['Feature-rich', 'Large file support', 'Public channels', 'No phone number for desktop'],
    cons: ['Less encryption by default', 'Complex interface', 'Moderation concerns'],
    marketShare: '~8% global',
    differentiationStrategy: 'Feature-rich with emphasis on openness and large communities'
  },
  {
    id: 'signal',
    name: 'Signal',
    category: 'Messaging',
    description: 'Privacy-focused encrypted messaging',
    features: ['End-to-end encryption', 'Disappearing messages', 'Screen security', 'Voice/video calls'],
    pricing: 'Free',
    downloads: '100M+',
    rating: 4.4,
    regions: ['United States', 'Europe', 'Privacy-conscious users globally'],
    pros: ['Maximum privacy', 'Open source', 'No data collection', 'Non-profit'],
    cons: ['Smaller user base', 'Requires phone number', 'Limited features vs competitors'],
    marketShare: '~2% global',
    differentiationStrategy: 'Privacy and security as core value proposition'
  },
  {
    id: 'wechat',
    name: 'WeChat',
    category: 'Messaging',
    description: 'Super app with messaging, payments, and services',
    features: ['Messaging', 'Payments', 'Mini programs', 'Social networking', 'Official accounts'],
    pricing: 'Free',
    downloads: '1B+',
    rating: 4.1,
    regions: ['China', 'Chinese diaspora'],
    pros: ['All-in-one platform', 'Integrated payments', 'Essential in China'],
    cons: ['Limited outside China', 'Privacy concerns', 'Government oversight'],
    marketShare: '~15% global, ~90% China',
    differentiationStrategy: 'Ecosystem integration - messaging plus payments and services'
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Video Streaming',
    description: 'Leading streaming service with original content',
    features: ['Original content', 'Multiple profiles', 'Offline downloads', '4K streaming', 'No ads'],
    pricing: '$6.99-$22.99/mo',
    downloads: '500M+',
    rating: 4.2,
    regions: ['Global', '190+ countries'],
    pros: ['Extensive library', 'Original productions', 'User-friendly interface'],
    cons: ['Price increases', 'Content rotation', 'Password sharing crackdown'],
    marketShare: '~23% global streaming',
    differentiationStrategy: 'Original content and global reach'
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    category: 'Video Streaming',
    description: 'Family-friendly streaming with Disney, Marvel, Star Wars',
    features: ['Disney catalog', 'Marvel & Star Wars', 'GroupWatch', '4K streaming', 'Download'],
    pricing: '$7.99-$13.99/mo',
    downloads: '200M+',
    rating: 4.4,
    regions: ['North America', 'Europe', 'Asia-Pacific', 'Latin America'],
    pros: ['Family-friendly', 'Iconic franchises', 'Quality content'],
    cons: ['Smaller library', 'Limited adult content', 'Regional restrictions'],
    marketShare: '~15% global streaming',
    differentiationStrategy: 'Premium branded content from Disney ecosystem'
  },
  {
    id: 'amazon-prime',
    name: 'Amazon Prime Video',
    category: 'Video Streaming',
    description: 'Video streaming bundled with Prime membership',
    features: ['Included with Prime', 'Original series', 'Rent/buy movies', 'Live sports', 'Channels'],
    pricing: '$14.99/mo or $139/yr',
    downloads: '300M+',
    rating: 4.1,
    regions: ['Global', 'Strong in US, UK, India'],
    pros: ['Bundled with Prime', 'Growing originals', 'Add-on channels'],
    cons: ['Interface complexity', 'Mix of free/paid content', 'Inconsistent quality'],
    marketShare: '~20% global streaming',
    differentiationStrategy: 'Bundled value with Prime membership ecosystem'
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    category: 'Video Streaming',
    description: 'Ad-free YouTube with exclusive content',
    features: ['Ad-free viewing', 'Background play', 'Downloads', 'YouTube Music', 'Originals'],
    pricing: '$11.99/mo',
    downloads: '5B+',
    rating: 4.3,
    regions: ['Global'],
    pros: ['No ads on YouTube', 'Includes YouTube Music', 'Vast content library'],
    cons: ['Expensive for single feature', 'Limited originals', 'Free tier competition'],
    marketShare: '~10% paid streaming',
    differentiationStrategy: 'Ad-free experience on worlds largest video platform'
  },
  {
    id: 'ubereats',
    name: 'Uber Eats',
    category: 'Food Delivery',
    description: 'Food delivery from local restaurants',
    features: ['Wide restaurant selection', 'Real-time tracking', 'Scheduled delivery', 'Uber One membership'],
    pricing: 'Variable delivery fees, Uber One $9.99/mo',
    downloads: '500M+',
    rating: 4.1,
    regions: ['6000+ cities globally', 'Strong in US, Europe, Australia'],
    pros: ['Restaurant variety', 'Integration with Uber', 'Reliable tracking'],
    cons: ['High fees', 'Service quality varies', 'Driver treatment concerns'],
    marketShare: '~26% US market',
    differentiationStrategy: 'Leveraging Uber ride-hailing network and brand'
  },
  {
    id: 'doordash',
    name: 'DoorDash',
    category: 'Food Delivery',
    description: 'Leading US food delivery platform',
    features: ['DashPass subscription', 'Grocery delivery', 'Alcohol delivery', 'Group orders'],
    pricing: 'Variable fees, DashPass $9.99/mo',
    downloads: '100M+',
    rating: 4.3,
    regions: ['United States', 'Canada', 'Australia', 'Japan'],
    pros: ['Largest US coverage', 'Restaurant partnerships', 'Fast delivery'],
    cons: ['High commissions to restaurants', 'Expensive without DashPass', 'Limited international'],
    marketShare: '~59% US market',
    differentiationStrategy: 'Geographic density and merchant partnerships'
  },
  {
    id: 'grubhub',
    name: 'Grubhub',
    category: 'Food Delivery',
    description: 'Restaurant delivery and pickup',
    features: ['Restaurant discovery', 'Grubhub+', 'Pickup options', 'Corporate meals'],
    pricing: 'Variable fees, Grubhub+ $9.99/mo',
    downloads: '50M+',
    rating: 3.9,
    regions: ['United States', '4000+ cities'],
    pros: ['No contact delivery', 'Loyalty rewards', 'Corporate partnerships'],
    cons: ['Declining market share', 'Customer service issues', 'Fee transparency'],
    marketShare: '~9% US market',
    differentiationStrategy: 'Focus on restaurant relationships and corporate market'
  },
  {
    id: 'zomato',
    name: 'Zomato',
    category: 'Food Delivery',
    description: 'Restaurant discovery and food delivery',
    features: ['Restaurant reviews', 'Table booking', 'Food delivery', 'Zomato Gold'],
    pricing: 'Variable delivery fees',
    downloads: '100M+',
    rating: 4.1,
    regions: ['India', 'UAE', 'Australia', 'Philippines'],
    pros: ['Strong in India', 'Restaurant information', 'User reviews'],
    cons: ['Profitability challenges', 'High commissions', 'Competition from Swiggy'],
    marketShare: '~47% India market',
    differentiationStrategy: 'Restaurant discovery combined with delivery'
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    category: 'Food Delivery',
    description: 'Indian food delivery and quick commerce',
    features: ['Food delivery', 'Instamart grocery', 'Genie services', 'Swiggy One'],
    pricing: 'Variable fees, Swiggy One ₹149/mo',
    downloads: '100M+',
    rating: 4.2,
    regions: ['India', '500+ cities'],
    pros: ['Fast delivery', 'Diverse services', 'Wide coverage in India'],
    cons: ['India-only', 'Intense competition', 'Delivery partner issues'],
    marketShare: '~48% India market',
    differentiationStrategy: 'Quick commerce and hyperlocal delivery beyond food'
  },
  {
    id: 'uber',
    name: 'Uber',
    category: 'Ride-Hailing',
    description: 'Global ride-hailing and mobility platform',
    features: ['Multiple ride types', 'Price estimates', 'Safety features', 'Scheduled rides', 'Split fares'],
    pricing: 'Dynamic pricing',
    downloads: '500M+',
    rating: 4.2,
    regions: ['Global', '10000+ cities', '70+ countries'],
    pros: ['Global coverage', 'Reliable service', 'Multiple options'],
    cons: ['Surge pricing', 'Driver concerns', 'Regulatory challenges'],
    marketShare: '~72% US market',
    differentiationStrategy: 'Global scale and integrated ecosystem with Eats'
  },
  {
    id: 'lyft',
    name: 'Lyft',
    category: 'Ride-Hailing',
    description: 'US-focused ride-hailing service',
    features: ['Multiple ride types', 'Scheduled rides', 'Round trip', 'Lyft Pink'],
    pricing: 'Dynamic pricing, Lyft Pink $9.99/mo',
    downloads: '50M+',
    rating: 4.1,
    regions: ['United States', 'Canada'],
    pros: ['Competitive pricing', 'Driver-friendly reputation', 'Clean interface'],
    cons: ['US/Canada only', 'Smaller driver pool', 'Limited features vs Uber'],
    marketShare: '~28% US market',
    differentiationStrategy: 'US focus with emphasis on community and driver treatment'
  },
  {
    id: 'didi',
    name: 'DiDi',
    category: 'Ride-Hailing',
    description: 'Chinese ride-hailing giant',
    features: ['Multiple services', 'Taxi hailing', 'Bike sharing', 'Carpooling'],
    pricing: 'Variable pricing',
    downloads: '500M+',
    rating: 4.0,
    regions: ['China', 'Latin America', 'Australia', 'Japan'],
    pros: ['Dominant in China', 'Diverse services', 'Competitive pricing'],
    cons: ['Regulatory scrutiny', 'Limited outside China', 'Safety concerns'],
    marketShare: '~90% China market',
    differentiationStrategy: 'Dominant local presence with government relationships'
  },
  {
    id: 'grab',
    name: 'Grab',
    category: 'Ride-Hailing',
    description: 'Southeast Asian super app',
    features: ['Ride-hailing', 'Food delivery', 'Payments', 'Financial services'],
    pricing: 'Variable pricing',
    downloads: '100M+',
    rating: 4.2,
    regions: ['Southeast Asia', '8 countries', '500+ cities'],
    pros: ['Super app functionality', 'Regional dominance', 'Multiple services'],
    cons: ['Regional only', 'Complex app', 'Regulatory challenges'],
    marketShare: '~70% Southeast Asia',
    differentiationStrategy: 'Super app ecosystem for Southeast Asian markets'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Music Streaming',
    description: 'Leading music streaming platform',
    features: ['90M+ songs', 'Podcasts', 'Personalized playlists', 'Offline mode', 'Social features'],
    pricing: 'Free with ads, Premium $10.99/mo',
    downloads: '500M+',
    rating: 4.4,
    regions: ['Global', '180+ countries'],
    pros: ['Largest catalog', 'Best discovery', 'Free tier', 'Cross-platform'],
    cons: ['Artist compensation debates', 'Limited high-res audio', 'Regional restrictions'],
    marketShare: '~31% global music streaming',
    differentiationStrategy: 'Discovery algorithms and freemium model'
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    category: 'Music Streaming',
    description: 'Apples music streaming service',
    features: ['100M+ songs', 'Lossless audio', 'Spatial audio', 'Radio', 'Music videos'],
    pricing: '$10.99/mo',
    downloads: '200M+',
    rating: 4.5,
    regions: ['Global', '167 countries'],
    pros: ['High quality audio', 'Apple ecosystem integration', 'Large catalog'],
    cons: ['No free tier', 'Requires Apple device for best experience', 'Weaker discovery'],
    marketShare: '~15% global music streaming',
    differentiationStrategy: 'Premium audio quality and Apple ecosystem integration'
  },
  {
    id: 'youtube-music',
    name: 'YouTube Music',
    category: 'Music Streaming',
    description: 'Music streaming from YouTube',
    features: ['Official songs', 'Music videos', 'Live performances', 'Remixes', 'Covers'],
    pricing: 'Free with ads, Premium $10.99/mo',
    downloads: '500M+',
    rating: 4.0,
    regions: ['Global', '100+ countries'],
    pros: ['Vast content', 'Free tier', 'Videos and audio', 'YouTube integration'],
    cons: ['Interface confusion', 'Recommendation issues', 'Late to market'],
    marketShare: '~8% global music streaming',
    differentiationStrategy: 'Video content and YouTube integration'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'Social Media',
    description: 'Global social networking platform',
    features: ['News Feed', 'Groups', 'Marketplace', 'Events', 'Stories', 'Reels'],
    pricing: 'Free with ads',
    downloads: '5B+',
    rating: 3.5,
    regions: ['Global', 'Except China'],
    pros: ['Largest user base', 'Group features', 'Marketplace', 'Events'],
    cons: ['Privacy concerns', 'Declining youth usage', 'Content moderation issues'],
    marketShare: '~37% social media users',
    differentiationStrategy: 'Comprehensive social graph and community features'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social Media',
    description: 'Photo and video sharing social network',
    features: ['Photo/video sharing', 'Stories', 'Reels', 'Shopping', 'Direct messaging'],
    pricing: 'Free with ads',
    downloads: '2B+',
    rating: 4.3,
    regions: ['Global'],
    pros: ['Visual focus', 'Strong engagement', 'Influencer platform', 'Shopping integration'],
    cons: ['Algorithm changes', 'Mental health concerns', 'Declining organic reach'],
    marketShare: '~25% social media users',
    differentiationStrategy: 'Visual storytelling and creator economy'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'Social Media',
    description: 'Short-form video social platform',
    features: ['Short videos', 'For You algorithm', 'Sounds and effects', 'Duets', 'Live streaming'],
    pricing: 'Free with ads',
    downloads: '3B+',
    rating: 4.4,
    regions: ['Global', 'Banned in India'],
    pros: ['Highly engaging', 'Viral potential', 'Creator-friendly', 'Algorithm excellence'],
    cons: ['Privacy concerns', 'Geopolitical risks', 'Time consumption', 'Content moderation'],
    marketShare: '~18% social media users',
    differentiationStrategy: 'AI-driven content discovery and short-form video focus'
  },
  {
    id: 'twitter-x',
    name: 'X (Twitter)',
    category: 'Social Media',
    description: 'Real-time public conversation platform',
    features: ['Tweets', 'Spaces', 'Communities', 'Lists', 'Direct messages', 'X Premium'],
    pricing: 'Free, X Premium $8/mo',
    downloads: '500M+',
    rating: 3.8,
    regions: ['Global', 'Strong in US, Japan, UK'],
    pros: ['Real-time news', 'Public discourse', 'Verified users', 'API access'],
    cons: ['Toxic environment', 'Bot issues', 'Declining engagement', 'Management changes'],
    marketShare: '~6% social media users',
    differentiationStrategy: 'Real-time public conversation and news'
  },
  {
    id: 'amazon',
    name: 'Amazon Shopping',
    category: 'E-Commerce',
    description: 'Global e-commerce marketplace',
    features: ['Wide selection', 'Prime shipping', 'Customer reviews', 'One-click ordering', 'Subscribe & Save'],
    pricing: 'Free, Prime $14.99/mo',
    downloads: '500M+',
    rating: 4.4,
    regions: ['Global', '20+ countries'],
    pros: ['Vast selection', 'Fast shipping', 'Customer service', 'Competitive pricing'],
    cons: ['Counterfeit issues', 'Seller competition', 'Worker treatment concerns'],
    marketShare: '~38% US e-commerce',
    differentiationStrategy: 'Selection, convenience, and Prime membership ecosystem'
  },
  {
    id: 'alibaba',
    name: 'Alibaba',
    category: 'E-Commerce',
    description: 'Chinese e-commerce giant',
    features: ['B2B marketplace', 'Consumer shopping', 'Wholesale', 'Trade assurance'],
    pricing: 'Free to browse',
    downloads: '100M+',
    rating: 4.2,
    regions: ['China', 'Global B2B'],
    pros: ['Wholesale prices', 'Direct from manufacturers', 'Global trade'],
    cons: ['Quality variability', 'Long shipping', 'Language barriers', 'Minimum orders'],
    marketShare: '~47% China e-commerce',
    differentiationStrategy: 'B2B wholesale and direct manufacturer access'
  },
  {
    id: 'ebay',
    name: 'eBay',
    category: 'E-Commerce',
    description: 'Online auction and shopping marketplace',
    features: ['Auctions', 'Buy it now', 'Seller ratings', 'Global shipping', 'Authenticity guarantee'],
    pricing: 'Free to buy, seller fees',
    downloads: '100M+',
    rating: 4.3,
    regions: ['Global', '190+ countries'],
    pros: ['Auction format', 'Unique items', 'Collectibles', 'Buyer protection'],
    cons: ['Seller fees', 'Declining relevance', 'Scam risks', 'Complex fees'],
    marketShare: '~4% US e-commerce',
    differentiationStrategy: 'Auction format and collectibles marketplace'
  },
  {
    id: 'strava',
    name: 'Strava',
    category: 'Fitness',
    description: 'Social network for athletes',
    features: ['Activity tracking', 'Route planning', 'Segments', 'Social features', 'Training analysis'],
    pricing: 'Free, Subscription $11.99/mo',
    downloads: '100M+',
    rating: 4.4,
    regions: ['Global'],
    pros: ['Strong community', 'Detailed analytics', 'Social motivation', 'Multi-sport'],
    cons: ['Expensive subscription', 'Battery drain', 'Privacy concerns', 'Feature creep'],
    marketShare: 'Leading social fitness platform',
    differentiationStrategy: 'Social networking combined with detailed performance analytics'
  },
  {
    id: 'myfitnesspal',
    name: 'MyFitnessPal',
    category: 'Fitness',
    description: 'Calorie counter and fitness tracker',
    features: ['Food database', 'Calorie tracking', 'Exercise logging', 'Barcode scanner', 'Recipes'],
    pricing: 'Free, Premium $9.99/mo',
    downloads: '100M+',
    rating: 4.5,
    regions: ['Global'],
    pros: ['Huge food database', 'Easy tracking', 'Integration with devices', 'Community'],
    cons: ['Ads in free version', 'Data accuracy issues', 'Premium paywall features'],
    marketShare: 'Leading nutrition tracking app',
    differentiationStrategy: 'Comprehensive food database and calorie tracking focus'
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    category: 'Education',
    description: 'Gamified language learning',
    features: ['40+ languages', 'Gamification', 'Bite-sized lessons', 'Speaking practice', 'Streak tracking'],
    pricing: 'Free with ads, Super $12.99/mo',
    downloads: '500M+',
    rating: 4.6,
    regions: ['Global'],
    pros: ['Free education', 'Fun and engaging', 'Multiple languages', 'Effective for basics'],
    cons: ['Limited depth', 'Repetitive', 'Translation focus', 'Ads can be intrusive'],
    marketShare: 'Most popular language learning app',
    differentiationStrategy: 'Gamification and freemium accessibility'
  },
  {
    id: 'khan-academy',
    name: 'Khan Academy',
    category: 'Education',
    description: 'Free educational platform',
    features: ['Math', 'Science', 'Arts & Humanities', 'Test prep', 'Video lessons', 'Practice exercises'],
    pricing: 'Free (non-profit)',
    downloads: '10M+',
    rating: 4.6,
    regions: ['Global', '50+ languages'],
    pros: ['Completely free', 'High quality', 'Comprehensive', 'Non-profit mission'],
    cons: ['Limited social features', 'Self-paced requires discipline', 'No live instruction'],
    marketShare: 'Leading free education platform',
    differentiationStrategy: 'Free, comprehensive education as mission-driven non-profit'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'Finance',
    description: 'Digital payments and money transfers',
    features: ['Send/receive money', 'Online payments', 'Buyer protection', 'Crypto trading', 'Bill payments'],
    pricing: 'Free for personal, merchant fees 2.9%+',
    downloads: '100M+',
    rating: 4.4,
    regions: ['Global', '200+ countries'],
    pros: ['Wide acceptance', 'Buyer protection', 'Easy to use', 'Trusted brand'],
    cons: ['Fees for merchants', 'Account freezes', 'Customer service issues', 'Currency conversion fees'],
    marketShare: '~42% digital wallets',
    differentiationStrategy: 'Trusted brand with buyer/seller protection'
  },
  {
    id: 'venmo',
    name: 'Venmo',
    category: 'Finance',
    description: 'Social payments app',
    features: ['P2P payments', 'Social feed', 'Split bills', 'Venmo card', 'Crypto'],
    pricing: 'Free for bank transfers, 3% credit card',
    downloads: '50M+',
    rating: 4.5,
    regions: ['United States only'],
    pros: ['Social integration', 'Easy splits', 'Popular with millennials', 'Fast transfers'],
    cons: ['US only', 'Public transactions', 'Limited business use', 'Scam risks'],
    marketShare: '~52% US P2P payments',
    differentiationStrategy: 'Social payments experience for casual transactions'
  },
  {
    id: 'cashapp',
    name: 'Cash App',
    category: 'Finance',
    description: 'Mobile payment and investment app',
    features: ['P2P payments', 'Cash Card', 'Bitcoin trading', 'Stock investing', 'Direct deposit'],
    pricing: 'Free for basic, instant deposit 1.5%',
    downloads: '100M+',
    rating: 4.7,
    regions: ['United States', 'United Kingdom'],
    pros: ['Instant transfers', 'Investing features', 'Bitcoin support', 'Cash Card'],
    cons: ['Scam target', 'Limited customer service', 'Account closures', 'US/UK only'],
    marketShare: '~30% US P2P payments',
    differentiationStrategy: 'Financial services beyond payments - investing and banking'
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    category: 'Gaming',
    description: 'Battle royale mobile game',
    features: ['100-player battles', 'Multiple maps', 'Voice chat', 'Clans', 'Ranked modes', 'Events'],
    pricing: 'Free with in-app purchases',
    downloads: '1B+',
    rating: 4.2,
    regions: ['Global', 'Banned in India'],
    pros: ['Engaging gameplay', 'Regular updates', 'Competitive scene', 'Social features'],
    cons: ['Cheating issues', 'Battery drain', 'Pay-to-win concerns', 'Addictive'],
    marketShare: 'Leading mobile battle royale',
    differentiationStrategy: 'Realistic military shooter experience on mobile'
  },
  {
    id: 'candy-crush',
    name: 'Candy Crush Saga',
    category: 'Gaming',
    description: 'Match-3 puzzle game',
    features: ['Thousands of levels', 'Daily challenges', 'Social features', 'Power-ups', 'Events'],
    pricing: 'Free with in-app purchases',
    downloads: '1B+',
    rating: 4.5,
    regions: ['Global'],
    pros: ['Casual gameplay', 'Easy to learn', 'No ads between levels', 'Regular content'],
    cons: ['Pay-to-progress', 'Lives system', 'Difficulty spikes', 'Repetitive'],
    marketShare: 'Top-grossing puzzle game',
    differentiationStrategy: 'Accessible casual gaming with social hooks'
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Productivity',
    description: 'All-in-one workspace',
    features: ['Notes', 'Databases', 'Wiki', 'Projects', 'Docs', 'Calendar', 'Templates'],
    pricing: 'Free, Plus $10/mo, Business $18/mo',
    downloads: '10M+',
    rating: 4.6,
    regions: ['Global'],
    pros: ['Highly flexible', 'Beautiful design', 'Collaboration', 'Template library'],
    cons: ['Learning curve', 'Can be slow', 'Overwhelming features', 'Offline limitations'],
    marketShare: 'Leading all-in-one productivity tool',
    differentiationStrategy: 'Flexible building blocks for customized workflows'
  },
  {
    id: 'trello',
    name: 'Trello',
    category: 'Productivity',
    description: 'Visual project management with boards',
    features: ['Kanban boards', 'Cards', 'Lists', 'Power-Ups', 'Automation', 'Templates'],
    pricing: 'Free, Standard $5/mo, Premium $10/mo',
    downloads: '50M+',
    rating: 4.4,
    regions: ['Global'],
    pros: ['Visual and intuitive', 'Easy to learn', 'Flexible', 'Good free tier'],
    cons: ['Limited reporting', 'Can get messy', 'Basic features', 'Power-Ups paywall'],
    marketShare: 'Popular project management tool',
    differentiationStrategy: 'Simple visual Kanban board approach'
  }
];

export function getAppsByCategory(category: string): App[] {
  return apps.filter(app => app.category === category);
}

export function getAppsByRegion(region: string): App[] {
  return apps.filter(app =>
    app.regions.some(r => r.toLowerCase().includes(region.toLowerCase()) || region.toLowerCase().includes(r.toLowerCase()))
  );
}

export function searchApps(query: string): App[] {
  const lowerQuery = query.toLowerCase();
  return apps.filter(app =>
    app.name.toLowerCase().includes(lowerQuery) ||
    app.description.toLowerCase().includes(lowerQuery) ||
    app.category.toLowerCase().includes(lowerQuery)
  );
}

export function extractAppFromUrl(url: string): string | null {
  const playStoreMatch = url.match(/play\.google\.com\/store\/apps\/details\?id=([^&]+)/);
  if (playStoreMatch) {
    const packageName = playStoreMatch[1];
    const appNameGuess = packageName.split('.').pop() || '';
    return appNameGuess;
  }

  const appStoreMatch = url.match(/apps\.apple\.com\/.*\/app\/([^\/]+)/);
  if (appStoreMatch) {
    return appStoreMatch[1].replace(/-/g, ' ');
  }

  return null;
}
