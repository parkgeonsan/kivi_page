# Nuage Baby Furniture - Enhancement Plan

> **작성일**: 2026-04-10  
> **대상**: `baby-furniture-website/` (Vite + Vanilla JS + CSS)  
> **브랜드**: Nuage (누아주) — 프리미엄 유아가구  
> **벤치마킹**: Pottery Barn Kids, Stokke, Babyletto, RH Baby&Child, West Elm, Article, Castlery, IKEA

---

## 목차

1. [현재 상태 요약](#1-현재-상태-요약)
2. [가구 객체 부각 효과](#2-가구-객체-부각-효과)
3. [스크롤 & 페이지 애니메이션](#3-스크롤--페이지-애니메이션)
4. [상품 상세 페이지 강화](#4-상품-상세-페이지-강화pdp)
5. [쇼핑 핵심 기능](#5-쇼핑-핵심-기능)
6. [신뢰 & 소셜 프루프](#6-신뢰--소셜-프루프)
7. [모바일 UX 강화](#7-모바일-ux-강화)
8. [마이크로 인터랙션](#8-마이크로-인터랙션)
9. [신규 페이지 & 섹션](#9-신규-페이지--섹션)
10. [성능 최적화](#10-성능-최적화)
11. [구현 우선순위 로드맵](#12-구현-우선순위-로드맵)

---

## 1. 현재 상태 요약

### 존재하는 것
| 항목 | 상태 |
|------|------|
| 히어로 섹션 + 패럴랙스 | O (기본적) |
| 상품 카드 3개 + hover 효과 | O |
| LocalStorage 장바구니 | O |
| 상품 상세 페이지 | O (기본 레이아웃) |
| 스크롤 fade-up 애니메이션 | O |
| 글래스모피즘 헤더 | O |
| 반응형 디자인 | O (부분적) |

### 부재하는 것 (벤치마킹 대비)
| 항목 | 중요도 |
|------|--------|
| **상품 이미지 줌/확대** | 매우 높음 |
| **상품 갤러리 (다중 이미지)** | 매우 높음 |
| **장바구니 fly-to 애니메이션** | 높음 |
| **Quick View 모달** | 높음 |
| **위시리스트** | 높음 |
| **상품 필터/정렬** | 높음 |
| **검색 기능** | 높음 |
| **리뷰 시스템** | 높음 |
| **관련 상품 캐러셀** | 중간 |
| **최근 본 상품** | 중간 |
| **소재/색상 스와치** | 중간 |
| **모바일 메뉴** | 매우 높음 |
| **로딩 스켈레톤** | 중간 |
| **페이지 전환 트랜지션** | 중간 |
| **사이즈 가이드** | 중간 |
| **조립 난이도 표시** | 낮음 |

---

## 2. 가구 객체 부각 효과

### 2-1. 이미지 줌 (Hover Magnifier)

**벤치마크**: Pottery Barn Kids, RH Baby — 상품 이미지 hover 시 2~3배 확대 렌즈

**동작 사양**:
```
┌─────────────────────────────┐
│                             │
│         ┌───────┐           │
│    상품  │ 확대  │  이미지    │
│    이미지 │ 렌즈  │           │
│         └───────┘           │
│           ↑ 마우스 위치      │
│                             │
└─────────────────────────────┘
```

| 속성 | 값 |
|------|-----|
| **트리거** | 상품 상세 이미지 위 마우스 hover |
| **확대 배율** | 2.5x |
| **렌즈 타입** | 원형 (200px 직경) 또는 우측 패널 확대 |
| **전환** | 마우스 진입 시 0.2s fade-in |
| **모바일** | 핀치 줌 (touch-action: pinch-zoom) |

**구현 방식**:
```javascript
// 상품 이미지 위에 고해상도 배경을 position 조절
container.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  lens.style.backgroundPosition = `${x}% ${y}%`
  lens.style.backgroundSize = '250%'
  lens.style.left = `${e.clientX - rect.left - 100}px`
  lens.style.top = `${e.clientY - rect.top - 100}px`
})
```

---

### 2-2. 상품 이미지 갤러리 (Multi-Angle View)

**벤치마크**: Stokke, Article — 여러 각도의 상품 사진 + 썸네일 네비게이션

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         [메인 이미지]                │
│         (클릭 시 라이트박스)          │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  [썸1] [썸2] [썸3] [썸4] [라이프]    │
└─────────────────────────────────────┘
```

**이미지 카테고리** (각 상품당):
1. 정면 (기본)
2. 측면 45도
3. 디테일 클로즈업 (소재 질감)
4. 사용 모습 (라이프스타일 - 아이가 사용하는 장면)
5. 치수 다이어그램

**전환 애니메이션**:
```css
.gallery-main img {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.gallery-main img.entering {
  animation: fadeSlideIn 0.4s ease forwards;
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateX(20px) scale(0.98); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}
```

**썸네일 인터랙션**:
- hover 시: 0.2s border 색상 전환 (accent-color)
- active: 하단 accent 인디케이터 바 (2px, slide 애니메이션)
- 키보드: 좌/우 화살표로 탐색

---

### 2-3. 상품 카드 3D 틸트 (Product Card Depth)

**벤치마크**: Article, Castlery — 카드 hover 시 미세 3D 기울기

**현재**: `transform: translateY(-10px)` + `box-shadow` 변화만

**제안**:
```
정면                      hover 시 (미세 기울기)
┌──────────┐             ╱──────────╲
│          │            ╱            ╲
│  상품    │    →       │   상품      │  perspective: 800px
│  이미지   │            │   이미지    │  rotateY: ±3deg
│          │            ╲            ╱  rotateX: ±3deg
│  제목    │             ╲──────────╱
│  가격    │
└──────────┘
```

**CSS 구현**:
```css
.product-card {
  perspective: 800px;
  transform-style: preserve-3d;
}
.product-card:hover {
  transform: translateY(-12px) rotateX(2deg) rotateY(-1deg);
  box-shadow:
    0 20px 40px rgba(74, 66, 56, 0.12),
    0 8px 16px rgba(74, 66, 56, 0.08);
}
/* 이미지 살짝 앞으로 튀어나오는 효과 */
.product-card:hover .product-image img {
  transform: scale(1.06) translateZ(20px);
}
```

**추가 효과 — 광택 오버레이**:
```css
.product-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0) 60%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.product-card:hover::after {
  opacity: 1;
}
```

---

### 2-4. 상품 등장 스태거 애니메이션

**벤치마크**: West Elm — 상품 그리드가 뷰포트에 들어올 때 카드가 순차적으로 나타남

**현재**: 모든 카드가 동시에 fade-up

**제안**: 카드별 시차 (stagger)
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.product-card')
      cards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 120}ms`
        card.classList.add('visible')
      })
    }
  })
}, { threshold: 0.1 })
```

**카드 등장 모션**:
```css
.product-card {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  transition: 
    opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1),
    transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}
.product-card.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
```

---

### 2-5. 소재 질감 하이라이트

**벤치마크**: RH Baby — 소재 클로즈업 + 질감 설명 오버레이

```
┌──────────────────────────────────────────┐
│                                          │
│   [원목 질감 클로즈업 이미지]              │
│                                          │
│          ●───── "유럽산 너도밤나무"        │
│                  FSC 인증 원목             │
│                                          │
│      ●────── "무독성 수성 마감"           │
│               EN 71-3 안전 인증           │
│                                          │
└──────────────────────────────────────────┘
```

**인터랙션**:
- 핫스팟(●) 위치에 pulse 애니메이션 (무한 반복, 1.5s)
- hover 시 설명 툴팁 fade-in (0.2s)
- 모바일: 탭으로 토글

**CSS 핫스팟 pulse**:
```css
@keyframes hotspot-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(212, 180, 153, 0.6); }
  70%  { box-shadow: 0 0 0 12px rgba(212, 180, 153, 0); }
  100% { box-shadow: 0 0 0 0 rgba(212, 180, 153, 0); }
}
.hotspot {
  width: 14px; height: 14px;
  border-radius: 50%;
  background: var(--accent-color);
  border: 2px solid white;
  animation: hotspot-pulse 1.5s infinite;
}
```

---

### 2-6. 플로팅 스펙 카드 (Floating Spec Badge)

**벤치마크**: Babyletto — 상품 이미지 위에 떠다니는 스펙 뱃지

**현재**: 히어로에만 플로팅 카드 1개

**제안**: 상품 카드와 상세 이미지에 스펙 뱃지 추가
```
┌─────────────────────────┐
│                         │
│   ┌──────────┐          │
│   │ 🌿 친환경  │          │
│   │ FSC 인증  │          │
│   └──────────┘          │
│                         │
│     [상품 이미지]         │
│                         │
│          ┌──────────┐   │
│          │ 0~5세    │   │
│          │ 사용가능  │   │
│          └──────────┘   │
└─────────────────────────┘
```

**뱃지 스타일**:
```css
.spec-badge {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px 14px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  animation: float 4s ease-in-out infinite;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-primary);
}
.spec-badge .badge-icon {
  font-size: 1rem;
  margin-bottom: 2px;
}
```

---

## 3. 스크롤 & 페이지 애니메이션

### 3-1. 히어로 다층 패럴랙스

**현재**: 이미지만 0.1x 속도로 이동

**제안**: 3개 레이어 독립 이동
```
Layer 0 (배경):  크림색 그라데이션    — 고정
Layer 1 (텍스트): 타이틀 + CTA      — 1.0x (기본)
Layer 2 (이미지): 히어로 이미지       — 0.85x
Layer 3 (뱃지):  플로팅 카드들        — 0.6x (더 느리게)
Layer 4 (파티클): 부유하는 도트들      — 0.3x (가장 느리게)
```

**파티클 배경 효과**:
```css
.hero-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.hero-particles span {
  position: absolute;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.3;
  animation: drift 8s ease-in-out infinite;
}
@keyframes drift {
  0%, 100% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(-10px) translateX(-10px); }
  75% { transform: translateY(-30px) translateX(5px); }
}
```

---

### 3-2. 텍스트 리빌 애니메이션

**벤치마크**: Article — 섹션 제목이 단어 단위로 순차 등장

**현재**: 전체 텍스트가 한번에 fade-up

**제안**: 단어별 stagger reveal
```
"베스트"    →  0ms에 등장
"컬렉션"   →  80ms에 등장

