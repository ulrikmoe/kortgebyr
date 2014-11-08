module.exports = function (grunt) {

   // Load Grunt tasks declared in the package.json file
   require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

   // Configure Grunt
   grunt.initConfig({

      // grunt-express will serve the files
      express: {
         all: {
            options: {
               port: 9000,
               hostname: "*",
               bases: ['_site'],
               livereload: true
            }
         }
      },

      less: {
         build: {
            options: {
               cleancss: true
            },
            files: [{
               expand: true,
               cwd: 'source/less/',
               src: ['*.less'],
               dest: '_site/css/',
               ext: '.css'
            }]
         }
      },

      uglify: {
         my_target: {

            options: {
               //compress: false,
               //mangle: false
            },
            files: [{
               expand: true,
               cwd: 'source/js/',
               src: '*.js',
               dest: '_site/js/'
            }]
         }
      },

      htmlmin: {
         dist: {
            options: {
               removeComments: true,
               collapseWhitespace: true,
               conservativeCollapse: true,
               preserveLineBreaks: false,
               removeScriptTypeAttributes: true,
               removeEmptyAttributes: true,
               removeEmptyElements: false // Fjernede #data :/
            },
            expand: true,
            cwd: 'source/',
            src: ['*.html', '**/*.html'],
            dest: '_site/'
         }
      },

      copy: {
         files: {
            expand: true,
            cwd: 'source/',
            src: ['img/**', 'favicon.ico'],
            dest: '_site/'
         }
      },

      // grunt-watch will monitor the projects files
      watch: {
         less: {
            files: ['source/less/*.less'],
            tasks: ['less:build']
         },
         scripts: {
            files: ['source/js/*.js'],
            tasks: ['uglify']
         },
         html: {
            files: ['source/*.html', 'source/**/*.html'],
            tasks: ['htmlmin']
         },
         images: {
            files: ['source/img/**'],
            tasks: ['copy']
         }
      },

      clean: {
         src: ['_site/']
      },

      open: {
         all: {
            path: 'http://localhost:<%= express.all.options.port%>'
         }
      }
   });

   // Creates the `server` task
   grunt.registerTask('dev', [
      'clean',
      'htmlmin',
      'less:build',
      'copy',
      'uglify',
      'express',
      'open',
      'watch'
   ]);
};
