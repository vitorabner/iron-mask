const R = require('ramda')

const buildMaskStep = object => ({ path, pattern, replacer }) => {
  if (R.isEmpty(object)) return {}
  const splitedPath = R.split('.', path)
  let value = R.path(splitedPath, object)
  if (!R.isNil(value) && R.is(String, value)) value = value.replace(pattern, replacer)
  return { path: splitedPath, value }
}

const applyMaskSteps = (maskSteps, object) => (
  maskSteps.reduce((object, { path, value }) => R.set(R.lensPath(path), value, object), object)
)

const maskObject = regexList => json => {
  if (!R.is(Object, json)) return json
  const maskSteps = regexList.map(regex => buildMaskStep(R.pick(regex.root, json))(regex))
  const filteredMaskSteps = maskSteps.filter(step => !R.isEmpty(step) && !R.isNil(step.value))
  return applyMaskSteps(filteredMaskSteps, json)
}

const buildRegexList = sensitiveList => sensitiveList.reduce((regexList, sensitive) => {
  const { paths, pattern, replacer } = R.last(sensitive)
  const regex = paths.map(path => ({ root: R.split('.', path), path, pattern, replacer }))
  return R.concat(regexList, regex)
}, [])

const ironMask = sensitive => (
  R.pipe(R.toPairs, buildRegexList, maskObject)(sensitive)
)

module.exports = { create: ironMask }