또는 라인별:
"아이의 첫 번째,"     →  0ms (opacity + translateY)
"가장 포근한 공간"    →  150ms
```

**구현**:
```javascript
function splitTextReveal(element) {
  const words = element.textContent.split(' ')
  element.innerHTML = words.map((word, i) => 
    `<span class="reveal-word" style="transition-delay: ${i * 80}ms">${word}</span>`
  ).join(' ')
}

// Observer 트리거 시
element.classList.add('revealed')
```

```css
.reveal-word {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.revealed .reveal-word {
  opacity: 1;
  transform: translateY(0);
}
```

---

### 3-3. 스크롤 진행 인디케이터

**위치**: 화면 우측 (얇은 선) 또는 상단 (프로그레스 바)

**옵션 A — 우측 점 네비게이션**:
```
          ● Home        (현재)
          ○ Collections
          ○ About
          ○ Contact
```

**옵션 B — 상단 프로그레스 바**:
```
═══════════════░░░░░░░░░░░░  (40% 스크롤)
accent-color gradient
```

**구현 (프로그레스 바)**:
```javascript
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY
  const total = document.body.scrollHeight - window.innerHeight
  const progress = (scrolled / total) * 100
  progressBar.style.width = `${progress}%`
}, { passive: true })
```

---

### 3-4. 섹션 전환 Reveal 효과

**벤치마크**: Castlery — 섹션 간 부드러운 커튼 reveal

```
스크롤 방향 ↓

