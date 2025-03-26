
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
      beforeSubmit: function (formData, jqForm) {
        if (!$form.valid()) return false;
        $loader.show();
        formData.push({ name: "property_id", value: jqForm.find("input[name='property_id']").val() });
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
    $messageContainer.removeClass("alert-success alert-danger")
      .addClass(`alert-${type}`).text(message).show();
    setTimeout(() => $messageContainer.hide(), 3000);
  }

  // Apply validation to existing forms
  $(".form").each(function () {
    applyValidation($(this));
  });

  // Watch for dynamically added forms
  $(document).on("DOMNodeInserted", "#nekretnina-details", function () {
    setTimeout(function () {
      $("#nekretnina-details .form").each(function () {
        if (!$.data(this, "validated")) {
          applyValidation($(this));
          $.data(this, "validated", true);
        }
      });
    }, 500);
  });
});

  // Apply validation to existing forms
  $(".form").each(function () {
    applyValidation($(this));
  });
  // Watch for dynamically added forms
  $(document).on("DOMNodeInserted", "#nekretnina-details", function () {
    setTimeout(function () {
      $("#nekretnina-details .form").each(function () {
        if (!$.data(this, "validated")) {
          applyValidation($(this));
          $.data(this, "validated", true); // Prevent duplicate validation
        }
      });
    }, 500);
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
//navbar scroll koji ne radi
/*   document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded!");
    
    const navbar = document.getElementById("navbar");
    if (!navbar) {
    console.error("Navbar element not found.");
    return;
    }
    let prevScrollPos = window.pageYOffset; 
    window.addEventListener("scroll", () => {
    const currentScrollPos = window.pageYOffset; 
    if (Math.abs(currentScrollPos - prevScrollPos) > 50) {
    if (prevScrollPos > currentScrollPos) {
    navbar.classList.remove("hidden"); 
    } else {
    navbar.classList.add("hidden"); 
    }
    prevScrollPos = currentScrollPos; 
    }
    });
    }); */

    const left = document.querySelector(".left");
    const right = document.querySelector(".right");
    const container = document.querySelector(".container");
    
    left.addEventListener("mouseenter", () => {
      container.classList.add("hover-left");
    });
    
    left.addEventListener("mouseleave", () => {
      container.classList.remove("hover-left");
    });
    
    right.addEventListener("mouseenter", () => {
      container.classList.add("hover-right");
    });
    
    right.addEventListener("mouseleave", () => {
      container.classList.remove("hover-right");
    });


