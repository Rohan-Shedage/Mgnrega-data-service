import React, { useState, useEffect } from 'react';

import { MapPin, TrendingUp, Users, Briefcase, Calendar, Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import * as api from './api';

const MGNREGADashboard = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtData, setDistrictData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [language, setLanguage] = useState('en');
  const [historicalData, setHistoricalData] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  // Translations
  const translations = {
    en: {
      title: 'MGNREGA District Performance',
      subtitle: 'Track employment guarantee scheme in your district',
      selectDistrict: 'Select Your District',
      autoDetect: 'Auto-detecting your location...',
      currentMonth: 'Current Month Performance',
      households: 'Households Provided Employment',
      workDays: 'Total Person-Days of Work',
      activeWorks: 'Active Works',
      completedWorks: 'Completed Works',
      expenditure: 'Total Expenditure',
      performance: 'Performance Indicators',
      trend: 'Last 6 Months Trend',
      goodPerformance: 'Good Performance',
      needsImprovement: 'Needs Attention',
      whatIsMgnrega: 'What is MGNREGA?',
      mgnregaInfo: 'MGNREGA guarantees 100 days of wage employment per year to rural households. This dashboard shows how your district is performing.',
      loading: 'Loading data...',
      error: 'Unable to load data. Please try again.',
      crore: 'Cr',
      lakh: 'L',
      avgWage: 'Average Wage/Day',
      womenParticipation: 'Women Participation',
      lastUpdated: 'Last Updated'
    },
    hi: {
      title: 'मनरेगा जिला प्रदर्शन',
      subtitle: 'अपने जिले में रोजगार गारंटी योजना को ट्रैक करें',
      selectDistrict: 'अपना जिला चुनें',
      autoDetect: 'आपका स्थान स्वतः खोजा जा रहा है...',
      currentMonth: 'वर्तमान माह का प्रदर्शन',
      households: 'परिवारों को रोजगार दिया गया',
      workDays: 'कुल व्यक्ति-दिवस काम',
      activeWorks: 'चालू कार्य',
      completedWorks: 'पूर्ण कार्य',
      expenditure: 'कुल व्यय',
      performance: 'प्रदर्शन संकेतक',
      trend: 'पिछले 6 महीने का रुझान',
      goodPerformance: 'अच्छा प्रदर्शन',
      needsImprovement: 'ध्यान देने की आवश्यकता',
      whatIsMgnrega: 'मनरेगा क्या है?',
      mgnregaInfo: 'मनरेगा ग्रामीण परिवारों को प्रति वर्ष 100 दिन के वेतन रोजगार की गारंटी देता है। यह डैशबोर्ड दिखाता है कि आपका जिला कैसा प्रदर्शन कर रहा है।',
      loading: 'डेटा लोड हो रहा है...',
      error: 'डेटा लोड करने में असमर्थ। कृपया पुन: प्रयास करें।',
      crore: 'करोड़',
      lakh: 'लाख',
      avgWage: 'औसत मजदूरी/दिन',
      womenParticipation: 'महिला भागीदारी',
      lastUpdated: 'अंतिम अपडेट'
    }
  };

  const t = translations[language];

  // Geolocation detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // Find nearest district (client-side if needed)
          // We'll keep selection to API-driven list
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  }, []);

  // Load districts from API (or fallback)
  useEffect(() => {
    let mounted = true;
    api.fetchDistricts()
      .then(list => { if (mounted) setDistricts(list); })
      .catch(err => { console.error('Failed to load districts', err); });
    return () => { mounted = false; }
  }, []);

  // Fetch district data when selection changes
  useEffect(() => {
    if (selectedDistrict) {
      fetchDistrictData(selectedDistrict);
    }
  }, [selectedDistrict]);

  const fetchDistrictData = async (districtId) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.fetchDistrictData(districtId);
      setDistrictData(resp.current);
      setHistoricalData(resp.historical || []);
    } catch (err) {
      console.error(err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} ${t.crore}`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} ${t.lakh}`;
    return num.toLocaleString('en-IN');
  };

  const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-start justify-between mb-2">
        <Icon className="text-gray-600" size={24} />
        <div className="text-right flex-1 ml-3">
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          <div className="text-sm text-gray-600 mt-1">{label}</div>
          {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
        </div>
      </div>
    </div>
  );

  const PerformanceBar = ({ score }) => {
    const getColor = (s) => {
      if (s >= 80) return '#10b981';
      if (s >= 60) return '#f59e0b';
      return '#ef4444';
    };

    const getIcon = (s) => {
      if (s >= 80) return CheckCircle;
      if (s >= 60) return AlertCircle;
      return XCircle;
    };

    const Icon = getIcon(score);
    const color = getColor(score);

    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{t.performance}</span>
          <div className="flex items-center">
            <Icon size={20} style={{ color }} className="mr-1" />
            <span className="text-lg font-bold" style={{ color }}>{score}%</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="h-3 rounded-full transition-all duration-500"
            style={{ width: `${score}%`, backgroundColor: color }}
          />
        </div>
        <div className="text-xs text-gray-600 mt-1 text-right">
          {score >= 80 ? t.goodPerformance : t.needsImprovement}
        </div>
      </div>
    );
  };

  const TrendChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.households));

    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{t.trend}</h3>
        <div className="flex items-end justify-between h-32 gap-2">
          {data.map((item, idx) => {
            const height = (item.households / maxValue) * 100;
            const color = item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#ef4444';

            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full rounded-t transition-all duration-500 hover:opacity-80"
                  style={{ 
                    height: `${height}%`,
                    backgroundColor: color,
                    minHeight: '8px'
                  }}
                />
                <div className="text-xs text-gray-600 mt-2">{item.month}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-green-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{t.title}</h1>
              <p className="text-sm text-orange-100">{t.subtitle}</p>
            </div>
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-50 transition"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center text-blue-800 font-medium w-full"
          >
            <Info size={20} className="mr-2" />
            <span>{t.whatIsMgnrega}</span>
          </button>
          {showInfo && (
            <p className="text-sm text-blue-700 mt-2 pl-7">{t.mgnregaInfo}</p>
          )}
        </div>

        {/* District Selection */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin size={16} className="inline mr-1" />
            {t.selectDistrict}
          </label>
          {userLocation && !selectedDistrict && (
            <p className="text-sm text-green-600 mb-2">{t.autoDetect}</p>
          )}
          <select
            value={selectedDistrict || ''}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">-- {t.selectDistrict} --</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t.loading}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <AlertCircle size={20} className="inline mr-2" />
            {error}
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && !error && districtData && (
          <div className="space-y-6">
            {/* Current Month Header */}
            <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">{t.currentMonth}</h2>
                  <p className="text-sm text-orange-100">
                    {districts.find(d => d.id === selectedDistrict)?.name} • {districtData.month}
                  </p>
                </div>
                <Calendar size={32} />
              </div>
              <PerformanceBar score={districtData.performanceScore} />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                icon={Users}
                label={t.households}
                value={formatNumber(districtData.households)}
                color="#f97316"
              />
              <StatCard
                icon={Briefcase}
                label={t.workDays}
                value={formatNumber(districtData.personDays)}
                color="#22c55e"
              />
              <StatCard
                icon={TrendingUp}
                label={t.activeWorks}
                value={districtData.activeWorks}
                color="#3b82f6"
                subtext={`${districtData.completedWorks} ${t.completedWorks}`}
              />
              <StatCard
                icon={Users}
                label={t.expenditure}
                value={`₹${districtData.expenditure.toFixed(2)} ${t.crore}`}
                color="#8b5cf6"
              />
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-sm text-gray-600">{t.avgWage}</div>
                <div className="text-2xl font-bold text-gray-800 mt-1">₹{districtData.avgWage}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-sm text-gray-600">{t.womenParticipation}</div>
                <div className="text-2xl font-bold text-gray-800 mt-1">{districtData.womenParticipation}%</div>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <TrendChart data={historicalData} />
            </div>

            {/* Last Updated */}
            <div className="text-center text-sm text-gray-500">
              {t.lastUpdated}: {districtData.lastUpdated}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MGNREGADashboard;