┌────────────────────┐
│   Products 섹션     │
│                    │
├════════════════════┤  ← 다음 섹션이 아래서 슬라이드 업
│░░░░░░░░░░░░░░░░░░░░│     overlay가 걷히는 효과
│   About 섹션        │
│                    │
└────────────────────┘
```

**CSS**:
```css
.section-reveal {
  clip-path: inset(100% 0 0 0);
  transition: clip-path 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}
.section-reveal.visible {
  clip-path: inset(0 0 0 0);
}
```

---

### 3-5. 카운터 애니메이션 (통계 섹션)

**벤치마크**: 대부분의 프리미엄 사이트 — 신뢰도 수치 카운트업

```
┌────────────────────────────────────────────┐
│                                            │
│    10,000+          100%          50+       │
│   행복한 가정       안전 인증      수상 이력  │
│                                            │
└────────────────────────────────────────────┘
```

**구현**:
```javascript
function animateCounter(element, target, duration = 2000) {
  const start = performance.now()
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    element.textContent = Math.round(eased * target).toLocaleString()
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
```

---

## 4. 상품 상세 페이지 강화 (PDP)

### 4-1. 이미지 갤러리 + 라이트박스

```
┌──────────────────────────────────────────────────┐
│ ┌──────┐                                         │
│ │ 썸1  │   ┌──────────────────────────────┐       │
│ └──────┘   │                              │       │
│ ┌──────┐   │                              │       │
│ │ 썸2  │   │      [메인 이미지]            │       │
│ └──────┘   │       hover → zoom           │       │
│ ┌──────┐   │                              │       │
│ │ 썸3  │   │                              │       │
│ └──────┘   └──────────────────────────────┘       │
│ ┌──────┐                                         │
│ │ 사용  │   "1 / 5"    ◀  ▶                       │
│ │ 모습  │                                         │
│ └──────┘                                         │
└──────────────────────────────────────────────────┘
```

**라이트박스 모달** (이미지 클릭 시):
```
┌─ 풀스크린 오버레이 (bg: rgba(0,0,0,0.9)) ────────┐
│                                                   │
│  ◀   [확대된 이미지 (핀치 줌 가능)]    ▶          │
│                                                   │
│              1 / 5                                 │
│                                                   │
│                                        [✕ 닫기]   │
└───────────────────────────────────────────────────┘
```

**키보드**: 좌/우 화살표, Esc 닫기
**모바일**: 스와이프 좌/우

---

### 4-2. 소재/색상 스와치 선택기

**벤치마크**: Stokke, Pottery Barn — 색상/소재 선택 시 이미지 실시간 변경

```
┌─────────────────────────────────────┐
│  색상                                │
│                                     │
│  (●) 내추럴 오크    ○ 화이트워시     │
│  ○ 월넛 브라운     ○ 세이지 그린     │
│                                     │
│  소재                                │
│  [너도밤나무] [자작나무] [오크]        │
│                                     │
│  선택: 내추럴 오크 / 너도밤나무       │
│  가격: ₩890,000                     │
└─────────────────────────────────────┘
```

**스와치 인터랙션**:
```css
.color-swatch {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}
.color-swatch.active {
  border-color: var(--text-primary);
  transform: scale(1.15);
}
.color-swatch:hover::after {
  content: attr(data-name);
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.7rem;
  color: var(--text-secondary);
}
```

**이미지 전환** (스와치 클릭 시):
```javascript
swatch.addEventListener('click', () => {
  mainImage.style.opacity = 0
  setTimeout(() => {
    mainImage.src = swatch.dataset.image
    mainImage.style.opacity = 1
  }, 300)
})
```

---

### 4-3. 사이즈 & 치수 다이어그램

**벤치마크**: IKEA, Article — 상품 치수를 시각적으로 표시

```
┌───────────────────────────────────────────────┐
│                                               │
│           ↕ 85cm                              │
│         ┌───────┐                             │
│         │       │ ← 60cm →                    │
│         │ 크립  │                              │
│         │       │                             │
│         │       │                             │
│         └───────┘                             │
│         ← 120cm →                             │
│                                               │
│   전체 크기: 120 x 60 x 85 cm                  │
│   매트리스: 110 x 55 cm (별매)                  │
│   무게: 28kg                                   │
│   권장 연령: 0~36개월                           │
│                                               │
└───────────────────────────────────────────────┘
```

**인터랙션**: hover 시 해당 치수선 강조 (accent-color, 0.3s transition)

---

### 4-4. 아코디언 상세 정보

**현재**: HTML만 있고 토글 기능 미구현

**구현 필요**:
```
┌──────────────────────────────────────┐
│ ▼ 배송 정보                          │
│                                      │
│   무료 배송 (7~14일 소요)             │
│   도서산간 지역 추가 비용 없음         │
│   조립 서비스 옵션 (+₩50,000)         │
│                                      │
├──────────────────────────────────────┤
│ ▶ 반품 및 교환                        │
├──────────────────────────────────────┤
│ ▶ 안전 인증                          │
├──────────────────────────────────────┤
│ ▶ 소재 및 관리법                      │
└──────────────────────────────────────┘
```

**애니메이션**:
```css
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1), 
              padding 0.4s ease;
}
.accordion-item.open .accordion-content {
  max-height: 300px;
  padding: 16px 0;
}
.accordion-icon {
  transition: transform 0.3s ease;
}
.accordion-item.open .accordion-icon {
  transform: rotate(180deg);
}
```

---

### 4-5. 조립 난이도 & 예상 시간

**벤치마크**: IKEA — 조립 정보를 시각적으로 표시

```
┌──────────────────────────────────────┐
│  조립 정보                            │
│                                      │
│  난이도  ■■■□□  보통                  │
│  예상 시간      약 45분               │
│  필요 인원      2명 권장               │
│  동봉 공구      육각 렌치 포함         │
│                                      │
│  [조립 가이드 PDF 다운로드]            │
└──────────────────────────────────────┘
```

**난이도 바 애니메이션** (뷰포트 진입 시):
```css
.difficulty-bar span {
  width: 0;
  transition: width 0.5s ease;
}
.difficulty-bar.visible span {
  width: var(--difficulty-level); /* 60% 등 */
}
```

---

## 5. 쇼핑 핵심 기능

### 5-1. Quick View 모달

**벤치마크**: Pottery Barn Kids — 상품 리스트에서 빠른 미리보기

**트리거**: 상품 카드의 "빠른 보기" 버튼 (hover 시 나타남)

```
┌─────────────────────────────────────────────────────┐
│                                               [✕]   │
│                                                     │
│  ┌────────────────┐  포레스트 코지 크립              │
│  │                │  ₩890,000                       │
│  │  [상품 이미지]  │                                 │
│  │                │  색상: ● 내추럴 ○ 화이트          │
│  │                │                                 │
│  └────────────────┘  유럽산 너도밤나무 원목으로         │
│                      제작된 프리미엄 유아 침대...       │
│                                                     │
│                      수량: [- 1 +]                   │
│                                                     │
│           [장바구니 담기]    [상세 보기 →]              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**애니메이션**:
```css
/* 오버레이 */
.quickview-overlay {
  opacity: 0;
  transition: opacity 0.3s ease;
}
.quickview-overlay.active { opacity: 1; }

/* 모달 */
.quickview-modal {
  transform: translateY(30px) scale(0.95);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.quickview-modal.active {
  transform: translateY(0) scale(1);
  opacity: 1;
}
```

