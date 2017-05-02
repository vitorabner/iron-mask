const { test } = require('ava')
const ironMask = require('../src/iron-mask')

test('ironMask: using a string as regex', t => {
  const mask = ironMask.create({
    url: {
      paths: ['name'],
      pattern: 'Vitor Abner',
      replacer: 'Batman'
    }
  })

  const object = { name: 'Vitor Abner' }

  const maskedObject = mask(object)

  t.deepEqual(maskedObject, { name: 'Batman' })
})

test('ironMask: mask url using a replacer function', t => {
  const mask = ironMask.create({
    url: {
      paths: ['url', 'save.url'],
      pattern: /"?session"?[=|:]"?(\w{10})"?/g,
      replacer: str => `${str.substring(0, 13)}${'*'.repeat(5)}`
    }
  })

  const object = {
    url: '/game?session=0123456789',
    save: {
      url: '/save?session:0123456789'
    }
  }

  const maskedObject = mask(object)

  t.deepEqual(maskedObject, {
    url: '/game?session=01234*****',
    save: {
      url: '/save?session:01234*****'
    }
  })
})

test('ironMask: mask password with a regex', t => {
  const mask = ironMask.create({
    password: {
      paths: ['password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })

  const object = { password: 'Papyrus' }
  const maskedObject = mask(object)
  t.deepEqual(maskedObject, { password: '*' })
})

test('ironMask: mask password from an object without this property', t => {
  const mask = ironMask.create({
    password: {
      paths: ['password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })

  const object = { name: 'Pagar.me', library: 'Papyrus' }
  const maskedObject = mask(object)
  t.deepEqual(maskedObject, object)
})

test('ironMask: mask password value in differents paths', t => {
  const mask = ironMask.create({
    password: {
      paths: ['password', 'user.password', 'creditCard.password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })

  const object = {
    password: 'abc123',
    user: {
      password: '123abc'
    },
    creditCard: {
      password: '1a2b3c'
    }
  }

  const maskedObject = mask(object)

  t.deepEqual(maskedObject, {
    password: '*',
    user: {
      password: '*'
    },
    creditCard: {
      password: '*'
    }
  })
})

test('ironMask: mask multiples differents values', t => {
  const mask = ironMask.create({
    password: {
      paths: ['password'],
      pattern: /\w.*/g,
      replacer: '*'
    },
    url: {
      paths: ['url', 'dashboard.url'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })

  const object = {
    password: '123abc',
    url: 'https://www.pagarme.com.br',
    dashboard: {
      url: 'https://api.pagar.me/1/status'
    }
  }

  const maskedObject = mask(object)

  t.deepEqual(maskedObject, {
    password: '*',
    url: '*',
    dashboard: {
      url: '*'
    }
  })
})

test('ironMask: mask property with non-valid values', t => {
  const mask = ironMask.create({
    password: {
      paths: ['password', 'user.password', 'creditCard.password', 'debitCard', 'cvv', 'age'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })

  const object = {
    password: undefined,
    user: {
      password: null
    },
    creditCard: {
      password: {}
    },
    debitCard: 'undefined',
    cvv: 'null',
    age: 34
  }

  const maskedObject = mask(object)

  t.deepEqual(maskedObject, {
    password: undefined,
    user: {
      password: null
    },
    creditCard: {
      password: {}
    },
    debitCard: '*',
    cvv: '*',
    age: 34
  })
})
