"use strict";

(function () {


    const validateUserInfo = function (username) {
        let errors = {};
        let length = 0;
        if (username === '') {
            errors['txt-user-name'] ??= [];
            errors['txt-user-name'].push('Obligatorio');
            length++;
        }
        return { details: errors, length }
    }

    const writeErrors = function (errors) 
    {
        let fullErrors = Object.keys(errors);
        fullErrors.forEach(fieldId => {
            document.querySelector(`label[for="${fieldId}"]`).querySelector('small.error-detail').innerText = errors[fieldId].join(', ');
        });
        setTimeout(() => {
            document.querySelectorAll('small.error-detail').forEach(small => {
                small.innerText = '';
            });
        }, fullErrors.length * 3000);
    }


    document.getElementById('btn-join-to-chat').addEventListener('click', () => {
        let username = document.getElementById('txt-user-name').value.trim();
        const errors = validateUserInfo(username);
        if (errors.length > 0) {
            writeErrors(errors.details);
            return;
        }
        PM.setUser(username);
    });
})();