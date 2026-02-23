document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('feedbackForm');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    clearErrors();

    let isValid = true;

    const fullname = document.getElementById('fullname');
    const fullnameValue = fullname.value.trim();
    const fullnameWords = fullnameValue.split(' ').filter(function (word) {
      return word.length > 0;
    });

    if (fullnameValue === '' || fullnameWords.length < 2) {
      showError(fullname, 'Введите минимум фамилию и имя');
      isValid = false;
    }

    const phone = document.getElementById('phone');
    const phoneValue = phone.value.trim();
    const phoneDigits = phoneValue.replace(/\D/g, '');

    if (phoneValue === '' || phoneDigits.length < 10) {
      showError(phone, 'Введите корректный номер телефона (не менее 10 цифр)');
      isValid = false;
    }

    const email = document.getElementById('email');
    const emailValue = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === '' || !emailPattern.test(emailValue)) {
      showError(email, 'Введите корректный email');
      isValid = false;
    }

    const message = document.getElementById('message');
    const messageValue = message.value.trim();

    if (messageValue.length > 500) {
      showError(message, 'Сообщение не должно превышать 500 символов');
      isValid = false;
    }

    const agreement = document.getElementById('agreement');
    if (!agreement.checked) {
      showError(agreement, 'Необходимо согласие на опд');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const formData = {
      fullname: fullnameValue,
      phone: phoneValue,
      email: emailValue,
      message: messageValue || '(не заполнено)'
    };

    const validEvent = new CustomEvent('formValid', { detail: formData });
    document.dispatchEvent(validEvent);

    alert('Форма отправлена, данные в консоли.');
    form.reset();
  });

  form.addEventListener('reset', function () {
    setTimeout(clearErrors, 0);
  });

  form.querySelectorAll('.input, .textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      this.classList.remove('is-danger');
      removeErrorMessage(this);
    });
  });

  document.getElementById('agreement').addEventListener('change', function () {
    this.classList.remove('is-danger');
    removeErrorMessage(this);
  });

  function clearErrors() {
    form.querySelectorAll('.is-danger').forEach(function (el) {
      el.classList.remove('is-danger');
    });

    form.querySelectorAll('.help.error-message').forEach(function (el) {
      el.remove();
    });
  }

  function showError(input, message) {
    input.classList.add('is-danger');

    const help = document.createElement('p');
    help.classList.add('help', 'is-danger', 'error-message');
    help.textContent = message;

    const field = input.closest('.form-field');
    if (field) {
      field.appendChild(help);
    }
  }

  function removeErrorMessage(input) {
    const field = input.closest('.form-field');
    if (!field) return;

    const errors = field.querySelectorAll('.help.error-message');
    errors.forEach(function (error) {
      error.remove();
    });
  }
});
