function FindSign(first, second, third) {
            var first = parseInt(first);
            var second = parseInt(second);
            var third = parseInt(third);
            var firstSign = first > 0;
            var secondSign = second > 0;
            var thirdSign = third > 0;
            if (firstSign ^ secondSign ^ thirdSign) {
                console.log("The sign will be + ");
            }
            else {
                console.log("The sign will be - ");
            }
        }
        FindSign(1, 3, 4);