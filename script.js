const positions = ["PG","SG","SF","PF","C"];
let playersData = {};
let locked = false;
let remainingPositions = [...positions];
let selectedPosition = null;

const positionOffsets = {
  'PG': 54,
  'SG': -18,
  'SF': -90,
  'PF': -162,
  'C': -234
};

// Função para alerta com estilo personalizado
function showCustomAlert(message) {
  document.getElementById("alertMessage").innerText = message;
  document.getElementById("customAlert").style.display = "flex";
}

document.getElementById("alertOk").onclick = () => {
  document.getElementById("customAlert").style.display = "none";
};

// Criação dos inputs para os jogadores
const playersDiv = document.getElementById("players");

const instructions = document.createElement("p");
instructions.className = "instruction-text";
instructions.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -3px; margin-right: 6px;"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.45.62 2.76 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>Insira dois jogadores para cada posição; ao finalizar clique em <strong class='neon-text'>Draft</strong> ou em <strong class='neon-text'>Resetar</strong> para reiniciar do zero.`;
playersDiv.parentNode.insertBefore(instructions, playersDiv);

positions.forEach(pos => {
  const div = document.createElement("div");
  div.className = "row";

  div.innerHTML = `
    <span>${pos}</span>
    <input maxlength="10">
    <div class="vs">X</div>
    <input maxlength="10">
  `;
  playersDiv.appendChild(div);
});

// Botões de seleção de posição
const posButtons = document.getElementById("posButtons");

positions.forEach(pos => {
  const btn = document.createElement("button");
  btn.textContent = pos;
  btn.dataset.pos = pos;
  btn.onclick = () => selectPosition(pos);
  posButtons.appendChild(btn);
});

// Criação do card para roleta menor (sorteio de posição)
const smallWheelContainer = document.getElementById("wheelPositions")?.closest(".wheel-container");
const centerCard = document.querySelector(".card.center");
const spinPosBtn = document.getElementById("spinPositions");
const container = document.querySelector(".container");

if (centerCard && smallWheelContainer && spinPosBtn && container) {
  // Cria o novo card
  const posCard = document.createElement("div");
  posCard.className = "card";

  // Cria o título com o ícone de roleta branca
  const posTitle = document.createElement("h2");
  posTitle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/><path d="M4.93 4.93l14.14 14.14"/><path d="M19.07 4.93L4.93 19.07"/></svg>Sorteio de Posição`;
  posCard.appendChild(posTitle);

  // Cria a instrução do sorteio de posição
  const posInstruction = document.createElement("p");
  posInstruction.className = "instruction-text";
  posInstruction.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -3px; margin-right: 6px;"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.45.62 2.76 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>Clique no botão para <strong class='neon-text'>Sortear</strong> a posição.`;
  posCard.appendChild(posInstruction);

  // Aplica a exata mesma estrutura de alinhamento da roleta 2
  smallWheelContainer.classList.remove("positions");
  posCard.appendChild(smallWheelContainer);

  // Isola o botão na div de ações para manter a linha da base
  const posActions = document.createElement("div");
  posActions.className = "actions";
  posActions.appendChild(spinPosBtn);
  posCard.appendChild(posActions);

  // Insere o novo card antes da roleta maior (card central)
  container.insertBefore(posCard, centerCard);
}

// Instrução do card 3 (sorteio de jogadores)
if (centerCard) {
  const playersInstruction = document.createElement("p");
  playersInstruction.className = "instruction-text";
  playersInstruction.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -3px; margin-right: 6px;"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.45.62 2.76 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>Clique em <strong class='neon-text'>sortear</strong> para separar os dois <strong class='neon-text'>bagres</strong> de cada posição.`;
  const centerTitle = centerCard.querySelector("h2");
  centerCard.insertBefore(playersInstruction, centerTitle.nextSibling);
}