---

### 5-2. 장바구니 Fly-To 애니메이션

**벤치마크**: Apple Store, 다수 이커머스 — 상품이 장바구니로 날아가는 효과

```
[장바구니 담기] 클릭 시:

1. 상품 이미지의 미니 복제본 생성
2. 복제본이 카트 아이콘 위치로 포물선 이동
3. 이동 중 scale 축소 (1 → 0.2) + opacity 감소
4. 도착 시 카트 아이콘 bounce 효과
5. 카트 뱃지 숫자 업데이트 + pulse
```

**구현**:
```javascript
function flyToCart(productImage, cartIcon) {
  const imgRect = productImage.getBoundingClientRect()
  const cartRect = cartIcon.getBoundingClientRect()
  
  const flyEl = document.createElement('img')
  flyEl.src = productImage.src
  flyEl.className = 'fly-to-cart'
  flyEl.style.cssText = `
    position: fixed;
    left: ${imgRect.left}px;
    top: ${imgRect.top}px;
    width: ${imgRect.width}px;
    height: ${imgRect.height}px;
    z-index: 9999;
    pointer-events: none;
    border-radius: 12px;
    object-fit: cover;
  `
  document.body.appendChild(flyEl)
  
  requestAnimationFrame(() => {
    flyEl.style.transition = 'all 0.7s cubic-bezier(0.2, 1, 0.3, 1)'
    flyEl.style.left = `${cartRect.left}px`
    flyEl.style.top = `${cartRect.top}px`
    flyEl.style.width = '30px'
    flyEl.style.height = '30px'
    flyEl.style.opacity = '0.3'
    flyEl.style.borderRadius = '50%'
  })
  
  setTimeout(() => {
    flyEl.remove()
    // Cart icon bounce
    cartIcon.classList.add('cart-bounce')
    setTimeout(() => cartIcon.classList.remove('cart-bounce'), 500)
  }, 700)
}
```

