#!/usr/bin/bash
pkg update
pkg install nodejs git
gh repo clone cikaldev/node-bhagavad-gita
cd ./node-bhagavad-gita
npm install
npm start
