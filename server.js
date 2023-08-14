const express = require('express');
const app = express();
//const path = (process.env.CUSTOM_STATICS_PATH || 'movies');
const path = require('path');
const fs = require('fs');


const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);

app.get('/movies', function (req, res, next) {
    res.status(200);
    //res.sendFile(`${__dirname}/movies/index.json`);
    const filePath = path.join(__dirname, 'movies', 'index.json');

    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading JSON file.');
            return;
        }
        
        const moviesdata = JSON.parse(data);
        const movies = [];

	moviesdata.forEach(entry => {
	    const moviesForDate = entry.movies;
	    movies.push(...moviesForDate);
	});
        
        console.log(movies);
        const tableRows = movies.map(movie => {
            return `
                <tr>
                    <td><img src=${movie.poster} height="50" width="50">${movie.title}</img></td>
                    <td>${movie.year}</td>
                    <td>${movie.genre}</td>
                    <td>${movie.director}</td>
                </tr>
            `;
        }).join('');
        
        const tableHtml = `
            <html>
            <head>
                <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                <h1>Movies List</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Released</th>
                            <th>Genre</th>
                            <th>Director</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        
        res.status(200).send(tableHtml);
    });
});


const port = (process.env.PORT || 3000);
app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});