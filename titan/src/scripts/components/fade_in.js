let elementsArray = document.querySelectorAll('.animated')

// console.log(elementsArray)
window.addEventListener('scroll', fadeIn )

function fadeIn() {
    for (let i = 0; i < elementsArray.length; i++) {
        let elem = elementsArray[i]
        
        let distInView = elem.getBoundingClientRect().top - window.innerHeight
        
        if (distInView < 0) {
            elem.classList.add("start");
        }
    }
}

fadeIn()

