var newsData = [
  {
    id: 2026003,
    pinned: true,
    showOnHomeRecent: true,
    category: "공지",
    author: "YSGS 운영진",
    title: "YSGS 홈페이지 준비 중",
    date: "2026-06-14",
    summary: "동아리 소개, 활동 기록, 가입 안내를 한곳에서 확인할 수 있는 홈페이지를 구성하고 있습니다.",
    content: "YSGS의 활동과 공지를 더 쉽게 공유하기 위해 정적 홈페이지를 준비하고 있습니다.\n\n앞으로 이 공간에는 세미나 공지, 필드트립 기록, 기관답사 안내, 가입 관련 공지를 모아둘 예정입니다. 게시글 내용은 data/news-data.js 파일에서 관리되므로 별도의 관리자 페이지 없이도 운영진이 쉽게 수정할 수 있습니다.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    blocks: [
      {
        type: "paragraph",
        text: "YSGS의 활동과 공지를 더 쉽게 공유하기 위해 정적 홈페이지를 준비하고 있습니다."
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
            alt: "지구와 우주를 보여주는 홈페이지 대표 이미지",
            caption: "YSGS 홈페이지는 공지와 활동 기록을 한곳에 모으는 아카이브로 운영됩니다."
          }
        ]
      },
      {
        type: "paragraph",
        text: "앞으로 이 공간에는 세미나 공지, 필드트립 기록, 기관답사 안내, 가입 관련 공지를 모아둘 예정입니다. 게시글 내용은 data/news-data.js 파일에서 관리되므로 별도의 관리자 페이지 없이도 운영진이 쉽게 수정할 수 있습니다."
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
            alt: "노트북과 자료를 펼쳐두고 기록을 정리하는 모습",
            caption: "공지와 세미나 자료 정리"
          },
          {
            src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
            alt: "야외 지질 답사 현장 풍경",
            caption: "필드트립 사진과 관찰 기록"
          }
        ]
      }
    ],
    attachments: [
      {
        label: "첨부파일 관리 안내",
        href: "assets/files/README.md",
        type: "md",
        size: "1KB"
      }
    ]
  },
  {
    id: 2026002,
    pinned: true,
    showOnHomeRecent: true,
    category: "활동",
    author: "YSGS 운영진",
    title: "학술세미나 주제 모집",
    date: "2026-06-10",
    summary: "구성원이 함께 읽고 토론하고 싶은 지구과학 주제를 모집합니다.",
    content: "논문, 교과서 챕터, 지질 현장 사례, 지구과학 관련 사회 이슈 등 세미나로 다루고 싶은 주제를 운영진에게 제안할 수 있습니다.\n\n제안할 때는 주제명, 간단한 소개, 함께 읽으면 좋을 자료를 적어 주세요. 발표자가 아니더라도 관심 주제를 남길 수 있습니다.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
    blocks: [
      {
        type: "paragraph",
        text: "논문, 교과서 챕터, 지질 현장 사례, 지구과학 관련 사회 이슈 등 세미나로 다루고 싶은 주제를 운영진에게 제안할 수 있습니다."
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
            alt: "노트북과 자료를 펼쳐두고 학습하는 모습",
            caption: "관심 주제와 참고자료를 모아 세미나 후보를 정리합니다."
          }
        ]
      },
      {
        type: "paragraph",
        text: "제안할 때는 주제명, 간단한 소개, 함께 읽으면 좋을 자료를 적어 주세요. 발표자가 아니더라도 관심 주제를 남길 수 있습니다."
      }
    ],
    attachments: [
      {
        label: "Yonsei Earth System Sciences",
        href: "https://earth.yonsei.ac.kr/",
        type: "link"
      }
    ]
  },
  {
    id: 2026001,
    pinned: true,
    showOnHomeRecent: true,
    category: "가입",
    author: "YSGS 운영진",
    title: "신규 구성원 모집 안내",
    date: "2026-06-01",
    summary: "YSGS는 지질과학에 관심 있는 학생들의 참여를 기다립니다.",
    content: "YSGS는 지질과학에 관심 있는 학생들의 참여를 기다립니다.\n\n정확한 모집 일정과 신청 폼은 운영진 확정 후 업데이트됩니다. 현재는 가입 페이지에서 모집 준비 상태를 확인할 수 있으며, 가입 폼 URL이 확정되면 data/contact-data.js에서 연결하면 됩니다.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=80",
    attachments: []
  },
  {
    id: 2025004,
    pinned: false,
    showOnHomeRecent: true,
    category: "필드트립",
    author: "YSGS 운영진",
    title: "수도권 지질 답사 사전 안내",
    date: "2025-11-18",
    summary: "야외 관찰 준비물과 답사 전 읽을 자료를 안내합니다.",
    content: "필드트립 참여자는 야외 노트, 필기구, 편한 신발, 개인 물을 준비해 주세요.\n\n답사 전 세션에서는 관찰 지역의 암상, 지질 구조, 지형 발달 과정을 간단히 검토할 예정입니다. 실제 답사 사진은 추후 assets/images/에 추가한 뒤 이 게시글의 image 값을 교체하면 됩니다.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=80",
    attachments: []
  },
  {
    id: 2025003,
    pinned: false,
    showOnHomeRecent: true,
    category: "기관답사",
    author: "YSGS 운영진",
    title: "연구기관 답사 후보지 조사",
    date: "2025-10-06",
    summary: "기관답사 후보지와 관심 연구 분야를 조사합니다.",
    content: "기관답사는 학부생이 연구 현장을 가까이에서 볼 수 있는 활동입니다.\n\n운영진은 연구기관, 박물관, 관측 시설 등을 후보로 검토하고 있습니다. 구성원은 관심 있는 기관이나 연구 분야를 운영진에게 제안할 수 있습니다.",
    image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1000&q=80",
    attachments: []
  },
  {
    id: 2025002,
    pinned: false,
    showOnHomeRecent: true,
    category: "세미나",
    author: "YSGS 운영진",
    title: "지구시스템과학 논문 리딩 세션 안내",
    date: "2025-09-12",
    summary: "지구과학 분야의 논문을 함께 읽고 토론하는 세션을 진행합니다.",
    content: "이번 리딩 세션에서는 지구시스템과학의 여러 하위 분야를 연결해 볼 수 있는 자료를 선정합니다.\n\n참여자는 논문 전체를 완벽히 이해하지 않아도 괜찮습니다. 각자 이해한 부분과 어려웠던 지점을 공유하며 학술적 질문을 만드는 연습을 합니다.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
    attachments: []
  },
  {
    id: 2025001,
    pinned: false,
    showOnHomeRecent: false,
    category: "기록",
    author: "YSGS 운영진",
    title: "YSGS 활동 기록 업데이트 방식",
    date: "2025-09-01",
    summary: "운영진이 소식 게시글을 업데이트하는 기본 방식을 정리했습니다.",
    content: "소식 게시판의 게시글은 data/news-data.js에서 관리합니다.\n\n새 글을 추가할 때는 id, category, title, date, summary, content, image, attachments 값을 채워 넣으면 됩니다. 첨부파일은 assets/files/에 넣거나 외부 URL을 연결할 수 있습니다.",
    image: "",
    attachments: [
      {
        label: "첨부파일 폴더 안내",
        href: "assets/files/README.md",
        type: "md",
        size: "1KB"
      }
    ]
  }
];
