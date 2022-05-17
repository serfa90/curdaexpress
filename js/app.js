const cards = document.querySelector('#cards');
const templateCard = document.querySelector('#template-card').content;
const templateFooter = document.querySelector('#template-footer').content;
const templateCarrito = document.querySelector('#template-carrito').content;
const items = document.querySelector('#items');
const footer = document.querySelector('#footer');
const fragment = document.createDocumentFragment();
let carrito = {};

window.onload = function() {
    var contenedor = document.getElementById('loader');
   setTimeout(function(){
    contenedor.style.visibility = 'hidden';
    contenedor.style.opacity = '0';
   },3000);

}

document.addEventListener('DOMContentLoaded', ()=>{
       fetchData();
    })


cards.addEventListener('click', e =>{
    agregarCarrito(e);
})

items.addEventListener('click', e =>{
    accionBoton(e);
})
const fetchData = async() => {
    try {
        const res = await fetch('json/api.json');
        const data = await res.json();
        //console.log(data);
        pintarCards(data)
    } catch (error) {
        console.log(error);
    }
};
// Armado de cards
const pintarCards = (data) => {
    data.forEach(producto => {
        templateCard.querySelector('#tituloCard').textContent = producto.title;
        templateCard.querySelector('#precio').textContent = producto.precio;
        templateCard.querySelector('#card-img-top').setAttribute("src",producto.imagen);
        templateCard.querySelector('.btn-dark').dataset.id = producto.id;
        templateCard.querySelector('#tipo').setAttribute("category", producto.category);
        templateCard.querySelector('.producto').setAttribute("category",producto.category);

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment);
}

const agregarCarrito = e =>{
    if(e.target.classList.contains('btn-dark')){
        e.target.parentElement
        addCarrito(e.target.parentElement);
    }
    e.stopPropagation();
}

const addCarrito = (objeto) => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title:  objeto.querySelector('#tituloCard').textContent,
        precio: objeto.querySelector('#precio').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    carrito[producto.id] = {...producto};
    crearCarrito();
};

const crearCarrito = () => {
    items.innerHTML = '';
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelector('#nombre').textContent = producto.title;
        templateCarrito.querySelector('#qty').textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);
    crearFooter();
}
//Se crea el footer del carrito
const crearFooter = () =>{
    footer.innerHTML = '';
    if(Object.keys(carrito).length===0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
        return;
    };

    //Se crean los acumuladores de cantidad y precio para el carrito
    const nCantidad = Object.values(carrito).reduce((acum, {cantidad}) =>acum + cantidad,0);
    const nPrecio =Object.values(carrito).reduce((acum, {cantidad,precio}) => acum + cantidad*precio,0);
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const botonVaciar = document.querySelector('#vaciar-carrito');
    botonVaciar.addEventListener('click', ()=>{
        carrito = {};
        crearCarrito();
    })
};

const accionBoton = e => {
        if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad ++;
        carrito[e.target.dataset.id] = {...producto};
        crearCarrito();
    };
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad --;

        if (producto.cantidad === 0){
            delete carrito[e.target.dataset.id];
        };
        crearCarrito();
    };
    e.stopPropagation();
};


$('.nav-link').click(function(){
    let catProducto = $(this).attr('category');
    console.log(catProducto);
    
    $('.producto').hide();
    $('.producto[category="'+catProducto+'"]').show()
})

