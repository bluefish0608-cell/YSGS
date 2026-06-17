function pageHero(title, lead) {
  return `<header class="page-hero">
    <p class="eyebrow">YSGS</p>
    <h1>${title}</h1>
    ${lead ? `<p>${lead}</p>` : ""}
  </header>`;
}

function getJoinPageData() {
  if (typeof joinData !== "undefined") return joinData;

  return {
    title: "YSGS 가입 안내",
    lead: "YSGS 가입 정보를 확인하세요.",
    eligibility: [],
    process: []
  };
}

function getAboutPageData() {
  if (typeof aboutData !== "undefined") return aboutData;

  return {
    lead: "",
    sections: [],
    valueArticles: [],
    timeline: []
  };
}

function renderAboutPage(root) {
  const about = getAboutPageData();
  const sections = Array.isArray(about.sections) ? about.sections : [];
  const timeline = Array.isArray(about.timeline) ? about.timeline : [];
  const valueArticles = Array.isArray(about.valueArticles) ? about.valueArticles : [];

  root.innerHTML = `${pageHero("동아리소개", about.lead)}
    <div class="about-layout">
      ${sections.map(section => `<article class="content-panel" id="${section.id}">
        <p class="panel-kicker">${section.kicker}</p>
        <h2>${section.title}</h2>
        <p>${section.body}</p>
      </article>`).join("")}
    </div>
    ${valueArticles.length ? renderAboutValueArticles(valueArticles) : ""}
    ${timeline.length ? renderAboutTimeline(timeline) : ""}`;
}

function getAboutValueBlocks(item) {
  if (Array.isArray(item.blocks) && item.blocks.length) return item.blocks;

  const legacyBlocks = (item.paragraphs || [])
    .filter(Boolean)
    .map(text => ({ type: "paragraph", text }));

  if (item.image) {
    legacyBlocks.push({
      type: "images",
      images: [{
        src: item.image,
        alt: item.imageAlt || item.title,
        caption: item.imageCaption
      }]
    });
  }

  return legacyBlocks;
}

function renderAboutValueImages(block, item) {
  const images = (block.images || []).filter(image => image && image.src);
  if (!images.length) return "";

  if (images.length === 1) {
    const image = images[0];
    return `<figure class="about-value-media about-value-media-single">
      <img src="${resolvePath(image.src)}" alt="${image.alt || item.title}" loading="lazy" decoding="async">
      ${image.caption ? `<figcaption>${image.caption}</figcaption>` : ""}
    </figure>`;
  }

  return `<div class="about-value-media about-value-media-grid" aria-label="${item.title} 관련 이미지">
    <div class="about-value-image-grid">
      ${images.map(image => `<figure class="about-value-image-card">
        <img src="${resolvePath(image.src)}" alt="${image.alt || item.title}" loading="lazy" decoding="async">
        ${image.caption ? `<figcaption>${image.caption}</figcaption>` : ""}
      </figure>`).join("")}
    </div>
  </div>`;
}

function renderAboutValueBlock(block, item) {
  if (block.type === "paragraph" && block.text) return `<p>${block.text}</p>`;
  if (block.type === "images") return renderAboutValueImages(block, item);
  return "";
}

function renderAboutValueArticles(items) {
  return `<section class="about-values" id="values" aria-label="YSGS 추구 가치">
    <div class="about-value-list">
      ${items.map(item => {
        const blocks = getAboutValueBlocks(item);
        const hasImage = blocks.some(block => block.type === "images" && (block.images || []).some(image => image && image.src));
        return `<article class="about-value-article ${hasImage ? "" : "text-only"}" id="${item.id}">
          <div class="about-value-copy">
            ${item.kicker ? `<p class="panel-kicker">${item.kicker}</p>` : ""}
            <h3>${item.title}</h3>
            ${item.lead ? `<p class="about-value-lead">${item.lead}</p>` : ""}
            ${blocks.map(block => renderAboutValueBlock(block, item)).join("")}
          </div>
        </article>`;
      }).join("")}
    </div>
  </section>`;
}

