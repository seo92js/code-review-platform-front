import React from 'react';
import LoginButton from './LoginButton';

const LandingPage: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col items-center px-6 py-16">
            {/* Hero Section */}
            <div className="text-center max-w-2xl animate-fade-in-up">

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight relative">
                    AI가 당신의
                    <br />
                    <span className="text-gradient">코드를 리뷰</span>합니다
                </h1>
                <p className="text-base md:text-lg text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto">
                    Pull Request가 올라오면 자동으로 AI가 코드 리뷰를 제공합니다.
                </p>
                <LoginButton size="large" />
            </div>

            {/* How It Works */}
            <div className="mt-24 w-full max-w-3xl animate-fade-in-up animate-delay-200 relative">
                <p className="text-center text-xs font-medium text-slate-600 uppercase tracking-widest mb-10">
                    How It Works
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Step 1 */}
                    <div className="glass rounded-2xl p-6 text-center border border-white/10 hover:border-white/20 transition-colors">
                        <div className="text-4xl font-bold text-gradient mb-3">01</div>
                        <h3 className="text-white font-semibold mb-2">GitHub 연동</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            GitHub 계정으로 로그인하고 리포지토리를 연결하세요
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="glass rounded-2xl p-6 text-center border border-white/10 hover:border-white/20 transition-colors">
                        <div className="text-4xl font-bold text-gradient mb-3">02</div>
                        <h3 className="text-white font-semibold mb-2">웹훅 설정</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            클릭 한 번으로 웹훅을 연결하면 자동으로 PR을 감지합니다
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="glass rounded-2xl p-6 text-center border border-white/10 hover:border-white/20 transition-colors">
                        <div className="text-4xl font-bold text-gradient mb-3">03</div>
                        <h3 className="text-white font-semibold mb-2">AI 자동 리뷰</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            PR이 생성되면 AI가 코드를 분석하고 인라인 코멘트를 작성합니다
                        </p>
                    </div>
                </div>
            </div>

            {/* Key Features */}
            <div className="mt-24 w-full max-w-3xl animate-fade-in-up animate-delay-400">
                <p className="text-center text-xs font-medium text-slate-600 uppercase tracking-widest mb-10">
                    Features
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Feature 1 */}
                    <div className="glass rounded-xl p-5 border border-white/5 hover:border-white/15 transition-all duration-300">
                        <h3 className="text-white font-medium mb-1.5">AI 인라인 코멘트</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            GitHub PR에 직접 코드 라인별 피드백
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="glass rounded-xl p-5 border border-white/5 hover:border-white/15 transition-all duration-300">
                        <h3 className="text-white font-medium mb-1.5">커스텀 리뷰 규칙</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            팀 코딩 컨벤션에 맞는 규칙 설정
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="glass rounded-xl p-5 border border-white/5 hover:border-white/15 transition-all duration-300">
                        <h3 className="text-white font-medium mb-1.5">민감 파일 보호</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            ignore 패턴으로 파일 제외
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

