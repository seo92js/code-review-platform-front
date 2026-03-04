const reviewResult = `{ "generalReview": "이번 변경 사항에 대한 리뷰를 진행하겠습니다. 전반적으로 코드 개선이 필요하며, 특히 보안 및 성능 측면에서 주의해야 할 부분이 있습니다.", "comments": [ { "file": "src/app/api/stores/bounding/route.ts", "codeSnippet": "const rawStores = await prisma.$queryRaw<any[]>\`", "comment": "raw 쿼리를 사용하고 있습니다. SQL 인젝션 공격에 취약할 수 있으므로, 매개변수화된 쿼리로 변경해 보안성을 높여야 합니다." }, { "file": "src/app/store/mapStore.ts", "codeSnippet": "setBounds: (minLat: number, maxLat: number, minLng: number, maxLng: number) => void;", "comment": "setBounds 함수의 인자로 전달되는 값에 대한 유효성 검사 로직이 필요합니다. 비정상적인 값이 들어오면 예기치 않은 동작을 초래할 수 있습니다." }, { "file": "src/components/Map.tsx", "codeSnippet": "console.log(\"Clicked:\", store.title);", "comment": "console.log 사용은 프로덕션 환경에서 제거해야 합니다. 보안 및 성능에 영향을 줄 수 있으므로, 적절한 로깅 솔루션을 사용하세요." } ] }`;

try {
    const parsed = typeof reviewResult === 'string' ? JSON.parse(reviewResult) : reviewResult;
    console.log("SUCCESS:", parsed.generalReview);
} catch (e) {
    console.log("ERROR:", e.message);
}
