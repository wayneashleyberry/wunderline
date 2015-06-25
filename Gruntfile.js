module.exports = function (grunt) {

    grunt.initConfig({
        eslint: {
            target: ['assets/js/main.js']
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('test', ['eslint']);
};
