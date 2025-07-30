const getPoemBtn = document.getElementById('get-poem')
const poemEl = document.getElementById('poem')
const poemURL = 'https://poetrydb.org/random,linecount/1;12/author,title,lines.json'

const getJSON = url => fetch(url).then(res => res.json())

const pipe = (...fns) => firstArg => fns.reduce((returnValue, fn) => fn(returnValue), firstArg)

const makeTag = tag => str => `<${tag}>${str}</${tag}>`

// complete this function
const makePoemHTML = (poemData) => {
  
    const poem = poemData[0];
    const { title, author, lines } = poem; 

    const makeH2 = makeTag('h2');
    const makeH3 = makeTag('h3');
    const makeEm = makeTag('em');
    const makeP = makeTag('p');

    const formatStanzaLines = (stanzaLines) => {
        const filteredLines = stanzaLines.filter(line => line !== '');
        if (filteredLines.length === 0) {
            return '';
        }
        return filteredLines.map((line, index) =>
            index === filteredLines.length - 1 ? line : `${line}<br>`
        ).join('');
    };

    const titleHTML = makeH2(title);

    const authorHTML = makeH3(makeEm(`by ${author}`));

    const stanzasArray = [];
    let currentStanzaLines = [];

    lines.forEach((line, index) => {
        if (line === "") {
            if (currentStanzaLines.length > 0) {
                stanzasArray.push(currentStanzaLines);
            }
            currentStanzaLines = [];
        } else {
            currentStanzaLines.push(line);
        }

        if (index === lines.length - 1 && currentStanzaLines.length > 0) {
            stanzasArray.push(currentStanzaLines);
        }
    });

    const makeStanzaParagraph = pipe(
        formatStanzaLines,
        makeP
    );

    const stanzasHTML = stanzasArray.map(makeStanzaParagraph).join('');

    return `${titleHTML}${authorHTML}${stanzasHTML}`;
};

// attach a click event to #get-poem
getPoemBtn.onclick = async function() {
  poemEl.innerHTML = '';
  // renders the HTML string returned by makePoemHTML to #poem
  poemEl.innerHTML = makePoemHTML(await getJSON(poemURL));
};