// Draft (travar)
document.getElementById("draftBtn").onclick = () => {
  if (locked) return;

  const rows = document.querySelectorAll(".row");
  let allFilled = true;

  // Validação: verificar se todos os campos estão preenchidos
  rows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    if (!inputs[0].value.trim() || !inputs[1].value.trim()) {
      allFilled = false;
    }
  });

  if (!allFilled) {
    showCustomAlert("Preencha todos os jogadores antes de prosseguir, burro!");
    return;
  }

  rows.forEach((row, i) => {
    const inputs = row.querySelectorAll("input");
    playersData[positions[i]] = [inputs[0].value.trim(), inputs[1].value.trim()];

    inputs.forEach(input => input.disabled = true);
  });

  locked = true;
  const draftBtn = document.getElementById("draftBtn");
  draftBtn.style.background = "#7CFF00";
  draftBtn.style.color = "#2c2c2c";
  const svg = draftBtn.querySelector("svg");
  if (svg) svg.style.stroke = "#2c2c2c";
};

// Resetar os jogadores
document.getElementById("resetPlayers").onclick = (e) => {
  if (e) e.preventDefault();
  // 1. Destravar inputs (mantendo os nomes digitados) e limpar dados de estado
  locked = false;
  playersData = {};
  document.querySelectorAll(".row input").forEach(input => {
    input.disabled = false;
  });

  // 2. Restaurar estilo do botão draft
  const draftBtn = document.getElementById("draftBtn");
  draftBtn.style.background = "";
  draftBtn.style.color = "";
  const svg = draftBtn.querySelector("svg");
  if (svg) svg.style.stroke = "";

  // 3. Resetar lógica de posições
  remainingPositions = [...positions];
  selectedPosition = null;
  clearActivePosition();
  posButtons.querySelectorAll("button").forEach(btn => btn.classList.remove("completed"));

  // 4. Resetar as cores da roleta (sem zerar a rotação)
  document.querySelectorAll("#wheelPositions .wedge").forEach(w => {
    w.style.color = "#fff";
  });

  // Garante fisicamente que as roletas não voltem para a posição inicial
  if (wheelRotations["wheelPositions"] !== undefined) {
    document.getElementById("wheelPositions").style.transform = `rotate(${wheelRotations["wheelPositions"]}deg)`;
  }
  if (wheelRotations["wheelPlayers"] !== undefined) {
    document.getElementById("wheelPlayers").style.transform = `rotate(${wheelRotations["wheelPlayers"]}deg)`;
  }

  // 5. Resetar textos da roleta do card 3
  const wheelPlayers = document.getElementById("wheelPlayers");
  if (wheelPlayers.querySelector(".half-label.left")) wheelPlayers.querySelector(".half-label.left").innerText = "";
  if (wheelPlayers.querySelector(".half-label.right")) wheelPlayers.querySelector(".half-label.right").innerText = "";
  if (wheelPlayers.querySelector(".wheel-center")) wheelPlayers.querySelector(".wheel-center").innerText = "";

  // 6. Limpar os times
  positions.forEach(p => { delete team1Data[p]; delete team2Data[p]; });
  renderTeams();
};

// Roleta de posições (card 2)
document.getElementById("spinPositions").onclick = () => {
  if (!locked) {
    showCustomAlert("Clique em DRAFT primeiro!");
    return;
  }

  // Evita que o usuário gire a roleta 1 novamente se já houver uma posição pendente
  if (selectedPosition !== null) {
    showCustomAlert("Finalize o sorteio da posição atual (" + selectedPosition + ") primeiro!");
    return;
  }

  if (remainingPositions.length === 0) {
    showCustomAlert("Todas posições já sorteadas!");
    return;
  }

  const index = Math.floor(Math.random() * remainingPositions.length);
  selectedPosition = remainingPositions.splice(index,1)[0];
  const offset = positionOffsets[selectedPosition];

  spin("wheelPositions", offset).then(() => {
    // Pinta o texto da fatia vencedora de verde neon
    document.querySelectorAll("#wheelPositions .wedge").forEach(w => {
      if (w.textContent === selectedPosition) {
        w.style.color = "#7CFF00";
      }
    });
    showCustomAlert("Posição sorteada: " + selectedPosition);
  });
};

