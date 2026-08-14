/* Shared behavior for all pages: session age gate, mobile nav, year.
   The 21+ verification is scoped to the current browser session
   (sessionStorage), shared across the whole site, so navigating
   between pages never re-triggers the gate within a session. */
(function () {
  var KEY = "acw-age-verified";
  var gate = document.getElementById("age-gate");
  var body = document.body;

  if (gate) {
    try {
      if (sessionStorage.getItem(KEY) === "1") {
        gate.style.display = "none";
        body.classList.remove("locked");
      }
    } catch (e) {}

    var yes = document.getElementById("gate-yes");
    if (yes) {
      yes.addEventListener("click", function () {
        try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
        gate.style.opacity = "0";
        gate.style.transition = "opacity .35s ease";
        body.classList.remove("locked");
        setTimeout(function () { gate.style.display = "none"; }, 350);
      });
    }
  }

  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // COA batch search (only on the Lab Results page)
  var coaSearch = document.getElementById("coa-search");
  if (coaSearch) {
    var entries = [].slice.call(document.querySelectorAll(".coa-entry"));
    var cutSections = [].slice.call(document.querySelectorAll(".coa-cut"));
    var noRes = document.getElementById("coa-noresults");
    coaSearch.addEventListener("input", function () {
      var q = coaSearch.value.trim().toLowerCase();
      var anyVisible = false;
      entries.forEach(function (el) {
        var match = !q ||
          el.getAttribute("data-batch").indexOf(q) !== -1 ||
          el.getAttribute("data-cut").indexOf(q) !== -1;
        el.hidden = !match;
        if (match) anyVisible = true;
      });
      cutSections.forEach(function (sec) {
        sec.hidden = sec.querySelectorAll(".coa-entry:not([hidden])").length === 0;
      });
      if (noRes) noRes.hidden = anyVisible;
    });
  }
})();
