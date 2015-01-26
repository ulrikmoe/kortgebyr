module.exports = function (grunt) {

   // Load Grunt tasks declared in the package.json file
   require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
   var mozjpeg = require('imagemin-mozjpeg');


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
         dev: {
            options: {
               cleancss: false
            },
            files: [{
               expand: true,
               cwd: 'src/less/',
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
               cwd: 'src/js/',
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
            cwd: 'src/',
            src: ['*.html', '**/*.html'],
            dest: '_site/'
         }
      },

      copy: {
         files: {
            expand: true,
            cwd: 'src/',
            src: ['img/**', 'favicon.ico'],
            dest: '_site/'
         }
      },

      imagemin: {            
         live: {
            options: { 
               optimizationLevel: 4,
               svgoPlugins: [{ removeUselessStrokeAndFill: false }],
               use: [mozjpeg()]
            },
            files: [{
               expand: true,
               cwd: 'src/img/',
               src: ['**/*.{png,jpg,gif,svg}'],
               dest: 'src/img/'
            }]
         }
      },

      // grunt-watch will monitor the projects files
      watch: {
         less: {
            files: ['src/less/*.less'],
            tasks: ['less:dev']
         },
         scripts: {
            files: ['src/js/*.js'],
            tasks: ['uglify']
         },
         html: {
            files: ['src/*.html', 'source/**/*.html'],
            tasks: ['htmlmin']
         },
         images: {
            files: ['src/img/**'],
            tasks: ['copy']
         }
      },

      clean: { src: ['_site/'] },

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
      'less:dev',
      'copy',
      'uglify',
      'express',
      'open',
      'watch'
   ]);

   // Creates the `server` task
   grunt.registerTask('optimize', [
      'imagemin:live'
   ]);


};
