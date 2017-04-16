[![Build Status](https://img.shields.io/travis/vitorabner/iron-mask/master.svg?style=flat)](https://travis-ci.org/vitorabner/iron-mask)

![IronMask Logo](http://ec2-52-67-128-55.sa-east-1.compute.amazonaws.com/assets/textures/iron-mask-texture.png)

> A flexible way to mask sensitive data

## Install

```
$ npm install --save iron-mask
```
## Usage

```js
const ironMask = require('iron-mask')

const mask = ironMask.create({
  password: {
    paths: ['password', 'creditCard.password'],
    pattern: /\w.*/g,
    replacer: '*'
  },
  cvv: {
    paths: ['creditCard.cvv'],
    pattern: /[0-9]{3}/,
    replacer: cvv => `${cvv.substring(0,1)}**`
  },
  name: {
    paths: ['name'],
    pattern: 'Vitor Abner',
    replacer: 'Batman'
  }
})

const bankAccount = {
  password: '123456789',
  creditCard: {
    password: '987654321',
    cvv: '123'
  },
  name: 'Vitor Abner'
}

const maskedBankAccount = mask(bankAccount)

//  Output:
//
//  maskedBankAccount = {
//    password: '*',
//    creditCard: {
//      password: '*',
//      cvv: 1**
//    },
//    name: 'Batman'
//  }
```

## License

MIT © [Vitor Abner](https://github.com/vitorabner/)
