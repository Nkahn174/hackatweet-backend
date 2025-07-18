function isAlphaNumeric(str) {
  // Retourne true si la chaîne ne contient QUE lettres et chiffres
  return /^[a-zA-Z0-9]+$/.test(str);
}

function checkHashtagParam(param){
    if(!typeof param === String || param.length > 26 || param === '' || param.slice(0,1) !== '#' || !isAlphaNumeric(param.slice(1) )){
        console.log('hashtag non-valide')
        return
    } else {
        return param
    }
}


module.exports = {checkHashtagParam}