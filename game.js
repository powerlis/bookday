// 기존 game.js에서 GameInventory 부분만 수정된 전체 코드 예시

// ... (기존 코드 그대로 유지)

const GameInventory = ({ items, isOpen, onClose, notification, useMode = false, onUseItem, usePrompt = '' }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const GRID_SIZE = 12;

  if (!isOpen) {
    return React.createElement('div', { className: 'inventory-btn-container' },
      React.createElement(
        'button',
        { className: 'inventory-btn', onClick: () => onClose(false) },

        '📦 소지품',

        React.createElement('img', {
          src: 'logo.png',
          className: 'inventory-logo'
        }),

        items.length > 0 &&
          React.createElement('span', { className: 'item-count' }, items.length)
      ),
      notification && React.createElement('div', { className: 'inventory-notification' }, notification)
    );
  }

  // ... (이하 기존 코드 그대로 유지)
};
