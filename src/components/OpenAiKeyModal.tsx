import { useState, useEffect } from 'react';
import { getOpenAiKey, updateOpenAiKey } from '../api/github';
import { getErrorMessage } from '../utils/errorMessages';
import { toast } from 'react-toastify';

interface OpenAiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OpenAiKeyModal: React.FC<OpenAiKeyModalProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [agreed, setAgreed] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadApiKey();
        } else {
            setApiKey('');
            setIsLoading(false);
            setIsSaving(false);
            setShowKey(false);
            setAgreed(false);
        }
    }, [isOpen]);

    const loadApiKey = async () => {
        setIsLoading(true);
        try {
            const data = await getOpenAiKey();
            setApiKey(data || '');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!apiKey.trim()) {
            toast.warning('OpenAI API 키를 입력해주세요.');
            return;
        }

        if (!agreed) {
            toast.warning('약관에 동의해주세요.');
            return;
        }

        setIsSaving(true);
        try {
            await updateOpenAiKey(apiKey);
            toast.success('OpenAI API 키가 성공적으로 저장되었습니다.');
            onClose();
        } catch (error) {
            toast.error(getErrorMessage(error));
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
            <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-xl bg-[#1a1a1f] border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <h2 className="text-[15px] font-semibold text-white">OpenAI API 키</h2>
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
                        <div className="flex items-center justify-center h-32">
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <label className="flex items-center space-x-3.5 cursor-pointer p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="w-4 h-4 text-blue-500 bg-white/5 border-white/20 rounded focus:ring-blue-500 focus:ring-1 cursor-pointer"
                                />
                                <span className="text-[12px] text-slate-400 leading-relaxed text-left">
                                    API 키는 암호화되어 저장되며, 귀하의 계정에서만 사용됩니다.<br />
                                    저장 시 OpenAI 비용 발생 및 코드 전송에 동의합니다.
                                </span>
                            </label>

                            <div className="space-y-1.5">
                                <label className="text-[12px] text-slate-500">API Key</label>
                                <div className="relative">
                                    <input
                                        type={showKey ? "text" : "password"}
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="w-full p-3 pr-10 bg-white/[0.03] border border-white/10 rounded-lg text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-white/20 font-mono transition-colors"
                                        placeholder="sk-..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
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

export default OpenAiKeyModal;
