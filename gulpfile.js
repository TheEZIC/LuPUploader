const
	gulp = require('gulp'),
	sass = require('gulp-sass')(require('sass')),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	ts = require('gulp-typescript')
	pump = require('pump')
	gulpAddJSON = require('gulp-add-json-file');

gulp.task("ts-content", () => {
	const tsConfig = ts.createProject("tsconfig.json",);

	return gulp.src("./scripts/**/*.ts")
		.pipe(tsConfig())
		.pipe(gulp.dest("./temp"));
})

gulp.task("scripts-content", () => {
	return browserify('./temp/content/content.js')
		.bundle()
		.pipe(source('./content.js'))
		.pipe(gulp.dest('./dist'));
})

gulp.task("ts-popup", () => {
	const tsConfig = ts.createProject("tsconfig.json",);

	return gulp.src("./scripts/**/*.ts")
		.pipe(tsConfig())
		.pipe(gulp.dest("./temp"));
})

gulp.task("scripts-popup", () => {
	return browserify('./temp/popup/popup.js')
		.bundle()
		.pipe(source('./popup.js'))
		.pipe(gulp.dest('./dist'));
})

gulp.task("ts-background", () => {
	const tsConfig = ts.createProject("tsconfig.json",);

	return gulp.src("./scripts/**/*.ts")
		.pipe(tsConfig())
		.pipe(gulp.dest("./temp"));
})

gulp.task("scripts-background", () => {
	return browserify('./temp/background/background.js')
		.bundle()
		.pipe(source('./background.js'))
		.pipe(gulp.dest('./dist'));
})

gulp.task("styles", () => {
	return gulp.src('./style/style.scss')
		.pipe(sass({
			includePaths: ['node_modules', 'assets'],
		}).on('error', sass.logError))
		.pipe(gulp.dest('./dist'));
})

gulp.task("copyAssets", done => {
	gulp.src('./assets/**/*').pipe(gulp.dest('./dist/assets'));
	done();
});

gulp.task("copyIcons", done => {
	gulp.src('./icons/*').pipe(gulp.dest('./dist/icons'));
	done();
});

gulp.task("copyHtml", done => {
	gulp.src('./popup.html').pipe(gulp.dest('./dist'));
	done();
});

gulp.task("copyManifest", done => {
	gulp.src('./manifest.json').pipe(gulp.dest('./dist'));
	done();
});

gulp.task("obfuscate", done => {
	require("./obfuscator");
	done();
})

const defaultScripts = ["copyHtml", "copyAssets", "copyIcons", "copyManifest"];

gulp.task("watch", () => {
	gulp.watch('./scripts/**/*.ts', gulp.series([...defaultScripts, "ts-content", "scripts-content"]));
	gulp.watch('./scripts/**/*.ts', gulp.series([...defaultScripts, "ts-popup", "scripts-popup"]));
	gulp.watch('./scripts/**/*.ts', gulp.series([...defaultScripts, "ts-background", "scripts-background"]));
	gulp.watch('./style/**/*.scss', gulp.parallel(["styles"]));
})

exports.build = gulp.series([
	...defaultScripts,
	gulp.parallel(
		gulp.series(["ts-content", "scripts-content"]),
		gulp.series(["ts-popup", "scripts-popup"]),
		gulp.series(["ts-background", "scripts-background"]),
		"styles",
	),
]);

exports.default = () => build("Pro");
