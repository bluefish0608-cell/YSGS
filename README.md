# YSGS 홈페이지 유지보수 가이드

YSGS 홈페이지는 정적 멀티페이지 사이트입니다. 별도의 관리자 페이지나 서버 데이터베이스 없이, 대부분의 홈페이지 내용은 `data/*.js` 파일을 수정해서 관리합니다.

일반적인 운영진 콘텐츠 수정은 `data/`와 `assets/`만 보면 충분합니다. `js/`, `pages/`, `styles.css`는 기능과 디자인을 바꾸는 영역이므로 구조를 이해한 뒤 신중하게 수정하세요.

## 빠른 수정 가이드

| 바꾸고 싶은 내용 | 수정할 파일 |
| --- | --- |
| 사이트 이름, 영문명, 소속, 상단 로고 아이콘 | `data/site-data.js` |
| 메인 첫 화면 히어로 문구, 버튼, 배경 이미지 | `data/index-data.js` |
| 메인 What We Do에 표시할 활동 선택 | `data/home-data.js` |
| 메인 주요 소식 카드, 최근 공지 개수 | `data/home-news-data.js` |
| 소식 게시글, 작성자, 첨부파일, 게시글 본문 | `data/news-data.js` |
| 동아리소개 문구, 가치 article, 타임라인 | `data/about-data.js` |
| 활동 페이지 내용과 활동 카드 원본 | `data/activities-data.js` |
| 현재 회장단, 장로진, 운영 역할, 과거 회장단 | `data/officers-data.js` |
| 가입 페이지 문구, 가입 대상, 가입 절차 | `data/join-data.js` |
| 이메일, 인스타그램, 가입 폼 URL, 위치 | `data/contact-data.js` |
| 상단 메뉴, 드롭다운, 페이지 내 앵커 링크 | `data/navigation-data.js` |
| 사진 파일 추가 | `assets/images/` |
| 게시글 첨부파일 추가 | `assets/files/` |

## 파일트리 설명

```text
intro_YSGS/
├── index.html              # 메인 페이지
├── pages/                  # 개별 페이지 HTML
│   ├── news.html           # 소식
│   ├── about.html          # 동아리소개
│   ├── activities.html     # 활동
│   ├── officers.html       # 임원진
│   ├── join.html           # 가입
│   └── contact.html        # 연락
├── data/                   # 운영진이 주로 수정하는 콘텐츠 데이터
├── js/                     # 화면 렌더링, 메뉴, 모달, 게시판 기능
├── assets/
│   ├── images/             # 로고, 활동 사진, 게시글 이미지
│   └── files/              # 게시글 첨부파일
├── styles.css              # 전체 디자인과 반응형 스타일
├── script.js               # 공통 실행 진입점
└── README.md               # 이 문서
```

## 주요 데이터 파일

### `data/site-data.js`

사이트 전체 공통 정보를 관리합니다.

- `name`: 상단 브랜드명
- `fullName`: 동아리 영문 풀네임
- `department`: 소속 설명
- `icon`: 상단 로고와 favicon으로 쓰는 이미지 경로

### `data/index-data.js`

메인 페이지 첫 화면을 관리합니다.

- `hero.eyebrow`: 작은 영문 라벨
- `hero.title`: 메인 큰 제목, 줄바꿈은 `\n`
- `hero.description`: 설명 문구
- `hero.image`: 히어로 배경 이미지
- `hero.actions`: 버튼 문구와 링크
- `hero.stats`: 오른쪽 요약 박스

### `data/home-data.js`

메인 화면의 What We Do 섹션에 어떤 활동 카드를 보여줄지 관리합니다. 활동 원본은 `data/activities-data.js`에 있고, 여기서는 표시 여부와 순서만 정합니다.

```js
var homeData = {
  whatWeDo: {
    items: [
      { activityId: "seminar", visible: true },
      { activityId: "fieldtrip", visible: false }
    ]
  }
};
```

`visible: false`인 카드는 메인 화면에 렌더링되지 않으므로 이미지도 로딩되지 않습니다.

### `data/home-news-data.js`

메인 화면의 주요 소식과 최근 공지 설정을 관리합니다.

