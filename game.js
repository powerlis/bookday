const { useState, useEffect, useCallback } = React;

const SCENES = {
  INTRO: 'intro', WAKE_UP: 'wakeUp', LIGHT_CHOICE: 'lightChoice', PHONE_ON: 'phoneOn',
  POSTER_VIEW: 'posterView', LOCKER_PUZZLE: 'lockerPuzzle',
  LOCKER_OPEN: 'lockerOpen', LIBRARY_MAIN: 'libraryMain',
  PERIODICALS: 'periodicals', CURATION: 'curation', BOOKSHELF_SELECT: 'bookshelfSelect',
  BOOKSHELF_PUZZLE: 'bookshelfPuzzle', THEATER_INTRO: 'theaterIntro', THEATER_PUZZLE: 'theaterPuzzle',
  SECRET_ROOM: 'secretRoom', CANDLE_SELECT: 'candleSelect', COPYRIGHT_PUZZLE: 'copyrightPuzzle',
  ENDING: 'ending'
};

const ITEMS_DATA = {
  letter: { id: 'letter', name: '구겨진 편지', emoji: '✉️', description: '주머니 속에 있던 편지다.\n\n"우리가 점점 사라지고 있어.\n우리를 구해줘."\n\n라고 적혀있다.' },
  poster: { id: 'poster', name: '세계 책과 저작권의 날 포스터', emoji: '📋', description: '📚 세계 책과 저작권의 날\n\n━━━━ 4월 23일 ━━━━\n\n1995년 UNESCO에서 매년 4월 23일로 지정.\n\n이 날은 "세인트 조지의 날"이기도 하며\n책을 사는 사람에게 꽃을 선물합니다.\n\n1616년 4월 23일,\n셰익스피어와 세르반테스\n두 거장이 같은 날 세상을 떠났습니다.' },
  candle: { id: 'candle', name: '양초와 성냥', emoji: '🕯️', description: '양초와 성냥 세트다.\n불을 붙이면 은은한 빛을 낼 수 있을 것 같다.' },
  flashlight: { id: 'flashlight', name: '손전등', emoji: '🔦', description: '"1500루멘의 초강력 LED 손전등!"\n이라고 적혀있다.\n엄청 엄청 밝다.' },
  flowers: { id: 'flowers', name: '꽃들에게 희망을', emoji: '📘', description: '트리나 폴러스의 책.\n\n"그저 먹고 자라는 것만이 삶의 전부는 아닐 거야.\n\n이런 삶과는 다른 무언가가 있을 게 분명해."' },
  oldman: { id: 'oldman', name: '노인과 바다', emoji: '📙', description: '헤밍웨이의 책.\n\n"물론 바다는 상냥하고 무척이나 아름답지.\n\n하지만 때로는 정말 잔인해지기도 하고\n어느 순간 휘몰아치기도 하잖아."' },
  macbeth: { id: 'macbeth', name: '맥베스', emoji: '📕', description: '셰익스피어의 책.\n\n"꺼져라, 꺼져라, 덧없는 촛불이여.\n인생은 한낱 흔들리는 그림자일 뿐.\n\n가련한 배우, 맡은 시간엔 무대 위에서\n활개치고 안달하지만\n얼마 안 가 영영 기억에서 지워져 버리지 않는가."' },
  quixote: { id: 'quixote', name: '돈키호테', emoji: '📗', description: '세르반테스의 책.\n\n"장차 이룩할 수 있는 세상을 상상하는 내가 미친 거요?\n\n아니면 세상을 있는 그대로만 보는 사람이 미친 거요?"' },
  wiltedFlower: { id: 'wiltedFlower', name: '시든 꽃', emoji: '🥀', description: '유리관에 담겨있던 시든 꽃.\n\n아직 완전히 죽지는 않은 것 같다.\n다시 피어날 수 있을까?' },
  secretBadge: { id: 'secretBadge', name: '비밀의 증표', emoji: '🔮', description: '✨ 히든 아이템 ✨\n\n"SECRET"\n\n이야기 속에 숨겨진 비밀을 찾아낸 자에게\n주어지는 신비로운 증표.\n\n당신은 진정한 이야기 탐험가입니다.\n\n(이 아이템을 캡쳐해서 선생님께 보여주면 특별한 선물이 있을지도?)' },
  librarianLetter: { id: 'librarianLetter', name: '사서쌤의 편지', emoji: '💌', description: '✨ 히든 아이템 ✨\n\n"to. 사랑하는 학생들에게,\n\n네가 이 편지를 찾았다는 건\n평소 도서관에 관심이 정말 많다는 뜻이겠지?\n\n오늘도 책과 함께 좋은 하루 보내길.\n오늘 넘긴 한 페이지가 쌓여, \n내일의 네가 더 단단해지길.\n\nfrom. 항상 응원하는\n도서관 사서쌤이"\n\n(이 아이템을 캡쳐해서 선생님께 보여주면 특별한 선물이 있을지도?)' }
};

const QUOTE_PAIRS = [
  { id: 1, work: '햄릿', quote: '사느냐 죽느냐, 그것이 문제로다' },
  { id: 2, work: '로미오와 줄리엣', quote: '장미를 다른 이름으로 불러도 향기는 그대로' },
  { id: 3, work: '오셀로', quote: '질투는 사람 마음을 갉아먹는 녹색 눈의 괴물' },
  { id: 4, work: '한여름 밤의 꿈', quote: '사랑은 눈이 아니라 마음으로 보는 것' }
];

const parseSegments = (text) => {
  const parts = text.split(/(\[highlight\].*?\[\/highlight\]|\[skyblue\].*?\[\/skyblue\])/g);
  const segments = [];
  parts.forEach(part => {
    if (part.startsWith('[highlight]')) {
      segments.push({ text: part.replace(/\[\/?highlight\]/g, ''), className: 'highlight' });
    } else if (part.startsWith('[skyblue]')) {
      segments.push({ text: part.replace(/\[\/?skyblue\]/g, ''), className: 'skyblue-text' });
    } else {
      segments.push({ text: part, className: null });
    }
  });
  return segments;
};

const renderSegments = (segments, charCount) => {
  let remaining = charCount;
  const result = [];
  segments.forEach((seg, si) => {
    if (remaining <= 0) return;
    const visible = seg.text.slice(0, remaining);
    remaining -= seg.text.length;
    const lines = visible.split('\n');
    const content = lines.map((line, j) => React.createElement(React.Fragment, { key: j }, line, j < lines.length - 1 && React.createElement('br')));
    if (seg.className) {
      result.push(React.createElement('span', { key: si, className: seg.className }, content));
    } else {
      result.push(React.createElement(React.Fragment, { key: si }, content));
    }
  });
  return result;
};

