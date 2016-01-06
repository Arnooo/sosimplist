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
                app: 'google-chrome'
            },
            test : {
                path: 'http://localhost:9001/test/coverage/report-html/',
                app: 'google-chrome'
            }
        },
        watch: {
            scripts: {
                files: ['src/*.js'],
                tasks: ['build']
            },
        },
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
        "regex-replace": {
            build: {
                src: ['dist/<%= pkg.name %>.js'],
                actions: [
                    {
                        name: 'DEBUG',
                        search: '(^|\\s)DEBUG',
                        replace: '//DEBUG',
                        flags: 'g'
                    }
                ]
            },
            dev: {
                src: ['dist/<%= pkg.name %>.js'],
                actions: [
                {
                    name: 'DEBUG',
                     search: '(^|\\s)//DEBUG',
                               replace: 'DEBUG',
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
    grunt.registerTask('build-dev', ['concat', 'regex-replace:dev', 'uglify']);
    grunt.registerTask('dev', ['build-dev', 'karma:dev', 'connect:server', 'open:server', 'open:test', 'watch']);
    
    // task(s). PROD
    grunt.registerTask('build-prod', ['concat', 'regex-replace:build', 'uglify']);
    grunt.registerTask('semaphore', ['build-prod', 'karma:prod', 'coveralls']);
    grunt.registerTask('prod', ['build-prod', 'karma:prod']);
    
    // task(s). DEFAULT
    grunt.registerTask('default', ['prod']);
    
};