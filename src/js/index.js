window.addEventListener('load', function() {
  const closeBtn = document.querySelector('.modalNavBlock__btn');
  const openBtn = document.querySelector('.navBlock__burger-btn');
  const nav = document.querySelector('.modalNavBlock');

  const showedClass = 'modalNavBlock--showed';

  function showed() {
    return nav.classList.contains(showedClass);
  }

  function close() {
    if(showed()) {
      nav.classList.remove(showedClass);
    }
  }

  openBtn.addEventListener('click', function() {
    if(!showed()) {
      nav.classList.add(showedClass);
    }
  });

  closeBtn.addEventListener('click', close);

  nav.addEventListener('click', function(e) {
    if(e.target.classList.contains('modalNavBlock__link')) {
      close();
    }
  });
});
