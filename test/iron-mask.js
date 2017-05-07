const { test } = require('ava')
const ironMask = require('../src/iron-mask')

test('using a string as regex', t => {
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

test('mask url using a replacer function', t => {
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

test('mask password with a regex', t => {
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

test('mask password from an object without this property', t => {
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

test('mask password value in differents paths', t => {
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

test('mask multiples differents values', t => {
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

test('mask property with non-valid values', t => {
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

test('try to mask a nonexistent property with a regex', t => {
  const mask = ironMask.create({
    password: {
      paths: ['body.api_key.test'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })

  const object = { body: 'Cannot Post' }
  const maskedObject = mask(object)

  t.deepEqual(maskedObject, object)
})

test('try to mask an empty object', t => {
  const mask = ironMask.create({
    password: {
      paths: ['body.api_key.test'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })

  const object = 'object'
  const maskedObject = mask(object)

  t.deepEqual(maskedObject, object)
})

test('try to mask a string', t => {
  const mask = ironMask.create({
    password: {
      paths: ['body.api_key.test'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })

  const string = 'Cannot Post'
  const maskedObject = mask(string)

  t.deepEqual(maskedObject, string)
})
