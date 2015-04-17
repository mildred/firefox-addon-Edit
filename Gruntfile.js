module.exports = function(grunt) {
  'use strict';
  require('matchdep').filterDev('grunt-!(cli)').forEach(grunt.loadNpmTasks);
  grunt.initConfig({
    shell: {
      xpi: {
        command: [
          'cfx xpi',
          'wget --post-file=edit.xpi http://localhost:8888/ || true>/dev/null'
        ].join('&&')
      }
    },
    watch: {
      xpi: {
        files: ['./**'],
        tasks: ['shell:xpi']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.registerTask('default', ['watch']);
};