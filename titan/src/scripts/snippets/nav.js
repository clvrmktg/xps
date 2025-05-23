window.addEventListener('resize', function() {
  if (window.matchMedia('(min-width: 1025px)').matches) {
      document.getElementById('click').checked = false;
  }
}, true);