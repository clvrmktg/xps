// Select all <template> elements with the data-obscure attribute
document.querySelectorAll("template[data-obscure]").forEach((template) => {
  // Clone the contents of the <template> (this creates a document fragment)
  const clone = template.content.cloneNode(true);

  // Loop through all data attributes on the <template> (e.g., data-p1, data-p2)
  Object.entries(template.dataset).forEach(([key, value]) => {
    // Create a token to replace (e.g., "p1" becomes "%1")
    const token = `%${key.replace(/^p/, '')}`;

    // Loop through all elements in the cloned content
    clone.querySelectorAll("*").forEach((node) => {
      // Make sure we're working with element nodes (e.g., <a>)
      if (node.nodeType === 1) {

        // If the element has an "href" attribute (like <a href="mailto:%1@%2">)
        if (node.hasAttribute("href")) {
          // Replace all instances of the token in the href
          const newHref = node.getAttribute("href").replaceAll(token, value);
          node.setAttribute("href", newHref);
        }

        // Replace token in the element's visible text, if it contains the token
        if (node.textContent.includes(token)) {
          node.textContent = node.textContent.replaceAll(token, value);
        }
      }
    });
  });

  // Replace the original <template> in the DOM with the processed content
  template.replaceWith(clone);
});

