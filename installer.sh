#!/usr/bin/bash
pkg update
pkg install nodejs git
git clone https://github.com/cikaldev/node-bhagavad-gita.git
cd ./node-bhagavad-gita
npm install
npm start
