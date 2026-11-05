const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

function closeMenu() {
  if (!menuToggle || !siteNav) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  siteNav.classList.remove("is-open");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (event.target instanceof Node && !siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const progressBar = document.querySelector(".scroll-progress");

if (progressBar) {
  let progressFrame = 0;
  const updateScrollProgress = () => {
    progressFrame = 0;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    progressBar.style.setProperty("--scroll-progress", String(Math.min(1, Math.max(0, progress))));
  };

  const scheduleScrollProgress = () => {
    if (!progressFrame) progressFrame = window.requestAnimationFrame(updateScrollProgress);
  };

  window.addEventListener("scroll", scheduleScrollProgress, { passive: true });
  window.addEventListener("resize", scheduleScrollProgress);
  updateScrollProgress();
}

if ("IntersectionObserver" in window && !reducedMotion) {
  document
    .querySelectorAll(".about-section .section-heading, .principle, .specialty-card, .projects-heading, .contact-inner")
    .forEach((element) => element.setAttribute("data-reveal", ""));

  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
}

const repoStatus = document.querySelector("#repo-status");
const relativeTime = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

function formatRelativeDate(dateString) {
  const timestamp = Date.parse(dateString);
  if (Number.isNaN(timestamp)) throw new Error("O GitHub retornou uma data de atualização inválida.");

  const elapsedDays = Math.round((timestamp - Date.now()) / 86_400_000);
  if (Math.abs(elapsedDays) >= 1) return relativeTime.format(elapsedDays, "day");

  const elapsedHours = Math.round((timestamp - Date.now()) / 3_600_000);
  return relativeTime.format(elapsedHours, "hour");
}

async function loadRepositoryMetrics(region) {
  const repository = region.dataset.repo;
  const [owner, name] = (repository || "").split("/");
  if (!owner || !name) throw new Error("O identificador do repositório está inválido.");

  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
    { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`O GitHub respondeu com status ${response.status} para ${repository}.`);
  }

  const data = await response.json();
  if (!Number.isInteger(data.stargazers_count) || typeof data.pushed_at !== "string") {
    throw new Error(`O GitHub retornou indicadores incompletos para ${repository}.`);
  }

  const stars = region.querySelector('[data-metric="stars"]');
  const updated = region.querySelector('[data-metric="updated"]');
  if (!stars || !updated) throw new Error(`Os indicadores de ${repository} não estão configurados no HTML.`);

  stars.textContent = `Estrelas: ${data.stargazers_count}`;
  updated.textContent = `Atualizado ${formatRelativeDate(data.pushed_at)}`;
}

const repositories = [...document.querySelectorAll(".repo-metrics")];
if (repositories.length && repoStatus) {
  Promise.allSettled(repositories.map(loadRepositoryMetrics)).then((results) => {
    const failedRequests = results.filter((result) => result.status === "rejected");
    if (failedRequests.length) {
      failedRequests.forEach((result) => console.error(result.reason));
      repoStatus.classList.add("is-error");
      repoStatus.textContent =
        "Não foi possível carregar todos os indicadores do GitHub. Os links dos projetos continuam disponíveis.";
      return;
    }

    repoStatus.textContent = "Indicadores atualizados a partir da API pública do GitHub.";
  });
}
