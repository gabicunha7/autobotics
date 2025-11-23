function menu(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('menuDropdown');
    
    
    const cargoUsuario = parseInt(sessionStorage.CARGO_USUARIO);
    
    const btnDash = document.querySelector('[tag="agora"]');

    btnDash.innerHTML = `<img class="icon-pagina" src="assets/icones/dash_icon.png" alt="">
                            Dashboard
                            <img  class="icon-pagina" src="assets/icones/arrow_up.png" alt="">`

    


    if (cargoUsuario == 1) {
        
        dropdown.innerHTML = `
            <a class="menu-dropdown-item" href="dashboard_robotica.html">
                Dashboard Robótica
            </a>
            <a class="menu-dropdown-item" href="dashboards_alertas_tempo_real.html">
                Dashboard Alertas Tempo Real
            </a>
            <a class="menu-dropdown-item" href="dashboard_cpu_ram.html">
                Dashboard Controlador
            </a>
        `;
    } else {
        
        dropdown.innerHTML = `
            <a class="menu-dropdown-item" href="dashboard_manutencao.html">
                Dashboard Manutenção
            </a>

            <a class="menu-dropdown-item" href="dashboard_historico_disco.html">
                Dashboard Histórico Disco
            </a>

            <a class="menu-dropdown-item" href="dashboard_historico_alertas.html">
                Dashboard Histórico de Alertas
            </a>
        `;
    }
    
    
    const aberto = dropdown.classList.toggle('active');

    if (btnDash) {
        btnDash.innerHTML = `
        <img class="icon-pagina" src="assets/icones/dash_icon.png" alt="">
        Dashboards
        <img class="icon-pagina" src="assets/icones/${aberto ? 'arrow_up' : 'arrow_down'}.png" alt="">
        `;
    }
}


function fechaMenuDropdown() {
    const dropdown = document.getElementById('menuDropdown');
    dropdown.classList.remove('active');
    const btnDash = document.querySelector('[tag="agora"]');
    if (btnDash) {
        btnDash.innerHTML = `<img class="icon-pagina" src="assets/icones/dash_icon.png" alt=""> Dashboards <img class="icon-pagina" src="assets/icones/arrow_down.png" alt="">`;
    }
}


document.addEventListener('click', function (event) {
    
    const container = document.querySelector('.menu-dropdown-container');
    
    if (container && !container.contains(event.target)) {
        fechaMenuDropdown();
    }
});