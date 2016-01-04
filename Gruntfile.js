module.exports = function(grunt) {
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: ['src/itemsimple.js', 'src/list.js', 'src/sosimplist.js'],
                dest: 'dist/sosimplist.js',
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        karma: {
            unit: {
                options: {
                    browsers: ['Chrome'],
                    files: [
                     'bower_components/jquery/dist/jquery.min.js',
                     'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
                     'bower_components/jquery-simulate/jquery.simulate.js',
                     'src/*.js', 
                     'test/spec/*.js'],
                     reporters: ['progress', 'coverage'],
                     preprocessors: {
                        'src/*.js': ['coverage']
                     },
                     coverageReporter: {
                        dir : 'test/coverage/',
                        reporters: [
                            { type: 'html', subdir: 'report-html' },
                            { type: 'lcov', subdir: 'report-lcov' },
                        ]
                     },
                     frameworks: ['jasmine'],
                     singleRun: true
                }
            }
        },
        coveralls: {            
            options: {
                coverageDir: 'test/coverage/'
            }
        },
        serve: {
            options: {
                port: 8000
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-karma-coveralls');
    grunt.loadNpmTasks('grunt-serve');
    
    // task(s).
    grunt.registerTask('dev', ['serve']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('default', ['concat', 'uglify']);
    
};