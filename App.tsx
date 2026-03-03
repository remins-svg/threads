
import React, { useState } from 'react';
import { Send, Copy, RefreshCw, Trash2, Sparkles, MessageSquare, Target, Lightbulb, TrendingUp, Info, Search, ArrowRight, UserCheck, UserCircle, Image as ImageIcon } from 'lucide-react';
import { PERSONAS, VIRAL_FORMULAS } from './constants';
import { Persona, AppMode, ViralFormula, FormulaRecommendation, ProfileContent } from './types';
import { transformTone, generateViralPost, getFormulaRecommendation, generateProfileContent, generateProfileImage } from './services/gemini';
import ThreadsPreview from './components/ThreadsPreview';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('ADVISOR');
  
  // Advisor State
  const [advisorInput, setAdvisorInput] = useState('');
  const [recommendations, setRecommendations] = useState<FormulaRecommendation[]>([]);
  const [isAdvising, setIsAdvising] = useState(false);

  // Transform State
  const [inputText, setInputText] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<Persona>(PERSONAS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string>('');
  
  // Viral Formula State
  const [situation, setSituation] = useState('');
  const [selectedFormula, setSelectedFormula] = useState<ViralFormula>(VIRAL_FORMULAS[0]);
  const [isViralGenerating, setIsViralGenerating] = useState(false);
  const [viralOutput, setViralOutput] = useState<string>('');

  // Profile State
  const [brandInfo, setBrandInfo] = useState('');
  const [profileStyle, setProfileStyle] = useState('친근하고 위트있는');
  const [profileContent, setProfileContent] = useState<ProfileContent | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isProfileGenerating, setIsProfileGenerating] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  const handleTransform = async () => {
    if (!inputText.trim()) {
      setError('변환할 문구를 입력해주세요.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const result = await transformTone(inputText, selectedPersona);
      setOutput(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViralGenerate = async () => {
    if (!situation.trim()) {
      setError('현재 상황을 입력해주세요.');
      return;
    }
    setIsViralGenerating(true);
    setError(null);
    try {
      const result = await generateViralPost(situation, selectedFormula);
      setViralOutput(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsViralGenerating(false);
    }
  };

  const handleGetAdvisorRecommendation = async () => {
    if (!advisorInput.trim()) {
      setError('상황을 입력해주세요.');
      return;
    }
    setIsAdvising(true);
    setError(null);
    try {
      const results = await getFormulaRecommendation(advisorInput);
      setRecommendations(results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAdvising(false);
    }
  };

  const handleProfileGenerate = async () => {
    if (!brandInfo.trim()) {
      setError('브랜드 정보를 입력해주세요.');
      return;
    }
    setIsProfileGenerating(true);
    setError(null);
    setProfileImageUrl(null);
    try {
      const content = await generateProfileContent(brandInfo, profileStyle);
      setProfileContent(content);
      
      // Auto-generate image
      setIsImageGenerating(true);
      const imageUrl = await generateProfileImage(content.imagePrompt);
      setProfileImageUrl(imageUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProfileGenerating(false);
      setIsImageGenerating(false);
    }
  };

  const handleRegenerateImage = async () => {
    if (!profileContent) return;
    setIsImageGenerating(true);
    try {
      const imageUrl = await generateProfileImage(profileContent.imagePrompt);
      setProfileImageUrl(imageUrl);
    } catch (err: any) {
      setError("이미지 재생성 실패");
    } finally {
      setIsImageGenerating(false);
    }
  };

  const handleUseFormula = (formulaId: string) => {
    const formula = VIRAL_FORMULAS.find(f => f.id === formulaId);
    if (formula) {
      setSelectedFormula(formula);
      setSituation(advisorInput);
      setMode('VIRAL_FORMULA');
      setViralOutput(''); 
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('클립보드에 복사되었습니다!');
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
               <TrendingUp className="text-white" size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Threads 치트키 마케팅</h1>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
             <button 
                onClick={() => setMode('ADVISOR')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'ADVISOR' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
             >
               <Search size={14} /> 전략 추천
             </button>
             <button 
                onClick={() => setMode('VIRAL_FORMULA')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'VIRAL_FORMULA' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
             >
               <Target size={14} /> 떡상 공식
             </button>
             <button 
                onClick={() => setMode('PROFILE')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'PROFILE' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
             >
               <UserCircle size={14} /> 프로필 생성
             </button>
             <button 
                onClick={() => setMode('TRANSFORM')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'TRANSFORM' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
             >
               <RefreshCw size={14} /> 톤 파괴기
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-4">
        {mode === 'ADVISOR' ? (
          <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-500">
             <section className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-blue-600 text-sm font-bold border border-blue-100 mb-2">
                   <Lightbulb size={16} /> 1만 조회수 컨설턴트
                </div>
                <h2 className="text-4xl font-black tracking-tight leading-tight">
                   "스레드, 대체 어떤 유형으로 <br/>써야 터질까요?"
                </h2>
                <p className="text-gray-500 text-lg">
                   고민이나 상황을 적어주시면 데이터 기반 10가지 공식 중 <br/>가장 강력한 전략 3가지를 추천해 드립니다.
                </p>
             </section>

             <section className="relative">
                <textarea
                  value={advisorInput}
                  onChange={(e) => setAdvisorInput(e.target.value)}
                  placeholder="예: 빵집을 하는데 말차 소금빵이 진짜 맛있거든요? 근데 홍보를 어떻게 해야 할지 모르겠어요. 반응이 전혀 없네요..."
                  className="w-full h-40 p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-black transition-all resize-none font-medium placeholder:text-gray-300 outline-none text-lg shadow-inner"
                />
                <button
                  onClick={handleGetAdvisorRecommendation}
                  disabled={isAdvising || !advisorInput}
                  className={`w-full mt-4 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-xl transition-all shadow-lg ${
                    isAdvising ? 'bg-gray-100 text-gray-400' : 'bg-black text-white hover:scale-[1.01] active:scale-[0.98]'
                  }`}
                >
                  {isAdvising ? <RefreshCw className="animate-spin" size={24} /> : <Sparkles size={24} />}
                  맞춤형 공식 추천받기
                </button>
                {error && <p className="mt-4 text-red-500 font-bold text-center">⚠️ {error}</p>}
             </section>

             {recommendations.length > 0 && (
               <section className="space-y-6">
                 <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 text-center">당신을 위한 3가지 필승 전략</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {recommendations.map((rec, index) => {
                     const formula = VIRAL_FORMULAS.find(f => f.id === rec.formulaId);
                     if (!formula) return null;
                     return (
                       <div key={index} className="bg-white border-2 border-gray-100 p-6 rounded-3xl shadow-sm hover:border-black transition-all flex flex-col group animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 150}ms` }}>
                         <div className="text-3xl mb-3">{formula.emoji}</div>
                         <h4 className="text-xl font-black mb-2">{formula.title}</h4>
                         <p className="text-sm text-gray-500 mb-6 flex-grow leading-relaxed">
                           {rec.reason}
                         </p>
                         <button 
                           onClick={() => handleUseFormula(formula.id)}
                           className="flex items-center justify-between w-full p-4 bg-gray-50 group-hover:bg-black group-hover:text-white rounded-2xl transition-all font-bold text-sm"
                         >
                           이 공식으로 글쓰기
                           <ArrowRight size={18} />
                         </button>
                       </div>
                     );
                   })}
                 </div>
               </section>
             )}
          </div>
        ) : mode === 'VIRAL_FORMULA' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
            {/* Left: Formula Selection (4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                    1. 터지는 공식 (10선)
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                  {VIRAL_FORMULAS.map((formula) => (
                    <button
                      key={formula.id}
                      onClick={() => {
                        setSelectedFormula(formula);
                        setError(null);
                      }}
                      className={`group flex items-center gap-3 p-4 rounded-2xl text-left transition-all border-2 ${
                        selectedFormula.id === formula.id 
                        ? 'border-black bg-black text-white shadow-xl translate-x-1' 
                        : 'border-gray-50 hover:border-gray-200 bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{formula.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-black text-sm">{formula.title}</h3>
                        <p className={`text-[10px] leading-tight mt-0.5 font-medium ${selectedFormula.id === formula.id ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formula.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100">
                <div className="flex items-center gap-2 text-yellow-900 font-black mb-2">
                   <UserCheck size={18} />
                   <span className="text-sm tracking-tight">마케터의 조언</span>
                </div>
                <p className="text-yellow-800 text-xs leading-relaxed font-medium">
                  {selectedFormula.tip}
                </p>
              </section>
            </div>

            {/* Right: Input & Result (8 columns) */}
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-white border-2 border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                  2. 현재 상황 입력 (내 아이템/고민)
                </label>
                <textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="예: 13년째 김치찌개만 고집해온 맛집 사장인데, 스레드에선 투명인간 취급받고 있어요..."
                  className="w-full h-32 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-black transition-all resize-none font-bold placeholder:text-gray-300 outline-none"
                />
                <button
                  onClick={handleViralGenerate}
                  disabled={isViralGenerating || !situation}
                  className={`w-full mt-6 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-xl transition-all ${
                    isViralGenerating ? 'bg-gray-100 text-gray-400' : 'bg-black text-white hover:scale-[1.02] shadow-lg'
                  }`}
                >
                  {isViralGenerating ? <RefreshCw className="animate-spin" size={24} /> : <Sparkles size={24} />}
                  1만 조회수 문구 뽑아내기
                </button>
                {error && <p className="mt-3 text-red-500 text-xs font-black text-center">⚠️ {error}</p>}
              </section>

              <section>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                  3. 생성 결과
                </label>
                {viralOutput ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ThreadsPreview 
                      content={viralOutput} 
                      personaName={selectedFormula.title} 
                      personaEmoji={selectedFormula.emoji}
                    />
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleCopy(viralOutput)}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-100 text-black font-black rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
                      >
                        <Copy size={20} /> 문구 전체 복사
                      </button>
                      <button 
                        onClick={handleViralGenerate}
                        className="p-4 bg-gray-100 text-black font-black rounded-2xl hover:bg-gray-200 transition-all active:rotate-12"
                      >
                        <RefreshCw size={24} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-80 border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-300 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                       <MessageSquare size={40} className="opacity-20" />
                    </div>
                    <p className="text-lg font-black tracking-tight leading-snug">
                      상황을 입력하면 공식에 맞춰<br/>터지는 글을 써드려요.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : mode === 'PROFILE' ? (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-500">
             <div className="space-y-8">
               <section>
                  <h2 className="text-3xl font-black mb-2">스레드 프로필 마스터</h2>
                  <p className="text-gray-500 font-medium">나만의 브랜드와 이미지로 <br/>압도적인 첫인상을 만드세요.</p>
               </section>
               <section className="space-y-4">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400">나의 브랜드/서비스 정보</label>
                  <textarea
                    value={brandInfo}
                    onChange={(e) => setBrandInfo(e.target.value)}
                    placeholder="예: 20대 타겟의 미니멀 패션 쇼핑몰 '무드인', 주로 성수동 감성을 추구함"
                    className="w-full h-32 p-4 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-black transition-all outline-none font-bold"
                  />
               </section>
               <section className="space-y-4">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400">바이오 스타일</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['친근하고 위트있는', '전문적이고 신뢰가는', '감성적이고 몽환적인', '심플하고 모던한'].map(style => (
                      <button
                        key={style}
                        onClick={() => setProfileStyle(style)}
                        className={`p-3 rounded-2xl text-xs font-bold border-2 transition-all ${profileStyle === style ? 'border-black bg-black text-white' : 'border-gray-100 bg-gray-50'}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
               </section>
               <button
                  onClick={handleProfileGenerate}
                  disabled={isProfileGenerating || !brandInfo}
                  className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-xl transition-all ${
                    isProfileGenerating ? 'bg-gray-100 text-gray-400' : 'bg-black text-white hover:scale-[1.02] shadow-lg'
                  }`}
                >
                  {isProfileGenerating ? <RefreshCw className="animate-spin" size={24} /> : <Sparkles size={24} />}
                  프로필 세트 생성하기
                </button>
             </div>

             <div className="space-y-8">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">프리뷰 결과</label>
                {profileContent ? (
                  <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm animate-in zoom-in-95 duration-300">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative group">
                        {isImageGenerating ? (
                           <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center animate-pulse border-2 border-black/5">
                              <RefreshCw className="animate-spin text-gray-300" size={32} />
                           </div>
                        ) : profileImageUrl ? (
                           <img src={profileImageUrl} alt="Profile" className="w-32 h-32 rounded-full border-2 border-black/5 shadow-md object-cover" />
                        ) : (
                           <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-200">
                              <ImageIcon className="text-gray-300" size={32} />
                           </div>
                        )}
                        <button 
                          onClick={handleRegenerateImage}
                          className="absolute -bottom-2 -right-2 p-2 bg-black text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                          <RefreshCw size={16} />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black tracking-tight">{profileContent.name}</h3>
                        <p className="text-sm text-gray-400 font-bold tracking-tight">@{profileContent.name.replace(/\s/g, '').toLowerCase()}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                       <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-center">
                         {profileContent.bio}
                       </p>
                    </div>

                    <div className="flex gap-2">
                       <button onClick={() => handleCopy(profileContent.name)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-black text-xs font-black rounded-xl hover:bg-gray-200">
                          <Copy size={14} /> 이름 복사
                       </button>
                       <button onClick={() => handleCopy(profileContent.bio)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-black text-xs font-black rounded-xl hover:bg-gray-200">
                          <Copy size={14} /> 바이오 복사
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-300 p-8 text-center">
                    <UserCircle size={48} className="opacity-10 mb-4" />
                    <p className="font-black text-lg">정보를 입력하고<br/>프로필을 생성하세요.</p>
                  </div>
                )}
             </div>
          </div>
        ) : (
          /* Original Tone Transformer Mode */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-500">
            <div className="space-y-8">
              <section>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">1. 페르소나 선택</label>
                <div className="grid grid-cols-1 gap-3">
                  {PERSONAS.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => setSelectedPersona(persona)}
                      className={`flex items-start gap-4 p-4 rounded-2xl text-left transition-all border-2 ${
                        selectedPersona.id === persona.id ? 'border-black bg-black text-white shadow-lg' : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <span className="text-2xl mt-1">{persona.emoji}</span>
                      <div>
                        <h3 className="font-black">{persona.name}</h3>
                        <p className={`text-xs mt-0.5 ${selectedPersona.id === persona.id ? 'text-gray-400 font-medium' : 'text-gray-500'}`}>
                          {persona.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">2. 원문 입력</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-40 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-black outline-none resize-none font-bold"
                  placeholder="지루한 공지사항이나 제품 설명을 적어주세요."
                />
                <button
                  onClick={handleTransform}
                  disabled={isGenerating || !inputText}
                  className={`w-full mt-4 flex items-center justify-center gap-2 py-5 rounded-2xl font-black text-xl transition-all ${
                    isGenerating ? 'bg-gray-100 text-gray-400' : 'bg-black text-white hover:scale-[1.01] shadow-lg'
                  }`}
                >
                  {isGenerating ? <RefreshCw className="animate-spin" size={24} /> : <Sparkles size={24} />}
                  톤 파괴하기
                </button>
              </section>
            </div>
            <div className="space-y-8">
              <section>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">3. 변환 결과</label>
                {output ? (
                  <div className="space-y-4">
                    <ThreadsPreview content={output} personaName={selectedPersona.name} personaEmoji={selectedPersona.emoji} />
                    <button onClick={() => handleCopy(output)} className="w-full flex items-center justify-center gap-2 py-4 bg-gray-100 text-black font-black rounded-2xl hover:bg-gray-200 transition-all">
                      <Copy size={20} /> 결과 복사
                    </button>
                  </div>
                ) : (
                   <div className="w-full h-96 border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-300 text-center p-8">
                      <p className="font-black text-lg">원문을 입력하고<br/>변환 버튼을 눌러주세요.</p>
                   </div>
                )}
              </section>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-gray-100 py-10 text-center">
         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">© 2024 Threads Growth Hack Kit · Only for 10K+ Views</p>
      </footer>
    </div>
  );
};

export default App;