const TypeWriter = ({ text, speed = 30, onComplete, className = '' }) => {
  const segments = parseSegments(text);
  const totalChars = segments.reduce((sum, s) => sum + s.text.length, 0);
  const [charCount, setCharCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  useEffect(() => { setCharCount(0); setIsComplete(false); }, [text]);
  useEffect(() => {
    if (charCount < totalChars) {
      const timer = setTimeout(() => setCharCount(prev => prev + 1), speed);
      return () => clearTimeout(timer);
    } else if (!isComplete && totalChars > 0) { setIsComplete(true); onComplete?.(); }
  }, [charCount, totalChars, speed, onComplete, isComplete]);
  const handleSkip = () => { setCharCount(totalChars); };
  return React.createElement('div', { className, onClick: handleSkip }, renderSegments(segments, charCount), charCount < totalChars && React.createElement('span', { className: 'cursor' }, '▌'));
};

const EffectOverlay = ({ type, onComplete }) => {
  useEffect(() => { const timer = setTimeout(onComplete, type === 'flash' ? 600 : 1500); return () => clearTimeout(timer); }, [onComplete, type]);
  if (type === 'flash') return React.createElement('div', { className: 'effect-flash' });
  if (type === 'unlock') return React.createElement('div', { className: 'effect-unlock' }, React.createElement('span', { className: 'unlock-emoji' }, '🔓'));
  if (type === 'candle') return React.createElement('div', { className: 'effect-unlock' }, React.createElement('span', { className: 'unlock-emoji candle-glow-effect' }, '🕯️'));
  if (type === 'easter') return React.createElement('div', { className: 'effect-easter' }, React.createElement('span', { className: 'easter-emoji' }, '✨🔮✨'), React.createElement('p', { className: 'easter-text' }, '히든 아이템 발견!'));
  return null;
};

const GameInventory = ({ items, isOpen, onClose, notification, useMode = false, onUseItem, usePrompt = '' }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const GRID_SIZE = 12;
  if (!isOpen) {
    return React.createElement('div', { className: 'inventory-btn-container' },
      React.createElement('button', { className: 'inventory-btn', onClick: () => onClose(false) }, '📦 소지품 ', items.length > 0 && React.createElement('span', { className: 'item-count' }, items.length)),
      notification && React.createElement('div', { className: 'inventory-notification' }, notification)
    );
  }
  return React.createElement('div', { className: 'game-inventory-overlay', onClick: () => { onClose(true); setSelectedItem(null); } },
    React.createElement('div', { className: 'game-inventory', onClick: e => e.stopPropagation() },
      React.createElement('div', { className: 'inventory-title' },
        React.createElement('span', null, '📦 INVENTORY'),
        React.createElement('button', { className: 'close-btn', onClick: () => { onClose(true); setSelectedItem(null); } }, '✕')
      ),
      useMode && usePrompt && React.createElement('div', { className: 'use-prompt' }, usePrompt),
      React.createElement('div', { className: 'inventory-grid' },
        [...Array(GRID_SIZE)].map((_, i) => {
          const item = items[i];
          const isHidden = item?.id === 'secretBadge' || item?.id === 'librarianLetter';
          return React.createElement('div', { 
            key: i, 
            className: `inventory-slot ${item ? 'has-item' : ''} ${selectedItem?.id === item?.id ? 'selected' : ''} ${isHidden ? 'hidden-item' : ''}`,
            onClick: () => item && setSelectedItem(selectedItem?.id === item.id ? null : item)
          }, item && React.createElement('span', { className: 'slot-emoji' }, item.emoji));
        })
      ),
      React.createElement('div', { className: 'item-info-panel' },
        selectedItem ? React.createElement(React.Fragment, null,
          React.createElement('div', { className: 'item-info-header' },
            React.createElement('span', { className: 'info-emoji' }, selectedItem.emoji),
            React.createElement('span', { className: 'info-name' }, selectedItem.name)
          ),
          React.createElement('div', { className: 'item-info-desc' }, selectedItem.description),
          useMode && React.createElement('button', { className: 'use-btn', onClick: () => onUseItem(selectedItem) }, '사용하기')
        ) : React.createElement('div', { className: 'no-selection' }, items.length > 0 ? '아이템을 선택하세요' : '소지품이 없습니다')
      )
    )
  );
};

const PopupModal = ({ title, content, onClose, showItemGet }) => {
  if (!content) return null;
  return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
    React.createElement('div', { className: 'modal-content popup-modal', onClick: e => e.stopPropagation() },
      title && React.createElement('h3', { className: 'popup-title' }, title),
      React.createElement('p', { className: 'popup-content' }, content),
      showItemGet && React.createElement('p', { className: 'item-get-text' }, '[ ', showItemGet, ' 획득 ]'),
      React.createElement('button', { className: 'modal-btn', onClick: onClose }, '돌아간다')
    )
  );
};

const ChoiceButton = ({ children, onClick, disabled = false }) => {
  const handleTouch = (e) => {
    if (disabled) return;
    e.preventDefault();
    const btn = e.currentTarget;
    btn.classList.add('touch-active');
    setTimeout(() => { btn.classList.remove('touch-active'); onClick && onClick(); }, 80);
  };
  return React.createElement('button', {
    className: `choice-btn ${disabled ? 'disabled' : ''}`,
    onTouchEnd: handleTouch,
    onClick: (e) => { if (e.isTrusted && 'ontouchstart' in window) return; onClick && onClick(); },
    disabled
  }, children);
};

