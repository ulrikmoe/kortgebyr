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
          debug: true,
          hostname: "0.0.0.0",
          bases: ['src'],
          livereload: true
        }
      }
    },

    less: {
      compile: {
        options: {
          compress: false
        },
        files: {
          'src/css/global.css': 'src/css/global.less'
        }
      }
    },

    // grunt-watch will monitor the projects files
    watch: {

      less: {
        files: ['src/css/*.less'],
        tasks: ['less:compile']
      },
      scripts: {
        files: ['src/js/*.js']
      },
      html: {
        files: ['src/index.html']
      }
    },

    open: {
      all: {
        path: 'http://localhost:<%= express.all.options.port%>'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

  // Creates the `server` task
  grunt.registerTask('server', [
    'express',
    'open',
    'less'
  ]);
};
