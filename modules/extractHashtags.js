function extractHashtags(string) {
  return string.match(/#[^\s#]+/g) || [];
}


module.exports = { extractHashtags };