- `recentLimit`: 최근 공지와 소식에 표시할 최대 개수
- `featuredTitle`: 주요 소식 섹션 제목
- `featuredLead`: 주요 소식 설명 문구
- `featuredBackground`: 주요 소식 섹션 배경 이미지
- `fallbackImage`: 주요 소식 카드 이미지가 없을 때 사용할 기본 이미지
- `featuredLimit`: 주요 소식 카드 최대 표시 개수
- `featuredItems`: 주요 소식으로 보여줄 게시글 id와 카드 이미지

```js
featuredItems: [
  { postId: 2026003, image: "" },
  { postId: 2026002, image: "assets/images/home-featured-seminar.jpg" }
]
```

`image`를 비워두면 게시글의 대표 이미지 또는 본문 첫 이미지가 사용됩니다.

### `data/news-data.js`

소식 게시판의 모든 게시글을 관리합니다. 메인 최근 공지와 주요 소식도 이 파일의 게시글을 기준으로 연결됩니다.

자주 수정하는 필드:

- `id`: 게시글 고유 번호
- `pinned`: `true`이면 목록에서 `공지` 배지로 표시
- `showOnHomeRecent`: `true`이면 메인 최근 공지 후보에 포함
- `category`: 분류
- `author`: 작성자
- `title`: 제목
- `date`: 날짜, `YYYY-MM-DD` 형식 권장
- `summary`: 요약
- `blocks`: 본문 문단과 이미지를 순서대로 구성
- `attachments`: 첨부파일

본문 중간에 문단과 이미지를 섞는 예시:

```js
blocks: [
  { type: "paragraph", text: "세미나 안내 본문입니다." },
  {
    type: "images",
    images: [
      {
        src: "assets/images/seminar-2026.jpg",
        alt: "세미나 현장 사진",
        caption: "2026 정기 세미나"
      }
    ]
  }
]
```

첨부파일 예시:

```js
attachments: [
  {
    label: "모집 안내문.pdf",
    href: "assets/files/recruiting-guide.pdf",
    type: "pdf",
    size: "240KB"
  }
]
```

외부 링크도 `href`에 그대로 넣을 수 있습니다.

### `data/about-data.js`

동아리소개 페이지를 관리합니다.

- `title`, `lead`: 페이지 상단 소개
- `sections`: 동아리 개요 카드
- `valueArticles`: 가치 설명 article
- `timeline`: 주요 활동 타임라인

`valueArticles`와 `timeline`은 이미지 여러 장을 넣을 수 있습니다. 이미지 경로는 `assets/images/...` 또는 외부 URL을 사용할 수 있습니다.

### `data/activities-data.js`

활동 페이지와 메인 What We Do 카드의 원본 데이터를 관리합니다.

- `id`: 활동 고유값, `home-data.js`와 앵커 링크에서 사용
- `title`: 활동명
- `label`: 영문/짧은 라벨
- `summary`: 카드 요약
- `description`: 활동 페이지 상세 설명
- `image`: 대표 이미지
- `highlights`: 핵심 항목 목록

활동을 새로 추가하면 활동 페이지에는 표시됩니다. 메인 What We Do에 표시하려면 `data/home-data.js`에도 `activityId`를 추가해야 합니다.

### `data/officers-data.js`

임원진 페이지를 관리합니다.

- `currentExecutiveData`: 현재 회장, 부회장
- `elderData`: 장로진, 화면에는 사진, 이름, 주요 역할이 표시
- `officerRoleData`: 운영 역할 안내
- `pastExecutiveData`: 과거 회장단

사진이 없으면 기본 placeholder 형태로 표시됩니다. 실제 사진을 넣으려면 `photo: "assets/images/name.jpg"`처럼 지정하세요.

### `data/join-data.js`

가입 페이지 내용을 관리합니다.

- `title`, `lead`: 가입 페이지와 메인 가입 CTA 문구
- `eligibility`: 가입 대상
- `process`: 가입 절차

실제 가입 폼 URL과 모집 상태는 `data/contact-data.js`에서 관리합니다.

### `data/contact-data.js`

연락 페이지와 가입 신청 상태를 관리합니다.

- `email`: 대표 이메일
- `instagram`, `instagramUrl`: 인스타그램 표시명과 링크
- `joinFormUrl`: 가입 폼 URL
- `joinStatus`: 모집 상태
- `location`, `address`, `mapUrl`: 위치 정보

가입 폼이 아직 없으면 `joinFormUrl: "#"`로 두면 안전하게 표시됩니다.

### `data/navigation-data.js`

