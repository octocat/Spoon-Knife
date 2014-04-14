/**
 * Created by Melanie on 3/12/14.
 */

var preferredName = function (fName, lName) {
    var isFirstNameNotDefined = ((typeof fName === 'undefined') || (fName === ''));
    var isLastNameNotDefined = ((typeof lName === 'undefined') || (lName === ''));

/*
    result = ((isFirstNameNotDefined && isLastNameNotDefined) || (!isFirstNameNotDefined && !isLastNameNotDefined)) ?  false : true;

    if (result && !isLastNameNotDefined) {
        return lName;
    }
    else if (result && !isFirstNameNotDefined) {
        return fName;
    } else {
        return result;
    }
*/

    if ((isFirstNameNotDefined && isLastNameNotDefined) || (!isFirstNameNotDefined && !isLastNameNotDefined)) {
        return false;
    } else if (isFirstNameNotDefined && !isLastNameNotDefined) {
        return lName;
    } else if (!isFirstNameNotDefined && isLastNameNotDefined) {
        return fName;
    }

};

var firstName, lastName;
var result;
console.log("First call: Expected value - false");
result = preferredName(firstName, lastName);
console.log(result);

firstName = "Hank";

console.log("Second call: Expected value - Hank");
result = preferredName(firstName, lastName);
console.log(result);


lastName = "Yates";
console.log("Third call: Expected value - false");
result = preferredName(firstName, lastName);
console.log(result);


firstName = '';

console.log("Last call: Expected value - Yates");
result = preferredName(firstName, lastName);
console.log(result);

