let json = {};

const App = function() {
  function start () {
    page();
    menu();

    const steamchart = new chart.Steamchart({
      container: document.getElementById("chart"),
      data: json,
      margin: { bottom: 10, left: 10, right: 10, top: 10 }
    });

    steamchart.draw();
  }

  function menu() {
    const menu = document.querySelector(".menu");
    const menuButton = document.querySelector(".menu-button");

    if (menu && menuButton) {
      menuButton.addEventListener("click", function(e) {
        e.stopImmediatePropagation();
        menu.classList.toggle("ready");
      });
      menu.addEventListener("click", function(e) { e.stopImmediatePropagation(); });
    }
    window.addEventListener("hide-menu", function() { menu.classList.add("ready"); });
  }

  function page() {
    const chart = document.getElementById("chart");
    chart.addEventListener("click", function() {
      window.dispatchEvent(new CustomEvent("hide-menu"));
    });
  }

  App.start = start;

  return App;
};
