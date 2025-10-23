
function cargoDash() {
    if (sessionStorage.CARGO_USUARIO == 1) {
        window.location = "dashboard_robotica.html";
    }
    else {
        window.location = "dashboard_manutencao.html";
    }
}