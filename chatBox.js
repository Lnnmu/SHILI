const xhr = new XMLHttpRequest();
const apiURL = 'https://api.pearktrue.cn/api/gpt/continuous.php?';
const chatBox = document.querySelector('.chat-box');
const main_box = document.getElementById('main');
let golbalId;

// 获取id
function getId(callback) {
  const url = apiURL + 'type=get';
  xhr.open('GET', url, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.code === 200) {
        // 这里使用了赋值给全局变量，又使用回调函数拿走id
        golbalId = response.id;
        callback(response.id);
      }
    }
  };
  xhr.send();
  // 判断是否成功get到Id，如果没有就提示用户刷新网页
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 500) {
      main_box.style.backgroundColor='red';
      addMessage('error','请求过于频繁，请刷新网页重试');
    }
  };
}

// 主要是执行getId函数
getId(function (id) {
  console.log(id);
  console.log(golbalId);
  main_box.style.backgroundColor='green';
});

// 获取回复的内容并添加进会话
function getcontent(message, id) {
  var chatBox = document.querySelector('.chat-box');
  url = apiURL + 'id=' + id + '&message=' + message;
  xhr.open('GET', url, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      // console.log(response.answer);
      addMessage('AI', response.answer);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };
  xhr.send();
}

// 添加会话
function addMessage(user, text) {
  const message = document.createElement('div');
  message.classList.add('message');
  text = text.replace(/</g, "&lt;");
  text = text.replace(/>/g, "&gt;");
  text = text.replace(/\n/g, "<br>");
  text = text.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  // console.log(text);
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
  if(message.trim() === ""){
    return;
  }
  addMessage('User', message);
  document.getElementById("input-type").value = "";
  getcontent(message, golbalId);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 捕捉用户的回车，如果在输入框中回车则执行操作
function Enterkey(event) {
  event = event || window.event;
  if (event.keyCode == 13) {
    sendMessage()
  }
}