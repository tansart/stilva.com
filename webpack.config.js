const webpack = require('webpack');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const LoadablePlugin = require('@loadable/webpack-plugin')

const path = require('path');

const ENV = process.env.NODE_ENV || 'development';
const hasCSSMaps = ENV !== 'production';

const devServerConfig = {
	host: '0.0.0.0',
	historyApiFallback: true,
	port: process.env.PORT || 8080,
	logLevel: 'debug'
};

module.exports = {
	mode: ENV,
	context: path.resolve(__dirname, "src"),

	entry: {
	  bundle: './index.js'
  },

	output: {
		path: path.resolve(__dirname, "dist"),
		publicPath: '/',
    chunkFilename: 'partials/[name].js',
		filename: 'bundle.js'
	},

	resolve: {
		extensions: ['.jsx', '.js', '.scss'],
		modules: [
			path.resolve(__dirname, "src/lib"),
			path.resolve(__dirname, "node_modules"),
			'node_modules'
		]
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				// exclude: path.resolve(__dirname, 'src'),
        include: [
          path.resolve(__dirname, 'node_modules', '@stilva'),
          path.resolve(__dirname, 'src')
        ],
				enforce: 'pre',
				use: 'source-map-loader'
			},
			{
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'node_modules', '@stilva', 'spring'),
          path.resolve(__dirname, 'src')
        ],
				// exclude: /node_modules/,
				use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [ENV === 'development' && require.resolve('react-refresh/babel')].filter(Boolean)
            }
          },
          {
            loader: 'linaria/loader',
            options: {
              preprocessor: 'none',
              sourceMap: process.env.NODE_ENV !== 'production',
            },
          }
        ]
      },
			{
				test: /\.(scss|css)$/,
				include: [
					path.resolve(__dirname, 'node_modules'),
					path.resolve(__dirname, 'src'),
					path.resolve(__dirname, '.linaria-cache'),
				],
				use: [
          {
            loader: process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV !== 'production',
            }
          },
					{
						loader: 'css-loader',
						options: {sourceMap: hasCSSMaps, importLoaders: 1, minimize: true}
					},
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: hasCSSMaps,
              config: {
                path: 'postcss.config.js'
              }
            }
          },
					{
						loader: 'sass-loader',
						options: {sourceMap: hasCSSMaps}
					}
				]
			}
		]
	},

	optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
	},

	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(ENV),
			'__DEV__': JSON.stringify(ENV !== 'production')
		}),
		new MiniCssExtractPlugin({
			filename: 'styles.css',
			allChunks: true,
			// disable: ENV !== 'production'
		}),
    new LoadablePlugin(),
		new HtmlWebpackPlugin({
			template: './index.ejs',
			templateParameters: {
				distPath: ENV === "production" ? "/dist" : null
			},
			minify: {collapseWhitespace: true}
		}),
    devOnly(new ReactRefreshWebpackPlugin()),
		prodOnly(
				new BundleAnalyzerPlugin({
					analyzerMode: "disabled",
					generateStatsFile: true,
					openAnalyzer: false,
					statsFilename: "./stats-fe.json"
				})
		)
	],

	stats: {colors: true},

	devtool: ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

	devServer: {
		host: '0.0.0.0',
		historyApiFallback: true,
		port: process.env.PORT || 8080,
		proxy: {
			'/assets': `http://${devServerConfig.host}:${devServerConfig.port}/dist`,
			'/images': `http://${devServerConfig.host}:${devServerConfig.port}/dist`,
			'/videos': `http://${devServerConfig.host}:${devServerConfig.port}/dist`
		}
	}
};

function PluginProxy() {
	this.apply = _ => {};
}

function devOnly(arr) {
	return ENV === "development" ? arr : new PluginProxy();
}

function prodOnly(arr) {
	return ENV === "production" ? arr : new PluginProxy();
}
