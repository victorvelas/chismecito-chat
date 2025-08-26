"use strict";

const PM = (function () {

    let permissions = null;
    
    Notification.requestPermission().then(p => { permissions = p; });

    let userName = '';
    const socket = io();
    const form = document.getElementById("frm-chat");
    const input = form.querySelector("input[type='text']");
    let imagesToSend = [];

    const addMessageToChat = (context) => {
        const docMSG = `<div class="message ${context.user === userName ? 'sent' : 'received'}">
            <div>
                <small class="chat-content-user">${context.user}</small>
            </div>
            ${context.msg.map(msg => {
                if (msg.type === 'text') {
                    return `<p>${msg.content}</p>`
                }
                if (msg.type === 'image') {
                    return `<a href="${msg.content}" target="_blank">
                        <img src="${msg.content}" class="img-on-message" />
                    </a>`
                }
                return '';
            }).join(' ')}
            
        </div>`
        document.getElementById('messages-box').insertAdjacentHTML('beforeend', docMSG)
        document.getElementById('messages-box').scrollTop = document.getElementById('messages-box').scrollHeight;

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

    socket.on('chat message', (context) => {
        addMessageToChat(context);
    });
    socket.on('new user', (uname) => {
        try {
            if (permissions !== 'granted') { return; }
            new Notification(`El usaurio "${uname}" se ha unido al chat`);
        } catch (error) {
            console.log(error);
        }
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
        socket.emit("chat message", ({
            user: userName,
            messages
        }));
        resetForm();
    });

    return {
        setUser: function ($userName) {
            userName = $userName;
            socket.emit("new user", $userName);
            document.querySelector('.modal').classList.add('closed');
        },
        openImg: function (img) {
            window.open(img.src, '_blank').focus();
        }
    };
})();

