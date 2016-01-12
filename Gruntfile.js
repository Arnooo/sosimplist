var OS = process.platform;

module.exports = function(grunt) {
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: '.'
                }
            }
        },
        open : {
            server : {
                path: 'http://localhost:9001',
                app: OS==='linux'?'google-chrome':'Google Chrome'
            },
            coverage : {
                path: 'http://localhost:9001/test/coverage/report-html/',
                app: OS==='linux'?'google-chrome':'Google Chrome'
            }
        },
        watch: {
            dev: {
                files: ['src/*.js', 'test/**/*.js'],
                tasks: ['build-dev']
            }
        },
        concat: {
            dev: {
                src: ['src/*.js'],
                dest: 'dist/<%= pkg.name %>.js',
            },
            prod: {
                src: ['src/*.js'],
                dest: 'dist/<%= pkg.name %>.js',
            }
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
        "regex-replace": {
            prod: {
                src: ['dist/<%= pkg.name %>.js'],
                actions: [
                    {
                        name: 'DEBUG',
                        search: '(^|\\s)DEBUG',
                        replace: '//DEBUG',
                        flags: 'g'
                    },
                    {
                        name: 'Lib <%= pkg.name %>',
                        search: '<%= pkg.name %>.js',
                        replace: '<%= pkg.name %>.min.js',
                        flags: 'g'
                    }
                ]
            },
            dev: {
                src: ['dist/<%= pkg.name %>.js', 'index.html'],
                actions: [
                    {
                        name: 'DEBUG',
                        search: '(^|\\s)//DEBUG',
                        replace: 'DEBUG',
                        flags: 'g'
                    },
                    {
                        name: 'Lib <%= pkg.name %>',
                        search: '<%= pkg.name %>.min.js',
                        replace: '<%= pkg.name %>.js',
                        flags: 'g'
                    }
                ]
            }
        },
        karma: {
            options: {
                port: 9999,
                browsers: ['Chrome'],
                files: [
                'bower_components/jquery/dist/jquery.min.js',
                'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
                'bower_components/jquery-simulate/jquery.simulate.js',
                'lib/*.js', 
                'src/*.js', 
                'test/spec/*.js'],
                reporters: ['progress', 'html', 'coverage'],
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
                frameworks: ['jasmine']
            },
            dev: {
                background: true,
                singleRun: false
            },
            test: {
                singleRun: false,
            },
            prod: {
                singleRun: true
            }
        },
        coveralls: {            
            options: {
                coverageDir: 'test/coverage/'
            }
        }
    });
    
    //build
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-regex-replace');
    
    //serve, open and watch
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    //test and test coverage
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-karma-coveralls');
    
    // task(s). DEV
    grunt.registerTask('build-dev', ['concat:dev', 'regex-replace:dev']);
    grunt.registerTask('dev', ['build-dev', 'connect:server', 'open:server', 'open:coverage', 'watch:dev']);
    
    // task(s). TEST
    grunt.registerTask('test', ['build-dev', 'karma:test']);

    // task(s). PROD
    grunt.registerTask('build-prod', ['concat:prod', 'regex-replace:prod', 'uglify']);
    grunt.registerTask('semaphore', ['build-prod', 'karma:prod', 'coveralls']);
    grunt.registerTask('prod', ['build-prod', 'karma:prod']);
    
    // task(s). DEFAULT
    grunt.registerTask('default', ['prod']);
    
};