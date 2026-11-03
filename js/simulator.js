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
  TEA: 'tea',
  REINCORPORADO: 'reinc',
  FINAL: 'final'
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
    [SimulationState.TEA]: document.getElementById('node-tea'),
    [SimulationState.REINCORPORADO]: document.getElementById('node-reinc'),
    [SimulationState.FINAL]: document.getElementById('node-final')
  };

  const pathElements = {
    'reg-alert': document.getElementById('path-reg-alert'),
    'alert-crit': document.getElementById('path-alert-crit'),
    'crit-tea': document.getElementById('path-crit-tea'),
    'tea-reinc': document.getElementById('path-tea-reinc'),
    'reinc-reg': document.getElementById('path-reinc-reg'),
    'tea-final': document.getElementById('path-tea-final'),
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

    els.passTeaBtn.disabled = currentSimState !== SimulationState.TEA;
    els.dropBtn.disabled = currentSimState !== SimulationState.TEA;

    const stateNames = {
      [SimulationState.REGULAR]: 'Regular', [SimulationState.ALERTA]: 'Alerta',
      [SimulationState.CRITICO]: 'Crítico', [SimulationState.TEA]: 'TEA',
      [SimulationState.REINCORPORADO]: 'Reincorporado', [SimulationState.FINAL]: 'Final'
    };
    els.stateLabel.textContent = `Estado: [${stateNames[currentSimState]}] (${currentAbsences} faltas)`;
  }

  els.addAbsenceBtn.addEventListener('click', () => {
    if (currentSimState === SimulationState.FINAL) {
      els.toast.show('Estudiante desvinculado.');
      return;
    }
    currentAbsences++;
    if (currentAbsences < 3) { currentSimState = SimulationState.REGULAR; highlightPath('init-reg'); }
    else if (currentAbsences < 10) { currentSimState = SimulationState.ALERTA; highlightPath('reg-alert'); }
    else if (currentAbsences < 25) { currentSimState = SimulationState.CRITICO; highlightPath('alert-crit'); }
    else { currentSimState = SimulationState.TEA; highlightPath('crit-tea'); }
    updateSimulationUI();
  });

  els.jumpCritBtn.addEventListener('click', () => {
    currentAbsences = 10; currentSimState = SimulationState.CRITICO;
    highlightPath('alert-crit'); updateSimulationUI();
  });

  els.jumpTeaBtn.addEventListener('click', () => {
    currentAbsences = 25; currentSimState = SimulationState.TEA;
    highlightPath('crit-tea'); updateSimulationUI();
  });

  els.passTeaBtn.addEventListener('click', () => {
    if (currentSimState !== SimulationState.TEA) return;
    currentSimState = SimulationState.REINCORPORADO;
    highlightPath('tea-reinc'); updateSimulationUI();
    setTimeout(() => {
      if (currentSimState === SimulationState.REINCORPORADO) {
        currentSimState = SimulationState.REGULAR; currentAbsences = 0;
        highlightPath('reinc-reg'); updateSimulationUI();
      }
    }, 2200);
  });

  els.dropBtn.addEventListener('click', () => {
    if (currentSimState !== SimulationState.TEA) return;
    currentSimState = SimulationState.FINAL;
    highlightPath('tea-final'); updateSimulationUI();
  });

  els.resetBtn.addEventListener('click', () => {
    currentSimState = SimulationState.REGULAR; currentAbsences = 0;
    highlightPath('init-reg'); updateSimulationUI();
  });

  updateSimulationUI();

  return { reset: () => els.resetBtn.click(), refresh: updateSimulationUI };
}
