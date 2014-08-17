module.exports = function(grunt) {
  grunt.initConfig({
    env: grunt.file.readJSON('grunt.env'),
    s3: {
      options: {
        key: '<%= env.AWS_ACCESS_KEY_ID %>',
        secret: '<%= env.AWS_SECRET_ACCESS_KEY %>',
        bucket: '<%= env.AWS_BUCKET %>',
        access: 'public-read',
        headers: {
          "Cache-Control": "max-age=630720000, public",
          "Expires": new Date(Date.now() + 630720000).toUTCString()
        },
      },
      dev: {
        upload: [
          {
            src: 'dist/**/*',
            dest: 'assets/',
            rel: 'dist/assets',
            options: { verify: true }
          }
        ]
      }
    },
    redis: {
      options: {
        manifestKey: 'releases',
        manifestSize: 10,
        host: '<%= env.REDIS.host %>',
        port: '<%= env.REDIS.port %>',
        connectionOptions: {
          auth_pass: '<%= env.REDIS.password %>'
        }
      },
      canary: {
        options: {
          prefix: '<%= gitinfo.local.branch.current.shortSHA %>:',
          currentDeployKey: '<%= gitinfo.local.branch.current.shortSHA %>',
        },
        files: {
          src: ["dist/index.html"]
        }
      },
      release: {
        options: {
          prefix: 'release:'
        },
        files: {
          src: ["dist/index.html"]
        }
      }
    },
    gittag: {
      options: {},

      // // Not doing this right now. If you decide to tag canary releases, you might end up double-tagging on official releases - check.
      // canary: {
      //   options: {}
      // },

      release: {
        options: {
          tag: 'release.<%= gitinfo.local.branch.current.shortSHA %>',
          message: 'Published for release. <%= gitinfo.local.branch.current.shortSHA %> || <%= gitinfo.local.branch.current.SHA %>',
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-gitinfo');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-redis-manifest');

  grunt.registerTask('release', ['gitinfo', 'gittag:release', 'redis:release']);
  grunt.registerTask('canary', ['gitinfo', 'redis:canary']);

  grunt.registerTask('publish-release', ['default', 'release']);

  return grunt.registerTask('default', ['gitinfo', 's3:dev', 'canary']);
};
