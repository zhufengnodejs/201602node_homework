function transfer(char){
    var charatuni=char.charCodeAt();
    var charat16=charatuni.toString(2);
    var char=[charat16.substr(0,3),charat16.substr(3,6),charat16.substr(9,6)];
    var newchar="11100"+char[0]+"10"+char[1]+"10"+char[2];
    var finalchar=parseInt(newchar,2).toString(16)
    console.log(finalchar);
    return finalchar
}
transfer("好")