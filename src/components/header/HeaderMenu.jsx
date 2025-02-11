import { useEffect } from "react";

export default function HeaderMenu() {
  useEffect(() => {
    const header = document.getElementById("header");
    const logo = document.getElementById("logo");
    const menuLogo = document.getElementById("menuLogo");
    const logoContainers = document.querySelectorAll(".logo-container");
    const menuToggle = document.getElementById("menuToggle");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const menuPanel = dropdownMenu.querySelector(".menu-panel");
    const closeMenu = document.getElementById("closeMenu");

    if (
      !header ||
      !logo ||
      !menuLogo ||
      logoContainers.length === 0 ||
      !menuToggle ||
      !dropdownMenu ||
      !menuPanel ||
      !closeMenu
    ) {
      console.warn("Uno o más elementos del menú no fueron encontrados en el DOM.");
      return;
    }

    // Función para actualizar estilos en función del scroll
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled-header");
        logoContainers.forEach(el => {
          el.classList.add("scrolled-logo", "bg-white", "shadow-md", "p-2", "rounded-lg");
        });
        logo.src = "/images/logo-san-isidro-2.svg";
        menuLogo.src = "/images/logo-san-isidro-2.svg";
      } else {
        // Si el menú está cerrado, restauramos estilos
        if (dropdownMenu.classList.contains("hidden")) {
          header.classList.remove("scrolled-header");
          logoContainers.forEach(el => {
            el.classList.remove("scrolled-logo", "bg-white", "shadow-md", "p-2", "rounded-lg");
          });
          logo.src = "/images/logo-san-isidro.svg";
          menuLogo.src = "/images/logo-san-isidro.svg";
        }
      }
    };

    // Función para abrir el menú
    const openMenu = () => {
      // Ocultar el header para que el menú lo reemplace
      header.classList.add("hidden");

      // Mostrar el menú desplegable
      dropdownMenu.classList.remove("hidden");
      // Forzar reflow para activar la transición
      void menuPanel.offsetWidth;
      menuPanel.classList.remove("-translate-y-full");

      // Aplicar estilos del logo (igual que al hacer scroll)
      header.classList.add("scrolled-header");
      logoContainers.forEach(el => {
        el.classList.add("scrolled-logo", "bg-white", "shadow-md", "p-2", "rounded-lg");
      });
      logo.src = "/images/logo-san-isidro-2.svg";
      menuLogo.src = "/images/logo-san-isidro-2.svg";
    };

    // Función para cerrar el menú
    const closeDropdown = () => {
      menuPanel.classList.add("-translate-y-full");
      setTimeout(() => {
        dropdownMenu.classList.add("hidden");
        // Volver a mostrar el header
        header.classList.remove("hidden");
        // Restaurar estilos del logo si el scroll es menor a 50
        if (window.scrollY < 50) {
          header.classList.remove("scrolled-header");
          logoContainers.forEach(el => {
            el.classList.remove("scrolled-logo", "bg-white", "shadow-md", "p-2", "rounded-lg");
          });
          logo.src = "/images/logo-san-isidro.svg";
          menuLogo.src = "/images/logo-san-isidro.svg";
        }
      }, 300); // Tiempo que coincide con la transición CSS
    };

    menuToggle.addEventListener("click", openMenu);
    closeMenu.addEventListener("click", closeDropdown);
    window.addEventListener("scroll", handleScroll);

    // Opcional: cerrar el menú si se hace clic fuera del panel
    dropdownMenu.addEventListener("click", (e) => {
      if (e.target === dropdownMenu) {
        closeDropdown();
      }
    });

    return () => {
      menuToggle.removeEventListener("click", openMenu);
      closeMenu.removeEventListener("click", closeDropdown);
      window.removeEventListener("scroll", handleScroll);
      dropdownMenu.removeEventListener("click", closeDropdown);
    };
  }, []);

  return null;
}
