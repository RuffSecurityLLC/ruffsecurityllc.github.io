"use strict";

/**
* PHP Email Form Validation - v3.7
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  var forms = document.querySelectorAll('.php-email-form');
  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();
      var thisForm = this;
      var action = thisForm.getAttribute('action');
      var recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');
      var formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha.execute(recaptcha, {
                action: 'php_email_form_submit'
              }).then(function (token) {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              });
            } catch (error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!');
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(function (response) {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error("".concat(response.status, " ").concat(response.statusText, " ").concat(response.url));
      }
    }).then(function (data) {
      thisForm.querySelector('.loading').classList.remove('d-block'); // if (data.trim() == 'OK') { // @todo See note below.

      thisForm.querySelector('.sent-message').classList.add('d-block');
      thisForm.reset(); // } else { // @todo When using formspree.io this throws an error every time, even when it works.
      //   throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
      // }
    })["catch"](function (error) {
      displayError(thisForm, error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }
})();