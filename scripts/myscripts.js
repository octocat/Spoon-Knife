/**
 * Created by 1 on 1.7.2015 ã..
 */

contentManager = function () {
    var contentManager = {};

    Object.defineProperty(contentManager, 'AddContentInElementByTag', {
        value: function (tag, content) {
            var tagToChange = document.getElementsByTagName(tag);
            tagToChange[0].innerHTML += content + '</br>';
        },
        enumerable: true
    })
    Object.defineProperty(contentManager, 'AddContentInElementById', {
        value: function (id, content) {
            var idToChange = document.getElementById(id);
            idToChange.innerHTML += content + '</br>';
            console.log(content);
        },
        enumerable: true
    })

    return contentManager;
}();

contentManager.AddContentInElementByTag('p', 'Added some more text using javascript using tag');
contentManager.AddContentInElementById('testArea', 'Added some more text using javascript using id');



