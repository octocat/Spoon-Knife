let a = document.querySelector("div");

for(i=0;i<100;i++){
    for(j=0;j<i;j++){
        a.innerText+="*";
    }
    a.innerText+="\n";
}