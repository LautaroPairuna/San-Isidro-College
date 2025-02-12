import { useEffect } from "react";

const HeaderMenu: React.FC = () => {
  useEffect(() => {
    // Obtener elementos del DOM con las conversiones de tipo necesarias
    const header = document.getElementById("header") as HTMLElement | null;
    const logo = document.getElementById("logo") as HTMLImageElement | null;
    const menuLogo = document.getElementById("menuLogo") as HTMLImageElement | null;
    const logoContainers = document.querySelectorAll(".logo-container");
    const menuToggle = document.getElementById("menuToggle") as HTMLElement | null;
    const dropdownMenu = document.getElementById("dropdownMenu") as HTMLElement | null;
    const menuPanel = dropdownMenu?.querySelector(".menu-panel") as HTMLDivElement | null;
    const closeMenu = document.getElementById("closeMenu") as HTMLElement | null;
    const overlay = document.getElementById("overlay") as HTMLElement | null;

    if (
      !header ||
      !logo ||
      !menuLogo ||
      logoContainers.length === 0 ||
      !menuToggle ||
      !dropdownMenu ||
      !menuPanel ||
      !closeMenu ||
      !overlay
    ) {
      console.warn("Uno o más elementos del menú no fueron encontrados en el DOM.");
      return;
    }

    // Función para actualizar estilos en función del scroll
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled-header");
        logoContainers.forEach((el) => {
          el.classList.add("scrolled-logo", "bg-white", "shadow-md", "p-2", "rounded-lg");
        });
        logo.src = "/images/logo-san-isidro-2.svg";
        menuLogo.src = "/images/logo-san-isidro-2.svg";
      } else {
        // Si el menú está cerrado, restauramos estilos
        if (dropdownMenu.classList.contains("hidden")) {
          header.classList.remove("scrolled-header");
          logoContainers.forEach((el) => {
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
      dropdownMenu.classList.remove("hidden");
      // Activar el overlay
      overlay.classList.remove("hidden");
      // Forzar reflow para activar la transición
      void menuPanel.offsetWidth;
      menuPanel.classList.remove("-translate-y-full");

      // Aplicar estilos del logo (similar al efecto de scroll)
      header.classList.add("scrolled-header");
      logoContainers.forEach((el) => {
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
        header.classList.remove("hidden");
        // Desactivar el overlay
        overlay.classList.add("hidden");
        // Restaurar estilos si el scroll es menor a 50
        if (window.scrollY < 50) {
          header.classList.remove("scrolled-header");
          logoContainers.forEach((el) => {
            el.classList.remove("scrolled-logo", "bg-white", "shadow-md", "p-2", "rounded-lg");
          });
          logo.src = "/images/logo-san-isidro.svg";
          menuLogo.src = "/images/logo-san-isidro.svg";
        }
      }, 300); // Tiempo que coincide con la transición CSS
    };

    // Función para cerrar el menú si se hace clic fuera del panel
    const handleDropdownClick = (e: Event) => {
      if (e.target === dropdownMenu) {
        closeDropdown();
      }
    };

    // Asignar los event listeners
    menuToggle.addEventListener("click", openMenu);
    closeMenu.addEventListener("click", closeDropdown);
    window.addEventListener("scroll", handleScroll);
    dropdownMenu.addEventListener("click", handleDropdownClick);

    // Limpieza de los event listeners al desmontar el componente
    return () => {
      menuToggle.removeEventListener("click", openMenu);
      closeMenu.removeEventListener("click", closeDropdown);
      window.removeEventListener("scroll", handleScroll);
      dropdownMenu.removeEventListener("click", handleDropdownClick);
    };
  }, []);

  return null;
};

export default HeaderMenu;
