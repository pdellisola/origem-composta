UIkit.util.ready(function() {
      UIkit.util.$$('.slider-lightbox .el-item').forEach(function(el) {
          UIkit.lightbox(el);
      });
     const galleryImgs = UIkit.util.$$('.wp-block-group .wp-block-image');
    galleryImgs.forEach(function (img) {
        const figureMask = img.closest('figure');
        const wpfigurePar = img.parentNode;
        figureMask.classList.add('tm-mask-default');
        wpfigurePar.setAttribute('data-uk-lightbox', 'animation: slide');
    });
  });
document.addEventListener('DOMContentLoaded', function() {
  setCepInputPattern();
  replaceInputClasses();
});

function replaceInputClasses() {
    const forms = document.querySelectorAll('.acfe-form');
    const inputClassMap = {
        radio: ['uk-radio'],
        checkbox: ['uk-checkbox'],
        range: ['uk-range'],
        button: ['uk-button', 'uk-button-primary'],
        number: ['uk-input']
    };

    forms.forEach(form => {
        const fieldsetForm = form.querySelector('.acf-form-fields fieldset');
        fieldsetForm.classList.add('uk-grid-medium', 'uk-child-width-1-1');
        fieldsetForm.setAttribute('uk-grid', '');
        const inputs = form.querySelectorAll('input[type], textarea, select');
        inputs.forEach(input => {
            const inputType = input.type || 'text';
            const inputClasses = inputClassMap[inputType] || [];

            inputClasses.forEach(cls => {
                input.classList.add(cls);
            });

            if (inputType === 'radio' && input.closest('.acf-radio-list')) {
                input.closest('.acf-radio-list').classList.remove('uk-input');
                input.closest('.acf-radio-list').classList.add('uk-list');
                input.closest('.acf-radio-list').classList.remove('acf-radio-list');
            } else if (inputType === 'checkbox' || inputType === 'range') {
                input.classList.remove('uk-input');
            } else if (inputType === 'select') {
                input.classList.add('uk-select');
                input.classList.remove('uk-input');
            } else if (inputType === 'textarea') {
                input.classList.add('uk-textarea');
                input.classList.remove('uk-input');
            } else if (inputType === 'text' && input.id === 'acf-field_64011df40b043') {
                input.maxLength = 9;
                input.setAttribute('pattern', '[0-9]{5}-[0-9]{3}');
                input.setAttribute('title', 'Informe um CEP válido no formato 00000-000');
                input.addEventListener('input', e => {
                    const val = e.target.value;
                    const cleanVal = val.replace(/\D/g, '');
                    const formattedVal = cleanVal.replace(/(\d{5})(\d{3})/, '$1-$2');
                    e.target.value = formattedVal;
                });
            } else if (inputType === 'text' && input.id === 'acf-field_6400de8be2e30') {
                input.maxLength = 16;
                input.setAttribute('pattern', '\\([0-9]{2}\\) 9 [0-9]{4}-[0-9]{4}');
                input.setAttribute('title', 'Informe seu número do WhatsApp');
                input.addEventListener('input', e => {
                    const val = e.target.value;
                    const cleanVal = val.replace(/\D/g, '');
                    const formattedVal = cleanVal.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
                    e.target.value = formattedVal;
                });
            }
        });
    });
}

function setCepInputPattern() {
  var cepInput = document.querySelector('#io_cep_valida .acf-input-wrap input[type="text"]');
  cepInput.setAttribute('maxlength', '9');
  cepInput.setAttribute('pattern', '[0-9]{5}-[0-9]{3}');
  cepInput.setAttribute('title', 'Informe um CEP válido no formato 00000-000');
  cepInput.addEventListener('input', function() {
    var value = this.value.replace(/\D/g, '');
    value = value.substring(0, 5) + '-' + value.substring(5);
    this.value = value.substring(0, 9);
  });
};