function renderTimelineGallery(item) {
  const images = (item.images || []).filter(image => image && image.src);
  if (!images.length) return "";

  return `<div class="timeline-gallery" aria-label="${item.title} 사진">
    ${images.map(image => {
      const caption = image.caption || image.alt || item.title;
      return `<button class="timeline-gallery-button" type="button" data-image-src="${resolvePath(image.src)}" data-image-caption="${caption}">
        <img src="${resolvePath(image.src)}" alt="${image.alt || caption}" loading="lazy" decoding="async">
        <span class="timeline-gallery-caption">${caption}</span>
      </button>`;
    }).join("")}
  </div>`;
}

function renderAboutTimeline(items) {
  return `<section class="content-panel about-timeline-panel" id="timeline">
    <p class="panel-kicker">Timeline</p>
    <h2>주요 활동 타임라인</h2>
    <div class="about-timeline">
      ${items.map(item => `<article class="about-timeline-item">
        <div class="about-timeline-time">${item.time}</div>
        <div class="about-timeline-content">
          <h3>${item.title}</h3>
          <p>${item.details}</p>
          ${item.note ? `<span>${item.note}</span>` : ""}
          ${renderTimelineGallery(item)}
        </div>
      </article>`).join("")}
    </div>
  </section>`;
}

function renderExecutivePhoto(person) {
  return `<div class="officer-photo">${person.photo ? `<img src="${resolvePath(person.photo)}" alt="${person.name}">` : `<span>${person.role.charAt(0)}</span>`}</div>`;
}

function renderExecutiveCard(person) {
  return `<article class="executive-card">
    ${renderExecutivePhoto(person)}
    <div>
      <p>${person.term}</p>
      <h2>${person.name}</h2>
      <strong>${person.role}</strong>
      <span>${person.bio}</span>
    </div>
  </article>`;
}

function renderElderCard(person) {
  return `<article class="elder-card">
    ${renderExecutivePhoto(person)}
    <div>
      <h3>${person.name}</h3>
      <span class="elder-role-summary">${person.bio}</span>
    </div>
  </article>`;
}

function renderPastExecutiveItem(item) {
  return `<article class="past-executive-item">
    <div>
      <p>${item.term}</p>
      <h3>${item.president} · ${item.vicePresident}</h3>
    </div>
    ${item.note ? `<span>${item.note}</span>` : ""}
  </article>`;
}

function renderOfficersPage(root) {
  const currentExecutives = typeof currentExecutiveData !== "undefined" ? currentExecutiveData : [];
  const elders = typeof elderData !== "undefined" ? elderData : [];
  const pastExecutives = typeof pastExecutiveData !== "undefined" ? pastExecutiveData : [];

  root.innerHTML = `${pageHero("임원진", "YSGS 운영진은 학술 활동, 답사, 홍보와 기록을 나누어 맡아 동아리가 꾸준히 이어지도록 돕습니다.")}
    ${currentExecutives.length ? `<section class="officer-section" id="current">
      <div class="subsection-heading">
        <p class="panel-kicker">Current Executives</p>
        <h2>현재 회장단</h2>
      </div>
      <div class="executive-grid">${currentExecutives.slice(0, 2).map(renderExecutiveCard).join("")}</div>
    </section>` : ""}
    ${elders.length ? `<section class="officer-section" id="elders">
      <div class="subsection-heading">
        <p class="panel-kicker">Elders</p>
        <h2>장로진</h2>
        <p>장로는 동아리 활동 경험을 바탕으로 회장단과 구성원을 실질적으로 돕는 지원 그룹입니다.</p>
      </div>
      <div class="elder-grid">${elders.map(renderElderCard).join("")}</div>
    </section>` : ""}
    <section class="content-panel" id="roles">
      <p class="panel-kicker">Roles</p>
      <h2>운영 역할</h2>
      <div class="role-grid">
        ${officerRoleData.map(role => `<div><h3>${role.title}</h3><p>${role.body}</p></div>`).join("")}
      </div>
    </section>
    ${pastExecutives.length ? `<section class="content-panel past-executive-panel" id="past">
      <p class="panel-kicker">Past Executives</p>
      <h2>과거 회장단</h2>
      <div class="past-executive-list">${pastExecutives.map(renderPastExecutiveItem).join("")}</div>
    </section>` : ""}`;
}

