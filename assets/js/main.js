// Comportamiento compartido de marcocos.com
// Aparición suave de cada bloque al llegar a él con el scroll
const bloques = document.querySelectorAll(".revelar");
const captura = location.search.includes("captura");
if (!captura) document.documentElement.classList.add("js");
else document.querySelector(".hero").style.minHeight = "900px";
if ("IntersectionObserver" in window && !captura) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observador.unobserve(e.target); } });
  }, { threshold: 0.15 });
  bloques.forEach((b) => observador.observe(b));
} else {
  bloques.forEach((b) => b.classList.add("visible"));
}

// Video de portada: solo en celular, y quieto si la persona pidió menos movimiento
const video = document.querySelector(".hero-video");
if (video) {
  if (matchMedia("(min-width: 800px)").matches) video.remove();
  else if (matchMedia("(prefers-reduced-motion: reduce)").matches) { video.removeAttribute("autoplay"); video.pause(); }
}

// Las cifras cuentan desde cero la primera vez que aparecen (solo si se permiten animaciones)
const animar = !captura && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches;
if (animar) {
  const contador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      contador.unobserve(e.target);
      const meta = parseFloat(e.target.dataset.contar), decimales = e.target.dataset.contar.includes(".") ? 1 : 0, inicio = performance.now();
      const paso = (t) => {
        const p = Math.min((t - inicio) / 1400, 1), suave = 1 - Math.pow(1 - p, 3);
        e.target.textContent = (meta * suave).toFixed(decimales);
        if (p < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-contar]").forEach((n) => contador.observe(n));
}

// En computadora casi nadie tiene configurada una app de correo y el link "mailto" no abre nada:
// ahí los botones de correo abren un correo nuevo en Gmail. En celular siguen abriendo la app de correo.
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
    const correo = a.getAttribute("href").slice(7).split("?")[0];
    const asunto = a.dataset.asunto || "Contacto desde marcocos.com";
    a.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${correo}&su=${encodeURIComponent(asunto)}`;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

// Al llegar con un enlace a una sección (por ejemplo /musica/#vanidad) se vuelve a ubicar cuando termina de cargar
addEventListener("load", () => {
  const destino = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (destino) destino.scrollIntoView();
});
