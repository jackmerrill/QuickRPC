// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.



document.querySelector('#submit').addEventListener('click', function() {
  var formData = {
    clientid: document.getElementById('rpid').value,
    state: document.getElementById('state').value,
    details: document.getElementById('details').value,
    startTimestamp: Number(new Date(document.getElementById('sdate').value).getTime() / 1000),
    endTimestamp: Number(new Date(document.getElementById('edate').value).getTime() / 1000),
    largeImageKey: document.getElementById('lgimgkey').value,
    smallImageKey: document.getElementById('smimgkey').value,
    partySize: Number(document.getElementById('psize').value),
    partyMax: Number(document.getElementById('psizem').value),
    dataID: 1
  }
  console.log(formData)
  let ipcRenderer = require('electron').ipcRenderer;
  ipcRenderer.send('submitForm', formData);
});
// Determines if the input ClientID is valid
document.querySelector('#rpid').addEventListener('change', checkLength);
function checkLength(){
  var length = this.value.length;
  console.log(length);
  if(length >= 17 && length <= 20){
    document.getElementById("IDCheck").style.display= 'none';
  } else{
    document.getElementById("IDCheck").style.display= 'block';
  }
}
