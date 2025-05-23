let newNode;
  document.querySelectorAll('[obscure]').forEach(elem => {

      newNode = document.createElement('span');
      newNode.innerHTML = elem.innerHTML;
      elem.classList ? newNode.classList = elem.classList : false;
      elem.id ? newNode.id = elem.id : false;

      for (let prop in elem.dataset) {
          newNode.innerHTML = newNode.innerHTML.replaceAll('%' + prop.replace('p', ''), elem.dataset[prop]);
      }

      elem.parentNode.insertBefore(newNode, elem);
      elem.remove();
  });
