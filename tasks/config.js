var config = {
    src: {
        styles: ['src/client/styles/*.less'],
        scripts: ['src/client/scripts/**/*.ts', 'typings/**/*/d.ts'],
        images: 'src/client/img/**/*.+(png|svg|gif|jpg|ico)',
        fonts: 'src/client/fonts/**/*.+(otf|eot|svg|ttf|woff|woff2)',
        bower: 'bower_components',
        bootstrapAdvFiles: ['src/client/styles/bootstrap/variables.less'],
        server:['src/**/*.ts', 'typings/**/*/d.ts'],
        views:'src/**/*.jade',
        libraries: 'libraries'
    },
    dest: {
        public: 'bin/public',
        assets: 'bin/public/assets',
        lib: 'bin/public/assets/lib',
        bin: 'bin'
    },

    isProduction: process.env.NODE_ENV === 'production',

    pluginsOptions: {
        autoprefix: {
            remove: true,
            browsers: ['last 5 versions']
        },
        cleancss: {
            advanced: true,
            aggressiveMerging: true
        }
    }
};

module.exports = config;
