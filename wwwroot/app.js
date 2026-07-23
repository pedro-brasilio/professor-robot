/* ===================================================
   ROBÔ PROFESSOR · Application Logic v2
   Toda a lógica de negócio original preservada.
   Textos reescritos: sem travessões, tom natural.
   =================================================== */

(function () {
  "use strict";

  /* ---- Referências DOM ---- */
  var terminal = document.getElementById("terminal");
  var stageArea = document.getElementById("stageArea");
  var mascot = document.getElementById("mascot");
  var mainCard = document.getElementById("mainCard");
  var mascotGreeting = document.getElementById("mascotGreeting");
  var mascotSubtitle = document.getElementById("mascotSubtitle");

  /* ---- Estado ---- */
  var state = { name: null, openOp: null };

  /* ---- Utilitários ---- */
  function addLine(html, cls, accent) {
    var d = document.createElement("div");
    d.className = "line " + (cls || "bot");
    if (accent) d.style.setProperty("--accent-color", accent);
    d.innerHTML = html;
    terminal.appendChild(d);
    terminal.scrollTop = terminal.scrollHeight;
    return d;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function parseIntStrict(v) {
    if (v === null || v === undefined) return NaN;
    v = String(v).trim();
    if (!/^-?\d+$/.test(v)) return NaN;
    return parseInt(v, 10);
  }

  /* ---- Mascot thinking ---- */
  function withThinking(requestFactory, minMs) {
    mascot.classList.add("thinking");
    var minDelay = new Promise(function (res) {
      setTimeout(res, minMs || 420);
    });
    return Promise.all([requestFactory(), minDelay]).then(
      function (results) {
        mascot.classList.remove("thinking");
        mascot.classList.add("happy");
        setTimeout(function () { mascot.classList.remove("happy"); }, 600);
        return results[0];
      },
      function (err) {
        mascot.classList.remove("thinking");
        throw err;
      }
    );
  }

  /* ---- API ---- */
  function postJson(url, body) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (r) {
      if (!r.ok) throw new Error("Falha na requisição: " + r.status);
      return r.json();
    });
  }

  /* ============================
     STEP 1: Nome
     ============================ */
  function renderNameForm() {
    mascotGreeting.textContent = "Olá! Eu sou o Robô Professor";
    mascotSubtitle.textContent = "Qual é o seu nome?";

    var question = addLine("🤖 Qual é o seu nome?");

    stageArea.innerHTML =
      '<div class="row">' +
      '<input type="text" id="nameInput" placeholder="Digite seu nome" autofocus>' +
      '<button id="nameGo">Entrar ▸</button>' +
      "</div>";

    var input = document.getElementById("nameInput");
    var go = document.getElementById("nameGo");

    function submit() {
      var v = input.value.trim();
      if (!v) {
        input.classList.add("shake");
        setTimeout(function () { input.classList.remove("shake"); }, 400);
        return;
      }

      addLine(escapeHtml(v), "user");
      state.name = v;

      question.classList.add("fade-out");
      setTimeout(function () { question.remove(); }, 500);

      mascot.classList.add("thinking");

      setTimeout(function () {
        mascot.classList.remove("thinking");
        mascot.classList.add("happy");
        setTimeout(function () { mascot.classList.remove("happy"); }, 600);

        mascotGreeting.textContent = "Olá, " + v + "! 😄";
        mascotSubtitle.textContent = "Escolha uma operação abaixo";

        var greet = addLine(
          "🤖 Prazer em te conhecer, <b>" + escapeHtml(v) + "</b>! 😄"
        );
        renderMenu();

        setTimeout(function () {
          greet.classList.add("fade-out");
          setTimeout(function () {
            greet.remove();
            addLine(
              "🤖 Hoje vamos aprender: <b>Somar ➕</b>, <b>Subtrair ➖</b>, <b>Multiplicar ✖️</b>, <b>Dividir ➗</b> e a <b>Tabuada 📋</b>!"
            );
          }, 500);
        }, 1800);
      }, 500);
    }

    go.addEventListener("click", submit);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") submit();
    });
  }

  /* ============================
     STEP 2: Menu
     ============================ */
  var OPS = [
    { key: "add", icon: "➕", label: "Somar",       endpoint: "somar",       symbol: "+", color: "var(--op-add)" },
    { key: "sub", icon: "➖", label: "Subtrair",     endpoint: "subtrair",    symbol: "−", color: "var(--op-sub)" },
    { key: "mul", icon: "✖️", label: "Multiplicar", endpoint: "multiplicar", symbol: "×", color: "var(--op-mul)" },
    { key: "div", icon: "➗", label: "Dividir",      endpoint: "dividir",     symbol: "÷", color: "var(--op-div)" },
    { key: "tab", icon: "📋", label: "Tabuada", color: "var(--op-tab)" },
    { key: "exit", icon: "👋", label: "Sair",   color: "var(--op-exit)" },
  ];

  function opByKey(key) {
    for (var i = 0; i < OPS.length; i++) {
      if (OPS[i].key === key) return OPS[i];
    }
    return null;
  }

  function renderMenu() {
    var tiles = OPS.map(function (o) {
      return (
        '<button type="button" class="tile" data-op="' + o.key + '">' +
        '<span class="ic">' + o.icon + "</span>" + o.label +
        "</button>"
      );
    }).join("");

    stageArea.innerHTML =
      '<div class="menu">' + tiles + "</div>" + '<div id="panelHost"></div>';

    stageArea.querySelectorAll(".tile").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");

        if (op === "exit") { doExit(); return; }

        stageArea.querySelectorAll(".tile").forEach(function (b) {
          b.classList.remove("active");
        });

        if (state.openOp === op) {
          state.openOp = null;
          document.getElementById("panelHost").innerHTML = "";
          return;
        }

        state.openOp = op;
        btn.classList.add("active");
        clearBoardLog();
        renderPanel(op);
      });
    });
  }

  /* ---- Limpar log ---- */
  function clearBoardLog() {
    mainCard.classList.add("wiping");
    setTimeout(function () { terminal.innerHTML = ""; }, 420);
    setTimeout(function () { mainCard.classList.remove("wiping"); }, 900);
  }

  /* ============================
     STEP 3: Painel de operação
     ============================ */
  function renderPanel(opKey) {
    var host = document.getElementById("panelHost");
    var op = opByKey(opKey);

    /* Tabuada */
    if (opKey === "tab") {
      mascotSubtitle.textContent = "Vamos ver a tabuada!";

      host.innerHTML =
        '<div class="panel" style="--accent-color:' + op.color + '">' +
        "<label>Qual tabuada você quer ver?</label>" +
        '<div class="row"><input type="text" inputmode="numeric" id="tabNum" placeholder="ex: 7"></div>' +
        '<div class="actions"><button id="tabGo">Ver tabuada 📋</button></div>' +
        "</div>";

      document.getElementById("tabGo").addEventListener("click", function () {
        var input = document.getElementById("tabNum");
        var btn = document.getElementById("tabGo");
        var n = parseIntStrict(input.value);
        if (isNaN(n)) { badNumber(input); return; }
        btn.disabled = true;
        withThinking(function () {
          return postJson("/api/tabuada", { numero: n });
        })
          .then(function (data) { showTabuada(data.numero, data.linhas); })
          .catch(function () {
            addLine("🤖 Algo deu errado ao calcular a tabuada. Tente de novo.", "bot error");
          })
          .then(function () { btn.disabled = false; });
      });
      return;
    }

    if (opKey === "exit") return;

    /* Operações aritméticas */
    var opLabels = { add: "Somar", sub: "Subtrair", mul: "Multiplicar", div: "Dividir" };
    mascotSubtitle.textContent = "Vamos " + (opLabels[opKey] || "") + "!";

    var label1 = opKey === "sub" ? "Número maior" : "Primeiro número";
    var label2 = opKey === "sub" ? "Número a tirar" : "Segundo número";

    host.innerHTML =
      '<div class="panel" style="--accent-color:' + op.color + '">' +
      '<div class="eq-row">' +
      "<div><label>" + label1 + '</label><input type="text" inputmode="numeric" id="opA" style="width:120px" placeholder="0"></div>' +
      '<span class="sym">' + op.symbol + "</span>" +
      "<div><label>" + label2 + '</label><input type="text" inputmode="numeric" id="opB" style="width:120px" placeholder="0"></div>' +
      "</div>" +
      '<div class="actions"><button id="opGo">Calcular =</button></div>' +
      "</div>";

    document.getElementById("opGo").addEventListener("click", function () {
      var ia = document.getElementById("opA");
      var ib = document.getElementById("opB");
      var btn = document.getElementById("opGo");
      var a = parseIntStrict(ia.value);
      var b = parseIntStrict(ib.value);

      if (isNaN(a)) { badNumber(ia); return; }
      if (isNaN(b)) { badNumber(ib); return; }

      if (opKey === "div" && b === 0) {
        ib.classList.add("shake");
        setTimeout(function () { ib.classList.remove("shake"); }, 400);
        addLine("🤖 Não dá pra dividir por zero! Escolha outro número. 🚫", "bot error");
        return;
      }

      btn.disabled = true;
      withThinking(function () {
        return postJson("/api/" + op.endpoint, { a: a, b: b });
      })
        .then(function (data) {
          showResult(op.symbol, data.a, data.b, data.resultado);
          addLine(explainResult(opKey, data.a, data.b, data.resultado), "bot explain", op.color);
        })
        .catch(function () {
          addLine("🤖 Algo deu errado ao calcular. Tente de novo.", "bot error");
        })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---- Validação ---- */
  function badNumber(input) {
    input.classList.add("shake");
    setTimeout(function () { input.classList.remove("shake"); }, 400);
    addLine("🤖 Isso não parece um número. Tente algo como 7 ou 12.", "bot error");
  }

  /* ---- Formatação ---- */
  function formatNumber(n) {
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  }

  /* ---- Resultado ---- */
  function showResult(sym, a, b, resultado) {
    addLine(
      a +
      ' <span class="op">' + sym + "</span> " +
      b +
      ' <span class="op">=</span> <span class="res">' +
      formatNumber(resultado) +
      "</span>",
      "equation"
    );
  }

  /* ---- Explicação didática (sem travessões) ---- */
  function repeatedAddition(a, times) {
    if (times <= 0 || times > 10) return null;
    var parts = [];
    for (var i = 0; i < times; i++) { parts.push(a); }
    return parts.join(" + ");
  }

  function explainResult(opKey, a, b, resultado) {
    var r = formatNumber(resultado);

    if (opKey === "add") {
      return (
        "🤖 Somar é juntar duas quantidades. " +
        a + " bolinhas ⚪ mais " + b + " bolinhas ⚪ formam um grupo de " +
        a + " + " + b + " = " + r + " bolinhas ao todo."
      );
    }

    if (opKey === "sub") {
      return (
        "🤖 Subtrair é tirar uma quantidade de outra. De " +
        a + " bolinhas ⚪, apagando " + b + " delas, restam " +
        a + " − " + b + " = " + r + " bolinhas."
      );
    }

    if (opKey === "mul") {
      var soma = repeatedAddition(a, b);
      var passos = soma
        ? soma + " = " + r
        : a + " somado " + b + " vezes = " + r;
      return (
        "🤖 Multiplicar é somar o mesmo número várias vezes. " +
        a + " × " + b + " é o mesmo que " + passos + "."
      );
    }

    /* Divisão */
    var sobra = Number.isInteger(resultado)
      ? "A divisão é exata, sem sobrar nada."
      : a + " não se divide em partes inteiras, por isso o resultado tem vírgula.";

    return (
      "🤖 Dividir é repartir em partes iguais. Separando " +
      a + " bolinhas ⚪ em " + b + " grupos, cada grupo fica com " +
      r + ". " + sobra
    );
  }

  /* ---- Tabuada ---- */
  function showTabuada(n, linhas) {
    addLine("🤖 Aqui está a tabuada do <b>" + n + "</b>:");
    var host = document.createElement("div");
    host.className = "table-grid";
    terminal.appendChild(host);
    linhas.forEach(function (linha) {
      var s = document.createElement("span");
      s.textContent = n + " × " + linha.i + " = " + linha.resultado;
      s.style.animationDelay = linha.i * 35 + "ms";
      host.appendChild(s);
    });
    terminal.scrollTop = terminal.scrollHeight;
  }

  /* ============================
     EXIT
     ============================ */
  function doExit() {
    mainCard.classList.add("wiping");
    setTimeout(function () {
      terminal.innerHTML = "";
      stageArea.innerHTML = "";
      mascotGreeting.textContent = "Até logo! 👋";
      mascotSubtitle.textContent = "Bons estudos!";
      addLine(
        "🤖 Tchau" +
        (state.name ? ", " + escapeHtml(state.name) : "") +
        "! Bons estudos! 👋📚"
      );
      stageArea.innerHTML =
        '<div class="actions">' +
        '<button class="ghost" id="restart">Começar de novo ↺</button>' +
        "</div>";
      document.getElementById("restart").addEventListener("click", function () {
        state = { name: null, openOp: null };
        terminal.innerHTML = "";
        renderNameForm();
      });
    }, 420);
    setTimeout(function () { mainCard.classList.remove("wiping"); }, 900);
  }

  /* ---- Init ---- */
  renderNameForm();
})();