// Selecionar a posição sorteada para o próximo card (sorteio de jogadores)
function selectPosition(pos){
  if(pos !== selectedPosition) {
    // Se já tem uma posição sorteada na roleta 1 aguardando, obriga a clicar nela
    if (selectedPosition !== null) {
      showCustomAlert("Escolha a posição sorteada: " + selectedPosition);
      return;
    }
    
    // Se é a primeira rodada, obriga a usar a roleta 1
    if (remainingPositions.length === positions.length) {
      showCustomAlert("A primeira posição deve ser sorteada na roleta!");
      return;
    }

    // Se a posição já foi sorteada/concluída, ignora o clique
    if (!remainingPositions.includes(pos)) {
      return;
    }

    // Seleção manual permitida para as demais posições (bypassa a roleta 1)
    remainingPositions = remainingPositions.filter(p => p !== pos);
    selectedPosition = pos;

    // Pinta de verde na roleta 1 para indicar que a posição foi selecionada
    document.querySelectorAll("#wheelPositions .wedge").forEach(w => {
      if (w.textContent === selectedPosition) {
        w.style.color = "#7CFF00";
      }
    });
  }

  const players = playersData[pos];
  const wheel = document.getElementById("wheelPlayers");
  const leftLabel = wheel.querySelector(".half-label.left");
  const rightLabel = wheel.querySelector(".half-label.right");
  const centerText = wheel.querySelector(".wheel-center");

  if (!centerText) {
    const center = document.createElement("div");
    center.className = "wheel-center";
    wheel.appendChild(center);
  }

  wheel.querySelector(".wheel-center").innerText = "";

  if (leftLabel && rightLabel) {
    leftLabel.innerText = players[0] || "Nome 1";
    rightLabel.innerText = players[1] || "Nome 2";
  }

  clearActivePosition();
  const activeBtn = posButtons.querySelector(`[data-pos="${pos}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  if (centerText) {
    centerText.innerText = "";
  }
}

function clearActivePosition(){
  posButtons.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
}

// Roleta dos jogadores (card 3)
document.getElementById("spinPlayers").onclick = () => {
  if(!selectedPosition) {
    showCustomAlert("Escolha a posição primeiro!");
    return;
  }

  const [p1, p2] = playersData[selectedPosition];
  const isP1Winner = Math.random() < 0.5;
  const winner = isP1Winner ? p1 : p2;
  const loser = isP1Winner ? p2 : p1;

  // Sincroniza o visual: calcula o grau exato para a roleta parar debaixo da seta
  // P1 (esquerda) precisa girar 90 graus para ir ao topo, P2 (direita) precisa de 270 graus
  const randomJitter = Math.floor(Math.random() * 70) - 35; // Variação realista de -35 a +35 graus
  const offset = isP1Winner ? (90 + randomJitter) : (270 + randomJitter);

  spin("wheelPlayers", offset).then(() => {
    const wheel = document.getElementById("wheelPlayers");
    const centerText = wheel.querySelector(".wheel-center");

    if (!centerText) {
      const center = document.createElement("div");
      center.className = "wheel-center";
      wheel.appendChild(center);
    }

    wheel.querySelector(".wheel-center").innerText = "";

    // Marca o botão da posição como completado (roxo fixo)
    const activeBtn = posButtons.querySelector(`[data-pos="${selectedPosition}"]`);
    if (activeBtn) {
      activeBtn.classList.add("completed");
    }

    addToTeam("team1", selectedPosition, winner);
    addToTeam("team2", selectedPosition, loser);

    selectedPosition = null;
    clearActivePosition();
    showCustomAlert("Jogador sorteado: " + winner);
  });
};

// Adicionar ao time e renderizar os times na tela
const team1Data = {};
const team2Data = {};

function renderTeams() {
  ["team1", "team2"].forEach(teamId => {
    const div = document.getElementById(teamId);
    div.innerHTML = "";
    positions.forEach(p => {
      const data = teamId === "team1" ? team1Data : team2Data;
      const el = document.createElement("p");
      const posClass = teamId === "team1" ? "pos-label" : "pos-label t2";
      
      if (data[p]) {
        el.innerHTML = `<span class="${posClass}">${p}</span> ${data[p]}`;
      } else {
        el.innerHTML = `<span class="${posClass}">${p}</span>`;
      }
      div.appendChild(el);
    });
  });
}

function addToTeam(teamId, pos, name){
  // Salva no banco de dados de cada time
  if (teamId === "team1") {
    team1Data[pos] = name;
  } else {
    team2Data[pos] = name;
  }

  renderTeams();
}

// Inicializa as listas vazias na tela ao carregar a página
renderTeams();

// Animação de giro das roletas
const wheelRotations = {};

function spin(wheelId, offset = null){
  return new Promise(resolve => {
    const el = document.getElementById(wheelId);
    const startTime = performance.now();
    // Novos tempos: 0.5s acelerando, 1s máxima velocidade, 0.5s desacelerando (Total: 2s)
    const duration = 2000;
    const t1 = 500;
    const t2 = 1000;
    const t3 = 500;
    const fullRevs = 10; // Reduzido para encaixar bem nos 2 segundos
    const startRotation = wheelRotations[wheelId] || 0;
    
    let totalRotation;
    if (offset !== null) {
      // Correção de bug: garante que a fatia sempre caia exatamente na seta
      const currentMod = startRotation % 360;
      let targetMod = offset % 360;
      if (targetMod < 0) targetMod += 360;
      
      let extraRotation = targetMod - currentMod;
      if (extraRotation <= 0) extraRotation += 360;
      
      totalRotation = fullRevs * 360 + extraRotation;
    } else {
      // Roleta de jogadores (sem offset fixo), apenas sorteia
      totalRotation = fullRevs * 360 + Math.random() * 360;
    }

    // Fórmulas físicas de deslocamento para transições suaves
    const denominator = 1.5; // Área do gráfico de velocidade (0.25 + 1.0 + 0.25)
    const a1 = totalRotation * (0.25 / denominator);
    const a2 = totalRotation * (1.0 / denominator);
    const a3 = totalRotation * (0.25 / denominator);

    function animate(now) {
      const elapsed = now - startTime;
      if (elapsed >= duration) {
        wheelRotations[wheelId] = (startRotation + totalRotation) % 360;
        el.style.transform = `rotate(${wheelRotations[wheelId]}deg)`;
        resolve();
        return;
      }

      let currentAngle;
      if (elapsed <= t1) {
        // Fase 1: acelerando
        const p = elapsed / t1;
        currentAngle = startRotation + a1 * (p * p);
      } else if (elapsed <= t1 + t2) {
        // Fase 2: velocidade constante
        const p = (elapsed - t1) / t2;
        currentAngle = startRotation + a1 + a2 * p;
      } else {
        // Fase 3: desacelerando
        const p = (elapsed - t1 - t2) / t3;
        const easeOut = 1 - Math.pow(1 - p, 2);
        currentAngle = startRotation + a1 + a2 + a3 * easeOut;
      }

      el.style.transform = `rotate(${currentAngle}deg)`;
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  });
}

// Lógica do botão exibir times (pop up)
document.getElementById("showTeamsBtn").onclick = () => {
  const modal = document.getElementById("teamsModal");
  const content = document.getElementById("teamsModalContent");
  const list1 = document.getElementById("modalTeam1");
  const list2 = document.getElementById("modalTeam2");

  // Limpa animações e conteúdos anteriores
  content.classList.remove("glow-max", "animate-open");
  list1.innerHTML = "";
  list2.innerHTML = "";
  modal.style.display = "flex";

  // Força reinício da animação do pop up
  void content.offsetWidth;
  content.classList.add("animate-open");

  // Atraso para a animação do pop up abrir quase toda antes de listar
  let delay = 800; 
  let playersCount = 0;

  // Preenche a lista única e sequencial
  positions.forEach((pos) => {
    if (team1Data[pos]) {
      const p1 = document.createElement("div");
      p1.className = "modal-player";
      p1.innerHTML = `<span class="pos">${pos}</span> <span class="name">${team1Data[pos]}</span>`;
      list1.appendChild(p1);
      setTimeout(() => p1.classList.add("show-player"), delay);
      playersCount++;
    }
    
    if (team2Data[pos]) {
      const p2 = document.createElement("div");
      p2.className = "modal-player";
      p2.innerHTML = `<span class="pos">${pos}</span> <span class="name">${team2Data[pos]}</span>`;
      list2.appendChild(p2);
      setTimeout(() => p2.classList.add("show-player"), delay + 200); // Atraso depois do time 1 para dar efeito escada
      playersCount++;
    }
    delay += 400; // Tempo até desenhar a próxima linha
  });

  // Brilho mais forte após concluir a lista
  if (playersCount > 0) {
    setTimeout(() => content.classList.add("glow-max"), delay + 200);
  }
};

document.getElementById("closeTeamsModal").onclick = () => {
  document.getElementById("teamsModal").style.display = "none";
};