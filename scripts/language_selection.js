function updateTranslations(lang) {
    console.log('Updating translations...');
    $('.lang').each(function () {
        if ($(this).is('input') || $(this).is('select')) {
            $(this).val(languages[lang][$(this).attr('key')]).change();
        } else {
            $(this).text(languages[lang][$(this).attr('key')]);
            //console.log($(this))
        }
    });
    console.log('Updated translations');
}

$(function () {
    if (localStorage.getItem('lang') == null) {
        localStorage.setItem('lang', 'de');
    }
    var lang = localStorage.getItem('lang');
    console.log('Detected language code: ' + lang);
    $('.translate').each(function () {
        $(this).val(localStorage.getItem('lang')).change();
    });
    updateTranslations(lang);

    $('.translate').bind('change', changeHandler);

    function changeHandler() {
        var lang = $(this).val();
        localStorage.setItem('lang', lang);
        console.log("localStorage-value for key 'lang' updated to '" + lang + "'");
        updateTranslations(lang);

        $('.translate').each(function () {
            $('.translate').unbind('change');
            $(this).val(lang);
        });
        $('.translate').bind('change', changeHandler);
    }
    /**
    $('.translate').change(function () {
        var lang = $(this).val();
        localStorage.setItem('lang', lang);
        console.log("localStorage-value for key 'lang' updated to '" + lang + "'");

        updateTranslations(lang);
        $('.translate').val(lang);
    });*/
});