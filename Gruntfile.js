module.exports = function (grunt) {

    grunt.initConfig({
        eslint: {
            target: ['assets/js/main.js']
        },
        htmllint: {
            all: ['_site/*.html', '!_site/googled2961d1b909d4f84.html']
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('test', ['eslint', 'htmllint']);
};
