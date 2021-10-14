/*
 * SOME PROBLEMS IN THIS PROJECT & I'VE NOT FOUND SOLUTION YET:
 * - why type == grass but backgrond-color (bg) doen't change : 
 *      let grass = 'green';
 *      document.getElementById(`pkmCard${i}`).style.backgroundColor = type;
 * - to add an event 'click' in pkmCard with a function WITH PARAMETERS, I've found no way.
 *      this doesn't work:
 *          document.getElementById(`pkmCard(${i})`).addEventListener("click", makeBig(this, allPokemons, i) )
 *      this doesn't work:
 *          document.getElementById(`pkmCard(${i})`).addEventListener("click", makeBig.bind(this, allPokemons, i) )
 *      this doesn't work:
 *          document.getElementById(`pkmCard(${i})`).onclick = makeBig(this, allPokemons, i)
 *      this doesn't work:
 *          document.getElementById(`pkmCard(${i})`).onclick = function() {makeBig(this, allPokemons, i)}
 *      this doesn't work:
 *          document.getElementById(`pkmCard(${i})`).addEventListener("click", function(){
 *              makeBig(this, allPokemons, i)
 *          } );
 *   What is the solution for this problem?
 * 
*/

/**
 * IMPORTANT NOTICES
 * - cardCover is the solution for the request:
 *      click on pkmCard to make it big
 */


/**
 * SHORTCUTS
 * - pkm:   pokemon
 * - pkms:  pokemons
 */

let offset = 0;
let allPokemons =[];

async function loadpkms() {
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}`;
    let response = await fetch(url);
    let pkms = await response.json();
    for (let p = 0; p < pkms.results.length; p++) {
        const item = pkms.results[p];
        let url = item.url
        let response = await fetch(url)
        let pokemon = await response.json()
        allPokemons.push(pokemon)
    }
    //////this forEach Methode doesn't work for an async function/////
    // pkms.results.forEach(async (item) => {
    //     let url = item.url
    //     let response = await fetch(url)
    //     let pokemon = await response.json()
    //     allPokemons.push(pokemon)
    // })
    console.log(allPokemons);
    document.getElementById('pkms').innerHTML = ``;
    renderpkmCards();
}

function renderpkmCards() {
    for (let i = 0; i < allPokemons.length; i++) {
        let pkm = allPokemons[i];
        let name = pkm.name;
        let front_default = pkm.sprites.other['official-artwork'].front_default;
        let id = pkm.id;
        let types = pkm.types;
        let base_experience = pkm.base_experience;
        let weight = pkm.weight;
        let height = pkm.height;
        document.getElementById('pkms').innerHTML += `
            <div class="pkmCard bg-${types[0].type.name}" id="pkmCard(${i})" >
                <div class="cardCover"  onclick="makeBig(${i})" id="cardCover(${i})""></div>
                <div class="header">
                    <i class="backBtn fas fa-arrow-left" onclick="makeSmall(${i})" style="display:none"></i>
                    <h5 id="name">${name}</h5>
                    <div>#${id}</div>
                </div>
                <div class="img">
                    <img src='${front_default}'>
                </div>
                <div class="types" id="types(${i})"></div>
                <div class="detail" style="display:none;">
                    <div class="text-center m-1">Base Experience ${base_experience}</div>
                    <div class="d-flex flex-row justify-content-evenly">
                        <div>Weight ${weight}</div>
                        <div>Height ${height}</div>
                    </div>
                    <div id="pkmCardNav(${i})" class="pkmCardNav"></div>
                    <table id="abilities(${i})" class="abilities"></table>
                    <table id="stats(${i})" class="stats"></table>
                    <div id="evolution(${i})" class="evolution"></div>
                    <div id="moves(${i})" class="moves"></div>
                </div>
            </div>
        `;
        loadTypes(types, i);
        loadpkmCardNav(i);
        loadStats(pkm, i);
        document.getElementById(`pkmCard(${i})`).style.transition = "all 0.1s";
        document.getElementById('loadingIcon').style = 'display: none';
    }
}

function loadTypes(types, i) {
    types.forEach(item => {
        let type = item.type.name;
        document.getElementById(`types(${i})`).innerHTML += `
            <div id="${type}" class="bg-${type}">${type}</div>
        `;
    })
}

function loadpkmCardNav(i){
    document.getElementById(`pkmCardNav(${i})`).innerHTML = `
        <nav class="d-flex flex-row justify-content-evenly">
            <a onclick="activeMark(this)">Abilities</a>
            <a onclick="activeMark(this)" class="active">Stats</a>
            <a onclick="activeMark(this)">Evolution</a>
            <a onclick="activeMark(this)">Moves</a>
        </nav>
    `;
}

//change underline navbar item by click
function activeMark(a){
    let navItems = document.querySelectorAll('nav a');
    navItems.forEach(element => {
        element.classList.remove('active');
    });
    a.classList.add('active');
}

function loadStats(pkm, i){
    pkm.stats.forEach(item =>{
        document.getElementById(`stats(${i})`).innerHTML +=`
            <tr>
                <th class="statName">${item.stat.name}</th>
                <td>${item.base_stat}</td>
                <td>
                    <div class="progress" style="height:6px;">
                        <div  style="width: ${item.base_stat / 3}%;" class="progress-bar progress-bar-striped progress-bar-animated" aria-valuenow="${item.base_stat / 3}" aria-valuemin="0" aria-valuemax="300"></div>
                    </div>
                </td>
            </tr>
        `;
    })
}

function makeBig(i){
    let currentPkmCard = document.getElementById(`pkmCard(${i})`);
    currentPkmCard.querySelector('.backBtn').style ='display:block';
    currentPkmCard.classList.add('large');
    currentPkmCard.querySelector(`.detail`).style = 'display:block';
    document.querySelectorAll('.cardCover').forEach(element => {
        element.style = "display:none;"
    });
}

function makeSmall(i){
    let currentPkmCard = document.getElementById(`pkmCard(${i})`);
    currentPkmCard.querySelector('.backBtn').style = 'display:none';
    currentPkmCard.classList.remove('large');
    currentPkmCard.querySelector('.detail').style = 'display:none';
    document.querySelectorAll('.cardCover').forEach(element => {
        element.style = "display:block;"
    });
}

window.onscroll = loadNext20Pkms;

function loadNext20Pkms() {
    if((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight){
        document.getElementById('loadingIcon').style = 'display: block';
        offset += 20;
        loadpkms();
    }
}