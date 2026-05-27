(function () {
  var params = new URLSearchParams(window.location.search);
  var tag = params.get("tag");
  if (!tag) return;

  var cards = document.querySelectorAll("[data-event-card]");
  if (!cards.length) return;

  var visible = 0;
  cards.forEach(function (card) {
    var tags = (card.getAttribute("data-event-tags") || "").split(",").filter(Boolean);
    var show = tags.indexOf(tag) !== -1;
    card.hidden = !show;
    if (show) visible += 1;
  });

  var banner = document.getElementById("apc-events-filter-banner");
  if (!banner) return;

  banner.hidden = false;
  var label = banner.querySelector("[data-filter-label]");
  var clear = banner.querySelector("[data-filter-clear]");
  if (label) {
    var showing = banner.getAttribute("data-filter-showing") || 'Showing events tagged "%s".';
    var none = banner.getAttribute("data-filter-none") || 'No events tagged "%s".';
    var tagLabel = tag.replace(/-/g, " ");
    label.textContent = (visible === 0 ? none : showing).replace("%s", tagLabel);
  }
  if (clear) {
    clear.href = window.location.pathname;
  }
})();
