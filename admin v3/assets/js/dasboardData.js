export const pageConfig = {
    title: "+ Saudável | Administrador",
    lang: "pt",
    logoUrl: "assets/images/logo.png"
};

export const currentUser = {
    name: "Cristõvão Sango",
    role: "Administrador",
    avatarUrl: "assets/images/doctor.jpg"
};

export const mainMetrics = {
    utilizadores: {
        total: 12458,
        trendPercentage: 12,
        trendDirection: "up" 
    },
    medicos: {
        total: 1248,
        trendPercentage: 5.3,
        trendDirection: "up"
    },
    consultas: {
        total: 3789,
        trendPercentage: 1.2,
        trendDirection: "up"
    },
    receita: {
        total: 90000.00,
        trendPercentage: 10,
        trendDirection: "up"
    }
};

export const detailedStatus = {
    pacientes: {
        ativos: 150,
        inativos: 230
    },
    unidadesSaude: {
        medicosAtivos: 23,
        medicosInativos: 100
    },
    comunicacoes: {
        realizadas: 25,
        emProgresso: 2
    }
};

export const navigationMenu = [
    { label: "Inicio", link: "index.html", icon: "ti-home", active: true },
    { label: "Utilizadores", link: "utilizadores.html", icon: "icofont-users-social" },
    { label: "Médicos", link: "medicos.html", icon: "icofont-doctor-alt" },
    { label: "Pacientes", link: "pacientes.html", icon: "icofont-user" },
    { label: "Consultas", link: "consultas.html", icon: "icofont-calendar" },
    { label: "Unidades de saúde", link: "#", icon: "icofont-hospital" },
    { label: "Pagamentos", link: "#", icon: "icofont-money" },
    { label: "Relatórios", link: "#", icon: "ti-bar-chart" },
    { label: "Comunicações", link: "#", icon: "icofont-chat" },
    { label: "Configurações", link: "#", icon: "ti-settings" },
    { label: "Auditoria", link: "#", icon: "ti-check-box" }
];