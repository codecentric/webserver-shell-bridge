# Webserver Shell Bridge
Forward a parameter sent to a webserver to a local shell.
For the webserver we use NodeJS.
In there we define our shell command.

The purpose is to enable automatic tools which only work on urls to forward their input to a shell.
Example usage is running `sqlmap` against (legacy) shell tools.

# Install / usage
- Clone or download
- Set parameters in `server.js`.
    - `shellCommand` should be the shell command to test, `PAYLOAD_PARAM` will be substituted by the param sent to the server.
    - `filterRegexes` should contain input not accepted by your shell command, for example if cannot handle leading dashes or double quotes.
- `nodejs server.js`
- Test your webserver, there's a form with param `param` or you can access it directly by using `http://localhost:8080/?param=hello`. Output will be echo'd on the page for tool parsing.