document.addEventListener('DOMContentLoaded', function() {
  const cepInput = document.getElementById('acf-field_64011df40b043');
  const logradouroInput = document.getElementById('acf-field_6400de50e2e2e');
  const bairroInput = document.getElementById('acf-field_64033fcb2b9c6');
  const cidadeInput = document.getElementById('acf-field_64033671474b6');
  const ufSelect = document.getElementById('acf-field_640325ceb1d27');
  const cepAlert = document.getElementById('io_cform_cep_error');
  const errorTxt = document.getElementById('cep_error_text');

  cepInput.setAttribute('maxlength', '9');
  cepInput.setAttribute('title', 'Informe um CEP válido no formato 00000-000');
  cepInput.addEventListener('input', function() {
    var value = this.value.replace(/\D/g, '');
    value = value.substring(0, 5) + '-' + value.substring(5);
    this.value = value.substring(0, 9);
  });
  cepInput.addEventListener('change', function() {
    this.setAttribute('pattern', '[0-9]{5}-[0-9]{3}');
  });
  cepInput.addEventListener('input', () => {
    if (cepInput.value.length === 8) {
      getAddress();
    } else {
      clearAddressFields();
    }
  });

  function getAddress() {
    const cep = cepInput.value.replace(/\D/g, '');
    const xhr = new XMLHttpRequest();
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    xhr.open('GET', url);
    xhr.onload = function() {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (!data.erro) {
          logradouroInput.value = data.logradouro;
          bairroInput.value = data.bairro;
          cidadeInput.value = data.localidade;
          ufSelect.value = data.uf;
          errorTxt.textContent = '';
        } else {
          clearAddressFields();
          errorTxt.textContent = 'CEP não encontrado.';
          cepAlert.classList.add('uk-alert-warning'); 
          cepAlert.classList.remove('uk-alert-danger', 'uk-hidden');
          cepAlert.setAttribute('uk-alert', '');
        }
      } else {
        console.error(xhr.statusText);
        clearAddressFields();
        errorTxt.textContent = 'Ocorreu um erro ao buscar o endereço.';
        cepAlert.classList.remove('uk-hidden');
        cepAlert.setAttribute('uk-alert', '');
      }
    };
    xhr.onerror = function() {
      console.error(xhr.statusText);
      clearAddressFields();
      errorTxt.textContent = 'Ocorreu um erro ao buscar o endereço.';
      cepAlert.classList.remove('uk-hidden');
      cepAlert.setAttribute('uk-alert', '');
    };
    xhr.send();
  }

  function clearAddressFields() {
    logradouroInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    ufSelect.value = '';
    errorTxt.textContent = '';
    cepAlert.classList.add('uk-hidden'); 
  }
});



