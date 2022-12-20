
let username = prompt("What is your gitgub username?");
if (username) {
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    fetch(apiUrl)
    .then((response) => {
        if (response.ok) {
            return response.json();
        }  
    })
    .then((data) => {
        languagePromises = [];
        for (let i in data) {
            let repo = data[i];
            if (!repo['fork'] && repo['language']) {
                let langs = repo['languages_url'];
                languagePromises.push(fetch(langs))
            }
        }
        Promise.all(languagePromises)
        .then((responses) => { 
            let languages = [];
            for (let r of responses) {
                if (r.ok) languages.push(r.json())
            }
            Promise.all(languages)
            .then((resolved) => { 
                let languageTotals = {};
                for (langData of resolved) {
                    for (lang in langData) {
                        if (!languageTotals[lang]) {
                            languageTotals[lang] = 0
                        }
                        languageTotals[lang] += (langData[lang]); 
                    }
                }
                let sum = 0;
                for (let l in languageTotals) { sum += languageTotals[l] }
                if (sum) document.write('Github language usage<br>----------------------------<br>');
                for (let l in languageTotals) {
                    let p = (languageTotals[l] / sum * 100).toFixed(0) + '%';
                    document.write(l,' ', p, '<br>');
                }
            });
        });
    })
    .catch((e) => {
        console.log(e);
    });
}