**카트 바운스**:
```css
@keyframes cartBounce {
  0%, 100% { transform: scale(1); }
  30% { transform: scale(1.3); }
  60% { transform: scale(0.9); }
}
.cart-bounce {
  animation: cartBounce 0.5s ease;
}
```

---

### 5-3. 위시리스트 (좋아요)

**트리거**: 상품 카드 & 상세 페이지의 하트 아이콘

```
♡ → ♥ (클릭 시 토글)

애니메이션: 
1. scale(1) → scale(1.4) → scale(1)  (0.3s)
2. 색상: transparent → #e74c3c (빨간색)
3. 파티클 폭발 효과 (선택적)
```

**파티클 폭발** (좋아요 시):
```css
@keyframes heartBurst {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}
.heart-particle {
  position: absolute;
  width: 6px; height: 6px;
  background: #e74c3c;
  border-radius: 50%;
  animation: heartBurst 0.5s ease-out forwards;
}
```

**저장**: LocalStorage `nuage_wishlist` 키

---

### 5-4. 상품 필터 & 정렬

**벤치마크**: IKEA, Pottery Barn — 가격, 카테고리, 소재 필터

```
┌──────────────────────────────────────────────────────┐
│  필터                정렬: [추천순 ▼]                  │
│                                                      │
│  카테고리                                             │
│  [전체] [침대] [의자] [수납] [액세서리]                  │
│                                                      │
│  가격대                                               │
│  ●────────────●──────────────○  ₩200,000 ~ ₩800,000  │
│                                                      │
│  연령대                                               │
│  □ 신생아 (0~6개월)                                    │
│  ☑ 영아 (6~24개월)                                    │
│  ☑ 유아 (2~5세)                                      │
│                                                      │
│  소재                                                │
│  □ 원목   ☑ 합판   □ 패브릭                            │
│                                                      │
│  [필터 초기화]                          3개 상품 표시   │
└──────────────────────────────────────────────────────┘
```

**필터 적용 애니메이션**:
```css
.product-card.filtered-out {
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
  position: absolute; /* 레이아웃에서 제거 */
}
.product-card.filtered-in {
  opacity: 1;
  transform: scale(1);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
```

---

### 5-5. 검색 기능

**트리거**: 헤더의 검색 아이콘 또는 Ctrl+K

```
┌──────────────────────────────────────────────┐
│  🔍  크립...                                  │
├──────────────────────────────────────────────┤
│                                              │
│  상품                                        │
│  ├─ 포레스트 코지 크립        ₩890,000        │
│  └─ [이미지 썸네일]                           │
│                                              │
│  카테고리                                     │
│  ├─ 침대 (3)                                 │
│  └─ 수납 (2)                                 │
│                                              │
│  최근 검색                                    │
│  ├─ 하이체어                                  │
│  └─ 원목 침대                                 │
│                                              │
└──────────────────────────────────────────────┘
```

---

### 5-6. 최근 본 상품 바

**위치**: 페이지 하단 고정 또는 PDP 하단

```
┌──────────────────────────────────────────────┐
│  최근 본 상품                                 │
│                                              │
│  ┌─────┐  ┌─────┐  ┌─────┐                  │
│  │ 크립 │  │체어  │  │수납  │  ← 드래그 스크롤 │
│  │     │  │     │  │     │                   │
│  └─────┘  └─────┘  └─────┘                  │
└──────────────────────────────────────────────┘
```

**저장**: LocalStorage, 최근 10개, 세션 스토리지와 연동

---

## 6. 신뢰 & 소셜 프루프

### 6-1. 리뷰 시스템

**벤치마크**: Amazon, Coupang — 별점 + 텍스트 + 사진 리뷰

```
┌──────────────────────────────────────────────────┐
│  고객 리뷰  ★★★★★ 4.8  (127개의 리뷰)            │
│                                                  │
│  ★★★★★ ━━━━━━━━━━━━━━━━━━━━━ 89%                │
│  ★★★★☆ ━━━━━━━ 8%                               │
│  ★★★☆☆ ━━ 2%                                    │
│  ★★☆☆☆ ━ 1%                                     │
│  ★☆☆☆☆   0%                                     │
│                                                  │
│  ──────────────────────────────────────────       │
│                                                  │
│  ★★★★★  정말 튼튼하고 예뻐요!                     │
│  김서** | 2개월 전 | 내추럴 오크 구매              │
│                                                  │
│  아기가 너무 좋아합니다. 원목 질감이 좋고           │
│  안전 가드도 단단합니다. 조립도 어렵지 않았어요.     │
│                                                  │
│  [사진1] [사진2]                                  │
│                                                  │
│  도움이 되었나요? 👍 24  👎 1                      │
│                                                  │
│  ──────────────────────────────────────────       │
│  [더보기]                                         │
└──────────────────────────────────────────────────┘
```

