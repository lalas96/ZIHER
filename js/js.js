
//FORM
$(document).ready(function () {
  const $loader = $("#loader").hide();
  const $messageContainer = $("#messageContainer");

  function applyValidation($form) {
    const fields = ['name', 'surname', 'email', 'telefon', 'message'];

    $form.validate({
      rules: fields.reduce((acc, field) => {
        acc[field] = { required: true };
        if (field === 'email') acc[field].email = true;
        return acc;
      }, {}),
      messages: fields.reduce((acc, field) => {
        acc[field] = `Please enter your ${field === 'telefon' ? 'phone number' : field}`;
        return acc;
      }, {})
    });

    $form.ajaxForm({
      dataType: 'json',
      beforeSubmit: function () {
        if (!$form.valid()) return false;
        $loader.show();
      },
      success: function () {
        showMessage("Message sent successfully!", "success");
      },
      error: function () {
        showMessage("Mail failed, try again", "danger");
      }
    });
  }

  function showMessage(message, type) {
    $loader.hide();
    $messageContainer
      .removeClass("alert-success alert-danger")
      .addClass(`alert-${type}`)
      .text(message)
      .show();
    setTimeout(() => $messageContainer.hide(), 3000);
  }

  // Only target the form inside the #kontakt section
  const $kontaktForm = $("#kontakt .form");
  if ($kontaktForm.length) {
    applyValidation($kontaktForm);
    $.data($kontaktForm[0], "validated", true);
  }
});

//FORM
//error alert for search
function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);
  setTimeout(() => alertEl.remove(), 3000);
  }
  function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

    // ACCORDION FUNCTION
    let accordions = document.querySelectorAll('.accordion-wrapper .accordion');
    accordions.forEach((acco) => {
        acco.addEventListener('click', () => {
            acco.classList.toggle('active');
            let content = acco.nextElementSibling;
            if (content) {
                if (acco.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + "px";
                } else {
                    content.style.maxHeight = null;
                }
            }
            accordions.forEach((otherAcco) => {
                if (otherAcco !== acco && otherAcco.classList.contains('active')) {
                    otherAcco.classList.remove('active');
                    let otherContent = otherAcco.nextElementSibling;
                    if (otherContent) {
                        otherContent.style.maxHeight = null;
                    }
                }
            });
        });
    });
