let file = document.getElementById('file');

let fileName = ''

const reader = new FileReader();

file.onchange = (e) => {
    fileName = e.target.files[0].name.split('.')[0];
    reader.readAsText(e.target.files[0]);
}

reader.onload = () => {
    download(fileName, convert(reader.result));
}

function convert(file) {
    file = file.split("\r\n\r\n").filter(x => x !== '')

    games = []

    res = {}

    for (let i = 0; i < file.length; i++) {
        if (i%2 == 1) {
            games.push(file[i].replace('\r\n', ' ').split(' ').filter(x => x !== ''))
        }
    }

    for (let game = 0; game < games.length; game++) {
        let pos = res

        for (let m = 0; m < games[game].length; m++) {
            const move = games[game][m];

            if (move in pos){
                pos[move][0][0]++
                if (games[game][games[game].length - 1] == '1-0'){
                    pos[move][0][1]++
                } else if (games[game][games[game].length - 1] == '0-1'){
                    pos[move][0][3]++
                } else {
                    pos[move][0][2]++
                }
                pos = pos[move][1]
            } else {
                pos[move] = [[1, 0, 0, 0], {}]
                if (games[game][games[game].length - 1] == '1-0'){
                    pos[move][0][1]++
                } else if (games[game][games[game].length - 1] == '0-1'){
                    pos[move][0][3]++
                } else {
                    pos[move][0][2]++
                }
                pos = pos[move][1]
            }
        }
    }

    return JSON.stringify(res)
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename+'.jtp');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}