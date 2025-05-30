document.addEventListener("DOMContentLoaded", () => {
  const template = document.getElementById("dropdown-template");

  document.querySelectorAll(".dropdown-wrapper select").forEach(select => {
    const wrapper = select.closest(".dropdown-wrapper");
    const dropdownFrag = template.content.cloneNode(true);
    wrapper.appendChild(dropdownFrag);

    const dropdownEl = wrapper.querySelector(".dropdown");
    const panelEl = dropdownEl.querySelector(".dropdown_panel");
    const valueEl = dropdownEl.querySelector(".dropdown_value");
    const arrowEl = dropdownEl.querySelector(".dropdown_arrow");

    const options = [...select.options];
    const itemsContainer = document.createElement("ul");
    itemsContainer.className = "dropdown_items";
    panelEl.appendChild(itemsContainer);

    let selectedIndex = options.findIndex(opt => opt.selected);
    if (selectedIndex === -1) selectedIndex = 0;

    options.forEach((opt, i) => {
      const div = document.createElement("li");
      div.className = "dropdown_item";
      div.setAttribute("role", "option");
      div.setAttribute("tabindex", "-1");
      div.setAttribute("aria-selected", i === selectedIndex);
      div.dataset.value = opt.value;
      div.textContent = opt.textContent;

      div.addEventListener("mousedown", e => {
        e.preventDefault();
        selectOption(i);
        closeDropdown();
      });

      itemsContainer.appendChild(div);
    });

    const items = [...itemsContainer.querySelectorAll(".dropdown_item")];
    valueEl.textContent = options[selectedIndex].textContent;
    select.value = options[selectedIndex].value;
    dropdownEl.setAttribute("aria-expanded", "false");

    dropdownEl.addEventListener("click", e => {
      e.stopPropagation();
      toggleDropdown();
    });

    dropdownEl.addEventListener("keydown", e => {
      const open = dropdownEl.getAttribute("aria-expanded") === "true";

      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault();
          if (!open) {
            openDropdown();
          } else {
            selectOption(selectedIndex);
            closeDropdown();
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          selectedIndex = (selectedIndex + 1) % items.length;
          updateHighlight();
          break;

        case "ArrowUp":
          e.preventDefault();
          selectedIndex = (selectedIndex - 1 + items.length) % items.length;
          updateHighlight();
          break;

        case "Escape":
          closeDropdown();
          break;
      }
    });

    function selectOption(index) {
      const item = items[index];
      if (!item) return;
      valueEl.textContent = item.textContent;
      select.value = item.dataset.value;
      selectedIndex = index;
      updateHighlight();
    }

    function updateHighlight() {
      items.forEach((el, i) => {
        el.setAttribute("aria-selected", i === selectedIndex);
      });
      items[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }

    function openDropdown() {
      panelEl.style.display = "block";
      dropdownEl.setAttribute("aria-expanded", "true");
      updateHighlight();
    }

    function closeDropdown() {
      panelEl.style.display = "none";
      dropdownEl.setAttribute("aria-expanded", "false");
    }

    function toggleDropdown() {
      const open = dropdownEl.getAttribute("aria-expanded") === "true";
      open ? closeDropdown() : openDropdown();
    }

    let isHovering = false;
    
    dropdownEl.addEventListener("mouseenter", () => {
      isHovering = true;
    });
    
    dropdownEl.addEventListener("mouseleave", () => {
      isHovering = false;
    });
    
    // Handle blur via keyboard (tabbing out)
    dropdownEl.addEventListener("blur", () => {
      setTimeout(() => {
        if (!dropdownEl.contains(document.activeElement) && !isHovering) {
          closeDropdown();
        }
      }, 10);
    });

    document.addEventListener("mousedown", e => {
      if (!dropdownEl.contains(e.target)) {
        closeDropdown();
      }
    });

    wrapper.classList.add("dropdown-enhanced");
  });
});
