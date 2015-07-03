module.exports = function (grunt) {

    grunt.initConfig({
        csslint: {
            all: {
                src: [
                    '_site/assets/css/style.css'
                ],
                options: {
                    csslintrc: '.csslintrc',
                    import: 2
                }
            }
        },
        eslint: {
            all: ['assets/js/main.js']
        },
        htmllint: {
            all: ['_site/*.html', '!_site/googled2961d1b909d4f84.html']
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('test', ['csslint', 'eslint', 'htmllint']);
};
