/* ============================================================
   js/simulator.js — Simulador de la Máquina de Estados.
   Avanza el estado del estudiante según el conteo de faltas y
   resalta nodos/transiciones dentro del SVG de estados.
   Requiere: css/simulator.css (clases active-state / active-path)
   ============================================================ */

const SimulationState = {
  REGULAR: 'regular',
  ALERTA: 'alert',
  CRITICO: 'critical',
  TEA: 'tea'
};

/**
 * Inicializa el simulador sobre los elementos del DOM de la página.
 * @param {Object} els mapa de elementos: dock, botones, label, toast
 * @returns {Object} API { reset, refresh }
 */
function initSimulator(els) {
  const stateElements = {
    [SimulationState.REGULAR]: document.getElementById('node-regular'),
    [SimulationState.ALERTA]: document.getElementById('node-alert'),
    [SimulationState.CRITICO]: document.getElementById('node-critical'),
    [SimulationState.TEA]: document.getElementById('node-tea')
  };

  const pathElements = {
    'reg-alert': document.getElementById('path-reg-alert'),
    'alert-five': document.getElementById('path-alert-five'),
    'alert-crit': document.getElementById('path-alert-crit'),
    'critical-twenty': document.getElementById('path-critical-twenty'),
    'crit-tea': document.getElementById('path-crit-tea'),
    'init-reg': document.getElementById('path-init-reg')
  };
  let currentSimState = SimulationState.REGULAR;
  let currentAbsences = 0;

  function highlightPath(pathKey) {
    Object.values(pathElements).forEach(p => { if (p) p.classList.remove('active-path'); });
    if (pathElements[pathKey]) pathElements[pathKey].classList.add('active-path');
  }

  function updateSimulationUI() {
    Object.values(stateElements).forEach(el => { if (el) el.classList.remove('active-state'); });
    if (stateElements[currentSimState]) stateElements[currentSimState].classList.add('active-state');
    els.jumpCritBtn.disabled = currentSimState === SimulationState.TEA;
    els.jumpTeaBtn.disabled = currentSimState === SimulationState.TEA;

    const stateNames = {
      [SimulationState.REGULAR]: 'Regular', [SimulationState.ALERTA]: 'Alerta',
      [SimulationState.CRITICO]: 'Crítico', [SimulationState.TEA]: 'TEA'
    };
    els.stateLabel.textContent = `Estado: [${stateNames[currentSimState]}] (${currentAbsences} faltas)`;
  }

  els.addAbsenceBtn.addEventListener('click', () => {
    currentAbsences++;
    if (currentAbsences < 3) { currentSimState = SimulationState.REGULAR; highlightPath('init-reg'); }
    else if (currentAbsences < 10) {
      currentSimState = SimulationState.ALERTA;
      if (currentAbsences === 3) highlightPath('reg-alert');
      if (currentAbsences === 5) highlightPath('alert-five');
    } else if (currentAbsences < 25) {
      currentSimState = SimulationState.CRITICO;
      if (currentAbsences === 10) highlightPath('alert-crit');
      if (currentAbsences === 20) highlightPath('critical-twenty');
    } else {
      currentSimState = SimulationState.TEA;
      if (currentAbsences === 25) highlightPath('crit-tea');
    }
    updateSimulationUI();
  });

  els.jumpCritBtn.addEventListener('click', () => {
    if (currentSimState === SimulationState.TEA) return;
    currentAbsences = 10; currentSimState = SimulationState.CRITICO;
    highlightPath('alert-crit'); updateSimulationUI();
  });

  els.jumpTeaBtn.addEventListener('click', () => {
    if (currentSimState === SimulationState.TEA) return;
    currentAbsences = 25; currentSimState = SimulationState.TEA;
    highlightPath('crit-tea'); updateSimulationUI();
  });

  els.resetBtn.addEventListener('click', () => {
    currentSimState = SimulationState.REGULAR; currentAbsences = 0;
    highlightPath('init-reg'); updateSimulationUI();
  });

  updateSimulationUI();

  return { reset: () => els.resetBtn.click(), refresh: updateSimulationUI };
}