UIkit.icon.add('review', '<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 96 960 960" width="18" fill="currentColor"><path d="M405 656h315v-60H465l-60 60Zm-165 0h79l252-249q6-6 6-15t-6-15l-55-50q-5-5-12.5-5t-12.5 5L240 582v74ZM80 976V236q0-23 18-41.5t42-18.5h680q23 0 41.5 18.5T880 236v520q0 23-18.5 41.5T820 816H240L80 976Zm60-145 75-75h605V236H140v595Zm0-595v595-595Z"/></svg>');
UIkit.icon.add('calc', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 14 20" fill="none"><path stroke="currentColor" d="m.5,6.43v11.07h13V.5H.5v3.65h10.89m-7.13,11.41h-1.75v-1.75h1.75v1.75Zm0-3.38h-1.75v-1.75h1.75v1.75Zm0-3.48h-1.75v-1.75h1.75v1.75Zm3.62,6.86h-1.75v-1.75h1.75v1.75Zm0-3.38h-1.75v-1.75h1.75v1.75Zm0-3.48h-1.75v-1.75h1.75v1.75Zm3.62,6.86h-1.75v-5.13h1.75v5.13Zm0-6.86h-1.75v-1.75h1.75v1.75Z"/></svg>');
UIkit.icon.add('tools', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 21 21" style="enable-background:new 0 0 16 16;" xml:space="preserve"><g><path d="M10.5,6.1C10.2,6.3,10,6.6,9.7,6.9L4.2,1.4c-0.5-0.5-1.5-0.5-2,0L1.4,2.2C1.1,2.5,1,2.8,1,3.2s0.1,0.7,0.4,1l5.7,5.7   l-5.7,6.3c-0.3,0.3-0.4,0.6-0.4,1c0,0.4,0.1,0.7,0.4,1l0.4,0.4c0.6,0.5,1.3,0.5,2,0l5.7-6.4l0.4,0.4c0.2,0.2,0.5,0.2,0.7,0l0.3-0.3   l5,5l0.9,1.3c0.1,0.1,0.2,0.2,0.3,0.2l1.4,0.2l0.1,0c0.1,0,0.2,0,0.2-0.1l0.1-0.1c0.1-0.1,0.1-0.2,0.1-0.4L18.8,17   c0-0.2-0.1-0.3-0.2-0.4l-1.3-0.9l-5-5l0.3-0.3c0.1-0.1,0.1-0.2,0.1-0.3s0-0.2-0.1-0.3L12,9.3l0.6-0.6c0.2,0.1,0.4,0.2,0.6,0.2   c0.4,0.1,0.6,0,0.7,0.1c-0.1,0.1-0.1,0.2-0.1,0.4c0,0.2,0.1,0.4,0.2,0.6l1,1c0.2,0.2,0.5,0.3,0.8,0.3c0.3,0,0.6-0.1,0.8-0.4   l2.1-2.1C18.8,8.6,19,8.3,19,8c0-0.3-0.1-0.5-0.3-0.8l-1-1C17.4,6,16.9,6,16.7,6.1c-0.1-0.1-0.1-0.1-0.1-0.2c0-0.1,0-0.3-0.1-0.5   c-0.1-0.5-0.3-0.9-0.6-1.3l-1.1-1.1c-0.6-0.6-0.9-0.9-1.8-1.3C11.4,1,9.6,1.1,7,2.3C6.8,2.4,6.7,2.6,6.7,2.9c0,0.2,0.2,0.4,0.5,0.4   h0.4c0.3,0,1-0.1,1.7,0.2c0.5,0.2,1,0.4,1.3,0.9C11,5.1,10.5,5.9,10.5,6.1z M11.8,8.1l-0.7,0.8c0,0-0.1,0-0.1,0.1l-1.9,2.2   c0,0-0.1,0.1-0.1,0.1l-5.9,6.6c-0.1,0.1-0.4,0.2-0.6,0l-0.4-0.4C2,17.4,2,17.3,2,17.2c0-0.1,0-0.2,0.2-0.3l8.7-9.8L11.8,8.1z    M14.7,8.3c-0.4-0.4-0.7-0.4-1-0.4c-0.1,0-0.2,0-0.3,0c-0.3,0-0.5-0.1-0.7-0.4l-1.1-1.1c0.6-0.9,0.5-2-0.2-2.7l0,0 c-0.6-0.6-1.2-1-1.7-1.2c1.2-0.3,2.2-0.2,3.2,0.3c0.7,0.3,0.9,0.5,1.5,1.1l1.1,1.1c0.2,0.2,0.3,0.5,0.4,0.7c0,0.1,0,0.2,0,0.3   c0,0.3,0,0.6,0.4,1c0.2,0.2,0.7,0.3,1,0.1L18,8c0,0,0,0,0,0.1s0,0,0,0.1l-2.1,2.1c0,0-0.1,0-0.1,0l-0.9-0.9C14.9,9.2,15,9,14.9,8.9   C14.9,8.7,14.8,8.4,14.7,8.3z M2,3.2C2,3.1,2,3,2.1,2.9l0.8-0.8C3.1,2,3.3,2,3.5,2.1L9,7.7L7.7,9.1L2.1,3.5h0C2,3.4,2,3.3,2,3.2z    M17.9,17.9l-0.6-0.1l-0.5-0.8l0.3-0.3l0.8,0.5L17.9,17.9z M11.7,11.5l4.6,4.7l-0.1,0.1l-4.6-4.7L11.7,11.5z M11.6,10.2l-1.4,1.4   l-0.1-0.1l1.3-1.4L11.6,10.2z"/><path d="M7.6,8.3c0.1,0.1,0.2,0.1,0.3,0.1s0.2,0,0.3-0.1c0.2-0.2,0.2-0.5,0-0.7l-5-5c-0.2-0.2-0.5-0.2-0.7,0   c-0.2,0.2-0.2,0.5,0,0.7L7.6,8.3z"/></g></svg>');
UIkit.icon.add('comb', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="3 3 18 18" fill="none"><path d="M10.5 7.5L12.5 10.5L10.5 13.5H7.5L5.5 10.5L7.5 7.5H10.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.5 4.5L17.5 7.5L15.5 10.5H12.5L10.5 7.5L12.5 4.5H15.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.5 16.5L17.5 19.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 4.5L7.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 16.5L11.5 18" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/><path d="M7.5 13.5L6.5 15" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/><path d="M5.5 10.5H4.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 13.5H20.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.5 10.5L17.5 13.5L15.5 16.5H12.5L10.5 13.5L12.5 10.5H15.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10.5" cy="19.5" r="0.5" fill="currentColor"/><circle cx="5.5" cy="16.5" r="0.5" fill="currentColor"/><circle cx="2.5" cy="10.5" r="0.5" fill="currentColor"/></svg>');
UIkit.icon.add('materials', '<svg id="Camada_1" data-name="Camada 1" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 20 20"><path d="m.5,4.28v4.72l10.39,3.78,6.61-3.78v-4.72L7.11.5.5,4.28Zm0,0l10.39,3.78,6.61-3.78" fill="none" stroke="#000" stroke-linejoin="round"/><path d="m.5,9v4.72l10.39,3.78,6.61-3.78v-4.72" fill="none" stroke="#000" stroke-linejoin="round"/></svg>');
UIkit.icon.add('book', '<svg viewBox="1.2 1 22 22" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>');
UIkit.icon.add('food', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-.30 -.5 20.50 20"><path d="m8.4,8.19l7.26,8.21c.3.34.27.93-.07,1.31h0c-.34.38-.87.42-1.17.08L6.04,8.38c-1.29.72-3.04.33-4.28-1.07C.26,5.63.07,3.11,1.35,1.69s3.52-1.21,5.01.48c1.27,1.42,1.59,3.44.9,4.89" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10"/><g><line x1="13.62" y1="4.98" x2="16.67" y2="1.65" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><line x1="14.64" y1="6.18" x2="17.7" y2="2.85" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="m12.53,8.43c.8.48,1.76.41,2.39-.27l3.79-4.1" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><g><path d="m15.62.5l-3.79,4.1c-.59.64-.71,1.64-.38,2.51h-.01s-.96,1.02-.96,1.02" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="m7.03,11.89l-4.38,4.74c-.31.34-.29.93.04,1.32s.87.43,1.18.09l4.39-4.77" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></g><path d="m11.8,9.57h0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></g></svg>');
UIkit.icon.add('degree', '<svg xmlns="http://www.w3.org/2000/svg" viewBox=".875 -.875 12 20"><path d="m11.23,12.08c0-1.67-1.36-3.02-3.02-3.02s-3.02,1.36-3.02,3.02c0,.7.24,1.37.69,1.91l-.9,3.08c-.06.2,0,.41.17.55.16.13.38.16.57.07l.75-.36.47.68c.1.14.26.23.43.23h.09c.2-.04.37-.19.42-.39l.39-1.47.39,1.47c.05.2.22.35.42.38h.09c.17,0,.33-.08.43-.22l.47-.68.75.35c.18.09.41.06.57-.08.16-.13.22-.35.17-.55l-.93-3.18c.39-.52.6-1.16.6-1.81Zm-4.08,4.4l-.08-.11c-.1-.15-.27-.23-.43-.23-.08,0-.15.02-.23.05l-.09.04.44-1.51c.25.13.51.24.79.3l-.39,1.46Zm1.06-2.41c-1.1,0-2-.89-2-2s.89-1.99,2-1.99,2,.89,2,1.99-.89,2-2,2Zm1.92,2.12c-.24-.11-.51-.04-.66.18l-.08.11-.4-1.49c.27-.07.53-.18.77-.33l.46,1.57-.1-.04Z"/><path d="m8.21,10.44c-.9,0-1.64.73-1.64,1.64s.73,1.64,1.64,1.64,1.64-.73,1.64-1.64-.73-1.64-1.64-1.64Zm0,2.22c-.32,0-.58-.26-.58-.58s.26-.58.58-.58.58.26.58.58-.26.58-.58.58Z"/><path d="m12.77,4.22L8.44,0H1.11C.5,0,0,.5,0,1.11v14.02c0,.31.12.6.34.82.21.21.51.33.81.33h2.99c.29,0,.53-.24.53-.53s-.24-.53-.53-.53H1.15s-.05-.01-.07-.03c-.02-.02-.03-.04-.03-.07V1.11s.02-.06.05-.06h6.81c0,.72,0,2.15-.02,3.28,0,.14.05.28.15.37.1.1.23.16.38.16h3.28v10.67c0,.29.24.55.53.55s.53-.25.53-.55V4.22Zm-3.8-.41c0-.87.01-1.52.01-1.99.56.56,1.29,1.29,1.99,1.99h-2Z"/></svg>');
UIkit.icon.add('medical', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.464 17.255" fill="none" stroke="currentColor" stroke-width="1.03"><path d="m18.515,5.245c0-3.18-2.38-4.73-4.74-4.73s-4.26,2-4.26,2h0S7.615.515,5.255.515.515,2.065.515,5.245c0,2.11,1.67,3.71,1.67,3.71l7.33,7.56,3.687-3.803" stroke-linecap="round"/><g><polyline points="7.455 8.079 10.612 8.079 12.27 5.716 14.463 10.423 15.961 8.07 20.464 8.07" stroke-linejoin="round"/><circle cx="7.455" cy="8.07" r=".445" /></g></svg>');




document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.page-id-2409') || 
        document.querySelector('.page-id-2419') || 
        document.querySelector('.page-id-2645') ||
        document.querySelector ('.page-id-2592')) {
        
        var link = document.createElement('link');
        link.rel = 'icon';
        link.href = 'https://www.institutoorigem.com.br/wp-content/uploads/2024/05/origem-composta-favicon.png';
        link.type = 'image/png';
        document.head.appendChild(link);
    }
});

 
       










document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.page-id-2409') || document.querySelector('.page-id-2419') || document.querySelector('.page-id-2645') || document.querySelector('.page-id-2592')) {
        var hamburger = document.querySelector('.header-section .hamburger-icon');
        var navMenu = document.querySelector('.header-section .nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function () {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }
    }
});


















document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.page-id-2409') || document.querySelector('.page-id-2419') || document.querySelector('.page-id-2645') || document.querySelector('.page-id-2592')) {
        var header = document.querySelector('.header-section');
        var lastScrollTop = 0;

        window.addEventListener('scroll', function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 100) { // Only start hiding after scrolling down 100px
                if (scrollTop > lastScrollTop) {
                    // Scrolling down
                    header.classList.add('hidden');
                } else {
                    // Scrolling up
                    header.classList.remove('hidden');
                }
            } else {
                // When at the very top, ensure header is visible
                header.classList.remove('hidden');
            }

            lastScrollTop = scrollTop;
        });
    }
});




