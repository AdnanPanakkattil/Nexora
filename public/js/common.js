$(document).ready(function() {
});


function showToast(id, message, duration) {
    var toastElement = $(id);
    toastElement.find('span').text(message);
    toastElement.addClass('show');
    setTimeout(function () {
        toastElement.removeClass('show');
    }, duration);
  }

function toggleLoader(type, show = true, callback = null) {
    const map = {
        page: "#loader-overlay",
        policy: "#loader-policy",
        update: "#loader-update",
        district: "#loader-district",
        "invoice-page": "#loader-invoice-page",
        "invoice-save": "#loader-invoice-save",
        "invoice-branch": "#loader-invoice-branch",
        "invoice-apply-all": "#loader-invoice-apply-all",
        "invoice-reload": "#loader-invoice-reload",
        "invoice-remove-bg": "#loader-invoice-remove-bg"
    };

    if (!map[type]) return;
    
    const $element = $(map[type]);
    
    if (show) {
        $element.fadeIn(200);
    } else {
        $element.fadeOut(200, function() {
            if (callback && typeof callback === 'function') {
                callback();
            }
        });
    }
}

function validateIqama() {
  const $id = $("#idNational"),
        type = $("#idNationalType").val(),
        value = $id.val().replace(/\D/g, '');

  $id.val(value);
  $(".error_iqama").text("");

  if (type !== "iqama" || !value) return true;

  return value.startsWith("2") && value.length === 10
    ? true
    : ($(".error_iqama").text(
         !value.startsWith("2")
           ? "Iqama must start with 2"
           : "Iqama must be 10 digits"
       ), false);
} 

(function () {
  'use strict';

  const LATIN_ALLOWED  = /[^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\x20\-'.]/g;
  const ARABIC_ALLOWED = /[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\u0640\x20\-]/g;
  const INVISIBLE_CHARS = /[\u200B-\u200D\uFEFF\u00AD]/g;

  function filterInput($el, regex) {

    let value = $el.val().replace(INVISIBLE_CHARS, '');

    const filtered = value.replace(regex, '');

    //  Only update DOM if something changed (avoids cursor jump)
    if ($el.val() !== filtered) {
      const pos = $el[0].selectionStart - ($el.val().length - filtered.length);
      $el.val(filtered);

      // Restore cursor position after filtering
      $el[0].setSelectionRange(pos, pos);
    }
  }

  $(document).on('input', '.latin-only', function () {
    filterInput($(this), LATIN_ALLOWED);
  });

  $(document).on('input', '.arabic-only', function () {
    filterInput($(this), ARABIC_ALLOWED);
  });

})();

/**
 * Enforces a numeric range and strips invalid characters on a given input selector.
 * @param {string} selector - The jQuery selector for the input(s).
 * @param {number} min - The minimum allowed value.
 * @param {number} max - The maximum allowed value.
 */
function enforceNumericRange(selector, min, max) {
    $(document).on("keypress", selector, function (e) {
        if (String.fromCharCode(e.keyCode || e.which).match(/[^0-9]/g)) {
            e.preventDefault();
        }
    });

    $(document).on("input", selector, function () {
        if (this.validity && this.validity.badInput) {
            this.value = "";
            return;
        }
        var val = this.value;
        if (val !== "") {
            val = val.replace(/[^0-9]/g, "");
            if (val === "") {
                this.value = "";
                return;
            }
            var num = parseInt(val, 10);
            if (num > max) num = max;
            if (num < min) num = min;
            this.value = num;
        }
    });
}