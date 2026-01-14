import { useState, useEffect } from 'react';
import { getSystemPrompt, updateSystemPrompt } from '../api/github';
import { toast } from 'react-toastify';

interface SystemPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SystemPromptModal: React.FC<SystemPromptModalProps> = ({ isOpen, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadPrompt();
        } else {
            setPrompt('');
            setIsLoading(false);
            setIsSaving(false);
        }
    }, [isOpen]);

    const loadPrompt = async () => {
        setIsLoading(true);
        try {
            const data = await getSystemPrompt();
            setPrompt(data);
        } catch (error) {
            console.error('프롬프트 조회 실패:', error);
            toast.error('프롬프트를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSystemPrompt(prompt);
            toast.success('시스템 프롬프트가 성공적으로 저장되었습니다.');
            onClose();
        } catch (error) {
            console.error('프롬프트 저장 실패:', error);
            toast.error('프롬프트 저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl bg-[#1a1a1f] border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <h2 className="text-[15px] font-semibold text-white">AI 리뷰 프롬프트</h2>
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
                        <div className="space-y-4">
                            <div className="text-[12px] text-slate-500 leading-relaxed">
                                프롬프트를 통해 리뷰 스타일, 체크 항목, 포맷 등을 커스터마이징할 수 있습니다.
                            </div>
                            <div className="space-y-2">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 2000) {
                                            setPrompt(e.target.value);
                                        }
                                    }}
                                    maxLength={2000}
                                    className="w-full h-72 p-4 bg-white/[0.03] border border-white/10 rounded-lg text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-white/20 resize-none font-mono transition-colors"
                                    placeholder="ex) 코드 리뷰 시 다음 사항을 중점적으로 확인해주세요&#13;&#10;1. 보안 취약점&#13;&#10;2. 성능 최적화&#13;&#10;3. 코드 가독성"
                                />
                                <div className="flex justify-end">
                                    <span className={`text-[11px] ${prompt.length >= 2000 ? 'text-rose-400' : prompt.length >= 1800 ? 'text-amber-400' : 'text-slate-600'}`}>
                                        {prompt.length} / 2000
                                    </span>
                                </div>
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

export default SystemPromptModal;
