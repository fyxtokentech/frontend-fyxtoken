function initApp() {
  setup();
  burn_template();
  ready();

  function setup() {
    Object.assign(config_template, {
      banner: {
        left: {
          label: "FyxToken",
          logo: "public/img/Logo_Fyxtoken_Icono_Color_Principal.svg",
        },
      },
      mapSite: _mapSite(),
      repo: {
        name: "FyxToken",
        url: "https://github.com/fyxtokentech/frontend-fyxtoken",
      },
    });
  }

  function burn_template() {
    ReactDOM.render(<App />, document.getElementById("root"));
  }

  function ready() {
    changeContent({ id: get_id_param() });
  }

  function _mapSite() {
    return [
      {
        lbl: "Inicio",
        id: "intro",
        content: () => <_intro />,
        i: "fa-solid fa-home",
      },
      {
        lbl: "Plataforma",
      },
      {
        lbl: "Wallet",
        id: "wallet",
        content: () => <_wallet />,
        i: "fa-solid fa-wallet",
      },
      {
        lbl: "Inversiones",
        id: "investments",
        content: () => <_investments />,
        i: "fa-solid fa-chart-line",
      },
      {
        lbl: "Movimientos",
        id: "movements",
        content: () => <_movements />,
        i: "fa-solid fa-arrows-rotate",
      },
      {
        lbl: "Retiros",
        id: "withdrawals",
        content: () => <_withdrawals />,
        i: "fa-solid fa-money-bill-transfer",
      },
      {
        lbl: "Noticias",
        id: "news",
        content: () => <_news />,
        i: "fa-regular fa-newspaper",
      },
      {
        lbl: "Trading",
      },
      {
        lbl: "Gráficos",
        id: "charts",
        content: () => <_charts />,
        i: "fa-solid fa-chart-simple",
      },
      {
        lbl: "Intervalos",
        id: "intervals",
        content: () => <_intervals />,
        i: "fa-regular fa-clock",
      },
      {
        lbl: "Desarrollo",
      },
      {
        lbl: "Tecnologías",
        id: "tech",
        content: () => <_tech />,
        i: "fa-solid fa-code",
      },
      {
        lbl: "Componentes",
        id: "components",
        content: () => <_components />,
        i: "fa-solid fa-puzzle-piece",
      },
      {
        lbl: "Temas",
        id: "themes",
        content: () => <_themes />,
        i: "fa-solid fa-palette",
      },
    ];
  }
}
