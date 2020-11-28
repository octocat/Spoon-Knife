const birth_day = 28; // prompt("Enter Your Birth Day");
const birth_month = 2; //prompt("Enter Your Birth Month");

if(((birth_month == 12) && (birth_day >= 23) && (birth_day <= 31)) || ((birth_month == 1) && (birth_day <= 20) && (birth_day > 0))){
    console.log("Oğlak Burcu")
}else if(((birth_month == 1) && (birth_day >= 21) && (birth_day <= 31)) || ((birth_month == 2) && (birth_day <= 19) && (birth_day > 0))){
    console.log("Kova Burcu")
}else if(((birth_month == 2) && (birth_day >= 20) && (birth_day <= 28)) || ((birth_month == 3) && (birth_day <= 20) && (birth_day > 0))){
    console.log("Balık Burcu")
}else if(((birth_month == 3) && (birth_day >= 21) && (birth_day <= 31)) || ((birth_month == 4) && (birth_day <= 20) && (birth_day > 0))){
    console.log("Koç Burcu")
}else if(((birth_month == 4) && (birth_day >= 21) && (birth_day <= 30)) || ((birth_month == 5) && (birth_day <= 20) && (birth_day > 0))){
    console.log("Boğa Burcu")
}else if(((birth_month == 5) && (birth_day >= 21) && (birth_day <= 31)) || ((birth_month == 6) && (birth_day <= 21) && (birth_day > 0))){
    console.log("İkizler Burcu")
}else if(((birth_month == 6) && (birth_day >= 22) && (birth_day <= 30)) || ((birth_month == 7) && (birth_day <= 23) && (birth_day > 0))){
    console.log("Yengeç Burcu")
}else if(((birth_month == 7) && (birth_day >= 24) && (birth_day <= 31)) || ((birth_month == 8) && (birth_day <= 23) && (birth_day > 0))){
    console.log("Aslan Burcu")
}else if(((birth_month == 8) && (birth_day >= 24) && (birth_day <= 31)) || ((birth_month == 9) && (birth_day <= 23) && (birth_day > 0))){
    console.log("Başak Burcu")
}else if(((birth_month == 9) && (birth_day >= 24) && (birth_day <= 30)) || ((birth_month == 10) && (birth_day <= 23) && (birth_day > 0))){
    console.log("Terazi Burcu")
}else if(((birth_month == 10) && (birth_day >= 24) && (birth_day <= 31)) || ((birth_month == 11) && (birth_day <= 23) && (birth_day > 0))){
    console.log("Akrep Burcu")
}else if (((birth_month == 11) && (birth_day >= 23) && (birth_day <= 30)) || ((birth_month == 12) && (birth_day <= 22) && (birth_day > 0))){
    console.log("Yay Burcu")
}else{
    console.log("You Entered The Wrong Date")
}
