const copyLink = document.getElementById('copyLink')

let timerRef

if (copyLink) {
  
  copyLink.onclick = () => {
  
    navigator.clipboard.writeText(window.location.href)
    copyLink.classList.add('copied')
    
    const remove = () => {
      copyLink.classList.remove('copied')
    }
  
    clearInterval(timerRef)
  
    timerRef = setInterval(remove, 500)
  
  }

}
