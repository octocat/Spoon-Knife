let a = document.querySelector("div");

for(i=0;i<10;i++){
    for(j=0;j<i;j++){
        a.innerText+="*";
    }
    a.innerText+="\n";
}