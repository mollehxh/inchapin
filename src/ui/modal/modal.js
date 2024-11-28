import InputMask from 'imask';

const modalOpenButtons = document.querySelectorAll('.open-order-modal');
const modalCloseButtons = document.querySelectorAll('.modal__close');
const modalForm = document.querySelector('.modal__form');
const modalSubmitButton = document.querySelector('.modal__button');

const toggleModalVisibility = (isOpen) => {
  const modal = document.querySelector('.modal');
  modal.classList.toggle('modal--open', isOpen);
};

const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    toggleModalVisibility(false);
    document.removeEventListener('keydown', handleEscapeKey);
  }
};

const openModal = () => {
  toggleModalVisibility(true);
  document.addEventListener('keydown', handleEscapeKey);
};

const closeModal = () => {
  toggleModalVisibility(false);
  document.removeEventListener('keydown', handleEscapeKey);
};

modalOpenButtons.forEach((button) =>
  button.addEventListener('click', openModal)
);

modalCloseButtons.forEach((button) =>
  button.addEventListener('click', closeModal)
);

const phoneInput = document.querySelector('.modal__input[type="tel"]');
InputMask(phoneInput, {
  mask: '+{7} (000) 000-00-00',
});

modalSubmitButton.addEventListener('click', (event) => {
  event.preventDefault();
  const formData = new FormData(modalForm);

  for (const key of formData.keys()) {
    console.log(key, formData.get(key));
  }
});
