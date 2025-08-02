"use strict";

(function () {


    const socket = io();

    const addMessageToChat = (msg) => {
        const docMSG = `<div class="message received">
            <p>${msg}</p>
        </div>`
        document.getElementById('messages-box').insertAdjacentHTML('beforeend', docMSG)
    };
    
    const form = document.getElementById("frm-chat");
    const input = form.querySelector("input[type='text']");

    socket.on('chat message', (msg) => {
        addMessageToChat(msg);
    });

    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        if (input.value.trim() !== '') {
            socket.emit("chat message", input.value.trim());
            input.value = '';
        }
    });

})();

