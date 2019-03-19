import Navigation from './src/Navigation';
import Header from './src/Header';
import Content from './src/Content';
import Footer from './src/Footer';
import axios from 'axios';


var State = {
    'filter': null,
    'books': [],
    'albums': []
};


var root = document.querySelector('#root');


function render(state){
    root.innerHTML = `
    ${Navigation(state)}
    ${Header(state)}
    ${Content(state)}
    ${Footer(state)}
    `;

    document.querySelectorAll('#navigation a').forEach((link) => link.addEventListener('click', (event) => {
        event.preventDefault();
        State.filter = 'books';
        render(State);
    }));

    document.querySelectorAll('#navigation a:nth-of-type(2)').forEach((link) => link.addEventListener('click', (event) => {
        event.preventDefault();
        State.filter = 'album';
        render(State);
    }));


    document.querySelector('form').addEventListener('submit', (event) => {
        var newProduct;

        event.preventDefault();
  
        newProduct = Array
            .from(event.target.elements)
            .map((element) => ({ 'name': element.name, 'value': element.value }))
            .filter((element) => element.name)
            .reduce(
                (accumulator, original) => {
                    if(original.name === 'selling_points'){
                        accumulator[original.name] = original.value.split('\n');
                    }
                    else{
                        accumulator[original.name] = original.value;
                    }
                    
                    return accumulator;
                },
                {}
            );

        axios
            .post(`https://api.savvycoders.com/${newProduct.type}s`, newProduct)
            .then((response) => console.log('this is the response ->', response));

        State[`${newProduct.type}s`].push(newProduct);

        render(State);
    });
}

axios
    .get('https://api.savvycoders.com/books')
    .then((response) => {
        State.books = response.data;
        render(State);
    });

axios
    .get('https://api.savvycoders.com/albums')
    .then((response) => {
        State.albums = response.data;
        render(State);
    });