function BloomTheStory() {
  const [scene, setScene] = useState(SCENES.INTRO);
  const [items, setItems] = useState([]);
  const [popup, setPopup] = useState(null);
  const [textComplete, setTextComplete] = useState(false);
  const [notification, setNotification] = useState(null);
  const [visitedScenes, setVisitedScenes] = useState({});
  const [activeEffect, setActiveEffect] = useState(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [inventoryUseMode, setInventoryUseMode] = useState(false);
  const [inventoryPrompt, setInventoryPrompt] = useState('');
  const [pendingUseCallback, setPendingUseCallback] = useState(null);
  const [lockerCode, setLockerCode] = useState(['', '', '', '']);
  const [lockerError, setLockerError] = useState(false);
  const [anagramLetters, setAnagramLetters] = useState([]);
  const [anagramSlots, setAnagramSlots] = useState([]);
  const [anagramError, setAnagramError] = useState(false);
  const [anagramInitialized, setAnagramInitialized] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [copyrightAnswer, setCopyrightAnswer] = useState('');
  const [copyrightError, setCopyrightError] = useState(false);
  const [endingStep, setEndingStep] = useState(0);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [bookshelfError, setBookshelfError] = useState(false);
  const [bookshelfHint, setBookshelfHint] = useState(false);
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [phoneOnItemGiven, setPhoneOnItemGiven] = useState(false);
  const [lockerOpenItemsGiven, setLockerOpenItemsGiven] = useState(false);
  const [secretRoomItemGiven, setSecretRoomItemGiven] = useState(false);
  const [foundSecret, setFoundSecret] = useState(false);
  const [foundLibrarianLetter, setFoundLibrarianLetter] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => { if (notificationQueue.length > 0 && !notification) { setNotification(notificationQueue[0]); setNotificationQueue(prev => prev.slice(1)); setTimeout(() => setNotification(null), 2000); } }, [notificationQueue, notification]);

  const addItem = useCallback((itemId) => {
    const item = ITEMS_DATA[itemId];
    if (item) { setItems(prev => { if (prev.find(i => i.id === itemId)) return prev; setNotificationQueue(q => [...q, `${item.emoji} ${item.name} 획득!`]); return [...prev, item]; }); return true; }
    return false;
  }, []);

  const hasItem = useCallback((itemId) => items.some(i => i.id === itemId), [items]);
  const hasAllBooks = useCallback(() => hasItem('flowers') && hasItem('oldman') && hasItem('macbeth') && hasItem('quixote'), [hasItem]);
  const markVisited = (sceneId) => setVisitedScenes(prev => ({ ...prev, [sceneId]: true }));
  const showEffect = (type) => setActiveEffect(type);

  const requestItemUse = (prompt, callback) => { setInventoryPrompt(prompt); setInventoryUseMode(true); setInventoryOpen(true); setPendingUseCallback(() => callback); };
  const handleInventoryClose = (wasOpen) => { if (wasOpen) { setInventoryOpen(false); setInventoryUseMode(false); setInventoryPrompt(''); setPendingUseCallback(null); } else { setInventoryOpen(true); } };
  const handleUseItem = (item) => { 
    if (pendingUseCallback) { 
      const shouldClose = pendingUseCallback(item);
      if (shouldClose === true) { setInventoryOpen(false); setInventoryUseMode(false); setInventoryPrompt(''); setPendingUseCallback(null); }
    }
  };

  useEffect(() => { if (scene === SCENES.PHONE_ON && !phoneOnItemGiven) { const t = setTimeout(() => { addItem('letter'); setPhoneOnItemGiven(true); setShowTutorial(true); }, 100); return () => clearTimeout(t); } }, [scene, phoneOnItemGiven, addItem]);
  useEffect(() => { if (scene === SCENES.LOCKER_OPEN && !lockerOpenItemsGiven) { showEffect('unlock'); addItem('flashlight'); addItem('candle'); setLockerOpenItemsGiven(true); } }, [scene, lockerOpenItemsGiven, addItem]);
  useEffect(() => { if (scene === SCENES.SECRET_ROOM && !secretRoomItemGiven) { const t = setTimeout(() => { addItem('wiltedFlower'); setSecretRoomItemGiven(true); }, 500); return () => clearTimeout(t); } }, [scene, secretRoomItemGiven, addItem]);
  useEffect(() => { if (scene === SCENES.BOOKSHELF_PUZZLE && !anagramInitialized) { setAnagramLetters(['C','E','R','V','A','N','T','E','S'].sort(() => Math.random() - 0.5)); setAnagramSlots(['','','','','','','','','']); setAnagramInitialized(true); } }, [scene, anagramInitialized]);
  useEffect(() => { if (scene === SCENES.THEATER_PUZZLE && cards.length === 0) { const allCards = QUOTE_PAIRS.flatMap(pair => [{ id: `work-${pair.id}`, pairId: pair.id, type: 'work', content: pair.work }, { id: `quote-${pair.id}`, pairId: pair.id, type: 'quote', content: pair.quote }]); setCards(allCards.sort(() => Math.random() - 0.5)); } }, [scene, cards.length]);

  const goToScene = (newScene, skipAnimation = false) => { markVisited(scene); if (skipAnimation || visitedScenes[newScene]) setTextComplete(true); else setTextComplete(false); setScene(newScene); };

  const handleLockerInput = (index, value) => { if (!/^\d*$/.test(value)) return; const newCode = [...lockerCode]; newCode[index] = value.slice(-1); setLockerCode(newCode); setLockerError(false); if (value && index < 3) document.getElementById(`locker-${index + 1}`)?.focus(); };
  const handleLockerSubmit = () => { if (lockerCode.join('') === '0423') goToScene(SCENES.LOCKER_OPEN); else { setLockerError(true); setLockerCode(['','','','']); document.getElementById('locker-0')?.focus(); } };
  const handleLetterClick = (letter, letterIndex) => { const emptySlotIndex = anagramSlots.findIndex(s => s === ''); if (emptySlotIndex === -1) return; const newSlots = [...anagramSlots]; newSlots[emptySlotIndex] = letter; setAnagramSlots(newSlots); const newLetters = [...anagramLetters]; newLetters.splice(letterIndex, 1); setAnagramLetters(newLetters); setAnagramError(false); };
  const handleSlotClick = (slotIndex) => { const letter = anagramSlots[slotIndex]; if (!letter) return; const newSlots = [...anagramSlots]; newSlots[slotIndex] = ''; setAnagramSlots(newSlots); setAnagramLetters([...anagramLetters, letter]); setAnagramError(false); };
  
  const handleAnagramSubmit = () => { 
    const filled = anagramSlots.filter(s => s !== '');
    const word = filled.join('');
    if (word === 'SECRET' && !foundSecret) {
      setFoundSecret(true); showEffect('easter');
      setTimeout(() => { addItem('secretBadge'); setPopup({ title: '✨ 숨겨진 비밀 발견! ✨', content: '"SECRET"\n\n이야기 속에 숨겨진 비밀을 찾았군요!\n\n히든 아이템이 소지품에 추가되었습니다.\n\n하지만 퍼즐의 정답은 9글자예요.\n다시 도전해보세요!' }); handleAnagramReset(); }, 1500);
    } else if (word === 'CERVANTES') { goToScene(SCENES.THEATER_INTRO); }
    else { setAnagramError(true); }
  };
  
  const handleAnagramReset = () => { setAnagramLetters(['C','E','R','V','A','N','T','E','S'].sort(() => Math.random() - 0.5)); setAnagramSlots(['','','','','','','','','']); setAnagramError(false); };
  const handleCardClick = (card) => { if (flippedCards.length === 2 || flippedCards.includes(card.id) || matchedPairs.includes(card.pairId)) return; const newFlipped = [...flippedCards, card.id]; setFlippedCards(newFlipped); if (newFlipped.length === 2) { const [first, second] = newFlipped.map(id => cards.find(c => c.id === id)); if (first.pairId === second.pairId && first.type !== second.type) { const newMatched = [...matchedPairs, first.pairId]; setMatchedPairs(newMatched); setFlippedCards([]); if (newMatched.length === QUOTE_PAIRS.length) setTimeout(() => goToScene(SCENES.SECRET_ROOM), 1000); } else setTimeout(() => setFlippedCards([]), 1200); } };
  const handleBookSelect = (bookId) => { if (selectedBooks.includes(bookId)) setSelectedBooks(selectedBooks.filter(b => b !== bookId)); else if (selectedBooks.length < 2) setSelectedBooks([...selectedBooks, bookId]); setBookshelfError(false); };
  const handleBookshelfSubmit = () => { if (selectedBooks.length === 2 && ['macbeth', 'quixote'].every(b => selectedBooks.includes(b))) goToScene(SCENES.BOOKSHELF_PUZZLE); else setBookshelfError(true); };
  
  const handleCopyrightSubmit = () => { 
    const n = copyrightAnswer.toLowerCase().trim().replace(/\s+/g, ''); 
    if (['저작권', 'copyright'].includes(n)) { goToScene(SCENES.ENDING); }
    else if (n === '도서관' && !foundLibrarianLetter) {
      setFoundLibrarianLetter(true); showEffect('easter');
      setTimeout(() => { addItem('librarianLetter'); setPopup({ title: '💌 비밀 편지 발견! 💌', content: '도서관에 관심이 많군요!\n\n특별한 편지가 소지품에 추가되었습니다.\n\n하지만 퍼즐의 정답은 따로 있어요.\n다시 도전해보세요!' }); setCopyrightAnswer(''); setCopyrightError(false); }, 1500);
    } else { setCopyrightError(true); }
  };

  const endingTexts = [
    '장미가 빛을 내며 피어난다.\n\n희미해져가던 책장의 책 제목이\n다시 또렷하게 돌아온다.',
    '"나를 찾아줘서 고마워.\n\n나는 잊혀지고 싶지 않은 이야기야."',
    '"많은 이야기 속 헌신과 용기와\n아름다움과 희망을 통해 자라는 존재야.\n\n우리는 한 때 무성하게 피어나\n세상을 향기로 가득 채웠지만\n\n이제는 점차 읽히지 않고,\n모두의 기억에서 사라져가고 있어."',
    '"책을 많이 읽고 이야기꽃을 피울수록\n우리는 더욱 무성해질 수 있어."',
    '"기억해—\n\n책을 편다는 것은,\n하나의 꽃이 피어나는 것."',
    '"이제 너를 보내줄게.\n다른 사람들에게 나를 알려줘.\n\n우리가 더 많이 읽히고\n우리가 더 많이 기억될 수 있게."'
  ];

  const renderScene = () => {
    switch (scene) {
      case SCENES.INTRO:
        return React.createElement('div', { className: 'scene intro-scene' },
          React.createElement('div', { className: 'title-container' },
            React.createElement('h1', { className: 'game-title' }, '이야기꽃을 피워줘'),
            React.createElement('p', { className: 'game-subtitle' }, '세계 책과 저작권의 날 행사')
          ),
          React.createElement('button', { className: 'start-btn', onClick: () => goToScene(SCENES.WAKE_UP) }, '시작하기')
        );

      case SCENES.WAKE_UP:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'scene-text' },
            visitedScenes[SCENES.WAKE_UP] 
              ? React.createElement('p', null, '눈을 떴다.', React.createElement('br'), React.createElement('br'), '어두운 학교 도서관.', React.createElement('br'), '모두가 집에 돌아간 듯 적막하다.', React.createElement('br'), React.createElement('br'), '쉬는 시간에 잠깐 잠든 것뿐인데...', React.createElement('br'), '내가 왜 여기 있는 거지?', React.createElement('br'), React.createElement('br'), '일단 너무 어두워서 주변을 밝혀야겠다.')
              : React.createElement(TypeWriter, { text: '눈을 떴다.\n\n어두운 학교 도서관.\n모두가 집에 돌아간 듯 적막하다.\n\n쉬는 시간에 잠깐 잠든 것뿐인데...\n내가 왜 여기 있는 거지?\n\n일단 너무 어두워서 주변을 밝혀야겠다.', speed: 35, onComplete: () => setTextComplete(true) })
          ),
          (textComplete || visitedScenes[SCENES.WAKE_UP]) && React.createElement('div', { className: 'choices' },
            React.createElement(ChoiceButton, { onClick: () => goToScene(SCENES.LIGHT_CHOICE) }, '주변을 살펴본다')
          )
        );

      case SCENES.LIGHT_CHOICE:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'scene-text' },
            visitedScenes[SCENES.LIGHT_CHOICE]
              ? React.createElement('p', null, '어둠 속에서 희미하게 보이는 것들이 있다.', React.createElement('br'), React.createElement('br'), '불을 켜야 할 것 같은데...')
              : React.createElement(TypeWriter, { text: '어둠 속에서 희미하게 보이는 것들이 있다.\n\n불을 켜야 할 것 같은데...', speed: 35, onComplete: () => setTextComplete(true) })
          ),
          (textComplete || visitedScenes[SCENES.LIGHT_CHOICE]) && React.createElement('div', { className: 'choices' },
            React.createElement(ChoiceButton, { onClick: () => setPopup({ title: null, content: '달칵달칵.\n\n스위치를 아무리 눌러도 불이 켜지지 않는다.\n전등은 고장난 것 같다.' }) }, '전등 스위치를 켠다'),
            React.createElement(ChoiceButton, { onClick: () => goToScene(SCENES.PHONE_ON) }, '휴대폰 플래시를 켠다')
          )
        );

      case SCENES.PHONE_ON:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'scene-text' },
            visitedScenes[SCENES.PHONE_ON]
              ? React.createElement('p', null, 
                  '핸드폰을 꺼내려 주머니에 손을 넣으니', React.createElement('br'), 
                  React.createElement('span', { className: 'highlight' }, '구겨진 편지'), '가 손에 잡힌다.', React.createElement('br'), React.createElement('br'), 
                  '핸드폰 배터리는 10%밖에 남지 않아', React.createElement('br'), 
                  '금방이라도 꺼질 것 같다.', React.createElement('br'), React.createElement('br'), 
                  '불빛을 비추니 눈앞에', React.createElement('br'), 
                  React.createElement('span', { className: 'skyblue-text' }, '포스터'), '와 ', 
                  React.createElement('span', { className: 'skyblue-text' }, '사물함'), '이 보인다.'
                )
              : React.createElement(TypeWriter, { text: '핸드폰을 꺼내려 주머니에 손을 넣으니\n[highlight]구겨진 편지[/highlight]가 손에 잡힌다.\n\n핸드폰 배터리는 10%밖에 남지 않아\n금방이라도 꺼질 것 같다.\n\n불빛을 비추니 눈앞에\n[skyblue]포스터[/skyblue]와 [skyblue]사물함[/skyblue]이 보인다.', speed: 35, onComplete: () => setTextComplete(true) })
          ),
          (textComplete || visitedScenes[SCENES.PHONE_ON]) && React.createElement('div', { className: 'choices' },
            React.createElement(ChoiceButton, { onClick: () => { addItem('poster'); goToScene(SCENES.POSTER_VIEW); } }, '📋 포스터를 살펴본다'),
            React.createElement(ChoiceButton, { onClick: () => goToScene(SCENES.LOCKER_PUZZLE) }, '🔒 사물함을 살펴본다')
          )
        );

      case SCENES.POSTER_VIEW:
        return React.createElement('div', { className: 'scene' },
    React.createElement('div', { className: 'poster-container' },
      React.createElement('div', { className: 'poster' },
        React.createElement('h3', null, '📚 세계 책과 저작권의 날'),
        React.createElement('div', { className: 'poster-content' },
          React.createElement('p', null, React.createElement('strong', null, 'World Book and Copyright Day')),
          React.createElement('p', { className: 'poster-date' }, '4월 23일'),
          React.createElement('hr'),
          // 세 번째 p 태그 시작
          React.createElement('p', null, 
            '1995년 UNESCO 국제연합총회에서', React.createElement('br'), 
            '세계인의 독서 증진과', React.createElement('br'), 
            '저작권 보호에 대한', React.createElement('br'), 
            '올바른 인식을 높이기 위해 ', React.createElement('br'), 
            React.createElement('strong', null, '4월 23일'), '로 지정했습니다.' // 문맥상 지정했습니다 추가, 쉼표(,)로 연결
          ), // <-- 여기에 반드시 괄호와 쉼표가 있어야 합니다!
          React.createElement('p', null, 
            '이 날은 스페인 카탈루냐 지방의', React.createElement('br'), 
            React.createElement('strong', null, '"세인트 조지의 날"'), '이기도 하며,', React.createElement('br'), 
            '책을 사는 사람에게', React.createElement('br'), 
            React.createElement('strong', null, '🌹꽃'), '을 선물합니다.'
          ),
          React.createElement('p', null, 
            '또한 1616년 4월 23일,', React.createElement('br'), 
            React.createElement('strong', null, '셰익스피어'), '와 ', 
            React.createElement('strong', null, '세르반테스'), React.createElement('br'), 
            '두 거장이 같은 날', React.createElement('br'), 
            '세상을 떠난 날이기도 합니다.')
              )
            )
          ),
          React.createElement('div', { className: 'choices' },
            React.createElement(ChoiceButton, { onClick: () => goToScene(SCENES.PHONE_ON, true) }, '뒤로 돌아간다')
          )
        );

      case SCENES.LOCKER_PUZZLE:
        const hasPoster = hasItem('poster');
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'scene-text' },
            React.createElement('p', null, '사물함은 ', React.createElement('strong', null, '네 자리 숫자 자물쇠'), '로 잠겨있다.'),
            React.createElement('p', null, '자물쇠 몸통에 ', React.createElement('strong', null, '"MMDD"'), '라고 적혀있다.'),
            hasPoster 
              ? React.createElement('p', { className: 'hint-text' }, '💡 소지품에서 뭔가 단서를 찾을 수 있을 것 같다.')
              : React.createElement('p', { className: 'hint-text' }, '💡 이 문제를 풀려면 먼저 주변을 살펴봐야할 것 같다.')
          ),
          React.createElement('div', { className: 'locker-puzzle' },
            React.createElement('div', { className: 'code-input' },
              lockerCode.map((digit, i) => React.createElement('input', { key: i, id: `locker-${i}`, type: 'text', inputMode: 'numeric', value: digit, onChange: (e) => handleLockerInput(i, e.target.value), maxLength: 1, className: lockerError ? 'error' : '', disabled: !hasPoster }))
            ),
            !hasPoster && React.createElement('p', { className: 'hint-text-small' }, '뒤로 돌아가 단서를 찾자'),
            lockerError && React.createElement('p', { className: 'error-text' }, '틀렸다. 다시 생각해보자.'),
            React.createElement('button', { className: 'submit-btn', onClick: handleLockerSubmit, disabled: lockerCode.some(d => d === '') || !hasPoster }, '열기')
          ),
          React.createElement('div', { className: 'choices' },
            React.createElement(ChoiceButton, { onClick: () => goToScene(SCENES.PHONE_ON, true) }, '뒤로 돌아간다')
          )
        );

      case SCENES.LOCKER_OPEN:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'scene-text' },
            React.createElement(TypeWriter, { text: '찰칵!\n\n자물쇠가 열렸다.\n안에는 [highlight]손전등[/highlight]과 [highlight]양초와 성냥[/highlight]이 들어있다.\n\n...그리고 그 순간,\n핸드폰의 배터리가 모두 닳아 꺼져버렸다.\n\n주변을 다시 밝힐 것이 필요하다.', speed: 35, onComplete: () => setTextComplete(true) })
          ),
          (textComplete || visitedScenes[SCENES.LOCKER_OPEN]) && React.createElement(React.Fragment, null,
            React.createElement('p', { className: 'hint-text', style: { marginBottom: '1rem' } }, '💡 필요한 아이템을 선택하여 사용하세요.'),
            React.createElement('div', { className: 'choices' },
              React.createElement(ChoiceButton, { onClick: () => { requestItemUse('불을 밝힐 아이템을 선택하세요', (item) => { if (item.id === 'flashlight') { showEffect('flash'); setTimeout(() => goToScene(SCENES.LIBRARY_MAIN), 600); return true; } else if (item.id === 'candle') { setPopup({ title: '🕯️ 양초와 성냥', content: '치익—\n\n작은 불꽃이 일어났다.\n하지만 양초 불빛만으론 넓은 도서관을 밝히기엔 어려울 것 같아.' }); return false; } else { setPopup({ title: item.emoji + ' ' + item.name, content: '이걸로 불을 밝힐 순 없을 것 같다.' }); return false; } }); } }, '📦 아이템 사용하기')
            )
          )
        );

      case SCENES.LIBRARY_MAIN:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'scene-text' },
            visitedScenes[SCENES.LIBRARY_MAIN]
              ? React.createElement('p', null, 
                  '손전등을 켜자 강렬한 빛이 쏟아진다.', React.createElement('br'), React.createElement('br'), 
                  '세상에. 도서관 책장에 책 제목들이', React.createElement('br'), 
                  '점점 희미해져가고 있잖아!',  React.createElement('br'), React.createElement('br'), 
                  '이대로 가다간 모든 이야기가 사라져버릴 것 같다.', React.createElement('br'), React.createElement('br'), 
                  '뭔가 방법을 찾아야 해.', React.createElement('br'), React.createElement('br'), 
                  '눈앞에는 ', React.createElement('span', { className: 'skyblue-text' }, '정기간행물 코너'), ',', React.createElement('br'), 
                  React.createElement('span', { className: 'skyblue-text' }, '북 큐레이션 코너'), ',', React.createElement('br'), 
                  '그리고 ', React.createElement('span', { className: 'skyblue-text' }, '봉인된 책장'), '이 보인다.'
                )
              : React.createElement(TypeWriter, { text: '손전등을 켜자 강렬한 빛이 쏟아진다.\n\n세상에. 도서관 책장에 책 제목들이\n점점 희미해져가고 있잖아!\n\n이대로 가다간 모든 이야기가 사라져버릴 것 같다.\n뭔가 방법을 찾아야 해.\n\n눈앞에는 [skyblue]정기간행물 코너[/skyblue],\n[skyblue]북 큐레이션 코너[/skyblue],\n그리고 [skyblue]봉인된 책장[/skyblue]이 보인다.', speed: 35, onComplete: () => setTextComplete(true) })
          ),
          (textComplete || visitedScenes[SCENES.LIBRARY_MAIN]) && React.createElement('div', { className: 'choices' },
            React.createElement(ChoiceButton, { onClick: () => goToScene(SCENES.PERIODICALS) }, '📰 정기간행물 코너를 둘러본다'),
            React.createElement(ChoiceButton, { onClick: () => goToScene(SCENES.CURATION) }, '📚 북 큐레이션 코너를 둘러본다'),
            React.createElement(ChoiceButton, { onClick: () => { if (hasAllBooks()) goToScene(SCENES.BOOKSHELF_SELECT); else setPopup({ title: '🔮 봉인된 책장을 둘러본다', content: '책장 앞에 빈 책꽂이 두 칸이 보인다.\n\n뭔가 책을 꽂아야 할 것 같은데...\n일단 주변을 더 둘러보자.' }); } }, '🔮 봉인된 책장')
          )
        );

      case SCENES.PERIODICALS:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'scene-text' },
            React.createElement('p', null, '정기간행물 코너에 잡지들이 꽂혀있다.'),
            React.createElement('p', null, '그 중 한 잡지 표지에', React.createElement('br'), '누군가 휘갈겨 쓴 글씨가 보인다.')
          ),
          React.createElement('div', { className: 'message-box warning' },
            React.createElement('p', null, '"사망자의 책을 가져와!"')
          ),
          React.createElement('p', { className: 'thinking-text' }, '...사망자란 누구를 말하는 걸까?'),
          React.createElement('div', { className: 'choices' },
            React.createElement(ChoiceButton, { onClick: () => goToScene(SCENES.LIBRARY_MAIN, true) }, '뒤로 돌아간다')
          )
        );

      case SCENES.CURATION:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'scene-text' },
            React.createElement('p', null, React.createElement('strong', null, '📚 북 큐레이션 코너')),
            React.createElement('p', null, '"이달의 추천 도서"라고 적힌 선반에', React.createElement('br'), '여러 권의 책이 꽂혀있다.'),
            React.createElement('p', null, '어떤 책을 살펴볼까?')
          ),
          React.createElement('div', { className: 'book-choices' },
            React.createElement(ChoiceButton, { onClick: () => { const isNew = addItem('flowers'); setPopup({ title: '📘 꽃들에게 희망을', content: '"그저 먹고 자라는 것만이 삶의 전부는 아닐 거야.\n\n이런 삶과는 다른 무언가가 있을 게 분명해."', showItemGet: isNew ? '📘 꽃들에게 희망을' : null }); } }, '📘 꽃들에게 희망을'),
            React.createElement(ChoiceButton, { onClick: () => { const isNew = addItem('oldman'); setPopup({ title: '📙 노인과 바다', content: '"물론 바다는 상냥하고 무척이나 아름답지.\n\n하지만 때로는 정말 잔인해지기도 하고\n어느 순간 휘몰아치기도 하잖아."', showItemGet: isNew ? '📙 노인과 바다' : null }); } }, '📙 노인과 바다'),
            React.createElement(ChoiceButton, { onClick: () => { const isNew = addItem('macbeth'); setPopup({ title: '📕 맥베스', content: '"꺼져라, 꺼져라, 덧없는 촛불이여.\n인생은 한낱 흔들리는 그림자일 뿐."\n\n— 셰익스피어', showItemGet: isNew ? '📕 맥베스' : null }); } }, '📕 맥베스'),
            React.createElement(ChoiceButton, { onClick: () => { const isNew = addItem('quixote'); setPopup({ title: '📗 돈키호테', content: '"장차 이룩할 수 있는 세상을 상상하는 내가 미친 거요?\n\n아니면 세상을 있는 그대로만 보는 사람이 미친 거요?"\n\n— 세르반테스', showItemGet: isNew ? '📗 돈키호테' : null }); } }, '📗 돈키호테')
          ),
          React.createElement('div', { className: 'choices back-btn-area' },
            React.createElement(ChoiceButton, { onClick: () => goToScene(SCENES.LIBRARY_MAIN, true) }, '뒤로 돌아간다')
          )
        );

      case SCENES.BOOKSHELF_SELECT:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'scene-text' },
            React.createElement('p', null, React.createElement('strong', null, '🔮 봉인된 책장')),
            React.createElement('p', null, '책장 앞에 빈 책꽂이 두 칸이 있다.'),
            React.createElement('p', null, '가지고 있는 책 중 ', React.createElement('strong', null, '두 권'), '을 골라 꽂아보자.')
          ),
          React.createElement('div', { className: 'book-select-area' },
            [ITEMS_DATA.flowers, ITEMS_DATA.oldman, ITEMS_DATA.macbeth, ITEMS_DATA.quixote].map(book => 
              hasItem(book.id) && React.createElement('button', { key: book.id, className: `book-select-btn ${selectedBooks.includes(book.id) ? 'selected' : ''}`, onClick: () => handleBookSelect(book.id) },
                React.createElement('span', { className: 'book-emoji' }, book.emoji),
                React.createElement('span', { className: 'book-name' }, book.name),
                selectedBooks.includes(book.id) && React.createElement('span', { className: 'check-mark' }, '✓')
              )
            )
          ),
          React.createElement('p', { className: 'selected-count' }, '선택: ', selectedBooks.length, ' / 2'),
          bookshelfError && React.createElement('p', { className: 'error-text' }, '아무 일도 일어나지 않는다...'),
          React.createElement('button', { className: 'hint-toggle', onClick: () => setBookshelfHint(!bookshelfHint) }, '💡 힌트 ', bookshelfHint ? '숨기기' : '보기'),
          bookshelfHint && React.createElement('div', { className: 'hint-box' },
            React.createElement('p', null, '정기간행물 코너에 뭔가 적혀있다.'),
            React.createElement('p', null, '갖고 있는 아이템에서'),                                   
            React.createElement('p', null, '어떤 사람의 책을 말하는지 단서를 찾아보자.')
          ),
          React.createElement('div', { className: 'puzzle-buttons' },
            React.createElement('button', { className: 'reset-btn', onClick: () => setSelectedBooks([]) }, '초기화'),
            React.createElement('button', { className: 'submit-btn', onClick: handleBookshelfSubmit, disabled: selectedBooks.length !== 2 }, '책 꽂기')
          ),
          React.createElement('div', { className: 'choices back-btn-area' },
            React.createElement(ChoiceButton, { onClick: () => goToScene(SCENES.LIBRARY_MAIN, true) }, '뒤로 돌아간다')
          )
        );

      case SCENES.BOOKSHELF_PUZZLE:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'scene-text' },
            visitedScenes[SCENES.BOOKSHELF_PUZZLE]
              ? React.createElement(React.Fragment, null,
                  React.createElement('p', null, React.createElement('strong', null, '달칵!')),
                  React.createElement('p', null, '맥베스와 돈키호테를 꽂자', React.createElement('br'), '봉인된 책장이 열렸다!'),
                  React.createElement('p', null, '책장 주변으로 글자 타일들이', React.createElement('br'), '흩어져 있다.')
                )
              : React.createElement(TypeWriter, { text: '달칵!\n\n맥베스와 돈키호테를 꽂자\n봉인된 책장이 열렸다!\n\n책장 주변으로 글자 타일들이\n흩어져 있다.', speed: 35, onComplete: () => setTextComplete(true) })
          ),
          (textComplete || visitedScenes[SCENES.BOOKSHELF_PUZZLE]) && React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'message-box golden' },
              React.createElement('p', null, '"풍차를 거인으로 착각한 기사의 아버지,', React.createElement('br'), '그의 이름을 완성하라."'),
              React.createElement('p', { className: 'hint-small' }, '아홉 글자. C로 시작해서 S로 끝난다.')
            ),
            React.createElement('div', { className: 'anagram-puzzle' },
              React.createElement('p', { className: 'anagram-label' }, '사용 가능한 글자'),
              React.createElement('div', { className: 'available-letters' },
                anagramLetters.map((letter, i) => React.createElement('button', { key: `letter-${i}`, className: 'letter-tile', onClick: () => handleLetterClick(letter, i) }, letter))
              ),
              React.createElement('p', { className: 'anagram-label' }, '정답 입력'),
              React.createElement('div', { className: 'answer-slots' },
                anagramSlots.map((letter, i) => React.createElement('button', { key: `slot-${i}`, className: `letter-slot ${letter ? 'filled' : ''}`, onClick: () => handleSlotClick(i) }, letter))
              ),
              anagramError && React.createElement('p', { className: 'error-text' }, '틀렸다. 다시 배열해보자.'),
              React.createElement('div', { className: 'puzzle-buttons' },
                React.createElement('button', { className: 'reset-btn', onClick: handleAnagramReset }, '초기화'),
                React.createElement('button', { className: 'submit-btn', onClick: handleAnagramSubmit, disabled: anagramSlots.every(s => s === '') }, '확인')
              )
            )
          )
        );

      case SCENES.THEATER_INTRO:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'scene-text' },
            visitedScenes[SCENES.THEATER_INTRO]
              ? React.createElement('p', null, React.createElement('strong', null, '"CERVANTES"'), React.createElement('br'), React.createElement('br'), '글자들이 제자리를 찾자', React.createElement('br'), '봉인된 책장이 천천히 열린다.', React.createElement('br'), React.createElement('br'), '그 안에는 작은 극장 무대가 펼쳐져 있다.', React.createElement('br'), React.createElement('br'), '무대 위에 뒤집힌 카드들이 놓여있고,', React.createElement('br'), '다시 황금빛 메시지가 떠오른다.')
              : React.createElement(TypeWriter, { text: '"CERVANTES"\n\n글자들이 제자리를 찾자\n봉인된 책장이 천천히 열린다.\n\n그 안에는 작은 극장 무대가 펼쳐져 있다.\n\n무대 위에 뒤집힌 카드들이 놓여있고,\n다시 황금빛 메시지가 떠오른다.', speed: 35, onComplete: () => setTextComplete(true) })
          ),
          (textComplete || visitedScenes[SCENES.THEATER_INTRO]) && React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'message-box golden', style: { marginBottom: '1.5rem' } },
              React.createElement('p', null, '"세르반테스와 같은 날 잠든 또 다른 거장,'),
              React.createElement('p', null, '그의 작품과 명대사를 연결하라."')
            ),
            React.createElement('div', { className: 'choices' },
              React.createElement(ChoiceButton, { onClick: () => goToScene(SCENES.THEATER_PUZZLE) }, '카드를 살펴본다')
            )
          )
        );

      case SCENES.THEATER_PUZZLE:
        return React.createElement('div', { className: 'scene theater-scene' },
          React.createElement('div', { className: 'scene-text' },
            React.createElement('p', null, React.createElement('strong', null, '🎭 극장의 무대')),
            React.createElement('p', null, '셰익스피어의 작품과 명대사를 연결하라.')
          ),
          React.createElement('div', { className: 'card-grid' },
            cards.map(card => React.createElement('button', { 
              key: card.id, 
              className: `memory-card ${flippedCards.includes(card.id) || matchedPairs.includes(card.pairId) ? 'flipped' : ''} ${matchedPairs.includes(card.pairId) ? 'matched' : ''}`,
              onClick: () => handleCardClick(card)
            },
              React.createElement('div', { className: 'card-inner' },
                React.createElement('div', { className: 'card-front' }, '?'),
                React.createElement('div', { className: 'card-back' },
                  card.type === 'work' 
                    ? React.createElement('span', { className: 'card-work' }, card.content)
                    : React.createElement('span', { className: 'card-quote' }, card.content)
                )
              )
            ))
          ),
          React.createElement('p', { className: 'match-count' }, '매칭: ', matchedPairs.length, ' / ', QUOTE_PAIRS.length)
        );

      case SCENES.SECRET_ROOM:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'scene-text' },
            visitedScenes[SCENES.SECRET_ROOM]
              ? React.createElement('p', null, '모든 카드가 제자리를 찾자', React.createElement('br'), '무대 뒤편의 문이 열린다.', React.createElement('br'), React.createElement('br'), '도서관 가장 깊은 곳.', React.createElement('br'), '비밀의 서고.', React.createElement('br'), React.createElement('br'), '오래된 책들 사이로', React.createElement('br'), '유리관 하나가 빛나고 있다.', React.createElement('br'), React.createElement('br'), '그 안에는... 말라버린 꽃 한 송이.')
              : React.createElement(TypeWriter, { text: '모든 카드가 제자리를 찾자\n무대 뒤편의 문이 열린다.\n\n도서관 가장 깊은 곳.\n비밀의 서고.\n\n오래된 책들 사이로\n유리관 하나가 빛나고 있다.\n\n그 안에는... 말라버린 꽃 한 송이.', speed: 35, onComplete: () => setTextComplete(true) })
          ),
          (textComplete || visitedScenes[SCENES.SECRET_ROOM]) && React.createElement('div', { className: 'choices' },
            React.createElement(ChoiceButton, { onClick: () => goToScene(SCENES.CANDLE_SELECT) }, '시든 꽃에게 다가간다')
          )
        );

      case SCENES.CANDLE_SELECT:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'rose-display' },
            React.createElement('div', { className: 'glass-dome' },
              React.createElement('div', { className: 'wilted-rose' }, '🥀')
            )
          ),
          React.createElement('div', { className: 'scene-text' },
            React.createElement('p', null, '유리관 아래에 메모지가 있다.')
          ),
          React.createElement('div', { className: 'message-box golden' },
            React.createElement('p', null, '"그 자는 극장에서 우리에게', React.createElement('br'), '인생은 그림자일 뿐이라고 말했지.'),
            React.createElement('p', null, '하지만 나는 사라지고 싶지 않아.', React.createElement('br'), '나는 계속해서 살아 있을 거야.'),
            React.createElement('p', null, "'그것'을 꺼뜨리지 말고 내게 가져와줘.\"")
          ),
          React.createElement('div', { className: 'choices' },
            React.createElement(ChoiceButton, { onClick: () => { requestItemUse("'그것'을 가져오세요", (item) => { if (item.id === 'candle') { showEffect('candle'); setTimeout(() => goToScene(SCENES.COPYRIGHT_PUZZLE), 1500); return true; } else if (item.id === 'flashlight') { setPopup({ title: '🔦 손전등', content: '손전등은 "그것"이 아닌 것 같다.\n\n메모에서 말한 "그것"은 다른 것 같다.' }); return false; } else { setPopup({ title: item.emoji + ' ' + item.name, content: '이건 아닌 것 같다.' }); return false; } }); } }, '📦 아이템 사용하기')
          )
        );

      case SCENES.COPYRIGHT_PUZZLE:
        return React.createElement('div', { className: 'scene' },
          React.createElement('div', { className: 'rose-display' },
            React.createElement('div', { className: 'glass-dome candle-lit' },
              React.createElement('div', { className: 'wilted-rose' }, '🥀'),
              React.createElement('div', { className: 'candle-glow' }, '🕯️')
            )
          ),
          React.createElement('div', { className: 'scene-text' },
            React.createElement('p', null, '촛불을 가져가자 숨겨진 글씨가 떠오른다.')
          ),
          React.createElement('div', { className: 'message-box golden' },
            React.createElement('p', null, '"우리를 지키려면 이것을 먼저 알아야해.'),
            React.createElement('p', null, '창작자의 창작물을 지키는 권리"')
          ),
          React.createElement('div', { className: 'text-input-area' },
            React.createElement('input', { type: 'text', value: copyrightAnswer, onChange: (e) => { setCopyrightAnswer(e.target.value); setCopyrightError(false); }, placeholder: '정답을 입력하세요', className: copyrightError ? 'error' : '', onKeyPress: (e) => e.key === 'Enter' && handleCopyrightSubmit() }),
            copyrightError && React.createElement('p', { className: 'error-text' }, '틀렸다. 다시 생각해보자.'),
            React.createElement('button', { className: 'submit-btn', onClick: handleCopyrightSubmit, disabled: !copyrightAnswer.trim() }, '확인')
          )
        );

      case SCENES.ENDING:
        return React.createElement('div', { className: 'scene ending-scene' },
          React.createElement('div', { className: `rose-bloom stage-${Math.min(endingStep + 1, 3)}` },
            React.createElement('span', { className: 'rose-emoji' }, endingStep < 1 ? '🥀' : '🌹')
          ),
          endingStep < endingTexts.length 
            ? React.createElement(React.Fragment, null,
                React.createElement('div', { className: 'ending-text' },
                  React.createElement(TypeWriter, { key: endingStep, text: endingTexts[endingStep], speed: 40, className: 'story-voice' })
                ),
                React.createElement('button', { className: 'next-btn', onClick: () => setEndingStep(endingStep + 1) }, '다음')
              )
            : React.createElement('div', { className: 'completion-card' },
                React.createElement('h2', null, '🎉 축하합니다! 🎉'),
                React.createElement('p', { className: 'completion-main' }, '잊혀져가는 이야기들을', React.createElement('br'), '구해냈군요!'),
                React.createElement('hr'),
                React.createElement('p', { className: 'completion-instruction' }, '해당 화면을 캡쳐하여', React.createElement('br'), React.createElement('strong', null, '도서관 사서선생님'), '께 보여주세요'),
                React.createElement('p', { className: 'completion-reward' }, '🌹 세계 책과 저작권의 날', React.createElement('br'), '상품을 드립니다 🌹'),
                React.createElement('p', { className: 'completion-note' }, '(*선착순, 상품 소진 시 마감)')
              ),
          endingStep >= 3 && React.createElement('div', { className: 'falling-petals' },
            [...Array(15)].map((_, i) => React.createElement('div', { key: i, className: 'falling-petal', style: { left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, animationDuration: `${3 + Math.random() * 2}s` } }))
          )
        );

      default: return null;
    }
  };

  return React.createElement('div', { className: 'game-container' },
    activeEffect && React.createElement(EffectOverlay, { type: activeEffect, onComplete: () => setActiveEffect(null) }),
    showTutorial && React.createElement('div', { className: 'tutorial-overlay', onClick: () => setShowTutorial(false) },
      React.createElement('div', { className: 'tutorial-arrow' }),
      React.createElement('div', { className: 'tutorial-box' },
        React.createElement('p', null, '게임에서 얻은 아이템은'),
        React.createElement('p', null, '소지품에서 확인할 수 있습니다.'),
        React.createElement('p', null, '아이템에서 단서를 찾아'),
        React.createElement('p', null, '도서관을 탈출해보세요!'),
        React.createElement('span', { className: 'tutorial-dismiss' }, '탭하여 닫기')
      )
    ),
    React.createElement(GameInventory, { items, isOpen: inventoryOpen, onClose: handleInventoryClose, notification, useMode: inventoryUseMode, onUseItem: handleUseItem, usePrompt: inventoryPrompt }),
    renderScene(),
    React.createElement(PopupModal, { title: popup?.title, content: popup?.content, showItemGet: popup?.showItemGet, onClose: () => setPopup(null) })
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(BloomTheStory));
