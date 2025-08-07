"use strict";

const PM = (function () {


    const socket = io();
    const form = document.getElementById("frm-chat");
    const input = form.querySelector("input[type='text']");
    let imagesToSend = [];

    const addMessageToChat = (msgs) => {
        const docMSG = `<div class="message received">
            ${msgs.map(msg => {
                if (msg.type === 'text') {
                    return `<p>${msg.content}</p>`
                }
                if (msg.type === 'image') {
                    return `<a href="${msg.content}" target="_blank">
                        <img src="${msg.content}" />
                    </a>`
                }
                return '';
            }).join(' ')}
            
        </div>`
        document.getElementById('messages-box').insertAdjacentHTML('beforeend', docMSG)
    };

    const resetForm = () => {
        input.value = '';
        if (imagesToSend.length > 0) {
            document.getElementById('previewContainer').innerHTML = '';
            document.getElementById('previewContainer').style.display = 'none';
            imagesToSend.splice(0, imagesToSend.length);
        }
    };
    

    


    input.addEventListener('paste', (event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (const item of items) {
            if (item.type.indexOf('image') === 0) {
                const blob = item.getAsFile();
                let clon = document.importNode(document.getElementById('template-preview').content, true);
                clon.querySelector('img').src = URL.createObjectURL(blob);
                document.getElementById('previewContainer').style.display = 'block';
                document.getElementById('previewContainer').appendChild(clon);
                imagesToSend.push(blob);
            }
        }
    });

    socket.on('chat message', (msg) => {
        addMessageToChat(msg);
    });

    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const messages = [];
        if (input.value.trim() !== '') {
            messages.push({
                type: 'text',
                metadata: null,
                content : input.value.trim()
            });
        }

        if (imagesToSend.length > 0) {
            imagesToSend.forEach((imageToSend) => {
                messages.push({
                    type: 'image',
                    metadata: {
                        contentType: imageToSend.type
                    },
                    content: imageToSend
                });
            });
        }
        if (messages.length === 0) { return; }
        socket.emit("chat message", (messages));
        resetForm();
    });

    return {
        openImg: function (img) {
            window.open(img.src, '_blank').focus();
        }
    };
})();

