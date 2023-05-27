const xhr = new XMLHttpRequest();
const apiURL = 'https://api.pearktrue.cn/api/gpt/continuous.php?';
const chatBox = document.querySelector('.chat-box');

let golbalId;
// 获取id
function getId(callback) {
  const url = apiURL + 'type=get';
  xhr.open('GET', url, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.code === 200) {
        golbalId = response.id;
        callback(response.id);
      } else {
        setTimeout(getId, 1000); // 等待 1 秒后重新发送请求
      }
    }
  };
  xhr.send();
}

getId(function (id) {
  console.log(id);
  console.log(golbalId);
});

// 获取回复的内容并添加进会话
function getcontent(message, id) {
  var chatBox = document.querySelector('.chat-box');
  url = apiURL + 'id=' + id + '&message=' + message;
  xhr.open('GET', url, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const answer = response.answer;
      addMessage('AI', answer);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };
  xhr.send();
}

// 添加会话
function addMessage(user, text) {
  const message = document.createElement('div');
  message.classList.add('message');
  message.innerHTML = `
    <p class="user">${user}:</p>
    <p class="text">${text}</p>
  `;
  chatBox.appendChild(message);
}

// 获取聊天框内容，将其添加进会话
function sendMessage() {
  var message = document.getElementById("input-type").value;
  var chatBox = document.querySelector('.chat-box');
  addMessage('User', message);
  document.getElementById("input-type").value = "";
  getcontent(message, golbalId);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function Enterkey(event){
  event = event || window.event;
  if(event.keyCode == 13){
    sendMessage()
  }
}