# node-bhagavad-gita

If NodeJS has already installed in your Termux, please follow below guide :

* clone this repo
* execute `npm install`
* run the script `npm start`
* see the result inside `{cwd}/dist/*.json`

Otherwise, we need to setup your Termux before do anything from this repo. Please copy this line and execute inside your Termux (install pkg from file) make sure you already have cURL installed :

```bash
curl -k https://raw.githubusercontent.com/cikaldev/node-bhagavad-gita/main/installer.sh | bash
```

Or if you looking for a dirty way, here is for you (type the command yourself) :

```bash
pkg update
pkg install nodejs git
git clone cikaldev/node-bhagavad-gita
cd node-bhagavad-gita
npm install
npm start
```
