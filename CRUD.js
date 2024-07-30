const deseoInput = document.getElementById("deseo");
const prioridadSelect = document.getElementById("prioridad");
const categoriaSelect = document.getElementById("categoria");
const agregarBtn = document.getElementById("agregarBtn");
const listaDeseos = document.getElementById("listaDeseos");
const modoBtn = document.getElementById('modoBtn');

let deseos = [];

// Cargar deseos desde localStorage al iniciar
window.addEventListener('load', cargarDeseos);

agregarBtn.addEventListener("click", agregarDeseo);

function agregarDeseo() {
    const nuevoDeseo = deseoInput.value;
    const prioridad = prioridadSelect.value;
    const categoria = categoriaSelect.value;

    if (nuevoDeseo.trim() !== "") {
        deseos.push({ deseo: nuevoDeseo, prioridad, categoria });
        mostrarDeseos();
        guardarDeseos();
        deseoInput.value = "";
    }
}

function mostrarDeseos(filtrarPrioridad = "", filtrarCategoria = "") {
    listaDeseos.innerHTML = "";

    deseos.forEach((deseo, index) => {
        if ((filtrarPrioridad === "" || (deseo.prioridad && deseo.prioridad === filtrarPrioridad)) &&
            (filtrarCategoria === "" || (deseo.categoria && deseo.categoria === filtrarCategoria))) {

            const listItem = document.createElement("li");
            listItem.setAttribute('data-prioridad', deseo.prioridad);
            listItem.classList.add('fade-in'); // Agregar clase para animación

            // Agregar icono según la categoría
            let icono = "";
            switch (deseo.categoria) {
                case "viajes":
                    icono = '<i class="fas fa-plane"></i>';
                    break;
                case "tecnologia":
                    icono = '<i class="fas fa-laptop"></i>';
                    break;
                case "experiencias":
                    icono = '<i class="fas fa-gift"></i>';
                    break;
                default:
                    icono = '<i class="fas fa-star"></i>';
            }

            listItem.innerHTML = `
                ${icono}
                ${deseo.deseo} 
                (${deseo.prioridad ? deseo.prioridad : ""}, 
                 ${deseo.categoria ? deseo.categoria : ""})
                <div>
                    <button onclick="editarDeseo(${index})">Editar</button>
                    <button class="eliminar" onclick="eliminarDeseo(${index})">Eliminar</button>
                </div>
            `;

            listaDeseos.appendChild(listItem);
        }
    });
}

function filtrarPorPrioridad(prioridad) {
    mostrarDeseos(prioridad, "");
}

function filtrarPorCategoria(categoria) {
    mostrarDeseos("", categoria);
}

function eliminarDeseo(index) {
    deseos.splice(index, 1);
    mostrarDeseos();
    guardarDeseos();
}

function editarDeseo(index) {
    const nuevoDeseo = prompt("Editar deseo:", deseos[index].deseo);
    if (nuevoDeseo !== null && nuevoDeseo.trim() !== "") {
        deseos[index].deseo = nuevoDeseo;
        mostrarDeseos();
        guardarDeseos();
    }
}

function guardarDeseos() {
    localStorage.setItem("deseos", JSON.stringify(deseos));
}

function cargarDeseos() {
    const deseosGuardados = localStorage.getItem("deseos");
    if (deseosGuardados) {
        deseos = JSON.parse(deseosGuardados);
        mostrarDeseos();
    }
}


modoBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        modoBtn.textContent = 'Modo Claro';
    } else {
        modoBtn.textContent = 'Modo Oscuro';
    }
});


new Sortable(listaDeseos, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    onUpdate: function (evt) {
        deseos.splice(evt.newIndex, 0, deseos.splice(evt.oldIndex, 1)[0]);
        guardarDeseos();
    },
});