function renderJoinPage(root) {
  const join = getJoinPageData();
  const eligibility = Array.isArray(join.eligibility) ? join.eligibility : [];
  const process = Array.isArray(join.process) ? join.process : [];
  const joinReady = contactData.joinFormUrl && contactData.joinFormUrl !== "#";
  root.innerHTML = `${pageHero("가입", join.lead)}
    <section class="content-panel" id="eligibility">
      <p class="panel-kicker">Eligibility</p>
      <h2>가입 대상</h2>
      <ul class="check-list">
        ${eligibility.map(item => `<li>${item}</li>`).join("")}
      </ul>
    </section>
    <section class="process-grid" id="process">
      ${process.map(item => `<article>
        <span>${item.step}</span>
        <h2>${item.title}</h2>
        <p>${item.body}</p>
      </article>`).join("")}
    </section>
    <section class="apply-panel" id="apply">
      <div>
        <p class="panel-kicker">Apply</p>
        <h2>${joinReady ? "가입 신청서로 이동" : contactData.joinStatus}</h2>
        <p>${joinReady ? "아래 버튼을 누르면 외부 가입 신청 폼이 새 창에서 열립니다." : "실제 가입 폼 URL이 확정되면 data/contact-data.js의 joinFormUrl을 교체해 주세요."}</p>
      </div>
      <a class="button button-primary ${joinReady ? "" : "button-disabled"}" href="${joinReady ? contactData.joinFormUrl : "#"}" ${joinReady ? 'target="_blank" rel="noopener"' : 'aria-disabled="true"'}>${joinReady ? "가입 폼 열기" : "폼 준비 중"}</a>
    </section>`;
}

function renderActivitiesPage(root) {
  root.innerHTML = `${pageHero("활동", "YSGS는 학술세미나, 학술세션, 필드트립, 기관답사를 중심으로 지질과학을 입체적으로 탐구합니다.")}
    <div class="activity-page-grid">
      ${activitiesData.map(activity => `<article class="activity-detail" id="${activity.id}">
        <button class="activity-image-button" type="button" data-image-src="${activity.image}" data-image-caption="${activity.title}">
          <img src="${activity.image}" alt="${activity.title}" loading="lazy" decoding="async">
        </button>
        <div>
          <p class="panel-kicker">${activity.label}</p>
          <h2>${activity.title}</h2>
          <p>${activity.description}</p>
          <ul class="tag-list">${activity.highlights.map(item => `<li>${item}</li>`).join("")}</ul>
        </div>
      </article>`).join("")}
    </div>`;
}

function renderContactPage(root) {
  const mailHref = `mailto:${contactData.email}`;
  root.innerHTML = `${pageHero("연락", "YSGS 활동, 가입, 협업 문의는 아래 연락 채널을 통해 남겨 주세요.")}
    <section class="contact-grid">
      <article class="contact-card">
        <span>Email</span>
        <h2>${contactData.email}</h2>
        <p>대표 이메일 주소입니다. 클릭하면 복사됩니다.</p>
        <button class="button button-secondary" type="button" data-copy="${contactData.email}">이메일 복사</button>
      </article>
      <article class="contact-card">
        <span>Instagram</span>
        <h2>${contactData.instagram}</h2>
        <p>홍보 계정이 확정되면 URL을 연결할 수 있습니다.</p>
        <a class="button button-secondary ${contactData.instagramUrl === "#" ? "button-disabled" : ""}" href="${contactData.instagramUrl}" ${contactData.instagramUrl === "#" ? 'aria-disabled="true"' : 'target="_blank" rel="noopener"'}>인스타그램 열기</a>
      </article>
      <article class="contact-card">
        <span>Location</span>
        <h2>${contactData.location}</h2>
        <p>${contactData.address}</p>
        <a class="button button-secondary" href="${contactData.mapUrl}" target="_blank" rel="noopener">지도 열기</a>
      </article>
    </section>
    <section class="content-panel">
      <p class="panel-kicker">Message</p>
      <h2>운영 정보 업데이트 안내</h2>
      <p>${contactData.message}</p>
      <p><a href="${mailHref}">메일 앱으로 문의하기</a></p>
    </section>`;
}

function renderPage() {
  const root = document.getElementById("pageRoot");
  if (!root) return;

  const page = document.body.dataset.page;
  if (page === "about") renderAboutPage(root);
  if (page === "officers") renderOfficersPage(root);
  if (page === "join") renderJoinPage(root);
  if (page === "activities") renderActivitiesPage(root);
  if (page === "contact") renderContactPage(root);
}