**별점 바 애니메이션** (뷰포트 진입 시):
```css
.rating-bar-fill {
  width: 0;
  height: 6px;
  background: var(--accent-color);
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}
.rating-bar-fill.visible {
  width: var(--fill-percent);
}
```

---

### 6-2. 실시간 관심도 표시

**벤치마크**: Booking.com, Coupang — "N명이 보고 있어요"

```
┌───────────────────────────────────┐
│  👁️ 지금 14명이 이 상품을 보고 있어요  │
│  🔥 오늘 23명이 구매했어요           │
│  📦 재고 5개 남음                   │
└───────────────────────────────────┘
```

**구현** (시뮬레이션):
```javascript
function simulateViewers() {
  const base = 8 + Math.floor(Math.random() * 15)
  const el = document.querySelector('.live-viewers')
  el.textContent = base
  
  setInterval(() => {
    const delta = Math.random() > 0.5 ? 1 : -1
    const current = parseInt(el.textContent)
    const next = Math.max(5, Math.min(25, current + delta))
    el.textContent = next
  }, 5000 + Math.random() * 5000)
}
```

---

### 6-3. 안전 인증 뱃지 바

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  [KC 마크]  [EN 71-3]  [FSC 인증]  [CPSC 통과]   │
│                                                  │
│  모든 제품은 국내외 안전 기준을 충족합니다.          │
│                                                  │
└──────────────────────────────────────────────────┘
```

**hover 시 각 인증 설명 툴팁**

---

### 6-4. "이 상품을 구매한 고객이 함께 본 상품" 캐러셀

```
┌──────────────────────────────────────────────────┐
│  함께 보면 좋은 상품                               │
│                                                  │
│  ◀  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ▶     │
│     │     │  │     │  │     │  │     │          │
│     │ 매트 │  │ 모빌 │  │ 이불 │  │ 가드 │          │
│     │     │  │     │  │     │  │     │          │
│     └─────┘  └─────┘  └─────┘  └─────┘          │
│                                                  │
│     ○ ○ ● ○                                      │
└──────────────────────────────────────────────────┘
```

**드래그 스크롤** + 자동 재생 (5초) + hover 시 일시정지

---

## 7. 모바일 UX 강화

### 7-1. 모바일 햄버거 메뉴

**현재**: 768px 이하에서 네비게이션 링크 숨김 (대체 UI 없음)

```
┌──────────────────────┐    열린 상태:
│ Nuage.        ☰  🛒  │    ┌──────────────────────┐
└──────────────────────┘    │ Nuage.         ✕  🛒  │
                            ├──────────────────────┤
                            │                      │
                            │  Home                │
                            │  Collections         │
                            │  About               │
                            │  Contact             │
                            │                      │
                            │  ───────────────     │
                            │  🔍 검색              │
                            │  ♡ 위시리스트          │
                            │                      │
                            └──────────────────────┘
```

**애니메이션**: 우측에서 슬라이드 인 + 오버레이 fade

---

### 7-2. 모바일 하단 고정 액션 바 (PDP)

```
┌──────────────────────────────────┐
│  ♡    ₩890,000   [장바구니 담기]  │
└──────────────────────────────────┘
```

**스크롤 시**: 상단 "장바구니 담기" 버튼이 뷰포트를 벗어나면 하단 바 등장 (0.3s slide-up)

---

### 7-3. 모바일 이미지 갤러리 (Swipe)

터치 스와이프로 이미지 탐색 + 페이지 인디케이터 도트

---

## 8. 마이크로 인터랙션

### 8-1. 버튼 상태 피드백

**현재**: hover 시 배경 변화만

**제안**:
```
hover  → 살짝 상승 (-2px) + 그림자 확장
press  → 살짝 하강 (1px) + 그림자 축소 + scale(0.98)
loading → 텍스트 fade-out + 스피너 fade-in
success → 스피너 → 체크마크 모핑 (0.3s)
```

```css
.btn-primary:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

