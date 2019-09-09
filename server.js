var http = require('http');
var url = require("url");

/**
 * Settings
 */
var localIp = "127.0.0.1";
var port = 8080;

// The shell command to test, PAYLOAD_PARAM will be replaced by the input to the webserver.
var shellCommand = "echo \"param1\" \"PAYLOAD_PARAM\"";

// Array of regexes to ignore from the param
// Depending on the program your testing, these may mess with the command, for example leading dashes or double quotes.
var filterRegexes = [/\"/g, /^-/g];

// Some logging, say false if you don't want any.
var showSomeOutputInConsole = true;

/**
 * End settings
 */

var server = http.createServer(function (req, res) {

    if(showSomeOutputInConsole) {
        console.log("Incoming request " + req.url);
    }

    var urlObj = url.parse(req.url, true);

    if (urlObj['query']['param'] !== undefined) {
        const {exec} = require('child_process');

        param = urlObj['query']['param'];

        if (showSomeOutputInConsole) {
            console.log('Testing: ' + param);
        }

        for (var i = 0; i < filterRegexes.length; i++) {
            param = param.replace(filterRegexes[i], '');
        }

        if (showSomeOutputInConsole) {
            console.log('Filtered: ' + param);
        }

        var command = shellCommand.replace("PAYLOAD_PARAM", param);

        if (showSomeOutputInConsole) {
            console.log('Command: ' + command);
        }

        exec(command, (err, stdout, stderr) => {
            if (err) {
                // fail - return early
                return;
            }

            output = `Full command output: ${stdout}`;

            if (showSomeOutputInConsole) {
                console.log(output);
            }

            res.writeHead(200, {'Content-Type': 'text/html'});

            res.write('<html lang=""><body>\n');
            res.write('<h1>' + output + '<h1>\n');
            res.write('<form method="GET">\n<input type="text" placeholder="fill me up" name="param">\n<input type="submit">\n</form>\n');
            res.write('</body></html>');

            res.end();
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<html><body>\n');
        res.write('<form method="GET">\n<input type="text" placeholder="fill me up" name="param">\n<input type="submit">\n</form>\n');
        res.end();
    }
});

server.listen(port, localIp);
console.log('Server running at http://' + localIp + ':' + port + '/');
