import { pageConfig, currentUser, mainMetrics, detailedStatus, navigationMenu} from './dasboardData.js';

document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById('title_page').innerText = pageConfig.title;
    document.getElementById('img_logo').src = pageConfig.logoUrl;

    document.getElementById('user_name').innerText = currentUser.name;
    document.getElementById('user_avatar').src = currentUser.avatarUrl;

    
if (document.getElementById('metric_utilizadores_total')) {
    document.getElementById('metric_utilizadores_total').innerText = mainMetrics.utilizadores.total.toLocaleString('pt-PT');
}
if (document.getElementById('metric_utilizadores_trend')) {
    const trendIcon = mainMetrics.utilizadores.trendDirection === 'up' ? 'ti-stats-up' : 'ti-stats-down';
    document.getElementById('metric_utilizadores_trend').innerHTML = `
        <i class="text-trend-utilizadores f-16 ${trendIcon} m-r-10" style="font-style: normal;"></i>
        <span style="font-style: normal;">${mainMetrics.utilizadores.trendPercentage}%</span>
    `;
}

if (document.getElementById('metric_medicos_total')) {
    document.getElementById('metric_medicos_total').innerText = mainMetrics.medicos.total.toLocaleString('pt-PT');
}
if (document.getElementById('metric_medicos_trend')) {
    const trendIcon = mainMetrics.medicos.trendDirection === 'up' ? 'ti-stats-up' : 'ti-stats-down';
    document.getElementById('metric_medicos_trend').innerHTML = `
        <i class="text-trend-medicos f-16 ${trendIcon} m-r-10" style="font-style: normal;"></i>
        <span style="font-style: normal;">${mainMetrics.medicos.trendPercentage}%</span>
    `;
}

if (document.getElementById('metric_consultas_total')) {
    document.getElementById('metric_consultas_total').innerText = mainMetrics.consultas.total.toLocaleString('pt-PT');
}
if (document.getElementById('metric_consultas_trend')) {
    const trendIcon = mainMetrics.consultas.trendDirection === 'up' ? 'ti-stats-up' : 'ti-stats-down';
    document.getElementById('metric_consultas_trend').innerHTML = `
        <i class="text-trend-consultas f-16 ${trendIcon} m-r-10" style="font-style: normal;"></i>
        <span style="font-style: normal;">${mainMetrics.consultas.trendPercentage}%</span>
    `;
}

if (document.getElementById('metric_receita_total')) {
    if (mainMetrics.receita && mainMetrics.receita.total !== undefined) {
        document.getElementById('metric_receita_total').innerText = 
            mainMetrics.receita.total.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}
if (document.getElementById('metric_receita_trend')) {
    if (mainMetrics.receita && mainMetrics.receita.trendPercentage !== undefined) {
        const trendIcon = mainMetrics.receita.trendDirection === 'up' ? 'ti-stats-up' : 'ti-stats-down';
        document.getElementById('metric_receita_trend').innerHTML = `
            <i class="text-trend-receita f-16 ${trendIcon} m-r-10" style="font-style: normal;"></i>
            <span style="font-style: normal;">${mainMetrics.receita.trendPercentage}%</span>
        `;
    }
}

if (document.getElementById('status_pacientes_ativos')) {
    document.getElementById('status_pacientes_ativos').innerText = detailedStatus.pacientes.ativos;
}
if (document.getElementById('status_pacientes_inativos')) {
    document.getElementById('status_pacientes_inativos').innerText = detailedStatus.pacientes.inativos;
}

if (document.getElementById('status_unidades_ativos')) {
    document.getElementById('status_unidades_ativos').innerText = detailedStatus.unidadesSaude.medicosAtivos;
}
if (document.getElementById('status_unidades_inativos')) {
    document.getElementById('status_unidades_inativos').innerText = detailedStatus.unidadesSaude.medicosInativos;
}

if (document.getElementById('status_comunicacoes_realizadas')) {
    document.getElementById('status_comunicacoes_realizadas').innerText = detailedStatus.comunicacoes.realizadas;
}
if (document.getElementById('status_comunicacoes_progresso')) {
    document.getElementById('status_comunicacoes_progresso').innerText = detailedStatus.comunicacoes.emProgresso;
}

    const sideNavContainer = document.getElementById('side_navigation');
    if (sideNavContainer && navigationMenu) {
        sideNavContainer.innerHTML = '';

        const styleMapping = {
            "Inicio": "micon-dashboard",
            "Utilizadores": "micon-utilizadores",
            "Médicos": "micon-medicos",
            "Pacientes": "micon-pacientes",
            "Consultas": "micon-consultas",
            "Unidades de saúde": "micon-unidades",
            "Pagamentos": "micon-pagamentos",
            "Relatórios": "micon-relatorios",
            "Comunicações": "micon-comunicacoes",
            "Configurações": "micon-sistema",
            "Auditoria": "micon-sistema"
        };

        const ulInicio = document.createElement('ul');
        ulInicio.className = "pcoded-item pcoded-left-item";

        const ulGestao = document.createElement('ul');
        ulGestao.className = "pcoded-item pcoded-left-item";

        const ulServicos = document.createElement('ul');
        ulServicos.className = "pcoded-item pcoded-left-item";

        navigationMenu.forEach(item => {
            const li = document.createElement('li');
            if (item.active) li.className = "active";

            const miconCustomClass = styleMapping[item.label] || "micon-sistema";

            const iconTypeClass = item.icon.startsWith('ti-') ? item.icon : `icofont ${item.icon}`;

            li.innerHTML = `
                <a href="${item.link}">
                    <span class="pcoded-micon ${miconCustomClass}"><i class="${iconTypeClass}"></i></span>
                    <span class="pcoded-mtext" ${item.active ? 'style="color:#1CA625;"' : ''}>${item.label}</span>
                </a>
            `;

            if (item.label === "Inicio") {
                ulInicio.appendChild(li);
            } else if (["Utilizadores", "Médicos", "Pacientes"].includes(item.label)) {
                ulGestao.appendChild(li);
            } else {
                ulServicos.appendChild(li);
            }
        });

        sideNavContainer.appendChild(ulInicio);
        sideNavContainer.appendChild(ulGestao);
        sideNavContainer.appendChild(ulServicos);
    }
});