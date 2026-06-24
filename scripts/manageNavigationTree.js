function openModule(module) {
    var moduleSite = window.open('modules/modules.html', '_self');
    localStorage.setItem('currentModule', module);
}

function loadModule(module) {
    $('#' + module).load('modules/' + module.split('_')[1] + '.html');
}

function initSubtrees() {
    console.log('Loading navigation tree...');
    for (i = 1; i <= 4; i++) {
        loadModule('pc_module' + i);
        //loadModule('mobile_module' + i); //future update
    }
    console.log('Loaded navigation tree');
}
$(function () {
    if ('currentModule' in localStorage) {
        console.log(localStorage.getItem('currentModule'));
    }
    //updateTranslations(localStorage.getItem('lang'));
});

function unfoldNavigationTree(subtree) {
    let this_subtree_list = [];
    let another_subtree_list = [];
    moduleName = subtree.split('_')[0];
    moduleElements = document.querySelectorAll('[class^="' + moduleName + '_"]');
    switch (true) {
        case subtree.includes('module_subtree'):
            $('*').filter(function() {
                return /module_subtree/.test($(this).attr('class'));
            }).each(function() {
                if ($(this).attr('class').includes(moduleName)) {
                    this_subtree_list.push(this);
                } else {
                    another_subtree_list.push(this);
                }
            });
            $('*').filter(function() {
                return /unit_subtree/.test($(this).attr('class'));
            }).each(function() {
                another_subtree_list.push(this);
            });
            break;
        case subtree.includes('unit_subtree'):
            $('*').filter(function() {
                return /module_subtree/.test($(this).attr('class'));
            }).each(function() {
                if ($(this).attr('class').includes(moduleName)) {
                    this_subtree_list.push(this);
                } else if ($(this).attr('class') === subtree) {
                    this_subtree_list.push(this);
                } else {
                    another_subtree_list.push(this);
                }
            });
            $('*').filter(function() {
                return /unit_subtree/.test($(this).attr('class'));
            }).each(function() {
                if ($(this).attr('class') === subtree) {
                    this_subtree_list.push(this);
                } else {
                    another_subtree_list.push(this);
                }
            });
            break;
    }

    if (subtree.includes('module_subtree')) { //if the user has clicked module for the 2nd time => collapse
        if (this_subtree_list.every((tree) =>
            tree.style.display == 'inline')) {
                $('*').filter(function() {
                    return new RegExp(moduleName + '.*module_subtree').test($(this).attr('class'));
                }).each(function() {
                    this.style.display = 'none';
                });
                $('*').filter(function() {
                    return new RegExp(moduleName + '.*unit_subtree').test($(this).attr('class'));
                }).each(function() {
                    this.style.display = 'none';
                });
            return;
        }
    }
    this_subtree_list.forEach((tree) => {
        if (tree.style.display == 'inline' && tree.classList.value == 
            subtree) { //if the user has clicked a unit for the 2nd time => collapse
                tree.style.display = 'none';
        } else {
            tree.style.display = 'inline';
        }
    });
    another_subtree_list.forEach((subtree) =>
        subtree.style.display = 'none');
}
