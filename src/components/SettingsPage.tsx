import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    getReviewSettings, updateReviewSettings,
    getIgnorePatterns, updateIgnorePatterns,
    getOpenAiKey, updateOpenAiKey, validateOpenAiKey,
    ReviewTone, ReviewFocus, DetailLevel, ReviewSettings
} from '../api/github';
import { getErrorMessage } from '../utils/errorMessages';

// Option types
interface OptionButton<T> {
    value: T;
    label: string;
}

const toneOptions: OptionButton<ReviewTone>[] = [
    { value: 'FRIENDLY', label: '친절하게' },
    { value: 'NEUTRAL', label: '중립적' },
    { value: 'STRICT', label: '따끔하게' },
];

const focusOptions: OptionButton<ReviewFocus>[] = [
    { value: 'PRAISE_ONLY', label: '칭찬 위주' },
    { value: 'BOTH', label: '균형' },
    { value: 'IMPROVEMENT_ONLY', label: '개선점 위주' },
];

const detailOptions: OptionButton<DetailLevel>[] = [
    { value: 'CONCISE', label: '간결하게' },
    { value: 'STANDARD', label: '보통' },
    { value: 'DETAILED', label: '상세하게' },
];

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();

    // AI Review Settings
    const [tone, setTone] = useState<ReviewTone>('NEUTRAL');
    const [focus, setFocus] = useState<ReviewFocus>('BOTH');
    const [detailLevel, setDetailLevel] = useState<DetailLevel>('STANDARD');
    const [customInstructions, setCustomInstructions] = useState('');
    const [autoReviewEnabled, setAutoReviewEnabled] = useState(false);
    const [autoPostToGithub, setAutoPostToGithub] = useState(false);
    const [openaiModel, setOpenaiModel] = useState('gpt-4o-mini');

    // Ignore Patterns
    const [patterns, setPatterns] = useState<string[]>([]);
    const [newPattern, setNewPattern] = useState('');

    // API Key
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [agreed, setAgreed] = useState(false);

    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadAllSettings();
    }, []);

    const loadAllSettings = async () => {
        setIsLoading(true);
        try {
            const [reviewSettings, ignorePatterns, openAiKey] = await Promise.all([
                getReviewSettings(),
                getIgnorePatterns(),
                getOpenAiKey(),
            ]);

            setTone(reviewSettings.tone);
            setFocus(reviewSettings.focus);
            setDetailLevel(reviewSettings.detailLevel);
            setCustomInstructions(reviewSettings.customInstructions || '');
            setAutoReviewEnabled(reviewSettings.autoReviewEnabled || false);
            setAutoPostToGithub(reviewSettings.autoPostToGithub || false);
            setOpenaiModel(reviewSettings.openaiModel || 'gpt-4o-mini');

            setPatterns(ignorePatterns || []);

            setApiKey(openAiKey || '');
            if (openAiKey) setAgreed(true);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAll = async () => {
        if (apiKey.trim() && !agreed) {
            toast.warning('OpenAI API 키 사용 약관에 동의해주세요.');
            return;
        }

        setIsSaving(true);
        try {
            // API 키가 변경된 경우 먼저 유효성 검증 (마스킹된 키가 아닐 경우에만)
            if (apiKey.trim() && !apiKey.includes('****')) {
                const isValid = await validateOpenAiKey(apiKey);
                if (!isValid) {
                    toast.error('유효하지 않은 OpenAI API 키입니다.');
                    setIsSaving(false);
                    return;
                }
            }

            const reviewSettingsPayload: ReviewSettings = {
                tone,
                focus,
                detailLevel,
                customInstructions: customInstructions.trim() || null,
                autoReviewEnabled,
                autoPostToGithub,
                openaiModel,
            };

            await Promise.all([
                updateReviewSettings(reviewSettingsPayload),
                updateIgnorePatterns(patterns),
                !apiKey.includes('****') ? updateOpenAiKey(apiKey) : Promise.resolve(),
            ]);

            toast.success('설정이 저장되었습니다.');
            navigate('/');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddPattern = () => {
        if (!newPattern.trim()) return;
        if (patterns.includes(newPattern.trim())) {
            toast.warning('이미 존재하는 패턴입니다.');
            return;
        }
        setPatterns([...patterns, newPattern.trim()]);
        setNewPattern('');
    };

    const handleRemovePattern = (index: number) => {
        setPatterns(patterns.filter((_, i) => i !== index));
    };

    const OptionGroup = <T extends string>({
        label,
        options,
        value,
        onChange,
    }: {
        label: string;
        options: OptionButton<T>[];
        value: T;
        onChange: (value: T) => void;
    }) => (
        <div className="space-y-2">
            <label className="text-[12px] text-slate-500">{label}</label>
            <div className="grid grid-cols-3 gap-2">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${value === option.value
                            ? 'bg-white/10 border border-white/25 text-white'
                            : 'bg-white/[0.03] border border-white/5 text-slate-500 hover:bg-white/[0.06] hover:border-white/10 hover:text-slate-400'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-semibold text-white">Settings</h1>
            </div>

            <div className="space-y-8">
                {/* 리뷰 설정 섹션 */}
                <section className="space-y-5">
                    <h2 className="text-[14px] font-medium text-slate-300 flex items-center space-x-2">
                        <span>리뷰 설정</span>
                    </h2>

                    {/* AI 리뷰 스타일 */}
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-5">
                        <div className="text-[13px] font-medium text-white">AI 리뷰 스타일</div>

                        <OptionGroup label="" options={toneOptions} value={tone} onChange={setTone} />
                        <OptionGroup label="" options={focusOptions} value={focus} onChange={setFocus} />
                        <OptionGroup label="" options={detailOptions} value={detailLevel} onChange={setDetailLevel} />

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[12px] text-white">추가 지시사항 (선택)</label>
                                <span className={`text-[11px] ${customInstructions.length >= 1000 ? 'text-rose-400' : customInstructions.length >= 800 ? 'text-amber-400' : 'text-slate-600'}`}>
                                    {customInstructions.length} / 1000
                                </span>
                            </div>
                            <textarea
                                value={customInstructions}
                                onChange={(e) => e.target.value.length <= 1000 && setCustomInstructions(e.target.value)}
                                maxLength={1000}
                                className="w-full h-24 p-3 bg-white/[0.03] border border-white/10 rounded-lg text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-white/20 resize-none font-mono transition-colors"
                                placeholder="예: React/TypeScript 프로젝트입니다. 보안 취약점에 특히 주의해주세요."
                            />
                        </div>

                        {/* OpenAI Settings */}
                        <div className="pt-4 border-t border-white/5 space-y-4">
                            {/* 자동 리뷰 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-white">자동 리뷰</span>
                                    <span className="text-[12px] text-slate-500">PR이 올라오면 자동으로 AI 리뷰 요청</span>
                                </div>
                                <button
                                    onClick={() => setAutoReviewEnabled(!autoReviewEnabled)}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${autoReviewEnabled ? 'bg-blue-500' : 'bg-white/10'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${autoReviewEnabled ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>

                            {/* GitHub PR에 자동 게시 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-white">GitHub PR에 자동 게시</span>
                                    <span className="text-[12px] text-slate-500">리뷰 완료 시 PR 댓글로 게시</span>
                                </div>
                                <button
                                    onClick={() => setAutoPostToGithub(!autoPostToGithub)}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${autoPostToGithub ? 'bg-blue-500' : 'bg-white/10'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${autoPostToGithub ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>

                            {/* OpenAI 모델 */}
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-white">OpenAI 모델</span>
                                <select
                                    value={openaiModel}
                                    onChange={(e) => setOpenaiModel(e.target.value)}
                                    className="w-60 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-lg text-[13px] text-slate-400 focus:outline-none focus:border-white/20 transition-colors"
                                >
                                    <option value="gpt-4o-mini" className="bg-[#1a1a1f]">gpt-4o-mini</option>
                                    <option value="gpt-4o" className="bg-[#1a1a1f]">gpt-4o</option>
                                    <option value="gpt-4-turbo" className="bg-[#1a1a1f]">gpt-4-turbo</option>
                                </select>
                            </div>

                            {/* Privacy Notice */}
                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start space-x-3">
                                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="space-y-1 text-left break-keep">
                                    <p className="text-[11px] text-blue-200/80 leading-relaxed">
                                        코드 변경내역이 LLM으로 전송되며, 민감한 정보(비밀번호, 키 등)가 포함되지 않도록 주의해주세요.
                                    </p>
                                    <p className="text-[11px] text-blue-200/80 leading-relaxed">
                                        민감한 파일은 아래 'Ignore 패턴'에 추가하여 리뷰에서 제외할 수 있습니다.
                                    </p>
                                </div>
                            </div>

                            {/* OpenAI API 키 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-white">OpenAI API 키</span>
                                    {apiKey.startsWith('sk-') && apiKey.includes('****') && (
                                        <span className="text-[11px] text-emerald-500 flex items-center">
                                            <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            저장됨
                                        </span>
                                    )}
                                </div>
                                <div className="w-60 relative">
                                    <input
                                        type={showKey ? "text" : "password"}
                                        name="openai_api_key_field_custom"
                                        autoComplete="new-password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className={`w-full px-3 py-1.5 pr-8 bg-white/[0.03] border rounded-lg text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-white/20 font-mono transition-colors ${apiKey.startsWith('sk-') && apiKey.includes('****')
                                            ? 'border-emerald-500/30'
                                            : 'border-white/10'}`}
                                        placeholder="sk-..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showKey ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ignore 패턴 */}
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                        <div className="text-[13px] font-medium text-white">Ignore 패턴</div>
                        <div className="text-[12px] text-slate-500">리뷰에서 제외할 파일/디렉토리 패턴 (.gitignore 형식)</div>

                        <div className="flex space-x-2">
                            <input
                                type="text"
                                name="ignore-pattern-input"
                                autoComplete="off"
                                value={newPattern}
                                onChange={(e) => setNewPattern(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPattern())}
                                placeholder="예: *.test.js, node_modules/"
                                className="flex-1 px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-white/20 font-mono transition-colors"
                            />
                            <button
                                onClick={handleAddPattern}
                                className="px-4 py-2.5 text-[13px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                            >
                                추가
                            </button>
                        </div>

                        <div className="bg-white/[0.02] rounded-lg border border-white/5 min-h-[100px] max-h-[200px] overflow-y-auto">
                            {patterns.length === 0 ? (
                                <div className="flex items-center justify-center h-[100px] text-slate-600 text-[12px]">
                                    등록된 패턴이 없습니다.
                                </div>
                            ) : (
                                <ul className="p-2 space-y-1">
                                    {patterns.map((pattern, index) => (
                                        <li key={index} className="flex items-center justify-between px-3 py-2 bg-white/[0.03] rounded-lg group hover:bg-white/[0.06] transition-colors">
                                            <span className="text-slate-300 font-mono text-[12px]">{pattern}</span>
                                            <button
                                                onClick={() => handleRemovePattern(index)}
                                                className="text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </section>


                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="px-6 py-2.5 text-[13px] font-medium text-white bg-white/10 border border-white/10 rounded-lg hover:bg-white/15 hover:border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {isSaving && (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        <span>{isSaving ? '저장 중...' : '저장'}</span>
                    </button>
                </div>
            </div >
        </div >
    );
};

export default SettingsPage;
