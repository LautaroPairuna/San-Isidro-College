import { useEffect } from "react";

const HeaderMenu: React.FC = () => {
  useEffect(() => {
    // Pre-cargar la imagen alterna para evitar retrasos en el cambio
    const preloadImage = new Image();
    preloadImage.src = "/images/logo-san-isidro-2.svg";
    // Si quieres también precargar la imagen 3:
    const preloadImage3 = new Image();
    preloadImage3.src = "/images/logo-san-isidro-3.svg";

    // Obtener elementos del DOM
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
      // Si el menú desplegable está abierto, no hacemos nada
      if (!dropdownMenu.classList.contains("hidden")) {
        return;
      }

      if (window.scrollY > 50) {
        header.classList.add("scrolled-header");
        logoContainers.forEach((el) => {
          el.classList.add("scrolled-logo", "bg-white", "shadow-md", "p-2", "rounded-lg");
        });
        logo.src = "/images/logo-san-isidro-2.svg";
        menuLogo.src = "/images/logo-san-isidro-2.svg";
      } else {
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
      // Ocultamos el header
      header.classList.add("hidden");

      // Mostramos el menú desplegable y el overlay
      dropdownMenu.classList.remove("hidden");
      overlay.classList.remove("hidden");

      // Forzar reflow para que la transición .menu-panel funcione
      void menuPanel.offsetWidth;
      menuPanel.classList.remove("-translate-y-full");

      // **Cambiamos el logo al 3** y NO agregamos estilos “scrolled-header” ni “scrolled-logo”
      logo.src = "/images/logo-san-isidro-3.svg";
      menuLogo.src = "/images/logo-san-isidro-3.svg";
    };

    // Función para cerrar el menú
    const closeDropdown = () => {
      // Animamos el panel hacia arriba
      menuPanel.classList.add("-translate-y-full");
      setTimeout(() => {
        // Pasados 300ms (coincidiendo con la transición CSS), ocultamos el menú
        dropdownMenu.classList.add("hidden");
        header.classList.remove("hidden");
        overlay.classList.add("hidden");

        // Si se cerró el menú y el scroll está por debajo de 50, revertimos al logo original
        if (window.scrollY < 50) {
          header.classList.remove("scrolled-header");
          logoContainers.forEach((el) => {
            el.classList.remove("scrolled-logo", "bg-white", "shadow-md", "p-2", "rounded-lg");
          });
          logo.src = "/images/logo-san-isidro.svg";
          menuLogo.src = "/images/logo-san-isidro.svg";
        }
      }, 300);
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

    // Limpieza de los event listeners
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
