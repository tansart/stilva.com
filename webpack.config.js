const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const nodeExternals = require('webpack-node-externals');

const autoprefixer = require('autoprefixer');

const path = require('path');

const ENV = process.env.NODE_ENV || 'development';
const CSS_MAPS = ENV!=='production';

const baseConfig = {
	mode: ENV,
	context: path.resolve(__dirname, "src"),

	resolve: {
		extensions: ['.jsx', '.js', '.scss'],
		modules: [
			path.resolve(__dirname, "src/lib"),
			path.resolve(__dirname, "node_modules"),
			'node_modules'
		],
		alias: {
		}
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: path.resolve(__dirname, 'src'),
				enforce: 'pre',
				use: 'source-map-loader'
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.(scss|css)$/,
				include: [
					path.resolve(__dirname, 'node_modules'),
					path.resolve(__dirname, 'src')
				],
				use: [
					process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: CSS_MAPS, importLoaders: 1, minimize: true }
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: CSS_MAPS,
							plugins: () => {
								autoprefixer({ browsers: [ 'last 2 versions' ] });
							}
						}
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: CSS_MAPS }
					}
				]
			}
		]
	},

	optimization: {
		minimizer: prodOnly([
			new UglifyJsPlugin({
				uglifyOptions: {
					output: {
						beautify: false,
						comments: false
					},
					compress: {
						unsafe_comps: true,
						properties: true,
						keep_fargs: false,
						pure_getters: true,
						collapse_vars: true,
						unsafe: true,
						warnings: false,
						sequences: true,
						dead_code: true,
						drop_debugger: true,
						comparisons: true,
						conditionals: true,
						evaluate: true,
						booleans: true,
						loops: true,
						unused: true,
						hoist_funs: true,
						if_return: true,
						join_vars: true,
						drop_console: true
					}
				}
			})
		])
	},

	plugins: [
		new webpack.NoEmitOnErrorsPlugin()
	],

	stats: { colors: true },

	devtool: ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

	devServer : {
		host: '0.0.0.0',
		historyApiFallback: true,
		port: process.env.PORT || 8080,
		// content: path.join(__dirname, 'dist')
	}
};

const backEnd = Object.assign({}, baseConfig, {
	entry: '../app.js',

	output: {
		path: path.resolve(__dirname, "dist"),
		publicPath: '/',
		filename: 'bundle.server.js'
	},

	target: "node",

	externals: [nodeExternals()]
});

[].unshift.apply(backEnd.plugins, prodOnly([
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(ENV),
		'__BE__': JSON.stringify(true),
		'__FE__': JSON.stringify(false)
	})
]));

backEnd.plugins = backEnd.plugins.concat(prodOnly([
	new BundleAnalyzerPlugin({
		analyzerMode: "disabled",
		generateStatsFile: true,
		openAnalyzer: false,
		statsFilename: "./stats-be.json"
	})
]));

const frontEnd = Object.assign({}, baseConfig, {
	entry: './index.js',

	output: {
		path: path.resolve(__dirname, "dist"),
		publicPath: '/',
		filename: 'bundle.js'
	}
});


[].unshift.apply(frontEnd.plugins, prodOnly([
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(ENV),
		'__BE__': JSON.stringify(false),
		'__FE__': JSON.stringify(true)
	})
]));

[].unshift.apply(frontEnd.plugins, [
	new MiniCssExtractPlugin({
		filename: 'styles.css',
		allChunks: true,
		// disable: ENV !== 'production'
	}),
	new HtmlWebpackPlugin({
		template: './index.ejs',
		templateParameters: {
			distPath: ENV === "production" ? "/dist": null
		},
		minify: { collapseWhitespace: true }
	})
]);

frontEnd.plugins = frontEnd.plugins.concat(prodOnly([
	new BundleAnalyzerPlugin({
		analyzerMode: "disabled",
		generateStatsFile: true,
		openAnalyzer: false,
		statsFilename: "./stats-fe.json"
	})
]));

module.exports = [
	frontEnd
].concat(prodOnly(backEnd));

function prodOnly(arr) {
	return ENV === "production" ? arr: [];
}
