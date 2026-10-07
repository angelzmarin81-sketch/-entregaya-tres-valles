const businesses = [
  {
    id: 1,
    name: "Cocina La Vallesana",
    cat: "Comida",
    items: [
      ["Hamburguesa", 120],
      ["Alitas", 150],
      ["Torta de pollo", 90]
    ]
  },
  {
    id: 2,
    name: "Súper Express",
    cat: "Despensa",
    items: [
      ["Despensa básica", 180],
      ["Refresco 2L", 38],
      ["Papel higiénico", 65]
    ]
  },
  {
    id: 3,
    name: "Farmacia Centro",
    cat: "Farmacia",
    items: [
      ["Kit de higiene", 110],
      ["Protector solar", 165],
      ["Shampoo", 85]
    ]
  }
];

const key = "entregaya-demo";

let data = JSON.parse(
  localStorage.getItem(key) || '{"cart":[],"orders":[]}'
);

const $ = selector => document.querySelector(selector);

const money = number =>
  "$" + Number(number).toFixed(2);

function save() {
  localStorage.setItem(key, JSON.stringify(data));
  render();
}

function renderBusinesses() {

  $("#businesses").innerHTML = businesses.map(b => `
    <div class="card">

      <span class="status">${b.cat}</span>

      <h3>${b.name}</h3>

      <p class="muted">
        Productos de ejemplo
      </p>

      ${b.items.map((p, i) => `
        <div class="product">

          <span>
            ${p[0]}<br>
            <b>${money(p[1])}</b>
          </span>

          <button onclick="add(${b.id},${i})">
            + Agregar
          </button>

        </div>
      `).join("")}

    </div>
  `).join("");
}

window.add = (businessId, itemIndex) => {

  const business =
    businesses.find(x => x.id === businessId);

  const product =
    business.items[itemIndex];

  data.cart.push({
    business: business.name,
    name: product[0],
    price: product[1]
  });

  save();
};

function renderCart() {

  const subtotal =
    data.cart.reduce((total, item) =>
      total + item.price, 0);

  const delivery =
    data.cart.length ? 30 : 0;

  const commission =
    subtotal * 0.10;

  $("#cartItems").innerHTML =
    data.cart.length

      ? data.cart.map((item, index) => `
          <div class="product">

            <span>
              ${item.name}<br>
              <small>${money(item.price)}</small>
            </span>

            <button onclick="removeItem(${index})">
              ×
            </button>

          </div>
        `).join("")

      : '<p class="muted">Tu carrito está vacío.</p>';

  $("#subtotal").textContent =
    money(subtotal);

  $("#delivery").textContent =
    money(delivery);

  $("#commission").textContent =
    money(commission);

  $("#total").textContent =
    money(subtotal + delivery + commission);
}

window.removeItem = index => {

  data.cart.splice(index, 1);

  save();
};

$("#orderBtn").onclick = () => {

  if (!data.cart.length) {

    alert("Agrega al menos un producto.");

    return;
  }

  const subtotal =
    data.cart.reduce((total, item) =>
      total + item.price, 0);

  const order = {

    id:
      "EY-" +
      Date.now()
        .toString()
        .slice(-6),

    items: [...data.cart],

    subtotal,

    delivery: 30,

    commission:
      subtotal * 0.10,

    total:
      subtotal +
      30 +
      subtotal * 0.10,

    payment:
      $("#payment").value,

    status:
      "Nuevo",

    date:
      new Date().toLocaleString("es-MX")
  };

  data.orders.unshift(order);

  data.cart = [];

  save();

  alert(
    "Pedido creado: " +
    order.id
  );
};

function renderOrders() {

  const orders =
    data.orders;

  $("#businessOrders").innerHTML =
    orders.length

      ? orders
          .map(order => orderHtml(order, true))
          .join("")

      : '<p class="muted">Todavía no hay pedidos.</p>';

  $("#riderOrders").innerHTML =
    orders.length

      ? orders
          .map(order => orderHtml(order, false))
          .join("")

      : '<p class="muted">Todavía no hay entregas.</p>';
}

