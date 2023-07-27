module.exports = function stripBOM (data) {
  if (data.charCodeAt(0) === 0xFEFF) {
    return data.slice(1)
  }

  return data
}
