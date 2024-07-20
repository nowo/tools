function copy_text_button(copyElement, cssElement) {
    console.log(copyElement);
    console.log(cssElement);
    copyElement.zclip({
        // path: '/static/api/CSSmatic/js/ZeroClipboard.swf',
        copy: function () {
            var text = cssElement.text();
            console.log(text);
            text = text.replace(/;/g, ';\n').replace(/\n$/, '');
            return text;
        },
        afterCopy: function () {
            console.log(1111);
            copyElement.addClass('in');
        }
    });
}