/* 장바구니 담기 성공 시 */
.btn-primary.success {
  background: var(--accent-green, #4caf50);
  pointer-events: none;
}
.btn-primary.success::after {
  content: '✓ 담겼습니다';
}
```

---

### 8-2. 수량 선택기 애니메이션

**현재**: 기본적인 +/- 버튼

**제안**:
```
[-]  ←─────  3  ─────→  [+]
     슬라이드 숫자 전환
```

숫자 변경 시 위/아래 슬라이드 전환:
```css
.qty-display {
  overflow: hidden;
  height: 1.5em;
}
.qty-number {
  display: block;
  transition: transform 0.2s ease;
}
.qty-number.slide-up {
  transform: translateY(-100%);
}
.qty-number.slide-down {
  transform: translateY(100%);
}
```

---

### 8-3. 토스트 알림

```
                              ┌───────────────────────────┐
                              │ ✓ 장바구니에 추가되었습니다  │
                              │   포레스트 코지 크립         │
                              │          [장바구니 보기]     │
                              └───────────────────────────┘
```

**위치**: 우상단 고정
**애니메이션**: 우측에서 슬라이드 인 → 4초 후 → 우측으로 슬라이드 아웃
**진행 바**: 하단에 4초 동안 줄어드는 프로그레스 바

---

### 8-4. 스크롤 기반 헤더 변형

**현재**: 배경과 그림자만 변경

**제안 — 축소 변형**:
```
스크롤 전:                              스크롤 후:
┌────────────────────────────────┐    ┌────────────────────────────────┐
│                                │    │ Nuage. Home Coll About  🔍 🛒 │
│  Nuage.                        │    └────────────────────────────────┘
│                                │    높이: 60px, 패딩 축소, 로고 크기 축소
│  Home  Collections  About  🛒  │
│                                │
└────────────────────────────────┘
높이: 80px
```

---

### 8-5. 폼 인터랙션 (뉴스레터)

**현재**: 기본 input + button

**제안**:
```
포커스 전:    [이메일을 입력하세요          ]  [구독]
포커스 시:    [이메일을 입력하세요__        ]  [구독]
              ─── accent-color 밑줄 확장 ───
입력 중:     [user@email.com_             ]  [구독]
성공 시:     [✓ 구독 완료! 감사합니다.      ]
              배경이 연한 녹색으로 전환
```

---

## 9. 신규 페이지 & 섹션

### 9-1. About 섹션 (브랜드 스토리)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│         "모든 아이에게는                           │
│          포근한 시작이 필요합니다"                  │
│                                                  │
│  ┌──────────┐  Nuage는 '구름'이라는 뜻의          │
│  │          │  프랑스어에서 영감을 받았습니다.       │
│  │ 공방 사진 │                                    │
│  │          │  유럽산 원목과 무독성 마감재로          │
│  └──────────┘  아이의 안전을 최우선으로 합니다.      │
│                                                  │
│  ┌────────┐  ┌────────┐  ┌────────┐             │
│  │ 🌿     │  │ 🛡️     │  │ ♻️     │             │
│  │ 친환경  │  │ 안전    │  │ 지속    │             │
│  │ 소재   │  │ 인증    │  │ 가능    │             │
│  └────────┘  └────────┘  └────────┘             │
│                                                  │
└──────────────────────────────────────────────────┘
```

**스크롤 애니메이션**: 이미지와 텍스트가 교차 등장 (좌/우 슬라이드)

---

### 9-2. 룸 인스피레이션 갤러리

**벤치마크**: Pottery Barn, RH — 완성된 방 이미지에서 상품 태그

```
┌──────────────────────────────────────────────────┐
│                                                  │
│              [완성된 아기방 이미지]                 │
│                                                  │
│          ● ───── 포레스트 코지 크립 ₩890,000      │
│                                                  │
│      ● ───── 라운디 수납장 ₩520,000               │
│                                                  │
│                     ● ── 노르딕 하이체어 ₩340,000  │
│                                                  │
│                    [이 방 전체 구매 ₩1,750,000]    │
│                                                  │
└──────────────────────────────────────────────────┘
```

**인터랙션**:
- 핫스팟(●) pulse 애니메이션
- 클릭 → 상품 미니 카드 팝업 (가격, 이미지, 장바구니 담기)
- "이 방 전체 구매" → 모든 상품을 한번에 장바구니 추가

---

### 9-3. 성장 가이드 섹션

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  아이의 성장에 맞는 가구                           │
│                                                  │
│  ──●──────────●──────────●──────────●──           │
│   신생아      6개월       2세        5세           │
│                                                  │
│  [크립]     [하이체어]   [책상]     [침대 전환]     │
│                                                  │
│  현재 선택: 6개월~2세                              │
│  추천 상품: 노르딕 하이체어, 포레스트 코지 크립      │
│                                                  │
└──────────────────────────────────────────────────┘
```

**타임라인 인터랙션**: 슬라이더 드래그 → 해당 연령대 추천 상품 교체 (crossfade)

---

## 10. 성능 최적화

### 10-1. 이미지 최적화

| 현재 | 제안 |
|------|------|
| PNG 원본 (~700KB 각) | WebP 변환 (200-300KB) |
| 즉시 로딩 | `loading="lazy"` |
| 단일 크기 | `srcset` 반응형 이미지 |
| 없음 | 블러 플레이스홀더 (LQIP) |

**블러 업 로딩** (Low Quality Image Placeholder):
```html
<div class="image-container">
  <img 
    src="data:image/jpeg;base64,/9j/4AAQ..." 
    class="image-placeholder blur"
    alt=""
  />
  <img 
    src="crib_premium.webp" 
    loading="lazy"
    onload="this.previousElementSibling.classList.add('loaded')"
    alt="포레스트 코지 크립"
  />
</div>
```

```css
.image-placeholder {
  filter: blur(20px);
  transform: scale(1.1);
  transition: opacity 0.5s ease;
}
.image-placeholder.loaded {
  opacity: 0;
}
```

---

### 10-2. 스켈레톤 로딩

```
┌──────────┐
│ ░░░░░░░░ │  ← 이미지 스켈레톤
│ ░░░░░░░░ │
│ ░░░░░░░░ │
├──────────┤
│ ░░░░░░░  │  ← 제목 스켈레톤
│ ░░░░     │  ← 가격 스켈레톤
│          │
│ [░░░░░░] │  ← 버튼 스켈레톤
└──────────┘
shimmer 효과 (좌→우 광택 이동)
```

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--light-accent) 25%,
    #ede5df 50%,
    var(--light-accent) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

### 10-3. 스크롤 성능

| 현재 | 제안 |
|------|------|
| scroll 이벤트 직접 사용 | `passive: true` 옵션 |
| 모든 요소 관찰 | 필요한 것만 관찰 + `unobserve` |
| 없음 | `will-change: transform` 힌트 |
| 없음 | `requestAnimationFrame` 쓰로틀 |

---

## 11. 구현 우선순위 로드맵

### Phase 1: 즉시 체감 (높은 임팩트, 낮은 난이도)

| # | 항목 | 난이도 | 임팩트 |
|---|------|--------|--------|
| 1 | 모바일 햄버거 메뉴 | 낮 | **매우 높음** (현재 모바일 네비 불가) |
| 2 | 장바구니 fly-to 애니메이션 | 중 | 높음 |
| 3 | 상품 카드 3D 틸트 + 광택 | 낮 | 높음 |
| 4 | 상품 등장 스태거 애니메이션 | 낮 | 중간 |
| 5 | 토스트 알림 시스템 | 낮 | 중간 |
| 6 | 아코디언 토글 구현 | 낮 | 중간 |
| 7 | 텍스트 리빌 애니메이션 | 낮 | 중간 |

### Phase 2: 쇼핑 핵심 (전환율 직결)

| # | 항목 | 난이도 | 임팩트 |
|---|------|--------|--------|
| 8 | 상품 이미지 줌 (hover) | 중 | 높음 |
| 9 | 이미지 갤러리 + 라이트박스 | 중 | 높음 |
| 10 | Quick View 모달 | 중 | 높음 |
| 11 | 위시리스트 (하트) | 중 | 중간 |
| 12 | 소재/색상 스와치 | 중 | 중간 |
| 13 | 버튼 상태 피드백 강화 | 낮 | 중간 |
| 14 | 수량 선택기 애니메이션 | 낮 | 낮음 |

### Phase 3: 콘텐츠 & 신뢰 (브랜드 가치)

| # | 항목 | 난이도 | 임팩트 |
|---|------|--------|--------|
| 15 | 리뷰 시스템 | 높 | 높음 |
| 16 | 안전 인증 뱃지 바 | 낮 | 중간 |
| 17 | 카운터 애니메이션 (통계) | 낮 | 중간 |
| 18 | About 브랜드 스토리 섹션 | 중 | 중간 |
| 19 | 소재 질감 핫스팟 | 중 | 중간 |
| 20 | 실시간 관심도 표시 | 낮 | 중간 |

### Phase 4: 고급 기능

| # | 항목 | 난이도 | 임팩트 |
|---|------|--------|--------|
| 21 | 상품 필터 & 정렬 | 높 | 높음 |
| 22 | 검색 기능 | 중 | 높음 |
| 23 | 룸 인스피레이션 갤러리 | 높 | 높음 |
| 24 | 최근 본 상품 바 | 중 | 중간 |
| 25 | 관련 상품 캐러셀 | 중 | 중간 |
| 26 | 성장 가이드 타임라인 | 높 | 중간 |
| 27 | 사이즈/치수 다이어그램 | 중 | 중간 |
| 28 | 모바일 하단 고정 액션 바 | 낮 | 중간 |
| 29 | 이미지 블러업 로딩 (LQIP) | 중 | 낮음 |
| 30 | 스켈레톤 로딩 | 중 | 낮음 |

---

## 부록: 디자인 토큰 참고

### 현재 색상 체계

```css
--bg-color:       #fdfbf7   /* 크림 배경 */
--text-primary:   #4a4238   /* 진한 갈색 텍스트 */
--text-secondary: #7f7466   /* 밝은 갈색 서브 텍스트 */
--accent-color:   #d4b499   /* 베이지 강조 */
--light-accent:   #f4eae6   /* 연한 베이지 */
--white:          #ffffff
```

### 추가 제안 색상

```css
--accent-green:   #8bae8b   /* 성공, 친환경 */
--accent-red:     #c9736e   /* 에러, 위시리스트 */
--accent-gold:    #c9a96e   /* 별점, 프리미엄 */
--bg-overlay:     rgba(74, 66, 56, 0.5)  /* 모달 오버레이 */
```

### 공통 전환

```css
--transition-fast:   0.2s ease
--transition-medium: 0.4s cubic-bezier(0.25, 1, 0.5, 1)
--transition-slow:   0.6s cubic-bezier(0.25, 1, 0.5, 1)
--transition-bounce: 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)
```

### 그림자 체계

```css
--shadow-hover:  0 20px 40px rgba(74, 66, 56, 0.12), 
                 0 8px 16px rgba(74, 66, 56, 0.08)
--shadow-modal:  0 25px 60px rgba(0, 0, 0, 0.15),
                 0 12px 24px rgba(0, 0, 0, 0.1)
--shadow-float:  0 8px 30px rgba(74, 66, 56, 0.1)
```
