import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import strategyService from '../services/strategyService';
import tradeService from '../services/tradeService';
import { TradeContext } from '../context/TradeContext';
import PageHeader from '../components/ui/PageHeader';
import TradeContextSection from '../components/ui/TradeContextSection';
import TradeChartsSection from '../components/ui/TradeChartsSection';
import TradeReviewSection from '../components/ui/TradeReviewSection';

const AddTrade = () => {
  const navigate = useNavigate();
  const { createTrade } = useContext(TradeContext);
  const [loading, setLoading] = useState(false);
  
  const [files, setFiles] = useState({
    screenshotHTF: null,
    screenshotMTF: null,
    screenshotLTF: null,
  });

  const [previewUrls, setPreviewUrls] = useState({
    screenshotHTF: null,
    screenshotMTF: null,
    screenshotLTF: null,
  });

  const [formData, setFormData] = useState({
    pair: 'EURUSD',
    direction: 'Long',
    lotSize: '',
    session: 'London',
    duration: '',
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    takeProfit: '',
    riskPercentage: '',
    rMultiple: '',
    fees: '',
    swap: '',
    netPnl: '',
    followedPlan: false,
    intendedPlan: '',
    tradeManagement: '',
    entryEmotion: '',
    exitEmotion: '',
    noteReflection: '',
    entryConfluences: [],
    mistakesMade: '',
    lessonsLearned: '',
    isPublic: false,
  });

  const [strategies, setStrategies] = useState([]);
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);
  const [isParsingImage, setIsParsingImage] = useState(false);

  const netPnlRef = useRef(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const data = await strategyService.getStrategies();
        setStrategies(data);
      } catch (error) {
        console.error('Error fetching strategies', error);
      }
    };
    fetchStrategies();
  }, []);

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
      setPreviewUrls((prev) => ({ ...prev, [name]: URL.createObjectURL(selectedFiles[0]) }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAutoFillImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('tradeScreenshot', file);

    try {
      const data = await tradeService.parseImage(formDataUpload);

      setFormData(prev => ({
        ...prev,
        netPnl: data.netPnl !== undefined && data.netPnl !== '' ? data.netPnl : prev.netPnl,
        pair: data.pair || prev.pair,
        direction: data.direction || prev.direction,
        lotSize: data.lotSize || prev.lotSize,
        entryPrice: data.entryPrice || prev.entryPrice,
        exitPrice: data.exitPrice || prev.exitPrice,
      }));
    } catch (error) {
      console.error('Error parsing image:', error);
      alert('Failed to parse image. Please ensure your API key is configured correctly and try again.');
    } finally {
      setIsParsingImage(false);
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'entryConfluences') {
          formData[key].forEach(val => submitData.append('entryConfluences[]', val));
        } else if (key === 'netPnl') {
          let cleanPnl = formData[key].toString().replace(/[^0-9.-]/g, '');
          submitData.append(key, cleanPnl);
        } else {
          submitData.append(key, formData[key]);
        }
      });
      
      if (files.screenshotHTF) submitData.append('screenshotHTF', files.screenshotHTF);
      if (files.screenshotMTF) submitData.append('screenshotMTF', files.screenshotMTF);
      if (files.screenshotLTF) submitData.append('screenshotLTF', files.screenshotLTF);

      const selectedStrategy = strategies.find(s => s._id === formData.intendedPlan);
      if (selectedStrategy) {
        submitData.append('strategyName', selectedStrategy.name);
      }

      await createTrade(submitData);
      navigate('/dashboard/journal');
    } catch (error) {
      console.error('Error creating trade', error);
      alert('Failed to save trade.');
    } finally {
      setLoading(false);
    }
  };

  const emotionOptions = [
    { label: 'Select emotion...', value: '' },
    { label: '😐 Calm / Neutral', value: 'Calm' },
    { label: '😌 Patient', value: 'Patient' },
    { label: '😎 Confident', value: 'Confident' },
    { label: '🤑 Greedy', value: 'Greedy' },
    { label: '🏃 FOMO', value: 'FOMO' },
    { label: '😰 Anxious / Nervous', value: 'Anxious' },
    { label: '😡 Frustrated / Angry', value: 'Frustrated' },
    { label: '🔥 Revenge Trading', value: 'Revenge' },
    { label: '🤠 Overconfident', value: 'Overconfident' },
    { label: '🥱 Bored', value: 'Bored' },
    { label: '😃 Happy / Satisfied', value: 'Happy' },
    { label: '😔 Disappointed', value: 'Disappointed' },
  ];

  const handleConfluenceChange = (point) => {
    setFormData(prev => {
      const current = prev.entryConfluences || [];
      if (current.includes(point)) {
        return { ...prev, entryConfluences: current.filter(c => c !== point) };
      } else {
        return { ...prev, entryConfluences: [...current, point] };
      }
    });
  };

  const selectedStrategy = strategies.find(s => s._id === formData.intendedPlan);
  const strategyPoints = selectedStrategy?.entryCriteria ? selectedStrategy.entryCriteria.split('\n').filter(p => p.trim() !== '') : [];

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 text-gray-200 [html:not(.dark)_&]:text-slate-800">
      <PageHeader 
        title="Log New Trade" 
        titleClassName="text-[15px] font-bold"
        backLink="/dashboard/journal" 
        rightContent={
          <>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold transition-colors mr-2 ${
                formData.isPublic 
                  ? 'bg-violet-500/10 border-violet-500/30 text-violet-500 [html:not(.dark)_&]:bg-violet-50 [html:not(.dark)_&]:border-violet-200 [html:not(.dark)_&]:text-violet-600' 
                  : 'bg-[#1c1c1c] border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-800'
              }`}
            >
              <div className={`w-3 h-3 rounded-[2px] border flex items-center justify-center transition-colors ${
                formData.isPublic ? 'bg-violet-500 border-violet-500' : 'border-gray-500 bg-transparent [html:not(.dark)_&]:border-slate-400'
              }`}>
                {formData.isPublic && (
                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              Make Trade Public
            </button>
            <button 
              type="submit" 
              form="trade-form" 
              disabled={loading}
              className="bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-xs font-bold py-1 px-3 rounded-md shadow-lg shadow-violet-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? 'Saving...' : 'Save Trade'}
            </button>
          </>
        }
      />
      
      <form id="trade-form" onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        <TradeContextSection 
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleAutoFillImage={handleAutoFillImage}
          isParsingImage={isParsingImage}
          netPnlRef={netPnlRef}
        />

        <div className="xl:col-span-8 space-y-6">
          <TradeChartsSection 
            previewUrls={previewUrls}
            handleFileChange={handleFileChange}
          />

          <TradeReviewSection 
            formData={formData}
            handleChange={handleChange}
            strategies={strategies}
            isChecklistOpen={isChecklistOpen}
            setIsChecklistOpen={setIsChecklistOpen}
            strategyPoints={strategyPoints}
            handleConfluenceChange={handleConfluenceChange}
            emotionOptions={emotionOptions}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddTrade;
