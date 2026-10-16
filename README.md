# 퀴즈 답안지

로컬 LLM이 만든 퀴즈 JSON 파일을 불러와 푸는 웹앱입니다. 안드로이드에서 홈 화면에 설치하면 앱처럼 열리고, 인터넷 없이도 동작합니다.

## 파일 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 앱 본체 |
| `manifest.webmanifest` | 앱 이름, 아이콘, 전체 화면 설정 |
| `sw.js` | 오프라인 동작 (service worker) |
| `icons/` | 홈 화면 아이콘 |

## 퀴즈 파일 형식

```json
{
  "title": "세트 제목",
  "source": "출처",
  "questions": [
    { "id": "q1", "type": "multiple_choice", "prompt": "문제", "options": ["A", "B", "C", "D"], "answer": 0, "explanation": "해설", "tags": ["태그"], "difficulty": 1 },
    { "id": "q2", "type": "boolean", "prompt": "문제", "answer": false, "explanation": "해설" },
    { "id": "q3", "type": "short_answer", "prompt": "문제", "answer": "모범 답안", "keywords": ["핵심어1", "핵심어2"] }
  ]
}
```

- `answer`는 객관식에서 **0부터 세는** 보기 번호입니다.
- 단답형은 `keywords`의 60% 이상이 답에 들어 있으면 정답 처리됩니다.

## 앱을 고친 뒤 다시 올릴 때

`sw.js` 맨 위의 `VERSION` 값을 `"v2"`, `"v3"`처럼 올려서 함께 올리세요. 그래야 이미 설치한 폰에서도 새 버전으로 바뀝니다. (앱을 한 번 열고, 닫았다가 다시 열면 반영됩니다.)
