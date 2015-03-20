module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dist: {
                options: {
                    sassDir: 'src/sass',
                    cssDir: 'styles',
                    environment: 'production',
                    outputStyle: 'expanded'
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'dist/docuim.zip',
                    mode: 'zip',
                    store: true
                },
                files: [
                    { src: ['res/*'], dest: '/' }, // includes files in path
                    { src: ['styles/*'], dest: '/' }, // includes files in path and its subdirs
                    { src: ['scripts/*'], dest: '/' },
                    { src: ['config.xml'], dest: '/' },
                    { src: ['index.html'], dest: '/' },
                    { src: ['widget.info'], dest: '/' }
                ]
            }
        }
    });

    // compass
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Default task(s).
    grunt.registerTask('default', ['compass']);
};