import { useState, useEffect } from 'react';
import { getOpenAiKey, updateOpenAiKey } from '../api/github';
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
            console.error('OpenAI 키 조회 실패:', error);
            toast.error('OpenAI 키를 불러오는데 실패했습니다.');
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
            console.error('OpenAI 키 저장 실패:', error);
            toast.error('OpenAI 키 저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] flex flex-col m-4">
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">OpenAI API 키 설정</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="mb-4">
                                <p className="text-left text-xs text-gray-400 leading-relaxed mb-2">
                                    AI 코드 리뷰에 사용할 OpenAI API 키를 설정할 수 있습니다.
                                </p>
                                <p className="text-left text-xs text-gray-400 leading-relaxed mb-2">
                                    API 키는 암호화되어 저장되며, 귀하의 계정에서만 사용됩니다.
                                </p>
                                <p className="text-left text-xs text-gray-400 leading-relaxed mb-2">
                                    저장 시 OpenAI 비용 발생 및 코드 전송에 동의합니다.
                                </p>
                            </div>

                            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3">
                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="mt-0.5 w-4 h-4 text-blue-600 bg-slate-700 border-slate-500 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                    />
                                    <span className="text-xs text-gray-300 leading-relaxed">
                                        위 내용을 읽고 동의합니다.
                                    </span>
                                </label>
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <input
                                        type={showKey ? "text" : "password"}
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="w-full p-3 pr-12 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 font-mono text-sm"
                                        placeholder="api key를 입력해주세요"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showKey ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700/50 flex items-center justify-end space-x-3">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-500 rounded-lg hover:bg-blue-700 hover:border-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {isSaving && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        <span>{isSaving ? '저장 중...' : '저장'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OpenAiKeyModal;
