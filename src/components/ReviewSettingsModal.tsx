import { useState, useEffect } from 'react';
import { getReviewSettings, updateReviewSettings, ReviewTone, ReviewFocus, DetailLevel, ReviewSettings } from '../api/github';
import { getErrorMessage } from '../utils/errorMessages';
import { toast } from 'react-toastify';

interface ReviewSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

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

const ReviewSettingsModal: React.FC<ReviewSettingsModalProps> = ({ isOpen, onClose }) => {
    const [tone, setTone] = useState<ReviewTone>('NEUTRAL');
    const [focus, setFocus] = useState<ReviewFocus>('BOTH');
    const [detailLevel, setDetailLevel] = useState<DetailLevel>('STANDARD');
    const [customInstructions, setCustomInstructions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadSettings();
        } else {
            setTone('NEUTRAL');
            setFocus('BOTH');
            setDetailLevel('STANDARD');
            setCustomInstructions('');
            setIsLoading(false);
            setIsSaving(false);
        }
    }, [isOpen]);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const data = await getReviewSettings();
            setTone(data.tone);
            setFocus(data.focus);
            setDetailLevel(data.detailLevel);
            setCustomInstructions(data.customInstructions || '');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const settings: ReviewSettings = {
                tone,
                focus,
                detailLevel,
                customInstructions: customInstructions.trim() || null,
            };
            await updateReviewSettings(settings);
            toast.success('리뷰 설정이 저장되었습니다.');
            onClose();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsSaving(false);
        }
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-xl bg-[#1a1a1f] border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <h2 className="text-[15px] font-semibold text-white">AI 리뷰 설정</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <OptionGroup
                                label="리뷰 톤"
                                options={toneOptions}
                                value={tone}
                                onChange={setTone}
                            />

                            <OptionGroup
                                label="리뷰 포커스"
                                options={focusOptions}
                                value={focus}
                                onChange={setFocus}
                            />

                            <OptionGroup
                                label="상세 수준"
                                options={detailOptions}
                                value={detailLevel}
                                onChange={setDetailLevel}
                            />

                            {/* Custom Instructions */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[12px] text-slate-500">추가 지시사항 (선택)</label>
                                    <span className={`text-[11px] ${customInstructions.length >= 1000 ? 'text-rose-400' : customInstructions.length >= 800 ? 'text-amber-400' : 'text-slate-600'}`}>
                                        {customInstructions.length} / 1000
                                    </span>
                                </div>
                                <textarea
                                    value={customInstructions}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 1000) {
                                            setCustomInstructions(e.target.value);
                                        }
                                    }}
                                    maxLength={1000}
                                    className="w-full h-24 p-3 bg-white/[0.03] border border-white/10 rounded-lg text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-white/20 resize-none font-mono transition-colors"
                                    placeholder="예: React/TypeScript 프로젝트입니다. 보안 취약점에 특히 주의해주세요."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-2 px-5 py-4 border-t border-white/5">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 text-[13px] text-slate-400 rounded-lg hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isLoading}
                        className="px-4 py-2 text-[13px] font-medium text-white bg-white/10 border border-white/10 rounded-lg hover:bg-white/15 hover:border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {isSaving && (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        <span>{isSaving ? '저장 중...' : '저장'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewSettingsModal;