function orderHtml(order, business) {

  return `
    <div class="order">

      <b>${order.id}</b>
      · ${money(order.total)}

      <span class="status">
        ${order.status}
      </span>

      <p>
        ${order.items
          .map(item => item.name)
          .join(", ")}
        · ${order.payment}
      </p>

      <p class="muted">
        ${order.date}
      </p>

      <button
        class="primary"
        onclick="advance('${order.id}')"
      >
        ${
          business
            ? "Avanzar negocio"
            : "Avanzar entrega"
        }
      </button>

    </div>
  `;
}

window.advance = id => {

  const order =
    data.orders.find(x =>
      x.id === id);

  if (!order) return;

  if (order.status === "Nuevo") {

    order.status = "Aceptado";

  } else if (order.status === "Aceptado") {

    order.status = "Listo";

  } else if (order.status === "Listo") {

    order.status = "En camino";

  } else {

    order.status = "Entregado";
  }

  save();
};

function renderAdmin() {

  const orders =
    data.orders;

  const subtotal =
    orders.reduce(
      (total, order) =>
        total + order.subtotal,
      0
    );

  const commission =
    orders.reduce(
      (total, order) =>
        total + order.commission,
      0
    );

  const delivery =
    orders.reduce(
      (total, order) =>
        total + order.delivery,
      0
    );

  $("#adminStats").innerHTML = [

    ["Pedidos", orders.length],

    [
      "Ventas de comercios",
      money(subtotal)
    ],

    [
      "Comisión plataforma",
      money(commission)
    ],

    [
      "Envío generado",
      money(delivery)
    ]

  ].map(item => `

    <div class="stat">

      ${item[0]}

      <b>${item[1]}</b>

    </div>

  `).join("");

  $("#riderStats").innerHTML = [

    [
      "Entregados",
      orders.filter(
        order =>
          order.status === "Entregado"
      ).length
    ],

    [
      "Efectivo registrado",
      money(
        orders
          .filter(
            order =>
              order.payment === "Efectivo"
          )
          .reduce(
            (total, order) =>
              total + order.total,
            0
          )
      )
    ],

    [
      "Envíos",
      money(delivery)
    ]

  ].map(item => `

    <div class="stat">

      ${item[0]}

      <b>${item[1]}</b>

    </div>

  `).join("");
}

function simulate() {

  const value = id =>
    Number($("#" + id).value) || 0;

  const orders =
    value("sOrders") *
    value("sDays");

  const platformIncome =
    orders *
    value("sTicket") *
    (value("sComm") / 100);

  const estimatedCosts =
    platformIncome * 0.04 +
    value("sFixed");

  const profit =
    platformIncome -
    estimatedCosts;

  $("#profit").innerHTML = `

    <div class="result">

      <b>Pedidos/mes:</b>
      ${orders.toLocaleString()}

      <br>

      <b>Ingreso de plataforma:</b>
      ${money(platformIncome)}

      <br>

      <b>Costos estimados:</b>
      ${money(estimatedCosts)}

      <br>

      <b>Resultado preliminar:</b>
      ${money(profit)}

      <p class="muted">
        El envío se considera ingreso del
        repartidor, no utilidad de la plataforma.
        El 4% es una provisión de prueba.
      </p>

    </div>
  `;
}

document
  .querySelectorAll(".tab")
  .forEach(button => {

    button.onclick = () => {

      document
        .querySelectorAll(".tab")
        .forEach(item =>
          item.classList.remove("active")
        );

      document
        .querySelectorAll(".panel")
        .forEach(panel =>
          panel.classList.remove("active")
        );

      button.classList.add("active");

      $(
        "#" + button.dataset.tab
      ).classList.add("active");
    };

  });

$("#simulate").onclick =
  simulate;

$("#reset").onclick = () => {

  if (
    confirm(
      "¿Reiniciar toda la demo?"
    )
  ) {

    data = {
      cart: [],
      orders: []
    };

    save();

    simulate();
  }
};

function render() {

  renderBusinesses();

  renderCart();

  renderOrders();

  renderAdmin();
}

render();

simulate();