상단 메뉴와 드롭다운 링크를 관리합니다.

- `title`: 메뉴 이름
- `page`: 현재 페이지 활성화 기준
- `href`: 이동 주소
- `dividerAfter`: 해당 메뉴 뒤에 세로 구분선 표시
- `submenus`: 드롭다운 메뉴

페이지 안의 특정 위치로 이동하려면 `#앵커이름`을 사용합니다.

```js
{ label: "주요 타임라인", href: "pages/about.html#timeline" }
```

앵커 이름은 실제 렌더링되는 섹션 `id`와 맞아야 합니다.

## 페이지별 수정 위치

| 페이지 | 주로 수정할 파일 |
| --- | --- |
| 메인 | `data/index-data.js`, `data/home-data.js`, `data/home-news-data.js`, `data/news-data.js`, `data/contact-data.js` |
| 소식 | `data/news-data.js` |
| 동아리소개 | `data/about-data.js` |
| 활동 | `data/activities-data.js` |
| 임원진 | `data/officers-data.js` |
| 가입 | `data/join-data.js`, `data/contact-data.js` |
| 연락 | `data/contact-data.js` |
| 상단 메뉴 | `data/navigation-data.js` |

## 이미지와 첨부파일 관리

공식 사진은 `assets/images/`에 넣고 data 파일에서 다음처럼 연결합니다.

```js
image: "assets/images/fieldtrip-2026.jpg"
```

게시글 첨부파일은 `assets/files/`에 넣고 `data/news-data.js`의 `attachments`에 연결합니다.

```js
attachments: [
  { label: "답사 안내문.pdf", href: "assets/files/fieldtrip-guide.pdf", type: "pdf", size: "320KB" }
]
```

이미지와 파일 폴더 안에도 간단한 안내 문서가 있습니다.

- `assets/images/README.md`
- `assets/files/README.md`

## 로컬에서 확인하는 방법

이 사이트는 정적 HTML 사이트입니다. 프로젝트 폴더에서 간단한 로컬 서버를 실행해 확인할 수 있습니다.

```bash
python3 -m http.server 8000
```

브라우저에서 다음 주소를 엽니다.

```text
http://localhost:8000
```

파일을 수정한 뒤 브라우저를 새로고침하면 변경 사항을 확인할 수 있습니다. CSS나 JS 파일을 고쳤는데 반영이 느리면 HTML의 `?v=...` 버전 쿼리를 갱신하거나 브라우저 캐시를 비워 주세요.

## 수정 시 주의사항

- 문자열은 큰따옴표 안에 작성하고, 따옴표 안에 다시 큰따옴표가 필요하면 작은따옴표를 사용하거나 문장을 바꿔 주세요.
- 배열 항목 사이에는 쉼표가 필요합니다.
- `id` 값은 링크와 연결될 수 있으므로 함부로 바꾸지 않는 것이 좋습니다.
- 게시글 `date`는 `YYYY-MM-DD` 형식으로 작성해야 `NEW!` 표시가 정상 작동합니다.
- 로컬 이미지와 파일 경로는 보통 `assets/images/...`, `assets/files/...`처럼 작성합니다.
- 일반 콘텐츠 수정은 `data/*.js`와 `assets/`에서 처리하는 것을 권장합니다.
- `js/*.js`, `styles.css`, `index.html`, `pages/*.html`은 기능과 레이아웃을 바꾸는 파일이므로 수정 전 구조를 확인하세요.

## 기능 파일 참고

일반 운영 중에는 자주 수정하지 않지만, 구조를 이해할 때 참고할 수 있습니다.

| 파일 | 역할 |
| --- | --- |
| `js/layout.js` | 공통 헤더, 푸터, 경로 처리 |
| `js/home.js` | 메인 페이지 렌더링, 주요 소식 접기/펼치기, 활동 캐러셀 |
| `js/home-animations.js` | 메인 페이지 진입/스크롤 애니메이션 |
| `js/news.js` | 소식 게시판, 검색, 페이지네이션, 게시글 팝업 |
| `js/pages.js` | 동아리소개, 활동, 임원진, 가입, 연락 페이지 렌더링 |
| `js/interactions.js` | 모바일 메뉴, 이미지 모달, 복사 버튼 |
| `script.js` | 페이지별 렌더링 함수 실행 |
| `styles.css` | 전역 디자인과 반응형 레이아웃 |
