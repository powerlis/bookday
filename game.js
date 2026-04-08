const { useState } = React;

const GameInventory = ({ items, isOpen, onClose, notification }) => {

  if (!isOpen) {
    return React.createElement(
      'div',
      { className: 'inventory-btn-container' },

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

      notification &&
        React.createElement('div', { className: 'inventory-notification' }, notification)
    );
  }

  return React.createElement('div', null, '인벤토리 열림');
};

function App() {
  const [open, setOpen] = useState(false);

  return React.createElement(
    'div',
    { className: 'game-container' },

    React.createElement(GameInventory, {
      items: [1, 2, 3],
      isOpen: open,
      onClose: setOpen,
      notification: null
    })
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(App)
);
