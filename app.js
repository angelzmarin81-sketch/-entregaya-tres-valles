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
  localStorage.getItem(key) ||
  '{"cart":[],"orders":[]}'
);

const $ = selector =>
  document.querySelector(selector);

const money = number =>
  "$" + Number(number || 0).toFixed(2);


function save() {
  localStorage.setItem(
    key,
    JSON.stringify(data)
  );

  render();
}


/* =========================
   NEGOCIOS
========================= */

function renderBusinesses() {

  $("#businesses").innerHTML =
    businesses.map(b => `

      <div class="card">

        <span class="status">
          ${b.cat}
        </span>

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

            <button
              onclick="add(${b.id},${i})">
              + Agregar
            </button>

          </div>

        `).join("")}

      </div>

    `).join("");
}


window.add = (
  businessId,
  itemIndex
) => {

  const business =
    businesses.find(
      x => x.id === businessId
    );

  const product =
    business.items[itemIndex];

  /*
   * Para el MVP cada pedido pertenece
   * a un solo negocio.
   */

  if (
    data.cart.length &&
    data.cart[0].business !== business.name
  ) {

    alert(
      "Por ahora cada pedido debe ser de un solo negocio. Vacía el carrito para comprar en otro."
    );

    return;
  }

  data.cart.push({

    business: business.name,

    name: product[0],

    price: product[1]

  });

  save();
};


/* =========================
   CARRITO
========================= */

function renderCart() {

  const subtotal =
    data.cart.reduce(
      (total, item) =>
        total + item.price,
      0
    );

  const delivery =
    data.cart.length ? 30 : 0;

  const commission =
    subtotal * 0.10;

  $("#cartItems").innerHTML =
    data.cart.length

      ? data.cart.map(
          (item, index) => `

            <div class="product">

              <span>
                ${item.name}<br>
                <small>
                  ${money(item.price)}
                </small>
              </span>

              <button
                onclick="removeItem(${index})">
                ×
              </button>

            </div>

          `
        ).join("")

      : `
        <p class="muted">
          Tu carrito está vacío.
        </p>
      `;

  $("#subtotal").textContent =
    money(subtotal);

  $("#delivery").textContent =
    money(delivery);

  $("#commission").textContent =
    money(commission);

  $("#total").textContent =
    money(
      subtotal +
      delivery +
      commission
    );
}


window.removeItem = index => {

  data.cart.splice(index, 1);

  save();
};


/* =========================
   CREAR PEDIDO
========================= */

$("#orderBtn").onclick = () => {

  if (!data.cart.length) {

    alert(
      "Agrega al menos un producto."
    );

    return;
  }

  const name =
    $("#customerName").value.trim();

  const phone =
    $("#customerPhone").value.trim();

  const address =
    $("#customerAddress").value.trim();

  const reference =
    $("#customerReference").value.trim();

  if (!name) {

    alert(
      "Escribe el nombre del cliente."
    );

    return;
  }

  if (!phone) {

    alert(
      "Escribe un número de teléfono."
    );

    return;
  }

  if (!address) {

    alert(
      "Escribe la dirección de entrega."
    );

    return;
  }

  const subtotal =
    data.cart.reduce(
      (total, item) =>
        total + item.price,
      0
    );

  const delivery = 30;

  const commission =
    subtotal * 0.10;

  const total =
    subtotal +
    delivery +
    commission;

  const order = {

    id:
      "EY-" +
      Date.now()
        .toString()
        .slice(-6),

    business:
      data.cart[0].business,

    items:
      [...data.cart],

    subtotal,

    delivery,

    commission,

    total,

    payment:
      $("#payment").value,

    customer: {

      name,

      phone,

      address,

      reference

    },

    status:
      "Nuevo",

    rider:
      null,

    date:
      new Date()
        .toLocaleString("es-MX")

  };

  data.orders.unshift(order);

  data.cart = [];

  save();

  alert(
    "Pedido creado: " +
    order.id
  );

};


/* =========================
   NEGOCIO
========================= */

function businessOrderHtml(order) {

  const customer =
    order.customer || {};

  let actions = "";

  if (order.status === "Nuevo") {

    actions = `

      <div class="order-actions">

        <button
          class="primary"
          onclick="acceptBusiness('${order.id}')">
          ✓ Aceptar pedido
        </button>

        <button
          class="danger"
          onclick="rejectBusiness('${order.id}')">
          ✕ Rechazar
        </button>

      </div>

    `;

  } else if (
    order.status === "Aceptado"
  ) {

    actions = `

      <button
        class="primary"
        onclick="markReady('${order.id}')">
        📦 Marcar como listo
      </button>

    `;

  } else if (
    order.status === "Listo"
  ) {

    actions = `
      <p class="muted">
        Esperando repartidor...
      </p>
    `;

  } else {

    actions = `
      <p class="muted">
        Repartidor:
        ${order.rider || "Pendiente"}
      </p>
    `;

  }

  return `

    <div class="order">

      <b>${order.id}</b>

      <span class="status">
        ${order.status}
      </span>

      <p>
        <b>Cliente:</b>
        ${customer.name || "Cliente demo"}
      </p>

      <p>
        <b>Teléfono:</b>
        ${customer.phone || "No registrado"}
      </p>

      <p>
        <b>Dirección:</b>
        ${customer.address || "No registrada"}
      </p>

      ${
        customer.reference
          ? `
            <p>
              <b>Referencia:</b>
              ${customer.reference}
            </p>
          `
          : ""
      }

      <p>
        ${order.items
          .map(item => item.name)
          .join(", ")}
      </p>

      <p>
        <b>Total:</b>
        ${money(order.total)}
      </p>

      <p class="muted">
        Pago:
        ${order.payment}
      </p>

      ${actions}

    </div>

  `;
}


window.acceptBusiness = id => {

  const order =
    data.orders.find(
      x => x.id === id
    );

  if (!order) return;

  order.status =
    "Aceptado";

  save();

};


window.rejectBusiness = id => {

  const order =
    data.orders.find(
      x => x.id === id
    );

  if (!order) return;

  order.status =
    "Rechazado";

  save();

};


window.markReady = id => {

  const order =
    data.orders.find(
      x => x.id === id
    );

  if (!order) return;

  order.status =
    "Listo";

  save();

};


/* =========================
   REPARTIDOR
========================= */

function riderOrderHtml(order) {

  const customer =
    order.customer || {};

  let actions = "";

  if (
    order.status === "Listo"
  ) {

    actions = `

      <button
        class="primary"
        onclick="takeDelivery('${order.id}')">
        🛵 Aceptar entrega
      </button>

    `;

  } else if (
    order.status ===
    "Repartidor asignado"
  ) {

    actions = `

      <button
        class="primary"
        onclick="startDelivery('${order.id}')">
        🚚 Iniciar entrega
      </button>

    `;

  } else if (
    order.status === "En camino"
  ) {

    actions = `

      <button
        class="primary"
        onclick="completeDelivery('${order.id}')">
        ✓ Marcar entregado
      </button>

    `;

  } else if (
    order.status === "Entregado"
  ) {

    actions = `
      <p class="muted">
        Entrega completada.
      </p>
    `;

  } else {

    actions = `
      <p class="muted">
        Este pedido aún no está disponible
        para entrega.
      </p>
    `;

  }

  return `

    <div class="order">

      <b>${order.id}</b>

      <span class="status">
        ${order.status}
      </span>

      <p>
        <b>Cliente:</b>
        ${customer.name || "Cliente demo"}
      </p>

      <p>
        <b>Dirección:</b>
        ${customer.address || "No registrada"}
      </p>

      ${
        customer.reference
          ? `
            <p>
              <b>Referencia:</b>
              ${customer.reference}
            </p>
          `
          : ""
      }

      <p>
        <b>Total:</b>
        ${money(order.total)}
      </p>

      <p>
        <b>Pago:</b>
        ${order.payment}
      </p>

      ${
        order.payment === "Efectivo"
          ? `
            <p>
              💵 Cobrar al cliente:
              <b>${money(order.total)}</b>
            </p>
          `
          : `
            <p class="muted">
              💳 Pago con tarjeta demo.
              No cobrar efectivo al cliente.
            </p>
          `
      }

      ${actions}

    </div>

  `;
}


window.takeDelivery = id => {

  const order =
    data.orders.find(
      x => x.id === id
    );

  if (!order) return;

  order.rider =
    "Repartidor Demo";

  order.status =
    "Repartidor asignado";

  save();

};


window.startDelivery = id => {

  const order =
    data.orders.find(
      x => x.id === id
    );

  if (!order) return;

  order.status =
    "En camino";

  save();

};


window.completeDelivery = id => {

  const order =
    data.orders.find(
      x => x.id === id
    );

  if (!order) return;

  order.status =
    "Entregado";

  save();

};


/* =========================
   PEDIDOS
========================= */

function renderOrders() {

  $("#businessOrders").innerHTML =
    data.orders.length

      ? data.orders
          .map(order =>
            businessOrderHtml(order)
          )
          .join("")

      : `
        <p class="muted">
          Todavía no hay pedidos.
        </p>
      `;


  $("#riderOrders").innerHTML =
    data.orders.length

      ? data.orders
          .map(order =>
            riderOrderHtml(order)
          )
          .join("")

      : `
        <p class="muted">
          Todavía no hay entregas.
        </p>
      `;
}


/* =========================
   ADMINISTRACIÓN
========================= */

function renderAdmin() {

  const orders =
    data.orders;

  const subtotal =
    orders.reduce(
      (total, order) =>
        total +
        Number(order.subtotal || 0),
      0
    );

  const commission =
    orders.reduce(
      (total, order) =>
        total +
        Number(order.commission || 0),
      0
    );

  const delivery =
    orders.reduce(
      (total, order) =>
        total +
        Number(order.delivery || 0),
      0
    );

  const delivered =
    orders.filter(
      order =>
        order.status === "Entregado"
    ).length;


  $("#adminStats").innerHTML = [

    [
      "Pedidos",
      orders.length
    ],

    [
      "Entregados",
      delivered
    ],

    [
      "Ventas de comercios",
      money(subtotal)
    ],

    [
      "Comisión plataforma",
      money(commission)
    ],

    [
      "Envíos para repartidores",
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
      delivered
    ],

    [
      "Envíos generados",
      money(delivery)
    ],

    [
      "Efectivo registrado",
      money(
        orders
          .filter(
            order =>
              order.payment ===
              "Efectivo"
          )
          .reduce(
            (total, order) =>
              total +
              Number(order.total || 0),
            0
          )
      )
    ]

  ].map(item => `

    <div class="stat">

      ${item[0]}

      <b>${item[1]}</b>

    </div>

  `).join("");


  $("#ledger").innerHTML =
    orders.length

      ? orders.map(order => {

          const customer =
            order.customer || {};

          return `

            <div class="order">

              <b>${order.id}</b>

              <span class="status">
                ${order.status}
              </span>

              <p>
                Cliente:
                <b>
                  ${customer.name ||
                    "Cliente demo"}
                </b>
              </p>

              <div class="money-breakdown">

                <div>
                  🏪 Negocio
                  <b>
                    ${money(
                      order.subtotal
                    )}
                  </b>
                </div>

                <div>
                  🛵 Repartidor
                  <b>
                    ${money(
                      order.delivery
                    )}
                  </b>
                </div>

                <div>
                  💜 Plataforma
                  <b>
                    ${money(
                      order.commission
                    )}
                  </b>
                </div>

              </div>

              <p>
                Total cliente:
                <b>
                  ${money(order.total)}
                </b>
              </p>

              ${
                order.payment ===
                "Efectivo"

                  ? `
                    <p>
                      💵 El repartidor cobra:
                      <b>
                        ${money(order.total)}
                      </b>
                    </p>
                  `

                  : `
                    <p class="muted">
                      💳 Pago digital
                      simulado.
                    </p>
                  `
              }

            </div>

          `;

        }).join("")

      : `
        <p class="muted">
          Todavía no hay movimientos.
        </p>
      `;
}


/* =========================
   SIMULADOR
========================= */

function simulate() {

  const value = id =>
    Number(
      $("#" + id).value
    ) || 0;

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

        El envío se considera ingreso
        del repartidor, no utilidad de
        la plataforma.

        El 4% es una provisión de prueba.

      </p>

    </div>

  `;
}


/* =========================
   NAVEGACIÓN
========================= */

document
  .querySelectorAll(".tab")
  .forEach(button => {

    button.onclick = () => {

      document
        .querySelectorAll(".tab")
        .forEach(item =>
          item.classList.remove(
            "active"
          )
        );

      document
        .querySelectorAll(".panel")
        .forEach(panel =>
          panel.classList.remove(
            "active"
          )
        );

      button.classList.add(
        "active"
      );

      $(
        "#" +
        button.dataset.tab
      ).classList.add(
        "active"
      );

    };

  });


$("#simulate").onclick =
  simulate;


/* =========================
   REINICIAR
========================= */

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


/* =========================
   INICIAR
========================= */

function render() {

  renderBusinesses();

  renderCart();

  renderOrders();

  renderAdmin();

}

render();

simulate();
